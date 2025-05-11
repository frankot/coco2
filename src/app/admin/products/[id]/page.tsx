import PageHeader from "../../_components/pageHeader";
import ProductForm from "../_components/ProductForm";
import prisma from "@/db";


export default async function NewProductsNewPage({params: {id}}: {params: {id: string}}) {

    const product = await prisma.product.findUnique({
        where: {
            id: id
        }
    })
  return (
    <>
      <PageHeader>Edytuj produkt</PageHeader>
      <ProductForm product={product} />
    </>
  );
}
