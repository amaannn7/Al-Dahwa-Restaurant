import { Allura, Aref_Ruqaa, Josefin_Sans, Tajawal } from "next/font/google";

// Josefin Sans + Allura match the client's design reference.
export const josefin = Josefin_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "600", "700"],
  variable: "--font-josefin",
  display: "swap",
});

export const allura = Allura({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-allura",
  display: "swap",
  preload: false,
});

// Arabic pairing: geometric Tajawal with Aref Ruqaa as the script accent.
export const tajawal = Tajawal({
  subsets: ["arabic", "latin"],
  weight: ["400", "500", "700"],
  variable: "--font-tajawal",
  display: "swap",
  preload: false,
});

export const ruqaa = Aref_Ruqaa({
  subsets: ["arabic"],
  weight: "400",
  variable: "--font-ruqaa",
  display: "swap",
  preload: false,
});

export const fontVariables = [josefin.variable, allura.variable, tajawal.variable, ruqaa.variable].join(" ");
