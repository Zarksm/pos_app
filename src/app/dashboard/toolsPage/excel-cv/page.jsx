// "use client";

// import Link from "next/link";
// import React, { useState } from "react";
// import { Input } from "@/components/ui/input";
// import { Button } from "@/components/ui/button";
// import { ToastContainer, toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";

// const ExcelCv = () => {
//   const [file, setFile] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [progress, setProgress] = useState(0); // 0-100
//   const [downloadUrl, setDownloadUrl] = useState(null);
//   const [convertedFileName, setConvertedFileName] = useState("");

//   const handleFileChange = (e) => {
//     setFile(e.target.files[0]);
//     setDownloadUrl(null); // reset previous conversion
//     setProgress(0);
//   };

//   const handleProcess = async () => {
//     if (!file) {
//       toast.warning("Please select a CSV file first!");
//       return;
//     }

//     const formData = new FormData();
//     formData.append("file", file);

//     try {
//       setLoading(true);
//       setProgress(0);

//       // Simulate upload + conversion progress
//       const fakeProgress = setInterval(() => {
//         setProgress((prev) => {
//           if (prev >= 95) return prev; // stop at 95, final step after fetch
//           return prev + Math.floor(Math.random() * 5) + 1;
//         });
//       }, 200);

//       // Upload + convert
//       const res = await fetch("/api/convert", {
//         method: "POST",
//         body: formData,
//       });

//       if (!res.ok) {
//         throw new Error("Conversion failed!");
//       }

//       const blob = await res.blob();
//       const url = window.URL.createObjectURL(blob);

//       clearInterval(fakeProgress);
//       setProgress(100);

//       setDownloadUrl(url);
//       setConvertedFileName(file.name.replace(".csv", ".xlsx"));
//       toast.success("File converted successfully!");
//     } catch (err) {
//       console.error(">>> Error converting:", err);
//       toast.error("Conversion failed: " + err.message);
//     } finally {
//       setLoading(false);
//       setProgress(0);
//     }
//   };

//   const handleDownload = () => {
//     if (!downloadUrl) return;
//     const a = document.createElement("a");
//     a.href = downloadUrl;
//     a.download = convertedFileName;
//     document.body.appendChild(a);
//     a.click();
//     a.remove();
//     window.URL.revokeObjectURL(downloadUrl);

//     toast.info("Download complete!");

//     // reset state
//     setFile(null);
//     setDownloadUrl(null);
//     setConvertedFileName("");
//     setProgress(0);
//   };

//   return (
//     <div className="p-6">
//       <ToastContainer position="top-right" autoClose={3000} />
//       <div>
//         <Link href={"/dashboard/toolsPage"} className="text-blue-800">
//           Back..
//         </Link>

//         <div className="mt-6 space-y-4">
//           <p className="text-sm">
//             Convert your CSV to Excel with full of formulas. This tool will make
//             your work easier.
//           </p>

//           {/* Input File */}
//           <Input
//             id="csvFile"
//             type="file"
//             accept=".csv"
//             onChange={handleFileChange}
//             className="max-w-sm"
//           />

//           {/* Process Button */}
//           <Button
//             onClick={handleProcess}
//             className="bg-[var(--color-bg)] text-white"
//             disabled={loading}
//           >
//             {loading ? (
//               <span className="flex items-center gap-2">
//                 <svg
//                   className="animate-spin h-5 w-5 text-white"
//                   xmlns="http://www.w3.org/2000/svg"
//                   fill="none"
//                   viewBox="0 0 24 24"
//                 >
//                   <circle
//                     className="opacity-25"
//                     cx="12"
//                     cy="12"
//                     r="10"
//                     stroke="currentColor"
//                     strokeWidth="4"
//                   ></circle>
//                   <path
//                     className="opacity-75"
//                     fill="currentColor"
//                     d="M4 12a8 8 0 018-8v8H4z"
//                   ></path>
//                 </svg>
//                 Processing...
//               </span>
//             ) : (
//               "Process File"
//             )}
//           </Button>

//           {/* Progress Bar */}
//           {loading && (
//             <div className="w-full max-w-sm bg-gray-200 rounded h-4 mt-2">
//               <div
//                 className="bg-blue-600 h-4 rounded transition-all"
//                 style={{ width: `${progress}%` }}
//               />
//             </div>
//           )}

//           {/* Show converted file */}
//           {downloadUrl && (
//             <div className="flex items-center gap-4 mt-2 p-2 border rounded bg-gray-100 max-w-sm">
//               <span className="text-gray-700">{convertedFileName}</span>
//               <Button
//                 onClick={handleDownload}
//                 className="bg-green-600 text-white"
//               >
//                 Download
//               </Button>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ExcelCv;

"use client";

import Link from "next/link";
import React, { useState, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";

const ExcelCv = () => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [downloadUrl, setDownloadUrl] = useState(null);
  const [convertedFileName, setConvertedFileName] = useState("");

  const fileInputRef = useRef(null);
  const progressRef = useRef(progress);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setDownloadUrl(null);
    setConvertedFileName("");
    setProgress(0);
  };

  const handleProcess = async () => {
    if (!file) {
      toast.warning("Please select a CSV file first!", { autoClose: 1000 });
      return;
    }

    setLoading(true);
    setProgress(0);
    progressRef.current = 0;

    const formData = new FormData();
    formData.append("file", file);

    // Smooth progress updater
    const smoothProgress = (target) => {
      if (progressRef.current < target) {
        progressRef.current += Math.random() * 2 + 0.5; // naik secara smooth
        if (progressRef.current > target) progressRef.current = target;
        setProgress(progressRef.current);
        requestAnimationFrame(() => smoothProgress(target));
      }
    };

    try {
      smoothProgress(90); // naik ke 90% dulu

      const res = await axios.post("/api/convert", formData, {
        responseType: "blob",
      });

      smoothProgress(100); // naik ke 100%

      const blob = new Blob([res.data], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      const url = window.URL.createObjectURL(blob);
      setDownloadUrl(url);
      setConvertedFileName(file.name.replace(".csv", ".xlsx"));

      toast.success("File converted successfully!", { autoClose: 1000 });
    } catch (err) {
      console.error(">>> Error converting:", err);
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
    a.download = convertedFileName;
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.URL.revokeObjectURL(downloadUrl);

    toast.info("Download complete!", { autoClose: 1000 });

    // reset semua state
    setFile(null);
    setDownloadUrl(null);
    setConvertedFileName("");
    setProgress(0);
    progressRef.current = 0;

    // reset input DOM value
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
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
            Convert your CSV to Excel with full of formulas. This tool will make
            your work easier.
          </p>

          <Input
            ref={fileInputRef}
            type="file"
            accept=".csv"
            onChange={handleFileChange}
            className="max-w-sm"
          />

          <Button
            onClick={handleProcess}
            className="bg-[var(--color-bg)] text-white"
            disabled={loading || !file}
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
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v8H4z"
                  ></path>
                </svg>
                Processing...
              </span>
            ) : (
              "Process File"
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

          {/* Show Download Button only after progress 100% */}
          {downloadUrl && progress >= 100 && (
            <div className="flex items-center gap-4 mt-2 p-2 border rounded bg-gray-100 max-w-sm">
              <span className="text-gray-700 text-sm">{convertedFileName}</span>
              <Button
                onClick={handleDownload}
                className="bg-green-600 text-white"
              >
                Download
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ExcelCv;
