import { Card } from "@/components/ui/card";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Polityka cookies | Dr.Coco",
  description:
    "Polityka cookies serwisu Dr.Coco (drcoco.pl). Zasady stosowania plików cookies i technologii śledzących.",
  alternates: {
    canonical: "https://drcoco.pl/cookies",
  },
  openGraph: {
    title: "Polityka cookies | Dr.Coco",
    description:
      "Polityka cookies serwisu drcoco.pl – zasady stosowania plików cookies i technologii śledzących.",
    url: "https://drcoco.pl/cookies",
    type: "website",
  },
};

export default function CookiesPage() {
  return (
    <div className="container mx-auto px-4 md:px-6 lg:px-8 py-8 md:py-12 lg:mt-16 max-w-5xl">
      <h1 className="text-3xl md:text-4xl font-bold mb-8 text-center">Polityka cookies</h1>

      <Card className="p-6 md:p-8 lg:p-10">
        <div className="prose prose-sm md:prose-base max-w-none space-y-6">
          <section>
            <p className="font-semibold">POLITYKA COOKIES SERWISU DRCOCO.PL</p>
            <p className="font-semibold">§1 Postanowienia ogólne</p>
            <p>
              Niniejsza Polityka Cookies określa zasady stosowania plików cookies oraz podobnych
              technologii w serwisie internetowym dostępnym pod adresem https://drcoco.pl (dalej:
              „Serwis"), prowadzonym przez NEW AGE FOOD Sp. z o.o., ul. Modlińska 29a, 05-110
              Jabłonna, NIP: 7011015138, REGON: 388004313 (dalej: „Administrator").
            </p>
          </section>

          <section>
            <h2 className="text-xl md:text-2xl font-bold mb-4">§2 Czym są pliki cookies?</h2>
            <p>
              Pliki cookies (tzw. „ciasteczka") to małe pliki tekstowe zapisywane na urządzeniu
              końcowym użytkownika (komputerze, telefonie, tablecie) podczas korzystania z Serwisu.
              Cookies są odczytywane przez serwer przy każdym kolejnym połączeniu z Serwisem z
              tego urządzenia.
            </p>
          </section>

          <section>
            <h2 className="text-xl md:text-2xl font-bold mb-4">§3 Rodzaje stosowanych cookies</h2>
            <p>Administrator stosuje następujące rodzaje plików cookies:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <strong>Niezbędne</strong> – konieczne do prawidłowego funkcjonowania Serwisu,
                obsługi sesji użytkownika oraz koszyka zakupowego. Bez tych plików Serwis nie
                działa poprawnie.
              </li>
              <li>
                <strong>Funkcjonalne</strong> – pozwalają zapamiętać preferencje użytkownika (np.
                zapamiętanie zalogowania, języka).
              </li>
              <li>
                <strong>Analityczne</strong> – umożliwiają zbieranie anonimowych danych
                statystycznych o sposobie korzystania z Serwisu (np. Google Analytics). Pomagają
                ulepszać działanie strony.
              </li>
              <li>
                <strong>Marketingowe</strong> – służą do wyświetlania spersonalizowanych reklam.
                Stosowane wyłącznie za zgodą użytkownika.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl md:text-2xl font-bold mb-4">
              §4 Cel stosowania plików cookies
            </h2>
            <p>Pliki cookies są wykorzystywane w celu:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>utrzymania sesji użytkownika po zalogowaniu,</li>
              <li>przechowywania zawartości koszyka zakupowego,</li>
              <li>zapamiętywania preferencji użytkownika,</li>
              <li>analizy ruchu i zachowania użytkowników w Serwisie,</li>
              <li>obsługi płatności elektronicznych (Stripe),</li>
              <li>zapewnienia bezpieczeństwa transakcji.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl md:text-2xl font-bold mb-4">
              §5 Okres przechowywania cookies
            </h2>
            <p>W Serwisie stosowane są dwa rodzaje cookies pod względem czasu trwania:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <strong>Sesyjne</strong> – przechowywane do momentu zamknięcia przeglądarki.
              </li>
              <li>
                <strong>Trwałe</strong> – przechowywane przez określony czas wskazany w parametrach
                pliku cookie (zazwyczaj od kilku dni do 2 lat), niezależnie od zamknięcia
                przeglądarki.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl md:text-2xl font-bold mb-4">
              §6 Zarządzanie plikami cookies
            </h2>
            <p>
              Użytkownik może w każdej chwili zmienić ustawienia dotyczące plików cookies w swojej
              przeglądarce internetowej, w tym całkowicie zablokować ich zapisywanie lub usunąć
              już zapisane pliki. Szczegółowe instrukcje dostępne są w ustawieniach przeglądarki:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                Chrome:{" "}
                <em>Ustawienia → Prywatność i bezpieczeństwo → Pliki cookie i inne dane witryn</em>
              </li>
              <li>
                Firefox:{" "}
                <em>Ustawienia → Prywatność i bezpieczeństwo → Ciasteczka i dane witryn</em>
              </li>
              <li>
                Safari: <em>Preferencje → Prywatność → Zarządzaj danymi witryn</em>
              </li>
              <li>
                Edge:{" "}
                <em>Ustawienia → Prywatność, wyszukiwanie i usługi → Pliki cookie i dane witryn</em>
              </li>
            </ul>
            <p className="mt-3">
              Wyłączenie cookies niezbędnych może uniemożliwić prawidłowe korzystanie z Serwisu,
              w tym składanie zamówień i logowanie.
            </p>
          </section>

          <section>
            <h2 className="text-xl md:text-2xl font-bold mb-4">§7 Cookies podmiotów trzecich</h2>
            <p>
              W Serwisie mogą być stosowane cookies podmiotów trzecich, m.in.:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <strong>Stripe</strong> – obsługa płatności online. Polityka prywatności:{" "}
                <a
                  href="https://stripe.com/pl/privacy"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  stripe.com/pl/privacy
                </a>
              </li>
              <li>
                <strong>Google Analytics</strong> – analiza ruchu w Serwisie. Polityka prywatności:{" "}
                <a
                  href="https://policies.google.com/privacy"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  policies.google.com/privacy
                </a>
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl md:text-2xl font-bold mb-4">§8 Zmiany Polityki Cookies</h2>
            <p>
              Administrator zastrzega sobie prawo do zmiany niniejszej Polityki Cookies w
              dowolnym czasie. Zmiany wchodzą w życie z chwilą ich opublikowania w Serwisie.
              Dalsze korzystanie z Serwisu po wprowadzeniu zmian oznacza ich akceptację.
            </p>
          </section>

          <section>
            <h2 className="text-xl md:text-2xl font-bold mb-4">§9 Kontakt</h2>
            <p>
              W sprawach dotyczących plików cookies prosimy o kontakt pod adresem e-mail:{" "}
              <a href="mailto:kontakt@drcoco.pl" className="text-primary hover:underline">
                kontakt@drcoco.pl
              </a>
            </p>
          </section>
        </div>
      </Card>
    </div>
  );
}
