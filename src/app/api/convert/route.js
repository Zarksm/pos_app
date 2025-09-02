import { NextResponse } from "next/server";
import { writeFile, readFile } from "fs/promises";
import path from "path";
import os from "os";
import ExcelJS from "exceljs";

export async function POST(req) {
  try {
    const formData = await req.formData();
    const file = formData.get("file");
    if (!file) return NextResponse.json({ error: "No file uploaded" }, { status: 400 });

    // ===== Paths =====
    const tempDir = os.tmpdir();
    const inputPath = path.join(tempDir, `input-${Date.now()}.csv`);
    const outputPath = path.join(tempDir, `output-${Date.now()}.xlsx`);
    await writeFile(inputPath, Buffer.from(await file.arrayBuffer()));

    // ===== Load CSV =====
    const workbook = new ExcelJS.Workbook();
    await workbook.csv.readFile(inputPath);
    const worksheet = workbook.worksheets[0];

    // ===== Utility Functions =====
    const styleCell = (cell) => {
      cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFF00' } };
      cell.alignment = { horizontal: 'center', vertical: 'middle' };
      cell.font = { bold: true };
      cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
    };

    const styleRowBorder = (row) => {
      row.eachCell((cell) => {
        cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
      });
    };

    // ===== Style Header =====
    const headerRow = worksheet.getRow(1);
    headerRow.height = 30;
    headerRow.eachCell(styleCell);

    // ===== Add Total Rev Column =====
    const lastCol = worksheet.columnCount + 1;
    const totalHeader = worksheet.getRow(1).getCell(lastCol);
    totalHeader.value = 'Total Rev';
    styleCell(totalHeader);

    // ===== Process Data Rows =====
      worksheet.eachRow((row, rowNumber) => {
        if (rowNumber === 1) return; // skip header

        row.eachCell((cell) => {
          if (cell.value && typeof cell.value === 'string') {
            const numeric = Number(String(cell.value).replace(/,/g, ''));
            if (!isNaN(numeric)) {
              cell.value = numeric;
              cell.numFmt = '#,##0'; // tambahin format ribuan
            }
          }
        });

        // Total Rev sebagai formula
        row.getCell(lastCol).value = { 
          formula: `SUM(G${rowNumber},I${rowNumber},M${rowNumber},P${rowNumber},S${rowNumber},V${rowNumber})`, 
          result: 0 
        };
        row.getCell(lastCol).numFmt = '#,##0'; // format Total Rev juga

        styleRowBorder(row);
      });


    // ===== Auto Width =====
    worksheet.columns.forEach((col) => {
      let maxLength = 0;
      col.eachCell({ includeEmpty: true }, (cell) => {
        const val = cell.value ? String(cell.value) : '';
        if (val.length > maxLength) maxLength = val.length;
      });
      col.width = maxLength + 2;
    });

    // ===== Save Excel & Return =====
    await workbook.xlsx.writeFile(outputPath);
    const outputBuffer = await readFile(outputPath);

    return new NextResponse(outputBuffer, {
      status: 200,
      headers: {
        "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "Content-Disposition": `attachment; filename="${file.name.replace(".csv", ".xlsx")}"`
      }
    });

  } catch (err) {
    console.error(">>> API Error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
