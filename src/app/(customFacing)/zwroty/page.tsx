import type { Metadata } from "next";
import Link from "next/link";
import { Download } from "lucide-react";
import { Card } from "@/components/ui/card";
import { LEGAL_DOCUMENTS } from "@/lib/legal-documents";

export const metadata: Metadata = {
  title: "Zwroty i reklamacje",
  description:
    "Polityka zwrotów i reklamacji sklepu Dr.Coco® (drcoco.pl). 14 dni na odstąpienie od umowy, adres zwrotów, reklamacje i formularz odstąpienia.",
  alternates: {
    canonical: "https://drcoco.pl/zwroty",
  },
  openGraph: {
    title: "Zwroty i reklamacje | Dr.Coco",
    description:
      "Jak zwrócić zamówienie lub złożyć reklamację w sklepie drcoco.pl. Formularz odstąpienia od umowy.",
    url: "https://drcoco.pl/zwroty",
    type: "website",
  },
};

const formFields = [
  {
    label: "Niniejszym informuję o odstąpieniu od umowy sprzedaży następujących produktów:",
    lines: 2,
  },
  { label: "Data zawarcia umowy lub numer zamówienia:", lines: 1 },
  { label: "Data otrzymania produktów:", lines: 1 },
  { label: "Imię i nazwisko konsumenta:", lines: 1 },
  { label: "Adres konsumenta:", lines: 2 },
  { label: "Data:", lines: 1 },
  { label: "Podpis konsumenta (tylko przy formularzu papierowym):", lines: 1 },
];

export default function ZwrotyPage() {
  return (
    <div className="container mx-auto px-4 md:px-6 lg:px-8 py-8 md:py-12 lg:mt-16 max-w-5xl">
      <h1 className="text-3xl md:text-4xl font-bold mb-8 text-center">Zwroty i reklamacje</h1>

      <Card className="p-6 md:p-8 lg:p-10">
        <div className="prose prose-sm md:prose-base max-w-none space-y-8">
          {/* Intro */}
          <section className="space-y-3">
            <p>
              Chcesz zwrócić zamówienie lub zgłosić problem z produktem? Napisz na{" "}
              <a href="mailto:kontakt@drcoco.pl" className="text-primary hover:underline">
                kontakt@drcoco.pl
              </a>{" "}
              lub zadzwoń pod numer{" "}
              <a href="tel:+48798865865" className="text-primary hover:underline">
                798 865 865
              </a>
              .
            </p>
            <p>
              Sprzedawcą jest NEW AGE FOOD sp. z o.o., ul. Modlińska 29a, 05-110 Jabłonna, NIP:
              7011015138.
            </p>
          </section>

          {/* Zwrot bez podania przyczyny */}
          <section id="zwrot" className="space-y-3">
            <h2 className="text-xl md:text-2xl font-bold">Zwrot bez podania przyczyny</h2>
            <p>
              Jeśli kupujesz jako konsument, możesz odstąpić od umowy zawartej w sklepie drcoco.pl w
              ciągu 14 dni od otrzymania towaru, bez podawania przyczyny. Termin liczymy od
              otrzymania towaru przez Ciebie lub wskazaną przez Ciebie osobę inną niż przewoźnik.
              Jeśli towary objęte jedną umową dostarczamy osobno, partiami lub w częściach, termin
              biegnie od otrzymania ostatniego towaru, partii lub części.
            </p>
            <p>
              Poinformuj nas o swojej decyzji w jednoznacznym oświadczeniu, np. e-mailem na
              kontakt@drcoco.pl lub listownie na adres siedziby. Wystarczy wysłać oświadczenie przed
              upływem terminu. Nie musisz czekać na naszą zgodę.
            </p>
            <p>
              Podaj imię i nazwisko, numer zamówienia oraz zwracane produkty, aby ułatwić nam
              obsługę sprawy. Możesz użyć{" "}
              <a href="#formularz" className="text-primary hover:underline">
                formularza poniżej
              </a>
              , ale nie jest to obowiązkowe. Papierowy paragon nie jest wymagany, jeżeli zakup można
              potwierdzić w inny sposób.
            </p>
          </section>

          {/* Jak odesłać produkty */}
          <section id="odeslanie" className="space-y-3">
            <h2 className="text-xl md:text-2xl font-bold">Jak odesłać produkty</h2>
            <p>
              Odeślij towar niezwłocznie, najpóźniej w ciągu 14 dni od odstąpienia od umowy.
              Wystarczy nadać przesyłkę przed upływem tego terminu.
            </p>
            <p>
              <strong>Adres zwrotów:</strong> NEW AGE FOOD sp. z o.o., ul. Różana 1a, 07-230 Gaj.
            </p>
            <p>
              Bezpośredni koszt odesłania towaru przy zwrocie bez podania przyczyny ponosi klient.
              Zabezpiecz produkty na czas transportu. Możesz użyć oryginalnego kartonu wysyłkowego
              lub innego odpowiedniego opakowania.
            </p>
            <p>
              Odpowiadasz za zmniejszenie wartości towaru wynikające z korzystania z niego w sposób
              wykraczający poza konieczny do sprawdzenia jego charakteru, cech i funkcjonowania,
              chyba że nie poinformowaliśmy Cię o prawie odstąpienia zgodnie z ustawą.
            </p>
          </section>

          {/* Otwarte opakowania napojów */}
          <section id="otwarte-opakowania" className="space-y-3">
            <h2 className="text-xl md:text-2xl font-bold">Otwarte opakowania napojów</h2>
            <p>
              Prawo odstąpienia nie przysługuje w przypadku produktu dostarczonego w zapieczętowanym
              opakowaniu, jeżeli po dostarczeniu opakowanie zostało otwarte, a produktu nie można
              zwrócić ze względu na ochronę zdrowia lub ze względów higienicznych.
            </p>
            <p>
              Dotyczy to opakowania zabezpieczającego sam napój. Otwarcie zewnętrznego kartonu
              wysyłkowego nie pozbawia prawa zwrotu. Otwarcie produktu nie wyłącza prawa do
              reklamacji, również gdy problem zauważono dopiero po otwarciu.
            </p>
          </section>

          {/* Zwrot pieniędzy */}
          <section id="zwrot-pieniedzy" className="space-y-3">
            <h2 className="text-xl md:text-2xl font-bold">Zwrot pieniędzy</h2>
            <p>
              Zwrócimy należne płatności niezwłocznie, najpóźniej w ciągu 14 dni od otrzymania
              oświadczenia o odstąpieniu od umowy.
            </p>
            <p>
              Przy odstąpieniu od całej umowy zwrócimy również koszt pierwotnej dostawy do wysokości
              najtańszego zwykłego sposobu dostarczenia oferowanego przy danym zamówieniu. Dopłata
              za droższą dostawę nie podlega zwrotowi.
            </p>
            <p>
              Możemy wstrzymać zwrot pieniędzy do otrzymania produktów lub dowodu ich odesłania,
              zależnie od tego, co nastąpi wcześniej. Nie dotyczy to sytuacji, gdy zaproponowaliśmy,
              że sami odbierzemy towar.
            </p>
            <p>
              Zwrócimy pieniądze przy użyciu tego samego sposobu płatności, chyba że wyraźnie
              zgodzisz się na inny sposób, który nie będzie wiązał się dla Ciebie z dodatkowymi
              kosztami.
            </p>
          </section>

          {/* Reklamacje produktów */}
          <section id="reklamacje" className="space-y-3">
            <h2 className="text-xl md:text-2xl font-bold">Reklamacje produktów</h2>
            <p>
              Jeśli produkt jest niezgodny z umową, np. nieszczelny, zepsuty, uszkodzony lub inny
              niż zamówiony, zgłoś reklamację na kontakt@drcoco.pl lub listownie na adres: NEW AGE
              FOOD sp. z o.o., ul. Modlińska 29a, 05-110 Jabłonna.
            </p>
            <p>
              Opisz problem, wskaż swoje żądanie i podaj dane umożliwiające kontakt oraz
              identyfikację zakupu. Pomocne będą numer zamówienia, numer partii, data przydatności i
              zdjęcia. Zdjęcia ani papierowy paragon nie są warunkiem przyjęcia reklamacji.
            </p>
            <p>
              Możesz żądać naprawy lub wymiany. W przypadku wody kokosowej właściwym rozwiązaniem
              będzie zwykle wymiana. Możemy zmienić wybrany sposób, jeśli jest niemożliwy lub
              wymagałby nadmiernych kosztów, a jeśli oba sposoby są niemożliwe lub nadmiernie
              kosztowne, możemy odmówić doprowadzenia towaru do zgodności z umową. Nie wyłącza to
              pozostałych ustawowych uprawnień.
            </p>
            <p>
              Naprawę lub wymianę realizujemy w rozsądnym czasie i bez nadmiernych niedogodności.
              Ponosimy koszty, w tym niezbędnego transportu. Jeśli potrzebny jest odbiór produktu,
              uzgodnimy z Tobą sposób i zorganizujemy go na nasz koszt.
            </p>
            <p>
              Możesz żądać obniżenia ceny lub odstąpić od umowy, gdy odmówiliśmy doprowadzenia
              towaru do zgodności lub nie zrobiliśmy tego zgodnie z ustawą, problem nadal występuje
              mimo próby usunięcia, jest na tyle istotny, że uzasadnia takie żądanie od razu, albo z
              okoliczności lub naszego oświadczenia wynika, że nie usuniemy problemu w rozsądnym
              czasie lub bez nadmiernych niedogodności.
            </p>
            <p>
              Nie można odstąpić od umowy z powodu nieistotnej niezgodności. Domniemywa się, że
              niezgodność jest istotna. Obniżenie ceny powinno odpowiadać proporcjonalnemu
              zmniejszeniu wartości produktu.
            </p>
            <p>
              Na reklamację odpowiemy w ciągu 14 dni od jej otrzymania, na papierze lub innym
              trwałym nośniku, np. e-mailem. Brak odpowiedzi w tym terminie oznacza uznanie
              reklamacji konsumenta.
            </p>
            <p>
              Zwrot kwoty wynikającej z obniżenia ceny nastąpi niezwłocznie, najpóźniej w ciągu 14
              dni od otrzymania oświadczenia o obniżeniu ceny. Przy odstąpieniu z powodu
              niezgodności zwracasz produkt niezwłocznie na nasz koszt. Cenę zwracamy niezwłocznie,
              najpóźniej w ciągu 14 dni od otrzymania produktu lub dowodu jego odesłania, tą samą
              metodą płatności, chyba że zgodzisz się na inną, bez dodatkowych kosztów.
            </p>
            <p>
              Odpowiadamy za niezgodność istniejącą przy dostarczeniu i ujawnioną w ciągu dwóch lat,
              chyba że określony zgodnie z ustawą termin przydatności jest dłuższy. Nie przedłuża to
              terminu przydatności napoju do spożycia. Przechowuj produkt zgodnie z etykietą.
              Domniemywa się, że niezgodność ujawniona w ciągu dwóch lat istniała przy dostarczeniu,
              chyba że udowodniono inaczej albo nie da się tego pogodzić ze specyfiką produktu lub
              charakterem niezgodności.
            </p>
          </section>

          {/* Rozbita lub uszkodzona przesyłka */}
          <section id="uszkodzona-przesylka" className="space-y-3">
            <h2 className="text-xl md:text-2xl font-bold">Rozbita lub uszkodzona przesyłka</h2>
            <p>
              Jeżeli napój dotarł rozbity, uszkodzony lub nieszczelny, napisz na kontakt@drcoco.pl.
              Podaj numer zamówienia lub inne dane umożliwiające identyfikację zakupu.
            </p>
            <p>
              Zalecamy sprawdzenie paczki przy odbiorze i sporządzenie protokołu szkody z
              przewoźnikiem w razie zauważenia uszkodzeń. Jeśli możesz, wykonaj zdjęcia opakowania,
              etykiety i produktów. Ułatwi to wyjaśnienie sprawy oraz dochodzenie roszczeń od
              przewoźnika.
            </p>
            <p>
              Brak protokołu szkody, zdjęć lub sprawdzenia paczki przy kurierze nie pozbawia Cię
              prawa do reklamacji i sam w sobie nie jest podstawą jej odrzucenia.
            </p>
            <p>
              Oceniamy reklamację na podstawie okoliczności i dowodów, z uwzględnieniem ustawowych
              zasad odpowiedzialności oraz domniemań. Samo zgłoszenie nie przesądza o sposobie
              rozpatrzenia reklamacji.
            </p>
            <p>
              Za uszkodzenia podczas dostawy sposobem oferowanym przez Sklep odpowiadamy my.
              Pokrywamy koszty realizacji zasadnej reklamacji, w tym niezbędnego odbioru i wymiany.
              Zachowujesz również pozostałe ustawowe uprawnienia.
            </p>
            <p>
              Nie odpowiadamy za uszkodzenia spowodowane przez klienta po otrzymaniu towaru. Odmowa
              z tej przyczyny wymaga podstaw zgodnych z prawem; sam brak protokołu szkody nie jest
              taką podstawą.
            </p>
            <p>
              Zgłoś problem możliwie szybko po zauważeniu. Ta prośba nie skraca ustawowych terminów.
              Nie spożywaj produktów z rozbitych lub nieszczelnych opakowań ani nie odsyłaj
              rozbitego szkła. Skontaktuj się z nami, aby ustalić bezpieczne dalsze postępowanie.
            </p>
          </section>

          {/* Kogo dotyczą te zasady */}
          <section id="kogo-dotycza" className="space-y-3">
            <h2 className="text-xl md:text-2xl font-bold">Kogo dotyczą te zasady</h2>
            <p>
              Opisane uprawnienia konsumenta stosujemy także do osoby fizycznej zawierającej umowę
              bezpośrednio związaną z działalnością gospodarczą, jeżeli umowa nie ma dla niej
              charakteru zawodowego wynikającego w szczególności z przedmiotu działalności
              udostępnionego w CEIDG, w zakresie przewidzianym prawem. W pozostałych zakupach
              firmowych uprawnienia określają właściwe przepisy i warunki umowy.
            </p>
            <p>
              Niniejsze zasady nie ograniczają praw kupujących wynikających z bezwzględnie
              obowiązujących przepisów. Szczegółowe zasady znajdziesz w dziale VI{" "}
              <Link href="/regulamin#vi-zwroty" className="text-primary hover:underline">
                Regulaminu
              </Link>
              .
            </p>
          </section>

          {/* Formularz odstąpienia */}
          <section
            id="formularz"
            className="space-y-4 border-t border-gray-200 pt-8 print:break-before-page"
          >
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <h2 className="text-xl md:text-2xl font-bold m-0">Formularz odstąpienia od umowy</h2>
              <a
                href={LEGAL_DOCUMENTS.withdrawalForm.publicPath}
                download
                className="inline-flex items-center gap-2 rounded-full border border-primary px-4 py-2 text-sm font-medium text-primary no-underline transition-colors hover:bg-primary hover:text-white print:hidden"
              >
                <Download className="w-4 h-4" />
                Pobierz formularz (PDF)
              </a>
            </div>
            <p>
              Wypełnij i wyślij formularz tylko wtedy, gdy chcesz odstąpić od umowy. Korzystanie z
              niego jest dobrowolne.
            </p>
            <p>
              <strong>Adresat:</strong> NEW AGE FOOD sp. z o.o., ul. Modlińska 29a, 05-110 Jabłonna;
              e-mail: kontakt@drcoco.pl.
            </p>
            <div className="space-y-5">
              {formFields.map((field) => (
                <div key={field.label}>
                  <p className="mb-2">{field.label}</p>
                  {Array.from({ length: field.lines }).map((_, i) => (
                    <div key={i} className="h-8 border-b border-dotted border-gray-400" />
                  ))}
                </div>
              ))}
            </div>
          </section>
        </div>
      </Card>
    </div>
  );
}
