// @ts-nocheck
import PageHeader from "../../_components/pageHeader";
import ProductForm from "../_components/ProductForm";
import prisma from "@/db";
import { notFound } from "next/navigation";

export default async function Page({ params }) {
    const id = params.id;
    
    const product = await prisma.product.findUnique({
        where: { id }
    });
    
    if (!product) {
        notFound();
    }
    
    return (
        <>
          <PageHeader>Edytuj produkt</PageHeader>
          <ProductForm product={product} />
        </>
    );
}
