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

    // Simpan CSV sementara
    const buffer = Buffer.from(await file.arrayBuffer());
    const tempCsvPath = path.join(os.tmpdir(), file.name);
    await writeFile(tempCsvPath, buffer);

    // Output sementara
    const outputPath = path.join(os.tmpdir(), "output.xlsx");

    // Path script Python
    const scriptPath = path.join(process.cwd(), "src", "scripts", "convert.py");

    console.log(">>> Run Python:", scriptPath, tempCsvPath, outputPath);

    // Jalankan Python
    await new Promise((resolve, reject) => {
      const py = spawn("python3", [scriptPath, tempCsvPath, outputPath]);

      py.stdout.on("data", (data) => console.log("PY:", data.toString()));
      py.stderr.on("data", (err) => console.error("PYERR:", err.toString()));

      py.on("close", (code) => {
        if (code === 0) resolve();
        else reject(new Error(`Python exited with code ${code}`));
      });
    });

    // Pastikan output ada
    const outputBuffer = await readFile(outputPath);

    return new NextResponse(outputBuffer, {
      headers: {
        "Content-Type":
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "Content-Disposition": 'attachment; filename="output.xlsx"',
      },
    });
  } catch (error) {
    console.error("API ERROR:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
