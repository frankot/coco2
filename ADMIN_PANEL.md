# Panel Administracyjny — Instrukcja Obsługi

## Spis treści

1. [Logowanie do panelu](#1-logowanie-do-panelu)
2. [Dashboard (Strona główna)](#2-dashboard-strona-główna)
3. [Produkty](#3-produkty)
4. [Zamówienia](#4-zamówienia)
5. [Klienci](#5-klienci)
6. [Blog (CMS)](#6-blog-cms)

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

## 2. Dashboard (Strona główna)

Po zalogowaniu trafiasz na Dashboard — stronę podsumowującą najważniejsze informacje:

- **Produkty** — łączna liczba produktów w sklepie.
- **Klienci** — liczba zarejestrowanych klientów.

Dashboard służy jako szybki podgląd stanu sklepu.

---

## 3. Produkty

Sekcja **Produkty** (`/admin/produkty`) pozwala zarządzać całym katalogiem produktów w sklepie.

### 3.1. Lista produktów

Na liście produktów widzisz tabelę zawierającą:

| Kolumna    | Opis                                                         |
| ---------- | ------------------------------------------------------------ |
| Dostępność | Zielona ikona ✅ = produkt aktywny, czerwona ❌ = nieaktywny |
| Nazwa      | Nazwa produktu                                               |
| Cena       | Cena produktu w PLN                                          |
| Zamówienia | Ile razy produkt został zamówiony                            |
| Akcje      | Menu z opcjami (ikona trzech kropek `⋮`)                     |

Możesz **sortować** listę klikając na nagłówki kolumn **Cena** lub **Zamówienia** — kliknięcie zmienia kierunek sortowania (rosnąco / malejąco).

### 3.2. Dodawanie nowego produktu

1. Kliknij przycisk **„Dodaj produkt"** w prawym górnym rogu.
2. Wypełnij formularz:
   - **Nazwa** — nazwa produktu (wymagane).
   - **Cena (PLN)** — cena produktu w złotych (np. 12,99). Pod polem widoczny jest podgląd sformatowanej ceny.
   - **Opis (krótki)** — krótki opis widoczny na liście produktów w sklepie (wymagane).
   - **Pełna zawartość (Markdown)** — szczegółowy opis produktu z formatowaniem. Możesz używać nagłówków, list, pogrubień itp. Edytor wyświetla podgląd w czasie rzeczywistym.
   - **Skład i Wartość Odżywcza** — opcjonalne sekcje:
     - _Skład_ — skład produktu (np. „100% woda kokosowa").
     - _Sposób przechowywania_ — instrukcja przechowywania.
     - _Wartość odżywcza na 100 ml_ — tabela wartości odżywczych.
   - **Ilość sztuk w opakowaniu** — ile sztuk zawiera jedno opakowanie (domyślnie 12).
   - **Zdjęcia produktu** — kliknij pole „Dodaj zdjęcia", aby przesłać zdjęcia. Można dodać wiele zdjęć. Pierwsze zdjęcie będzie oznaczone jako **Główne** (jest wyświetlane jako miniatura). Maksymalny rozmiar jednego zdjęcia to **2 MB**. Uzyj np. https://squoosh.app/ aby zmniejszyć rozmiar zdjęcia (format najlepiej WebP)
3. Kliknij **„Dodaj produkt"**, aby zapisać.

### 3.3. Edycja produktu

1. Na liście produktów kliknij ikonę menu `⋮` przy wybranym produkcie.
2. Wybierz **„Edytuj"**.
3. Formularz edycji jest identyczny jak do dodawania. Zmień potrzebne pola.
4. W sekcji zdjęć możesz:
   - **Usunąć istniejące zdjęcie** — najedź na zdjęcie i kliknij przycisk ❌.
   - **Dodać nowe zdjęcia** — kliknij „Dodaj zdjęcia" i wybierz pliki.
   - Produkt musi mieć **co najmniej jedno zdjęcie**.
5. Kliknij **„Aktualizuj produkt"**, aby zapisać zmiany.

### 3.4. Aktywacja / Deaktywacja produktu

Produkt może być **aktywny** (widoczny w sklepie) lub **nieaktywny** (ukryty).

1. Kliknij menu `⋮` przy produkcie.
2. Wybierz **„Deaktywuj"** (jeśli produkt jest aktywny) lub **„Aktywuj"** (jeśli jest nieaktywny).
3. Zmiana następuje natychmiast — zobaczysz potwierdzenie w postaci komunikatu.

### 3.5. Usuwanie produktu

1. Kliknij menu `⋮` przy produkcie.
2. Wybierz **„Usuń"**.
3. Produkt zostanie trwale usunięty wraz ze zdjęciami.

> **Uwaga:** Nie można usunąć produktu, który ma przypisane zamówienia. Opcja „Usuń" będzie wyszarzona.

---

## 4. Zamówienia

Sekcja **Zamówienia** (`/admin/zamowienia`) pozwala przeglądać i zarządzać zamówieniami klientów.

### 4.1. Lista zamówień

Tabela zamówień zawiera:

| Kolumna         | Opis                                              |
| --------------- | ------------------------------------------------- |
| Klient          | Adres email klienta oraz typ konta (Detal / Hurt) |
| Status          | Aktualny status zamówienia (kolorowa etykieta)    |
| Data zamówienia | Data i godzina złożenia zamówienia                |
| Produkty        | Liczba pozycji w zamówieniu                       |
| Kwota (PLN)     | Łączna kwota zamówienia                           |
| Akcje           | Menu z opcjami                                    |

Możesz **sortować** listę klikając na nagłówki kolumn: **Status**, **Data zamówienia**, **Produkty**, **Kwota**.

### 4.2. Statusy zamówień

Każde zamówienie przechodzi przez następujące statusy:

| Status           | Znaczenie                                 |
| ---------------- | ----------------------------------------- |
| **Oczekujące**   | Zamówienie złożone, oczekuje na opłatę    |
| **Opłacone**     | Płatność otrzymana                        |
| **W realizacji** | Zamówienie jest pakowane / przygotowywane |
| **Wysłane**      | Paczka została wysłana do klienta         |
| **Dostarczone**  | Paczka dotarła do klienta                 |
| **Anulowane**    | Zamówienie zostało anulowane              |

### 4.3. Zmiana statusu zamówienia

#### Z poziomu listy zamówień:

1. Kliknij menu `⋮` przy zamówieniu.
2. W zależności od aktualnego statusu, dostępne są różne opcje:
   - **Oczekujące / Opłacone** → „Rozpocznij realizację" lub „Potwierdź w Apaczka"
   - **W realizacji** → „Oznacz jako wysłane"
   - **Wysłane** → „Oznacz jako dostarczone"
3. Opcja **„Anuluj zamówienie"** jest dostępna dla zamówień, które nie zostały jeszcze dostarczone ani anulowane. Przed anulowaniem pojawi się okno potwierdzenia.

#### Z poziomu szczegółów zamówienia:

1. Kliknij **„Szczegóły zamówienia"** w menu `⋮`.
2. W sekcji „Zmień status" kliknij odpowiedni przycisk.

### 4.4. Szczegóły zamówienia

Po kliknięciu **„Szczegóły zamówienia"** widzisz pełne informacje:

- **Szczegóły zamówienia** — ID, status, data, kwota, liczba produktów.
- **Dane klienta** — email, imię, nazwisko, typ konta. Przycisk „Zobacz profil klienta" przenosi do strony klienta.
- **Adres rozliczeniowy** — dane do faktury.
- **Adres dostawy** — dane do wysyłki (ulica, telefon, kod pocztowy, miasto, kraj).
- **Dostawa do punktu (Apaczka)** — jeśli klient wybrał dostawę do punktu odbioru, widoczne są:
  - Dostawca punktu (np. InPost, DPD Pickup)
  - ID punktu
  - Numer listu przewozowego
  - Status przesyłki w Apaczka
  - Telefon kontaktowy do odbioru
- **Lista produktów** — tabela z nazwami produktów, ceną jednostkową, ilością i sumą.

### 4.5. Apaczka — potwierdzanie przesyłek

Apaczka to system zarządzania wysyłkami. Panel oferuje kilka sposobów interakcji z Apaczką:

#### Potwierdzenie pojedynczego zamówienia

1. Kliknij menu `⋮` przy zamówieniu ze statusem **Oczekujące** lub **Opłacone**.
2. Wybierz **„Potwierdź w Apaczka"**.
3. System utworzy przesyłkę w Apaczka i przypisze numer listu przewozowego do zamówienia.

#### Potwierdzenie wszystkich zamówień naraz

1. Na stronie zamówień kliknij przycisk **„Potwierdź wszystkie w Apaczka"** (u góry strony).
2. System automatycznie utworzy przesyłki dla wszystkich kwalifikujących się zamówień.
3. Po zakończeniu:
   - Zobaczysz podsumowanie (ile przesyłek utworzono, ile się nie powiodło).
   - Jeśli wystąpią błędy, zostaną wyświetlone szczegółowe komunikaty dla każdego zamówienia.
   - Automatycznie zostanie pobrany **plik PDF ze zbiorczym potwierdzeniem nadań** — jest to dokument do przekazania kurierowi.

#### Pobieranie etykiety wysyłkowej

1. Po potwierdzeniu zamówienia w Apaczka (kiedy zamówienie ma nadany numer w Apaczka), w menu `⋮` pojawi się opcja **„Pobierz etykietę"**.
2. Kliknij ją — etykieta zostanie pobrana jako plik PDF.
3. Wydrukuj etykietę i naklej na paczkę.

### 4.6. Apaczka — synchronizacja statusów

Przycisk **„Synchronizuj statusy Apaczka"** (u góry strony zamówień) pobiera aktualne statusy przesyłek z systemu Apaczka i aktualizuje je w panelu.

Użyj tej opcji, aby:

- Sprawdzić, czy paczki zostały odebrane przez kuriera.
- Zaktualizować statusy śledzenia dla wszystkich zamówień naraz.

Po synchronizacji zobaczysz komunikat z liczbą zaktualizowanych i błędnych zamówień.

---

## 5. Klienci

Sekcja **Klienci** (`/admin/klienci`) pozwala zarządzać kontami użytkowników sklepu.

### 5.1. Lista klientów

Tabela klientów zawiera:

| Kolumna          | Opis                                      |
| ---------------- | ----------------------------------------- |
| Email            | Adres email klienta                       |
| Typ konta        | Detal, Hurt lub Admin (kolorowa etykieta) |
| Data rejestracji | Kiedy klient się zarejestrował            |
| Zamówienia       | Liczba zamówień złożonych przez klienta   |
| Wydane (PLN)     | Łączna kwota wydana przez klienta         |
| Akcje            | Menu z opcjami                            |

Możesz **sortować** listę klikając na nagłówki: **Typ konta**, **Data rejestracji**, **Zamówienia**, **Wydane (PLN)**.

### 5.2. Typy kont

W systemie istnieją trzy typy kont:

| Typ konta | Opis                                                 |
| --------- | ---------------------------------------------------- |
| **Detal** | Zwykły klient detaliczny                             |
| **Hurt**  | Klient hurtowy (może mieć inne ceny lub warunki)     |
| **Admin** | Administrator z dostępem do panelu administracyjnego |

### 5.3. Dodawanie nowego klienta

1. Kliknij **„Dodaj klienta"** w prawym górnym rogu.
2. Wypełnij formularz:
   - **Email** — adres email (wymagane, musi być unikalny).
   - **Imię** — opcjonalne.
   - **Nazwisko** — opcjonalne.
   - **Telefon** — opcjonalne.
   - **Hasło** — minimum 6 znaków (wymagane).
   - **Powtórz hasło** — musi być identyczne z hasłem.
   - **Typ konta** — wybierz: Detal, Hurt lub Admin.
3. Kliknij **„Dodaj klienta"**, aby zapisać.

### 5.4. Edycja klienta

Z poziomu szczegółów klienta (patrz 5.6) możesz zmienić dane klienta.

### 5.5. Zmiana typu konta

1. Kliknij menu `⋮` przy kliencie na liście (lub użyj przycisku na stronie szczegółów).
2. Wybierz **„Zmień typ konta"**.
3. W oknie dialogowym zaznacz nowy typ konta: Detal, Hurt lub Admin.
4. Kliknij **„Zapisz zmiany"**.

### 5.6. Szczegóły klienta

Kliknij **„Szczegóły"** w menu `⋮` lub wejdź na stronę `/admin/klienci/[id]`. Znajdziesz tam:

- **Informacje o kliencie** — email, typ konta, imię, nazwisko, data rejestracji, łącznie wydana kwota.
- **Adresy** — lista zapisanych adresów klienta (ulica, kod pocztowy, miasto, kraj, telefon). Każdy adres może mieć oznaczenie „Domyślny" oraz typ (np. do wysyłki, do faktury).
- **Ostatnie zamówienia** — 10 ostatnich zamówień klienta z informacjami: ID zamówienia, data, kwota, status, metoda płatności. Kliknięcie w zamówienie przenosi do jego szczegółów.

### 5.7. Usuwanie klienta

1. Kliknij menu `⋮` przy kliencie na liście (lub użyj przycisku na stronie szczegółów).
2. Wybierz **„Usuń"**.
3. Potwierdź w oknie dialogowym.

> **Uwaga:** Nie można usunąć klienta, który posiada zamówienia. Opcja „Usuń" będzie wyszarzona, a komunikat poinformuje o przyczynie.

---

## 6. Blog (CMS)

Sekcja **Blog** (`/admin/blog`) służy do zarządzania wpisami blogowymi wyświetlanymi na stronie sklepu.

### 6.1. Lista wpisów

Tabela wpisów zawiera:

| Kolumna  | Opis                                                |
| -------- | --------------------------------------------------- |
| Nagłówek | Tytuł wpisu                                         |
| Slug     | Adres URL wpisu (generowany automatycznie z tytułu) |
| Data     | Data utworzenia wpisu                               |
| Akcje    | Menu z opcjami                                      |

### 6.2. Dodawanie nowego wpisu

1. Kliknij **„Dodaj wpis"** w prawym górnym rogu.
2. Wypełnij formularz:
   - **Tytuł** — tytuł wpisu (wymagane).
   - **Treść (Markdown)** — treść wpisu z formatowaniem Markdown. Edytor pozwala na podgląd w czasie rzeczywistym (podział ekranu: edycja po lewej, podgląd po prawej).
   - **Obraz wpisu** — opcjonalny. Kliknij pole „Dodaj obraz", aby przesłać zdjęcie, które będzie wyświetlane jako grafika wpisu.
3. Kliknij **„Dodaj wpis"**, aby opublikować.

> **Slug** (adres URL wpisu) jest generowany automatycznie na podstawie tytułu. Jeśli istnieje już wpis z takim samym slugem, system automatycznie doda numer (np. 'moj-wpis-2').

### 6.3. Edycja wpisu

1. Na liście wpisów kliknij menu `⋮` przy wybranym wpisie.
2. Wybierz **„Edytuj"**.
3. Zmień potrzebne pola. W sekcji obrazu możesz:
   - **Usunąć istniejący obraz** — najedź na obraz i kliknij „Usuń".
   - **Dodać nowy obraz** — kliknij pole „Dodaj obraz" i wybierz plik.
4. Kliknij **„Aktualizuj wpis"**, aby zapisać zmiany.

### 6.4. Usuwanie wpisu

1. Na liście wpisów kliknij menu `⋮` przy wybranym wpisie.
2. Wybierz **„Usuń"**.
3. Wpis zostanie trwale usunięty wraz z powiązanym obrazem.

---



## Nawigacja panelu

Na górze strony znajduje się pasek nawigacji z zakładkami:

| Zakładka       | Opis                          |
| -------------- | ----------------------------- |
| **Dashboard**  | Strona główna z podsumowaniem |
| **Produkty**   | Zarządzanie produktami        |
| **Zamówienia** | Zarządzanie zamówieniami      |
| **Klienci**    | Zarządzanie klientami         |
| **Blog**       | Zarządzanie wpisami bloga     |

Aktualnie wybrana zakładka jest podświetlona. W prawym rogu paska znajduje się przycisk **Wyloguj się**.
