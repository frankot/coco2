// @ts-nocheck
import PageHeader from "../../_components/pageHeader";
import ClientForm from "../_components/ClientForm";
import prisma from "@/db";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import AdminLoading from "../../loading";

export default async function EditClientPage({ params }) {
  const id = params.id;

  return (
    <Suspense fallback={<AdminLoading />}>
      <EditClientContent id={id} />
    </Suspense>
  );
}

async function EditClientContent({ id }: { id: string }) {
  const client = await prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      email: true,
      accountType: true,
    },
  });

  if (!client) {
    notFound();
  }

  return (
    <>
      <PageHeader>Edytuj klienta</PageHeader>
      <ClientForm client={client} />
    </>
  );
}
