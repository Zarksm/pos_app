import { NextResponse } from "next/server";
import { spawn } from "child_process";
import { writeFile, readFile } from "fs/promises";
import path from "path";
import os from "os";

export async function POST(req) {
  try {
    const formData = await req.formData();
    const file = formData.get("file");

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    // save csv temp
    const tempDir = os.tmpdir();
    const inputPath = path.join(tempDir, `input-${Date.now()}.csv`);
    const outputPath = path.join(tempDir, `output-${Date.now()}.xlsx`);

    const buffer = Buffer.from(await file.arrayBuffer());
    await writeFile(inputPath, buffer);

    // run python convert.py
    await new Promise((resolve, reject) => {
      const py = spawn("python3", [
        path.join(process.cwd(), "src","convert.py"),
        inputPath,
        outputPath,
      ]);

      py.stdout.on("data", (data) => console.log("PYTHON:", data.toString()));
      py.stderr.on("data", (data) => console.error("PYTHON ERR:", data.toString()));
      py.on("close", (code) => {
        if (code === 0) resolve();
        else reject(new Error("Python script failed"));
      });
    });

    // baca hasil excel
    const excelBuffer = await readFile(outputPath);

    return new NextResponse(excelBuffer, {
      status: 200,
      headers: {
        "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "Content-Disposition": 'attachment; filename="converted.xlsx"',
      },
    });
  } catch (err) {
    console.error(">>> API Error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
