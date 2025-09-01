// app/layout.jsx
import "./globals.css";
import { Poppins } from "next/font/google";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "600", "700"], // pilih yang dibutuhkan
  variable: "--font-poppins",   // jadikan CSS variable
});

export const metadata = {
  title: "Dashboard",
  description: "Admin panel with custom font",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={poppins.variable}>
      <body className="font-poppins">{children}</body>
    </html>
  );
}
