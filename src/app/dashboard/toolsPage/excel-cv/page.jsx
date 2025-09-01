"use client";

import Link from "next/link";
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const ExcelCv = () => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleProcess = async () => {
    if (!file) {
      alert("Please select a CSV file first!");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      setLoading(true);

      const res = await fetch("/api/convert", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        throw new Error("Conversion failed!");
      }

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = file.name.replace(".csv", ".xlsx");
      document.body.appendChild(a);
      a.click();
      a.remove();

      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error(">>> Error converting:", err);
      alert("Conversion failed: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <div>
        <Link href={"/dashboard/toolsPage"} className="text-blue-800">
          Back..
        </Link>

        <div className="mt-6 space-y-4">
          <p className="text-sm">
            Convert your CSV to Excel with full of formulas. This tool will make
            your work easier.
          </p>

          {/* Input File */}
          <Input
            id="csvFile"
            type="file"
            accept=".csv"
            onChange={handleFileChange}
            className="max-w-sm"
          />

          {/* Process Button */}
          <Button
            onClick={handleProcess}
            className="bg-[var(--color-bg)] text-white"
            disabled={loading}
          >
            {loading ? "Processing..." : "Process File"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ExcelCv;
