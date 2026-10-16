import { Card } from "@/components/ui/card";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Regulamin sklepu",
  description:
    "Regulamin sklepu internetowego Dr.Coco® (drcoco.pl). Zasady zakupów, dostawy, zwrotów i reklamacji. New Age Food Sp. z o.o.",
  alternates: {
    canonical: "https://drcoco.pl/regulamin",
  },
  openGraph: {
    title: "Regulamin sklepu | Dr.Coco",
    description:
      "Regulamin sklepu internetowego drcoco.pl - zasady zakupów, dostawy, zwrotów i reklamacji.",
    url: "https://drcoco.pl/regulamin",
    type: "website",
  },
};

export default function RegulaminPage() {
  return (
    <div className="container mx-auto px-4 md:px-6 lg:px-8 py-8 md:py-12 lg:mt-16 max-w-5xl">
      <h1 className="text-3xl md:text-4xl font-bold mb-8 text-center">Regulamin sklepu</h1>

      <Card className="p-6 md:p-8 lg:p-10">
        <div className="prose prose-sm md:prose-base max-w-none space-y-6">
          {/* I Wstęp */}
          <section>
            <h2 className="text-xl md:text-2xl font-bold mb-4">I. Wstęp</h2>
            <ol className="list-decimal pl-6 space-y-3">
              <li>
                NEW AGE FOOD sp. z o.o. adres: ul. Modlińska 29a, 05-110 Jabłonna, NIP: 7011015138,
                REGON:388004313, umożliwia kupowanie towarów przy pomocy sieci elektronicznej
                (Internet) pod adresem www.drcoco.pl
              </li>
              <li>
                Zarządzającym danymi osobowymi jest NEW AGE FOOD sp. z o.o. ul. Modlińska 29a,
                05-110 Jabłonna.
              </li>
              <li>
                Przedmiotowy Regulamin skierowany jest do wszystkich użytkowników sklepu
                www.drcoco.pl. Określa on: zasady zakładania konta (rejestracji) oraz korzystania z
                konta sklepu, reguły składania zamówień w sklepie oraz warunki zawierania Umów
                sprzedaży.
              </li>
              <li>
                Dostęp do Regulaminu zapewniony jest każdemu użytkownikowi, w dowolnym momencie,
                poprzez kliknięcie linku Regulamin znajdującego się w stopce strony sklepu w sekcji
                Pomoc
              </li>
              <li>
                Zdjęcia prezentowanych produktów są przykładowe i służą przedstawieniu wskazanego na
                nich produktu, opis składu napoju użytego do produkcji określonych napojów są
                dostarczane przez producentów.
              </li>
              <li>
                Informacje o produktach dostępnych w sklepie stanowią zaproszenie do złożenia oferty
                i zawarcia umowy sprzedaży w rozumieniu art. 71 k.c., zgodnie z warunkami
                niniejszego Regulaminu.
              </li>
              <li>
                Produkty dostępne w sklepie internetowym www.drcoco.pl są starannie opisane. Na
                stronie internetowej sklepu zamieszczone są szczegółowe informacje o cenie produktów
                ich właściwościach, miejscu pochodzenia, składzie i innych.
              </li>
            </ol>
          </section>

          {/* II Zasady korzystania */}
          <section>
            <h2 className="text-xl md:text-2xl font-bold mb-4">
              II. Zasady korzystania ze sklepu i zawarcie umowy sprzedaży
            </h2>
            <ol className="list-decimal pl-6 space-y-3">
              <li>
                Sklep internetowy www.drcoco.pl (Sklep) umożliwia zakup oferowanych w nim towarów za
                pośrednictwem sieci elektronicznej.
              </li>
              <li>
                Umowa sprzedaży zawierana jest między klientem sklepu (Klient), a NEW AGE FOOD sp. z
                o.o. ul. Modlińska 29a, 05-110 Jabłonna.
              </li>
              <li>
                Sprzedawca przekazuje Klientowi potwierdzenie zawarcia umowy na trwałym nośniku, np.
                e-mailem, w rozsądnym czasie po jej zawarciu, najpóźniej w chwili dostarczenia
                towaru. Potwierdzenie obejmuje informacje wymagane ustawą z dnia 30 maja 2014 r. o
                prawach konsumenta, chyba że zostały już przekazane na trwałym nośniku przed
                zawarciem umowy. Do umów zawieranych na odległość stosuje się właściwe przepisy tej
                ustawy oraz Kodeksu cywilnego.
              </li>
              <li>
                Warunkiem rozpoczęcia korzystania ze sklepu jest akceptacja i zaznajomienie się z
                niniejszym Regulaminm.
              </li>
              <li>
                Informacje zawarte w formularzu zgłoszeniowym muszą być zgodne z prawdą, aktualne
                oraz możliwie dokładne. NEW AGE FOOD sp. z o.o. zastrzega sobie prawo do odmowy
                realizacji zamówień, w przypadku gdy podane dane Klienta w sposób uzasadniony
                wzbudzają obawę, że są nieprawdziwe lub zostały podane dla żartu, oraz w przypadku,
                gdy podane dane są na tyle niedokładne, że realizacja zamówienia staje się
                niemożliwa, w szczególności zaś w sytuacji, w której (podane dane) uniemożliwiają,
                prawidłowe doręczenie przesyłki. Przed odmową realizacji NEW AGE FOOD sp. z o.o.
                gwarantuje podjęcie próby kontaktu z Klientem celem sprostowania podanych danych w
                stopniu umożliwiającym zrealizowanie zamówienia.
              </li>
              <li>
                Sklep podejmuje wszelkie możliwe środki techniczne i organizacyjne, zapobiegające
                pozyskaniu i modyfikacji przez osoby nieupoważnione danych podawanych podczas
                rejestracji.
              </li>
              <li>
                Użytkownik, który korzystający ze Sklepu, zobowiązany jest do:
                <ul className="list-disc pl-6 mt-2 space-y-1">
                  <li>
                    korzystania ze sklepu w sposób nie zakłócający jego prawidłowe funkcjonowanie;
                  </li>
                  <li>
                    niedostarczania i nieprzekazywania treści zabronionych przez przepisy prawa;
                  </li>
                  <li>
                    korzystania z treści zamieszczonych na stronach sklepu wyłącznie do użytku
                    własnego;
                  </li>
                  <li>
                    niepropagowania i nieumieszczania w ramach sklepu niezamówionej informacji
                    handlowej;
                  </li>
                  <li>
                    korzystania ze sklepu w sposób umożliwiający innym klientom oraz
                    Administratorowi sklepu swobodny dostęp do wszystkich oferowanych przez sklep
                    usług;
                  </li>
                  <li>
                    korzystania ze sklepu w sposób zgodny z przepisami obowiązującymi na terytorium
                    Rzeczypospolitej Polskiej, postanowieniami Regulaminu, a także ogólnymi zasadami
                    korzystania z sieci elektronicznej (Interet).
                  </li>
                </ul>
              </li>
            </ol>
          </section>

          {/* III Zawarcie umowy */}
          <section>
            <h2 className="text-xl md:text-2xl font-bold mb-4">III. Zawarcie umowy sprzedaży</h2>
            <ol className="list-decimal pl-6 space-y-3">
              <li>
                Aby zawrzeć umowę sprzedaży, należy złożyć zamówienie w jakiejkolwiek dostępnej
                formie:
                <ul className="list-disc pl-6 mt-2 space-y-1">
                  <li>na stronie sklepu (on-line)</li>
                  <li>telefonicznie</li>
                  <li>pocztą elektroniczną</li>
                </ul>
              </li>
              <li>
                Sklep internetowy zamówienia on-line przyjmuje przez całą dobę, każdego dnia
                tygodnia. Natomiast zamówienia składane pocztą elektroniczną przyjmowane są w
                godzinach 9.00 – 17.00 od poniedziałku do piątku. Zamówienia złożone w dni ustawowo,
                wolne od pracy realizowane będą w pierwszym dniu roboczym, następującym po dniu, w
                którym zamówienie zostało złożone.
              </li>
              <li>
                Klient może zamówić produkty dostępne w ofercie sklepu, bez konieczności trwałego
                rejestrowania swoich danych w bazie sklepu (tzw. zakup bez rejestracji).
              </li>
              <li>
                Kryterium złożenia zamówienia jest wypełnienie danych we wszystkich polach
                wymaganych do prawidłowej wysyłki.
              </li>
              <li>
                Aby złożyć zamówienie należy dokonać wyboru produktu lub produktów dostępnych w
                ofercie Sklepu poprzez „dodanie" ich do koszyka.
              </li>
              <li>
                Do momentu zatwierdzenia wyboru produktów przyciskiem „zamawiam", kupujący może
                swobodnie dokonywać zmian i modyfikacji zamówionych produktów oraz podanych danych
                dotyczących faktury lub wysyłki.
              </li>
              <li>
                Wysłane i potwierdzone przez Klienta zamówienie stanowi ofertę złożoną NEW AGE FOOD
                sp. z o.o. dotyczącą zawarcia Umowy sprzedaży, zgodnie z Regulaminem sklepu
                internetowego www.drcoco.pl.
              </li>
              <li>
                Klient po złożeniu zamówienia otrzyma na stronie sklepu oraz drogą mailową komunikat
                zawierający szczegóły dotyczące wartości zamówienia, ilości zamówionych produktów,
                wybranego rodzaju płatności i dostawy, czasu realizacji zamówienia oraz danych
                adresowych Klienta podanych przy zamówieniu. Komunikat ten jest jednocześnie,
                potwierdzeniem złożeniem pozytywnego zamówienia oraz otrzymania przez Sklep oferty
                zakupu wysłanej przez Klienta.
              </li>
              <li>
                Klient otrzyma potwierdzenie przyjęcia zamówienia drogą elektroniczną na adres
                e-mail podany przy rejestracji. Po otrzymaniu wspomnianego potwierdzenia dochodzi do
                zawarcia umowy sprzedaży zamówionych przez Klienta produktów.
              </li>
              <li>
                Umowa sprzedaży sporządzona jest w języku polskim, w treści zgodnej z niniejszym
                Regulaminem.
              </li>
              <li>
                Klient może odstąpić od zamówienia przed otrzymaniem od Sklepu potwierdzenia
                przyjęcia oferty zakupu, tj. przed otrzymaniem e-maila potwierdzającego przyjęcie
                zamówienia. W niniejszej sprawie Klient winien natychmiast skontaktować się ze
                sklepem drogą telefoniczną (niezbędne dane dostępne są na stronie internetowej
                sklepu w zakładce „Kontakt i dane firmy" umieszczonej w stopce strony)
              </li>
              <li>
                Sklep zastrzega sobie prawo odmowy realizacji zamówienia w ramach umowy sprzedaży, w
                przypadku gdy dane adresowe Kupującego są nieprawdziwe, transakcja nie została
                zautoryzowana w systemie płatności elektronicznych BlueMedia lub płatność za
                zamówienie nie została uiszczona.
              </li>
            </ol>
          </section>

          {/* IV Dostawa */}
          <section>
            <h2 className="text-xl md:text-2xl font-bold mb-4">IV. Dostawa i odbiór</h2>
            <ol className="list-decimal pl-6 space-y-3">
              <li>
                Dostawa zamówionych w Sklepie produktów odbywa się pod adres na terenie
                Rzeczypospolitej Polskiej, podany podczas zamówienia. Koszty dostawy i opłaty z nią
                związane podane są podczas składania zamówienia. Przewidywany czas dostawy to wynosi
                do 2 dni roboczych od dnia następującego po złożeniu zamówienia. Maksymalny termin
                realizacji zamówienia nie powinien przekroczyć 7 dni roboczych, a w żadnym razie 30
                dni od daty zawarcia umowy sprzedaży. W przypadku wyboru przez klienta sposobu
                płatności przelewem lub kartą płatniczą, czas realizacji zamówienia liczony jest od
                dnia uznania rachunku bankowego lub konta rozliczeniowego Sprzedawcy.
              </li>
              <li>
                Do każdego przesyłanego towaru załączany jest dowód zakupu (paragon lub faktura
                VAT).
              </li>
              <li>
                Prosimy o sprawdzenie przy odbiorze stanu opakowania i zawartości przesyłki oraz
                zgodności dostawy z zamówieniem. W razie zauważenia uszkodzeń zalecamy sporządzenie
                protokołu szkody z przewoźnikiem oraz wykonanie zdjęć. Brak protokołu, zdjęć lub
                sprawdzenia przesyłki w obecności kuriera nie pozbawia konsumenta prawa do
                reklamacji i sam w sobie nie stanowi podstawy jej odrzucenia. Zasady reklamacji
                określa dział VI Regulaminu.
              </li>
              <li>
                Realizujemy zamówienia tylko na terenie Polski. W przypadku zamówień poza granicę
                Polski prosimy o skontaktowanie się z firmą (niezbędne dane dostępne są na stronie
                internetowej sklepu w zakładce „Kontakt i dane firmy" umieszczonej w stopce strony).
              </li>
            </ol>
          </section>

          {/* V Ceny */}
          <section>
            <h2 className="text-xl md:text-2xl font-bold mb-4">V. Ceny i formy płatności</h2>
            <ol className="list-decimal pl-6 space-y-3">
              <li>
                Cena towaru jest podawana na stronie Sklepu. Cena uzgodniona przy zawarciu umowy i
                wskazana w potwierdzeniu przyjęcia zamówienia jest wiążąca dla stron. Późniejsza
                zmiana cen w Sklepie nie wpływa na cenę towarów objętych już zawartą umową.
              </li>
              <li>
                Ceny produktów w sklepie podawane są w PLN i zawierają podatek VAT oraz wszystkie
                inne składniki (podatki, cła, etc.)
              </li>
              <li>
                Klient ponosi opłatę za zamówione produkty wyłącznie za pośrednictwem systemu
                płatności „Pay-by link" lub „Dotpay.pl".
              </li>
              <li>
                Płatność przez Internet (przelewy oraz karty płatnicze) odbywają się za
                pośrednictwem serwisu Pay-by link" lub „Dotpay.pl", zapewniających bezpieczeństwo
                dokonywanych transakcji. Podmiotem świadczącym obsługę płatności online jest Blue
                Media S.A.
                <br />
                <br />
                Sklep obsługuje niżej wymienione metody płatności:
                <br />
                <br />
                <strong>Płatność kartą:</strong> Visa, Visa Electron, MasterCard, MasterCard
                Electronic, Maestro.
                <br />
                <br />
                <strong>Serwis płatnościowy:</strong> mTransfer – mBank, Inteligo – PKO BP, Bank
                Pekao, Bank PKO – IKO, Bank PKO- IPKO, Bank Pekao- PeoPay, VOLKSWAGEN BANK – POLSKA,
                Bank Zachodni WBK, BNP PARIBAS, Pocztowy24, Deutsche Bank, SGB Bank SA, GET IN BANK,
                Credit Agricole, ING, Bank BGŻ, Raiffeisen Bank Polska, Eurobank, Millennium BANK,
                BOŚ Bank, Citi Bank Handlowy, Alior Bank, PBS Bank, NET – Bank Express, Toyota Bank,
                PLUS Bank, T-Mobile – Usługi bankowe.
              </li>
              <li>
                NEW AGE FOOD sp. z o.o. zastrzega sobie prawo zmiany cen produktów w sklepie
                internetowym, wprowadzania do swojej oferty nowych produktów, tworzenia i
                odwoływania promocji na stronach sklepu, oraz ich modyfikacji zgodnie z normami
                kodeksu cywilnego oraz innych ustaw, przy jednoczesnym zaznaczeniu, że modyfikacje
                te takie nie naruszają praw osób, które zamówią towar oferowany przez sklep przed
                dokonaniem ww. modyfikacji.
              </li>
              <li>
                Zwrot płatności następuje przy użyciu takiego samego sposobu płatności, jakiego użył
                konsument, chyba że wyraźnie zgodzi się on na inny sposób, który nie wiąże się dla
                niego z dodatkowymi kosztami. Przy płatności kartą zwrot jest co do zasady kierowany
                na rachunek powiązany z kartą wykorzystaną przy zakupie.
              </li>
            </ol>
          </section>

          {/* VI Zwroty i reklamacje */}
          <section id="vi-zwroty">
            <h2 className="text-xl md:text-2xl font-bold mb-4">VI. Zwroty i reklamacje</h2>
            <div className="space-y-6">
              <div id="vi-postanowienia-ogolne">
                <h3 className="text-lg md:text-xl font-semibold mb-3">1. Postanowienia ogólne</h3>
                <ol className="list-decimal pl-6 space-y-3">
                  <li>
                    Sprzedawcą jest NEW AGE FOOD sp. z o.o., ul. Modlińska 29a, 05-110 Jabłonna,
                    NIP: 7011015138, dalej „Sprzedawca”. Kontakt: kontakt@drcoco.pl, tel. 798 865
                    865. Korespondencję można kierować na adres siedziby Sprzedawcy.
                  </li>
                  <li>
                    Adres do odsyłania produktów: NEW AGE FOOD sp. z o.o., ul. Różana 1a, 07-230
                    Gaj. Jest to adres inny niż adres siedziby Sprzedawcy.
                  </li>
                  <li>
                    Uprawnienia konsumenta opisane w niniejszym dziale stosuje się również do osoby
                    fizycznej zawierającej umowę bezpośrednio związaną z jej działalnością
                    gospodarczą, jeżeli z treści umowy wynika, że nie ma ona dla tej osoby
                    charakteru zawodowego, wynikającego w szczególności z przedmiotu działalności
                    udostępnionego w CEIDG, w zakresie przewidzianym przepisami prawa.
                  </li>
                  <li>
                    W pozostałych przypadkach zakupów firmowych uprawnienia kupującego określają
                    właściwe przepisy oraz warunki zawartej umowy.
                  </li>
                </ol>
              </div>
              <div id="vi-prawo-odstapienia">
                <h3 className="text-lg md:text-xl font-semibold mb-3">
                  2. Prawo odstąpienia od umowy
                </h3>
                <ol className="list-decimal pl-6 space-y-3">
                  <li>
                    Konsument może odstąpić od umowy sprzedaży zawartej za pośrednictwem Sklepu bez
                    podawania przyczyny w terminie 14 dni.
                  </li>
                  <li>
                    Termin biegnie od objęcia towaru w posiadanie przez konsumenta lub wskazaną
                    przez niego osobę trzecią inną niż przewoźnik. W przypadku towarów dostarczanych
                    osobno, partiami lub w częściach w ramach jednej umowy termin biegnie od
                    otrzymania ostatniego towaru, partii lub części.
                  </li>
                  <li>
                    Aby odstąpić od umowy, należy przekazać Sprzedawcy jednoznaczne oświadczenie o
                    tej decyzji, na przykład e-mailem na kontakt@drcoco.pl albo listownie na adres
                    siedziby. Do zachowania terminu wystarczy wysłanie oświadczenia przed jego
                    upływem. Odstąpienie nie wymaga zgody Sprzedawcy.
                  </li>
                  <li>
                    Konsument może skorzystać z formularza w dziale{" "}
                    <Link href="/zwroty#formularz" className="text-primary hover:underline">
                      „Zwroty i reklamacje”
                    </Link>{" "}
                    na stronie Sklepu lub ustawowego wzoru formularza. Korzystanie z formularza jest
                    dobrowolne. Podanie danych kupującego, numeru zamówienia i zwracanych produktów
                    ułatwia obsługę zwrotu.
                  </li>
                  <li>
                    Papierowy paragon nie jest warunkiem skorzystania z prawa odstąpienia, jeżeli
                    zakup można wykazać w inny sposób.
                  </li>
                </ol>
              </div>
              <div id="vi-odeslanie">
                <h3 className="text-lg md:text-xl font-semibold mb-3">3. Odesłanie produktów</h3>
                <ol className="list-decimal pl-6 space-y-3">
                  <li>
                    Konsument odsyła towar niezwłocznie, najpóźniej w terminie 14 dni od dnia
                    odstąpienia od umowy, na adres: NEW AGE FOOD sp. z o.o., ul. Różana 1a, 07-230
                    Gaj. Do zachowania terminu wystarczy nadanie przesyłki przed jego upływem.
                  </li>
                  <li>
                    Bezpośredni koszt odesłania towaru przy odstąpieniu od umowy bez podania
                    przyczyny ponosi konsument.
                  </li>
                  <li>
                    Towar należy odpowiednio zabezpieczyć na czas transportu. Oryginalny karton
                    wysyłkowy nie jest wymagany; można użyć innego odpowiedniego opakowania.
                  </li>
                  <li>
                    Konsument odpowiada za zmniejszenie wartości towaru wynikające z korzystania z
                    niego w sposób wykraczający poza konieczny do stwierdzenia jego charakteru, cech
                    i funkcjonowania, chyba że Sprzedawca nie poinformował go o prawie odstąpienia
                    zgodnie z ustawą.
                  </li>
                </ol>
              </div>
              <div id="vi-wylaczenie">
                <h3 className="text-lg md:text-xl font-semibold mb-3">
                  4. Wyłączenie prawa odstąpienia
                </h3>
                <ol className="list-decimal pl-6 space-y-3">
                  <li>
                    Prawo odstąpienia nie przysługuje w odniesieniu do towaru dostarczonego w
                    zapieczętowanym opakowaniu, którego po otwarciu nie można zwrócić ze względu na
                    ochronę zdrowia lub ze względów higienicznych, jeżeli opakowanie zostało otwarte
                    po dostarczeniu.
                  </li>
                  <li>
                    Wyłączenie dotyczy opakowania zabezpieczającego sam produkt. Otwarcie
                    zewnętrznego kartonu wysyłkowego nie pozbawia prawa odstąpienia.
                  </li>
                  <li>
                    Otwarcie produktu nie wyłącza prawa do reklamacji jego niezgodności z umową,
                    także wtedy, gdy problem został zauważony dopiero po otwarciu.
                  </li>
                </ol>
              </div>
              <div id="vi-zwrot-platnosci">
                <h3 className="text-lg md:text-xl font-semibold mb-3">5. Zwrot płatności</h3>
                <ol className="list-decimal pl-6 space-y-3">
                  <li>
                    Sprzedawca zwraca należne płatności niezwłocznie, nie później niż w ciągu 14 dni
                    od otrzymania oświadczenia o odstąpieniu od umowy.
                  </li>
                  <li>
                    Przy odstąpieniu od całej umowy zwrot obejmuje koszt pierwotnej dostawy do
                    wysokości najtańszego zwykłego sposobu dostarczenia oferowanego przy danym
                    zamówieniu. Dopłata za wybór droższego sposobu dostawy nie podlega zwrotowi.
                  </li>
                  <li>
                    Sprzedawca może wstrzymać zwrot płatności do otrzymania towaru lub dowodu jego
                    odesłania, zależnie od tego, co nastąpi wcześniej. Nie dotyczy to sytuacji, w
                    której Sprzedawca zaproponował samodzielny odbiór towaru.
                  </li>
                  <li>
                    Zwrot następuje przy użyciu tego samego sposobu płatności, jakiego użył
                    konsument, chyba że wyraźnie zgodzi się on na inny sposób niewiążący się dla
                    niego z dodatkowymi kosztami.
                  </li>
                </ol>
              </div>
              <div id="vi-reklamacje">
                <h3 className="text-lg md:text-xl font-semibold mb-3">
                  6. Reklamacje z tytułu niezgodności towaru z umową
                </h3>
                <ol className="list-decimal pl-6 space-y-3">
                  <li>
                    Sprzedawca odpowiada za niezgodność towaru z umową na zasadach ustawy z dnia 30
                    maja 2014 r. o prawach konsumenta.
                  </li>
                  <li>
                    Odpowiedzialność obejmuje brak zgodności istniejący w chwili dostarczenia i
                    ujawniony w ciągu dwóch lat od tej chwili, chyba że określony zgodnie z ustawą
                    termin przydatności jest dłuższy. Okres odpowiedzialności nie przedłuża terminu
                    przydatności produktu do spożycia. Produkt należy przechowywać zgodnie z
                    etykietą.
                  </li>
                  <li>
                    Domniemywa się, że niezgodność ujawniona przed upływem dwóch lat od dostarczenia
                    istniała przy dostarczeniu, chyba że udowodniono inaczej lub domniemania nie
                    można pogodzić ze specyfiką towaru lub charakterem niezgodności.
                  </li>
                  <li>
                    Reklamację można złożyć e-mailem na kontakt@drcoco.pl lub listownie na adres
                    siedziby Sprzedawcy. Zaleca się podanie danych umożliwiających kontakt i
                    identyfikację zakupu, opisu problemu oraz żądania. Numer partii, data
                    przydatności i zdjęcia mogą ułatwić rozpatrzenie sprawy. Zdjęcia ani papierowy
                    paragon nie są warunkiem przyjęcia reklamacji.
                  </li>
                  <li>
                    Konsument może żądać naprawy lub wymiany. Sprzedawca może zmienić wybrany
                    sposób, jeżeli jest on niemożliwy lub wymagałby nadmiernych kosztów. Gdy obydwa
                    sposoby są niemożliwe lub wymagałyby nadmiernych kosztów, Sprzedawca może
                    odmówić doprowadzenia towaru do zgodności z umową. W przypadku wody kokosowej
                    właściwym sposobem usunięcia niezgodności będzie zwykle wymiana.
                  </li>
                  <li>
                    Naprawa lub wymiana następuje w rozsądnym czasie od poinformowania Sprzedawcy o
                    niezgodności, bez nadmiernych niedogodności dla konsumenta. Koszty, w tym
                    niezbędnego transportu, ponosi Sprzedawca. Konsument udostępnia towar, a
                    Sprzedawca odbiera go na swój koszt, po uzgodnieniu sposobu odbioru.
                  </li>
                  <li>
                    Konsument może złożyć oświadczenie o obniżeniu ceny albo odstąpieniu od umowy,
                    gdy Sprzedawca odmówił doprowadzenia towaru do zgodności albo nie uczynił tego
                    na zasadach ustawowych, niezgodność nadal występuje mimo próby jej usunięcia,
                    niezgodność jest na tyle istotna, że uzasadnia takie żądanie od razu, lub z
                    okoliczności albo oświadczenia Sprzedawcy wynika, że nie usunie on niezgodności
                    w rozsądnym czasie lub bez nadmiernych niedogodności.
                  </li>
                  <li>
                    Konsument nie może odstąpić od umowy, jeżeli niezgodność jest nieistotna.
                    Domniemywa się, że niezgodność jest istotna. Obniżka ceny powinna pozostawać w
                    proporcji do zmniejszenia wartości towaru wynikającego z niezgodności.
                  </li>
                  <li>
                    Sprzedawca odpowiada na reklamację w ciągu 14 dni od jej otrzymania, na papierze
                    lub innym trwałym nośniku, np. e-mailem. Brak odpowiedzi w tym terminie oznacza
                    uznanie reklamacji konsumenta.
                  </li>
                  <li>
                    Kwoty należne wskutek obniżenia ceny są zwracane niezwłocznie, najpóźniej w
                    ciągu 14 dni od otrzymania oświadczenia o obniżeniu ceny.
                  </li>
                  <li>
                    Przy odstąpieniu z powodu niezgodności towaru z umową konsument niezwłocznie
                    zwraca towar na koszt Sprzedawcy. Zwrot ceny następuje niezwłocznie, najpóźniej
                    w ciągu 14 dni od otrzymania towaru lub dowodu jego odesłania, przy użyciu tego
                    samego sposobu płatności, chyba że konsument wyraźnie zgodzi się na inny sposób
                    bez dodatkowych kosztów.
                  </li>
                </ol>
              </div>
              <div id="vi-uszkodzenia">
                <h3 className="text-lg md:text-xl font-semibold mb-3">
                  7. Uszkodzenia podczas dostawy
                </h3>
                <ol className="list-decimal pl-6 space-y-3">
                  <li>
                    Uszkodzenie, rozbicie lub nieszczelność produktu można zgłosić na
                    kontakt@drcoco.pl, podając numer zamówienia lub inne dane umożliwiające
                    identyfikację zakupu.
                  </li>
                  <li>
                    Zalecamy sprawdzenie stanu przesyłki przy odbiorze i sporządzenie protokołu
                    szkody z przewoźnikiem w razie zauważenia uszkodzeń. Pomocne są zdjęcia
                    opakowania, etykiety i uszkodzonych produktów. Brak protokołu, zdjęć lub
                    sprawdzenia przesyłki przy kurierze nie pozbawia konsumenta prawa do reklamacji
                    i sam w sobie nie uzasadnia jej odrzucenia.
                  </li>
                  <li>
                    Sprzedawca ocenia reklamację na podstawie okoliczności sprawy i dostępnych
                    dowodów, z uwzględnieniem ustawowych zasad odpowiedzialności i domniemań. Samo
                    zgłoszenie nie przesądza o sposobie rozpatrzenia reklamacji.
                  </li>
                  <li>
                    Za uszkodzenia podczas dostawy realizowanej sposobem oferowanym przez Sklep
                    odpowiada Sprzedawca. Koszty realizacji zasadnej reklamacji, w tym niezbędnego
                    odbioru i wymiany, ponosi Sprzedawca. Pozostałe ustawowe uprawnienia konsumenta
                    pozostają zachowane.
                  </li>
                  <li>
                    Sprzedawca nie odpowiada za uszkodzenia spowodowane przez klienta po otrzymaniu
                    towaru. Odmowa z tej przyczyny wymaga ustalenia podstaw zgodnie z prawem; nie
                    może opierać się wyłącznie na braku protokołu szkody.
                  </li>
                  <li>
                    Prosimy o zgłoszenie problemu możliwie szybko po jego zauważeniu. Zalecenie to
                    nie skraca ustawowych terminów ani nie ogranicza prawa do reklamacji.
                  </li>
                  <li>
                    Nie należy spożywać produktów z rozbitych lub nieszczelnych opakowań ani odsyłać
                    rozbitego szkła. Prosimy o kontakt w celu ustalenia bezpiecznego dalszego
                    postępowania.
                  </li>
                </ol>
              </div>
              <div id="vi-postanowienia-koncowe">
                <h3 className="text-lg md:text-xl font-semibold mb-3">8. Postanowienia końcowe</h3>
                <ol className="list-decimal pl-6 space-y-3">
                  <li>
                    W razie zakwestionowania statusu ekologicznego produktu Sprzedawca niezwłocznie
                    informuje właściwą jednostkę certyfikującą.
                  </li>
                  <li>
                    Niniejsze postanowienia nie wyłączają ani nie ograniczają uprawnień wynikających
                    z bezwzględnie obowiązujących przepisów prawa.
                  </li>
                </ol>
              </div>
            </div>
          </section>

          {/* VII Pozostałe */}
          <section>
            <h2 className="text-xl md:text-2xl font-bold mb-4">VII. Pozostałe</h2>
            <ol className="list-decimal pl-6 space-y-3">
              <li>
                Dane Klientów podawane podczas rejestracji w Sklepie są przetwarzane przez NEW AGE
                FOOD sp. z o.o., tylko w celu realizacji zamówień.
              </li>
              <li>
                Klient składając zamówienie zgadza się na korzystanie ze sklepu zgodnie z
                postanowieniami niniejszego regulaminu – w brzmieniu z dnia złożenia zamówienia.
                Brak akceptacji postanowień niniejszego Regulaminu uniemożliwia zakup Towarów
                oferowanych przez sklep.
              </li>
              <li>
                Do sprzedaży produktów przez Sklep stosuje się prawo polskie. Umowa zawierana jest w
                języku polskim.
              </li>
              <li>
                W sprawach nie uregulowanych niniejszym regulaminem stosuje się odpowiednie przepisy
                kodeksu cywilnego lub innych ustaw mających zastosowanie do działalności i
                funkcjonowania sklepu.
              </li>
              <li>
                NEW AGE FOOD sp. z o.o. zastrzega sobie prawo do dokonywania dowolnych zmian
                Regulaminu w każdym czasie. Zmiany te obowiązują od momentu opublikowania ich na
                stronie sklepu.
              </li>
              <li>
                NEW AGE FOOD sp. z o.o. zastrzega sobie prawo do dokonywania zmian cen oraz
                wycofywania lub wprowadzania poszczególnych produktów do oferty sklepu, tworzenia i
                wycofywania promocji na stronie sklepu, jaki i również ich modyfikacji, przy czym
                zmiany takie nie naruszają praw osób, które zawarły umowy sprzedaży towarów
                oferowanych przez sklep przed dokonaniem ww. zmian.
              </li>
              <li>
                Wszelkie zamieszczone w sklepie znaki towarowe i nazwy firmowe należą do prawnych
                właścicieli.
              </li>
            </ol>
          </section>
        </div>
      </Card>
    </div>
  );
}
