import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://doybi.example"),
  title: { default: "DOYBİ | Acıktın mı? Doybi'ye bak!", template: "%s | DOYBİ" },
  description: "Tekirdağ Süleymanpaşa'da demo restoranları keşfet, menüleri incele ve demo sipariş akışını dene.",
  openGraph: { title:"DOYBİ", description:"Acıktın mı? Doybi'ye bak!", locale:"tr_TR", type:"website" },
};

export default function RootLayout({children}:{children:React.ReactNode}) { return <html lang="tr"><body>{children}</body></html>; }
