"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

// Import React Icons
import {
  FaTachometerAlt,
  FaChartLine,
  FaUsers,
  FaShoppingCart,
  FaCog,
} from "react-icons/fa";

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: FaTachometerAlt },
  { name: "Analytics", href: "/dashboard/analytics", icon: FaChartLine },
  { name: "Tools", href: "/dashboard/toolsPage", icon: FaCog }, // 🔧 Tambah tools
];

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-gray-900 opacity-50 z-20 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-30 w-64 bg-[var(--color-bg)] transform transition duration-300 ease-in-out lg:static lg:inset-0 lg:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="w-full flex items-center justify-center h-16 px-4">
          <span className="text-white font-semibold text-xl">
            POS Indonesia
          </span>
          <button
            className="text-gray-500 lg:hidden"
            onClick={() => setIsOpen(false)}
          >
            ✕
          </button>
        </div>

        <nav className="mt-4">
          {navigation.map((item) => {
            const Icon = item.icon;
            const isActive =
              item.href === "/dashboard"
                ? pathname === "/dashboard" // Dashboard cuma aktif di /dashboard
                : pathname === item.href ||
                  pathname.startsWith(item.href + "/");

            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center px-6 py-3 text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-gray-800 text-white"
                    : "text-gray-400 hover:bg-gray-800 hover:text-white"
                }`}
              >
                <Icon
                  className={`mr-3 text-lg ${isActive ? "text-white" : ""}`}
                />
                {item.name}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Mobile menu button */}
      <button
        className="fixed bottom-4 right-4 z-40 p-3 bg-gray-900 text-white rounded-full shadow-lg lg:hidden"
        onClick={() => setIsOpen(true)}
      >
        ☰
      </button>
    </>
  );
}
