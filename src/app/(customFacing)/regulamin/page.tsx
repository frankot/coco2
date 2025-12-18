import { Card } from "@/components/ui/card";

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
              <li>NEW AGE FOOD sp. z o.o. adres: ul. Modlińska 29a, 05-110 Jabłonna, NIP: 7011015138, REGON:388004313, umożliwia kupowanie towarów przy pomocy sieci elektronicznej (Internet) pod adresem www.drcoco.pl</li>
              <li>Zarządzającym danymi osobowymi jest NEW AGE FOOD sp. z o.o. ul. Modlińska 29a, 05-110 Jabłonna.</li>
              <li>Przedmiotowy Regulamin skierowany jest do wszystkich użytkowników sklepu www.drcoco.pl. Określa on: zasady zakładania konta (rejestracji) oraz korzystania z konta sklepu, reguły składania zamówień w sklepie oraz warunki zawierania Umów sprzedaży.</li>
              <li>Dostęp do Regulaminu zapewniony jest każdemu użytkownikowi, w dowolnym momencie, poprzez kliknięcie linku Regulamin znajdującego się w stopce strony sklepu w sekcji Pomoc</li>
              <li>Zdjęcia prezentowanych produktów są przykładowe i służą przedstawieniu wskazanego na nich produktu, opis składu napoju użytego do produkcji określonych napojów są dostarczane przez producentów.</li>
              <li>Informacje o produktach dostępnych w sklepie stanowią zaproszenie do złożenia oferty i zawarcia umowy sprzedaży w rozumieniu art. 71 k.c., zgodnie z warunkami niniejszego Regulaminu.</li>
              <li>Produkty dostępne w sklepie internetowym www.drcoco.pl są starannie opisane. Na stronie internetowej sklepu zamieszczone są szczegółowe informacje o cenie produktów ich właściwościach, miejscu pochodzenia, składzie i innych.</li>
            </ol>
          </section>

          {/* II Zasady korzystania */}
          <section>
            <h2 className="text-xl md:text-2xl font-bold mb-4">II. Zasady korzystania ze sklepu i zawarcie umowy sprzedaży</h2>
            <ol className="list-decimal pl-6 space-y-3">
              <li>Sklep internetowy www.drcoco.pl (Sklep) umożliwia zakup oferowanych w nim towarów za pośrednictwem sieci elektronicznej.</li>
              <li>Umowa sprzedaży zawierana jest między klientem sklepu (Klient), a NEW AGE FOOD sp. z o.o. ul. Modlińska 29a, 05-110 Jabłonna.</li>
              <li>Utrwalenie, zabezpieczenie i udostępnienie istotnych postanowień umów zawieranych przy użyciu środków porozumiewania się na odległość następuje przez dostarczenie Klientowi dowodu zakupu (paragon lub faktura VAT) lub specyfikacji nabywanych produktów wraz z dostawą produktów. Do umów zawieranych przy pomocy środków porozumiewania się na odległość stosuje się Ustawę z 2 marca 2000 r. o ochronie niektórych praw konsumenckich oraz o odpowiedzialności za szkodę wyrządzoną przez produkt niebezpieczny.</li>
              <li>Warunkiem rozpoczęcia korzystania ze sklepu jest akceptacja i zaznajomienie się z niniejszym Regulaminm.</li>
              <li>Informacje zawarte w formularzu zgłoszeniowym muszą być zgodne z prawdą, aktualne oraz możliwie dokładne. NEW AGE FOOD sp. z o.o. zastrzega sobie prawo do odmowy realizacji zamówień, w przypadku gdy podane dane Klienta w sposób uzasadniony wzbudzają obawę, że są nieprawdziwe lub zostały podane dla żartu, oraz w przypadku, gdy podane dane są na tyle niedokładne, że realizacja zamówienia staje się niemożliwa, w szczególności zaś w sytuacji, w której (podane dane) uniemożliwiają, prawidłowe doręczenie przesyłki. Przed odmową realizacji NEW AGE FOOD sp. z o.o. gwarantuje podjęcie próby kontaktu z Klientem celem sprostowania podanych danych w stopniu umożliwiającym zrealizowanie zamówienia.</li>
              <li>Sklep podejmuje wszelkie możliwe środki techniczne i organizacyjne, zapobiegające pozyskaniu i modyfikacji przez osoby nieupoważnione danych podawanych podczas rejestracji.</li>
              <li>
                Użytkownik, który korzystający ze Sklepu, zobowiązany jest do:
                <ul className="list-disc pl-6 mt-2 space-y-1">
                  <li>korzystania ze sklepu w sposób nie zakłócający jego prawidłowe funkcjonowanie;</li>
                  <li>niedostarczania i nieprzekazywania treści zabronionych przez przepisy prawa;</li>
                  <li>korzystania z treści zamieszczonych na stronach sklepu wyłącznie do użytku własnego;</li>
                  <li>niepropagowania i nieumieszczania w ramach sklepu niezamówionej informacji handlowej;</li>
                  <li>korzystania ze sklepu w sposób umożliwiający innym klientom oraz Administratorowi sklepu swobodny dostęp do wszystkich oferowanych przez sklep usług;</li>
                  <li>korzystania ze sklepu w sposób zgodny z przepisami obowiązującymi na terytorium Rzeczypospolitej Polskiej, postanowieniami Regulaminu, a także ogólnymi zasadami korzystania z sieci elektronicznej (Interet).</li>
                </ul>
              </li>
            </ol>
          </section>

          {/* III Zawarcie umowy */}
          <section>
            <h2 className="text-xl md:text-2xl font-bold mb-4">III. Zawarcie umowy sprzedaży</h2>
            <ol className="list-decimal pl-6 space-y-3">
              <li>
                Aby zawrzeć umowę sprzedaży, należy złożyć zamówienie w jakiejkolwiek dostępnej formie:
                <ul className="list-disc pl-6 mt-2 space-y-1">
                  <li>na stronie sklepu (on-line)</li>
                  <li>telefonicznie</li>
                  <li>pocztą elektroniczną</li>
                </ul>
              </li>
              <li>Sklep internetowy zamówienia on-line przyjmuje przez całą dobę, każdego dnia tygodnia. Natomiast zamówienia składane pocztą elektroniczną przyjmowane są w godzinach 9.00 – 17.00 od poniedziałku do piątku. Zamówienia złożone w dni ustawowo, wolne od pracy realizowane będą w pierwszym dniu roboczym, następującym po dniu, w którym zamówienie zostało złożone.</li>
              <li>Klient może zamówić produkty dostępne w ofercie sklepu, bez konieczności trwałego rejestrowania swoich danych w bazie sklepu (tzw. zakup bez rejestracji).</li>
              <li>Kryterium złożenia zamówienia jest wypełnienie danych we wszystkich polach wymaganych do prawidłowej wysyłki.</li>
              <li>Aby złożyć zamówienie należy dokonać wyboru produktu lub produktów dostępnych w ofercie Sklepu poprzez „dodanie" ich do koszyka.</li>
              <li>Do momentu zatwierdzenia wyboru produktów przyciskiem „zamawiam", kupujący może swobodnie dokonywać zmian i modyfikacji zamówionych produktów oraz podanych danych dotyczących faktury lub wysyłki.</li>
              <li>Wysłane i potwierdzone przez Klienta zamówienie stanowi ofertę złożoną NEW AGE FOOD sp. z o.o. dotyczącą zawarcia Umowy sprzedaży, zgodnie z Regulaminem sklepu internetowego www.drcoco.pl.</li>
              <li>Klient po złożeniu zamówienia otrzyma na stronie sklepu oraz drogą mailową komunikat zawierający szczegóły dotyczące wartości zamówienia, ilości zamówionych produktów, wybranego rodzaju płatności i dostawy, czasu realizacji zamówienia oraz danych adresowych Klienta podanych przy zamówieniu. Komunikat ten jest jednocześnie, potwierdzeniem złożeniem pozytywnego zamówienia oraz otrzymania przez Sklep oferty zakupu wysłanej przez Klienta.</li>
              <li>Klient otrzyma potwierdzenie przyjęcia zamówienia drogą elektroniczną na adres e-mail podany przy rejestracji. Po otrzymaniu wspomnianego potwierdzenia dochodzi do zawarcia umowy sprzedaży zamówionych przez Klienta produktów.</li>
              <li>Umowa sprzedaży sporządzona jest w języku polskim, w treści zgodnej z niniejszym Regulaminem.</li>
              <li>Klient może odstąpić od zamówienia przed otrzymaniem od Sklepu potwierdzenia przyjęcia oferty zakupu, tj. przed otrzymaniem e-maila potwierdzającego przyjęcie zamówienia. W niniejszej sprawie Klient winien natychmiast skontaktować się ze sklepem drogą telefoniczną (niezbędne dane dostępne są na stronie internetowej sklepu w zakładce „Kontakt i dane firmy" umieszczonej w stopce strony)</li>
              <li>Sklep zastrzega sobie prawo odmowy realizacji zamówienia w ramach umowy sprzedaży, w przypadku gdy dane adresowe Kupującego są nieprawdziwe, transakcja nie została zautoryzowana w systemie płatności elektronicznych BlueMedia lub płatność za zamówienie nie została uiszczona.</li>
            </ol>
          </section>

          {/* IV Dostawa */}
          <section>
            <h2 className="text-xl md:text-2xl font-bold mb-4">IV. Dostawa i odbiór</h2>
            <ol className="list-decimal pl-6 space-y-3">
              <li>Dostawa zamówionych w Sklepie produktów odbywa się pod adres na terenie Rzeczypospolitej Polskiej, podany podczas zamówienia. Koszty dostawy i opłaty z nią związane podane są podczas składania zamówienia. Przewidywany czas dostawy to wynosi do 2 dni roboczych od dnia następującego po złożeniu zamówienia. Maksymalny termin realizacji zamówienia nie powinien przekroczyć 7 dni roboczych, a w żadnym razie 30 dni od daty zawarcia umowy sprzedaży. W przypadku wyboru przez klienta sposobu płatności przelewem lub kartą płatniczą, czas realizacji zamówienia liczony jest od dnia uznania rachunku bankowego lub konta rozliczeniowego Sprzedawcy.</li>
              <li>Do każdego przesyłanego towaru załączany jest dowód zakupu (paragon lub faktura VAT).</li>
              <li>Podczas odbioru przesyłki dostarczonej przez kuriera, Klient, proszony jest o dokładne i staranne sprawdzenie w obecności kuriera stanu opakowania zewnętrznego paczki oraz jej zawartości jak również zgodności przesyłki ze złożonym zamówieniem. W przypadku uszkodzenia przesyłki Klient powinien sporządzić wraz z kurierem protokół szkody, w dwóch jednobrzmiących egzemplarzach podpisanych przez kuriera i odbiorcę.</li>
              <li>Realizujemy zamówienia tylko na terenie Polski. W przypadku zamówień poza granicę Polski prosimy o skontaktowanie się z firmą (niezbędne dane dostępne są na stronie internetowej sklepu w zakładce „Kontakt i dane firmy" umieszczonej w stopce strony).</li>
            </ol>
          </section>

          {/* V Ceny */}
          <section>
            <h2 className="text-xl md:text-2xl font-bold mb-4">V. Ceny i formy płatności</h2>
            <ol className="list-decimal pl-6 space-y-3">
              <li>Informacja o cenie towaru w sklepie jest podawana na stronie sklepu i ma charakter wiążący – w rozumieniu ustawy z 2 marca 2000 r. o ochronie niektórych praw konsumentów oraz o odpowiedzialności za szkodę wyrządzoną przez produkt niebezpieczny – od momentu otrzymania przez Klienta wiadomości e-mail z potwierdzeniem przyjęcia złożonego przez niego zamówienia zakupu wybranych towarów. Wspomniana cena nie ulegnie zmianie niezależnie od zmian cen w sklepie, które ewentualnie mogą się pojawić po złożeniu zamówienia.</li>
              <li>Ceny produktów w sklepie podawane są w PLN i zawierają podatek VAT oraz wszystkie inne składniki (podatki, cła, etc.)</li>
              <li>Klient ponosi opłatę za zamówione produkty wyłącznie za pośrednictwem systemu płatności „Pay-by link" lub „Dotpay.pl".</li>
              <li>
                Płatność przez Internet (przelewy oraz karty płatnicze) odbywają się za pośrednictwem serwisu Pay-by link" lub „Dotpay.pl", zapewniających bezpieczeństwo dokonywanych transakcji. Podmiotem świadczącym obsługę płatności online jest Blue Media S.A.
                <br /><br />
                Sklep obsługuje niżej wymienione metody płatności:
                <br /><br />
                <strong>Płatność kartą:</strong> Visa, Visa Electron, MasterCard, MasterCard Electronic, Maestro.
                <br /><br />
                <strong>Serwis płatnościowy:</strong> mTransfer – mBank, Inteligo – PKO BP, Bank Pekao, Bank PKO – IKO, Bank PKO- IPKO, Bank Pekao- PeoPay, VOLKSWAGEN BANK – POLSKA, Bank Zachodni WBK, BNP PARIBAS, Pocztowy24, Deutsche Bank, SGB Bank SA, GET IN BANK, Credit Agricole, ING, Bank BGŻ, Raiffeisen Bank Polska, Eurobank, Millennium BANK, BOŚ Bank, Citi Bank Handlowy, Alior Bank, PBS Bank, NET – Bank Express, Toyota Bank, PLUS Bank, T-Mobile – Usługi bankowe.
              </li>
              <li>NEW AGE FOOD sp. z o.o. zastrzega sobie prawo zmiany cen produktów w sklepie internetowym, wprowadzania do swojej oferty nowych produktów, tworzenia i odwoływania promocji na stronach sklepu, oraz ich modyfikacji zgodnie z normami kodeksu cywilnego oraz innych ustaw, przy jednoczesnym zaznaczeniu, że modyfikacje te takie nie naruszają praw osób, które zamówią towar oferowany przez sklep przed dokonaniem ww. modyfikacji.</li>
              <li>W przypadku transakcji kartą zwrot następuje na rachunek przynależący do karty którą dokonano płatności, w tej sytuacji nie istnieje możliwość dokonania zwrotu na inny rachunek.</li>
            </ol>
          </section>

          {/* VI Gwarancja */}
          <section>
            <h2 className="text-xl md:text-2xl font-bold mb-4">VI. Gwarancja, reklamacje i zwroty</h2>
            <ol className="list-decimal pl-6 space-y-3">
              <li>Produkty oferowane w sklepie są nieużywane, fabrycznie nowe i oryginalne.</li>
              <li>Klient może zgłosić informacje o wszelkich niedogodnościach – niezbędne dane kontaktowe, dostępne są na stronie internetowej Sklepu w zakładce „Kontakt i dane firmy" umieszczonej w stopce strony.</li>
              <li>NEW AGE FOOD sp. z o.o. podejmuje wszelkie działania w celu zapewnienia właściwego funkcjonowania sklepu z uwzględnieniem aktualnej wiedzy technicznej i zobowiązuje się usunąć w możliwie najszybszym terminie wszelkie nieprawidłowości zgłoszone przez użytkowników.</li>
              <li>NEW AGE FOOD sp. z o.o. jako sprzedawca odpowiada wobec Klienta będącego konsumentem w rozumieniu art. 221 Kodeksu Cywilnego za niezgodność z Umową sprzedaży Towaru zakupionego przez tego konsumenta, w zakresie określonym Ustawą o szczególnych warunkach sprzedaży konsumenckiej i zmianie Kodeksu cywilnego z dnia 27 lipca 2002 r..</li>
              <li>Każdy produkt kupiony w Sklepie może być zareklamowany z zachowaniem wszelkich terminów i warunków reklamacji jeśli posiada wady, stanowiące o jego niezgodności z umową. Reklamację należy złożyć poprzez dostarczenie produktu wraz z opisem wady i dowodem zakupu, na adres: NEW AGE FOOD sp. z o.o. adres: ul. Modlińska 29a, 05-110 Jabłonna, z dopiskiem: „reklamacja". Jednocześnie przed rozpoczęciem procedury reklamacyjnej klient proszony jest o bezpośrednio kontakt z właścicielem Sklepu (niezbędne dane kontaktowe, dostępne są na stronie internetowej Sklepu w zakładce „Kontakt i dane firmy" umieszczonej w stopce strony). Klient otrzyma informację o rozpatrzeniu reklamacji w terminie 14 dni od dnia otrzymania przez sklep reklamowanego produktu lub produktów. W przypadku pozytywnego rozpatrzenia reklamacji NEW AGE FOOD sp. z o.o., zobowiązuje się do wysłania do Klienta nowego produkt w ciągu 14 dni, a gdy okaże się to niemożliwe (np. z powodu wyczerpania zapasów magazynowych), do zwrócenia opłaty poniesionej przez Klienta.</li>
              <li>W przypadku nie uwzględnienia reklamacji, towar na życzenie Klienta zostanie odesłany wraz z opinią Sklepu o niezasadności reklamacji.</li>
              <li>Reklamacje wynikające z tytułu uszkodzenia towaru podczas transportu będą rozpatrywane na podstawie protokołu szkody sporządzonego przez Klienta i kuriera. Czyt. Rodz. IV. Ptk.3</li>
              <li>Termin odstąpienia od umowy wynosi 14 dni. Klient ma prawo odstąpić od umowy sprzedaży bez podania przyczyny w ciągu 14 dni od daty otrzymania towaru i w możliwie najszybszym terminie zwrócić towar do Sklepu. W celu odstąpienia od umowy sprzedaży, Klient zobowiązany jest do złożenia oświadczenia o odstąpieniu od zawartej umowy drogą mailową, a następnie przysłanie na adres Sklepu na koszt i ryzyko Klienta nienaruszonego towaru w oryginalnym, nieposiadającym nieuzasadnionych śladów użytkowania opakowaniu. Do przesyłki należy dołączyć dokument potwierdzający zachowanie terminu 10 dni w odniesieniu do konkretnych zwracanych towarów (np. paragon, faktura Vat). Kwota zwróconego zamówienia zostanie przekazana w ciągu maksymalnie 14 dni roboczych od otrzymania przez Sklep nieuszkodzonego towaru, na podany przez Klienta numer konta. W przypadku transakcji kartą zwrot należności następuje na rachunek karty.</li>
              <li>Sklep ma prawo odmówić przyjęcia zwrotu towaru w przypadkach braku dokumentu potwierdzającego zakup towaru oraz braku, lub nieuzasadnionym naruszeniu lub uszkodzeniu oryginalnego opakowania lub niedotrzymania 14 dniowego terminu zwrotu. W takim przypadku towar zostanie odesłany, na koszt klienta.</li>
              <li>NEW AGE FOOD sp. z o.o. zobowiązuje się do niezwłocznego poinformowania jednostki certyfikującej Ekogwarancja PTRE Sp. z o.o. o kwestionowaniu statusu produktów ekologicznych</li>
            </ol>
          </section>

          {/* VII Pozostałe */}
          <section>
            <h2 className="text-xl md:text-2xl font-bold mb-4">VII. Pozostałe</h2>
            <ol className="list-decimal pl-6 space-y-3">
              <li>Dane Klientów podawane podczas rejestracji w Sklepie są przetwarzane przez NEW AGE FOOD sp. z o.o., tylko w celu realizacji zamówień.</li>
              <li>Klient składając zamówienie zgadza się na korzystanie ze sklepu zgodnie z postanowieniami niniejszego regulaminu – w brzmieniu z dnia złożenia zamówienia. Brak akceptacji postanowień niniejszego Regulaminu uniemożliwia zakup Towarów oferowanych przez sklep.</li>
              <li>Do sprzedaży produktów przez Sklep stosuje się prawo polskie. Umowa zawierana jest w języku polskim.</li>
              <li>W sprawach nie uregulowanych niniejszym regulaminem stosuje się odpowiednie przepisy kodeksu cywilnego lub innych ustaw mających zastosowanie do działalności i funkcjonowania sklepu.</li>
              <li>NEW AGE FOOD sp. z o.o. zastrzega sobie prawo do dokonywania dowolnych zmian Regulaminu w każdym czasie. Zmiany te obowiązują od momentu opublikowania ich na stronie sklepu.</li>
              <li>NEW AGE FOOD sp. z o.o. zastrzega sobie prawo do dokonywania zmian cen oraz wycofywania lub wprowadzania poszczególnych produktów do oferty sklepu, tworzenia i wycofywania promocji na stronie sklepu, jaki i również ich modyfikacji, przy czym zmiany takie nie naruszają praw osób, które zawarły umowy sprzedaży towarów oferowanych przez sklep przed dokonaniem ww. zmian.</li>
              <li>Wszelkie zamieszczone w sklepie znaki towarowe i nazwy firmowe należą do prawnych właścicieli.</li>
            </ol>
          </section>

        </div>
      </Card>
    </div>
  );
}