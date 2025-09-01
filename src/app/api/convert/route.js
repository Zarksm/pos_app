// import { NextResponse } from "next/server";
// import { spawn } from "child_process";
// import { writeFile, readFile } from "fs/promises";
// import path from "path";
// import os from "os";

// export async function POST(req) {
//   try {
//     const formData = await req.formData();
//     const file = formData.get("file");

//     if (!file) {
//       return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
//     }

//     // save csv temp
//     const tempDir = os.tmpdir();
//     const inputPath = path.join(tempDir, `input-${Date.now()}.csv`);
//     const outputPath = path.join(tempDir, `output-${Date.now()}.xlsx`);

//     const buffer = Buffer.from(await file.arrayBuffer());
//     await writeFile(inputPath, buffer);

//     // run python convert.py
//     await new Promise((resolve, reject) => {
//       const py = spawn("python3", [
//         path.join(process.cwd(), "src","convert.py"),
//         inputPath,
//         outputPath,
//       ]);

//       py.stdout.on("data", (data) => console.log("PYTHON:", data.toString()));
//       py.stderr.on("data", (data) => console.error("PYTHON ERR:", data.toString()));
//       py.on("close", (code) => {
//         if (code === 0) resolve();
//         else reject(new Error("Python script failed"));
//       });
//     });

//     // baca hasil excel
//     const excelBuffer = await readFile(outputPath);

//     return new NextResponse(excelBuffer, {
//       status: 200,
//       headers: {
//         "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
//         "Content-Disposition": 'attachment; filename="converted.xlsx"',
//       },
//     });
//   } catch (err) {
//     console.error(">>> API Error:", err);
//     return NextResponse.json({ error: err.message }, { status: 500 });
//   }
// }



import { NextResponse } from "next/server";
import { writeFile } from "fs/promises";
import path from "path";
import os from "os";
import ExcelJS from "exceljs";

export async function POST(req) {
  try {
    const formData = await req.formData();
    const file = formData.get("file");

    if (!file) return NextResponse.json({ error: "No file uploaded" }, { status: 400 });

    const tempDir = os.tmpdir();
    const inputPath = path.join(tempDir, `input-${Date.now()}.csv`);
    const outputPath = path.join(tempDir, `output-${Date.now()}.xlsx`);

    const buffer = Buffer.from(await file.arrayBuffer());
    await writeFile(inputPath, buffer);

    // ======== PROCESS CSV ========
    const workbook = new ExcelJS.Workbook();
    await workbook.csv.readFile(inputPath);

    const worksheet = workbook.worksheets[0];

    // ======== STYLE HEADER ========
    const headerRow = worksheet.getRow(1);
    headerRow.height = 30;

    headerRow.eachCell((cell) => {
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFFF00' }
      };
      cell.alignment = { horizontal: 'center', vertical: 'middle' };
      cell.font = { bold: true };
      cell.border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' }
      };
    });

    // ======== ADD TOTAL REV COLUMN ========
    const lastCol = worksheet.columnCount + 1;
    worksheet.getRow(1).getCell(lastCol).value = 'Total Rev';
    const totalHeader = worksheet.getRow(1).getCell(lastCol);
    totalHeader.fill = {
      type: 'pattern',
      pattern:'solid',
      fgColor:{argb:'FFFF00'}
    };
    totalHeader.alignment = { horizontal: 'center', vertical: 'middle' };
    totalHeader.font = { bold: true };
    totalHeader.border = {
      top: { style: 'thin' },
      left: { style: 'thin' },
      bottom: { style: 'thin' },
      right: { style: 'thin' }
    };

    // ======== DATA ROWS ========
    worksheet.eachRow((row, rowNumber) => {
      if (rowNumber === 1) return; // skip header

      // Convert string angka "16,200" jadi number
      const parseNumber = (v) => {
        if (!v) return 0;
        if (typeof v === 'number') return v;
        return Number(String(v).replace(/,/g, '')) || 0;
      };

      // Total Rev sebagai formula
      const formula = `SUM(G${rowNumber},I${rowNumber},M${rowNumber},P${rowNumber},S${rowNumber},V${rowNumber})`;
      row.getCell(lastCol).value = { formula, result: 0 };

      // BORDER untuk semua cell
      row.eachCell((cell) => {
        cell.border = {
          top: { style: 'thin' },
          left: { style: 'thin' },
          bottom: { style: 'thin' },
          right: { style: 'thin' }
        };
      });
    });

    // ======== AUTO WIDTH ========
    worksheet.columns.forEach((col) => {
      let maxLength = 0;
      col.eachCell({ includeEmpty: true }, (cell) => {
        const val = cell.value ? String(cell.value) : '';
        if (val.length > maxLength) maxLength = val.length;
      });
      col.width = maxLength + 2;
    });

    // ======== SAVE EXCEL ========
    await workbook.xlsx.writeFile(outputPath);

    const outputBuffer = await import('fs').then(fs => fs.promises.readFile(outputPath));

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