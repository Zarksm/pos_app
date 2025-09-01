import { NextResponse } from "next/server";
import { writeFile, readFile, unlink } from "fs/promises";
import path from "path";
import os from "os";
import ExcelJS from "exceljs";
import JSZip from "jszip";

export async function POST(req) {
  try {
    const formData = await req.formData();
    const files = formData.getAll("files");
    if (!files || files.length === 0) {
      return NextResponse.json({ error: "No files uploaded" }, { status: 400 });
    }

    const tempDir = os.tmpdir();
    const zip = new JSZip();

    for (const file of files) {
      const inputPath = path.join(tempDir, `input-${Date.now()}.csv`);
      const outputPath = path.join(tempDir, `output-${Date.now()}.xlsx`);
      await writeFile(inputPath, Buffer.from(await file.arrayBuffer()));

      // Load CSV
      const workbook = new ExcelJS.Workbook();
      await workbook.csv.readFile(inputPath);
      const worksheet = workbook.worksheets[0];

      // Style header
      const headerRow = worksheet.getRow(1);
      headerRow.height = 30;
      headerRow.eachCell((cell) => {
        cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFFF00" } };
        cell.alignment = { horizontal: "center", vertical: "middle" };
        cell.font = { bold: true };
        cell.border = {
          top: { style: "thin" },
          left: { style: "thin" },
          bottom: { style: "thin" },
          right: { style: "thin" },
        };
      });

      // Add Total Rev
      const lastCol = worksheet.columnCount + 1;
      const totalHeader = worksheet.getRow(1).getCell(lastCol);
      totalHeader.value = "Total Rev";
      totalHeader.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFFF00" } };
      totalHeader.alignment = { horizontal: "center", vertical: "middle" };
      totalHeader.font = { bold: true };
      totalHeader.border = {
        top: { style: "thin" },
        left: { style: "thin" },
        bottom: { style: "thin" },
        right: { style: "thin" },
      };

      // Process Data Rows
      worksheet.eachRow((row, rowNumber) => {
        if (rowNumber === 1) return;

        row.eachCell((cell) => {
          if (cell.value && typeof cell.value === "string") {
            const numeric = Number(String(cell.value).replace(/,/g, ""));
            if (!isNaN(numeric)) {
              cell.value = numeric;
              cell.numFmt = "#,##0";
            }
          }
        });

        row.getCell(lastCol).value = {
          formula: `SUM(G${rowNumber},I${rowNumber},M${rowNumber},P${rowNumber},S${rowNumber},V${rowNumber})`,
          result: 0,
        };
        row.getCell(lastCol).numFmt = "#,##0";

        // Border
        row.eachCell((cell) => {
          cell.border = {
            top: { style: "thin" },
            left: { style: "thin" },
            bottom: { style: "thin" },
            right: { style: "thin" },
          };
        });
      });

      // Auto width
      worksheet.columns.forEach((col) => {
        let maxLength = 0;
        col.eachCell({ includeEmpty: true }, (cell) => {
          const val = cell.value ? String(cell.value) : "";
          if (val.length > maxLength) maxLength = val.length;
        });
        col.width = maxLength + 2;
      });

      // Save Excel
      await workbook.xlsx.writeFile(outputPath);
      const buffer = await readFile(outputPath);
      zip.file(file.name.replace(".csv", ".xlsx"), buffer);

      // Cleanup
      await unlink(inputPath);
      await unlink(outputPath);
    }

    const zipBuffer = await zip.generateAsync({ type: "nodebuffer" });

    return new NextResponse(zipBuffer, {
      status: 200,
      headers: {
        "Content-Type": "application/zip",
        "Content-Disposition": `attachment; filename="converted-files.zip"`,
      },
    });
  } catch (err) {
    console.error(">>> API Error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
