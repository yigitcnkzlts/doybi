import { OrdersPage } from "@/features/customer/pages";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ demo?: string }>;
}) {
  const params = await searchParams;
  return <OrdersPage highlightedOrderId={params.demo ?? ""} />;
}
