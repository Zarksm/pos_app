import Link from "next/link";
import React from "react";

const toolsPage = () => {
  return (
    <div className="p-6">
      <h2>Useful Tools</h2>

      <div className="mt-4">
        <Link
          href="/dashboard/toolsPage/excel-cv"
          className="px-4 py-2 text-white rounded-md bg-[var(--color-bg)] max-w-max cursor-pointer text-sm hover:bg-blue-700 transition duration-300 ease-in-out"
        >
          CSV to Excel Converter
        </Link>
      </div>
    </div>
  );
};

export default toolsPage;
