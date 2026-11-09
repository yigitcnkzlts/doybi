import { RestaurantPage } from "@/features/customer/pages";

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <RestaurantPage slug={slug} />;
}
