"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState, type FormEvent, type ReactNode } from "react";
import {
  ArrowDown,
  ChevronDown,
  Home,
  MapPin,
  Menu,
  Search,
  ShoppingBag,
  UserRound,
  Utensils,
  X,
} from "lucide-react";
import { neighborhoods } from "@/data/restaurants";
import { useCustomerStore } from "@/features/customer/store";
import type { CustomerAddress } from "@/types/customer";

const navigation = [
  { href: "/", label: "Ana Sayfa", icon: Home },
  { href: "/restoranlar", label: "Keşfet", icon: Utensils },
  { href: "/siparislerim", label: "Siparişlerim", icon: ShoppingBag },
  { href: "/hesabim", label: "Hesabım", icon: UserRound },
];

export function CustomerShell({ children }: { children: ReactNode }) {
  const [addressOpen, setAddressOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [addressForm, setAddressForm] = useState({
    neighborhood: neighborhoods[0],
    street: "",
    buildingNumber: "",
    apartmentNumber: "",
    directions: "",
  });
  const address = useCustomerStore((state) => state.address);
  const cart = useCustomerStore((state) => state.cart);
  const setAddress = useCustomerStore((state) => state.setAddress);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    void useCustomerStore.persist.rehydrate();
  }, []);

  useEffect(() => {
    const openDialog = () => setAddressOpen(true);
    window.addEventListener("doybi:open-address", openDialog);
    return () => window.removeEventListener("doybi:open-address", openDialog);
  }, []);

  const openAddressDialog = () => {
    if (address) {
      setAddressForm({
        neighborhood: address.neighborhood,
        street: address.street,
        buildingNumber: address.buildingNumber,
        apartmentNumber: address.apartmentNumber,
        directions: address.directions,
      });
    }
    setAddressOpen(true);
  };

  const saveAddress = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const nextAddress: CustomerAddress = {
      id: `address-${Date.now()}`,
      city: "Tekirdağ",
      district: "Süleymanpaşa",
      ...addressForm,
    };
    setAddress(nextAddress);
    setAddressOpen(false);
  };

  const search = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    router.push(`/restoranlar?q=${encodeURIComponent(query.trim())}`);
  };

  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);

  return (
    <>
      <header className="customer-header">
        <div className="customer-header-main customer-container">
          <Link className="customer-brand" href="/" aria-label="DOYBİ ana sayfa">
            <span className="customer-brand-mark">d.</span>
            <span>DOYBİ</span>
          </Link>

          <button className="customer-address-button desktop-address" onClick={openAddressDialog} type="button">
            <span className="customer-address-pin"><MapPin size={17} /></span>
            <span className="customer-address-copy">
              <small>Teslimat adresin</small>
              <strong>{address ? `${address.neighborhood}, Süleymanpaşa` : "Adresini seç"}</strong>
            </span>
            <ChevronDown size={16} />
          </button>

          <form className="customer-search desktop-search" onSubmit={search} role="search">
            <Search size={18} />
            <input
              aria-label="Restoran veya yemek ara"
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Restoran veya yemek ara"
              value={query}
            />
            <button type="submit" aria-label="Ara"><ArrowDown className="search-enter-icon" size={16} /></button>
          </form>

          <div className="customer-header-actions">
            <Link className="customer-login-link" href="/giris">Giriş yap</Link>
            <Link className="customer-signup-link" href="/kayit">Kayıt ol</Link>
            <Link className="customer-cart-link" href="/sepet" aria-label={`Sepetim, ${cartCount} ürün`}>
              <ShoppingBag size={19} /><span>Sepetim</span>
              {cartCount > 0 && <b>{cartCount}</b>}
            </Link>
          </div>

          <button
            aria-expanded={mobileMenuOpen}
            aria-label={mobileMenuOpen ? "Menüyü kapat" : "Menüyü aç"}
            className="customer-mobile-menu"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            type="button"
          >
            {mobileMenuOpen ? <X size={21} /> : <Menu size={21} />}
          </button>
        </div>

        <div className="customer-mobile-controls">
          <button className="customer-address-button" onClick={openAddressDialog} type="button">
            <MapPin size={17} />
            <span>{address ? `${address.neighborhood}, Süleymanpaşa` : "Teslimat adresini seç"}</span>
            <ChevronDown size={15} />
          </button>
          <form className="customer-search" onSubmit={search} role="search">
            <Search size={18} />
            <input
              aria-label="Restoran veya yemek ara"
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Ne yemek istersin?"
              value={query}
            />
            <button type="submit" aria-label="Ara"><Search size={17} /></button>
          </form>
        </div>

        {mobileMenuOpen && (
          <nav className="customer-mobile-menu-panel">
            <Link href="/giris" onClick={() => setMobileMenuOpen(false)}>Giriş yap</Link>
            <Link href="/kayit" onClick={() => setMobileMenuOpen(false)}>Hesap oluştur</Link>
            <Link href="/siparislerim" onClick={() => setMobileMenuOpen(false)}>Demo siparişlerim</Link>
          </nav>
        )}
      </header>

      <main className="customer-main">{children}</main>

      <footer className="customer-footer">
        <div className="customer-container customer-footer-inner">
          <Link className="customer-brand customer-footer-brand" href="/">
            <span className="customer-brand-mark">d.</span><span>DOYBİ</span>
          </Link>
          <p>Acıktın mı? Doybi&apos;ye bak!</p>
          <span className="demo-disclaimer">Demo deneyimidir · Gerçek sipariş alınmaz</span>
        </div>
      </footer>

      <nav className="customer-bottom-nav" aria-label="Alt menü">
        {navigation.map(({ href, label, icon: Icon }) => (
          <Link className={pathname === href ? "active" : ""} href={href} key={href}>
            <Icon size={20} strokeWidth={pathname === href ? 2.4 : 1.8} /><span>{label}</span>
            {href === "/sepet" && cartCount > 0 && <b>{cartCount}</b>}
          </Link>
        ))}
      </nav>

      {addressOpen && (
        <div className="customer-modal-backdrop" onMouseDown={(event) => {
          if (event.target === event.currentTarget) setAddressOpen(false);
        }}>
          <section aria-labelledby="address-modal-title" aria-modal="true" className="customer-modal" role="dialog">
            <button aria-label="Pencereyi kapat" className="customer-modal-close" onClick={() => setAddressOpen(false)} type="button">
              <X size={19} />
            </button>
            <span className="customer-modal-icon"><MapPin size={21} /></span>
            <p className="customer-kicker">Sana uygun restoranları bulalım</p>
            <h2 id="address-modal-title">Teslimat adresin neresi?</h2>
            <p className="customer-muted">Şimdilik yalnızca Tekirdağ / Süleymanpaşa demo bölgesi kullanılabilir.</p>
            <form className="customer-form" onSubmit={saveAddress}>
              <div className="customer-form-grid">
                <label>İl
                  <input value="Tekirdağ" readOnly />
                </label>
                <label>İlçe
                  <input value="Süleymanpaşa" readOnly />
                </label>
              </div>
              <label>Mahalle
                <select
                  onChange={(event) => setAddressForm({ ...addressForm, neighborhood: event.target.value })}
                  value={addressForm.neighborhood}
                >
                  {neighborhoods.map((name) => <option key={name}>{name}</option>)}
                </select>
              </label>
              <label>Sokak / cadde
                <input
                  onChange={(event) => setAddressForm({ ...addressForm, street: event.target.value })}
                  placeholder="Örn. Sahil Caddesi"
                  required
                  value={addressForm.street}
                />
              </label>
              <div className="customer-form-grid">
                <label>Bina no
                  <input
                    onChange={(event) => setAddressForm({ ...addressForm, buildingNumber: event.target.value })}
                    required
                    value={addressForm.buildingNumber}
                  />
                </label>
                <label>Daire no <span className="optional-label">İsteğe bağlı</span>
                  <input
                    onChange={(event) => setAddressForm({ ...addressForm, apartmentNumber: event.target.value })}
                    value={addressForm.apartmentNumber}
                  />
                </label>
              </div>
              <label>Adres tarifi <span className="optional-label">İsteğe bağlı</span>
                <textarea
                  onChange={(event) => setAddressForm({ ...addressForm, directions: event.target.value })}
                  placeholder="Kurye için ek bilgi"
                  rows={2}
                  value={addressForm.directions}
                />
              </label>
              <button className="customer-button customer-button-primary customer-button-wide" type="submit">
                Adresi kaydet <ArrowDown className="button-arrow-up" size={17} />
              </button>
            </form>
          </section>
        </div>
      )}
    </>
  );
}

export function DemoNotice({ children }: { children?: ReactNode }) {
  return (
    <div className="customer-demo-notice">
      <span className="demo-dot" />
      <span>{children ?? "Demo deneyimi · Restoranlar ve fiyatlar temsili veridir."}</span>
    </div>
  );
}
