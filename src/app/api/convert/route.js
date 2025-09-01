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

    // Simpan CSV ke file sementara
    const buffer = Buffer.from(await file.arrayBuffer());
    const tempCsvPath = path.join(os.tmpdir(), file.name);
    await writeFile(tempCsvPath, buffer);

    // Lokasi output Excel
    const outputPath = path.join(os.tmpdir(), "output.xlsx");

    // Jalankan script Python
    await new Promise((resolve, reject) => {
      const py = spawn("python3", ["../../scripts/convert.py", tempCsvPath]);

      py.stdout.on("data", (data) => console.log("PY:", data.toString()));
      py.stderr.on("data", (err) => console.error("PYERR:", err.toString()));

      py.on("close", (code) => {
        if (code === 0) resolve();
        else reject(new Error(`Python process exited with code ${code}`));
      });
    });

    // Baca file hasil dari Python
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
    return NextResponse.json({ error: "Failed to convert CSV" }, { status: 500 });
  }
}
