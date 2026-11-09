import type { Metadata } from "next";
import { CustomerShell } from "@/components/customer/shell";
import "./customer.css";

export const metadata: Metadata = {
  title: "Yemek siparişi",
  description: "Tekirdağ Süleymanpaşa'da demo restoranları keşfet ve DOYBİ deneyimini dene.",
};

export default function CustomerLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <CustomerShell>{children}</CustomerShell>;
}
