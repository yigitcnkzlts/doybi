"use client"; import {ChevronDown} from "lucide-react"; import {useState} from "react";
const faqs=[
['DOYBİ nedir?','DOYBİ, restoranların online siparişlerini, menülerini ve kazanç görünümünü tek yerden yönetmesini hedefleyen bir yemek sipariş platformudur.'],
['Restoranımı nasıl kaydedebilirim?','Başvuru formunu doldurduktan sonra bilgileriniz değerlendirilir. Bu demo sürümünde gönderilen bilgiler gerçek bir başvuru oluşturmaz.'],
['Komisyon oranları nasıl belirlenir?','Komisyon ve diğer ticari koşullar; bölge, işletme modeli ve sözleşme koşullarına göre başvuru sürecinde netleştirilecektir.'],
['Kendi kuryemle teslimat yapabilir miyim?','Evet. DOYBİ’nin ilk aşamasında restoranların kendi kurye operasyonlarıyla teslimat yapması planlanmaktadır.'],
['Menü fiyatlarını kendim değiştirebilir miyim?','Evet. Hedeflenen panel deneyiminde ürün, fiyat, kategori ve ürün aktifliği restoran tarafından yönetilebilir.'],
['Siparişleri nereden göreceğim?','Siparişlerin web tabanlı restoran panelinde anlık bildirim ve durum bilgileriyle gösterilmesi planlanmaktadır.'],
['Bilgisayarım olmadan kullanabilir miyim?','Arayüz telefon ve tablet ekranlarına uyumlu tasarlanmıştır; desteklenen bir tarayıcı üzerinden kullanılabilir.'],
['Ödemeler nasıl gerçekleşir?','Ödeme takvimi ve mutabakat koşulları henüz kesinleşmemiştir. Güncel şartlar sözleşme öncesinde açıkça paylaşılacaktır.']];
export function FAQ(){const [active,setActive]=useState<number|null>(0);return <div className="divide-y divide-[#166534]/10 rounded-[28px] border border-[#166534]/10 bg-white px-5 sm:px-8">{faqs.map(([q,a],i)=><div key={q}><button onClick={()=>setActive(active===i?null:i)} className="flex w-full items-center justify-between gap-5 py-6 text-left font-bold" aria-expanded={active===i}><span>{q}</span><ChevronDown className={`h-5 w-5 shrink-0 transition ${active===i?'rotate-180':''}`}/></button>{active===i&&<p className="max-w-3xl pb-6 text-sm leading-7 text-[#617067]">{a}</p>}</div>)}</div>}
