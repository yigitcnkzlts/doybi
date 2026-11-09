"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useWatch } from "react-hook-form";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  CheckCircle2,
  ChevronRight,
  Clock3,
  CreditCard,
  Eye,
  EyeOff,
  Info,
  MapPin,
  Minus,
  Plus,
  ShieldCheck,
  ShoppingBag,
  SlidersHorizontal,
  Star,
  Trash2,
  Truck,
  UtensilsCrossed,
  X,
} from "lucide-react";
import { getDeliveryZone, getRestaurantStatus, restaurantById, restaurantBySlug, restaurants } from "@/data/restaurants";
import { DemoNotice } from "@/components/customer/shell";
import { enableDemoPreview } from "@/features/customer/demo-preview";
import { useCustomerStore } from "@/features/customer/store";
import { customerAuthService } from "@/services/customer-auth";
import type {
  CartItem,
  MenuItem,
  OrderStatus,
  PaymentMethod,
  Restaurant,
  SelectedMenuOption,
} from "@/types/customer";

const categoryLinks = [
  { name: "Döner", emoji: "🥙" },
  { name: "Pizza", emoji: "🍕" },
  { name: "Kebap", emoji: "🍢" },
  { name: "Burger", emoji: "🍔" },
  { name: "Çorba", emoji: "🍲" },
  { name: "Pide", emoji: "🫓" },
  { name: "Tavuk", emoji: "🍗" },
  { name: "Tatlı", emoji: "🍰" },
  { name: "İçecek", emoji: "🥤" },
];

const money = (cents: number) =>
  new Intl.NumberFormat("tr-TR", { style: "currency", currency: "TRY", maximumFractionDigits: 2 }).format(cents / 100);

const deliveryText = (cents: number) => (cents === 0 ? "Ücretsiz teslimat" : money(cents));

function RestaurantCard({ restaurant }: { restaurant: Restaurant }) {
  const address = useCustomerStore((state) => state.address);
  const zone = address ? getDeliveryZone(restaurant, address.neighborhood) : undefined;
  const status = getRestaurantStatus(restaurant);
  if (status === "HIDDEN") return null;

  return (
    <Link className={`restaurant-card ${status !== "OPEN" ? "restaurant-card-closed" : ""}`} href={`/restoran/${restaurant.slug}`}>
      <div className="restaurant-card-photo" style={{ backgroundImage: `url("${restaurant.image}")` }}>
        <span className="restaurant-demo-label">DEMO</span>
        {restaurant.campaign && <span className="restaurant-campaign">{restaurant.campaign}</span>}
        {status !== "OPEN" && <span className="restaurant-closed-label">{status === "TEMPORARILY_CLOSED" ? "Şu anda sipariş almıyor" : `${restaurant.operatingHours.opensAt}'de açılıyor`}</span>}
      </div>
      <div className="restaurant-card-body">
        <div className="restaurant-card-title-row">
          <div><h3>{restaurant.name}</h3><span>{restaurant.cuisine}</span></div>
          <span className="restaurant-rating"><Star size={14} fill="currentColor" />{restaurant.rating.toFixed(1)} <small>demo</small></span>
        </div>
        <div className="restaurant-meta">
          <span><Clock3 size={14} />{restaurant.deliveryMinutes}–{restaurant.deliveryMinutes + 10} dk</span>
          <span><Truck size={14} />{zone ? deliveryText(zone.deliveryFeeCents) : address ? "Bölgen dışında" : "Adres seç"}</span>
        </div>
        <div className="restaurant-minimum">Min. sipariş {money(restaurant.minimumOrderCents)}</div>
      </div>
    </Link>
  );
}

function RestaurantGrid({ list }: { list: Restaurant[] }) {
  if (!list.length) {
    return <div className="customer-empty"><UtensilsCrossed size={30} /><h3>Şimdilik burada restoran yok</h3><p>Adresini değiştirebilir veya başka bir kategori deneyebilirsin.</p></div>;
  }
  return <div className="restaurant-grid">{list.map((restaurant) => <RestaurantCard key={restaurant.id} restaurant={restaurant} />)}</div>;
}

export function HomePage() {
  return (
    <section className="welcome-page">
      <div className="customer-container welcome-grid">
        <div className="welcome-copy">
          <span className="welcome-logo"><span className="customer-brand-mark">d.</span> DOYBİ</span>
          <span className="customer-kicker"><span className="hero-kicker-dot" /> Lezzetli bir başlangıç</span>
          <h1>Acıktın mı?<br /><span>Doybi&apos;ye bak!</span></h1>
          <p>Sevdiğin lezzetler, avantajlı fiyatlarla kapında. DOYBİ&apos;ye katıl, restoranları keşfet ve siparişini kolayca oluştur.</p>
          <div className="welcome-actions">
            <Link className="customer-button customer-button-dark" href="/giris">Giriş Yap <ArrowRight size={17} /></Link>
            <Link className="customer-button customer-button-primary" href="/kayit">Ücretsiz Kayıt Ol</Link>
          </div>
          <span className="welcome-privacy"><ShieldCheck size={15} /> Hesap bilgilerin backend bağlanana kadar işlenmez.</span>
        </div>
        <div className="welcome-visual" aria-label="Yemek ve restoran kartları örnek görünümü" role="img">
          <div className="welcome-visual-glow" />
          <div className="welcome-plate" />
          <div className="welcome-photo-card"><span>GÜNÜN LEZZETİ</span><strong>Özenle hazırlandı</strong></div>
          <div className="welcome-restaurant-card">
            <span className="welcome-restaurant-thumb" />
            <span><strong>Mahallenden lezzetler</strong><small>Demo önizleme · Giriş sonrası</small></span>
            <span className="welcome-rating"><Star size={12} fill="currentColor" /> 4.8</span>
          </div>
          <span className="welcome-floating-icon welcome-floating-one">✳</span>
          <span className="welcome-floating-icon welcome-floating-two">✦</span>
          <div className="welcome-demo-tag"><span /> Örnek görseller</div>
        </div>
      </div>
      <div className="customer-container welcome-bottom">
        <DemoNotice>Restoranlar yalnızca giriş sonrasında veya açıkça belirtilmiş demo önizlemede gösterilir.</DemoNotice>
      </div>
    </section>
  );
}

export function RestaurantsPage({ query = "", category = "" }: { query?: string; category?: string }) {
  const address = useCustomerStore((state) => state.address);
  const [search, setSearch] = useState(query);
  const [selectedCategory, setSelectedCategory] = useState(category);
  const [onlyOpen, setOnlyOpen] = useState(false);
  const [freeDelivery, setFreeDelivery] = useState(false);
  const [fastest, setFastest] = useState(false);
  const [onlyEligible, setOnlyEligible] = useState(false);
  const [minimum, setMinimum] = useState(1000);

  const visibleRestaurants = useMemo(() => restaurants
    .filter((restaurant) => getRestaurantStatus(restaurant) !== "HIDDEN")
    .filter((restaurant) => !search.trim() || `${restaurant.name} ${restaurant.cuisine} ${restaurant.menu.map((item) => item.name).join(" ")}`.toLocaleLowerCase("tr").includes(search.trim().toLocaleLowerCase("tr")))
    .filter((restaurant) => !selectedCategory || `${restaurant.name} ${restaurant.cuisine} ${restaurant.categories.map((item) => item.name).join(" ")}`.toLocaleLowerCase("tr").includes(selectedCategory.toLocaleLowerCase("tr")))
    .filter((restaurant) => !onlyOpen || getRestaurantStatus(restaurant) === "OPEN")
    .filter((restaurant) => !onlyEligible || Boolean(address && getDeliveryZone(restaurant, address.neighborhood)))
    .filter((restaurant) => {
      const zone = address ? getDeliveryZone(restaurant, address.neighborhood) : undefined;
      return !freeDelivery || zone?.deliveryFeeCents === 0;
    })
    .filter((restaurant) => restaurant.minimumOrderCents <= minimum * 100)
    .sort((a, b) => {
      if (fastest) return a.deliveryMinutes - b.deliveryMinutes;
      if (address) return Number(Boolean(getDeliveryZone(b, address.neighborhood))) - Number(Boolean(getDeliveryZone(a, address.neighborhood)));
      return 0;
    }), [address, fastest, freeDelivery, minimum, onlyEligible, onlyOpen, search, selectedCategory]);

  const clearFilters = () => {
    setSearch("");
    setSelectedCategory("");
    setOnlyOpen(false);
    setFreeDelivery(false);
    setFastest(false);
    setOnlyEligible(false);
    setMinimum(1000);
  };

  if (!address) {
    return (
      <section className="customer-container address-first-page">
        <span className="customer-modal-icon"><MapPin size={21} /></span>
        <span className="customer-kicker">Önce teslimat konumun</span>
        <h1>Mahalleni seç, sana uygun restoranları bulalım.</h1>
        <p>Tekirdağ / Süleymanpaşa demo bölgesinde adresini belirle. Restoranlar yalnızca kendi teslimat alanlarına göre listelenir.</p>
        <button
          className="customer-button customer-button-primary"
          onClick={() => window.dispatchEvent(new CustomEvent("doybi:open-address"))}
          type="button"
        >
          Teslimat adresi seç <MapPin size={16} />
        </button>
        <DemoNotice>Demo önizleme · Adresin yalnızca bu tarayıcıda saklanır.</DemoNotice>
      </section>
    );
  }

  return (
    <section className="customer-container customer-listing-page">
      <div className="listing-intro">
        <div><span className="customer-kicker">Mahallenden, özenle</span><h1>Restoranları keşfet</h1><p>{address ? `${address.neighborhood} mahallesi için teslimat seçenekleri` : "Süleymanpaşa'daki demo restoranlara göz at"}</p></div>
        <div className="listing-location-badge"><MapPin size={16} /><span>{address?.neighborhood ?? "Adres seçilmedi"}</span></div>
      </div>
      <DemoNotice />
      <div className="listing-layout">
        <aside className="filter-panel">
          <div className="filter-heading"><h2><SlidersHorizontal size={17} /> Filtrele</h2><button onClick={clearFilters} type="button">Temizle</button></div>
          <label className="filter-check"><input checked={onlyOpen} onChange={(event) => setOnlyOpen(event.target.checked)} type="checkbox" /><span>Açık restoranlar</span></label>
          <label className="filter-check"><input checked={freeDelivery} onChange={(event) => setFreeDelivery(event.target.checked)} type="checkbox" /><span>Ücretsiz teslimat</span></label>
          <label className="filter-check"><input checked={fastest} onChange={(event) => setFastest(event.target.checked)} type="checkbox" /><span>En hızlı teslimat</span></label>
          <label className="filter-check"><input checked={onlyEligible} onChange={(event) => setOnlyEligible(event.target.checked)} type="checkbox" /><span>Sadece adresime teslimat</span></label>
          <div className="filter-divider" />
          <label className="filter-range">Maksimum minimum sipariş <strong>{money(minimum * 100)}</strong>
            <input max="1000" min="0" onChange={(event) => setMinimum(Number(event.target.value))} step="50" type="range" value={minimum} />
          </label>
          <div className="filter-divider" />
          <p className="filter-label">Mutfak türü</p>
          <div className="filter-categories">
            {categoryLinks.map((item) => (
              <button className={selectedCategory === item.name ? "selected" : ""} key={item.name} onClick={() => setSelectedCategory(selectedCategory === item.name ? "" : item.name)} type="button">
                <span>{item.emoji}</span>{item.name}
              </button>
            ))}
          </div>
        </aside>
        <div className="listing-results">
          <label className="listing-search">
            <span className="sr-only">Restoran veya yemek ara</span>
            <UtensilsCrossed size={17} />
            <input onChange={(event) => setSearch(event.target.value)} placeholder="Restoran, mutfak veya yemek ara" value={search} />
            {search && <button aria-label="Aramayı temizle" onClick={() => setSearch("")} type="button"><X size={16} /></button>}
          </label>
          <div className="results-caption"><span><strong>{visibleRestaurants.length}</strong> demo restoran</span><span>{address ? `${address.neighborhood} için uygun olanlar önce gösteriliyor` : "Teslimat bölgeni görmek için adres seç"}</span></div>
          <RestaurantGrid list={visibleRestaurants} />
        </div>
      </div>
    </section>
  );
}

function ProductDialog({
  restaurant,
  product,
  onClose,
}: {
  restaurant: Restaurant;
  product: MenuItem;
  onClose: () => void;
}) {
  const addItem = useCustomerStore((state) => state.addItem);
  const replaceCartWith = useCustomerStore((state) => state.replaceCartWith);
  const [quantity, setQuantity] = useState(1);
  const [note, setNote] = useState("");
  const [selected, setSelected] = useState<SelectedMenuOption[]>(() =>
    product.options.flatMap((group) =>
      group.required && group.choices[0]
        ? [{ groupId: group.id, groupName: group.name, choiceId: group.choices[0].id, name: group.choices[0].label, priceCents: group.choices[0].priceCents }]
        : [],
    ),
  );
  const [replacePrompt, setReplacePrompt] = useState(false);

  const selectedPrice = selected.reduce((sum, option) => sum + option.priceCents, 0);
  const createItem = (): CartItem => ({
    id: crypto.randomUUID(),
    restaurantId: restaurant.id,
    menuItemId: product.id,
    name: product.name,
    image: product.image,
    unitPriceCents: product.priceCents,
    quantity,
    options: selected,
    note: note.trim(),
  });

  const addToCart = () => {
    if (!addItem(createItem())) setReplacePrompt(true);
    else onClose();
  };

  const replaceExistingCart = () => {
    replaceCartWith(createItem());
    setReplacePrompt(false);
    onClose();
  };

  const toggleOption = (groupId: string, groupName: string, choice: MenuItem["options"][number]["choices"][number], multiple: boolean) => {
    setSelected((current) => {
      const isSelected = current.some((option) => option.groupId === groupId && option.choiceId === choice.id);
      if (isSelected) return current.filter((option) => !(option.groupId === groupId && option.choiceId === choice.id));
      const next = multiple ? current : current.filter((option) => option.groupId !== groupId);
      return [...next, { groupId, groupName, choiceId: choice.id, name: choice.label, priceCents: choice.priceCents }];
    });
  };

  return (
    <div className="customer-modal-backdrop" onMouseDown={(event) => {
      if (event.target === event.currentTarget) onClose();
    }}>
      <section aria-label={`${product.name} ürün seçenekleri`} aria-modal="true" className="customer-modal product-modal" role="dialog">
        <button aria-label="Pencereyi kapat" className="customer-modal-close" onClick={onClose} type="button"><X size={19} /></button>
        <div className="product-modal-image" style={{ backgroundImage: `url("${product.image}")` }} />
        <div className="product-modal-content">
          <span className="customer-kicker">{restaurant.name} · Demo ürün</span>
          <h2>{product.name}</h2>
          <p>{product.description}</p>
          <strong className="product-modal-price">{money(product.priceCents)}</strong>
          {product.options.map((group) => (
            <fieldset className="product-option-group" key={group.id}>
              <legend>{group.name} {group.required ? <small>Zorunlu</small> : <small>İsteğe bağlı</small>}</legend>
              {group.choices.map((choice) => {
                const checked = selected.some((option) => option.groupId === group.id && option.choiceId === choice.id);
                return (
                  <label className="product-option" key={choice.id}>
                    <span><input checked={checked} onChange={() => toggleOption(group.id, group.name, choice, group.multiple)} type={group.multiple ? "checkbox" : "radio"} />{choice.label}</span>
                    <strong>{choice.priceCents ? `+ ${money(choice.priceCents)}` : "Dahil"}</strong>
                  </label>
                );
              })}
            </fieldset>
          ))}
          <label className="product-note">Sipariş notu <span className="optional-label">İsteğe bağlı</span>
            <textarea maxLength={180} onChange={(event) => setNote(event.target.value)} placeholder="Örn. Acısız olsun" value={note} />
          </label>
          <div className="product-modal-actions">
            <div className="quantity-control">
              <button aria-label="Adedi azalt" disabled={quantity <= 1} onClick={() => setQuantity(Math.max(1, quantity - 1))} type="button"><Minus size={16} /></button>
              <strong>{quantity}</strong>
              <button aria-label="Adedi artır" onClick={() => setQuantity(quantity + 1)} type="button"><Plus size={16} /></button>
            </div>
            <button className="customer-button customer-button-primary" onClick={addToCart} type="button">
              Sepete ekle · {money((product.priceCents + selectedPrice) * quantity)}
            </button>
          </div>
        </div>
        {replacePrompt && (
          <div className="nested-confirm">
            <div className="nested-confirm-card">
              <button aria-label="Uyarıyı kapat" className="customer-modal-close" onClick={() => setReplacePrompt(false)} type="button"><X size={18} /></button>
              <span className="customer-modal-icon"><ShoppingBag size={21} /></span>
              <h3>Sepetini değiştirelim mi?</h3>
              <p>Sepetinde başka bir restorandan ürün var. Bu restorana geçersen mevcut sepetin silinir.</p>
              <button className="customer-button customer-button-primary customer-button-wide" onClick={replaceExistingCart} type="button">Sepeti {restaurant.name} ile değiştir</button>
              <button className="customer-text-button" onClick={() => setReplacePrompt(false)} type="button">Vazgeç</button>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}

export function RestaurantPage({ slug }: { slug: string }) {
  const restaurant = restaurantBySlug(slug);
  const [activeCategory, setActiveCategory] = useState("");
  const [product, setProduct] = useState<MenuItem | null>(null);
  const address = useCustomerStore((state) => state.address);
  const cart = useCustomerStore((state) => state.cart);

  if (!restaurant) {
    return <section className="customer-container customer-not-found"><h1>Restoran bulunamadı</h1><p>Bu demo restoran mevcut değil veya bağlantı değişmiş olabilir.</p><Link className="customer-button customer-button-primary" href="/restoranlar">Restoranlara dön</Link></section>;
  }
  const status = getRestaurantStatus(restaurant);
  const zone = address ? getDeliveryZone(restaurant, address.neighborhood) : undefined;
  const categories = restaurant.categories;
  const products = restaurant.menu.filter((item) => !activeCategory || item.category === activeCategory);

  if (status === "HIDDEN") {
    return <section className="customer-container customer-not-found"><span className="customer-modal-icon"><Info size={22} /></span><h1>Bu demo restoran şu anda listelenmiyor</h1><p>Restoran sahibi görünürlüğü kapattığında menüye ulaşılamaz.</p><Link className="customer-button customer-button-primary" href="/restoranlar">Diğer restoranları keşfet</Link></section>;
  }

  return (
    <>
      <section className="restaurant-cover customer-container">
        <div className="restaurant-cover-photo" style={{ backgroundImage: `url("${restaurant.image}")` }} />
        <div className="restaurant-cover-content">
          <span className="restaurant-detail-demo">DEMO RESTORAN · TEMSİLİ VERİLER</span>
          <h1>{restaurant.name}</h1>
          <p>{restaurant.description}</p>
          <div className="restaurant-cover-meta">
            <span><Star size={15} fill="currentColor" /> {restaurant.rating.toFixed(1)} <small>demo puan</small></span>
            <span><Clock3 size={15} /> {restaurant.deliveryMinutes}–{restaurant.deliveryMinutes + 10} dk</span>
            <span><Truck size={15} /> {zone ? deliveryText(zone.deliveryFeeCents) : address ? "Adres bölgenin dışında" : "Adresini seç"}</span>
          </div>
          <div className="restaurant-status-line">
            <span className={`status-dot ${status.toLowerCase()}`} />
            {status === "OPEN" ? "Şu an açık" : status === "TEMPORARILY_CLOSED" ? "Şu anda sipariş almıyor" : `${restaurant.operatingHours.opensAt}'de açılıyor`}
            <span>·</span> Min. sipariş {money(restaurant.minimumOrderCents)}
          </div>
        </div>
      </section>
      <section className="customer-container restaurant-menu-section">
        {!zone && address && <div className="zone-warning"><Info size={19} /><div><strong>Bu restoran seçtiğin mahalleye teslimat yapmıyor.</strong><span>Menüyü inceleyebilirsin; sipariş verebilmek için teslimat bölgesindeki bir adres seçmelisin.</span></div></div>}
        {!address && <div className="zone-warning"><MapPin size={19} /><div><strong>Teslimat bölgeni kontrol et.</strong><span>Bu restoranın hizmet verdiği mahalleler: {restaurant.deliveryZones.map((item) => item.neighborhood).join(", ")}.</span></div></div>}
        {status !== "OPEN" && <div className="closed-warning"><Clock3 size={18} /><span>{status === "TEMPORARILY_CLOSED" ? "Restoran geçici olarak sipariş almıyor." : `Restoran ${restaurant.operatingHours.opensAt} itibarıyla sipariş almaya başlayacak.`} Menüyü inceleyebilirsin.</span></div>}
        <div className="restaurant-menu-layout">
          <div className="restaurant-menu-main">
            <div className="menu-heading"><div><span className="customer-kicker">Taze hazırlanan</span><h2>Menü</h2></div><span className="demo-price-note">Fiyatlar demo amaçlıdır</span></div>
            <div className="menu-category-tabs">
              {categories.map((category) => <button className={activeCategory === category.name ? "active" : ""} key={category.id} onClick={() => setActiveCategory(activeCategory === category.name ? "" : category.name)} type="button">{category.name}</button>)}
            </div>
            <div className="menu-product-grid">
              {products.map((item) => (
                <button className="menu-product" disabled={status !== "OPEN" || !zone} key={item.id} onClick={() => setProduct(item)} type="button">
                  <span className="menu-product-image" style={{ backgroundImage: `url("${item.image}")` }} />
                  <span className="menu-product-info"><strong>{item.name}</strong><small>{item.description}</small><b>{money(item.priceCents)}</b></span>
                  <span className="menu-product-add"><Plus size={17} /></span>
                </button>
              ))}
            </div>
          </div>
          <aside className="restaurant-cart-aside">
            <h3><ShoppingBag size={18} /> Sepet özeti</h3>
            {cart.length > 0 && cart[0].restaurantId === restaurant.id ? (
              <>
                <div className="mini-cart-lines">{cart.map((item) => <div key={item.id}><span>{item.quantity} × {item.name}</span><strong>{money((item.unitPriceCents + item.options.reduce((sum, option) => sum + option.priceCents, 0)) * item.quantity)}</strong></div>)}</div>
                <Link className="customer-button customer-button-primary customer-button-wide" href="/sepet">Sepete git <ArrowRight size={16} /></Link>
              </>
            ) : <div className="cart-aside-empty"><ShoppingBag size={23} /><p>Menüden bir lezzet seç, sepetinde görelim.</p></div>}
            <div className="cart-aside-minimum">Minimum sipariş <strong>{money(restaurant.minimumOrderCents)}</strong></div>
          </aside>
        </div>
      </section>
      {cart.length > 0 && cart[0].restaurantId === restaurant.id && (
        <Link className="sticky-cart-button" href="/sepet"><ShoppingBag size={18} /> Sepeti görüntüle <span>{cart.reduce((sum, item) => sum + item.quantity, 0)} ürün</span></Link>
      )}
      {product && <ProductDialog onClose={() => setProduct(null)} product={product} restaurant={restaurant} />}
    </>
  );
}

export function CartPage() {
  const cart = useCustomerStore((state) => state.cart);
  const setQuantity = useCustomerStore((state) => state.setQuantity);
  const removeItem = useCustomerStore((state) => state.removeItem);
  const restaurant = cart[0] ? restaurantById(cart[0].restaurantId) : undefined;
  const restaurantStatus = restaurant ? getRestaurantStatus(restaurant) : "CLOSED";
  const address = useCustomerStore((state) => state.address);
  const zone = restaurant && address ? getDeliveryZone(restaurant, address.neighborhood) : undefined;
  const subtotal = cart.reduce((sum, item) => sum + (item.unitPriceCents + item.options.reduce((optionSum, option) => optionSum + option.priceCents, 0)) * item.quantity, 0);
  const deliveryFee = zone?.deliveryFeeCents ?? 0;
  const minimumReached = Boolean(restaurant && subtotal >= restaurant.minimumOrderCents);

  if (!cart.length || !restaurant) {
    return <section className="customer-container empty-cart-page"><span className="empty-cart-icon"><ShoppingBag size={31} /></span><span className="customer-kicker">Sepetin seni bekliyor</span><h1>Henüz bir şey eklemedin</h1><p>Mahallendeki restoranlara göz at, canının çektiği lezzeti bul.</p><Link className="customer-button customer-button-primary" href="/restoranlar">Restoranları keşfet <ArrowRight size={17} /></Link></section>;
  }

  return (
    <section className="customer-container cart-page">
      <Link className="back-link" href={`/restoran/${restaurant.slug}`}><ArrowLeft size={16} /> Menüye dön</Link>
      <div className="page-title-block"><span className="customer-kicker">Bir restorandan sipariş</span><h1>Sepetim</h1><p>{restaurant.name} <span>·</span> Demo menü</p></div>
      <div className="cart-layout">
        <div className="cart-item-list">
          <div className="cart-restaurant-heading"><div className="cart-restaurant-thumb" style={{ backgroundImage: `url("${restaurant.image}")` }} /><div><strong>{restaurant.name}</strong><small>{restaurant.cuisine}</small></div><Link href={`/restoran/${restaurant.slug}`}>Ürün ekle <Plus size={15} /></Link></div>
          {cart.map((item) => {
            const optionTotal = item.options.reduce((sum, option) => sum + option.priceCents, 0);
            return (
              <article className="cart-item" key={item.id}>
                <div className="cart-item-image" style={{ backgroundImage: `url("${item.image}")` }} />
                <div className="cart-item-copy">
                  <h3>{item.name}</h3>
                  {item.options.map((option) => <small key={option.choiceId}>{option.groupName}: {option.name}</small>)}
                  {item.note && <small>Not: {item.note}</small>}
                  <strong>{money((item.unitPriceCents + optionTotal) * item.quantity)}</strong>
                </div>
                <div className="cart-item-actions">
                  <div className="quantity-control compact">
                    <button aria-label={`${item.name} adedini azalt`} onClick={() => setQuantity(item.id, item.quantity - 1)} type="button"><Minus size={14} /></button>
                    <strong>{item.quantity}</strong>
                    <button aria-label={`${item.name} adedini artır`} onClick={() => setQuantity(item.id, item.quantity + 1)} type="button"><Plus size={14} /></button>
                  </div>
                  <button className="remove-item" onClick={() => removeItem(item.id)} type="button"><Trash2 size={14} /> Kaldır</button>
                </div>
              </article>
            );
          })}
          <div className="cart-note"><Info size={17} /><span>Ürün seçimi ve fiyatlar demo amaçlıdır. Sepetin yalnızca bu tarayıcıda saklanır.</span></div>
        </div>
        <aside className="order-summary">
          <h2>Sipariş özeti</h2>
          <div className="summary-row"><span>Ürün toplamı</span><strong>{money(subtotal)}</strong></div>
          <div className="summary-row"><span>Teslimat ücreti</span><strong>{zone ? deliveryText(deliveryFee) : "Adres seçilmeli"}</strong></div>
          <div className="summary-divider" />
          <div className="summary-row summary-total"><span>Toplam</span><strong>{money(subtotal + deliveryFee)}</strong></div>
          {!zone && <p className="summary-error">Bu restorana uygun teslimat adresi seçmelisin.</p>}
          {restaurantStatus !== "OPEN" && <p className="summary-error">Restoran şu anda sipariş almıyor.</p>}
          {restaurant && !minimumReached && <p className="summary-hint">Minimum sipariş {money(restaurant.minimumOrderCents)}. Devam etmek için {money(restaurant.minimumOrderCents - subtotal)} daha ekle.</p>}
          {minimumReached && zone && restaurantStatus === "OPEN" && <Link className="customer-button customer-button-primary customer-button-wide" href="/odeme">Siparişi tamamla <ArrowRight size={16} /></Link>}
          <div className="summary-secure"><ShieldCheck size={15} /> Ödeme alınmaz · Demo akışıdır</div>
        </aside>
      </div>
    </section>
  );
}

const phonePattern = /^(?:\+?90|0)?5\d{9}$/;

const signInSchema = z.object({
  identity: z.string().trim().min(1, "E-posta veya telefon gerekli").refine((value) => value.includes("@") ? z.string().email().safeParse(value).success : phonePattern.test(value.replace(/[\s()-]/g, "")), "Geçerli bir e-posta veya Türkiye cep telefonu gir"),
  password: z.string().min(8, "Şifre en az 8 karakter olmalı"),
});
const registerSchema = z.object({
  firstName: z.string().trim().min(2, "Adını en az 2 karakterle gir"),
  lastName: z.string().trim().min(2, "Soyadını en az 2 karakterle gir"),
  phone: z.string().trim().refine((value) => phonePattern.test(value.replace(/[\s()-]/g, "")), "Geçerli bir Türkiye cep telefonu gir"),
  email: z.string().trim().email("Geçerli bir e-posta adresi gir"),
  password: z.string().min(8, "Şifre en az 8 karakter olmalı").regex(/[A-Za-z]/, "En az bir harf kullan").regex(/\d/, "En az bir rakam kullan"),
  passwordRepeat: z.string().min(1, "Şifreni tekrar gir"),
  kvkk: z.boolean().refine(Boolean, "Devam etmek için aydınlatma metnini onaylamalısın"),
  marketingConsent: z.boolean(),
}).refine((value) => value.password === value.passwordRepeat, { message: "Şifreler eşleşmiyor", path: ["passwordRepeat"] });

type SignInValues = z.infer<typeof signInSchema>;
type RegisterValues = z.infer<typeof registerSchema>;

export function SignInPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState("");
  const form = useForm<SignInValues>({ resolver: zodResolver(signInSchema), defaultValues: { identity: "", password: "" } });
  const submit = form.handleSubmit(async (values) => {
    setMessage("");
    try {
      const result = await customerAuthService.signIn(values);
      if (result.status === "authenticated") {
        router.replace("/restoranlar");
      } else {
        setMessage(result.message);
      }
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Giriş isteği tamamlanamadı.");
    }
  });
  const startDemoPreview = () => {
    try {
      enableDemoPreview();
      router.push("/restoranlar");
    } catch (error) {
      setMessage(error instanceof Error ? `Demo önizleme başlatılamadı: ${error.message}` : "Demo önizleme başlatılamadı.");
    }
  };

  return (
    <section className="auth-page customer-container">
      <div className="auth-card">
        <Link className="auth-back" href="/"><ArrowLeft size={15} /> Ana sayfaya dön</Link>
        <span className="customer-modal-icon"><span className="auth-icon-letter">d.</span></span>
        <span className="customer-kicker">Tekrar hoş geldin</span>
        <h1>Giriş yap</h1>
        <p className="auth-subtitle">Hesabına erişmek için bilgilerini gir. Giriş servisi şu anda kullanılamıyor.</p>
        <form className="customer-form" onSubmit={submit} noValidate>
          <label>E-posta veya telefon
            <input autoComplete="username" placeholder="ornek@mail.com veya 05xx..." {...form.register("identity")} />
            {form.formState.errors.identity && <span className="field-error">{form.formState.errors.identity.message}</span>}
          </label>
          <label>Şifre
            <span className="password-input"><input autoComplete="current-password" type={showPassword ? "text" : "password"} placeholder="En az 8 karakter" {...form.register("password")} /><button aria-label={showPassword ? "Şifreyi gizle" : "Şifreyi göster"} onClick={() => setShowPassword(!showPassword)} type="button">{showPassword ? <EyeOff size={16} /> : <Eye size={16} />}</button></span>
            {form.formState.errors.password && <span className="field-error">{form.formState.errors.password.message}</span>}
          </label>
          <div className="auth-forgot"><button onClick={() => setMessage("Şifre yenileme servisi demo sürümünde kullanılmıyor.")} type="button">Şifremi unuttum</button></div>
          <button className="customer-button customer-button-primary customer-button-wide" disabled={form.formState.isSubmitting} type="submit">{form.formState.isSubmitting ? "Kontrol ediliyor…" : "Giriş yap"} <ArrowRight size={16} /></button>
        </form>
        {message && <div className="auth-demo-message" role="alert"><Info size={17} /><span>{message}</span></div>}
        <div className="demo-preview-entry">
          <span className="customer-kicker">Henüz hesap açmadın mı?</span>
          <p>Örnek restoranları ve sipariş akışını gerçek giriş yapmadan incele.</p>
          <button className="customer-button customer-button-outline customer-button-wide" onClick={startDemoPreview} type="button">Demo önizlemesini başlat <ArrowRight size={16} /></button>
          <small>Demo modu gerçek kullanıcı oturumu oluşturmaz.</small>
        </div>
        <p className="auth-switch">Henüz hesabın yok mu? <Link href="/kayit">Kayıt ol</Link></p>
        <DemoNotice>Giriş formu hazır; backend authentication henüz bağlı değil.</DemoNotice>
      </div>
    </section>
  );
}

export function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState("");
  const form = useForm<RegisterValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: { firstName: "", lastName: "", phone: "", email: "", password: "", passwordRepeat: "", kvkk: false, marketingConsent: false },
  });
  const submit = form.handleSubmit(async (values) => {
    setMessage("");
    try {
      const result = await customerAuthService.signUp({
        firstName: values.firstName,
        lastName: values.lastName,
        phone: values.phone.replace(/[\s()-]/g, ""),
        email: values.email,
        password: values.password,
      });
      if (result.status === "registered") {
        setMessage("Kayıt tamamlandı. Giriş yaparak devam edebilirsin.");
      } else {
        setMessage(result.message);
      }
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Kayıt isteği tamamlanamadı.");
    }
  });

  return (
    <section className="auth-page register-page customer-container">
      <div className="auth-card">
        <Link className="auth-back" href="/"><ArrowLeft size={15} /> Ana sayfaya dön</Link>
        <span className="customer-modal-icon"><span className="auth-icon-letter">d.</span></span>
        <span className="customer-kicker">DOYBİ ailesine katıl</span>
        <h1>Hesap oluştur</h1>
        <p className="auth-subtitle">Bilgilerini doğrula. Backend kayıt servisi henüz bağlı değil; form gönderilmez.</p>
        <form className="customer-form" onSubmit={submit} noValidate>
          <div className="customer-form-grid">
            <label>Ad<input autoComplete="given-name" {...form.register("firstName")} />{form.formState.errors.firstName && <span className="field-error">{form.formState.errors.firstName.message}</span>}</label>
            <label>Soyad<input autoComplete="family-name" {...form.register("lastName")} />{form.formState.errors.lastName && <span className="field-error">{form.formState.errors.lastName.message}</span>}</label>
          </div>
          <label>Telefon<input autoComplete="tel" inputMode="tel" placeholder="05xx xxx xx xx" {...form.register("phone")} />{form.formState.errors.phone && <span className="field-error">{form.formState.errors.phone.message}</span>}</label>
          <label>E-posta<input autoComplete="email" inputMode="email" placeholder="ornek@mail.com" {...form.register("email")} />{form.formState.errors.email && <span className="field-error">{form.formState.errors.email.message}</span>}</label>
          <div className="customer-form-grid">
            <label>Şifre<span className="password-input"><input autoComplete="new-password" type={showPassword ? "text" : "password"} {...form.register("password")} /><button aria-label={showPassword ? "Şifreyi gizle" : "Şifreyi göster"} onClick={() => setShowPassword(!showPassword)} type="button">{showPassword ? <EyeOff size={16} /> : <Eye size={16} />}</button></span>{form.formState.errors.password && <span className="field-error">{form.formState.errors.password.message}</span>}</label>
            <label>Şifre tekrar<input autoComplete="new-password" type={showPassword ? "text" : "password"} {...form.register("passwordRepeat")} />{form.formState.errors.passwordRepeat && <span className="field-error">{form.formState.errors.passwordRepeat.message}</span>}</label>
          </div>
          <details className="kvkk-details" id="kvkk">
            <summary>KVKK Aydınlatma Metni özeti</summary>
            <p>Bu önizlemede kişisel bilgiler sunucuya gönderilmez veya kaydedilmez. Gerçek kayıt öncesinde veri sorumlusu, işleme amaçları, hukuki sebepler, saklama süresi ve ilgili kişi haklarını içeren aydınlatma metni yayımlanmalıdır. Bu özet resmi hukuki metin değildir.</p>
          </details>
          <label className="consent-check"><input type="checkbox" {...form.register("kvkk")} /><span>Aydınlatma metni önizlemesini okudum.</span></label>
          {form.formState.errors.kvkk && <span className="field-error">{form.formState.errors.kvkk.message}</span>}
          <label className="consent-check"><input type="checkbox" {...form.register("marketingConsent")} /><span>Kampanya ve duyurular hakkında bilgilendirilmek istiyorum. (İsteğe bağlı)</span></label>
          <button className="customer-button customer-button-primary customer-button-wide" disabled={form.formState.isSubmitting} type="submit">{form.formState.isSubmitting ? "Doğrulanıyor…" : "Bilgileri doğrula"} <ArrowRight size={16} /></button>
        </form>
        {message && <div className="auth-demo-message" role="alert"><Info size={17} /><span>{message}</span></div>}
        <p className="auth-switch">Zaten hesabın var mı? <Link href="/giris">Giriş yap</Link></p>
        <DemoNotice>Form geçerliliği kontrol edilir; henüz kayıt işlemi yapılmaz ve bilgiler gönderilmez.</DemoNotice>
      </div>
    </section>
  );
}

const checkoutSchema = z.object({
  phone: z.string().trim().refine((value) => phonePattern.test(value.replace(/[\s()-]/g, "")), "Geçerli bir Türkiye cep telefonu gir"),
  note: z.string().max(250, "Not en fazla 250 karakter olabilir"),
  paymentMethod: z.enum(["CASH_ON_DELIVERY", "CARD_ON_DELIVERY"]),
});
type CheckoutValues = z.infer<typeof checkoutSchema>;

export function CheckoutPage() {
  const router = useRouter();
  const cart = useCustomerStore((state) => state.cart);
  const address = useCustomerStore((state) => state.address);
  const placeDemoOrder = useCustomerStore((state) => state.placeDemoOrder);
  const restaurant = cart[0] ? restaurantById(cart[0].restaurantId) : undefined;
  const restaurantStatus = restaurant ? getRestaurantStatus(restaurant) : "CLOSED";
  const zone = restaurant && address ? getDeliveryZone(restaurant, address.neighborhood) : undefined;
  const subtotal = cart.reduce((sum, item) => sum + (item.unitPriceCents + item.options.reduce((optionSum, option) => optionSum + option.priceCents, 0)) * item.quantity, 0);
  const form = useForm<CheckoutValues>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: { phone: "", note: "", paymentMethod: restaurant?.paymentMethods[0] ?? "CASH_ON_DELIVERY" },
  });
  const selectedPaymentMethod = useWatch({ control: form.control, name: "paymentMethod" });

  if (!cart.length || !restaurant) {
    return <section className="customer-container empty-cart-page"><span className="empty-cart-icon"><ShoppingBag size={31} /></span><h1>Önce sepetine ürün ekle</h1><p>Demo sipariş akışına geçmek için bir restoran seç.</p><Link className="customer-button customer-button-primary" href="/restoranlar">Restoranları keşfet <ArrowRight size={17} /></Link></section>;
  }
  if (!address || !zone) {
    return <section className="customer-container empty-cart-page"><span className="empty-cart-icon"><MapPin size={31} /></span><h1>Teslimat adresini kontrol et</h1><p>{address ? "Bu restoran seçtiğin mahalleye teslimat yapmıyor." : "Siparişi tamamlamadan önce teslimat adresi seçmelisin."}</p><Link className="customer-button customer-button-primary" href="/sepet">Sepete dön</Link><DemoNotice /></section>;
  }
  if (subtotal < restaurant.minimumOrderCents) {
    return <section className="customer-container empty-cart-page"><span className="empty-cart-icon"><ShoppingBag size={31} /></span><h1>Minimum sipariş tutarına ulaşmadın</h1><p>Devam etmek için {money(restaurant.minimumOrderCents - subtotal)} tutarında ürün daha ekle.</p><Link className="customer-button customer-button-primary" href={`/restoran/${restaurant.slug}`}>Menüye dön <ArrowRight size={17} /></Link></section>;
  }
  if (restaurantStatus !== "OPEN") {
    return <section className="customer-container empty-cart-page"><span className="empty-cart-icon"><Clock3 size={31} /></span><h1>Restoran şu anda sipariş almıyor</h1><p>Menüyü daha sonra tekrar kontrol edebilir veya açık restoranları keşfedebilirsin.</p><Link className="customer-button customer-button-primary" href="/restoranlar">Açık restoranları gör <ArrowRight size={17} /></Link></section>;
  }

  const submit = form.handleSubmit((values) => {
    if (getRestaurantStatus(restaurant) !== "OPEN") {
      form.setError("root", { message: "Restoran şu anda sipariş almıyor. Sepetin korunuyor." });
      return;
    }
    const orderId = placeDemoOrder({
      restaurantId: restaurant.id,
      restaurantName: restaurant.name,
      items: cart,
      address,
      phone: values.phone,
      note: values.note,
      paymentMethod: values.paymentMethod as PaymentMethod,
      subtotalCents: subtotal,
      deliveryFeeCents: zone.deliveryFeeCents,
      totalCents: subtotal + zone.deliveryFeeCents,
    });
    router.push(`/siparislerim?demo=${encodeURIComponent(orderId)}`);
  });

  return (
    <section className="customer-container checkout-page">
      <Link className="back-link" href="/sepet"><ArrowLeft size={16} /> Sepete dön</Link>
      <div className="page-title-block"><span className="customer-kicker">Son bir kontrol</span><h1>Siparişi tamamla</h1><p>Bu işlem yalnızca demo akışıdır; gerçek sipariş oluşturulmaz.</p></div>
      <div className="checkout-layout">
        <form className="checkout-form" onSubmit={submit} noValidate>
          <section className="checkout-card">
            <div className="checkout-card-heading"><span>01</span><div><h2>Teslimat adresi</h2><p>Restoran kendi kuryesiyle teslimat yapar.</p></div></div>
            <div className="checkout-address"><MapPin size={19} /><div><strong>{address.neighborhood}, Süleymanpaşa</strong><span>{address.street} No: {address.buildingNumber}{address.apartmentNumber ? `, Daire ${address.apartmentNumber}` : ""}</span>{address.directions && <small>{address.directions}</small>}</div></div>
          </section>
          <section className="checkout-card">
            <div className="checkout-card-heading"><span>02</span><div><h2>İletişim bilgisi</h2><p>Kurye teslimat için bu numarayı kullanabilir.</p></div></div>
            <label>Telefon numarası<input autoComplete="tel" inputMode="tel" placeholder="05xx xxx xx xx" {...form.register("phone")} /></label>
            {form.formState.errors.phone && <span className="field-error">{form.formState.errors.phone.message}</span>}
            <label>Sipariş notu <span className="optional-label">İsteğe bağlı</span><textarea maxLength={250} placeholder="Kurye veya restoran için notun" {...form.register("note")} /></label>
            {form.formState.errors.note && <span className="field-error">{form.formState.errors.note.message}</span>}
          </section>
          <section className="checkout-card">
            <div className="checkout-card-heading"><span>03</span><div><h2>Ödeme yöntemi</h2><p>Restoranın desteklediği seçeneklerden biri.</p></div></div>
            {restaurant.paymentMethods.map((method) => (
              <label className="payment-option" key={method}>
                <input type="radio" value={method} {...form.register("paymentMethod")} />
                <span className="payment-icon"><CreditCard size={19} /></span>
                <span>{method === "CASH_ON_DELIVERY" ? "Kapıda nakit" : "Kapıda kart"}</span>
                {selectedPaymentMethod === method && <CheckCircle2 className="payment-selected" size={18} />}
              </label>
            ))}
          </section>
          <div className="checkout-demo-warning"><Info size={18} /><p><strong>Önemli:</strong> Bu işlem demo amaçlıdır. Gerçek sipariş oluşturulmaz, ödeme alınmaz ve restoranla iletişime geçilmez.</p></div>
          {form.formState.errors.root && <p className="summary-error">{form.formState.errors.root.message}</p>}
          <button className="customer-button customer-button-primary customer-button-wide checkout-submit" type="submit">Demo sipariş akışını tamamla · {money(subtotal + zone.deliveryFeeCents)} <ArrowRight size={17} /></button>
        </form>
        <aside className="order-summary checkout-summary">
          <h2>Sipariş özeti</h2><p className="checkout-restaurant-name">{restaurant.name} <span>· Demo restoran</span></p>
          {cart.map((item) => <div className="checkout-item" key={item.id}><span>{item.quantity} × {item.name}</span><strong>{money((item.unitPriceCents + item.options.reduce((sum, option) => sum + option.priceCents, 0)) * item.quantity)}</strong></div>)}
          <div className="summary-divider" />
          <div className="summary-row"><span>Ürün toplamı</span><strong>{money(subtotal)}</strong></div>
          <div className="summary-row"><span>Teslimat ücreti</span><strong>{deliveryText(zone.deliveryFeeCents)}</strong></div>
          <div className="summary-divider" />
          <div className="summary-row summary-total"><span>Toplam</span><strong>{money(subtotal + zone.deliveryFeeCents)}</strong></div>
          <div className="summary-secure"><ShieldCheck size={15} /> Gerçek ödeme alınmaz</div>
        </aside>
      </div>
    </section>
  );
}

const orderSteps: { status: OrderStatus; title: string; description: string }[] = [
  { status: "CREATED", title: "Sipariş oluşturuldu", description: "Demo akışı başlatıldı." },
  { status: "RESTAURANT_CONFIRMED", title: "Restoran onayladı", description: "Restoran siparişini gördü." },
  { status: "PREPARING", title: "Hazırlanıyor", description: "Siparişin hazırlanıyor." },
  { status: "WITH_COURIER", title: "Kuryeye verildi", description: "Restoranın kuryesi yola çıktı." },
  { status: "DELIVERED", title: "Teslim edildi", description: "Demo sipariş akışı tamamlandı." },
];

function DemoOrderCard({ orderId }: { orderId: string }) {
  const order = useCustomerStore((state) => state.orders.find((item) => item.id === orderId));
  const advance = useCustomerStore((state) => state.advanceDemoOrder);
  if (!order) return null;
  const currentStep = orderSteps.findIndex((step) => step.status === order.status);

  return (
    <article className="demo-order-card">
      <div className="demo-order-heading">
        <span className="demo-order-icon"><ShoppingBag size={19} /></span>
        <div><span className="demo-order-label">DEMO SİPARİŞ · {order.id}</span><h2>{order.restaurantName}</h2><small>{new Date(order.createdAt).toLocaleString("tr-TR")}</small></div>
        <strong className="demo-order-total">{money(order.totalCents)}</strong>
      </div>
      <div className="order-progress">
        {orderSteps.map((step, index) => (
          <div className={`order-progress-step ${index <= currentStep ? "completed" : ""} ${index === currentStep ? "current" : ""}`} key={step.status}>
            <span className="progress-marker">{index < currentStep ? <Check size={13} /> : index + 1}</span>
            <span className="progress-copy"><strong>{step.title}</strong><small>{step.description}</small></span>
          </div>
        ))}
      </div>
      <div className="demo-order-detail">
        <div><strong>Ürünler</strong><span>{order.items.map((item) => `${item.quantity} × ${item.name}`).join(" · ")}</span></div>
        <div><strong>Teslimat adresi</strong><span>{order.address.neighborhood}, {order.address.street} No: {order.address.buildingNumber}, Süleymanpaşa</span></div>
        <div><strong>Ödeme</strong><span>{order.paymentMethod === "CASH_ON_DELIVERY" ? "Kapıda nakit" : "Kapıda kart"} · Ödeme alınmadı</span></div>
      </div>
      {currentStep < orderSteps.length - 1 && <button className="customer-button customer-button-outline demo-advance-button" onClick={() => advance(order.id)} type="button">Demo durumunu ilerlet <ArrowRight size={16} /></button>}
      <p className="demo-order-disclaimer"><Info size={15} /> Bu kayıt yalnızca bu tarayıcıda saklanan demo verisidir. Gerçek sipariş değildir.</p>
    </article>
  );
}

export function OrdersPage({ highlightedOrderId = "" }: { highlightedOrderId?: string }) {
  const orders = useCustomerStore((state) => state.orders);
  return (
    <section className="customer-container orders-page">
      <div className="page-title-block"><span className="customer-kicker">Sipariş yolculuğun</span><h1>Siparişlerim</h1><p>Bu tarayıcıda tamamladığın demo siparişler.</p></div>
      <DemoNotice>Burada yalnızca demo akışıyla oluşturulan kayıtlar görünür.</DemoNotice>
      {orders.length ? <div className="orders-list">{orders.map((order) => <div className={order.id === highlightedOrderId ? "highlighted-order" : ""} key={order.id}><DemoOrderCard orderId={order.id} /></div>)}</div> : (
        <div className="orders-empty"><span className="empty-cart-icon"><ShoppingBag size={29} /></span><h2>Henüz demo siparişin yok</h2><p>Bir restoran seçip demo sipariş akışını deneyebilirsin.</p><Link className="customer-button customer-button-primary" href="/restoranlar">Restoranları keşfet <ArrowRight size={16} /></Link></div>
      )}
    </section>
  );
}

export function AccountPage() {
  const address = useCustomerStore((state) => state.address);
  const orderCount = useCustomerStore((state) => state.orders.length);
  return (
    <section className="customer-container account-page">
      <div className="page-title-block"><span className="customer-kicker">Kişisel alanın</span><h1>Hesabım</h1><p>Henüz bir hesapla giriş yapılmadı.</p></div>
      <div className="account-demo-card"><span className="customer-modal-icon"><UserRoundPlaceholder /></span><div><span className="customer-kicker">Demo deneyimi</span><h2>Hesap özellikleri henüz etkin değil</h2><p>Gerçek kayıt ve giriş sistemi bağlanmadığı için profil veya kullanıcı oturumu oluşturulmaz.</p><div className="account-actions"><Link className="customer-button customer-button-primary" href="/giris">Giriş yap</Link><Link className="customer-button customer-button-outline" href="/kayit">Kayıt ol</Link></div></div></div>
      <div className="account-shortcuts">
        <Link href="/siparislerim"><span><ShoppingBag size={19} /></span><div><strong>Demo siparişlerim</strong><small>{orderCount ? `${orderCount} demo siparişi` : "Henüz sipariş yok"}</small></div><ChevronRight size={18} /></Link>
        <a href="#" onClick={(event) => { event.preventDefault(); window.dispatchEvent(new CustomEvent("doybi:open-address")); }}><span><MapPin size={19} /></span><div><strong>Teslimat adresim</strong><small>{address ? `${address.neighborhood}, Süleymanpaşa` : "Henüz adres seçilmedi"}</small></div><ChevronRight size={18} /></a>
      </div>
    </section>
  );
}

function UserRoundPlaceholder() {
  return <span className="account-avatar">D</span>;
}
