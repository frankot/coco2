# Panel Administracyjny — Instrukcja Obsługi

## Spis treści

1. [Logowanie do panelu](#1-logowanie-do-panelu)
2. [Nawigacja panelu](#2-nawigacja-panelu)
3. [Dashboard (Strona główna)](#3-dashboard-strona-główna)
4. [Produkty](#4-produkty)
5. [Zamówienia](#5-zamówienia)
6. [Klienci](#6-klienci)
7. [Rabaty (Kody rabatowe)](#7-rabaty-kody-rabatowe)
8. [Blog (CMS)](#8-blog-cms)

---

## 1. Logowanie do panelu

Aby uzyskać dostęp do panelu administracyjnego, przejdź pod adres `/admin/login`.

1. Wpisz swoją **nazwę użytkownika** (login administratora).
2. Wpisz **hasło**.
3. Kliknij przycisk **Zaloguj się**.

Po pomyślnym logowaniu zostaniesz przekierowany na stronę główną panelu (Dashboard).

> Jeśli podasz błędne dane, zobaczysz komunikat: _„Niepoprawna nazwa użytkownika lub hasło"_.

W prawym górnym rogu nawigacji panelu znajdziesz przycisk **Wyloguj się**, który pozwala zakończyć sesję.

---

## 2. Nawigacja panelu

Na górze strony znajduje się pasek nawigacji z zakładkami:

| Zakładka       | Adres              | Opis                                       |
| -------------- | ------------------ | ------------------------------------------ |
| **Dashboard**  | `/admin`           | Strona główna z podsumowaniem i wykresami  |
| **Produkty**   | `/admin/produkty`  | Zarządzanie produktami                     |
| **Zamówienia** | `/admin/zamowienia`| Zarządzanie zamówieniami i wysyłkami       |
| **Klienci**    | `/admin/klienci`   | Zarządzanie klientami i newsletterem       |
| **Rabaty**     | `/admin/rabaty`    | Zarządzanie kodami rabatowymi              |
| **Blog**       | `/admin/blog`      | Zarządzanie wpisami bloga                  |

Aktualnie wybrana zakładka jest podświetlona. W prawym rogu paska znajduje się przycisk **Wyloguj się**.

---

## 3. Dashboard (Strona główna)

Po zalogowaniu trafiasz na Dashboard — stronę podsumowującą najważniejsze informacje o sklepie.

### 3.1. Karty metryk

W górnej części dashboardu znajdują się karty z kluczowymi wskaźnikami:

| Karta                    | Opis                                                              |
| ------------------------ | ----------------------------------------------------------------- |
| Przychód łącznie         | Suma wszystkich zamówień opłaconych i w realizacji               |
| Przychód w miesiącu      | Przychód od początku bieżącego miesiąca                           |
| Wartość średniego koszyka| Średnia wartość jednego zamówienia                                |
| Rabat udzielony          | Łączna wartość wszystkich udzielonych rabatów                     |
| Produkty                 | Łączna liczba produktów w sklepie                                 |
| Klienci                  | Liczba zarejestrowanych klientów                                  |
| Zamówienia               | Łączna liczba zamówień (z podziałem na oczekujące/w realizacji)   |
| Kody rabatowe            | Liczba aktywnych kodów (z informacją ile zostało już użytych)     |

### 3.2. Wykresy i analizy

Dashboard zawiera dwie sekcje analityczne:

- **Zamówienia z ostatnich 14 dni** — wykres słupkowy pokazujący liczbę zamówień dziennie z ostatnich dwóch tygodni.
- **Struktura statusów zamówień** — paski postępu pokazujące rozkład zamówień według statusów (Oczekujące, Preorder, Opłacone, W realizacji, Wysłane, Dostarczone, Anulowane).

### 3.3. Ostatnie zamówienia

Na dole dashboardu znajduje się lista najnowszych zamówień z szybkim podglądem: ID zamówienia, status, email klienta, kwota i data. Kliknięcie w **„Szczegóły"** przenosi bezpośrednio do strony zamówienia.

---

## 4. Produkty

Sekcja **Produkty** (`/admin/produkty`) pozwala zarządzać całym katalogiem produktów w sklepie.

### 4.1. Lista produktów

Na liście produktów widzisz tabelę zawierającą:

| Kolumna          | Opis                                                                 |
| ---------------- | -------------------------------------------------------------------- |
| Nazwa            | Nazwa produktu                                                       |
| Cena             | Cena produktu w PLN                                                  |
| Zamówienia       | Ile razy produkt został zamówiony                                    |
| Sklep            | Czy produkt jest widoczny publicznie w sklepie oraz czy jest preorder|
| Widoczność grup  | Dla jakich typów kont produkt jest widoczny (D = Detal, B2B, H = Hurt)|
| Dostępność       | Przełącznik dostępny/niedostępny do kupienia                         |
| Akcje            | Menu z opcjami (ikona trzech kropek ⋮)                                |

Możesz **sortować** listę klikając na nagłówki kolumn **Cena** lub **Zamówienia** — kliknięcie zmienia kierunek sortowania (rosnąco / malejąco).

### 4.2. Widoczność i dostępność produktu

Produkt ma teraz dwa niezależne ustawienia:

- **Widoczny w sklepie** — decyduje, czy klient w ogóle widzi produkt na stronie sklepu. Jeśli produkt jest ukryty, nie pojawia się na liście produktów, stronie głównej, w szczegółach produktu ani w mapie strony.
- **Dostępny do kupienia** — decyduje, czy widoczny produkt można dodać do koszyka i kupić.

Dzięki temu produkt może być **widoczny, ale niedostępny do kupienia**. W takim przypadku klient widzi produkt w sklepie, ale zamiast przycisku dodania do koszyka pojawia się opcja **„Powiadom mnie o dostępności"**.

Dodatkowo produkt może być widoczny tylko dla wybranych typów klientów. W kolumnie **Widoczność grup** widoczne są skróty:

- **D** — Detal
- **B2B** — Detal B2B
- **H** — Hurt

Na stronie szczegółów produktu widoczność jest pokazana z ikonami oka (widoczny / ukryty).

### 4.3. Dodawanie nowego produktu

1. Kliknij przycisk **„Dodaj produkt"** w prawym górnym rogu.
2. Wypełnij formularz:
   - **Nazwa** — nazwa produktu (wymagane).
   - **Slug (URL)** — adres produktu w sklepie. Może zostać wygenerowany automatycznie z nazwy przyciskiem **„Generuj"**.
   - **Cena (PLN)** — cena produktu w złotych (np. 12,99). Pod polem widoczny jest podgląd sformatowanej ceny. Dla preorderu jest to **cena, którą klient faktycznie płaci**.
   - **Najniższa cena z 30 dni (PLN)** — opcjonalna cena informacyjna używana przy promocjach.
   - **Opis (krótki)** — krótki opis widoczny na liście produktów w sklepie (wymagane).
   - **Pełna zawartość (Markdown)** — szczegółowy opis produktu z formatowaniem. Możesz używać nagłówków, list, pogrubień itp. Edytor wyświetla podgląd w czasie rzeczywistym.
   - **Skład i Wartość Odżywcza** — opcjonalne sekcje:
     - _Skład_ — skład produktu (np. „100% woda kokosowa").
     - _Sposób przechowywania_ — instrukcja przechowywania.
     - _Wartość odżywcza na 100 ml_ — tabela wartości odżywczych.
   - **Ilość sztuk w opakowaniu** — ile sztuk zawiera jedno opakowanie (domyślnie 12).
   - **Wymiary i waga**:
     - _Waga (kg)_ — waga jednostkowa produktu w kilogramach.
     - _Długość (cm)_ — długość opakowania w centymetrach.
     - _Szerokość (cm)_ — szerokość opakowania w centymetrach.
     - _Wysokość (cm)_ — wysokość opakowania w centymetrach.
   - **Status** — ustawienia widoczności i sprzedaży:
     - **Widoczny w sklepie** — produkt jest publicznie widoczny dla klientów.
     - **Dostępny do kupienia** — produkt można normalnie kupić. Jeśli to pole jest odznaczone, ale produkt jest widoczny, klient może zapisać się na powiadomienie o dostępności.
     - **Preorder** — włącza tryb preorderu. Produkt nie jest wtedy normalnie dostępny, ale można go kupić w preorderze do wybranej daty.
   - **Grupy** — określa, które typy klientów widzą produkt:
     - **Detal** — zwykli klienci detaliczni i goście.
     - **B2B** — klienci Detal B2B.
     - **Hurt** — klienci hurtowi.
     - Przy preorderze pola **B2B** i **Hurt** są blokowane, ponieważ preorder jest dostępny tylko dla klientów Detal.
   - **Promocja** — oznaczenie produktu jako promocyjnego.
   - **Zdjęcia produktu** — kliknij pole „Dodaj zdjęcia", aby przesłać zdjęcia. Można dodać wiele zdjęć. Pierwsze zdjęcie będzie oznaczone jako **Główne** (jest wyświetlane jako miniatura). Maksymalny rozmiar jednego zdjęcia to **2 MB**. Użyj np. https://squoosh.app/ aby zmniejszyć rozmiar zdjęcia (format najlepiej WebP).
3. Kliknij **„Dodaj produkt"**, aby zapisać.

### 4.4. Edycja produktu

1. Na liście produktów kliknij ikonę menu ⋮ przy wybranym produkcie.
2. Wybierz **„Edytuj"**.
3. Formularz edycji zawiera wszystkie pola jak przy dodawaniu — w tym status widoczności, dostępności, preorder, widoczność grup, wymiary i wagę.
4. W sekcji zdjęć możesz:
   - **Usunąć istniejące zdjęcie** — najedź na zdjęcie i kliknij przycisk ❌.
   - **Dodać nowe zdjęcia** — kliknij „Dodaj zdjęcia" i wybierz pliki.
   - Produkt musi mieć **co najmniej jedno zdjęcie**.
5. Kliknij **„Zapisz zmiany"**, aby zapisać.

> Jeśli produkt ma ustawiony preorder, system automatycznie wymusza: dostępność normalna = wyłączona, widoczność dla Detal = włączona, widoczność dla B2B i Hurt = wyłączona.

### 4.5. Podgląd produktu

Kliknięcie w nazwę produktu na liście przenosi do strony podglądu (`/admin/produkty/[id]`), gdzie możesz zobaczyć wszystkie informacje o produkcie:

- Zdjęcia (główne + dodatkowe)
- Cena, dostępność i informacja, czy produkt jest preorderem
- Widoczność w sklepie oraz widoczność dla typów kont
- Slug, ilość w opakowaniu, waga, wymiary
- Liczba zamówień zawierających ten produkt
- Opis, skład, wartości odżywcze
- Pełna treść Markdown

Stąd możesz też szybko przejść do edycji lub usunąć produkt.

### 4.6. Dostępność produktu

Przełącznik w kolumnie **Dostępność** decyduje, czy produkt można kupić normalnie.

1. Na liście produktów kliknij przełącznik w kolumnie **Dostępność**.
2. Zmiana następuje natychmiast:
   - zielony przełącznik = produkt dostępny do kupienia,
   - szary przełącznik = produkt niedostępny do kupienia.

> Ważne: wyłączenie dostępności **nie ukrywa produktu**. Jeśli produkt ma włączone **„Widoczny w sklepie"**, klient nadal zobaczy go w sklepie, ale nie będzie mógł go kupić. Zobaczy opcję **„Powiadom mnie o dostępności"**.

Aby całkowicie ukryć produkt ze sklepu, wejdź w edycję produktu i odznacz **„Widoczny w sklepie"**.

### 4.7. Preorder

Preorder to specjalny tryb produktu, w którym klient może zapłacić za produkt przed standardową dostępnością.

Aby włączyć preorder:

1. Wejdź w dodawanie lub edycję produktu.
2. Zaznacz checkbox **Preorder**.
3. Po zaznaczeniu pojawią się dodatkowe pola:
   - **Data i godzina zakończenia preorderu** — moment, do którego klient może złożyć zamówienie preorder. Na stronie produktu klient widzi licznik odliczający czas do tej daty. Po upływie czasu produkt nadal jest widoczny, ale nie można go kupić w preorderze.
   - **Cena regularna do pokazania rabatu (PLN)** — cena referencyjna używana tylko do pokazania rabatu. Musi być wyższa od ceny sprzedaży.
   - **Cena sprzedaży / preorder (PLN)** — zwykłe pole ceny produktu. Dla preorderu jest to realna cena, którą klient płaci.
4. System automatycznie:
   - wyłącza normalną dostępność produktu,
   - blokuje i odznacza widoczność dla B2B i Hurt,
   - zostawia produkt widoczny dla Detal.

Preorder jest dostępny tylko dla klientów Detal i gości. Klienci B2B i Hurt nie widzą produktów preorderowych.

Zamówienia preorder:

- klient płaci od razu za produkt i dostawę,
- dostawa jest wybrana normalnie przy zamówieniu,
- zamówienie po opłaceniu otrzymuje status **Preorder**,
- przesyłka Apaczka nie tworzy się automatycznie po płatności,
- administrator ręcznie zmienia status **Preorder → W realizacji**, wtedy system tworzy przesyłkę w Apaczce.

### 4.8. Powiadomienia o dostępności

Jeśli produkt jest widoczny w sklepie, ale nie jest dostępny do kupienia, klient może kliknąć **„Powiadom mnie o dostępności"** i podać email.

Gdy administrator zmieni produkt z niedostępnego na dostępny do kupienia, system wysyła powiadomienie email do zapisanych klientów. Powiadomienia są jednorazowe — po wysłaniu dana subskrypcja nie jest wysyłana ponownie.

Powiadomienia dotyczą normalnej dostępności produktu. Nie są wysyłane po samym włączeniu preorderu.

### 4.9. Usuwanie produktu

1. Kliknij menu ⋮ przy produkcie.
2. Wybierz **„Usuń"**.
3. Produkt zostanie trwale usunięty wraz ze zdjęciami.

> **Uwaga:** Nie można usunąć produktu, który ma przypisane zamówienia. Opcja „Usuń" będzie wyszarzona.

---

## 5. Zamówienia

Sekcja **Zamówienia** (`/admin/zamowienia`) pozwala przeglądać i zarządzać zamówieniami klientów.

### 5.1. Lista zamówień

Tabela zamówień zawiera:

| Kolumna         | Opis                                                         |
| --------------- | ------------------------------------------------------------ |
| Klient          | Adres email klienta                                          |
| Status          | Aktualny status zamówienia (kolorowa etykieta)               |
| Data utworzenia | Data i godzina złożenia zamówienia                           |
| Data płatności  | Data i godzina opłacenia zamówienia                          |
| Produkty        | Liczba pozycji w zamówieniu                                  |
| Kwota (PLN)     | Łączna kwota zamówienia                                      |
| Akcje           | Menu z opcjami                                               |

Możesz **sortować** listę klikając na nagłówki kolumn: **Status**, **Data utworzenia**, **Data płatności**, **Produkty**, **Kwota**.

### 5.2. Filtry widoczności

Nad tabelą zamówień znajdują się dwa checkboxy:

- **B2B** — pokazuje zamówienia od klientów B2B (z flagą obsługi ręcznej).
- **Regularne** — pokazuje standardowe zamówienia (automatyczna obsługa Apaczka + wFirma).

Możesz zaznaczyć oba filtry jednocześnie, aby widzieć wszystkie zamówienia, lub odznaczyć któryś aby ukryć dany typ.

### 5.3. Statusy zamówień

Każde zamówienie przechodzi przez następujące statusy:

| Status           | Znaczenie                                 |
| ---------------- | ----------------------------------------- |
| **Oczekujące**   | Zamówienie złożone, oczekuje na opłatę    |
| **Preorder**     | Zamówienie preorder opłacone, czeka na ręczne rozpoczęcie realizacji |
| **Opłacone**     | Płatność otrzymana                        |
| **W realizacji** | Zamówienie jest pakowane / przygotowywane |
| **Wysłane**      | Paczka została wysłana do klienta         |
| **Dostarczone**  | Paczka dotarła do klienta                 |
| **Anulowane**    | Zamówienie zostało anulowane              |

### 5.4. Zmiana statusu zamówienia

#### Z poziomu listy zamówień:

1. Kliknij menu ⋮ przy zamówieniu.
2. W zależności od aktualnego statusu, dostępne są różne opcje:
   - **Oczekujące** → „Oznacz jako opłacone", „Rozpocznij realizację" lub „Oznacz jako wysłane"
   - **Preorder** → „Rozpocznij realizację preorderu"
   - **Opłacone** → „Rozpocznij realizację"
   - **W realizacji** → „Oznacz jako wysłane"
   - **Wysłane** → „Oznacz jako dostarczone"
3. Dla zamówień bez płatności (np. przelew tradycyjny) system pokaże okno z ostrzeżeniem przed zmianą statusu.
4. Opcja **„Anuluj zamówienie"** jest dostępna dla zamówień, które nie zostały jeszcze dostarczone ani anulowane. Przed anulowaniem pojawi się okno potwierdzenia.

#### Z poziomu szczegółów zamówienia:

1. Kliknij **„Szczegóły zamówienia"** w menu ⋮.
2. W górnej części strony znajdują się przyciski do zmiany statusu — zależne od aktualnego statusu zamówienia.
3. Dla zamówień Oczekujących dostępne jest rozwijane menu „Zmień status" umożliwiające przeskoczenie do dowolnego kolejnego statusu.

### 5.5. Zamówienia B2B (obsługa ręczna)

Zamówienia złożone przez klientów z kontem typu HURT lub DETAL_B2B mogą być oznaczone jako **B2B ręczne**. Takie zamówienia:

- **Nie** integrują się automatycznie z Apaczką (wysyłka obsługiwana ręcznie).
- **Nie** generują automatycznej faktury w wFirma.
- Przy zmianie statusu wyświetlają odpowiednie komunikaty informujące o ręcznej obsłudze.
- Na liście zamówień oznaczone są etykietą „(B2B ręczne)".

### 5.6. Szczegóły zamówienia

Po kliknięciu **„Szczegóły zamówienia"** widzisz pełne informacje:

- **Szczegóły zamówienia** — ID, status, data utworzenia, data płatności, kwota, kod rabatowy i wartość rabatu, numer faktury wFirma, data wysłania faktury, liczba produktów.
- **Dane klienta** — email, imię, nazwisko, typ konta. Przycisk „Zobacz profil klienta" przenosi do strony klienta.
- **Adres rozliczeniowy** — dane do faktury, w tym nazwa firmy i NIP (jeśli klient zaznaczył „Chcę fakturę").
- **Adres dostawy** — dane do wysyłki (ulica, telefon, kod pocztowy, miasto, kraj).
- **Dostawa do punktu (Apaczka)** — jeśli klient wybrał dostawę do punktu odbioru, widoczne są:
  - Dostawca punktu (np. InPost, DPD Pickup)
  - ID punktu
  - Numer listu przewozowego
  - Status przesyłki w Apaczka
  - Telefon kontaktowy do odbioru
- **Lista produktów** — tabela z nazwami produktów, ceną jednostkową, ilością i sumą.
- **Przyciski akcji** — pobieranie faktury wFirma, pobieranie listu przewozowego Apaczka (jeśli dostępne).

### 5.7. Apaczka — zarządzanie wysyłkami

Apaczka to system zarządzania wysyłkami. Panel oferuje kilka sposobów interakcji z Apaczką:

#### Potwierdzenie pojedynczego zamówienia

Gdy zamówienie przechodzi ze statusu **Opłacone** → **W realizacji**, system automatycznie tworzy przesyłkę w Apaczka i przypisuje numer listu przewozowego.

Dla zamówień preorder przesyłka nie jest tworzona po płatności. Tworzy się dopiero wtedy, gdy administrator ręcznie zmieni status **Preorder** → **W realizacji**.

#### Potwierdzenie wszystkich zamówień naraz

1. Na stronie zamówień kliknij przycisk **„Apaczka - wyślij opłacone"** (u góry strony).
2. System automatycznie utworzy przesyłki dla wszystkich kwalifikujących się zamówień (status: Opłacone).
3. Po zakończeniu:
   - Zobaczysz podsumowanie (ile przesyłek utworzono, ile się nie powiodło).
   - Jeśli wystąpią błędy, zostaną wyświetlone szczegółowe komunikaty dla każdego zamówienia.
   - Pojawi się okno dialogowe z opcją pobrania **zbiorczego potwierdzenia nadań (PDF)** — jest to dokument do przekazania kurierowi.

#### Pobieranie etykiety wysyłkowej

1. Po potwierdzeniu zamówienia w Apaczka (gdy zamówienie ma nadany numer), w menu ⋮ pojawi się opcja **„Pobierz etykietę"**.
2. Kliknij ją — etykieta zostanie pobrana jako plik PDF.
3. Wydrukuj etykietę i naklej na paczkę.

#### Synchronizacja statusów

Przycisk **„Synchronizuj statusy Apaczka"** (u góry strony zamówień) pobiera aktualne statusy przesyłek z systemu Apaczka i aktualizuje je w panelu.

Użyj tej opcji, aby:

- Sprawdzić, czy paczki zostały odebrane przez kuriera.
- Zaktualizować statusy śledzenia dla wszystkich zamówień naraz.

Po synchronizacji zobaczysz komunikat z liczbą zaktualizowanych i błędnych zamówień.

> **Automatyczna synchronizacja:** statusy przesyłek Apaczka są również synchronizowane automatycznie raz dziennie o godzinie 8:00 przez skrypt cron. Nie ma potrzeby ręcznego uruchamiania synchronizacji, chyba że potrzebujesz natychmiastowej aktualizacji.

### 5.8. Faktury wFirma

System automatycznie wysyła faktury do wFirma, gdy zamówienie otrzymuje status **Opłacone** (PAID) lub **Preorder** (PREORDER).

- **Dla zamówień regularnych**: faktura jest tworzona automatycznie w momencie przejścia w status Opłacone lub W realizacji.
- **Dla zamówień B2B ręcznych**: faktury NIE są wysyłane automatycznie — obsługa ręczna.
- **Pobieranie faktury**: jeśli zamówienie ma numer faktury wFirma, w menu ⋮ oraz na stronie szczegółów pojawi się przycisk **„Pobierz fakturę"** — plik PDF.
- **Informacje o fakturze**: na stronie szczegółów zamówienia wyświetlany jest numer faktury oraz data jej wysłania.

---

## 6. Klienci

Sekcja **Klienci** (`/admin/klienci`) pozwala zarządzać kontami użytkowników sklepu.

### 6.1. Lista klientów

Tabela klientów zawiera:

| Kolumna          | Opis                                                             |
| ---------------- | ---------------------------------------------------------------- |
| Email            | Adres email klienta                                              |
| Typ konta        | Detal, Detal B2B, Hurt lub Admin (kolorowa etykieta)            |
| Data rejestracji | Kiedy klient się zarejestrował                                   |
| Zamówienia       | Liczba zamówień złożonych przez klienta                          |
| Wydane (PLN)     | Łączna kwota wydana przez klienta                                |
| Akcje            | Menu z opcjami                                                   |

Możesz **sortować** listę klikając na nagłówki: **Typ konta**, **Data rejestracji**, **Zamówienia**, **Wydane (PLN)**.

### 6.2. Typy kont

W systemie istnieją cztery typy kont. Każdy różni się zakresem funkcji i sposobem obsługi zamówień:

| Typ konta      | Ceny                     | Fakturowanie | Apaczka / wFirma                   | Widoczność produktów | Opis |
| -------------- | ------------------------ | ------------ | ---------------------------------- | ------------------------------ | ---- |
| **Detal**      | Domyślne ceny sklepowe  | Opcjonalne (jeśli klient zaznaczy ,,Chcę fakturę") | Automatyczna integracja | Widzi produkty z `visibleToDetal`, w tym preorder | Zwykły klient detaliczny. Zamówienia obsługiwane standardowo — płatność online, automatyczne etykiety Apaczka dla zwykłych zamówień, automatyczne faktury wFirma. Może składać zamówienia preorder. |
| **Detal B2B**  | **Ceny indywidualne** (konfigurowalne w panelu) | Wymagane (dane firmy + NIP) | Ręczna obsługa (B2B ręczne) | Widzi produkty z `visibleToDetalB2B`, bez preorderów | Klient detaliczny na fakturę firmową. Może mieć przypisane indywidualne ceny na produkty. Zamówienia nie integrują się automatycznie z Apaczką ani wFirmą — wymagają ręcznej obsługi wysyłki i fakturowania poza systemem. Nie składa zamówień preorder. |
| **Hurt**       | **Ceny indywidualne** (konfigurowalne w panelu) | Wymagane (dane firmy + NIP) | Ręczna obsługa (B2B ręczne) | Widzi produkty z `visibleToHurt`, bez preorderów | Klient hurtowy. Może mieć przypisane indywidualne ceny na produkty. Zamówienia nie integrują się automatycznie z Apaczką ani wFirmą — wymagają ręcznej obsługi wysyłki i fakturowania poza systemem. Nie składa zamówień preorder. |
| **Admin**      | Domyślne ceny sklepowe  | Nie dotyczy  | Nie dotyczy                        | Wszystkie produkty             | Administrator z pełnym dostępem do panelu administracyjnego. Nie składa zamówień przez sklep. |

### 6.3. Newsletter

Przycisk **„Newsletter"** (ikona koperty) na górze strony klientów otwiera okno modalne z listą adresów email zapisanych do newslettera.

- Wyświetla ostatnie **20 zapisów** z datą dodania.
- Przycisk **„Eksportuj CSV"** pozwala pobrać pełną listę adresów jako plik CSV.
- Adresy są zbierane z formularza newslettera na stronie sklepu.

### 6.4. Dodawanie nowego klienta

1. Kliknij **„Dodaj klienta"** w prawym górnym rogu.
2. Wypełnij formularz:
   - **Email** — adres email (wymagane, musi być unikalny).
   - **Imię** — opcjonalne.
   - **Nazwisko** — opcjonalne.
   - **Telefon** — opcjonalne.
   - **Hasło** — minimum 6 znaków (wymagane).
   - **Powtórz hasło** — musi być identyczne z hasłem.
   - **Typ konta** — wybierz: Detal, Detal B2B, Hurt lub Admin.
3. Kliknij **„Dodaj klienta"**, aby zapisać.

### 6.5. Edycja klienta

Z poziomu szczegółów klienta (patrz 6.7) możesz zmienić dane klienta: email, imię, nazwisko, telefon, hasło i typ konta.

### 6.6. Zmiana typu konta

1. Kliknij menu ⋮ przy kliencie na liście (lub przycisk „Zmień typ konta" na stronie szczegółów).
2. Wybierz **„Zmień typ konta"**.
3. W oknie dialogowym zaznacz nowy typ konta: Detal, Detal B2B lub Hurt.
4. Kliknij **„Zapisz zmiany"**.

> **Uwaga:** Nie można zmienić typu konta na Admin przez to menu. Konta Admin tworzy się przez dedykowany proces.

### 6.7. Szczegóły klienta

Kliknij **„Szczegóły"** w menu ⋮ lub wejdź na stronę `/admin/klienci/[id]`. Znajdziesz tam:

- **Informacje o kliencie** — email, typ konta, imię, nazwisko, data rejestracji, ostatnia aktualizacja, ID klienta.
- **Statystyki** — liczba zamówień, liczba adresów, łącznie wydana kwota.
- **Dane firmy (faktura)** — jeśli klient kiedykolwiek zamówił z fakturą, wyświetlana jest nazwa firmy, NIP i link do zamówienia źródłowego.
- **Adresy do faktury** — lista adresów rozliczeniowych klienta z oznaczeniem typu i datą dodania.
- **Adresy do dostawy** — lista adresów wysyłkowych klienta z oznaczeniem typu i datą dodania.
- **Ceny indywidualne** — (tylko dla kont HURT i DETAL_B2B) sekcja zarządzania indywidualnymi cenami produktów (patrz 6.8).
- **Ostatnie zamówienia** — 10 ostatnich zamówień klienta z informacjami: ID zamówienia, data, kwota, status, metoda płatności. Kliknięcie w zamówienie przenosi do jego szczegółów.

### 6.8. Ceny indywidualne (HURT / DETAL_B2B)

Dla klientów z kontem typu **Hurt** lub **Detal B2B** dostępna jest sekcja **„Ceny indywidualne"** na stronie szczegółów klienta.

1. Wyświetla listę wszystkich aktywnych produktów z domyślną ceną.
2. Dla każdego produktu możesz wpisać własną cenę w PLN.
3. Kliknij **„Zapisz"**, aby przypisać indywidualną cenę.
4. Kliknij **„Usuń"**, aby przywrócić domyślną cenę produktu.
5. Po zapisaniu klient HURT/DETAL_B2B widzi te ceny zamiast domyślnych w sklepie.

### 6.9. Usuwanie klienta

1. Kliknij menu ⋮ przy kliencie na liście (lub przycisk „Usuń klienta" na stronie szczegółów).
2. Wybierz **„Usuń"**.
3. Potwierdź w oknie dialogowym.

> **Uwaga:** Nie można usunąć klienta, który posiada zamówienia. Opcja „Usuń" będzie wyszarzona, a komunikat poinformuje o przyczynie.

---

## 7. Rabaty (Kody rabatowe)

Sekcja **Rabaty** (`/admin/rabaty`) pozwala tworzyć i zarządzać kodami rabatowymi dla klientów sklepu.

### 7.1. Lista kodów rabatowych

Tabela kodów zawiera:

| Kolumna         | Opis                                                        |
| --------------- | ----------------------------------------------------------- |
| Status          | Przełącznik aktywny/nieaktywny (zielony = aktywny)          |
| Kod             | Unikalny kod rabatowy (wpisywany przez klienta w koszyku)   |
| Typ             | Procentowy lub Kwotowy                                      |
| Wartość         | Wartość rabatu (np. 10% lub 20,00 PLN)                     |
| Jednorazowy     | Czy kod jest jednorazowego użytku (Tak/Nie)                 |
| Użycia          | Ile razy kod został wykorzystany                            |
| Data utworzenia | Data utworzenia kodu                                        |
| Akcje           | Menu z opcją usunięcia                                      |

### 7.2. Dodawanie nowego kodu rabatowego

1. Kliknij **„Dodaj kod"** w prawym górnym rogu.
2. Wypełnij formularz:
   - **Kod** — unikalny identyfikator kodu (3–20 znaków, tylko litery, cyfry i myślniki). Kod jest automatycznie zapisywany wielkimi literami.
   - **Typ rabatu**:
     - **Procentowy** — wartość rabatu w procentach (np. 10 = 10% zniżki). Maksymalnie 100%.
     - **Kwotowy** — wartość rabatu w PLN (np. 20,00 = 20 zł zniżki).
   - **Kod jednorazowy** — zaznacz, jeśli kod może być użyty tylko raz (przez jednego klienta).
3. Kliknij **„Dodaj kod rabatowy"**, aby zapisać.

### 7.3. Aktywacja / Deaktywacja kodu

1. Na liście kodów kliknij przełącznik w kolumnie **Status**.
2. Zielony = kod aktywny, szary = kod nieaktywny (klienci nie mogą go użyć).
3. Zmiana następuje natychmiast.

### 7.4. Usuwanie kodu rabatowego

1. Kliknij menu ⋮ przy kodzie.
2. Wybierz **„Usuń"**.

> **Uwaga:** Nie można usunąć kodu, który został już użyty. Opcja „Usuń" będzie wyszarzona. W takim przypadku należy dezaktywować kod.

### 7.5. Jak klienci używają kodów

Klient może wpisać kod rabatowy w koszyku przed finalizacją zamówienia. System automatycznie:

- Sprawdza, czy kod istnieje i jest aktywny.
- Oblicza wartość rabatu (procentowo od sumy lub kwotowo).
- Odejmuje rabat od sumy zamówienia.
- Zwiększa licznik użyć kodu.
- Dla kodów jednorazowych — dezaktywuje kod po użyciu.

Szczegóły użytego kodu (nazwa, wartość rabatu) są widoczne na stronie szczegółów zamówienia.

---

## 8. Blog (CMS)

Sekcja **Blog** (`/admin/blog`) służy do zarządzania wpisami blogowymi wyświetlanymi na stronie sklepu.

### 8.1. Lista wpisów

Tabela wpisów zawiera:

| Kolumna  | Opis                                                |
| -------- | --------------------------------------------------- |
| Nagłówek | Tytuł wpisu                                         |
| Slug     | Adres URL wpisu (generowany automatycznie z tytułu) |
| Data     | Data utworzenia wpisu                               |
| Akcje    | Menu z opcjami                                      |

Lista wpisów jest **stronicowana** (paginacja na dole tabeli).

### 8.2. Dodawanie nowego wpisu

1. Kliknij **„Dodaj wpis"** w prawym górnym rogu.
2. Wypełnij formularz:
   - **Tytuł** — tytuł wpisu (wymagane).
   - **Treść (Markdown)** — treść wpisu z formatowaniem Markdown. Edytor pozwala na podgląd w czasie rzeczywistym (podział ekranu: edycja po lewej, podgląd po prawej).
   - **Obraz wpisu** — opcjonalny. Kliknij pole „Dodaj obraz", aby przesłać zdjęcie, które będzie wyświetlane jako grafika wpisu.
3. Kliknij **„Dodaj wpis"**, aby opublikować.

> **Slug** (adres URL wpisu) jest generowany automatycznie na podstawie tytułu. Jeśli istnieje już wpis z takim samym slugem, system automatycznie doda numer (np. 'moj-wpis-2').

### 8.3. Edycja wpisu

1. Na liście wpisów kliknij menu ⋮ przy wybranym wpisie.
2. Wybierz **„Edytuj"**.
3. Zmień potrzebne pola. W sekcji obrazu możesz:
   - **Usunąć istniejący obraz** — najedź na obraz i kliknij „Usuń".
   - **Dodać nowy obraz** — kliknij pole „Dodaj obraz" i wybierz plik.
4. Kliknij **„Aktualizuj wpis"**, aby zapisać zmiany.

### 8.4. Usuwanie wpisu

1. Na liście wpisów kliknij menu ⋮ przy wybranym wpisie.
2. Wybierz **„Usuń"**.
3. Wpis zostanie trwale usunięty wraz z powiązanym obrazem.

---
