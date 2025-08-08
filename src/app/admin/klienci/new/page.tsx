import PageHeader from "../../_components/pageHeader";
import ClientForm from "../_components/ClientForm";
import { Suspense } from "react";
import AdminLoading from "../../loading";

export default function NewClientPage() {
  return (
    <Suspense fallback={<AdminLoading />}>
      <div>
        <PageHeader>Dodaj nowego klienta</PageHeader>
        <ClientForm />
      </div>
    </Suspense>
  );
}
