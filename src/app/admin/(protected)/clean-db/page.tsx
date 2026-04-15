import { notFound } from "next/navigation";
import CleanDbClient from "./CleanDbClient";

export default function CleanDbPage() {
  if (process.env.NODE_ENV === "production") notFound();
  return <CleanDbClient />;
}
