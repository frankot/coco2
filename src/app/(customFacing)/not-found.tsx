import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center px-4 text-center">
      <div className="max-w-md rounded-2xl bg-white/80 p-10 shadow-lg backdrop-blur-sm">
        <p className="text-7xl font-bold text-primary">404</p>
        <h1 className="mt-4 text-2xl font-semibold text-foreground">
          Strona nie znaleziona
        </h1>
        <p className="mt-3 text-muted-foreground">
          Wygląda na to, że ta strona nie istnieje lub została przeniesiona.
          Sprawdź adres lub wróć do sklepu.
        </p>
        <Link
          href="/sklep"
          className="mt-8 inline-block rounded-lg bg-primary px-8 py-3 font-medium text-primary-foreground transition hover:brightness-110"
        >
          Wróć do sklepu
        </Link>
      </div>
    </div>
  );
}
