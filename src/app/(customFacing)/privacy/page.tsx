import { Card } from "@/components/ui/card";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Polityka prywatnosci",
  description:
    "Polityka prywatnosci serwisu Dr.Coco (drcoco.pl). Zasady przetwarzania danych osobowych i cookies.",
  alternates: {
    canonical: "https://drcoco.pl/privacy",
  },
  openGraph: {
    title: "Polityka prywatnosci | Dr.Coco",
    description:
      "Polityka prywatnosci serwisu drcoco.pl - zasady przetwarzania danych osobowych i cookies.",
    url: "https://drcoco.pl/privacy",
    type: "website",
  },
};

export default function PrivacyPage() {
  return (
    <div className="container mx-auto px-4 md:px-6 lg:px-8 py-8 md:py-12 lg:mt-16 max-w-5xl">
      <h1 className="text-3xl md:text-4xl font-bold mb-8 text-center">Polityka prywatnosci</h1>

      <Card className="p-6 md:p-8 lg:p-10">
        <div className="prose prose-sm md:prose-base max-w-none space-y-6">
          <section>
            <p className="font-semibold">POLITYKA PRYWATNOSCI SERWISU DRCOCO.PL</p>
            <p className="font-semibold">§1 Postanowienia ogolne</p>
            <p>
              Niniejsza Polityka Prywatnosci okresla zasady przetwarzania danych osobowych
              uzytkownikow korzystajacych ze strony internetowej dostepnej pod adresem:
              https://drcoco.pl (dalej: „Serwis”).
            </p>
            <p>
              Administratorem danych osobowych jest: NEW AGE FOOD sp. z o.o. ul. Modlinska 29a
              05-110 Jablonna NIP: 7011015138 REGON: 388004313 (dalej: „Administrator”).
            </p>
            <p>Kontakt z Administratorem mozliwy jest pod adresem e-mail: kontakt@drcoco.pl</p>
          </section>

          <section>
            <h2 className="text-xl md:text-2xl font-bold mb-4">
              §2 Podstawa prawna przetwarzania danych
            </h2>
            <p>Dane osobowe przetwarzane sa zgodnie z:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Rozporzadzeniem Parlamentu Europejskiego i Rady (UE) 2016/679 (RODO),</li>
              <li>ustawa o ochronie danych osobowych,</li>
              <li>ustawa o swiadczeniu uslug droga elektroniczna,</li>
              <li>ustawa Prawo telekomunikacyjne.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl md:text-2xl font-bold mb-4">§3 Zakres przetwarzanych danych</h2>
            <p>Administrator moze przetwarzac nastepujace dane osobowe:</p>
            <p className="font-semibold">Dane podawane przy skladaniu zamowienia:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>imie i nazwisko,</li>
              <li>adres dostawy,</li>
              <li>adres e-mail,</li>
              <li>numer telefonu,</li>
              <li>dane firmy (jesli dotyczy – nazwa, adres, NIP).</li>
            </ul>
            <p className="font-semibold">Dane marketingowe:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>adres e-mail (newsletter),</li>
              <li>
                dane analityczne i marketingowe (np. identyfikatory cookies, piksele reklamowe).
              </li>
            </ul>
            <p className="font-semibold">Dane techniczne:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>adres IP,</li>
              <li>dane o urzadzeniu i przegladarce,</li>
              <li>dane statystyczne dotyczace korzystania z Serwisu.</li>
            </ul>
            <p>
              Podanie danych jest dobrowolne, ale niezbedne do realizacji zamowienia lub uslugi.
            </p>
          </section>

          <section>
            <h2 className="text-xl md:text-2xl font-bold mb-4">§4 Cele przetwarzania danych</h2>
            <p>Dane przetwarzane sa w celu:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>realizacji zamowien i obslugi sprzedazy,</li>
              <li>obslugi platnosci elektronicznych,</li>
              <li>obslugi konta klienta (jesli dotyczy),</li>
              <li>prowadzenia komunikacji z klientem,</li>
              <li>wysylki newslettera (za zgoda),</li>
              <li>prowadzenia dzialan marketingowych,</li>
              <li>analizy ruchu na stronie i optymalizacji sprzedazy,</li>
              <li>realizacji obowiazkow prawnych,</li>
              <li>dochodzenia roszczen lub obrony przed roszczeniami.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl md:text-2xl font-bold mb-4">§5 Platnosci</h2>
            <p>
              Platnosci elektroniczne realizowane sa za posrednictwem operatora platnosci Stripe.
            </p>
            <p>
              Dane niezbedne do realizacji platnosci moga byc przekazywane operatorowi platnosci
              zgodnie z jego regulaminem i polityka prywatnosci.
            </p>
          </section>

          <section>
            <h2 className="text-xl md:text-2xl font-bold mb-4">§6 Newsletter</h2>
            <p>
              Uzytkownik moze zapisac sie do newslettera poprzez podanie adresu e-mail i wyrazenie
              zgody marketingowej.
            </p>
            <p>Dane przetwarzane sa do czasu:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>cofniecia zgody,</li>
              <li>zakonczenia prowadzenia newslettera.</li>
            </ul>
            <p>
              Z newslettera mozna wypisac sie w kazdej chwili poprzez link w wiadomosci lub kontakt
              z Administratorem.
            </p>
          </section>

          <section>
            <h2 className="text-xl md:text-2xl font-bold mb-4">§7 Odbiorcy danych</h2>
            <p>
              Dane moga byc przekazywane podmiotom wspolpracujacym z Administratorem, w
              szczegolnosci:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>dostawcy hostingu,</li>
              <li>operatorowi platnosci Stripe,</li>
              <li>dostawcom systemow mailingowych,</li>
              <li>dostawcom narzedzi marketingowych i reklamowych (np. Meta Ads),</li>
              <li>firmom IT,</li>
              <li>biurom ksiegowym,</li>
              <li>kancelariom prawnym.</li>
            </ul>
            <p>Dane nie sa sprzedawane podmiotom trzecim.</p>
          </section>

          <section>
            <h2 className="text-xl md:text-2xl font-bold mb-4">
              §8 Reklama i marketing – Meta Ads
            </h2>
            <p>
              Serwis moze korzystac z narzedzi marketingowych Meta (Facebook, Instagram), w tym
              pikseli reklamowych umozliwiajacych analize skutecznosci reklam i dopasowanie tresci
              marketingowych.
            </p>
          </section>

          <section>
            <h2 className="text-xl md:text-2xl font-bold mb-4">§9 Okres przechowywania danych</h2>
            <p>Dane przechowywane sa przez okres:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>realizacji zamowienia i obslugi klienta,</li>
              <li>wymagany przepisami podatkowymi i ksiegowymi,</li>
              <li>do czasu cofniecia zgody marketingowej,</li>
              <li>do czasu przedawnienia roszczen.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl md:text-2xl font-bold mb-4">§10 Prawa uzytkownika</h2>
            <p>Uzytkownik ma prawo do:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>dostepu do danych,</li>
              <li>sprostowania danych,</li>
              <li>usuniecia danych,</li>
              <li>ograniczenia przetwarzania,</li>
              <li>przeniesienia danych,</li>
              <li>sprzeciwu wobec przetwarzania,</li>
              <li>cofniecia zgody w dowolnym momencie.</li>
            </ul>
            <p>
              Uzytkownik ma rowniez prawo wniesienia skargi do Prezesa Urzedu Ochrony Danych
              Osobowych.
            </p>
          </section>

          <section>
            <h2 className="text-xl md:text-2xl font-bold mb-4">§11 Pliki cookies</h2>
            <p>Serwis wykorzystuje pliki cookies w celu:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>zapewnienia prawidlowego dzialania strony,</li>
              <li>analizy ruchu,</li>
              <li>prowadzenia dzialan marketingowych.</li>
            </ul>
            <p>Uzytkownik moze zarzadzac cookies poprzez ustawienia przegladarki.</p>
          </section>

          <section>
            <h2 className="text-xl md:text-2xl font-bold mb-4">§12 Bezpieczenstwo danych</h2>
            <p>
              Administrator stosuje odpowiednie srodki techniczne i organizacyjne zapewniajace
              ochrone danych osobowych.
            </p>
          </section>

          <section>
            <h2 className="text-xl md:text-2xl font-bold mb-4">§13 Zmiany polityki prywatnosci</h2>
            <p>
              Administrator moze wprowadzac zmiany w Polityce Prywatnosci. Aktualna wersja
              publikowana jest w Serwisie.
            </p>
          </section>

          <section>
            <h2 className="text-xl md:text-2xl font-bold mb-4">§14 Kontakt</h2>
            <p>W sprawach zwiazanych z ochrona danych osobowych prosimy o kontakt:</p>
            <p>kontkat@drcoco.pl</p>
          </section>
        </div>
      </Card>
    </div>
  );
}
