"use client";

import Link from "next/link";
import React, { useState, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";

const ExcelMultiBatch = () => {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [downloadUrl, setDownloadUrl] = useState(null);

  const fileInputRef = useRef(null);
  const progressRef = useRef(0);

  const handleFilesChange = (e) => {
    setFiles([...e.target.files]);
    setDownloadUrl(null);
    setProgress(0);
  };

  const handleProcess = async () => {
    if (files.length === 0) {
      toast.warning("Please select CSV files first!", { autoClose: 1000 });
      return;
    }

    setLoading(true);
    setProgress(0);
    progressRef.current = 0;

    const formData = new FormData();
    files.forEach((file) => formData.append("files", file));

    const smoothProgress = (target) => {
      if (progressRef.current < target) {
        progressRef.current += Math.random() * 2 + 0.5;
        if (progressRef.current > target) progressRef.current = target;
        setProgress(progressRef.current);
        requestAnimationFrame(() => smoothProgress(target));
      }
    };

    try {
      smoothProgress(90);

      const res = await axios.post("/api/convert-multi", formData, {
        responseType: "blob",
      });

      smoothProgress(100);

      const blob = new Blob([res.data], { type: "application/zip" });
      const url = window.URL.createObjectURL(blob);
      setDownloadUrl(url);

      toast.success("All files converted successfully!", { autoClose: 1000 });
    } catch (err) {
      console.error(err);
      toast.error("Conversion failed: " + err.message, { autoClose: 1000 });
      setProgress(0);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    if (!downloadUrl) return;

    const a = document.createElement("a");
    a.href = downloadUrl;
    a.download = "converted-files.zip";
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.URL.revokeObjectURL(downloadUrl);

    toast.info("Download complete!", { autoClose: 1000 });

    // Reset state
    setFiles([]);
    setDownloadUrl(null);
    setProgress(0);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div className="p-6">
      <ToastContainer position="top-right" autoClose={1000} />
      <div>
        <Link href={"/dashboard/toolsPage"} className="text-blue-800">
          Back..
        </Link>

        <div className="mt-6 space-y-4">
          <p className="text-sm">
            Convert multiple CSV files to Excel with formulas and styles, then
            download as a ZIP.
          </p>

          <Input
            ref={fileInputRef}
            type="file"
            accept=".csv"
            multiple
            onChange={handleFilesChange}
            className="max-w-sm"
          />

          <Button
            onClick={handleProcess}
            className="bg-[var(--color-bg)] text-white"
            disabled={loading || files.length === 0}
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <svg
                  className="animate-spin h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v8H4z"
                  />
                </svg>
                Processing...
              </span>
            ) : (
              "Process Files"
            )}
          </Button>

          {/* Smooth Progress Bar */}
          {(loading || progress > 0) && (
            <div className="w-full max-w-sm bg-gray-200 rounded h-4 mt-2 overflow-hidden">
              <div
                className="bg-blue-600 h-4 transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          )}

          {/* Download button */}
          {downloadUrl && progress >= 100 && (
            <div className="flex items-center gap-4 mt-2 p-2 border rounded bg-gray-100 max-w-sm">
              <Button
                onClick={handleDownload}
                className="bg-green-600 text-white"
              >
                Download ZIP
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ExcelMultiBatch;
