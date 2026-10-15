import { getVisibleProducts } from "@/lib/products-public";
import ShopClient from "./ShopClient";

export default async function ShopPage() {
  const products = await getVisibleProducts();

  return (
    <div className="min-h-screen lg:mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <h1 className="text-3xl lg:text-4xl font-bold text-primary mb-6">Woda kokosowa Dr.Coco</h1>
        <ShopClient products={products} />
      </div>
    </div>
  );
}
