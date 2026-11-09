import { RestaurantsPage } from "@/features/customer/pages";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; kategori?: string }>;
}) {
  const params = await searchParams;
  return <RestaurantsPage query={params.q ?? ""} category={params.kategori ?? ""} />;
}
