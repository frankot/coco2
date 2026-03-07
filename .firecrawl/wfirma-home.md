- Body
- Headers (0)

- Body
- Headers (0)

- Body
- Headers (0)

- Body
- Headers (0)

- Body
- Headers (0)

- Body
- Headers (0)

- Body
- Headers (0)

- Body
- Headers (0)

- Body
- Headers (0)

- Body
- Headers (0)

- Body
- Headers (0)

- Body
- Headers (0)

- Body
- Headers (0)

- Body
- Headers (0)

- Body
- Headers (0)

- Body
- Headers (0)

- Body
- Headers (0)

- Body
- Headers (0)

- Body
- Headers (0)

- Body
- Headers (0)

- Body
- Headers (0)

- Body
- Headers (0)

- Body
- Headers (0)

- Body
- Headers (0)

- Body
- Headers (0)

- Body
- Headers (0)

- Body
- Headers (0)

- Body
- Headers (0)

- Body
- Headers (0)

- Body
- Headers (0)

- Body
- Headers (0)

- Body
- Headers (0)

- Body
- Headers (0)

- Body
- Headers (0)

- Body
- Headers (0)

- Body
- Headers (0)

- Body
- Headers (0)

- Body
- Headers (0)

- Body
- Headers (0)

- Body
- Headers (0)

- Body
- Headers (0)

- Body
- Headers (0)

- Body
- Headers (0)

- Body
- Headers (0)

- Body
- Headers (0)

- Body
- Headers (0)

- Body
- Headers (0)

- Body
- Headers (0)

- Body
- Headers (0)

- Body
- Headers (0)

- Body
- Headers (0)

- Body
- Headers (0)

- Body
- Headers (0)

- Body
- Headers (0)

- Body
- Headers (0)

- Body
- Headers (0)

- Body
- Headers (0)

- Body
- Headers (0)

- Body
- Headers (0)

- Body
- Headers (0)

- Body
- Headers (0)

- Body
- Headers (0)

- Body
- Headers (0)

- Body
- Headers (0)

- Body
- Headers (0)

- Body
- Headers (0)

- Body
- Headers (0)

- Body
- Headers (0)

- Body
- Headers (0)

- Body
- Headers (0)

- Body
- Headers (0)

- Body
- Headers (0)

- Body
- Headers (0)

- Body
- Headers (0)

- Body
- Headers (0)

- Body
- Headers (0)

- Body
- Headers (0)

- Body
- Headers (0)

- Body
- Headers (0)

- Body
- Headers (0)

- Body
- Headers (0)

- Body
- Headers (0)

- Body
- Headers (0)

- Body
- Headers (0)

- Body
- Headers (0)

- Body
- Headers (0)

- Body
- Headers (0)

- Body
- Headers (0)

- Body
- Headers (0)

- Body
- Headers (0)

- Body
- Headers (0)

- Body
- Headers (0)

- Body
- Headers (0)

- Body
- Headers (0)

Public

Documentation Settings

ENVIRONMENT

No Environment

LAYOUT

Double Column

LANGUAGE

cURL - cURL

wFirma.pl

[Introduction](https://doc.wfirma.pl/#intro)

Autoryzacja

Komunikacja

Moduły

Szablony wydruków

contractors

companies

company\_accounts

company\_addresses

company\_packs

declaration\_body\_jpkvat

declaration\_body\_pit

declaration\_countries

documents

expenses

goods

interests

invoices

invoicecontents

invoice\_ledger

invoices\_correction

invoice\_descriptions

invoice\_deliveries

notes

payments

payment\_cashboxes

series

tags

taxregisters

terms

term\_groups

translation\_languages

user\_companies

users

vat\_codes

vat\_contents

vehicle\_run\_rates

vehicles

warehouses

warehouse\_documents

ledger\_accountant\_years

ledger\_operation\_schemas

webhooks

# wFirma.pl

# Autoryzacja

## API Key

API Key jest kluczem interfejsu programistycznego aplikacji pozwalającym posiadaczowi na uwierzytelnienie akcji wykonywanych po stronie wfirma.pl za pomocą interfejsu API.

##### Niezbędne informacje

Po stronie systemu wFirma w zakładce Ustawienia >> Bezpieczeństwo >> Aplikacje >> Klucze API możliwe jest utworzenie dwóch kluczy API ( **accessKey** oraz **secretKey**).

Do poprawnego działania autoryzacji API Key wymagane są 3 klucze:

- **accessKey** \- uzyskiwany według powyżej przedstawionej instrukcji

- **secretKey** \- uzyskiwany według powyżej przedstawionej instrukcji

- **appKey** \- dostarczane przez wfirma.pl indywidualnie dla każdej aplikacji


Użytkownik powinien mieć na uwadze, że **secretKey** zostanie wyświetlony wyłącznie **raz** podczas tworzenia kluczy oraz że **każda** modyfikacja klucza aplikacji z poziomu zakładki Ustawienia >> Bezpieczeństwo >> Aplikacje >> Klucze, będzie skutkowała zmianą **accessKey** oraz **secretKey**.

##### Uzyskiwanie appKey

Klucz AppKey, jest kluczem wymaganym dla twórców integracji. Ma on na celu zautoryzować zapytania wysyłane przez daną integrację (jeden klucz appKey może obsłużyć wiele kont użytkowników w systemie wFirma). W celu uzyskania appKey konieczne jest uzupełnienie formularza dostępnego [tutaj](https://wfirma.pl/kontakt/1#appKey).

W formularzu proszę zawrzeć informacje:

- nazwa aplikacji

- numer telefonu

- adres e-mail

- adres www


Po uzupełnieniu formularza, na podany adres e-mail zostanie wysłana wiadomość z kluczem appKey.

##### Pobieranie danych z API

Po uzyskaniu 3 wcześniej wymienionych kluczy należy je przesłać w nagłówkach zapytania:

- **accessKey**: "{accessKey}"

- **secretKey**: "{secretKey}"

- **appKey**: "{appKey}"


W odróżnieniu od metod autoryzacji oAuth, w przypadku wykorzystania API Key nie ma potrzeby dodawania do zapytania żadnego parametru określającego rodzaj autoryzacji.

Przykład wprowadzonych kluczy w nagłówkach zapytania:

Plain Text

```plain
--header 'accessKey: ********************************' \
--header 'secretKey: ********************************' \
--header 'appKey: ********************************' \
```

## OAuth

OAuth jest otwartym standardem autoryzacyjnym umożliwiającym wykonanie autoryzacji po stronie wfirma.pl. Użytkownik logujący się do wfirma.pl uwierzytelnia aplikację do konkretnych modułów. Więcej o OAuth na wikipedia.org oraz oauth.net.

### Oauth 1.0a

W wfirma.pl możliwa jest autoryzacja po OAuth w wersji 1.0a. Serwis akceptuje jedynie zapytania, które nie są szyfrowane na poziomie protokołu OAuth (signature method = plaintext), więc komunikacja powinna odbywać się przez SSL z użyciem protokołu HTTPS. Zapytania requestToken i accessToken powinny być wykonane metodą GET.

Zapytania URL nie różnią się w żaden sposób od zapytań realizowanych przy autoryzacji przez mechanizm HTTP Basic Auth. Jedyne zmiany wynikają z dodatkowych nagłówków, koniecznych przy OAuth oraz komunikacji przez HTTPS, zamiast HTTP.

##### Niezbędne informacje

- **consumer\_key, consumer\_secret** \- dostarczane przez wfirma.pl indywidualnie dla każdej aplikacji

- **server\_uri** \- [https://api2.wfirma.pl](https://api2.wfirma.pl/)

- **signature\_method** \- PLAINTEXT

- **request\_token\_uri** \- [https://wfirma.pl/oauth/requestToken](https://wfirma.pl/oauth/requestToken)

- **authorize\_uri** \- [https://wfirma.pl/oauth/authorize](https://wfirma.pl/oauth/authorize)

- **access\_token\_uri** \- [https://wfirma.pl/oauth/accessToken](https://wfirma.pl/oauth/accessToken)


##### Uzyskiwanie consumer\_key oraz consumer\_secret

W celu uzyskania consumer\_key oraz consumer\_secret (varchar(32)) konieczne jest wysłanie wiadomości na adres e-mail [pomoc@wfirma.pl](https://mailto:pomoc@wfirma.pl/). W wiadomości proszę zawrzeć informacje:

- nazwa producenta

- numer telefonu producenta

- adres e-mail producenta

- adres www producenta

- nazwa aplikacji

- krótki opis aplikacji


##### Uprawnienia aplikacji

Platforma API została podzielona na zakresy (scopes). Możliwe jest uzyskanie dostępu do jednego lub więcej zakresów jednocześnie. Każdy moduł API dzieli się na dwa zakresy: do odczytu i do zapisu. Zakresy określane są w następujący sposób: -, np. invoices-read lub invoices-write. Zakres do odczytu najczęściej określa dostęp do metod find/get, natomiast zakres do zapisu add/edit/delete.

W przypadku próby zapytania do zakresu, do którego nie ma się dostępu zwracany jest komunikat błędu DENIED\_SCOPE\_REQUESTED. Taka sytuacja powinna być obsłużona po stronie aplikacji.

##### Uzyskanie autoryzacji użytkownika

Uzyskanie autoryzacji aplikacji przez użytkownika skutkuje przydzieleniem access\_token oraz access\_token\_secret (varchar(32)), które powinny być zapamiętane po stronie aplikacji, ponieważ konieczne jest ich wykorzystanie przy każdym zapytaniu do API.

Uzyskiwanie tych danych odbywa się zgodnie z dokumentacją OAuth. Przykładową implementację można znaleźć poniżej.

Implementacja podstawowych funkcji przy korzystaniu z biblioteki [OAuth w PHP](https://www.php.net/manual/en/book.oauth.php).

##### Zgoda użytkownika na dostęp do danych

View More

Plain Text

```plain
function requestToken() {
    $consumerKey = 'tutaj nadany consumer_key';
    $consumerSecret = 'tutaj nadany consumer_secret';
    $oAuth = new OAuth($consumerKey, $consumerSecret, OAUTH_SIG_METHOD_PLAINTEXT);
    $scope = 'invoices-read,invoices-write,contractors-read,contractors-write';
    $callback = 'http://mypage.example.com/callback.php';
    try {
        $tokenInfo = $oAuth->getRequestToken(
            'https://wfirma.pl/oauth/requestToken?scope=' . $scope,
            $callback,
            'GET'
        );
        $_SESSION['oauthSecret'] = $tokenInfo['oauth_token_secret'];
        header('Location: https://wfirma.pl/oauth/authorize?oauth_token=' . $tokenInfo['oauth_token']);
    } catch (OAuthException $exception) {
    }
}
```

##### Uzyskanie access\_token oraz access\_token\_secret

View More

Plain Text

```plain
function accessToken() {
    $oAuth = new OAuth(CONSUMER_KEY, CONSUMER_SECRET, OAUTH_SIG_METHOD_PLAINTEXT);
    $oAuth->setToken($_GET['oauth_token'], $_SESSION['oauthSecret']);
    unset($_SESSION['oauthSecret']);
    try {
        $tokenInfo = $oAuth->getAccessToken(
            'https://wfirma.pl/oauth/accessToken?oauth_verifier=' . $_GET['oauth_verifier'],
            null,
            null,
            'GET'
        );
    } catch (OAuthException $exception) {
        // Wystąpił błąd podczas autoryzacji.
        return;
    }
    $_SESSION['oauth_token_secret'] = $tokenInfo['oauth_token_secret'];
    $_SESSION['oauth_token'] = $tokenInfo['oauth_token'];
    header('Location: /');
}
```

##### Pobieranie danych z API

View More

Plain Text

```plain
function oauthRequest($action, $data = []) {
    $oAuth = new OAuth(CONSUMER_KEY, CONSUMER_SECRET, OAUTH_SIG_METHOD_PLAINTEXT);
    $oAuth->setToken($_SESSION['oauth_token'], $_SESSION['oauth_token_secret']);
    try {
        $oAuth->fetch(
            'https://api2.wfirma.pl/' . $action,
            !empty($data) ? $data : '',
            OAUTH_HTTP_METHOD_POST
        );
    } catch (Exception $exception) {
        return false;
    }
    return $oAuth->getLastResponse();
}
```

## Oauth 2.0

### Tworzenie aplikacji

Po stronie systemu wFirma w zakładce Ustawienia >> Bezpieczeństwo >> Aplikacje >> Aplikacje OAuth 2.0 możliwe jest utworzenie aplikacji, gdzie należy uzupełnić pola:

- **Nazwę aplikacji**

- **Zakres (scope)** umożliwiający dostęp do wybranych zasobów

- **Adres zwrotny (redirect\_uri)**

- **Adres IP klienta**


Utworzenie aplikacji możliwe jest wyłacznie w przypadku posiadania [zweryfikowanej firmy](https://pomoc.wfirma.pl/-weryfikacja-firmy) w systemie.

Po utworzeniu aplikacji zostanie ona poddana weryfikacji przez pracowników wFirma.

Do zweryfikowanej aplikacji zostaną przydzielone indywidualne klucze ( **client\_id** oraz **client\_secret**) widoczne po kliknięciu w nazwę aplikacji.

### Autoryzacja użytkownika

Udostępniamy autoryzację typu **Authorization Code**.

Korzystając ze sparametryzowanego żadania HTTP do zasobu pozwalającego na uwierzytelnienie użytkownika:

View More

Plain Text

```plain
https://wfirma.pl/oauth2/auth?response_type=code&client_id={client_id}&scope=invoices-read invoices-write&redirect_uri=https://example.com
```

##### Wymagane Parametry

- **response\_type**

- **client\_id**

- **scope**

- **redirect\_uri**


Wówczas w odpowiedzi serwera zostanie zwrócony authorization\_code, który należy przesłać wysyłając żądanie:

Plain Text

```plain
https://api2.wfirma.pl/oauth2/token?oauth_version=2
```

##### Wymagane pola

- **grant\_type**: "authorization\_code"

- **code**: "{authorization\_code}"

- **redirect\_uri**: "{redirect\_uri}"

- **client\_id**: "{client\_id}"

- **client\_secret**: "{client\_secret}"


W odpowiedzi serwera zostanie zwrócony access\_token, który służy do uwierzytelnienia użytkownika podczas wyciągania zasobów z API. Należy go przesłać w nagłówku **Authorization** (Bearer) podczas wysyłania zapytań do API.

Odpytywanie API odbywa się standarowo korzystając z dostępnych akcji. Dodatkowo należy przekazać parametr:

Plain Text

```plain
?oauth_version=2
```

# Komunikacja

## Konwencja nazw akcji

Nazewnictwo akcji z założenia jest stałe:

- get

- find

- add

- edit

- delete


Zdarzają się dodatkowe akcje, które nie zawierają się w powyższej liście, np. `/invoices/download`.

Szczegółowy opis akcji dostępnych w danym module znajduje się przy dokumentacji konkretnego modułu.

Odnośniki URL akcji tworzone są w konwencji: `https://api2.wfirma.pl/NAZWA_MODUŁU/NAZWA_AKCJI`. Podawanie id do akcji odbywa się w sposób: `https://api2.wfirma.pl/NAZWA_MODUŁU/NAZWA_AKCJI/IDENTYFIKATOR`, chyba że jest napisane inaczej.

## Parametr company\_id

W przypadku jeśli użytkownik posiada wiele firm w systemie wFirma, powinien wybrać odpowiednią firmę do odpytania za pomocą parametru `comapny_id`.

Przykładowe wykorzystanie: `https://api2.wfirma.pl/invoices/find?outputFormat=xml&inputFormat=xml&company_id=ID_FIRMY`.

Brak podania danego parametru może wiązać się z tym, że zapytanie zostanie wysłane do niepożądenj firmy użytkownika w systemie.

## Format wymiany danych

Każdorazowo w każdym zapytaniu lub odpowiedzi mamy do czynienia z maksymalnie dwoma gałęziami najwyższego poziomu. W formacie XML objęte są one gałęzią **api**. Dwie główne gałęzie to:

- **status** \- zawiera w sobie gałąź code z ogólnym kodem zapytania.

- Gałąź o nazwie modułu w formie mnogiej, np. **invoices**. Gałąź ta zawiera w sobie gałęzie:


  - **parameters** \- parametry zapytania

  - Gałąź o nazwie modułu w formie pojedynczej, np. **invoice**. Ilość tych gałęzi może być dowolna. Przy formacie JSON takie gałęzie **muszą być zawsze** numerowane za pomocą klucza (nawet jeśli istnieje tylko jedna taka gałąź). Od tej gałęzi wychodzą kolejne gałęzie, których kolejność nie ma znaczenia i mogą to być:


    - Identyfikujące poszczególne pola, np. **id**, **date**. Szczegółowe opisy pól gałęzi można znaleźć na podstronach poszczególnych modułów.

    - Gałęzie identyfikujące powiązane moduły, np: zawartość faktury ( **invoice\_content**) wewnątrz rekordu faktury ( **invoice**).

       Szczegółowe informacje na temat możliwych powiązań modułów można znaleźć przy opisie każdego z modułów


      - Forma skrócona: gałąź zawiera jedynie pole **id**. O szczegółowe dane należy dopytać się osobnym zapytaniem.

      - Forma pełna: gałąź zawiera wszystkie pola powiązanego modułu. Opisy poszczególnych pól można znaleźć w sekcji nt. modułu powiązanego.

      - Typ pojedynczy - nazwa gałęzi jest w formie pojedynczej: powiązany jest maksymalnie jeden rekord tego modułu (np. **company\_details**).

      - Typ mnogi - nazwa gałęzi jest w formie mnogiej: możliwe powiązanie większej ilości rekordów tego modułu. Każdy z rekordów znajduje się w osobnej gałęzi o nazwie modułu w formie pojedynczej.


##### Przykładowa odpowiedź

View More

Plain Text

```plain
<invoices> <comment class=&#x27;preserveHtml&#x27; class=&#x27;preserveHtml&#x27; class=&#x27;preserveHtml&#x27; class=&#x27;preserveHtml&#x27; class=&#x27;preserveHtml&#x27; class=&#x27;preserveHtml&#x27; class=&#x27;preserveHtml&#x27;> nazwa modułu       -->
   <invoice> <comment class=&#x27;preserveHtml&#x27; class=&#x27;preserveHtml&#x27; class=&#x27;preserveHtml&#x27; class=&#x27;preserveHtml&#x27; class=&#x27;preserveHtml&#x27; class=&#x27;preserveHtml&#x27; class=&#x27;preserveHtml&#x27;> pojedynczy rekord modułu       -->
      <id>1207242</id> <comment class=&#x27;preserveHtml&#x27; class=&#x27;preserveHtml&#x27; class=&#x27;preserveHtml&#x27; class=&#x27;preserveHtml&#x27; class=&#x27;preserveHtml&#x27; class=&#x27;preserveHtml&#x27; class=&#x27;preserveHtml&#x27;> pole       -->
      <date>2011-12-22</date> <comment class=&#x27;preserveHtml&#x27; class=&#x27;preserveHtml&#x27; class=&#x27;preserveHtml&#x27; class=&#x27;preserveHtml&#x27; class=&#x27;preserveHtml&#x27; class=&#x27;preserveHtml&#x27; class=&#x27;preserveHtml&#x27;> pole       -->
      <company_detail> <comment class=&#x27;preserveHtml&#x27; class=&#x27;preserveHtml&#x27; class=&#x27;preserveHtml&#x27; class=&#x27;preserveHtml&#x27; class=&#x27;preserveHtml&#x27; class=&#x27;preserveHtml&#x27; class=&#x27;preserveHtml&#x27;> powiązany moduł - forma pełna, typ pojedynczy       -->
         <id>702218</id>
         <name>PPHU Komputery-Kowalski</name>
         <altname>Komputery-Kowalski</altname>
         <nip>8982073475</nip>
         <street>Legnicka</street>
         <building_number>33</building_number>
         <flat_number>12</flat_number>
         <zip>54-162</zip>
         <post>Wrocław</post>
         <city>Wrocław</city>
         <bank_name>BZWBK</bank_name>
         <bank_account>59 1111 2222 3333 4444 5555 6666</bank_account>
         <bank_swift></bank_swift>
         <bank_address></bank_address>
         <created>2011-12-22 11:23:12</created>
         <modified>2011-12-22 11:23:12</modified>
      </company_detail>
      <invoicecontents> <comment class=&#x27;preserveHtml&#x27; class=&#x27;preserveHtml&#x27; class=&#x27;preserveHtml&#x27; class=&#x27;preserveHtml&#x27; class=&#x27;preserveHtml&#x27; class=&#x27;preserveHtml&#x27; class=&#x27;preserveHtml&#x27;> powiązany moduł - forma pełna, typ mnogi       -->
         <invoicecontent>
            <id>3187305</id>
            <name>makulatura 2011</name>
            <classification></classification>
            <unit>kg</unit>
            <count>4850.0000</count>
            <price>0.20</price>
            <price_modified>0</price_modified>
            <discount>1</discount>
            <discount_percent>0.00</discount_percent>
            <netto>970.00</netto>
            <brutto>1193.10</brutto>
            <lumpcode></lumpcode>
            <created>2011-12-22 11:23:12</created>
            <modified>2011-12-22 11:23:12</modified>
            <vat>23</vat>
            <good>
               <id>0</id>
            </good>
            <invoice>
               <id>1207242</id>
            </invoice>
            <tangiblefixedasset>
               <id>0</id>
            </tangiblefixedasset>
            <equipment>
               <id>0</id>
            </equipment>
            <vehicle>
               <id></id>
            </vehicle>
         </invoicecontent>
      </invoicecontents>
      <series> <comment class=&#x27;preserveHtml&#x27; class=&#x27;preserveHtml&#x27; class=&#x27;preserveHtml&#x27; class=&#x27;preserveHtml&#x27; class=&#x27;preserveHtml&#x27; class=&#x27;preserveHtml&#x27; class=&#x27;preserveHtml&#x27;> powiązany moduł - forma skrócona, typ pojedynczy       -->
         <id>1</id>
      </series>
      <translation_language> <comment class=&#x27;preserveHtml&#x27; class=&#x27;preserveHtml&#x27; class=&#x27;preserveHtml&#x27; class=&#x27;preserveHtml&#x27; class=&#x27;preserveHtml&#x27; class=&#x27;preserveHtml&#x27; class=&#x27;preserveHtml&#x27;> powiązany moduł - brak powiązania       -->
         <id>0</id>
      </translation_language>
   </invoice>
   <parameters> <comment class=&#x27;preserveHtml&#x27; class=&#x27;preserveHtml&#x27; class=&#x27;preserveHtml&#x27; class=&#x27;preserveHtml&#x27; class=&#x27;preserveHtml&#x27; class=&#x27;preserveHtml&#x27; class=&#x27;preserveHtml&#x27;> parametry odpowiedzi       -->
      <limit>20</limit>
      <page>1</page>
      <total>11</total>
   </parameters>
</invoices>
<status> <comment class=&#x27;preserveHtml&#x27; class=&#x27;preserveHtml&#x27; class=&#x27;preserveHtml&#x27; class=&#x27;preserveHtml&#x27; class=&#x27;preserveHtml&#x27; class=&#x27;preserveHtml&#x27; class=&#x27;preserveHtml&#x27;> ogólny status odpowiedzi       -->
   <code class=&#x27;preserveHtml&#x27; class=&#x27;preserveHtml&#x27; class=&#x27;preserveHtml&#x27; class=&#x27;preserveHtml&#x27; class=&#x27;preserveHtml&#x27; class=&#x27;preserveHtml&#x27; class=&#x27;preserveHtml&#x27;>OK</code>
</status>
```

## Implementacja

Implementacja po stronie klienta API nie powinna zwracać uwagi na kolejność gałęzi o różnych nazwach.

Jeżeli mamy do czynienia z dwoma gałęziami o tej samej nazwie, to ich kolejność może mieć znaczenie (np. w przypadku akcji /invoices/find segregowanej po dacie wystawienia).

W przyszłości wraz z rozrostem API mogą znaleźć się w odpowiedzi gałęzie, których teraz nie przewidziano. Powinno się wziąć to pod uwagę podczas implementacji klienta API - dodatkowe elementy w odpowiedzi nie powinny mieć znaczenia przy realizacji danej akcji.

Obie poniższe gałęzie są równoważne

Plain Text

```plain
<user>
    <id>124233</id>
    <login>jan@kowalski.com</login>
</user>
```

Plain Text

```plain
<user>
    <login>jan@kowalski.com</login>
    <id>124233</id>
</user>
```

## Format wejściowy / wyjściowy

Wybór preferowanego formatu przez klienta API odbywa się za pomocą dodatkowych parametrów (inputFormat i outputFormat) przekazanych w URL'u, np: `https://api2.wfirma.pl/companies/add?inputFormat=json&outputFormat=xml`.

Dozwolone wartości to: **xml** (domyślny) i **json**.

Jeśli nie został ustawiony format wyjściowy, to jest on tożsamy z formatem wejściowym.

Serwer API w transparentny sposób konwertuje z/do każdego obsługiwanego formatu.

> Poniżej jest przykładowa, standardowa odpowiedź na /users/get/124233, /users/add lub /users/edit/124233
>
> users > user to jest nowo dodany / zmodyfikowany / znaleziony rekord
>
> id, login, created, modified są polami rekordu
>
> status > code - ogólny status odpowiedzi

##### Odpowiedź w XML

View More

Plain Text

```plain
<api>
     <users>
         <user>
             <id>124233</id>
             <login>jan@kowalski.com</login>
             <created>0000-00-00 00:00:00</created>
             <modified>0000-00-00 00:00:00</modified>
         </user>
     </users>
     <status>
         <code class=&#x27;preserveHtml&#x27; class=&#x27;preserveHtml&#x27; class=&#x27;preserveHtml&#x27; class=&#x27;preserveHtml&#x27; class=&#x27;preserveHtml&#x27; class=&#x27;preserveHtml&#x27; class=&#x27;preserveHtml&#x27;>OK</code>
     </status>
 </api>
```

##### Odpowiedź w JSON

View More

Plain Text

```plain
{
   "users":{
      "0":{
         "user":{
            "id":"USER_ID",
            "login":"EMAIL",
            "created":"0000-00-00 00:00:00",
            "modified":"0000-00-00 00:00:00"
         }
      }
   },
   "status":{
      "code":"OK"
   }
}
```

## Komunikaty błędów

##### Przerywające komunikaty błędów

- **ACCESS DENIED** \- Uprawnienia nie pozwalają na wykonanie akcji.

- **ACTION NOT FOUND** \- Wywoływana akcja nie istnieje. Sprawdź czy w poprawny sposób podałeś odnośnik.

- **AUTH** \- Wykonanie akcji wymaga podania nazwy użytkownika i hasła. Ten błąd wyświetla się także w przypadku niepoprawnej nazwy użytkownika lub hasła.

- **AUTH FAILED LIMIT WAIT 5 MINUTES** \- Przekroczono limit nieudanych prób logowania.

- **COMPANY ID REQUIRED** \- W przypadku gdy konto powiązane jest z wieloma firmami, należy podać id firmy w parametrze url-a ?company\_id. Listę firm można pobrać akcją /user\_companies/find.

- **DENIED SCOPE REQUESTED** \- Próba wywołania zakresu do którego nie ma się dostępu (tylko przy autoryzacji przez OAuth).

- **ERROR** \- Podczas próby dodania lub modyfikacji obiektu wystąpiły błędy walidacji. Szczegółowe informacje na temat błędów walidacji znajdują się niżej.

- **FATAL** \- Wewnętrzny błąd API. Nie powinien nastąpić. Takie zdarzenia będą monitorowane i analizowane indywidualnie.

- **INPUT ERROR** \- Podane dane wejściowe są niepoprawne. Np. struktura XML jest nieprawidłowa.

- **NOT FOUND** \- Podany obiekt nie istnieje.

- **OUT OF SERVICE** \- Serwis API tymczasowo wyłączony. Proszę spróbować później. Wyłączenia serwisu można się spodziewać podczas aktualizacji wfirma.pl lub samego API.

- **SNAPSHOT LOCK** \- Trwa odtwarzanie danych firmy z kopii zapasowej. Wszystkie operacje są zablokowane.

- **TOTAL REQUESTS LIMIT EXCEEDED** \- Przekroczono limit liczby zapytań do API.

- **TOTAL EXECUTION TIME LIMIT EXCEEDED** \- Przekroczono limit czasu wykonywania zapytań do API.

Z uwagi na to, że limity zależne są od aktualnego obciążenia serwera, zalecane jest wykonywanie zapytań w nocy. Należy również w miarę możliwości unikać wysyłania wielu zapytań w krótkich odstępach czasu.


##### Przykład

View More

Plain Text

```plain
<api>
    <status>
        <code class=&#x27;preserveHtml&#x27; class=&#x27;preserveHtml&#x27; class=&#x27;preserveHtml&#x27; class=&#x27;preserveHtml&#x27; class=&#x27;preserveHtml&#x27; class=&#x27;preserveHtml&#x27; class=&#x27;preserveHtml&#x27;>TYP BŁĘDU</code>
    </status>
</api>
```

## Walidacyjne komunikaty błędów

Walidacyjne komunikaty błędów doklejają do wysłanych wejściowych błędy i wysyłają je jako dane wyjściowe. Błędy są doklejane w gałęzi pojedynczego rekordu (np. api > invoices > invoice).

Cechy błędów walidacji:

- Może istnieć wiele gałęzi errors > error.

- Gałąź errors > error > method > parameters zostaje pusta, jeśli parametry nie istnieją.

- W przypadku wystąpienia błędu walidacji ogólny status (api > status > code) przyjmuje wartość ERROR.


##### Struktura błędu walidacji

View More

Plain Text

```plain
<errors>
    <error>
        <field>nazwa pola</field>
        <message>wiadomość walidacyjna</message>
        <method>
            <name>typ błędu</name>
            <parameters>
                parametr_1,parametr_2,parametr_3
            </parameters>
        </method>
    </error>
</errors>
```

##### Przykładowy rekord z błędami walidacji

View More

Plain Text

```plain
<api>
    <invoices>
        <invoice>
            <paymentmethod>cash</paymentmethod>
            <paymentdate>2011-08-15</paymentdate>
            <type>normal</type>
            <errors>
                <error>
                    <field>date</field>
                    <message>Data musi być w formacie RRRR-MM-DD</message>
                </error>
            </errors>
            <contractor>
                <errors>
                    <error>
                        <field>name</field>
                        <message>Pole nie może być puste</message>
                    </error>
                    <error>
                        <field>street</field>
                        <message>Pole nie może być puste</message>
                    </error>
                    <error>
                        <field>zip</field>
                        <message>Pole nie może być puste</message>
                    </error>
                    <error>
                        <field>city</field>
                        <message>Pole nie może być puste</message>
                    </error>
                </errors>
            </contractor>
            <invoicecontents>
                <invoicecontent>
                    <name>nazwa produktu</name>
                    <unit>szt.</unit>
                    <count>1</count>
                    <price>100</price>
                    <price_modified>0</price_modified>
                    <vat>23</vat>
                </invoicecontent>
                <invoicecontent>
                    <unit>szt.</unit>
                    <count>1</count>
                    <price>100</price>
                    <price_modified>0</price_modified>
                    <vat>23</vat>
                    <errors>
                        <error>
                            <field>name</field>
                            <message>Treść nie moze być pusta</message>
                        </error>
                    </errors>
                </invoicecontent>
            </invoicecontents>
        </invoice>
    </invoices>
    <status>
        <code class=&#x27;preserveHtml&#x27; class=&#x27;preserveHtml&#x27; class=&#x27;preserveHtml&#x27; class=&#x27;preserveHtml&#x27; class=&#x27;preserveHtml&#x27; class=&#x27;preserveHtml&#x27; class=&#x27;preserveHtml&#x27;>ERROR</code>
    </status>
</api>
```

## Konstruowanie zapytań find

Metoda find w każdym dostępnym module API umożliwia przekazywanie dodatkowych warunków do zapytania, możliwe jest przekazanie:

- ilości wyników na stronę

- nr strony z wynikami (page: liczone od 1)


##### Zapytanie o **2 stronę** wyników z limitem **10 na stronę**








Plain Text















```plain
<api>
              <goods>
                  <parameters>
                      <page>2</page>
                      <limit>10</limit>
                  </parameters>
              </goods>
            </api>
```

- Ograniczenie zbioru wyników wyszukiwania do określonych pól. Parametr może w znacznym stopniu poprawić wydajność zapytań.



View More







Plain Text















```plain
<api>
              <invoices>
                  <parameters>
                      <fields>
                          <field>Invoice.id</field>
                          <field>Invoice.fullnumber</field>
                          <field>Invoice.date</field>
                          <field>InvoiceContent.name</field>
                          <field>InvoiceContent.price</field>
                      </fields>
                  </parameters>
              </invoices>
            </api>
```

- Warunki zapytania (conditions, odpowiednik WHERE w SQL). Można w nich wykorzystywać pola powiązanych modułów, które są w relacji 1-1.


  - sekcja **conditions** może zawierać jedną lub więcej sekcji **condition**

  - domyślnym spójnikiem jest AND

  - warunki można łączyć

  - pole **operator** może przyjmować następujące wartości:


    - **eq** \- równa się

    - **ne** \- nie równa się

    - **gt** \- większe niż

    - **lt** \- mniejsze niż

    - **ge** \- większe lub równe

    - **le** \- mniejsze lub równe

    - **like** \- odpowiednik MySQL'owego LIKE

    - **not like** \- odpowiednik MySQL'owego NOT LIKE

    - **is null** \- odpowiednik MySQL'owego IS NULL

    - **is not null** \- odpowiednik MySQL'owego IS NOT NULL

    - **in** \- odpowiednik MySQL-owego IN


View More

Plain Text

```plain
<api>
    <goods>
        <parameters>
            <conditions>
                <condition>
                    <field>name</field>
                    <operator>eq</operator>
                    <value>test</value>
                </condition>
                <comment class=&#x27;preserveHtml&#x27; class=&#x27;preserveHtml&#x27; class=&#x27;preserveHtml&#x27; class=&#x27;preserveHtml&#x27; class=&#x27;preserveHtml&#x27; class=&#x27;preserveHtml&#x27; class=&#x27;preserveHtml&#x27;> and       -->
                <condition>
                    <field>count</field>
                    <operator>gt</operator>
                    <value>0</value>
                </condition>
            </conditions>
        </parameters>
    </goods>
</api>
```

View More

Plain Text

```plain
<api>
    <invoices>
        <parameters>
            <conditions>
                <or>
                    <condition>
                        <field>fullnumber</field>
                        <operator>like</operator>
                        <value>FV 234/2015</value>
                    </condition>
                    <comment class=&#x27;preserveHtml&#x27; class=&#x27;preserveHtml&#x27; class=&#x27;preserveHtml&#x27; class=&#x27;preserveHtml&#x27; class=&#x27;preserveHtml&#x27; class=&#x27;preserveHtml&#x27; class=&#x27;preserveHtml&#x27;> or       -->
                    <condition>
                        <field>number</field>
                        <operator>lt</operator>
                        <value>200</value>
                    </condition>
                </or>
                <comment class=&#x27;preserveHtml&#x27; class=&#x27;preserveHtml&#x27; class=&#x27;preserveHtml&#x27; class=&#x27;preserveHtml&#x27; class=&#x27;preserveHtml&#x27; class=&#x27;preserveHtml&#x27; class=&#x27;preserveHtml&#x27;> and       -->
                <and> <comment class=&#x27;preserveHtml&#x27; class=&#x27;preserveHtml&#x27; class=&#x27;preserveHtml&#x27; class=&#x27;preserveHtml&#x27; class=&#x27;preserveHtml&#x27; class=&#x27;preserveHtml&#x27; class=&#x27;preserveHtml&#x27;> wymagane jeżeli wczesniej użyto <and> lub <or>       -->
                    <condition>
                        <field>Invoice.remaining</field>
                        <operator>gt</operator>
                        <value>0</value>
                    </condition>
                    <comment class=&#x27;preserveHtml&#x27; class=&#x27;preserveHtml&#x27; class=&#x27;preserveHtml&#x27; class=&#x27;preserveHtml&#x27; class=&#x27;preserveHtml&#x27; class=&#x27;preserveHtml&#x27; class=&#x27;preserveHtml&#x27;> and       -->
                    <condition>
                        <field>ContractorDetail.nip</field>
                        <operator>in</operator>
                        <value>8982167294,8982073475</value>
                    </condition>
                </and>
            </conditions>
        </parameters>
    </invoices>
</api>
```

View More

Plain Text

```plain
<api>
    <goods>
        <parameters>
            <conditions>
                <not>
                    <condition>
                        <field>name</field>
                        <operator>eq</operator>
                        <value>test</value>
                    </condition>
                </not>
            </conditions>
        </parameters>
    </goods>
</api>
```

- Wyniki można sortować po polach modułu głównego oraz powiązanych modułach, które są w relacji 1-1.

Plain Text

```plain
<api>
    <goods>
        <parameters>
            <order>
                <asc>name</asc>
                <desc>count</desc>
                <desc>modified</desc>
            </order>
        </parameters>
    </goods>
</api>
```

# Moduły

AUTHORIZATIONOAuth 2.0

## Szablony wydruków

# Wstęp

System wydruków wfirma.pl pozwala na definiowanie własnych szablonów faktur i dokumentów magazynowych w języku XML.

## Faktury

Obecnie możliwe jest definiowane szablonu 4 typów faktur: Faktura VAT, Faktura (bez VAT), Pro forma, Pro forma (bez VAT) oraz dwóch wariantów językowych - dokumentu w języku polskim i polsko-obcojęzycznym. W pierwszej kolejności należy w zakładce Ustawienia » Faktury » Szablony dodać nową grupę szablonów. System automatycznie utworzy dla 4 typów faktur predefiniowane szablony zgodne z szablonem "Elegancki". W przypadku wyboru grupy szablonu dla dokumentu, który nie ma swojej definicji, zastosowany zostanie szablon "Elegancki".

## Dokumenty magazynowe

System pozwala na definiowanie dokumentów WZ, PZ, RW i PW. Dokumenty magazynowe można zdefiniować w zakładce Ustawienia » Inne » Wydruki.

# Ograniczenia

- System dostępny jest dla użytkowników, którzy zweryfikowali swoją firmę.
- Usługa jest obecnie w fazie beta-testów w związku z czym nie są za nią pobierane dodatkowe opłaty.
- Usługa w przyszłości będzie dodatkowo płatna, przy czym cena będzie zbliżona do ceny pakietu Początkowego (Fakturowanie).
- Zastrzegamy sobie prawo do blokowania usługi w przypadku:

  - Wykrycia prób przełamania zabezpieczeń systemu wydruków.
  - Nadmiernego obciążenia systemu.

- W przypadku przekroczenia limitów wykonania skryptu, wystąpienia błędu lub niedostępności usługi, wydruk zostanie wygenerowany w standardowym szablonie "Elegancki".

# Schemat działania

Szablony definiowane są w naszym formacie XML. Możliwe jest stosowanie w nich wstawek języka PHP oraz JavaScript. Przed wysłaniem do systemu wydruków przetwarzane są przez interpreter PHP. W trakcie renderowania przez system wydruków wykonywane są polecenia JavaScript. Zewnętrzny kod wykonywany jest w wyizolowanym środowisku z ograniczonym dostępem do zasobów sieciowych (do obrazków z systemu wfirma.pl oraz API wfirmy).

- **Początek generowania wydruku**
- **Interpreter PHP**
Interpreter generuje ostateczny XML, który posłuży do utworzenia pliku PDF przez system wydruków. Na tym etapie możliwe jest korzystanie z wszystkich funkcji języka PHP oraz wykonywanie zapytań to API za pośrednictwem obiektu ze zmiennej `$api`.
- **Pierwszy etap renderowania XML**
Podczas tego etapu wyliczany jest podział na strony. Wykonywany jest również kod JavaScript dla wszystkich elementów z wyjątkiem nagłówka i stopki (elementów `<header>` i `<footer>`).
- **Drugi etap renderowania XML**
Gdy znany jest już podział na stronie i rozmieszczenie wszystkich elementów na koniec renderowane są nagłówki i stopki. Pozwala to na dynamiczne określenie ich treści na podstawie zawartości strony przy użyciu języka JavaScript. Przykładowo możliwe jest dodanie podsumowań elementów strony czy licznika z numerem strony.
- **Przekazanie gotowego pliku PDF do przeglądarki**

# Interpreter PHP

W trakcie tego etapu do dyspozycji jest szereg tablic z danymi dotyczącymi faktur, obiekt `$api` i helper `$xml`. Pełną zawartość danej tablice można poznać drukując ją `<?=print_r($invoice);?>`

# `$invoice` \- podstawowe informacje związane z fakturą

View More

Plain Text

```plain
<?php
$invoice = array(
    'Invoice' => array(
        // podstawowe informacje o fakturze np
        'id'         => 1452, // wewnętrzny identyfikator faktury
        'fullnumber' => 'FV 1/2020', // numer faktury
        'date'       => '2020-12-14', // data wystawienia
    ),
    'CompanyDetail' => array(
        // dane sprzedawcy
    ),
    'ContractorDetail' => array(
        // dane kontrahenta z momentu wystawienia faktury
    ),
    'Contractor' => array(
        // rekord kontrahenta z jego aktualnymi danymi
    ),
);
?>
```

# `$invoiceContents` \- pozycje faktury

View More

Plain Text

```plain
<?php
$invoiceContents = array(
    array(
        'InvoiceContent' => array(
            'id'      => 1023, // wewnętrzny identyfikator
            'good_id' => 1552, // wewnętrzny identyfikator produktu
            'name'    => 'Dysk twardy',
            'classification' => '', // PKWiU
            'unit'    => 'Szt.',
            'count'   => 1,
            'price'   => 100, // cena netto lub brutto w zależności od wartości
                              // $invoice['Invoice']['tax_evaluation_method']
            'vatcode' => 23,
            'discount_percent' => 0, // rabat %
            'netto'   => 100,
            'brutto'  => 123,
        ),
    ),
    array(
        'InvoiceContent' => array(
            // ...
        ),
    ),
    // ...
);
?>
```

# `$parameters` \- parametry wywołania wydruku

View More

Plain Text

```plain
<?php
$parameters = array(
    // zawartość zależna od wyboru przy inicjowaniu wydruku
    'pages'                 => array('original', 'copy'),
    'duplicate'             => 0, // czy wydruk ma mieć napis duplikat z datą duplikatu
    'address'               => 0, // czy na odwrocie ma być wydrukowany adres korespondencyjny kontrahenta
    'leaflet'               => 0, // czy ma być dołączony druczek przelewu
    // zawartość zależna od ustawień
    'show_page_type'        => 0, // czy ma być pokazywany napis oryginał / kopia
    'logo_path'             => "/images/fx/...", // ścieżka do obrazka z logo
    'additional_image_path' => "/images/fx/...", // ścieżka do dodatkowego obrazka na fakturze
    'signature_image_path'  => "/images/fx/...", // ścieżka do obrazka z podpisem
    // pola pomocnicze wyliczane na podstawie zawartości faktury
    'document_name_suffix'  => "", // napis związany z nazwą dokumentu w nagłówku np
                                   // " VAT-MP" dla faktur kasowych przed 1 stycznia 2013.
    'show_classification'   => 0,  // czy ma być pokazana kolumna z PKWiU
    'show_discount'         => 0,  // czy ma być pokazana kolumna z rabatem
    'app_server'            => 'wfirma.pl', // adres serwera wfirmy
);
?>
```

# `$vatCodes` \- stawki podatku VAT

View More

Plain Text

```plain
<?php
$vatCodes = array(
    // wewnętrzna nazwa => etykieta
    '23' => '23%',
    '8'  => '8%',
    '5'  => '5%',
    '22' => '22%',
    '7'  => '7%',
    '3'  => '3%',
    'WDT'=> '0% WDT',
    'EXP'=> '0% Exp.',
    'NP' => 'nie podl.',
    'NPUE' => 'nie podl. UE',
    'VAT_BUYER' => 'VAT rozlicza nabywca',
    'ZW'   => 'zw.',
    '0'  => '0%',
);
?>
```

# `$api` \- obiekt pozwala na wykonywanie zapytań do API

Dokumentacja API znajduje się pod adresem [http://doc.wfirma.pl](http://doc.wfirma.pl/). Poniżej przykładowe zapytanie do API przy użyciu metody `request` obiektu `$api`. Domyślnie request wykonywany jest w kontekście firmy i konta z którego generowany jest wydruk. Uprawnienia pozwalają na wykonywanie jedynie operacji odczytu.

| **Nazwa metody** | **Argumenty** | **Opis** |
| --- | --- | --- |
| `request` | `$action` \- napis, akcja API | Metoda zwraca tablicę lub bezpośrednią odpowiedź API. |
|  | `$input` \- tablica z parametrami zapytania |  |
|  | `$rawResponse` \- domyślna wartość |  |
|  | `false` oznacza, że wynik jest automatycznie zamieniany na tablicę. W przypadku potrzeby pobrania dokumentu (np obrazka) należy ustawić wartość `true`. |  |

View More

Plain Text

```plain
<?php
// pobranie produktu o id 1552
$input = array();
$goods = $api->request('/goods/get/1552', $input);

echo $goods['goods'][0]['good']['name'];

// pobranie produktu o określonej nazwie
$input = array(
    'goods' => array(
        'parameters' => array(
            'conditions' => array(
                array('condition' => array(
                    'field' => 'name',
                    'operator' => 'like',
                    'value' => '%dysk%',
                )),
            ),
        ),
    ),
);
$goods = $api->request('/goods/find', $input);

foreach ($goods['goods'] as $good) {
    echo $good['good']['name'];
    // ...
}
?>
Wstawienie dokumentu (obrazka) o id 5433 do wydruku
<img><?=base64_encode($api->request('/documents/download/5433', array(), true))?></img>
```

# `$xml` \- obiekt z przydatnymi metodami

View More

| **Nazwa metody** | **Argumenty** | **Opis** |
| --- | --- | --- |
| `sanitize` | `$string` \- napis do oczyszczenia | Metoda usuwa znaki, które mogą zablokować parsowanie XML-a. Alternatywą jest stosowanie bloku `<![CDATA[ ... ]]>` |
| `currency` | `$amount` \- wartość liczbowa | Metoda formatuje wartość liczbową do postaci xx xxx,xx |
| `currencyWord` | `$amount` \- wartość liczbowa <br>`$translationLanguageCode` \- kod języka <br>`$currency` \- kod waluty | Metoda zamienia kwotę na słownie |
| `low` | `$string` \- napis | Zmiana wszystkich liter na małe, skrót do `mb_strtolower($string, "UTF-8");` |
| `up` | `$string` \- napis | Zmiana wszystkich liter na duże, skrót do `mb_strtoupper($string, "UTF-8");` |
| `niceFloat` | `$value` \- wartość liczbowa | Metoda usuwa nadmiarowe zera z ułamkowej części kwoty. Przykładowo 1.0000 zamieniane jest na napis 1. |
| `isFloatEqual` | `$value1` \- wartość liczbowa <br>`$value2` \- wartość liczbowa <br>`$precision` \- liczba miejsc po przecinku | Metoda sprawdza z wybraną dokładnością (domyślnie 2), czy dwie liczby rzeczywiste są równe. |

# XML definiujący wydruk

System wydruków oparty jest o podobny do HTML format XML. Możliwe jest również stosowanie kaskadowych arkuszy styli. Nie są one jednak w pełni zgodne ze standardami HTML i CSS. Zaimplementowany jest zbiór podstawowych znaczników i stylów poszerzony o unikalne znaczniki dostępne tylko w naszym systemie. Zaletą tego rozwiązania jest lepsze dostosowanie do potrzeb generowania wydruków (w porównaniu do systemów opartych o silniki przeglądarek).

Domyślną jednostką wyrażającą pozycję i odległość jest mm. Wartości atrybutów są wrażliwe na wielkość liter.

Poniżej znajduje się lista elementów wraz z ich atrybutami. Możliwe jest stosowanie własnych elementów takich jak `<body>`, `<div>`, `<p>`, `<my-own-tag>`. Tego typu elementy domyślnie staną się elementami blokowymi dziedziczącymi cechy bezpośrednio od `<element>`.

- `<element>`

  - `<comment>`
  - `<footer>`
  - `<h1>`
  - `<h2>`
  - `<h3>`
  - `<header>`
  - `<img>`

    - `<bar-code>`

      - `<qr-code>`

  - `<li>`
  - `<ol>`
  - `<page>`
  - `<script>`
  - `<style>`
  - `<svg-wrapper>`
  - `<table>`
  - `<td>`
  - `<th>`
  - `<text>`

    - `<a>`
    - `<b>`
    - `<br>`
    - `<i>`
    - `<span>`

  - `<tr>`
  - `<ul>`

`element` » `text` » `b`

View More

| **Nazwa atrybutu** | **Opis** |
| --- | --- |
| `background-clip` | Atrybut określa w którym miejscu boksa ma być renderowane tło. Dozwolone wartości: `border-box`, `padding-box`, `content-box`. Domyślna wartość: `border-box`. |
| `background-color` | Kolor tła. Kolor należy podać jako napis (np red) lub w notacji heksadecymalnej (np #112233). |
| `background-dpi` | Liczba pikseli przypadających na jeden cal (25,4 mm). Większa wartość będzie skutkowała lepszą jakością obrazka przy jego mniejszym rozmiarze na wydruku. Domyślna wartość: 300. |
| `background-gradient-color1` | Początkowy kolor gradientu. Kolor należy podać jako napis (np red) lub w notacji heksadecymalnej (np #112233). |
| `background-gradient-color2` | Końcowy kolor gradientu. Kolor należy podać jako napis (np red) lub w notacji heksadecymalnej (np #112233). |
| `background-gradient-coordinates` | Wektor gradientu określony przez cztery wartości oddzielone spacją - `[x1]``[y1]``[x2]``[y2]`. Domyślna wartość dla gradientu liniowego: 0 1 0 0 |
| `background-gradient-type` | Dozwolone wartości: linear. |
| `background-image` | Względny adres obrazka tła. Obrazek musi znajdować się na serwerze wfirma.pl. |
| `background-opacity` | Przezroczystość tła. Wartość liczbowa z zakresu 0.0 - 1.0. |
| `background-position` | Pozycja tła obrazka określona jako dwa parametry oddzielone spacją. Pierwszy parametr odnosi się do pozycji horyzontalnej (poziomej), drugi wertykalnej (pionowej). Dopuszczalne wartości pierwszego parametru: `left`, `center`, `right`, `x%` i `x`. Domyślna wartość: 0 Dopuszczalne wartości drugiego parametru: `top`, `center`, `bottom`, `y%` i `y`. Domyślna wartość: 0 |
| `background-repeat` | Dozwolone wartości: `repeat`, `repeat-y`, `repeat-x`, `no-repeat`. |
| `background-size` | Rozmiar obrazka tła określony jako dwa parametry oddzielone spacją. Pierwszy oznacza szerokość, drugi wysokość. Dopuszczalne wartości w mm lub % względem rozmiaru elementu. Domyślna wartość auto, skutkuje wstawieniem obrazka w oryginalnym rozmiarze. |
| `border` | Wartość określająca obramowanie lub cztery wartości określające obramowanie oddzielone spacjami - `[górne]``[prawe]``[dolne]``[lewe]`. |
| `border-bottom` | Margines dolny. |
| `border-bottom-color` | Kolor dolnego obramowania. Kolor należy podać jako napis (np red) lub w notacji heksadecymalnej (np #112233). |
| `border-color` | Wartość określająca kolor obramowania lub cztery wartości oddzielone spacjami, określające osobno kolor obramowania - `[górne]``[prawe]``[dolne]``[lewe]`. Kolor należy podać jako napis (np red) lub w notacji heksadecymalnej (np #112233). |
| `border-left` | Margines lewy. |
| `border-left-color` | Kolor lewego obramowania. Kolor należy podać jako napis (np red) lub w notacji heksadecymalnej (np #112233). |
| `border-right` | Margines prawy. |
| `border-right-color` | Kolor prawego obramowania. Kolor należy podać jako napis (np red) lub w notacji heksadecymalnej (np #112233). |
| `border-top` | Margines górny. |
| `border-top-color` | Kolor górnego obramowania. Kolor należy podać jako napis (np red) lub w notacji heksadecymalnej (np #112233). |
| `breakable` | Dozwolone wartości: `true`, `false`, `inherit`. |
| `class` | Klasa elementu. Może się przydać przy definiowaniu styli w elemencie `<style>` oraz w skryptach JavaScript. |
| `clear` | Dozwolone wartości: `both`, `left`, `right`. |
| `display` | Dozwolone wartości: `block`, `inline`, `none`. |
| `expression` | W przypadku wartości true zawartość znacznika musi być kodem JavaScript zwracającą wyliczoną wartość tekstową. Dozwolone wartości: `true`, `false`. Domyślna wartość: `false`. |
| `float` | Dozwolone wartości: `left`, `right`, `none`. |
| `font-color` | Kolor fonta. Kolor należy podać jako napis (np red) lub w notacji heksadecymalnej (np #112233). |
| `font-family` | Dozwolone wartości: `Amatic, DejaVuSans`, `DejaVuSansCondensed`, `DejaVuSansMono`, `LiberationMono`, `LiberationSans`, `LiberationSansNarrow`, `LiberationSerif`, `OMGWriteLikeWilliam`. Domyślna wartość: `LiberationSans`. |
| `font-size` | Domyślna wartość: 8. |
| `font-style` | Dozwolone wartości: `normal`, `bold`, `italic`, `bolditalic`. |
| `height` | Wysokość elementu. Domyślnie jest ona automatycznie wyliczana na podstawie wysokości dzieci. |
| `id` | Identyfikator elementu. Może się przydać przy definiowaniu styli w elemencie `<style>` oraz w skryptach JavaScript. |
| `letter-spacing` | Odległość między literami w mm. Atrybut przydaje się w przypadku potrzeby dopasowania tekstu do kratek gotowego formularza w tle. |
| `margin` | Wartość określająca margines lub cztery wartości określające margines oddzielone spacjami - `[górny]``[prawy]``[dolny]``[lewy]`. |
| `margin-bottom` | Margines dolny. |
| `margin-left` | Margines lewy. |
| `margin-right` | Margines prawy. |
| `margin-top` | Margines górny. |
| `min-height` | Minimalna wysokość elementu. |
| `opacity` | Przezroczystość elementów. Wartość liczbowa z zakresu 0.0 - 1.0. |
| `padding` | Wartość określająca dopełnienie lub cztery wartości dopełnienia oddzielone spacjami - `[górne]``[prawe]``[dolne]``[lewe]`. |
| `padding-bottom` | Dopełnienie dolne. |
| `padding-left` | Dopełnienie lewe. |
| `padding-right` | Dopełnienie prawe. |
| `padding-top` | Dopełnienie górne. |
| `position` | Dozwolone wartości: `static`, `absolute`. Domyślna wartość: `static`. |
| `shrinkable` | W przypadku wartości true, system będzie próbował zmieścić tekst danego bloku w jednym wierszu (zmniejszając rozmiar fonta aż do skutku lub osiągnięcia minimalnego rozmiaru). Dozwolone wartości: `true`, `false`. Domyślna wartość: `false`. |
| `text-align` | Dozwolone wartości: `left`, `right`, `center`, `justify`. |
| `text-decoration` | Dozwolone wartości: `none`, `underline`, `overline`, `line-through`. Domyślna wartość: `none`. |
| `text-transform` | Dozwolone wartości: `none`, `capitalize`, `uppercase`, `lowercase`. |
| `vertical-align` | Dozwolone wartości: `top`, `middle`, `baseline`, `bottom`. |
| `width` | Szerokość w mm lub % (wyliczana na podstawie szerokości ojca). |
| `word-spacing` | Odległość między wyrazami w wierszu. |
| `x` | Pozycja x elementu przy pozycjonowaniu absolutnym. |
| `y` | Pozycja y elementu przy pozycjonowaniu absolutnym. (0 - góra, 297 - dół strony przy formacie A4) |
| `z-index` | Atrybut określa kolejność sąsiadujących elementów przy dodawaniu ich do PDF-a. Przydatne przy nakładaniu kilku elementów w stos. |

# Przykłady

## Standardowy szablon faktury

View More

Plain Text

```plain
<style>
    page {
        padding: 20 15 20 15;
        font-size: 8;
        font-family: LiberationSans;
    }

    td, th {
        padding: 0.5 1 0 1;
    }

    translation {
        <? if ($invoice['Invoice']['translation_language_id']): ?>
            font-size: 6;
            font-style: italic;
            display: inline;
        <? else: // w przypadku faktury w języku polskim tłumaczenia są ukryte ?>
            display: none;
        <? endif ?>
    }
</style>

<? foreach ((array)$parameters['pages'] as $page): ?>
    <page>
        <header height="85">
            <? if (isset($invoice['footerCreator'])): ?>
                <div position="absolute" x="12" y="267" font-size="6" text-align="center">
                    <?= $invoice['footerCreator']; ?>
                </div>
            <? endif; ?>

            <style>
                .invoice-header {
                    position: absolute;
                    y: -10;
                    text-align: center;
                }

                /* logo */
                .invoice-logo {
                    width: 45%;
                    height: 40;
                    float: left;
                }

                /* main info - start */
                .invoice-main-info {
                    width: 48%;
                    float: right;
                }

                .invoice-main-info tr th {
                    padding: 1.5 0 1.5 0;
                }
                .invoice-main-info tr td {
                    padding: 1 0 1 1;
                }

                .invoice-main-info tr:child(0) {
                    font-size: 9;
                    text-align: center;
                    background-gradient-type: linear;
                    background-gradient-color1: white;
                    background-gradient-color2: lightgrey;
                }

                .invoice-main-info tr td div:child(0) {
                    width: 49%;
                    float: left;
                }

                .invoice-main-info tr td div:child(1) {
                    width: 49%;
                    float: right;
                }

                .invoice-main-info tr td div div:child(0) {
                    width: 57%;
                    float: left;
                }

                .invoice-main-info tr td div div:child(1) {
                    width: 42%;
                    float: right;
                }
                /* main info - stop */

                /* transaction sides - start */
                <? if ($invoice['ContractorDetailReceiver']['id']): ?>
                    .invoice-transaction-side:child(0) {
                        width: 38%;
                        float: left;
                    }

                    .invoice-transaction-side:child(1) {
                        width: 31%;
                        float: left;
                    }

                    .invoice-transaction-side:child(2) {
                        width: 30%;
                        float: right;
                    }
                <? else: ?>
                    .invoice-transaction-side:child(0) {
                        width: 48%;
                        float: left;
                    }

                    .invoice-transaction-side:child(1) {
                        width: 48%;
                        float: right;
                    }
                <? endif ?>
                /* transaction sides - stop */

                .invoice-bar {
                    position: absolute;
                    y: 71;
                    font-size: 10;
                    text-align: right;
                    padding: 0 1 -0.5 0;
                    margin-top: 4;
                    border-bottom: 1px;
                    background-gradient-type: linear;
                    background-gradient-color1: white;
                    background-gradient-color2: lightgrey;
                    background-gradient-coordinates: 0 0 1 0;
                }
            </style>

            <? if ($invoice['Invoice']['header']): ?>
                <p class="invoice-header"><?= $xml->sanitize($invoice['Invoice']['header']); ?></p>
            <? endif ?>

            <div class="invoice-logo">
                <? if ($parameters['logo_path']): ?>
                    <img width="80" src="<?= $parameters['logo_path'] ?>"/>
                <? endif ?>
            </div>

            <div class="invoice-main-info">
                <table>
                    <tr>
                        <th>Faktura<?= $xml->sanitize($parameters['document_name_suffix']) ?> nr <?= $xml->sanitize($invoice['Invoice']['fullnumber']) ?></th>
                    </tr>
                    <tr>
                        <td>
                            <div>
                                <div>Data wystawienia:<br/><translation><?= $translation->get('Invoice:Data wystawienia') ?></translation></div>
                                <div><?= $xml->sanitize($invoice['Invoice']['date']) ?></div>
                                <div clear="both"/>
                            </div>

                            <div>
                                <? if (!$invoice['Invoice']['disposaldate_empty']): ?>
                                    <div>Data sprzedaży:<br/><translation><?= $translation->get('Invoice:Data sprzedaży') ?></translation></div>
                                    <div><?= $invoice['Invoice']['disposaldate'] ?></div>
                                <? endif ?>
                                <div clear="both"/>
                            </div>

                            <div clear="both"/>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <div>
                                <div>Termin płatności:<br/><translation><?= $translation->get('Invoice:Termin płatności') ?></translation></div>
                                <div><?= $xml->sanitize($invoice['Invoice']['paymentdate']) ?></div>
                                <div clear="both"/>
                            </div>

                            <div>
                                <div>Metoda płatności:<br/><translation><?= $translation->get('Invoice:Metoda płatności') ?></translation></div>
                                <div>
                                    <?= $xml->sanitize($invoice['Invoice']['paymentmethod']) ?><br/>
                                    <translation><?= $xml->sanitize($translation->get('Invoice:' . $invoice['Invoice']['paymentmethod'])) ?></translation>
                                </div>
                                <div clear="both"/>
                            </div>

                            <div clear="both"/>
                        </td>
                    </tr>
                </table>
            </div>

            <div clear="both"/>

            <? if ($parameters['duplicate']): ?>
                <div position="absolute" x="50" y="25">
                    <img width="40" src="/images/duplicate/<?= date("Y-m-d") ?>.png"/>
                </div>
            <? endif ?>

            <div class="invoice-transaction-side">
                <h3>Sprzedawca: <translation>(<?= $translation->get('Invoice:Sprzedawca') ?>)</translation></h3>
                <p><?= nl2br($xml->sanitize($invoice['Invoice']['seller_info'])) ?></p>
            </div>

            <div class="invoice-transaction-side">
                <h3>Nabywca: <translation>(<?= $translation->get('Invoice:Nabywca') ?>)</translation></h3>
                <p><?= nl2br($xml->sanitize($invoice['Invoice']['buyer_info'])) ?></p>
            </div>

            <? if ($invoice['ContractorDetailReceiver']['id']): ?>
                <div class="invoice-transaction-side">
                    <h3>Odbiorca: <translation>(<?= $translation->get('Invoice:Odbiorca') ?>)</translation></h3>
                    <p><?= nl2br($xml->sanitize($invoice['Invoice']['receiver_info'])) ?></p>
                </div>
            <? endif ?>

            <div clear="both"/>

            <div class="invoice-bar">
                <? if ($parameters['show_page_type']): ?>
                    <?= $page === 'original' ? 'O R Y G I N A Ł' : 'K O P I A' ?>
                <? else: ?>
                    <br/>
                <? endif ?>
            </div>
        </header>

        <body>
            <table>
                <header>
                    <tr>
                        <td width="3%">Lp<br/><translation><?= $translation->get('Invoice:Lp') ?></translation></td>
                        <td>Nazwa<br/><translation><?= $translation->get('Invoice:Nazwa') ?></translation></td>

                        <? if ($parameters['show_classification']): ?>
                            <td width="7%">PKWiU<br/><translation><?= $translation->get('Invoice:PKWiU') ?></translation></td>
                        <? endif ?>

                        <td width="6%">Jedn.<br/><translation><?= $translation->get('Invoice:Jedn.') ?></translation></td>
                        <td width="6%">Ilość<br/><translation><?= $translation->get('Invoice:Ilość') ?></translation></td>
                        <td width="11%">
                            <?= $invoice['Invoice']['tax_evaluation_method'] === 'netto' ? 'Cena netto' : 'Cena brutto' ?><br/>
                            <translation><?= $translation->get('Invoice:Cena') ?></translation>
                        </td>

                        <? if ($parameters['show_discount']): ?>
                            <td column-span="2">Rabat<br/><translation><?= $translation->get('Invoice:Rabat'); ?></translation></td>
                        <? endif ?>

                        <td width="8%">Stawka<br/><translation><?= $translation->get('Invoice:Stawka') ?></translation></td>
                        <td width="12%">Wartość netto<br/><translation><?= $translation->get('Invoice:Wartość netto') ?></translation></td>
                        <td width="12%">Wartość brutto<br/><translation><?= $translation->get('Invoice:Wartość brutto') ?></translation></td>
                    </tr>
                </header>

                <? foreach ((array)$invoiceContents as $key => $invoiceContent): ?>
                    <tr class="invoice-content">
                        <td><?= $key + 1 ?></td>
                        <td><?= $xml->sanitize($invoiceContent['InvoiceContent']['name']) ?></td>

                        <? if ($parameters['show_classification']): ?>
                            <td><?= $xml->sanitize($invoiceContent['InvoiceContent']['classification']) ?></td>
                        <? endif ?>

                        <td><?= $xml->sanitize($invoiceContent['InvoiceContent']['unit']) ?></td>
                        <td class="invoice-content-count"><?= $xml->niceFloat($invoiceContent['InvoiceContent']['count']) ?></td>
                        <td class="invoice-content-price"><?= $xml->currency($invoiceContent['InvoiceContent']['price']) ?></td>

                        <? if ($parameters['show_discount']): ?>
                            <td width="5%"><?= $xml->niceFloat($invoiceContent['InvoiceContent']['discount_percent']) ?>%</td>
                            <td width="9%"><?= $xml->currency($invoiceContent['InvoiceContent']['discount_amount']) ?></td>
                        <? endif ?>

                        <td><?= $invoiceContent['InvoiceContent']['vatcode'] ?></td>
                        <td class="invoice-content-netto"><?= $xml->currency($invoiceContent['InvoiceContent']['netto']) ?></td>
                        <td class="invoice-content-brutto"><?= $xml->currency($invoiceContent['InvoiceContent']['brutto']) ?></td>
                    </tr>
                <? endforeach ?>
            </table>
        </body>

        <footer height="80" margin-top="5">
            <style>
                /* vat sums - start */
                .invoice-sums {
                    float: left;
                    width: 50%;
                }
                .invoice-sums th {
                    font-style: normal;
                }
                /* vat sums - stop */

                /* payment info - start */
                .invoice-payment-info {
                    border:0;
                    float: right;
                    width: <?= $invoice['Invoice']['translation_language_id'] ? '40%' : '30%' ?>;
                }
                .invoice-payment-info tr td:child(1) {
                    text-align: right;
                }
                /* payment info - stop */

                /* annotations - start */
                .invoice-annotations {
                    float: left;
                    width: 48%;
                }
                .invoice-annotations p {
                    margin-top:3;
                }
                /* annotations - stop */

                .invoice-qr-code {
                    width: 25;
                    float: right;
                    text-align: center;
                    font-size: 6;
                }

                .invoice-additional-image {
                    float: right;
                    width: 70;
                }

                /* signatures - start */
                .invoice-signature {
                    text-align: center;
                    width: 45;
                }
                .invoice-signature:child(0) {
                    float: left;
                }
                .invoice-signature:child(1) {
                    float: right;
                }
                .invoice-signature span:child(0) {
                    font-style: bold;
                }
                .invoice-signature span:child(1) {
                    font-size: 7;
                }
                /* signatues - stop */

                .invoice-footer {
                    margin-top: 5;
                    text-align: center;
                }
            </style>

            <table class="invoice-sums">
                <tr>
                    <th width="25%">Stawka VAT<br/><translation><?= $translation->get('Invoice:Stawka VAT') ?></translation></th>
                    <th width="25%">Wartość Netto<br/><translation><?= $translation->get('Invoice:Wartość netto') ?></translation></th>
                    <th width="25%">Kwota VAT<br/><translation><?= $translation->get('Invoice:Kwota VAT') ?></translation></th>
                    <th width="25%">Wartość Brutto<br/><translation><?= $translation->get('Invoice:Wartość brutto') ?></translation></th>
                </tr>

                <? foreach ((array)$invoice['VatContent'] as $vatContent): ?>
                    <tr>
                        <td><?= $vatContent['VatCode']['label'] ?></td>
                        <td><?= $xml->currency($vatContent['netto']) ?></td>
                        <td><?= $xml->currency($vatContent['tax']) ?></td>
                        <td><?= $xml->currency($vatContent['brutto']) ?></td>
                    </tr>
                <? endforeach ?>

                <tr>
                    <td>Razem <translation>(<?= $translation->get('Invoice:Razem') ?>)</translation></td>
                    <td><?= $xml->currency($invoice['Invoice']['vat_content_netto']) ?></td>
                    <td><?= $xml->currency($invoice['Invoice']['vat_content_tax']) ?></td>
                    <td><?= $xml->currency($invoice['Invoice']['vat_content_brutto']) ?></td>
                </tr>
            </table>

            <table class="invoice-payment-info">
                <tr>
                    <td>Razem: <translation>(<?= $translation->get('Invoice:Razem') ?>)</translation></td>
                    <td><?= $xml->currency($invoice['Invoice']['total']) ?> <?= $invoice['Invoice']['currency'] ?></td>
                </tr>
                <tr>
                    <td width="60%">Zapłacono: <translation>(<?= $translation->get('Invoice:Zapłacono') ?>)</translation></td>
                    <td width="40%"><?= $xml->currency($invoice['Invoice']['alreadypaid_initial']) ?> <?= $invoice['Invoice']['currency'] ?></td>
                </tr>
                <tr>
                    <td>Pozostało: <translation>(<?= $translation->get('Invoice:Do zapłaty') ?>)</translation></td>
                    <td>
                        <?= $xml->currency($invoice['Invoice']['total'] - $invoice['Invoice']['alreadypaid_initial']) ?> <?= $invoice['Invoice']['currency'] ?>
                    </td>
                </tr>
            </table>

            <div clear="both"/>

            <div class="invoice-annotations">
                <? if ($invoice['Invoice']['legal_annotations']): ?>
                    <p><?= $xml->sanitize($invoice['Invoice']['legal_annotations']) ?></p>
                <? endif ?>

                <? if ($invoice['Invoice']['associated_document_annotations']): ?>
                    <?= $xml->sanitize($invoice['Invoice']['associated_document_annotations']) ?>
                <? endif ?>

                <? if ($invoice['Invoice']['description']): ?>
                    <p>
                        Uwagi: <translation>(<?= $translation->get('Invoice:Uwagi') ?>)</translation><br/>
                        <?= nl2br($invoice['Invoice']['description']) ?>
                    </p>
                <? endif ?>

                <? if ($invoice['Invoice']['currency'] !== 'PLN' && !$parameters['show_invoice_foreign_currency_vat_content']): ?>
                    <p>
                        1 <?= $invoice['Invoice']['currency'] ?> = <?= number_format($invoice['Invoice']['currency_exchange'], 4, ',', ' ') ?> PLN<br/>
                        Kurs z dnia: <?= $invoice['Invoice']['currency_date'] ?><br/>
                        Numer tabeli: <?= $invoice['Invoice']['currency_label'] ?>
                    </p>
                <? endif ?>
            </div>

            <? if ($parameters['invoice_send_external_type'] !== 'none'): ?>
                <div class="invoice-qr-code">
                    <a href="https://<?= $parameters['app_server'] ?>/faktura/<?= $invoice['Invoice']['company_id'] ?>/<?= $invoice['Invoice']['id'] ?>/<?= $invoice['Invoice']['hash'] ?>">
                        <qr-code>https://<?= $parameters['app_server'] ?>/faktura/<?= $invoice['Invoice']['company_id'] ?>/<?= $invoice['Invoice']['id'] ?>/<?= $invoice['Invoice']['hash'] ?></qr-code>
                        <br/>panel klienta
                    </a>
                </div>
            <? endif ?>
            <div clear="right"/>

            <? if ($parameters['additional_image_path']): ?>
                <div class="invoice-additional-image">
                    <img width="70" src="<?= $parameters['additional_image_path'] ?>"/>
                </div>
            <? endif ?>

            <div clear="both" margin-bottom="5"/>

            <? if ($parameters['signature_image_path']): ?>
                <img width="70" src="<?= $parameters['signature_image_path'] ?>"/>
            <? endif ?>

            <div margin-top="2">
                <div class="invoice-signature">
                    <span><?= $xml->sanitize($invoice['Invoice']['user_name']) ?></span><br/>
                    <span>Imię i nazwisko osoby uprawnionej do wystawiania faktury</span>
                </div>

                <div class="invoice-signature">
                    <span><br/></span><br/>
                    <span>Imię i nazwisko osoby uprawnionej do odbioru faktury</span>
                </div>

                <div clear="both"/>
            </div>

            <? if ($invoice['Invoice']['footer']): ?>
                <p class="invoice-footer"><?= $xml->sanitize($invoice['Invoice']['footer']); ?></p>
            <? endif ?>
        </footer>
    </page>

    <? if ($page === 'original' && $parameters['address']): // opcja adresu korespondecyjnego na odwrocie oryginału ?>
        <page padding-left="119" padding-top="255">
            <?= nl2br($xml->sanitize($invoice['Invoice']['buyeraddress'])); ?>
        </page>
    <? endif ?>
<? endforeach ?>

<? if ($parameters['leaflet']): // druczek przelewu ?>
    <page padding="20 0 0 20">
        <? for ($i = 0; $i < 2; $i++): ?>
            <div width="164" height="106" background-image="/images/reports/invoices/leaflet_<?= $i ?>.png">
                <style>
                    entry {
                        margin-left: 22.5;
                        margin-top: 4.6;
                    }
                </style>

                <entry><?= $xml->sanitize($invoice['CompanyDetail']['name']) ?></entry>
                <entry>
                    <?= $xml->sanitize($invoice['CompanyDetail']['street']) ?>
                    <?= $xml->sanitize(
                            $invoice['CompanyDetail']['building_number']
                            . ($invoice['CompanyDetail']['flat_number'] ? "/" . $xml->sanitize($invoice['CompanyDetail']['flat_number']) : "")
                        )
                    ?>,
                    <?= $xml->sanitize($invoice['CompanyDetail']['zip']) ?> <?= $xml->sanitize($invoice['CompanyDetail']['city']) ?>
                </entry>
                <entry letter-spacing="5"><?= str_replace(" ", "", $xml->sanitize($invoice['CompanyDetail']['bank_account'])) ?></entry>
                <entry margin-left="98"><?= str_replace(".", ",", $invoice['Invoice']['remaining']) ?></entry>
                <entry><br/></entry>
                <entry><?= $xml->sanitize($invoice['ContractorDetail']['name']) ?></entry>
                <entry>
                    <?= $xml->sanitize($invoice['ContractorDetail']['street']) ?>,
                    <?= $xml->sanitize($invoice['ContractorDetail']['zip']) ?> <?= $xml->sanitize($invoice['ContractorDetail']['city']) ?>
                </entry>
                <entry><?= $xml->sanitize($invoice['Invoice']['fullnumber']) ?></entry>
            </div>
        <? endfor ?>
    </page>
<? endif ?>
```

AUTHORIZATIONOAuth 2.0

This folder is using OAuth 2.0 from collection [wFirma.pl](https://doc.wfirma.pl/#auth-info-3854b824-3162-4c02-a47b-af2012073033)

## contractors

Moduł odpowiedzialny za zarządzanie danymi kontrahentów.

##### Akcje

- **add** \- dodawanie kontrahenta
- **delete** \- usunięcie kontrahenta o podanym **id**
- **edit** \- modyfikacja kontrahenta o podanym **id**
- **find** \- pobranie listy kontrahentów
- **get** \- pobranie szczegółów kontrahenta o podanym **id**

##### Powiązane moduły

- **translation\_languages** (skrócony, pojedynczy)
- **company\_accounts** (skrócony, pojedynczy)
- **invoice\_descriptions** (skrócony, pojedynczy)

##### Pola

| **Nazwa pola** | **Przeznaczenie** | **Opis** |
| --- | --- | --- |
| _**id**_ | Tylko do odczytu | Klucz główny |
| _**name**_ | Odczyt i zapis | Nazwa pełna |
| _**altname**_ | Odczyt i zapis | Nazwa skrócona |
| _**tax\_id\_type**_ | Odczyt i zapis | Rodzaj identyfikatora podatkowego. Dopuszczalne wartości `nip`, `vat`, `pesel`, `regon`, `custom`, `none`. |
| _**nip**_ | Odczyt i zapis | Identyfikator podatkowy |
| _**regon**_ | Odczyt i zapis | Identyfikator REGON. Pole nie jest używane w systemie. |

##### Adres główny kontrahenta

| **Nazwa pola** | **Przeznaczenie** | **Opis** |
| --- | --- | --- |
| _**street**_ | Odczyt i zapis | Ulica |
| _**zip**_ | Odczyt i zapis | Kod pocztowy |
| _**city**_ | Odczyt i zapis | Miasto |
| _**country**_ | Odczyt i zapis | Dwuliterowy kod kraju według listy z modułu `declaration_countries`. |

##### Adres kontaktowy kontrahenta

View More

| **Nazwa pola** | **Przeznaczenie** | **Opis** |
| --- | --- | --- |
| _**different\_contact\_address**_ | Odczyt i zapis | Czy adres kontaktowy różni się od adresu głównego. `1` \- TAK, `0` \- NIE |
| _**contact\_name**_ | Odczyt i zapis | Nazwa |
| _**contact\_street**_ | Odczyt i zapis | Ulica |
| _**contact\_zip**_ | Odczyt i zapis | Kod pocztowy |
| _**contact\_city**_ | Odczyt i zapis | Miasto |
| _**contact\_country**_ | Odczyt i zapis | Dwuliterowy kod kraju według listy z modułu `declaration_countries`. |
| _**contact\_person**_ | Odczyt i zapis | Osoba kontaktowa |
| _**phone**_ | Odczyt i zapis | Telefon |
| _**skype**_ | Odczyt i zapis | Skype |
| _**fax**_ | Odczyt i zapis | Fax |
| _**email**_ | Odczyt i zapis | Adres email |
| _**url**_ | Odczyt i zapis | Adres strony kontrahenta |
| _**description**_ | Odczyt i zapis | Opis kontrahenta |
| _**buyer**_ | Odczyt i zapis | Wartość `1` dla oznaczenia, że kontrahent jest nabywcą |
| _**seller**_ | Odczyt i zapis | Wartość `1` dla oznaczenia, że kontrahent jest dostawcą |
| _**account\_number**_ | Odczyt i zapis | Numer rachunku bankowego kontrahenta |
| _**discount\_percent**_ | Odczyt i zapis | Domyślna wartość rabatu w procentach, która będzie stosowana da kontrahenta. Dla rabatu 50% należy wprowadzić wartość 50. |
| _**payment\_days**_ | Odczyt i zapis | Domyślny termin płatności |
| _**payment\_method**_ | Odczyt i zapis | Domyślna metoda płatności |
| _**remind**_ | Odczyt i zapis | W przypadku wartości 1 i włączonych automatycznych powiadomieniach o niezaplaconych fakturach, kontrahent otrzyma monit w przypadku braku zapłaty za fakturę. |
| _**hash**_ | Odczyt i zapis | Wartość hasha zapezpieczającego panel klienta (dostępnego przez odsyłacz _**[http://wfirma.pl/invoice\_externals/find/HASH](http://wfirma.pl/invoice_externals/find/HASH)**_). |
| _**notes**_ | Tylko do odczytu | Liczba notatek powiązanych z kontrahentem |
| _**documents**_ | Tylko do odczytu | Liczba dokumentów powiązanych z kontrahentem |
| _**tags**_ | Odczyt i zapis | Znaczniki powiązane z kontrahentem w formacie `(ID ZNACZNIKA X)`,`(ID ZNACZNIKA Y)`... |
| _**created**_ | Tylko do odczytu | Data i godzina utworzenia wpisu |
| _**modified**_ | Tylko do odczytu | Data i godzina zmodyfikowania wpisu |

AUTHORIZATIONOAuth 2.0

This folder is using OAuth 2.0 from collection [wFirma.pl](https://doc.wfirma.pl/#auth-info-3854b824-3162-4c02-a47b-af2012073033)

### POSTcontractors/add

{{host}}/contractors/add?inputFormat=xml&outputFormat=xml&company\_id={{companyId}}

AUTHORIZATIONOAuth 2.0

This request is using OAuth 2.0 from collection [wFirma.pl](https://doc.wfirma.pl/#auth-info-3854b824-3162-4c02-a47b-af2012073033)

PARAMS

inputFormat

xml

Przyjmuje wartość json i xml

outputFormat

xml

Przyjmuje wartość json i xml

company\_id

{{companyId}}

Bodyraw (xml)

View More

xml

```xml
<?xml version="1.0" encoding="UTF-8"?>
<api>
    <contractors>
        <contractor>
            <name>Nazwa kontrahenta</name>
            <zip>12-345</zip>
            <country>PL</country>
            <tax_id_type>custom</tax_id_type>
            <nip>1111111111</nip>
        </contractor>
    </contractors>
</api>
```

Example Request

contractors/add

View More

curl

```curl
curl --location -g '{{host}}/contractors/add?inputFormat=xml&outputFormat=xml&company_id={{companyId}}' \
--data '<?xml version="1.0" encoding="UTF-8"?>
<api>
    <contractors>
        <contractor>
            <name>Nazwa kontrahenta</name>
            <zip>12-345</zip>
            <country>PL</country>
            <tax_id_type>custom</tax_id_type>
            <nip>1111111111</nip>
        </contractor>
    </contractors>
</api>'
```

Example Response

- Body
- Headers (0)

No response body

This request doesn't return any response body

No response headers

This request doesn't return any response headers

### GETcontractors/find

{{host}}/contractors/find?outputFormat=xml&company\_id={{companyId}}

AUTHORIZATIONOAuth 2.0

This request is using OAuth 2.0 from collection [wFirma.pl](https://doc.wfirma.pl/#auth-info-3854b824-3162-4c02-a47b-af2012073033)

PARAMS

outputFormat

xml

Przyjmuje wartość json i xml

company\_id

{{companyId}}

Bodyraw (xml)

View More

xml

```xml
<?xml version="1.0" encoding="UTF-8"?>
<api>
    <contractors>
        <parameters>
            <order>
                <desc>Contractor.id</desc>
            </order>
            <fields>
                <field>Contractor.id</field>
                <field>Contractor.name</field>
                <field>Contractor.zip</field>
                <field>Contractor.country</field>
                <field>Contractor.tax_id_type</field>
                <field>Contractor.nip</field>
                <field>Contractor.contact_name</field>
                <field>Contractor.contact_zip</field>
                <field>Contractor.contact_country</field>
                <field>Contractor.buyer</field>
                <field>Contractor.seller</field>
                <field>Contractor.remind</field>
                <field>Contractor.source</field>
                <field>Contractor.reference_company_id</field>
                <field>Contractor.translation_language_id</field>
                <field>Contractor.company_account_id</field>
                <field>Contractor.good_price_group_id</field>
                <field>Contractor.invoice_description_id</field>
                <field>Contractor.shop_buyer_id</field>
            </fields>
            <page>1</page>
        </parameters>
    </contractors>
</api>
```

Example Request

contractors/find

View More

curl

```curl
curl --location -g --request GET '{{host}}/contractors/find?outputFormat=xml&company_id={{companyId}}' \
--data '<?xml version="1.0" encoding="UTF-8"?>
<api>
    <contractors>
        <parameters>
            <order>
                <desc>Contractor.id</desc>
            </order>
            <fields>
                <field>Contractor.id</field>
                <field>Contractor.name</field>
                <field>Contractor.zip</field>
                <field>Contractor.country</field>
                <field>Contractor.tax_id_type</field>
                <field>Contractor.nip</field>
                <field>Contractor.contact_name</field>
                <field>Contractor.contact_zip</field>
                <field>Contractor.contact_country</field>
                <field>Contractor.buyer</field>
                <field>Contractor.seller</field>
                <field>Contractor.remind</field>
                <field>Contractor.source</field>
                <field>Contractor.reference_company_id</field>
                <field>Contractor.translation_language_id</field>
                <field>Contractor.company_account_id</field>
                <field>Contractor.good_price_group_id</field>
                <field>Contractor.invoice_description_id</field>
                <field>Contractor.shop_buyer_id</field>
            </fields>
            <page>1</page>
        </parameters>
    </contractors>
</api>'
```

Example Response

- Body
- Headers (0)

No response body

This request doesn't return any response body

No response headers

This request doesn't return any response headers

### GETcontractors/get

{{host}}/contractors/get/{{contractorId}}?inputFormat=xml&outputFormat=xml&company\_id={{companyId}}

AUTHORIZATIONOAuth 2.0

This request is using OAuth 2.0 from collection [wFirma.pl](https://doc.wfirma.pl/#auth-info-3854b824-3162-4c02-a47b-af2012073033)

PARAMS

inputFormat

xml

Przyjmuje wartość json i xml

outputFormat

xml

Przyjmuje wartość json i xml

company\_id

{{companyId}}

Example Request

contractors/get

View More

curl

```curl
curl --location -g '{{host}}/contractors/get/{{contractorId}}?inputFormat=xml&outputFormat=xml&company_id={{companyId}}'
```

Example Response

- Body
- Headers (0)

No response body

This request doesn't return any response body

No response headers

This request doesn't return any response headers

### POSTcontractors/edit

{{host}}/contractors/edit/{{contractorId}}?inputFormat=xml&outputFormat=xml&company\_id={{companyId}}

AUTHORIZATIONOAuth 2.0

This request is using OAuth 2.0 from collection [wFirma.pl](https://doc.wfirma.pl/#auth-info-3854b824-3162-4c02-a47b-af2012073033)

PARAMS

inputFormat

xml

Przyjmuje wartość json i xml

outputFormat

xml

Przyjmuje wartość json i xml

company\_id

{{companyId}}

Bodyraw (xml)

xml

```xml
<?xml version="1.0" encoding="UTF-8"?>
<api>
    <contractors>
        <contractor>
        	<name>Nazwa kontrahenta2</name>
        	<zip>12-345</zip>
        </contractor>
    </contractors>
</api>
```

Example Request

contractors/edit

View More

curl

```curl
curl --location -g '{{host}}/contractors/edit/{{contractorId}}?inputFormat=xml&outputFormat=xml&company_id={{companyId}}' \
--data '<?xml version="1.0" encoding="UTF-8"?>
<api>
    <contractors>
        <contractor>
        	<name>Nazwa kontrahenta2</name>
        	<zip>12-345</zip>
        </contractor>
    </contractors>
</api>'
```

Example Response

- Body
- Headers (0)

No response body

This request doesn't return any response body

No response headers

This request doesn't return any response headers

### DELETEcontractors/delete

{{host}}/contractors/delete/{{contractorId}}?inputFormat=xml&outputFormat=xml&company\_id={{companyId}}

AUTHORIZATIONOAuth 2.0

This request is using OAuth 2.0 from collection [wFirma.pl](https://doc.wfirma.pl/#auth-info-3854b824-3162-4c02-a47b-af2012073033)

PARAMS

inputFormat

xml

Przyjmuje wartość json i xml

outputFormat

xml

Przyjmuje wartość json i xml

company\_id

{{companyId}}

Example Request

contractors/delete

View More

curl

```curl
curl --location -g --request DELETE '{{host}}/contractors/delete/{{contractorId}}?inputFormat=xml&outputFormat=xml&company_id={{companyId}}' \
--data ''
```

Example Response

- Body
- Headers (0)

No response body

This request doesn't return any response body

No response headers

This request doesn't return any response headers

## companies

###### Akcje

- **get** \- pobranie informacji o firmie dla której wykonywane jest niniejsze zapytanie

##### Pola

| **Nazwa pola** | **Przeznaczenie** | **Opis** |
| --- | --- | --- |
| _**id**_ | Tylko do odczytu | Klucz główny |
| _**name**_ | Tylko do odczytu | Nazwa pelna |
| _**altname**_ | Tylko do odczytu | Nazwa skrócona |
| _**nip**_ | Tylko do odczytu |  |
| _**vat\_payer**_ | Tylko do odczytu | `1` \- firma jest płatnikiem VAT, `0` \- firma jest nievatowcem |
| _**tax**_ | Tylko do odczytu | `taxregister` \- firma prowadzi KPiR, `lumpregister` \- firma prowadzi Ewidencję Przychodów (ryczałt) |
| _**is\_registered**_ | Tylko do odczytu | `1` w przypadku dokończenia rejestracji firmy w systemie |
| _**is\_authorized**_ | Tylko do odczytu | `1` w przypadku, gdy firma jest autoryzowana w systemie |
| _**edeclarations\_verified**_ | Tylko do odczytu | `1` w przypadku, gdy firma została zweryfikowana dla potrzeb wysyłki edeklaracji przy użyciu podpisu pracowników wfirma.pl |

AUTHORIZATIONOAuth 2.0

This folder is using OAuth 2.0 from collection [wFirma.pl](https://doc.wfirma.pl/#auth-info-3854b824-3162-4c02-a47b-af2012073033)

### GETcompanies/get

{{host}}/companies/get/{{companyId}}?outputFormat=xml&inputFormat=xml&company\_id={{companyId}}

AUTHORIZATIONOAuth 2.0

This request is using OAuth 2.0 from collection [wFirma.pl](https://doc.wfirma.pl/#auth-info-3854b824-3162-4c02-a47b-af2012073033)

PARAMS

outputFormat

xml

Przyjmuje wartość json i xml

inputFormat

xml

Przyjmuje wartość json i xml

company\_id

{{companyId}}

Example Request

companies/get

View More

curl

```curl
curl --location -g '{{host}}/companies/get/{{companyId}}?outputFormat=xml&inputFormat=xml&company_id={{companyId}}'
```

Example Response

- Body
- Headers (0)

No response body

This request doesn't return any response body

No response headers

This request doesn't return any response headers

## company\_accounts

##### Akcje

- **find** \- pobranie informacji o rachunkach bankowych
- **get** \- pobranie informacji o pojedynczym rachunku bankowym

##### Pola

| **Nazwa pola** | **Przeznaczenie** | **Opis** |
| --- | --- | --- |
| _**id**_ | Tylko do odczytu | Klucz główny |
| _**name**_ | Odczyt i zapis | Nazwa rachunku widoczna w panelu wfirmy |
| _**bank\_name**_ | Odczyt i zapis | Nazwa banku |
| _**number**_ | Odczyt i zapis | Numer rachunku bankowego |
| _**swift**_ | Odczyt i zapis | Kod SWIFT |
| _**address**_ | Odczyt i zapis | Adres banku |
| _**created**_ | Tylko do odczytu | Data i godzina utworzenia wpisu |
| _**modified**_ | Tylko do odczytu | Data i godzina zmodyfikowania wpisu |

AUTHORIZATIONOAuth 2.0

This folder is using OAuth 2.0 from collection [wFirma.pl](https://doc.wfirma.pl/#auth-info-3854b824-3162-4c02-a47b-af2012073033)

### GETcompany\_accounts/find

{{host}}/company\_accounts/find?inputFormat=xml&outputFormat=xml&company\_id={{companyId}}

AUTHORIZATIONOAuth 2.0

This request is using OAuth 2.0 from collection [wFirma.pl](https://doc.wfirma.pl/#auth-info-3854b824-3162-4c02-a47b-af2012073033)

PARAMS

inputFormat

xml

Przyjmuje wartość json i xml

outputFormat

xml

Przyjmuje wartość json i xml

company\_id

{{companyId}}

Example Request

company\_accounts/find

curl

```curl
curl --location -g '{{host}}/company_accounts/find?inputFormat=xml&outputFormat=xml&company_id={{companyId}}'
```

Example Response

- Body
- Headers (0)

No response body

This request doesn't return any response body

No response headers

This request doesn't return any response headers

### GETcompany\_accounts/get

{{host}}/company\_accounts/get/{{companyAcoountId}}?inputFormat=xml&outputFormat=xml&company\_id={{companyId}}

AUTHORIZATIONOAuth 2.0

This request is using OAuth 2.0 from collection [wFirma.pl](https://doc.wfirma.pl/#auth-info-3854b824-3162-4c02-a47b-af2012073033)

PARAMS

inputFormat

xml

Przyjmuje wartość json i xml

outputFormat

xml

Przyjmuje wartość json i xml

company\_id

{{companyId}}

Example Request

company\_accounts/get

View More

curl

```curl
curl --location -g '{{host}}/company_accounts/get/{{companyAcoountId}}?inputFormat=xml&outputFormat=xml&company_id={{companyId}}'
```

Example Response

- Body
- Headers (0)

No response body

This request doesn't return any response body

No response headers

This request doesn't return any response headers

## company\_addresses

AUTHORIZATIONOAuth 2.0

This folder is using OAuth 2.0 from collection [wFirma.pl](https://doc.wfirma.pl/#auth-info-3854b824-3162-4c02-a47b-af2012073033)

### GETcompany\_addresses/findMain

{{host}}/company\_addresses/findmain?outputFormat=xml&inputFormat=xml&company\_id={{companyId}}

AUTHORIZATIONOAuth 2.0

This request is using OAuth 2.0 from collection [wFirma.pl](https://doc.wfirma.pl/#auth-info-3854b824-3162-4c02-a47b-af2012073033)

PARAMS

outputFormat

xml

inputFormat

xml

company\_id

{{companyId}}

Example Request

company\_addresses/findMain

View More

curl

```curl
curl --location -g '{{host}}/company_addresses/findmain?outputFormat=xml&inputFormat=xml&company_id={{companyId}}'
```

Example Response

- Body
- Headers (0)

No response body

This request doesn't return any response body

No response headers

This request doesn't return any response headers

## company\_packs

Nie można zapewnić kompatybilności wstecznej tego modułu API. Możliwa jest zmiana struktury odpowiedzi w przyszłości.

##### Akcje

- **get**

##### Pola

| **Nazwa pola** | **Przeznaczenie** | **Opis** |
| --- | --- | --- |
| _**id**_ | Tylko do odczytu | Klucz główny |
| _**pack**_ | Tylko do odczytu | `pack_trade` \- pakiet "Zarządzanie sprzedażą", `pack_tradew` \- pakiet "Zarządzanie sprzedażą + Magazyn", `pack_book` \- pakiet "Księgowość online", `pack_bookw` \- pakiet "Księgowość online + Magazyn" |
| _**months**_ | Tylko do odczytu | Na jaki okres przedłużany jest pakiet |
| _**expiration\_date**_ | Tylko do odczytu | Data ważności pakietu |
| _**status**_ | Tylko do odczytu | Status aktywności pakietu, pole aktualizowane przy logowaniu do systemu. |
| _**created**_ | Tylko do odczytu | Data i godzina utworzenia wpisu |
| _**modified**_ | Tylko do odczytu | Data i godzina zmodyfikowania wpisu |

AUTHORIZATIONOAuth 2.0

This folder is using OAuth 2.0 from collection [wFirma.pl](https://doc.wfirma.pl/#auth-info-3854b824-3162-4c02-a47b-af2012073033)

### GETcompany\_packs/get

{{host}}/company\_packs/get/{{companyPackId}}?inputFormat=xml&outputFormat=xml&company\_id={{companyId}}

AUTHORIZATIONOAuth 2.0

This request is using OAuth 2.0 from collection [wFirma.pl](https://doc.wfirma.pl/#auth-info-3854b824-3162-4c02-a47b-af2012073033)

PARAMS

inputFormat

xml

Przyjmuje wartość json i xml

outputFormat

xml

Przyjmuje wartość json i xml

company\_id

{{companyId}}

Example Request

company\_packs/get

View More

curl

```curl
curl --location -g '{{host}}/company_packs/get/{{companyPackId}}?inputFormat=xml&outputFormat=xml&company_id={{companyId}}'
```

Example Response

- Body
- Headers (0)

No response body

This request doesn't return any response body

No response headers

This request doesn't return any response headers

## declaration\_body\_jpkvat

##### Akcje

- **get** \- pobieranie danych deklaracji JPK (XML)

##### Identyfikatory adresu

| **Nazwa parametru** | **Opis** |
| --- | --- |
| _**year**_ | rok wystawienia deklaracji |
| _**month**_ | miesiąc wystawienia deklaracji |

AUTHORIZATIONOAuth 2.0

This folder is using OAuth 2.0 from collection [wFirma.pl](https://doc.wfirma.pl/#auth-info-3854b824-3162-4c02-a47b-af2012073033)

### GETdeclaration\_body\_jpkvat/get

{{host}}/declaration\_body\_jpkvat/get/{{year}}/{{month}}?outputFormat=xml&inputFormat=xml&company\_id={{companyId}}

AUTHORIZATIONOAuth 2.0

This request is using OAuth 2.0 from collection [wFirma.pl](https://doc.wfirma.pl/#auth-info-3854b824-3162-4c02-a47b-af2012073033)

PARAMS

outputFormat

xml

inputFormat

xml

company\_id

{{companyId}}

Example Request

declaration\_body\_jpkvat/get

View More

curl

```curl
curl --location -g '{{host}}/declaration_body_jpkvat/get/{{year}}/{{month}}?outputFormat=xml&inputFormat=xml&company_id={{companyId}}'
```

Example Response

- Body
- Headers (0)

No response body

This request doesn't return any response body

No response headers

This request doesn't return any response headers

## declaration\_body\_pit

##### Akcje

- **get** \- pobieranie deklaracji PIT (XML)

##### Identyfikatory adresu

| **Nazwa parametru** | **Opis** |
| --- | --- |
| _**type**_ | typ deklaracji - **pit36**, **pit36l**, **pit28** |
| _**year**_ | rok wystawienia deklaracji |

AUTHORIZATIONOAuth 2.0

This folder is using OAuth 2.0 from collection [wFirma.pl](https://doc.wfirma.pl/#auth-info-3854b824-3162-4c02-a47b-af2012073033)

### GETdeclaration\_body\_pit/get

{{host}}/declaration\_body\_pit/get/{{type}}/{{year}}?outputFormat=xml&inputFormat=xml&company\_id={{companyId}}

AUTHORIZATIONOAuth 2.0

This request is using OAuth 2.0 from collection [wFirma.pl](https://doc.wfirma.pl/#auth-info-3854b824-3162-4c02-a47b-af2012073033)

PARAMS

outputFormat

xml

inputFormat

xml

company\_id

{{companyId}}

Example Request

declaration\_body\_pit/get

View More

curl

```curl
curl --location -g '{{host}}/declaration_body_pit/get/{{type}}/{{year}}?outputFormat=xml&inputFormat=xml&company_id={{companyId}}'
```

Example Response

- Body
- Headers (0)

No response body

This request doesn't return any response body

No response headers

This request doesn't return any response headers

## declaration\_countries

###### Akcje

- **find** \- pobranie kodów krajów według klasyfikacji określonej w systemie e-deklaracje
- **get** \- pobranie kodu kraju o podanym **id**

##### Pola

| **Nazwa pola** | **Przeznaczenie** | **Opis** |
| --- | --- | --- |
| _**id**_ | Tylko do odczytu | Klucz główny |
| _**name**_ | Tylko do odczytu | Nazwa kraju |
| _**code**_ | Tylko do odczytu | Dwuliterowy kod kraju według klasyfikacji określonej w systemie e-deklaracje. |
| _**priority**_ | Tylko do odczytu | Częściej stosowane kraje mają ustawiony wyższy priorytet, przez co są wymienione wyżej na liście krajów do wyboru w systemie |
| _**created**_ | Tylko do odczytu | Data i godzina utworzenia wpisu |
| _**modified**_ | Tylko do odczytu | Data i godzina zmodyfikowania wpisu |

AUTHORIZATIONOAuth 2.0

This folder is using OAuth 2.0 from collection [wFirma.pl](https://doc.wfirma.pl/#auth-info-3854b824-3162-4c02-a47b-af2012073033)

### GETdeclaration\_countries/find

{{host}}/declaration\_countries/find?outputFormat=xml&inputFormat=xml&company\_id={{companyId}}

AUTHORIZATIONOAuth 2.0

This request is using OAuth 2.0 from collection [wFirma.pl](https://doc.wfirma.pl/#auth-info-3854b824-3162-4c02-a47b-af2012073033)

PARAMS

outputFormat

xml

Przyjmuje wartość json i xml

inputFormat

xml

Przyjmuje wartość json i xml

company\_id

{{companyId}}

Example Request

declaration\_countries/find

View More

curl

```curl
curl --location -g '{{host}}/declaration_countries/find?outputFormat=xml&inputFormat=xml&company_id={{companyId}}'
```

Example Response

- Body
- Headers (0)

No response body

This request doesn't return any response body

No response headers

This request doesn't return any response headers

### GETdeclaration\_countries/get

{{host}}/declaration\_countries/get/{{declarationCountryId}}?outputFormat=xml&inputFormat=xml&company\_id={{companyId}}

AUTHORIZATIONOAuth 2.0

This request is using OAuth 2.0 from collection [wFirma.pl](https://doc.wfirma.pl/#auth-info-3854b824-3162-4c02-a47b-af2012073033)

PARAMS

outputFormat

xml

Przyjmuje wartość json i xml

inputFormat

xml

Przyjmuje wartość json i xml

company\_id

{{companyId}}

Example Request

declaration\_countries/get

View More

curl

```curl
curl --location -g '{{host}}/declaration_countries/get/{{declarationCountryId}}?outputFormat=xml&inputFormat=xml&company_id={{companyId}}'
```

Example Response

- Body
- Headers (0)

No response body

This request doesn't return any response body

No response headers

This request doesn't return any response headers

## documents

Moduł odpowiedzialny za zarządzanie dokumentami

###### Akcje

- **add** \- dodawanie dokumentu
- **delete** \- usunięcie dokumentu o podanym **id**
- **download** \- pobranie wydruku dokumentu w PDF
- **find** \- pobieranie listy dokumentów
- **get** \- pobranie szczegółów dokumentu o podanym **id**

##### Pola

View More

| **Nazwa pola** | **Przeznaczenie** | **Opis** |
| --- | --- | --- |
| _**id**_ | Tylko do odczytu | Klucz główny |
| _**object\_name**_ | Odczyt i zapis | Nazwa powiązanego obiektu |
| _**object\_id**_ | Odczyt i zapis | Id powiązanego obiektu |
| _**name**_ | Odczyt i zapis | Nazwa dokumentu |
| _**text**_ | Odczyt i zapis | Treść - dotyczy dokumentu typu `document_template` |
| _**url**_ | Odczyt i zapis | Odsyłacz - dotyczy dokument typu `url` |
| _**filename**_ | Odczyt i zapis | Nazwa pliku |
| _**mime**_ | Odczyt i zapis |  |
| _**size**_ | Tylko do odczytu | Rozmiar w bajtach |
| _**icon**_ | Tylko do odczytu | Ikona widoczna na liście |
| _**type**_ | Odczyt i zapis | Typ dokumentu: `file` \- zwykły plik, `document_template` \- wydruk wygenerowany z szablonu dokumentu, `url` \- odsyłacz |
| _**set**_ | Odczyt i zapis | Zbiór w jakim znajduje się dokument: `book` \- dokument księgowy, `crm` \- CRM, `declaration` \- deklaracje, `staff` \- kadry, `warehouse` \- magazyn |
| _**notes**_ | Tylko do odczytu | Liczba notatek powiązanych z dokumentem |
| _**tags**_ | Odczyt i zapis | Znaczniki powiązane z dokumentem w formacie `(ID ZNACZNIKA X),(ID ZNACZNIKA Y)...` |
| _**created**_ | Tylko do odczytu | Data i godzina utworzenia wpisu |
| _**modified**_ | Tylko do odczytu | Data i godzina zmodyfikowania wpisu |

AUTHORIZATIONOAuth 2.0

This folder is using OAuth 2.0 from collection [wFirma.pl](https://doc.wfirma.pl/#auth-info-3854b824-3162-4c02-a47b-af2012073033)

### POSTdocuments/add

{{host}}/documents/add?inputFormat=xml&outputFormat=xml&company\_id={{companyId}}

AUTHORIZATIONOAuth 2.0

This request is using OAuth 2.0 from collection [wFirma.pl](https://doc.wfirma.pl/#auth-info-3854b824-3162-4c02-a47b-af2012073033)

HEADERS

Content-Type

application/xml

PARAMS

inputFormat

xml

Przyjmuje wartość json i xml

outputFormat

xml

Przyjmuje wartość json i xml

company\_id

{{companyId}}

Bodyraw

View More

```javascript
<?xml version="1.0" encoding="UTF-8"?>
<api>
    <documents>
        <document>
            <is_ocr_file>1</is_ocr_file>
            <object_name>document</object_name>
            <object_id>0</object_id>
            <staff_files_uid></staff_files_uid>
            <name>{{docName}}</name>
            <date>2019-09-16</date>
            <date_auto>1</date_auto>
            <text></text>
            <url></url>
            <filename></filename>
            <signature_certificates></signature_certificates>
            <size></size>
            <icon>page_white_paint</icon>
            <type>document_template</type>
            <type_folder></type_folder>
            <set>crm</set>
            <protected>0</protected>
        </document>
    </documents>
</api>
```

Example Request

documents/add

View More

curl

```curl
curl --location -g '{{host}}/documents/add?inputFormat=xml&outputFormat=xml&company_id={{companyId}}' \
--header 'Content-Type: application/xml' \
--data '<?xml version="1.0" encoding="UTF-8"?>
<api>
    <documents>
        <document>
            <is_ocr_file>1</is_ocr_file>
            <object_name>document</object_name>
            <object_id>0</object_id>
            <staff_files_uid></staff_files_uid>
            <name>{{docName}}</name>
            <date>2019-09-16</date>
            <date_auto>1</date_auto>
            <text></text>
            <url></url>
            <filename></filename>
            <signature_certificates></signature_certificates>
            <size></size>
            <icon>page_white_paint</icon>
            <type>document_template</type>
            <type_folder></type_folder>
            <set>crm</set>
            <protected>0</protected>
        </document>
    </documents>
</api>'
```

Example Response

- Body
- Headers (0)

No response body

This request doesn't return any response body

No response headers

This request doesn't return any response headers

### GETdocuments/find

{{host}}/documents/find?outputFormat=xml&inputFormat=xml&company\_id={{companyId}}

AUTHORIZATIONOAuth 2.0

This request is using OAuth 2.0 from collection [wFirma.pl](https://doc.wfirma.pl/#auth-info-3854b824-3162-4c02-a47b-af2012073033)

PARAMS

outputFormat

xml

Przyjmuje wartość json i xml

inputFormat

xml

Przyjmuje wartość json i xml

company\_id

{{companyId}}

Example Request

documents/find

curl

```curl
curl --location -g '{{host}}/documents/find?outputFormat=xml&inputFormat=xml&company_id={{companyId}}'
```

Example Response

- Body
- Headers (0)

No response body

This request doesn't return any response body

No response headers

This request doesn't return any response headers

### GETdocuments/get

{{host}}/documents/get/{{documentId}}?outputFormat=xml&inputFormat=xml&company\_id={{companyId}}

AUTHORIZATIONOAuth 2.0

This request is using OAuth 2.0 from collection [wFirma.pl](https://doc.wfirma.pl/#auth-info-3854b824-3162-4c02-a47b-af2012073033)

PARAMS

outputFormat

xml

Przyjmuje wartość json i xml

inputFormat

xml

Przyjmuje wartość json i xml

company\_id

{{companyId}}

Example Request

documents/get

View More

curl

```curl
curl --location -g '{{host}}/documents/get/{{documentId}}?outputFormat=xml&inputFormat=xml&company_id={{companyId}}'
```

Example Response

- Body
- Headers (0)

No response body

This request doesn't return any response body

No response headers

This request doesn't return any response headers

### GETdocuments/download

{{host}}/documents/download/{{documentId}}?outputFormat=xml&inputFormat=xml&company\_id={{companyId}}

AUTHORIZATIONOAuth 2.0

This request is using OAuth 2.0 from collection [wFirma.pl](https://doc.wfirma.pl/#auth-info-3854b824-3162-4c02-a47b-af2012073033)

PARAMS

outputFormat

xml

Przyjmuje wartość json i xml

inputFormat

xml

Przyjmuje wartość json i xml

company\_id

{{companyId}}

Example Request

documents/download

View More

curl

```curl
curl --location -g '{{host}}/documents/download/{{documentId}}?outputFormat=xml&inputFormat=xml&company_id={{companyId}}'
```

Example Response

- Body
- Headers (0)

No response body

This request doesn't return any response body

No response headers

This request doesn't return any response headers

### DELETEdocuments/delete

{{host}}/documents/delete/{{documentId}}?outputFormat=xml&inputFormat=xml&company\_id={{companyId}}

AUTHORIZATIONOAuth 2.0

This request is using OAuth 2.0 from collection [wFirma.pl](https://doc.wfirma.pl/#auth-info-3854b824-3162-4c02-a47b-af2012073033)

PARAMS

outputFormat

xml

Przyjmuje wartość json i xml

inputFormat

xml

Przyjmuje wartość json i xml

company\_id

{{companyId}}

Example Request

documents/delete

View More

curl

```curl
curl --location -g --request DELETE '{{host}}/documents/delete/{{documentId}}?outputFormat=xml&inputFormat=xml&company_id={{companyId}}'
```

Example Response

- Body
- Headers (0)

No response body

This request doesn't return any response body

No response headers

This request doesn't return any response headers

## expenses

Moduł odpowiedzialny za zarządzanie wydatkami

##### Akcje

- **find** \- pobieranie listy wydatków
- **get** \- pobieranie szczegółów wydatku o podanym **id**

##### Powiązane moduły

- **contractors** (skrócony, pojedynczy)
- **expense\_parts** (pełny, mnogi)
- **payments** (skrócony, pojedynczy)
- **payment\_cashboxes** (skrócony, pojedynczy)

View More

| **Nazwa pola** | **Przeznaczenie** | **Opis** |
| --- | --- | --- |
| _**id**_ | Tylko do odczytu | Klucz główny |
| _**type**_ | Tylko do odczytu | Typ dokumentu - **invoice**, **bill**, **vat\_exempt** |
| _**date**_ | Tylko do odczytu | Data wystawienia wydatku - format RRRR-MM-DD |
| _**taxregister\_date**_ | Tylko do odczytu | Data księgowania do kpir - format RRRR-MM-DD |
| _**payment\_date**_ | Tylko do odczytu | Termin\_płatności - format RRRR-MM-DD |
| _**payment\_method**_ | Tylko do odczytu | Metoda płatności **cash**, **transfer**, **compensation**, **cod**, **payment\_card** |
| _**paid**_ | Tylko do odczytu | **0**, **1** \- czy zapłacono całość |
| _**alreadypaid\_initial**_ | Tylko do odczytu | Kwota do podania, jeśli "paid" wynosi **1**, należy wprowadzić **0** |
| _**currency**_ | Tylko do odczytu | Waluta np. PLN |
| _**accounting\_effect**_ | Tylko do odczytu | Skutek księgowy - **kpir\_and\_vat**, **kpir**, **vat**, **nothing** |
| _**warehouse\_type**_ | Tylko do odczytu | **simple** \- informacje o ilości w prostym katalogu produktów, **extended** \- informacje o ilości przy włączonym module magazynowym |
| _**schema\_vat\_cashbox**_ | Tylko do odczytu | **0**, **1** \- metoda kasowa |
| _**wnt**_ | Tylko do odczytu | **0**, **1** \- WNT |
| _**service\_import**_ | Tylko do odczytu | **0**, **1** \- Import usług |
| _**service\_import2**_ | Tylko do odczytu | **0**, **1** \- Import usług art.28b |
| _**cargo\_import**_ | Tylko do odczytu | **0**, **1** \- Import towarów art. 33a |
| _**split\_payment**_ | Tylko do odczytu | **0**, **1** \- Podzielona płatność |
| _**draft**_ | Tylko do odczytu | **0**, **1** \- draft wydatku |
| _**tax\_evaluation\_method**_ | Tylko do odczytu | **netto**, **brutto** \- sposób przeliczania ceny z "price" dla produktów |

##### Expense\_parts

View More

| **Nazwa pola** | **Przeznaczenie** | **Opis** |
| --- | --- | --- |
| _**id**_ | Tylko do odczytu | Klucz główny |
| _**exspense\_part\_type**_ | Tylko do odczytu | **rates**, **positions** \- pole specjalnie przygotowane pod API. Oznaczamy tutaj, czy dodajemy przy rodzaju wydatku stawki, czy pozycje. Pozycje są dostępne jedynie dla schema **purchase\_trade\_goods** |
| _**schema**_ | Tylko do odczytu | Typ dokumentu - **cost**, **purchase\_trade\_goods**, **vehicle\_fuel**, **vehicle\_expense** \- jeśli chcemy dodać produkty, należy wstawić **purchase\_trade\_goods** |
| _**good\_action**_ | Tylko do odczytu | **new** \- wysyłamy, gdy chcemy utworzyć nowy produkt |
| _**good\_id**_ | Tylko do odczytu | ID produktu |
| _**unit**_ | Tylko do odczytu | Jednostka słownie, np. "szt." |
| _**unit\_id**_ | Tylko do odczytu | ID jednostki - możemy wysłać zamiast parametru "unit" |
| _**count**_ | Tylko do odczytu | Ilość - niewysłanie tego parametru wstawi produkt o ilości 1 |
| _**price**_ | Tylko do odczytu | Kwota produktu - w zależności od **tax\_evaluation\_method** będzie to cena netto lub brutto. Jeśli nie wyślemy tej wartości, podstawi nam domyślną cenę zakupu produktu |
| _**vat\_code**_ | Tylko do odczytu | ID stawki VAT zawarte w gałęzi ID |

AUTHORIZATIONOAuth 2.0

This folder is using OAuth 2.0 from collection [wFirma.pl](https://doc.wfirma.pl/#auth-info-3854b824-3162-4c02-a47b-af2012073033)

### GETexpenses/find

{{host}}/expenses/find?outputFormat=xml&inputFormat=xml&company\_id={{companyId}}

AUTHORIZATIONBasic Auth

Username

{{username}}

Password

{{password}}

PARAMS

outputFormat

xml

Przyjmuje wartość json i xml

inputFormat

xml

Przyjmuje wartość json i xml

company\_id

{{companyId}}

Example Request

expenses/find

curl

```curl
curl --location -g '{{host}}/expenses/find?outputFormat=xml&inputFormat=xml&company_id={{companyId}}' \
--data ''
```

Example Response

- Body
- Headers (0)

No response body

This request doesn't return any response body

No response headers

This request doesn't return any response headers

### GETexpenses/get

{{host}}/expenses/get/{{expenseId}}?outputFormat=xml&inputFormat=xml&company\_id={{companyId}}

AUTHORIZATIONBasic Auth

Username

{{username}}

Password

<password>

PARAMS

outputFormat

xml

inputFormat

xml

company\_id

{{companyId}}

Example Request

expenses/get

View More

curl

```curl
curl --location -g '{{host}}/expenses/get/{{expenseId}}?outputFormat=xml&inputFormat=xml&company_id={{companyId}}'
```

Example Response

- Body
- Headers (0)

No response body

This request doesn't return any response body

No response headers

This request doesn't return any response headers

## goods

Zarządzanie katalogiem produktów.

##### Akcje

- **add** \- dodawanie produktu
- **delete** \- usunięcie produktu o podanym **id**
- **edit** \- modyfikacja produktu o podanym **id**
- **find** \- pobranie listy produktów
- **get** \- pobranie szczegółów produktu o podanym **id**

##### Pola

View More

| **Nazwa Pola** | **Przeznaczenie** | **Opis** |
| --- | --- | --- |
| _**id**_ | Tylko do odczytu | Klucz główny |
| _**name**_ | Odczyt i zapis | Nazwa produktu |
| _**code**_ | Odczyt i zapis | Kod produktu |
| _**unit**_ | Odczyt i zapis | Jednostka |
| _**netto**_ | Odczyt i zapis | Cena netto |
| _**brutto**_ | Odczyt i zapis | Cena brutto |
| _**gtu**_ | Odczyt i zapis | numer kodu GTU (pole dostępne w rozbudowanym magazynie) |
| _**lumpcode**_ | Odczyt i zapis | Stawka zryczałtowanego podatku od przychodu. Pole powinno być ustawione tylko w przypadku prowadzenia Ewidencji Przychodów (ryczałt). |
| _**type**_ | Odczyt i zapis | `good` \- oznacza, że produkt jest towarem, `service` oznacza, że produkt jest usługą, `set` oznacza, że produkt jest kompletem |
| _**classification**_ | Odczyt i zapis | Kod w klasyfikacji PKWiU |
| _**discount**_ | Odczyt i zapis | `1` \- oznacza, że cena produktu będzie pomniejszona o rabat dla kontrahenta, `0` w przeciwnym wypadku |
| _**description**_ | Odczyt i zapis | Opis produktu |
| _**notes**_ | Tylko do odczytu | Liczba notatek powiązanych z produktem |
| _**documents**_ | Tylko do odczytu | Liczba dokumentów powiązanych z produktem |
| _**tags**_ | Odczyt i zapis | Znaczniki powiązane z produktem w formacie `(ID ZNACZNIKA X)`,`(ID ZNACZNIKA Y)`... |
| _**created**_ | Tylko do odczytu | Data i godzina utworzenia wpisu |
| _**modified**_ | Tylko do odczytu | Data i godzina zmodyfikowania wpisu |
| _**count**_ | Odczyt i zapis | Ilość produktu. W przypadku włączonego magazynu pole jest tylko do odczytu. |
| _**reserved**_ | Tylko do odczytu | Ilość zarezerwowanego produktu |
| _**min**_ | Odczyt i zapis | Granica stanu minimalnego produktu |
| _**max**_ | Odczyt i zapis | Granica stanu maksymalnego produktu |
| _**secure**_ | Odczyt i zapis | Granica stanu bezpiecznego produktu |
| _**visibility**_ | Odczyt i zapis | Widoczność produktu w magazynie/katalogu produktów |
| _**warehouse\_type**_ | Tylko do odczytu | `simple` \- informacje o ilości w prostym katalogu produktów, `extended` \- informacje o ilości przy włączonym module magazynowym |
| _**price\_type**_ | Odczyt i zapis | Pole decyduje o tym czy podatek jest liczony od ceny netto czy brutto |
| _**vat**_ | Odczyt i zapis | Stawka podatku VAT |

**Pola używane przy włączonym magazynie, dotyczą aktywnego magazynu lub wybranego za pomocą parametru GET warehouse\_id=\[id\]**

AUTHORIZATIONOAuth 2.0

This folder is using OAuth 2.0 from collection [wFirma.pl](https://doc.wfirma.pl/#auth-info-3854b824-3162-4c02-a47b-af2012073033)

### POSTgoods/add

{{host}}/goods/add?outputFormat=xml&inputFormat=xml&company\_id={{companyId}}

AUTHORIZATIONOAuth 2.0

This request is using OAuth 2.0 from collection [wFirma.pl](https://doc.wfirma.pl/#auth-info-3854b824-3162-4c02-a47b-af2012073033)

PARAMS

outputFormat

xml

Przyjmuje wartość json i xml

inputFormat

xml

Przyjmuje wartość json i xml

company\_id

{{companyId}}

Bodyraw (xml)

View More

xml

```xml
<?xml version="1.0" encoding="UTF-8"?>
<api>
    <goods>
        <good>
            <name>Product_Name1</name>
            <unit>szt.</unit>
            <netto>10</netto>
            <type>good</type>
            <vat_code>
                <id>222</id>
            </vat_code>
            <warehouse_type>simple</warehouse_type>
            <count>6</count>
        </good>
    </goods>
</api>
```

Example Request

goods/add

View More

curl

```curl
curl --location -g '{{host}}/goods/add?outputFormat=xml&inputFormat=xml&company_id={{companyId}}' \
--data '<?xml version="1.0" encoding="UTF-8"?>
<api>
    <goods>
        <good>
            <name>Product_Name1</name>
            <unit>szt.</unit>
            <netto>10</netto>
            <type>good</type>
            <vat_code>
                <id>222</id>
            </vat_code>
            <warehouse_type>simple</warehouse_type>
            <count>6</count>
        </good>
    </goods>
</api>'
```

Example Response

- Body
- Headers (0)

No response body

This request doesn't return any response body

No response headers

This request doesn't return any response headers

### GETgoods/find

{{host}}/goods/find?outputFormat=xml&inputFormat=xml&company\_id={{companyId}}

AUTHORIZATIONOAuth 2.0

This request is using OAuth 2.0 from collection [wFirma.pl](https://doc.wfirma.pl/#auth-info-3854b824-3162-4c02-a47b-af2012073033)

HEADERS

Content-Type

application/xml

PARAMS

outputFormat

xml

Przyjmuje wartość json i xml

inputFormat

xml

Przyjmuje wartość json i xml

company\_id

{{companyId}}

Bodyraw

```javascript
<api>
    <goods>
        <parameters>
            <page>1</page>
            <limit>10</limit>
            <fields>
                <field>WarehouseGood.count</field>
            </fields>
        </parameters>
    </goods>
</api>
```

Example Request

goods/find

View More

curl

```curl
curl --location -g --request GET '{{host}}/goods/find?outputFormat=xml&inputFormat=xml&company_id={{companyId}}' \
--header 'Content-Type: application/xml' \
--data '<api>
    <goods>
        <parameters>
            <page>1</page>
            <limit>10</limit>
            <fields>
                <field>WarehouseGood.count</field>
            </fields>
        </parameters>
    </goods>
</api>'
```

Example Response

- Body
- Headers (0)

No response body

This request doesn't return any response body

No response headers

This request doesn't return any response headers

### GETgoods/get

{{host}}/goods/get/{{goodId}}?outputFormat=xml&inputFormat=xml&company\_id={{companyId}}

AUTHORIZATIONOAuth 2.0

This request is using OAuth 2.0 from collection [wFirma.pl](https://doc.wfirma.pl/#auth-info-3854b824-3162-4c02-a47b-af2012073033)

PARAMS

outputFormat

xml

Przyjmuje wartość json i xml

inputFormat

xml

Przyjmuje wartość json i xml

company\_id

{{companyId}}

Example Request

goods/get

View More

curl

```curl
curl --location -g '{{host}}/goods/get/{{goodId}}?outputFormat=xml&inputFormat=xml&company_id={{companyId}}' \
--data ''
```

Example Response

- Body
- Headers (0)

No response body

This request doesn't return any response body

No response headers

This request doesn't return any response headers

### POSTgoods/edit

{{host}}/goods/edit/{{goodId}}?outputFormat=xml&inputFormat=xml&company\_id={{companyId}}

AUTHORIZATIONOAuth 2.0

This request is using OAuth 2.0 from collection [wFirma.pl](https://doc.wfirma.pl/#auth-info-3854b824-3162-4c02-a47b-af2012073033)

PARAMS

outputFormat

xml

Przyjmuje wartość json i xml

inputFormat

xml

Przyjmuje wartość json i xml

company\_id

{{companyId}}

Bodyraw

View More

```javascript
<?xml version="1.0" encoding="UTF-8"?>
<api>
    <goods>
        <good>
            <name>marchewka</name>
            <unit>szt.</unit>
            <netto>14.00</netto>
            <vat>23</vat>
            <lumpcode>20</lumpcode>
        </good>
    </goods>
</api>
```

Example Request

goods/edit

View More

curl

```curl
curl --location -g '{{host}}/goods/edit/{{goodId}}?outputFormat=xml&inputFormat=xml&company_id={{companyId}}' \
--data '<?xml version="1.0" encoding="UTF-8"?>
<api>
    <goods>
        <good>
            <name>marchewka</name>
            <unit>szt.</unit>
            <netto>14.00</netto>
            <vat>23</vat>
            <lumpcode>20</lumpcode>
        </good>
    </goods>
</api>'
```

Example Response

- Body
- Headers (0)

No response body

This request doesn't return any response body

No response headers

This request doesn't return any response headers

### DELETEgoods/delete

{{host}}/goods/delete/{{goodId}}?outputFormat=xml&inputFormat=xml&company\_id={{companyId}}

AUTHORIZATIONOAuth 2.0

This request is using OAuth 2.0 from collection [wFirma.pl](https://doc.wfirma.pl/#auth-info-3854b824-3162-4c02-a47b-af2012073033)

PARAMS

outputFormat

xml

Przyjmuje wartość json i xml

inputFormat

xml

Przyjmuje wartość json i xml

company\_id

{{companyId}}

Example Request

goods/delete

View More

curl

```curl
curl --location -g --request DELETE '{{host}}/goods/delete/{{goodId}}?outputFormat=xml&inputFormat=xml&company_id={{companyId}}' \
--data ''
```

Example Response

- Body
- Headers (0)

No response body

This request doesn't return any response body

No response headers

This request doesn't return any response headers

## interests

AUTHORIZATIONOAuth 2.0

This folder is using OAuth 2.0 from collection [wFirma.pl](https://doc.wfirma.pl/#auth-info-3854b824-3162-4c02-a47b-af2012073033)

### GETinterests/find

{{host}}/interests/find?outputFormat=xml&inputFormat=xml&company\_id={{companyId}}

AUTHORIZATIONOAuth 2.0

This request is using OAuth 2.0 from collection [wFirma.pl](https://doc.wfirma.pl/#auth-info-3854b824-3162-4c02-a47b-af2012073033)

PARAMS

outputFormat

xml

Przyjmuje wartość json i xml

inputFormat

xml

Przyjmuje wartość json i xml

company\_id

{{companyId}}

Example Request

interests/find

curl

```curl
curl --location -g '{{host}}/interests/find?outputFormat=xml&inputFormat=xml&company_id={{companyId}}'
```

Example Response

- Body
- Headers (0)

No response body

This request doesn't return any response body

No response headers

This request doesn't return any response headers

## invoices

##### Akcje

- **add** \- dodawanie faktury
- **delete** \- usunięcie faktury o podanym **id**
- **download** \- pobranie wydruku faktury w PDF, akcja przyjmuje 4 parametry (przykład zapytania znajduje się w dolnej części sekcji):

  - page: Dozwolone wartości:

    - all - wydruk oryginału i kopii
    - invoice - wydruk oryginału
    - invoicecopy - wydruk kopii

  - address - adres korespondencyjny nabywcy na odwrocie oryginału faktury, umieszczony w takim miejscu, by po złożeniu faktury do rozmiaru DL w Z, adres był na wysokości okienka w kopercie (dozwolone wartości: 0 lub 1)
  - leaflet - druczek przelewu jest generowany tylko dla faktury z metodą płatności "przelew" w walucie PLN (dozwolone wartości: 0 lub 1)
  - duplicate - w przypadku gdy nasz kontrahent zgubi od nas fakturę, należy przekazać mu duplikat (dozwolone wartości: 0 lub 1)

- **edit** \- edycja faktury o podanym **id**
- **find** \- pobranie listy faktur
- **fiscalize** \- oznaczanie paragonu fiskalnego o podanym **id** jako zafiskalizowany
- **get** \- pobranie szczegółów faktury o podanym **id**
- **send** \- wysłanie faktury w PDF do klienta, akcja przyjmuje 7 parametrów (przykład zapytania znajduje się w dolczej części sekcji):

  - email - adres odbiorcy. Parametr opcjonalny - w przypadku jego braku adres pobierany jest z rekordu kontrahenta.
  - subject - tytuł wiadomości, jeżeli jest pusty to ustawiana jest wartość z domyślnego szablonu
  - page: Dozwolone wartości:

    - all - wydruk oryginału i kopii
    - invoice - wydruk oryginału
    - invoicecopy - wydruk kopii

  - leaflet - druczek przelewu jest generowany tylko dla faktur z metodą płatności "przelew" w walucie PLN (dozwolone wartości: 0 lub 1)
  - duplicate - w przypadku gdy nasz kontrahent zgubi od nas fakturę, należy przekazać mu duplikat (dozwolone wartości: 0 lub 1)
  - body - treść wiadomości, jeżeli jest pusta to ustawiana jest wartość z domyślnego szablonu

    **id**

- **unfiscalize** \- cofnięcie fiskalizacji paragonu fiskalnego o podanym **id**

##### Powiązane moduły

- **companies** (skrócony, pojedynczy)
- **company\_accounts** (skrócony, pojedynczy)
- **company\_details** (pełny, pojedynczy)
- **contractors** (skrócony, pojedynczy)
- **contractor\_details** (pełny, pojedynczy)
- **contractor\_receiver\_details** (pełny, pojedynczy)
- **emails** (skrócony, pojedynczy) - pod gałęzią **email**
- **emails** (skrócony, pojedynczy) - pod gałęzią **email2**
- **expenses** (skrócony, pojedynczy)
- **invoices** (skrócony, pojedynczy) - pod gałęzią **parent**
- **invoices** (skrócony, pojedynczy) - pod gałęzią **order**
- **invoicecontents** (pełny, mnogi)
- **payments** (skrócony, pojedynczy)
- **payment\_cashboxes** (skrócony, pojedynczy)
- **postivo\_shipments** (skrócony, pojedynczy)
- **postivo\_shipment\_contents** (skrócony, pojedynczy)
- **series** (skrócony, pojedynczy)
- **translation\_languages** (skrócony, pojedynczy)
- **vat\_contents** (pełny, mnogi)
- **vat\_moss\_details** (pełny, pojedynczy)

##### Rodzaje dokumentów

| **Dokumenty płatnika VAT** | **Znacznik** |
| --- | --- |
| Faktura VAT | `normal` |
| Faktura VAT marża | `margin` |
| Pro forma | `proforma` |
| Oferta | `offer` |
| Dowód sprzedaży / Paragon niefiskalny | `receipt_normal` |
| Paragon fiskalny | `receipt_fiscal_normal` |
| Inny przychód - sprzedaż | `income_normal` |

| **Dokumenty nievatowca** | **Znacznik** |
| --- | --- |
| Faktura (bez VAT) | `bill` |
| Pro forma (bez VAT) | `proforma_bill` |
| Oferta (bez VAT) | `offer_bill` |
| Dowód sprzedaży / Paragon niefiskalny (bez VAT) | `receipt_bill` |
| Paragon fiskalny (bez VAT) | `receipt_fiscal_bill` |
| Inny przychód - sprzedaż (bez VAT) | `income_bill` |

##### Pola

View More

| **Nazwa Pola** | **Przeznaczenie** | **Typ dokumentu** | **Opis** |
| --- | --- | --- | --- |
| **id** | Tylko do odczytu | Każdy dokument | Klucz główny |
| **schema\_receipt\_book** | Odczyt i zapis | Dowód sprzedaży, Paragon fiskalny, Dowód sprzedaży (bez VAT), Paragon fiskalny (bez VAT) | Czy paragon ma być księgowany |
| **receipt\_fiscal\_printed** | Tylko do odczytu | Paragon fiskalny, Paragon fiskalny (bez VAT) | Czy paragon został wydrukowany |
| **income\_lumpcode** | Odczyt i zapis | Inny przychód - sprzedaż, Inny przychód - sprzedaż (bez VAT) | Stawka ryczałtu w przypadku prowadzenia Ewidencji przychodów |
| **income\_correction** | Odczyt i zapis | Inny przychód - sprzedaż, Inny przychód - sprzedaż (bez VAT) | Stawka ryczałtu w przypadku prowadzenia Ewidencji przychodów |
| **payment** | Tylko zapis | Każdy dokument | Pole odpowiedzialne za wybór typu rachunku (walutowy lub PLN) w przypadku wystawiania rozliczonych dokumentów przychodowych w obcej walucie.<br>Pola które należy zawrzeć w środku pola `payment`:<br>`date` \- określa datę płatności w formacie `RRRR-MM-DD`<br>`account` \- określa typ rachunku. Dostępne wartości to `currency` (walutowy) oraz `pln` (w PLN)<br>`value_pln` \- wprowadza się go wyłącznie jeśli typ rachunku jest wybrany jako `pln`. Pole odpowiedzialne za kwotę wpłaty w PLN |
| **paymentmethod** | Odczyt i zapis | Każdy dokument | `cash` \- gotówka <br>`transfer` \- przelew <br>`compensation` \- kompensata <br>`cod` \- za pobraniem <br>`payment_card` \- kartą płatniczą |
| **paymentdate** | Odczyt i zapis | Każdy dokument | Termin płatności |
| **paymentstate** | Tylko do odczytu | Każdy dokument | Stan płatności: <br>`paid` \- rozliczony <br>`unpaid` \- nierozliczony <br>`undefined` \- nieokreślony |
| **disposaldate\_format** | Odczyt i zapis | Każdy dokument | Format daty sprzedaży na wydruku faktury: <br>`month` \- miesiąc sprzedaży <br>`day` \- dzień sprzedaży |
| **disposaldate\_empty** | Odczyt i zapis | Każdy dokument | Przy sprzedaży wysyłkowej nie jest znana data dostawy. W takim przypadku należy ustawić wartość `1``disaposaldate` i uzupełnić datę dostawy przy osobnej akcji rozliczenia dostawy (moduł `invoice_deliveries`). Opcja dotyczy sprzedaży po 1 stycznia 2014 roku. |
| **disposaldate** | Odczyt i zapis | Każdy dokument | Data sprzedaży |
| **date** | Odczyt i zapis | Każdy dokument | Data wystawienia faktury |
| **period** | Tylko do odczytu | Każdy dokument | Okres w którym dokument jest widoczny na liście |
| **total** | Tylko do odczytu | Każdy dokument | Kwota razem dokumentu sprzedaży bez uwzględnienia ewentualnych korekt |
| **total\_composed** | Tylko do odczytu | Każdy dokument | Kwota razem faktury z uwzględnieniem korekt |
| **alreadypaid** | Tylko do odczytu | Każdy dokument | Kwota zapłacono uwzględniająca wszystkie płatności |
| **alreadypaid\_initial** | Odczyt i zapis | Każdy dokument | Kwota zapłacono określona przy dodawaniu i modyfikowaniu faktury. Kwota jest widoczna na wydruku faktury. |
| **number** | Odczyt i zapis | Oprócz Inny przychód - sprzedaż, Inny przychód - sprzedaż (bez VAT) | Numer wstawiany w miejsce znacznika `[numer]` we wzorcu serii numeracji przy tworzeniu numeru faktury. Pole możliwe do edycji przy wyłączonej kontroli numeracji w zakładce Ustawienia / serie numeracji. |
| **day** | Odczyt i zapis | Oprócz Inny przychód - sprzedaż, Inny przychód - sprzedaż (bez VAT) | Dzień wstawiany w miejsce znacznika `[dzień]` we wzorcu serii numeracji przy tworzeniu numeru faktury. Pole możliwe do edycji przy wyłączonej kontroli numeracji w zakładce Ustawienia / serie numeracji. |
| **month** | Odczyt i zapis | Oprócz Inny przychód - sprzedaż, Inny przychód - sprzedaż (bez VAT) | Miesiąc wstawiany w miejsce znacznika `[miesiąc]` we wzorcu serii numeracji przy tworzeniu numeru faktury. Pole możliwe do edycji przy wyłączonej kontroli numeracji w zakładce Ustawienia / serie numeracji. |
| **year** | Odczyt i zapis | Oprócz Inny przychód - sprzedaż, Inny przychód - sprzedaż (bez VAT) | Rok wstawiany w miejsce znacznika `[rok]` we wzorcu serii numeracji przy tworzeniu numeru faktury. Pole możliwe do edycji przy wyłączonej kontroli numeracji w zakładce Ustawienia / serie numeracji. |
| **fullnumber** | Tylko do odczytu | Każdy dokument, Inny przychód (Odczyt i zapis) | Numer wygenerowany na podstawie wzorca serii numeracji oraz daty wystawienia lub pól określony powyżej. |
| **semitemplatenumber** | Tylko do odczytu | Oprócz Inny przychód - sprzedaż, Inny przychód - sprzedaż (bez VAT) | Częściowo wygenerowany numer. Pole wykorzystywane wewnętrznie do wygenerowania wartości `[number]` na podstawie wcześniejszych dokumentów z danej serii numeracji. |
| **type** | Odczyt i zapis | Każdy dokument | Typ dokumentu - `normal`, `proforma`, `offer`, `receipt_normal`, `receipt_fiscal_normal`, `income_normal`, `bill`, `proforma_bill`, `offer_bill`, `receipt_bill`, `receipt_fiscal_bill`, `income_bill` |
| **correction\_type** | Tylko do odczytu | Każdy dokument | Pole wykorzystywane wewnętrznie przy fakturach korygujących |
| **corrections** | Tylko do odczytu | Każdy dokument | Liczba korekt |
| **currency** | Odczyt i zapis | Każdy dokument | Waluta |
| **currency\_exchange** | Tylko do odczytu | Każdy dokument | Kurs księgowy faktury |
| **currency\_label** | Tylko do odczytu | Każdy dokument | Numer tabeli NBP kursu księgowego |
| **currency\_date** | Tylko do odczytu | Każdy dokument | Data opublikowania kursu |
| **price\_currency\_exchange** | Tylko do odczytu | Każdy dokument | Kurs stosowany przy przeliczaniu cen w panelu wfirmy |
| **good\_price\_group\_currency\_exchange** | Tylko do odczytu | Każdy dokument | Kurs grupy cenowej stosowany przy przeliczaniu cen w panelu wfirmy |
| **template** | Odczyt i zapis | Każdy dokument | Identyfikator szablonu wydruku dokumentu sprzedaży |
| **auto\_send** | Odczyt i zapis | Faktura VAT, Pro forma, Oferta, Dowód sprzedaży, Faktura (bez VAT), Pro forma (bez VAT), Oferta (bez VAT), Dowód sprzedaży (bez VAT) | Automatyczna wysyłka faktury na adres e-mail kontrahenta |
| **description** | Odczyt i zapis | Oprócz Inny przychód sprzedaż, Paragon fiskalny, Inny przychód sprzedaż (bez VAT), Paragon fiskalny (bez VAT) | Uwagi |
| **header** | Tylko do odczytu | Każdy dokument | Dodatkowe informacje w nagłówku faktury. Wartość określana automatycznie na podstawie ustawień. |
| **footer** | Tylko do odczytu | Każdy dokument | Dodatkowe informacje w stopce faktury. Wartość określana automatycznie na podstawie ustawień. |
| **user\_name** | Tylko do odczytu | Każdy dokument | Imię i nazwisko osoby upoważnionej do wystawienia faktury. Wartość określana automatycznie na podstawie ustawień. |
| **schema** | Odczyt i zapis | Faktura VAT, Faktura (bez VAT) | Schemat księgowy. W przypadku faktur dotyczących sprzedaży po 1 stycznia 2014 należy stosować schematy: <br>`normal` \- faktura księgowana do rejestru VAT w dacie sprzedaży, <br>`vat_invoice_date` \- faktura księgowana do rejestru VAT dacie wystawienia, <br>`vat_buyer_construction_service` \- faktura za usługi budowlane - odwrotne obciążenie, <br>`assessor` \- faktura za opinię biegłego (tylko do rejestru VAT metodą kasową), <br>`split_payment` \- Podzielona płatność |
| **schema\_bill** | Odczyt i zapis | Faktura VAT, Faktura (bez VAT) | Opcja faktura do paragonu |
| **schema\_cancelled** | Odczyt i zapis | Faktura VAT, Faktura (bez VAT) | Opcja faktura anulowana |
| **register\_description** | Odczyt i zapis | Każdy dokument | Domyślnie faktury i inne dokumenty są księgowane do ewidencji z opisem sprzedaż towarów i usług. Możliwe jest określenie własnego opisu. |
| **netto** | Tylko do odczytu | Każdy dokument | Wartość netto ogółem |
| **tax** | Tylko do odczytu | Każdy dokument | Wartość podatku ogółem |
| **signed** | Tylko do odczytu | Faktura VAT, Faktura (bez VAT) | Oznaczenie faktur podpisanych elektronicznie |
| **hash** | Tylko do odczytu | Faktura VAT, Faktura (bez VAT) | Hash zabezpieczający odsyłacz do faktury w panelu klienta |
| **id\_external** | Odczyt i zapis | Każdy dokument | Pole do zapisywania własnych wartości |
| **warehouse\_type** | Tylko do odczytu | Każdy dokument | Pole określa czy w trakcie wystawiania faktury był włączony moduł magazynowy (`extended`) czy katalog produktów (`simple`) |
| **notes** | Tylko do odczytu | Każdy dokument | Liczba notatek powiązanych z dokumentem sprzedaży |
| **documents** | Tylko do odczytu | Każdy dokument | Liczba dokumentów powiązanych z dokumentem sprzedaży |
| **tags** | Odczyt i zapis | Każdy dokument | Znaczniki powiązane z fakturą w formacie `(ID ZNACZNIKA X),(ID ZNACZNIKA Y)...` |
| **created** | Tylko do odczytu | Każdy dokument | Data i godzina utworzenia wpisu |
| **modified** | Tylko do odczytu | Każdy dokument | Data i godzina zmodyfikowania wpisu |
| **price\_type** | Odczyt i zapis | Każdy dokument | Rodzaj ceny - netto lub brutto |
| **series** | Odczyt i zapis | Każdy dokument | Id serii numeracji wprowadzone w polu `<id></id>` |

AUTHORIZATIONOAuth 2.0

This folder is using OAuth 2.0 from collection [wFirma.pl](https://doc.wfirma.pl/#auth-info-3854b824-3162-4c02-a47b-af2012073033)

### POSTinvoices/add

{{host}}/invoices/add?outputFormat=xml&inputFormat=xml&company\_id={{companyId}}

AUTHORIZATIONOAuth 2.0

This request is using OAuth 2.0 from collection [wFirma.pl](https://doc.wfirma.pl/#auth-info-3854b824-3162-4c02-a47b-af2012073033)

PARAMS

outputFormat

xml

Przyjmuje wartość json i xml

inputFormat

xml

Przyjmuje wartość json i xml

company\_id

{{companyId}}

Bodyraw (xml)

View More

xml

```xml
<?xml version="1.0" encoding="UTF-8"?>
<api>
    <invoices>
        <invoice>
            <contractor>
                <name>Testowy kontrahent</name>
                <zip>10-100</zip>
                <city>Wrocław</city>
            </contractor>
            <type>normal</type>
            <type_of_sale>WSTO_EE</type_of_sale>
            <invoicecontents>
                <invoicecontent>
                    <name>123123</name>
                    <count>1.0000</count>
                    <unit_count>1.0000</unit_count>
                    <price>9699.00</price>
                    <unit>szt.</unit>
                </invoicecontent>
            </invoicecontents>
        </invoice>
    </invoices>
</api>
```

Example Request

invoices/add

View More

curl

```curl
curl --location -g '{{host}}/invoices/add?outputFormat=xml&inputFormat=xml&company_id={{companyId}}' \
--data '<?xml version="1.0" encoding="UTF-8"?>
<api>
    <invoices>
        <invoice>
            <contractor>
                <name>Testowy kontrahent</name>
                <zip>10-100</zip>
                <city>Wrocław</city>
            </contractor>
            <type>normal</type>
            <type_of_sale>WSTO_EE</type_of_sale>
            <invoicecontents>
                <invoicecontent>
                    <name>123123</name>
                    <count>1.0000</count>
                    <unit_count>1.0000</unit_count>
                    <price>9699.00</price>
                    <unit>szt.</unit>
                </invoicecontent>
            </invoicecontents>
        </invoice>
    </invoices>
</api>'
```

Example Response

- Body
- Headers (0)

No response body

This request doesn't return any response body

No response headers

This request doesn't return any response headers

### GETinvoices/find

{{host}}/invoices/find?outputFormat=xml&inputFormat=xml&company\_id={{companyId}}

AUTHORIZATIONOAuth 2.0

This request is using OAuth 2.0 from collection [wFirma.pl](https://doc.wfirma.pl/#auth-info-3854b824-3162-4c02-a47b-af2012073033)

PARAMS

outputFormat

xml

Przyjmuje wartość json i xml

inputFormat

xml

Przyjmuje wartość json i xml

company\_id

{{companyId}}

Bodyraw (xml)

View More

xml

```xml
<?xml version="1.0" encoding="UTF-8"?>
<api>
    <invoices>
        <parameters>
            <order>
                <desc>Invoice.id</desc>
            </order>
            <fields>
                <field>Invoice.id</field>
            </fields>
            <conditions>
                <condition>
                    <field>type</field>
                    <operator>eq</operator>
                    <value>normal</value>
                </condition>
            </conditions>
            <page>1</page>
            <limit>5</limit>
        </parameters>
    </invoices>
</api>
```

Example Request

invoices/find

View More

curl

```curl
curl --location -g --request GET '{{host}}/invoices/find?outputFormat=xml&inputFormat=xml&company_id={{companyId}}' \
--data '<?xml version="1.0" encoding="UTF-8"?>
<api>
    <invoices>
        <parameters>
            <order>
                <desc>Invoice.id</desc>
            </order>
            <fields>
                <field>Invoice.id</field>
            </fields>
            <conditions>
                <condition>
                    <field>type</field>
                    <operator>eq</operator>
                    <value>normal</value>
                </condition>
            </conditions>
            <page>1</page>
            <limit>5</limit>
        </parameters>
    </invoices>
</api>'
```

Example Response

- Body
- Headers (0)

No response body

This request doesn't return any response body

No response headers

This request doesn't return any response headers

### GETinvoices/get

{{host}}/invoices/get/{{invoiceId}}?outputFormat=xml&inputFormat=xml&company\_id={{companyId}}

AUTHORIZATIONOAuth 2.0

This request is using OAuth 2.0 from collection [wFirma.pl](https://doc.wfirma.pl/#auth-info-3854b824-3162-4c02-a47b-af2012073033)

PARAMS

outputFormat

xml

Przyjmuje wartość json i xml

inputFormat

xml

Przyjmuje wartość json i xml

company\_id

{{companyId}}

Example Request

invoices/get

View More

curl

```curl
curl --location -g '{{host}}/invoices/get/{{invoiceId}}?outputFormat=xml&inputFormat=xml&company_id={{companyId}}' \
--data ''
```

Example Response

- Body
- Headers (0)

No response body

This request doesn't return any response body

No response headers

This request doesn't return any response headers

### POSTinvoices/download

{{host}}/invoices/download/{{invoiceId}}?outputFormat=xml&inputFormat=xml&company\_id={{companyId}}

AUTHORIZATIONOAuth 2.0

This request is using OAuth 2.0 from collection [wFirma.pl](https://doc.wfirma.pl/#auth-info-3854b824-3162-4c02-a47b-af2012073033)

PARAMS

outputFormat

xml

Przyjmuje wartość json i xml

inputFormat

xml

Przyjmuje wartość json i xml

company\_id

{{companyId}}

Bodyraw (xml)

View More

xml

```xml
<?xml version="1.0" encoding="UTF-8"?>
<api>
    <invoices>
        <parameters>
            <parameter>
                <name>page</name>
                <value>all</value>
            </parameter>

            <parameter>
                <name>address</name>
                <value>0</value>
            </parameter>

            <parameter>
                <name>leaflet</name>
                <value>0</value>
            </parameter>

            <parameter>
                <name>duplicate</name>
                <value>0</value>
            </parameter>

            <parameter>
                <name>payment_cashbox_documents</name>
                <value>0</value>
            </parameter>

            <parameter>
                <name>warehouse_documents</name>
                <value>0</value>
            </parameter>
        </parameters>
    </invoices>
</api>
```

Example Request

invoices/download

View More

curl

```curl
curl --location -g '{{host}}/invoices/download/{{invoiceId}}?outputFormat=xml&inputFormat=xml&company_id={{companyId}}' \
--data '<?xml version="1.0" encoding="UTF-8"?>
<api>
    <invoices>
        <parameters>
            <parameter>
                <name>page</name>
                <value>all</value>
            </parameter>

            <parameter>
                <name>address</name>
                <value>0</value>
            </parameter>

            <parameter>
                <name>leaflet</name>
                <value>0</value>
            </parameter>

            <parameter>
                <name>duplicate</name>
                <value>0</value>
            </parameter>

            <parameter>
                <name>payment_cashbox_documents</name>
                <value>0</value>
            </parameter>

            <parameter>
                <name>warehouse_documents</name>
                <value>0</value>
            </parameter>
        </parameters>
    </invoices>
</api>'
```

Example Response

- Body
- Headers (0)

No response body

This request doesn't return any response body

No response headers

This request doesn't return any response headers

### GETinvoices/fiscalize

{{host}}/invoices/fiscalize/{{invoiceId}}?outputFormat=xml&inputFormat=xml&company\_id={{companyId}}

AUTHORIZATIONOAuth 2.0

This request is using OAuth 2.0 from collection [wFirma.pl](https://doc.wfirma.pl/#auth-info-3854b824-3162-4c02-a47b-af2012073033)

PARAMS

outputFormat

xml

Przyjmuje wartość json i xml

inputFormat

xml

Przyjmuje wartość json i xml

company\_id

{{companyId}}

Example Request

invoices/fiscalize

View More

curl

```curl
curl --location -g '{{host}}/invoices/fiscalize/{{invoiceId}}?outputFormat=xml&inputFormat=xml&company_id={{companyId}}' \
--data ''
```

Example Response

- Body
- Headers (0)

No response body

This request doesn't return any response body

No response headers

This request doesn't return any response headers

### GETinvoices/unfiscalize

{{host}}/invoices/unfiscalize/{{invoiceId}}?outputFormat=xml&inputFormat=xml&company\_id={{companyId}}

AUTHORIZATIONOAuth 2.0

This request is using OAuth 2.0 from collection [wFirma.pl](https://doc.wfirma.pl/#auth-info-3854b824-3162-4c02-a47b-af2012073033)

PARAMS

outputFormat

xml

Przyjmuje wartość json i xml

inputFormat

xml

Przyjmuje wartość json i xml

company\_id

{{companyId}}

Example Request

invoices/unfiscalize

View More

curl

```curl
curl --location -g '{{host}}/invoices/unfiscalize/{{invoiceId}}?outputFormat=xml&inputFormat=xml&company_id={{companyId}}' \
--data ''
```

Example Response

- Body
- Headers (0)

No response body

This request doesn't return any response body

No response headers

This request doesn't return any response headers

### POSTinvoices/send

{{host}}/invoices/send/{{invoiceId}}?outputFormat=xml&inputFormat=xml&company\_id={{companyId}}

AUTHORIZATIONOAuth 2.0

This request is using OAuth 2.0 from collection [wFirma.pl](https://doc.wfirma.pl/#auth-info-3854b824-3162-4c02-a47b-af2012073033)

PARAMS

outputFormat

xml

Przyjmuje wartość json i xml

inputFormat

xml

Przyjmuje wartość json i xml

company\_id

{{companyId}}

Bodyraw (xml)

View More

xml

```xml
<?xml version="1.0" encoding="UTF-8"?>
<api>
    <invoices>
        <parameters>
            <!-- parametr opcjonalny - w przypadku jego braku adres pobierany jest z rekordu kontrahenta -->
            <parameter>
                <name>email</name>
                <value>odbiorca@adresmailowy123.pl</value>
            </parameter>
            <parameter>
                <name>subject</name>
                <value>Otrzymałeś fakturę</value>
            </parameter>
            <parameter>
                <name>page</name>
                <value>invoice</value>
            </parameter>
            <parameter>
                <name>leaflet</name>
                <value>0</value>
            </parameter>
            <parameter>
                <name>duplicate</name>
                <value>0</value>
            </parameter>
            <parameter>
                <name>body</name>
                <value>Przesyłam fakturę</value>
            </parameter>
        </parameters>
    </invoices>
</api>
```

Example Request

invoices/send

View More

curl

```curl
curl --location -g '{{host}}/invoices/send/{{invoiceId}}?outputFormat=xml&inputFormat=xml&company_id={{companyId}}' \
--data-raw '<?xml version="1.0" encoding="UTF-8"?>
<api>
    <invoices>
        <parameters>
            <!-- parametr opcjonalny - w przypadku jego braku adres pobierany jest z rekordu kontrahenta -->
            <parameter>
                <name>email</name>
                <value>odbiorca@adresmailowy123.pl</value>
            </parameter>
            <parameter>
                <name>subject</name>
                <value>Otrzymałeś fakturę</value>
            </parameter>
            <parameter>
                <name>page</name>
                <value>invoice</value>
            </parameter>
            <parameter>
                <name>leaflet</name>
                <value>0</value>
            </parameter>
            <parameter>
                <name>duplicate</name>
                <value>0</value>
            </parameter>
            <parameter>
                <name>body</name>
                <value>Przesyłam fakturę</value>
            </parameter>
        </parameters>
    </invoices>
</api>'
```

Example Response

- Body
- Headers (0)

No response body

This request doesn't return any response body

No response headers

This request doesn't return any response headers

### POSTinvoices/edit

{{host}}/invoices/edit/{{invoiceId}}?outputFormat=xml&inputFormat=xml&company\_id={{companyId}}

AUTHORIZATIONOAuth 2.0

This request is using OAuth 2.0 from collection [wFirma.pl](https://doc.wfirma.pl/#auth-info-3854b824-3162-4c02-a47b-af2012073033)

PARAMS

outputFormat

xml

Przyjmuje wartość json i xml

inputFormat

xml

Przyjmuje wartość json i xml

company\_id

{{companyId}}

Example Request

invoices/edit

View More

curl

```curl
curl --location -g --request POST '{{host}}/invoices/edit/{{invoiceId}}?outputFormat=xml&inputFormat=xml&company_id={{companyId}}' \
--data ''
```

Example Response

- Body
- Headers (0)

No response body

This request doesn't return any response body

No response headers

This request doesn't return any response headers

### DELETEinvoices/delete

{{host}}/invoices/delete/{{invoiceId}}?outputFormat=xml&inputFormat=xml&company\_id={{companyId}}

AUTHORIZATIONOAuth 2.0

This request is using OAuth 2.0 from collection [wFirma.pl](https://doc.wfirma.pl/#auth-info-3854b824-3162-4c02-a47b-af2012073033)

PARAMS

outputFormat

xml

Przyjmuje wartość json i xml

inputFormat

xml

Przyjmuje wartość json i xml

company\_id

{{companyId}}

Example Request

invoices/delete

View More

curl

```curl
curl --location -g --request DELETE '{{host}}/invoices/delete/{{invoiceId}}?outputFormat=xml&inputFormat=xml&company_id={{companyId}}' \
--data ''
```

Example Response

- Body
- Headers (0)

No response body

This request doesn't return any response body

No response headers

This request doesn't return any response headers

### GETereceipt\_integration\_receipt

{{host}}/invoices/add?outputFormat=xml&inputFormat=xml&company\_id={{companyId}}

## Wysyłka wiadomości z paragonem z eparagony.pl

W systemie wFirma istnieje możliwość integracji z eparagony.pl, która jest szerzej opisana w naszym [artykule pomocy](https://pomoc.wfirma.pl/-integracja-z-eparagony).

Po zintegrowaniu z eparagony, w zakładce **USTWAIENIA>>INTEGRACJE>>EPARAGONY.PL>>INTEGRACJA PRZY UŻYCIU API** będzie widniała opcja **Automatyczne fiskalizowanie w eparagony**. Po zaznaczeniu wspomnianej opcji wyświetli się dodatkowa opcja **Automatyczne wysyłanie eparagonu do klienta**. Po jej zaznaczeniu i zapisaniu ustawień, paragony fiskalne wysyłane przez API zostaną automatycznie wysłane do fiskalizacji i w przypadku poprawnej fiskalizacji, zostaną automatycznie wysłane do kontrahenta.

W przypadku jeśli kontrahent posiada domyślnie przypisany adres e-mail w CRM, paragon fiskalny stworzony poprzez API zostanie automatycznie wysłany na dany adres bądź adresy e-mail (w przypadku większej ilości adresów wprowadzonych po przecinku).

W przypadku jeśli kontrahent nie posiada przypisanego adresu e-mail w CRM, paragon fiskalny nie posiada wprowadzonego kontrahenta, takowy adres możemy zdefiniować w samym body zapytania dodając:

Plain Text

```plain
<ereceipt_integration_receipt>
    <email_to_auto_send>przykładowy.email@domain.com</email_to_auto_send>
</ereceipt_integration_receipt>
```

**UWAGA**
W przypadku jeśli zdefinujemy dany adres e-mail według powyższego sposobu w body samego zapytania,ewentualne adresy e-mail wprowadzone dla kontrahenta w CRM, podczas wysyłki zostaną zignorowane.

AUTHORIZATIONOAuth 2.0

This request is using OAuth 2.0 from collection [wFirma.pl](https://doc.wfirma.pl/#auth-info-3854b824-3162-4c02-a47b-af2012073033)

PARAMS

outputFormat

xml

Przyjmuje wartość json i xml

inputFormat

xml

Przyjmuje wartość json i xml

company\_id

{{companyId}}

Bodyraw (xml)

View More

xml

```xml
<?xml version="1.0" encoding="UTF-8"?>
<api>
    <invoices>
        <invoice>
            <contractor>
                <name>Testowy kontrahent</name>
                <zip>10-100</zip>
                <city>Wrocław</city>
            </contractor>
            <type>receipt_fiscal_normal</type>
            <ereceipt_integration_receipt>
                <email_to_auto_send>przykładowy.email@domain.com</email_to_auto_send>
            </ereceipt_integration_receipt>
            <invoicecontents>
                <invoicecontent>
                    <name>123123</name>
                    <count>1.0000</count>
                    <unit_count>1.0000</unit_count>
                    <price>9699.00</price>
                    <unit>szt.</unit>
                </invoicecontent>
            </invoicecontents>
        </invoice>
    </invoices>
</api>
```

Example Request

ereceipt\_integration\_receipt

View More

curl

```curl
curl --location -g --request GET '{{host}}/invoices/add?outputFormat=xml&inputFormat=xml&company_id={{companyId}}' \
--data-raw '<?xml version="1.0" encoding="UTF-8"?>
<api>
    <invoices>
        <invoice>
            <contractor>
                <name>Testowy kontrahent</name>
                <zip>10-100</zip>
                <city>Wrocław</city>
            </contractor>
            <type>receipt_fiscal_normal</type>
            <ereceipt_integration_receipt>
                <email_to_auto_send>przykładowy.email@domain.com</email_to_auto_send>
            </ereceipt_integration_receipt>
            <invoicecontents>
                <invoicecontent>
                    <name>123123</name>
                    <count>1.0000</count>
                    <unit_count>1.0000</unit_count>
                    <price>9699.00</price>
                    <unit>szt.</unit>
                </invoicecontent>
            </invoicecontents>
        </invoice>
    </invoices>
</api>'
```

Example Response

- Body
- Headers (0)

No response body

This request doesn't return any response body

No response headers

This request doesn't return any response headers

## invoicecontents

## Pola

View More

| **Nazwa pola** | **Przeznaczenie** | **Opis** |
| --- | --- | --- |
| `id` | `Tylko do odczytu` | Klucz główny |
| `name` | `Odczyt i zapis` | Nazwa towaru lub usługi |
| `classification` | `Odczyt i zapis` | PKWiU |
| `unit` | `Odczyt i zapis` | Jednostka |
| `count` | `Odczyt i zapis` | Ilość |
| `price` | `Odczyt i zapis` | Cena netto lub brutto w zależności od wartości w polu `price_type` faktury |
| `discount` | `Odczyt i zapis` | W przypadku potrzeby zastosowania rabatu należy ustawić wartość `1` |
| `discount_percent` | `Odczyt i zapis` | Procent rabatu dla `50%` należy wprowadzić wartość `50` |
| `netto` | `Tylko do odczytu` | Wartość netto pozycji |
| `brutto` | `Tylko do odczytu` | Wartość brutto pozycji |
| `vat` | `Odczyt i zapis` | Stawka VAT - pole dopuszczalne tylko w przypadku polskich stawek VAT (`23`, `WDT` itp). W przypadku stawek MOSS należy obligatoryjnie stosować strukturę `<vat_code></id>Tutaj id stawki</id></vat_code>`. Lista stawek dostępna jest w akcji /vat\_codes/find. |
| `lumpcode` | `Odczyt i zapis` | Stawka ryczałtu - pole obowiązkowe w przypadku prowadzenia Ewidencji Przychodów |
| `created` | `Tylko do odczytu` | Data i godzina utworzenia wpisu |
| `modified` | `Tylko do odczytu` | Data i godzina zmodyfikowania wpisu |

AUTHORIZATIONOAuth 2.0

This folder is using OAuth 2.0 from collection [wFirma.pl](https://doc.wfirma.pl/#auth-info-3854b824-3162-4c02-a47b-af2012073033)

## vat\_moss\_detail

## Pola

| **Nazwa pola** | **Przeznaczenie** | **Opis** |
| --- | --- | --- |
| `type` | `Tylko zapis` | Określenie rodzaju sprzedaży VAT OSS. Dopuszczalne wartości to `WO`, `SA`, `SB`, `SC`, `SD`, `SE`, `TA`, `TB`, `TC`, `TD`, `TE`, `TF`, `TG`, `TH`, `TJ`, `TK`, `BA`, `BB`. |
| `evidence1_type` | `Tylko zapis` | Dowód numer 1 potwierdzający kraj nabywcy dla celów VAT OSS. Dopuszczalne wartości to `A`, `B`, `C`, `D`, `E`, `F`. |
| `evidence2_type` | `Tylko zapis` | Dowód numer 2 potwierdzający kraj nabywcy dla celów VAT OSS. Dopuszczalne wartości to `A`, `B`, `C`, `D`, `E`, `F`. |
| `evidence1_description` | `Tylko zapis` | Szczegółowe informacje odnośnie dowodu numer 1 |
| `evidence2_description` | `Tylko zapis` | Szczegółowe informacje odnośnie dowodu numer 2 |

AUTHORIZATIONOAuth 2.0

This folder is using OAuth 2.0 from collection [wFirma.pl](https://doc.wfirma.pl/#auth-info-3854b824-3162-4c02-a47b-af2012073033)

## invoice\_ledger

##### Akcje

- **add** \- dodawanie faktury z dekretacją

##### Powiązane moduły

- **companies** (skrócony, pojedynczy)
- **company\_accounts** (skrócony, pojedynczy)
- **company\_details** (pełny, pojedynczy)
- **contractors** (skrócony, pojedynczy)
- **contractor\_details** (pełny, pojedynczy)
- **contractor\_receiver\_details** (pełny, pojedynczy)
- **emails** (skrócony, pojedynczy) - pod gałęzią **email**
- **emails** (skrócony, pojedynczy) - pod gałęzią **email2**
- **expenses** (skrócony, pojedynczy)
- **invoices** (skrócony, pojedynczy) - pod gałęzią **parent**
- **invoices** (skrócony, pojedynczy) - pod gałęzią **order**
- **invoicecontents** (pełny, mnogi)
- **ledger\_operation\_schemas** (skrócony, pojedynczy)
- **payments** (skrócony, pojedynczy)
- **payment\_cashboxes** (skrócony, pojedynczy)
- **postivo\_shipments** (skrócony, pojedynczy)
- **postivo\_shipment\_contents** (skrócony, pojedynczy)
- **series** (skrócony, pojedynczy)
- **translation\_languages** (skrócony, pojedynczy)
- **vat\_contents** (pełny, mnogi)
- **vat\_moss\_details** (pełny, pojedynczy)

##### Rodzaje dokumentów

| **Dokumenty płatnika VAT** | **Znacznik** |
| --- | --- |
| Faktura VAT | `normal` |

| **Dokumenty nievatowca** | **Znacznik** |
| --- | --- |
| Faktura (bez VAT) | `bill` |

##### Pola

View More

| **Nazwa Pola** | **Przeznaczenie** | **Typ dokumentu** | **Opis** |
| --- | --- | --- | --- |
| **id** | Tylko do odczytu | Każdy dokument | Klucz główny |
| **paymentmethod** | Odczyt i zapis | Każdy dokument | `cash` \- gotówka <br>`transfer` \- przelew <br>`compensation` \- kompensata <br>`cod` \- za pobraniem <br>`payment_card` \- kartą płatniczą |
| **payment\_date** | Odczyt i zapis | Każdy dokument | Termin płatności |
| **paymentstate** | Odczyt i zapis | Każdy dokument | Stan płatności: <br>`paid` \- rozliczony <br>`unpaid` \- nierozliczony <br>`undefined` \- nieokreślony |
| **disposaldate\_format** | Odczyt i zapis | Każdy dokument | Format daty sprzedaży na wydruku faktury: <br>`month` \- miesiąc sprzedaży <br>`day` \- dzień sprzedaży |
| **disposaldate\_empty** | Odczyt i zapis | Każdy dokument | Przy sprzedaży wysyłkowej nie jest znana data dostawy. W takim przypadku należy ustawić wartość `1``disaposaldate` i uzupełnić datę dostawy przy osobnej akcji rozliczenia dostawy (moduł `invoice_deliveries`). Opcja dotyczy sprzedaży po 1 stycznia 2014 roku. |
| **disposaldate** | Odczyt i zapis | Każdy dokument | Data sprzedaży |
| **date** | Odczyt i zapis | Każdy dokument | Data wystawienia faktury |
| **period** | Tylko do odczytu | Każdy dokument | Okres w którym dokument jest widoczny na liście |
| **total** | Tylko do odczytu | Każdy dokument | Kwota razem dokumentu sprzedaży bez uwzględnienia ewentualnych korekt |
| **total\_composed** | Tylko do odczytu | Każdy dokument | Kwota razem faktury z uwzględnieniem korekt |
| **alreadypaid** | Tylko do odczytu | Każdy dokument | Kwota zapłacono uwzględniająca wszystkie płatności |
| **alreadypaid\_initial** | Odczyt i zapis | Każdy dokument | Kwota zapłacono określona przy dodawaniu i modyfikowaniu faktury. Kwota jest widoczna na wydruku faktury. |
| **number** | Odczyt i zapis | Każdy dokument | Numer wstawiany w miejsce znacznika `[numer]` we wzorcu serii numeracji przy tworzeniu numeru faktury. Pole możliwe do edycji przy wyłączonej kontroli numeracji w zakładce Ustawienia / serie numeracji. |
| **day** | Odczyt i zapis | Każdy dokument | Dzień wstawiany w miejsce znacznika `[dzień]` we wzorcu serii numeracji przy tworzeniu numeru faktury. Pole możliwe do edycji przy wyłączonej kontroli numeracji w zakładce Ustawienia / serie numeracji. |
| **month** | Odczyt i zapis | Każdy dokument | Miesiąc wstawiany w miejsce znacznika `[miesiąc]` we wzorcu serii numeracji przy tworzeniu numeru faktury. Pole możliwe do edycji przy wyłączonej kontroli numeracji w zakładce Ustawienia / serie numeracji. |
| **year** | Odczyt i zapis | Każdy dokument | Rok wstawiany w miejsce znacznika `[rok]` we wzorcu serii numeracji przy tworzeniu numeru faktury. Pole możliwe do edycji przy wyłączonej kontroli numeracji w zakładce Ustawienia / serie numeracji. |
| **fullnumber** | Tylko do odczytu | Każdy dokument | Numer wygenerowany na podstawie wzorca serii numeracji oraz daty wystawienia lub pól określony powyżej. |
| **semitemplatenumber** | Tylko do odczytu | Każdy dokument | Częściowo wygenerowany numer. Pole wykorzystywane wewnętrznie do wygenerowania wartości `[number]` na podstawie wcześniejszych dokumentów z danej serii numeracji. |
| **type** | Odczyt i zapis | Każdy dokument | Typ dokumentu - `normal` |
| **correction\_type** | Tylko do odczytu | Każdy dokument | Pole wykorzystywane wewnętrznie przy fakturach korygujących |
| **corrections** | Tylko do odczytu | Każdy dokument | Liczba korekt |
| **currency** | Odczyt i zapis | Każdy dokument | Waluta |
| **currency\_exchange** | Tylko do odczytu | Każdy dokument | Kurs księgowy faktury |
| **currency\_label** | Tylko do odczytu | Każdy dokument | Numer tabeli NBP kursu księgowego |
| **currency\_date** | Tylko do odczytu | Każdy dokument | Data opublikowania kursu |
| **price\_currency\_exchange** | Tylko do odczytu | Każdy dokument | Kurs stosowany przy przeliczaniu cen w panelu wfirmy |
| **good\_price\_group\_currency\_exchange** | Tylko do odczytu | Każdy dokument | Kurs grupy cenowej stosowany przy przeliczaniu cen w panelu wfirmy |
| **template** | Odczyt i zapis | Każdy dokument | Identyfikator szablonu wydruku dokumentu sprzedaży |
| **auto\_send** | Odczyt i zapis | Każdy dokument | Automatyczna wysyłka faktury na adres e-mail kontrahenta |
| **description** | Odczyt i zapis | Każdy dokument | Uwagi |
| **header** | Tylko do odczytu | Każdy dokument | Dodatkowe informacje w nagłówku faktury. Wartość określana automatycznie na podstawie ustawień. |
| **footer** | Tylko do odczytu | Każdy dokument | Dodatkowe informacje w stopce faktury. Wartość określana automatycznie na podstawie ustawień. |
| **user\_name** | Tylko do odczytu | Każdy dokument | Imię i nazwisko osoby upoważnionej do wystawienia faktury. Wartość określana automatycznie na podstawie ustawień. |
| **schema\_cancelled** | Odczyt i zapis | Każdy dokument | Opcja faktura anulowana |
| **register\_description** | Odczyt i zapis | Każdy dokument | Domyślnie faktury i inne dokumenty są księgowane do ewidencji z opisem sprzedaż towarów i usług. Możliwe jest określenie własnego opisu. |
| **netto** | Tylko do odczytu | Każdy dokument | Wartość netto ogółem |
| **tax** | Tylko do odczytu | Każdy dokument | Wartość podatku ogółem |
| **signed** | Tylko do odczytu | Każdy dokument | Oznaczenie faktur podpisanych elektronicznie |
| **hash** | Tylko do odczytu | Każdy dokument | Hash zabezpieczający odsyłacz do faktury w panelu klienta |
| **id\_external** | Odczyt i zapis | Każdy dokument | Pole do zapisywania własnych wartości |
| **warehouse\_type** | Tylko do odczytu | Każdy dokument | Pole określa czy w trakcie wystawiania faktury był włączony moduł magazynowy (`extended`) czy katalog produktów (`simple`) |
| **notes** | Tylko do odczytu | Każdy dokument | Liczba notatek powiązanych z dokumentem sprzedaży |
| **documents** | Tylko do odczytu | Każdy dokument | Liczba dokumentów powiązanych z dokumentem sprzedaży |
| **tags** | Odczyt i zapis | Każdy dokument | Znaczniki powiązane z fakturą w formacie `(ID ZNACZNIKA X),(ID ZNACZNIKA Y)...` |
| **created** | Tylko do odczytu | Każdy dokument | Data i godzina utworzenia wpisu |
| **modified** | Tylko do odczytu | Każdy dokument | Data i godzina zmodyfikowania wpisu |
| **price\_type** | Odczyt i zapis | Każdy dokument | Rodzaj ceny - netto lub brutto |
| **ledger\_operation\_schema\_id** | Odczyt i zapis | Każdy dokument | Klucz główny wybranego schematu księgowego |

AUTHORIZATIONOAuth 2.0

This folder is using OAuth 2.0 from collection [wFirma.pl](https://doc.wfirma.pl/#auth-info-3854b824-3162-4c02-a47b-af2012073033)

### POSTinvoices/add

{{host}}/invoices/add?outputFormat=xml&inputFormat=xml&company\_id={{companyId}}

AUTHORIZATIONOAuth 2.0

This request is using OAuth 2.0 from collection [wFirma.pl](https://doc.wfirma.pl/#auth-info-3854b824-3162-4c02-a47b-af2012073033)

PARAMS

outputFormat

xml

Przyjmuje wartość json i xml

inputFormat

xml

Przyjmuje wartość json i xml

company\_id

{{companyId}}

Bodyraw (xml)

View More

xml

```xml
<?xml version="1.0" encoding="UTF-8"?>
<api>
    <invoices>
        <invoice>
            <contractor>
                <id>1111111</id>
                <name>Testowy kontrahent</name>
                <zip>10-100</zip>
                <city>Wrocław</city>
            </contractor>
            <type>normal</type>
            <ledger_operation_schema_id>111111</ledger_operation_schema_id>
            <invoicecontents>
                <invoicecontent>
                    <name>123123</name>
                    <count>1.0000</count>
                    <unit_count>1.0000</unit_count>
                    <price>9699.00</price>
                    <unit>szt.</unit>
                </invoicecontent>
            </invoicecontents>
        </invoice>
    </invoices>
</api>
```

Example Request

invoices/add

View More

curl

```curl
curl --location -g '{{host}}/invoices/add?outputFormat=xml&inputFormat=xml&company_id={{companyId}}' \
--data '<?xml version="1.0" encoding="UTF-8"?>
<api>
    <invoices>
        <invoice>
            <contractor>
                <id>1111111</id>
                <name>Testowy kontrahent</name>
                <zip>10-100</zip>
                <city>Wrocław</city>
            </contractor>
            <type>normal</type>
            <ledger_operation_schema_id>111111</ledger_operation_schema_id>
            <invoicecontents>
                <invoicecontent>
                    <name>123123</name>
                    <count>1.0000</count>
                    <unit_count>1.0000</unit_count>
                    <price>9699.00</price>
                    <unit>szt.</unit>
                </invoicecontent>
            </invoicecontents>
        </invoice>
    </invoices>
</api>'
```

Example Response

- Body
- Headers (0)

No response body

This request doesn't return any response body

No response headers

This request doesn't return any response headers

### GETinvoices/find

{{host}}/invoices/find?outputFormat=xml&inputFormat=xml&company\_id={{companyId}}

AUTHORIZATIONOAuth 2.0

This request is using OAuth 2.0 from collection [wFirma.pl](https://doc.wfirma.pl/#auth-info-3854b824-3162-4c02-a47b-af2012073033)

PARAMS

outputFormat

xml

Przyjmuje wartość json i xml

inputFormat

xml

Przyjmuje wartość json i xml

company\_id

{{companyId}}

Bodyraw (xml)

View More

xml

```xml
<?xml version="1.0" encoding="UTF-8"?>
<api>
    <invoices>
        <parameters>
            <order>
                <desc>Invoice.id</desc>
            </order>
            <fields>
                <field>Invoice.id</field>
            </fields>
            <conditions>
                <condition>
                    <field>type</field>
                    <operator>eq</operator>
                    <value>normal</value>
                </condition>
            </conditions>
            <page>1</page>
            <limit>5</limit>
        </parameters>
    </invoices>
</api>
```

Example Request

invoices/find

View More

curl

```curl
curl --location -g --request GET '{{host}}/invoices/find?outputFormat=xml&inputFormat=xml&company_id={{companyId}}' \
--data '<?xml version="1.0" encoding="UTF-8"?>
<api>
    <invoices>
        <parameters>
            <order>
                <desc>Invoice.id</desc>
            </order>
            <fields>
                <field>Invoice.id</field>
            </fields>
            <conditions>
                <condition>
                    <field>type</field>
                    <operator>eq</operator>
                    <value>normal</value>
                </condition>
            </conditions>
            <page>1</page>
            <limit>5</limit>
        </parameters>
    </invoices>
</api>'
```

Example Response

- Body
- Headers (0)

No response body

This request doesn't return any response body

No response headers

This request doesn't return any response headers

### GETinvoices/get

{{host}}/invoices/get/{{invoiceId}}?outputFormat=xml&inputFormat=xml&company\_id={{companyId}}

AUTHORIZATIONOAuth 2.0

This request is using OAuth 2.0 from collection [wFirma.pl](https://doc.wfirma.pl/#auth-info-3854b824-3162-4c02-a47b-af2012073033)

PARAMS

outputFormat

xml

Przyjmuje wartość json i xml

inputFormat

xml

Przyjmuje wartość json i xml

company\_id

{{companyId}}

Example Request

invoices/get

View More

curl

```curl
curl --location -g '{{host}}/invoices/get/{{invoiceId}}?outputFormat=xml&inputFormat=xml&company_id={{companyId}}' \
--data ''
```

Example Response

- Body
- Headers (0)

No response body

This request doesn't return any response body

No response headers

This request doesn't return any response headers

### POSTinvoices/download

{{host}}/invoices/download/{{invoiceId}}?outputFormat=xml&inputFormat=xml&company\_id={{companyId}}

AUTHORIZATIONOAuth 2.0

This request is using OAuth 2.0 from collection [wFirma.pl](https://doc.wfirma.pl/#auth-info-3854b824-3162-4c02-a47b-af2012073033)

PARAMS

outputFormat

xml

Przyjmuje wartość json i xml

inputFormat

xml

Przyjmuje wartość json i xml

company\_id

{{companyId}}

Bodyraw (xml)

View More

xml

```xml
<?xml version="1.0" encoding="UTF-8"?>
<api>
    <invoices>
        <parameters>
            <parameter>
                <name>page</name>
                <value>all</value>
            </parameter>

            <parameter>
                <name>address</name>
                <value>0</value>
            </parameter>

            <parameter>
                <name>leaflet</name>
                <value>0</value>
            </parameter>

            <parameter>
                <name>duplicate</name>
                <value>0</value>
            </parameter>

            <parameter>
                <name>payment_cashbox_documents</name>
                <value>0</value>
            </parameter>

            <parameter>
                <name>warehouse_documents</name>
                <value>0</value>
            </parameter>
        </parameters>
    </invoices>
</api>
```

Example Request

invoices/download

View More

curl

```curl
curl --location -g '{{host}}/invoices/download/{{invoiceId}}?outputFormat=xml&inputFormat=xml&company_id={{companyId}}' \
--data '<?xml version="1.0" encoding="UTF-8"?>
<api>
    <invoices>
        <parameters>
            <parameter>
                <name>page</name>
                <value>all</value>
            </parameter>

            <parameter>
                <name>address</name>
                <value>0</value>
            </parameter>

            <parameter>
                <name>leaflet</name>
                <value>0</value>
            </parameter>

            <parameter>
                <name>duplicate</name>
                <value>0</value>
            </parameter>

            <parameter>
                <name>payment_cashbox_documents</name>
                <value>0</value>
            </parameter>

            <parameter>
                <name>warehouse_documents</name>
                <value>0</value>
            </parameter>
        </parameters>
    </invoices>
</api>'
```

Example Response

- Body
- Headers (0)

No response body

This request doesn't return any response body

No response headers

This request doesn't return any response headers

### POSTinvoices/send

{{host}}/invoices/send/{{invoiceId}}?outputFormat=xml&inputFormat=xml&company\_id={{companyId}}

AUTHORIZATIONOAuth 2.0

This request is using OAuth 2.0 from collection [wFirma.pl](https://doc.wfirma.pl/#auth-info-3854b824-3162-4c02-a47b-af2012073033)

PARAMS

outputFormat

xml

Przyjmuje wartość json i xml

inputFormat

xml

Przyjmuje wartość json i xml

company\_id

{{companyId}}

Bodyraw (xml)

View More

xml

```xml
<?xml version="1.0" encoding="UTF-8"?>
<api>
    <invoices>
        <parameters>
            <!-- parametr opcjonalny - w przypadku jego braku adres pobierany jest z rekordu kontrahenta -->
            <parameter>
                <name>email</name>
                <value>odbiorca@adresmailowy123.pl</value>
            </parameter>
            <parameter>
                <name>subject</name>
                <value>Otrzymałeś fakturę</value>
            </parameter>
            <parameter>
                <name>page</name>
                <value>invoice</value>
            </parameter>
            <parameter>
                <name>leaflet</name>
                <value>0</value>
            </parameter>
            <parameter>
                <name>duplicate</name>
                <value>0</value>
            </parameter>
            <parameter>
                <name>body</name>
                <value>Przesyłam fakturę</value>
            </parameter>
        </parameters>
    </invoices>
</api>
```

Example Request

invoices/send

View More

curl

```curl
curl --location -g '{{host}}/invoices/send/{{invoiceId}}?outputFormat=xml&inputFormat=xml&company_id={{companyId}}' \
--data-raw '<?xml version="1.0" encoding="UTF-8"?>
<api>
    <invoices>
        <parameters>
            <!-- parametr opcjonalny - w przypadku jego braku adres pobierany jest z rekordu kontrahenta -->
            <parameter>
                <name>email</name>
                <value>odbiorca@adresmailowy123.pl</value>
            </parameter>
            <parameter>
                <name>subject</name>
                <value>Otrzymałeś fakturę</value>
            </parameter>
            <parameter>
                <name>page</name>
                <value>invoice</value>
            </parameter>
            <parameter>
                <name>leaflet</name>
                <value>0</value>
            </parameter>
            <parameter>
                <name>duplicate</name>
                <value>0</value>
            </parameter>
            <parameter>
                <name>body</name>
                <value>Przesyłam fakturę</value>
            </parameter>
        </parameters>
    </invoices>
</api>'
```

Example Response

- Body
- Headers (0)

No response body

This request doesn't return any response body

No response headers

This request doesn't return any response headers

## invoices\_correction

##### Akcje

- **add** \- dodawanie korekty faktury

##### Powiązane moduły

- **companies** (skrócony, pojedynczy)

- **company\_accounts** (skrócony, pojedynczy)

- **company\_details** (pełny, pojedynczy)

- **contractors** (skrócony, pojedynczy)

- **contractor\_details** (pełny, pojedynczy)

- **contractor\_receiver\_details** (pełny, pojedynczy)

- **emails** (skrócony, pojedynczy) - pod gałęzią **email**

- **emails** (skrócony, pojedynczy) - pod gałęzią **email2**

- **expenses** (skrócony, pojedynczy)

- **invoices** (skrócony, pojedynczy) - pod gałęzią **parent**

- **invoices** (skrócony, pojedynczy) - pod gałęzią **order**

- **invoicecontents** (pełny, mnogi)

- **payments** (skrócony, pojedynczy)

- **payment\_cashboxes** (skrócony, pojedynczy)

- **postivo\_shipments** (skrócony, pojedynczy)

- **postivo\_shipment\_contents** (skrócony, pojedynczy)

- **series** (skrócony, pojedynczy)

- **translation\_languages** (skrócony, pojedynczy)

- **vat\_contents** (pełny, mnogi)

- **vat\_moss\_details** (pełny, pojedynczy)


##### Rodzaje dokumentów

| **Dokumenty płatnika VAT** | **Znacznik** |
| --- | --- |
| Korekta faktury VAT | `correction` |

| **Dokumenty nievatowca** | **Znacznik** |
| --- | --- |
| Korekta faktury (bez VAT) | `correction` |

##### Korygowanie pozycji faktury

Aby dokonać korekty danej pozycji należy w sekcji `invoicecontent` przekazać id danej pozycji w polu `parent_id`.

Gdy dana pozycja nie zostanie przekazana, zostanie ona niezmieniona w porównaniu z fakturą pierwotną.

Wystawiając korektę, nie ma możliwości usunięcia pozycji. W takim wypadku należałoby odpowiednio skorygować daną pozycję.

Aby dodać nową pozycję na fakturze korygowanej, należy wskazać nową sekcję `invoicecontent` bez przekazywania pola `parent_id`. Przy dodawaniu nowej pozycji będzie możliwe zdefiniowanie między innymi: `name`, `unit` oraz `good_id`.

Pola, których nie można zmieniać na pozycji powiązanej poprzez `parent_id`, to:

- `name` \- nazwa pozycji

- `unit` \- jednostka

- `good_id` \- produkt z magazynu powiązany z pozycją

- `gtu` \- kod GTU


##### Wystawienie korekty faktury do już istniejącej korekty

W przypadku chęci wystawienia drugiej i kolejnej korekty do danej faktury, w sekcji `invoicecontent` należy przekazać `parent_id` pozycji umieszczonych na ostatniej korekcie.

##### Pola

View More

| **Nazwa Pola** | **Przeznaczenie** | **Typ dokumentu** | **Opis** |
| --- | --- | --- | --- |
| **id** | Tylko do odczytu | Każdy dokument | Klucz główny |
| **parent\_id** | Odczyt i zapis | Każdy dokument | ID faktury korygowanej |
| **paymentmethod** | Odczyt i zapis | Każdy dokument | `cash` \- gotówka <br>`transfer` \- przelew <br>`compensation` \- kompensata <br>`cod` \- za pobraniem <br>`payment_card` \- kartą płatniczą |
| **paymentdate** | Odczyt i zapis | Każdy dokument | Termin płatności |
| **paymentstate** | Tylko do odczytu | Każdy dokument | Stan płatności: <br>`paid` \- rozliczony <br>`unpaid` \- nierozliczony <br>`undefined` \- nieokreślony |
| **disposaldate\_empty** | Odczyt i zapis | Każdy dokument | Pole odpowiedzialne za zaznaczenie opcji „brak dokumentacji do korekty”. Przyjmuje wartości 0 lub 1. Domyślnie gdy nieprzekazane przyjmuje wartość 0. |
| **disposaldate** | Odczyt i zapis | Każdy dokument | Data księgowania do VAT |
| **date** | Odczyt i zapis | Każdy dokument | Data wystawienia faktury |
| **period** | Tylko do odczytu | Każdy dokument | Okres w którym dokument jest widoczny na liście |
| **total** | Tylko do odczytu | Każdy dokument | Kwota razem dokumentu sprzedaży bez uwzględnienia ewentualnych korekt |
| **total\_composed** | Tylko do odczytu | Każdy dokument | Kwota razem faktury z uwzględnieniem korekt |
| **alreadypaid** | Tylko do odczytu | Każdy dokument | Kwota zapłacono uwzględniająca wszystkie płatności |
| **number** | Odczyt i zapis | Każdy dokument | Numer wstawiany w miejsce znacznika `[numer]` we wzorcu serii numeracji przy tworzeniu numeru faktury. Pole możliwe do edycji przy wyłączonej kontroli numeracji w zakładce Ustawienia / serie numeracji. |
| **day** | Odczyt i zapis | Każdy dokument | Dzień wstawiany w miejsce znacznika `[dzień]` we wzorcu serii numeracji przy tworzeniu numeru faktury. Pole możliwe do edycji przy wyłączonej kontroli numeracji w zakładce Ustawienia / serie numeracji. |
| **month** | Odczyt i zapis | Każdy dokument | Miesiąc wstawiany w miejsce znacznika `[miesiąc]` we wzorcu serii numeracji przy tworzeniu numeru faktury. Pole możliwe do edycji przy wyłączonej kontroli numeracji w zakładce Ustawienia / serie numeracji. |
| **year** | Odczyt i zapis | Każdy dokument | Rok wstawiany w miejsce znacznika `[rok]` we wzorcu serii numeracji przy tworzeniu numeru faktury. Pole możliwe do edycji przy wyłączonej kontroli numeracji w zakładce Ustawienia / serie numeracji. |
| **fullnumber** | Tylko do odczytu | Każdy dokument, Inny przychód (Odczyt i zapis) | Numer wygenerowany na podstawie wzorca serii numeracji oraz daty wystawienia lub pól określony powyżej. |
| **semitemplatenumber** | Tylko do odczytu | Każdy dokument | Częściowo wygenerowany numer. Pole wykorzystywane wewnętrznie do wygenerowania wartości `[number]` na podstawie wcześniejszych dokumentów z danej serii numeracji. |
| **type** | Odczyt i zapis | Każdy dokument | Typ dokumentu - `correction` |
| **corrections** | Tylko do odczytu | Każdy dokument | Liczba korekt |
| **currency** | Tylko do odczytu | Każdy dokument | Waluta |
| **currency\_exchange** | Tylko do odczytu | Każdy dokument | Kurs księgowy faktury |
| **currency\_label** | Tylko do odczytu | Każdy dokument | Numer tabeli NBP kursu księgowego |
| **currency\_date** | Tylko do odczytu | Każdy dokument | Data opublikowania kursu |
| **price\_currency\_exchange** | Tylko do odczytu | Każdy dokument | Kurs stosowany przy przeliczaniu cen w panelu wfirmy |
| **good\_price\_group\_currency\_exchange** | Tylko do odczytu | Każdy dokument | Kurs grupy cenowej stosowany przy przeliczaniu cen w panelu wfirmy |
| **template** | Odczyt i zapis | Każdy dokument | Identyfikator szablonu wydruku dokumentu sprzedaży |
| **auto\_send** | Odczyt i zapis | Każdy dokument | Automatyczna wysyłka faktury na adres e-mail kontrahenta |
| **description** | Odczyt i zapis | Każdy dokument | Pole odpowiedzialne za przekazanie powodu korekty |
| **header** | Tylko do odczytu | Każdy dokument | Dodatkowe informacje w nagłówku faktury. Wartość określana automatycznie na podstawie ustawień. |
| **footer** | Tylko do odczytu | Każdy dokument | Dodatkowe informacje w stopce faktury. Wartość określana automatycznie na podstawie ustawień. |
| **user\_name** | Tylko do odczytu | Każdy dokument | Imię i nazwisko osoby upoważnionej do wystawienia faktury. Wartość określana automatycznie na podstawie ustawień. |
| **register\_description** | Odczyt i zapis | Każdy dokument | Domyślnie faktury i inne dokumenty są księgowane do ewidencji z opisem sprzedaż towarów i usług. Możliwe jest określenie własnego opisu. |
| **registerdate** | Odczyt i zapis | Każdy dokument | Data księgowania do KPiR lub Ewidencji przychodów. Pole przekazujemy w `invoice_correction_detail`. Przyjmuje wartość daty w formacie RRRR-MM-DD. Gdy nie przekazane, wskazuje obecną datę. |
| **netto** | Tylko do odczytu | Każdy dokument | Wartość netto ogółem |
| **tax** | Tylko do odczytu | Każdy dokument | Wartość podatku ogółem |
| **hash** | Tylko do odczytu | Każdy dokument | Hash zabezpieczający odsyłacz do faktury w panelu klienta |
| **id\_external** | Odczyt i zapis | Każdy dokument | Pole do zapisywania własnych wartości |
| **warehouse\_type** | Tylko do odczytu | Każdy dokument | Pole określa czy w trakcie wystawiania faktury był włączony moduł magazynowy (`extended`) czy katalog produktów (`simple`) |
| **notes** | Tylko do odczytu | Każdy dokument | Liczba notatek powiązanych z dokumentem sprzedaży |
| **documents** | Tylko do odczytu | Każdy dokument | Liczba dokumentów powiązanych z dokumentem sprzedaży |
| **tags** | Odczyt i zapis | Każdy dokument | Znaczniki powiązane z fakturą w formacie `(ID ZNACZNIKA X),(ID ZNACZNIKA Y)...` |
| **created** | Tylko do odczytu | Każdy dokument | Data i godzina utworzenia wpisu |
| **modified** | Tylko do odczytu | Każdy dokument | Data i godzina zmodyfikowania wpisu |
| **price\_type** | Odczyt i zapis | Każdy dokument | Rodzaj ceny - netto lub brutto |

AUTHORIZATIONOAuth 2.0

This folder is using OAuth 2.0 from collection [wFirma.pl](https://doc.wfirma.pl/#auth-info-3854b824-3162-4c02-a47b-af2012073033)

### POSTinvoices/add

{{host}}/invoices/add?outputFormat=xml&inputFormat=xml&company\_id={{companyId}}

AUTHORIZATIONOAuth 2.0

This request is using OAuth 2.0 from collection [wFirma.pl](https://doc.wfirma.pl/#auth-info-3854b824-3162-4c02-a47b-af2012073033)

PARAMS

outputFormat

xml

inputFormat

xml

company\_id

{{companyId}}

Bodyraw (xml)

View More

xml

```xml
<api>
    <invoices>
        <invoice>
            <contractor>
                <name>Testowy kontrahent</name>
                <zip>10-100</zip>
                <city>Wrocław</city>
                <street>Prosta</street>
            </contractor>
            <type>correction</type>
            <parent_id>16679047</parent_id>
            <invoicecontents>
               <invoicecontent>
                    <parent_id>19630727</parent_id>
                    <name>produkt1</name>
                    <count>1.0000</count>
                    <price>11.00</price>
                </invoicecontent>
                <invoicecontent>
                    <parent_id>19630791</parent_id>
                    <name>produkt2</name>
                    <count>1.0000</count>
                    <price>11.00</price>
                </invoicecontent>
                <invoicecontent>
                    <name>nowy - produkt3</name>
                    <count>1.0000</count>
                    <price>11.00</price>
                </invoicecontent>
            </invoicecontents>
        </invoice>
    </invoices>
</api>
```

Example Request

invoices/add

View More

curl

```curl
curl --location -g '{{host}}/invoices/add?outputFormat=xml&inputFormat=xml&company_id={{companyId}}' \
--data '<api>
    <invoices>
        <invoice>
            <contractor>
                <name>Testowy kontrahent</name>
                <zip>10-100</zip>
                <city>Wrocław</city>
                <street>Prosta</street>
            </contractor>
            <type>correction</type>
            <parent_id>16679047</parent_id>
            <invoicecontents>
               <invoicecontent>
                    <parent_id>19630727</parent_id>
                    <name>produkt1</name>
                    <count>1.0000</count>
                    <price>11.00</price>
                </invoicecontent>
                <invoicecontent>
                    <parent_id>19630791</parent_id>
                    <name>produkt2</name>
                    <count>1.0000</count>
                    <price>11.00</price>
                </invoicecontent>
                <invoicecontent>
                    <name>nowy - produkt3</name>
                    <count>1.0000</count>
                    <price>11.00</price>
                </invoicecontent>
            </invoicecontents>
        </invoice>
    </invoices>
</api>'
```

Example Response

- Body
- Headers (0)

No response body

This request doesn't return any response body

No response headers

This request doesn't return any response headers

## invoice\_descriptions

Moduł odpowiedzialny za dodatkowe teksty na fakturach.

###### Akcje

- **find**
- **get**

##### Pola

| **Nazwa pola** | **Przeznaczenie** | **Opis** |
| --- | --- | --- |
| _**id**_ | Tylko do odczytu | Klucz główny |
| _**name**_ | Tylko do odczytu | Nazwa szablonu |
| _**text**_ | Tylko do odczytu | Treść - limit 512 znaków |
| _**created**_ | Tylko do odczytu | Data i godzina utworzenia wpisu |
| _**modified**_ | Tylko do odczytu | Data i godzina zmodyfikowania wpisu |

AUTHORIZATIONOAuth 2.0

This folder is using OAuth 2.0 from collection [wFirma.pl](https://doc.wfirma.pl/#auth-info-3854b824-3162-4c02-a47b-af2012073033)

### GETinvoice\_descriptions/find

{{host}}/invoice\_descriptions/find?outputFormat=xml&inputFormat=xml&company\_id={{companyId}}

AUTHORIZATIONOAuth 2.0

This request is using OAuth 2.0 from collection [wFirma.pl](https://doc.wfirma.pl/#auth-info-3854b824-3162-4c02-a47b-af2012073033)

PARAMS

outputFormat

xml

Przyjmuje wartość json i xml

inputFormat

xml

Przyjmuje wartość json i xml

company\_id

{{companyId}}

Example Request

invoice\_descriptions/find

View More

curl

```curl
curl --location -g '{{host}}/invoice_descriptions/find?outputFormat=xml&inputFormat=xml&company_id={{companyId}}' \
--data ''
```

Example Response

- Body
- Headers (0)

No response body

This request doesn't return any response body

No response headers

This request doesn't return any response headers

### GETinvoice\_descriptions/get

{{host}}/invoice\_descriptions/get/{{invoiceDescriptionsId}}?outputFormat=xml&inputFormat=xml&company\_id={{companyId}}

AUTHORIZATIONOAuth 2.0

This request is using OAuth 2.0 from collection [wFirma.pl](https://doc.wfirma.pl/#auth-info-3854b824-3162-4c02-a47b-af2012073033)

PARAMS

outputFormat

xml

Przyjmuje wartość json i xml

inputFormat

xml

Przyjmuje wartość json i xml

company\_id

{{companyId}}

Example Request

invoice\_descriptions/get

View More

curl

```curl
curl --location -g '{{host}}/invoice_descriptions/get/{{invoiceDescriptionsId}}?outputFormat=xml&inputFormat=xml&company_id={{companyId}}' \
--data ''
```

Example Response

- Body
- Headers (0)

No response body

This request doesn't return any response body

No response headers

This request doesn't return any response headers

## invoice\_deliveries

Rozliczanie dostaw dokumentów sprzedaży, które nie mają określonej daty sprzedaży (sprzedaż wysyłkowa z nieznaną, przyszłą datą dostawy). Dotyczy `invoices` z wartośćią 1 w polu `disposaldate_empty`.

##### Akcje

- **add** \- dodawanie rozliczenia dostawy
- **delete** \- usuwanie rozliczenia dostawy
- **find** \- pobieranie listy rozliczeń dostaw
- **get** \- pobieranie szczegółów rozliczenia dostawy o podanym **id**

##### Pola

| **Nazwa pola** | **Przeznaczenie** | **Opis** |
| --- | --- | --- |
| _**id**_ | Tylko do odczytu | Klucz główny |
| _**date**_ | Odczyt i zapis | Data dostawy |
| _**type**_ | Tylko do odczytu | Rodzaj rozliczenia: `good` \- rozliczenie dostawy towaru z faktury za pobraniem, `correction` \- potwierdzenie odbioru faktury korygującej przez kontrahenta |
| _**created**_ | Tylko do odczytu | Data i godzina utworzenia wpisu |
| _**modified**_ | Tylko do odczytu | Data i godzina zmodyfikowania wpisu |

AUTHORIZATIONOAuth 2.0

This folder is using OAuth 2.0 from collection [wFirma.pl](https://doc.wfirma.pl/#auth-info-3854b824-3162-4c02-a47b-af2012073033)

### POSTinvoice\_deliveries/add

{{host}}/invoice\_deliveries/add?outputFormat=xml&inputFormat=xml&company\_id={{companyId}}

AUTHORIZATIONOAuth 2.0

This request is using OAuth 2.0 from collection [wFirma.pl](https://doc.wfirma.pl/#auth-info-3854b824-3162-4c02-a47b-af2012073033)

HEADERS

Content-Type

application/x-www-form-urlencoded

PARAMS

outputFormat

xml

Przyjmuje wartość json i xml

inputFormat

xml

Przyjmuje wartość json i xml

company\_id

{{companyId}}

Example Request

invoice\_deliveries/add

View More

curl

```curl
curl --location -g --request POST '{{host}}/invoice_deliveries/add?outputFormat=xml&inputFormat=xml&company_id={{companyId}}' \
--header 'Content-Type: application/x-www-form-urlencoded' \
--data ''
```

Example Response

- Body
- Headers (0)

No response body

This request doesn't return any response body

No response headers

This request doesn't return any response headers

### GETinvoice\_deliveries/find

{{host}}/invoice\_deliveries/find?outputFormat=xml&inputFormat=xml&company\_id={{companyId}}

AUTHORIZATIONOAuth 2.0

This request is using OAuth 2.0 from collection [wFirma.pl](https://doc.wfirma.pl/#auth-info-3854b824-3162-4c02-a47b-af2012073033)

PARAMS

outputFormat

xml

Przyjmuje wartość json i xml

inputFormat

xml

Przyjmuje wartość json i xml

company\_id

{{companyId}}

Example Request

invoice\_deliveries/find

View More

curl

```curl
curl --location -g '{{host}}/invoice_deliveries/find?outputFormat=xml&inputFormat=xml&company_id={{companyId}}' \
--data ''
```

Example Response

- Body
- Headers (0)

No response body

This request doesn't return any response body

No response headers

This request doesn't return any response headers

### GETinvoice\_deliveries/get

{{host}}/invoice\_deliveries/get/{{invoiceDeliveryId}}?outputFormat=xml&inputFormat=xml&company\_id={{companyId}}

AUTHORIZATIONOAuth 2.0

This request is using OAuth 2.0 from collection [wFirma.pl](https://doc.wfirma.pl/#auth-info-3854b824-3162-4c02-a47b-af2012073033)

PARAMS

outputFormat

xml

Przyjmuje wartość json i xml

inputFormat

xml

Przyjmuje wartość json i xml

company\_id

{{companyId}}

Example Request

invoice\_deliveries/get

View More

curl

```curl
curl --location -g '{{host}}/invoice_deliveries/get/{{invoiceDeliveryId}}?outputFormat=xml&inputFormat=xml&company_id={{companyId}}' \
--data ''
```

Example Response

- Body
- Headers (0)

No response body

This request doesn't return any response body

No response headers

This request doesn't return any response headers

### DELETEinvoice\_deliveries/delete

{{host}}/invoice\_deliveries/delete/{{invoiceDeliveryId}}?outputFormat=xml&inputFormat=xml&company\_id={{companyId}}

AUTHORIZATIONOAuth 2.0

This request is using OAuth 2.0 from collection [wFirma.pl](https://doc.wfirma.pl/#auth-info-3854b824-3162-4c02-a47b-af2012073033)

HEADERS

Content-Type

application/x-www-form-urlencoded

PARAMS

outputFormat

xml

Przyjmuje wartość json i xml

inputFormat

xml

Przyjmuje wartość json i xml

company\_id

{{companyId}}

Bodyraw

View More

```javascript
<?xml version="1.0" encoding="UTF-8"?>
<api>
    <goods>
        <good>
            <name>marchewka</name>
            <unit>szt.</unit>
            <count>3.00</count>
            <netto>14.00</netto>
            <vat>23</vat>
        </good>
    </goods>
</api>
```

Example Request

invoice\_deliveries/delete

View More

curl

```curl
curl --location -g --request DELETE '{{host}}/invoice_deliveries/delete/{{invoiceDeliveryId}}?outputFormat=xml&inputFormat=xml&company_id={{companyId}}' \
--header 'Content-Type: application/x-www-form-urlencoded' \
--data '<?xml version="1.0" encoding="UTF-8"?>
<api>
    <goods>
        <good>
            <name>marchewka</name>
            <unit>szt.</unit>
            <count>3.00</count>
            <netto>14.00</netto>
            <vat>23</vat>
        </good>
    </goods>
</api>'
```

Example Response

- Body
- Headers (0)

No response body

This request doesn't return any response body

No response headers

This request doesn't return any response headers

## notes

Zarządzanie notatkami. Notatki można dodawać do obiektów, które posiadają pole **notes**.

##### Akcje

- **add** \- pobieranie listy notatek
- **delete** \- usuwanie notatki o podanym **id**
- **edit** \- modyfikacja notatki o podanym **id**
- **get** \- pobranie szczegółów notatki o podanym **id**
- **find** \- pobranie listy notatek

##### Pola

| **Nazwa pola** | **Przeznaczenie** | **Opis** |
| --- | --- | --- |
| _**id**_ | Tylko do odczytu | Klucz główny |
| _**object\_name**_ | Odczyt i zapis | Nazwa modułu do którego przypisana jest notatka. Nie ma możliwości edycji tego pola. |
| _**object\_id**_ | Odczyt i zapis | Identyfikator wpisu do którego przypisana jest notatka. Nie ma możliwości edycji tego pola. |
| _**text**_ | Odczyt i zapis | Treść notatki |
| _**created**_ | Tylko do odczytu | Data i godzina utworzenia wpisu |
| _**modified**_ | Tylko do odczytu | Data i godzina zmodyfikowania wpisu |

AUTHORIZATIONOAuth 2.0

This folder is using OAuth 2.0 from collection [wFirma.pl](https://doc.wfirma.pl/#auth-info-3854b824-3162-4c02-a47b-af2012073033)

### POSTnotes/add

{{host}}/notes/add?outputFormat=xml&inputFormat=xml&company\_id={{companyId}}

AUTHORIZATIONOAuth 2.0

This request is using OAuth 2.0 from collection [wFirma.pl](https://doc.wfirma.pl/#auth-info-3854b824-3162-4c02-a47b-af2012073033)

PARAMS

outputFormat

xml

Przyjmuje wartość json i xml

inputFormat

xml

Przyjmuje wartość json i xml

company\_id

{{companyId}}

Bodyraw (xml)

xml

```xml
<?xml version="1.0" encoding="UTF-8"?>
<api>
    <notes>
        <note>
            <object_name>invoice</object_name>
            <object_id>1</object_id>
            <text>Przykładowa treść notatki</text>
        </note>
    </notes>
</api>
```

Example Request

notes/add

curl

```curl
curl --location -g '{{host}}/notes/add?outputFormat=xml&inputFormat=xml&company_id={{companyId}}' \
--data '<?xml version="1.0" encoding="UTF-8"?>
<api>
    <notes>
        <note>
            <object_name>invoice</object_name>
            <object_id>1</object_id>
            <text>Przykładowa treść notatki</text>
        </note>
    </notes>
</api>'
```

Example Response

- Body
- Headers (0)

No response body

This request doesn't return any response body

No response headers

This request doesn't return any response headers

### GETnotes/find

{{host}}/notes/find?outputFormat=xml&inputFormat=xml&company\_id={{companyId}}

AUTHORIZATIONOAuth 2.0

This request is using OAuth 2.0 from collection [wFirma.pl](https://doc.wfirma.pl/#auth-info-3854b824-3162-4c02-a47b-af2012073033)

PARAMS

outputFormat

xml

Przyjmuje wartość json i xml

inputFormat

xml

Przyjmuje wartość json i xml

company\_id

{{companyId}}

Example Request

notes/find

curl

```curl
curl --location -g '{{host}}/notes/find?outputFormat=xml&inputFormat=xml&company_id={{companyId}}' \
--data ''
```

Example Response

- Body
- Headers (0)

No response body

This request doesn't return any response body

No response headers

This request doesn't return any response headers

### GETnotes/get

{{host}}/notes/get/{{noteId}}?outputFormat=xml&inputFormat=xml&company\_id={{companyId}}

AUTHORIZATIONOAuth 2.0

This request is using OAuth 2.0 from collection [wFirma.pl](https://doc.wfirma.pl/#auth-info-3854b824-3162-4c02-a47b-af2012073033)

PARAMS

outputFormat

xml

Przyjmuje wartość json i xml

inputFormat

xml

Przyjmuje wartość json i xml

company\_id

{{companyId}}

Example Request

notes/get

View More

curl

```curl
curl --location -g '{{host}}/notes/get/{{noteId}}?outputFormat=xml&inputFormat=xml&company_id={{companyId}}' \
--data ''
```

Example Response

- Body
- Headers (0)

No response body

This request doesn't return any response body

No response headers

This request doesn't return any response headers

### POSTnotes/edit

{{host}}/goods/notes/{{noteId}}?outputFormat=xml&inputFormat=xml&company\_id={{companyId}}

AUTHORIZATIONOAuth 2.0

This request is using OAuth 2.0 from collection [wFirma.pl](https://doc.wfirma.pl/#auth-info-3854b824-3162-4c02-a47b-af2012073033)

PARAMS

outputFormat

xml

Przyjmuje wartość json i xml

inputFormat

xml

Przyjmuje wartość json i xml

company\_id

{{companyId}}

Bodyraw

View More

```javascript
<?xml version="1.0" encoding="UTF-8"?>
<api>
    <goods>
        <good>
            <name>marchewka</name>
            <unit>szt.</unit>
            <count>3.00</count>
            <netto>14.00</netto>
            <vat>23</vat>
        </good>
    </goods>
</api>
```

Example Request

notes/edit

View More

curl

```curl
curl --location -g '{{host}}/goods/notes/{{noteId}}?outputFormat=xml&inputFormat=xml&company_id={{companyId}}' \
--data '<?xml version="1.0" encoding="UTF-8"?>
<api>
    <goods>
        <good>
            <name>marchewka</name>
            <unit>szt.</unit>
            <count>3.00</count>
            <netto>14.00</netto>
            <vat>23</vat>
        </good>
    </goods>
</api>'
```

Example Response

- Body
- Headers (0)

No response body

This request doesn't return any response body

No response headers

This request doesn't return any response headers

### DELETEnotes/delete

{{host}}/notes/delete/{{noteId}}?outputFormat=xml&inputFormat=xml&company\_id={{companyId}}

AUTHORIZATIONOAuth 2.0

This request is using OAuth 2.0 from collection [wFirma.pl](https://doc.wfirma.pl/#auth-info-3854b824-3162-4c02-a47b-af2012073033)

PARAMS

outputFormat

xml

Przyjmuje wartość json i xml

inputFormat

xml

Przyjmuje wartość json i xml

company\_id

{{companyId}}

Bodyraw

View More

```javascript
<?xml version="1.0" encoding="UTF-8"?>
<api>
    <goods>
        <good>
            <name>marchewka</name>
            <unit>szt.</unit>
            <count>3.00</count>
            <netto>14.00</netto>
            <vat>23</vat>
        </good>
    </goods>
</api>
```

Example Request

notes/delete

View More

curl

```curl
curl --location -g --request DELETE '{{host}}/notes/delete/{{noteId}}?outputFormat=xml&inputFormat=xml&company_id={{companyId}}' \
--data '<?xml version="1.0" encoding="UTF-8"?>
<api>
    <goods>
        <good>
            <name>marchewka</name>
            <unit>szt.</unit>
            <count>3.00</count>
            <netto>14.00</netto>
            <vat>23</vat>
        </good>
    </goods>
</api>'
```

Example Response

- Body
- Headers (0)

No response body

This request doesn't return any response body

No response headers

This request doesn't return any response headers

## payments

Moduł odpowiedzialny za zarządzanie płatnościami

##### Akcje

- **add**
- **delete**
- **edit**
- **find**
- **get**

##### Pola

View More

| **Nazwa pola** | **Przeznaczenie** | **Opis** |
| --- | --- | --- |
| _**id**_ | Tylko do odczytu | Klucz główny |
| _**object\_name**_ | Odczyt i zapis | Nazwa modułu do którego przypisana jest płatność (`invoice` lub `expense`). Nie ma możliwości edycji tego pola. |
| _**object\_id**_ | Odczyt i zapis | Identyfikator wpisu do którego przypisana jest płatność. Nie ma możliwości edycji tego pola. |
| _**value**_ | Odczyt i zapis | Kwota płatności |
| _**account**_ | Odczyt i zapis | Źródło wpłaty dla faktur w walucie obcej (`currency` lub `pln`). Dotyczy tylko włączonej obsługi różnic kursowych. |
| _**value\_pin**_ | Odczyt i zapis | Kwota wpłaty w PLN w przypadku płatności na rachunek w PLN faktury w walucie obcej. Dotyczy tylko włączonej obsługi różnic kursowych. |
| _**social**_ | Tylko do odczytu | Pole wykorzystywane przy rozliczaniu deklaracji, które nie są dostępne w API2 |
| _**health**_ | Tylko do odczytu | Pole wykorzystywane przy rozliczaniu deklaracji, które nie są dostępne w API2 |
| _**labor\_fund**_ | Tylko do odczytu | Pole wykorzystywane przy rozliczaniu deklaracji, które nie są dostępne w API2 |
| _**date**_ | Odczyt i zapis | Data zapłaty |
| _**initial**_ | Tylko do odczytu | Oznaczenie płatności głównej, dodanej przy wystawiniu/modyfikowaniu faktury |
| _**payment\_method**_ | Odczyt i zapis | Metoda płatności |
| _**type**_ | Tylko do odczytu |  |
| _**payment\_type**_ | Odczyt i zapis |  |
| _**notes**_ | Tylko do odczytu | Liczba notatek powiązanych z obiektem |
| _**tags**_ | Odczyt i zapis | Znaczniki powiązane z obiektem w formacie `(ID ZNACZNIKA X),(ID ZNACZNIKA Y)...` |
| _**created**_ | Tylko do odczytu | Data i godzina utworzenia wpisu |
| _**modified**_ | Tylko do odczytu | Data i godzina zmodyfikowania wpisu |

##### Zapytanie do akcji /payments/add

Plain Text

```plain
<?xml version="1.0" encoding="UTF-8"?>
<api>
    <payments>
        <payment>
            <object_name>OBJECT_NAME</object_name>
            <object_id>OBJECT_ID</object_id>
            <value>100.00</value>
            <date>2012-02-20</date>
        </payment>
    </payments>
</api>
```

###### Odpowiedź

View More

Plain Text

```plain
<?xml version="1.0" encoding="UTF-8"?>
<api>
    <payments>
        <payment>
            <id>1825983</id>
            <object_name>invoice</object_name>
            <object_id>1662874</object_id>
            <value>100.00</value>
            <social/>
            <health/>
            <labor_fund/>
            <date>2012-02-20</date>
            <initial/>
            <type>income</type>
            <payment_type>cashbox</payment_type>
            <payment_method>transfer</payment_method>
            <tags/>
            <notes>0</notes>
            <created>2012-05-22 15:24:02</created>
            <modified>2012-05-22 15:24:02</modified>
            <invoice>
                <id>1662874</id>
            </invoice>
            <expense>
                <id>0</id>
            </expense>
            <declaration_header>
                <id></id>
            </declaration_header>
            <series>
                <id>0</id>
            </series>
            <payment_cashbox>
                <id></id>
            </payment_cashbox>
            <contractor>
                <id>46</id>
            </contractor>
        </payment>
        <parameters>
            <limit>20</limit>
            <page>1</page>
            <total>1</total>
        </parameters>
    </payments>
    <status>
        <code>OK</code>
    </status>
</api>
```

AUTHORIZATIONOAuth 2.0

This folder is using OAuth 2.0 from collection [wFirma.pl](https://doc.wfirma.pl/#auth-info-3854b824-3162-4c02-a47b-af2012073033)

### POSTpayments/add

{{host}}/payments/add?outputFormat=xml&inputFormat=xml&company\_id={{companyId}}

AUTHORIZATIONOAuth 2.0

This request is using OAuth 2.0 from collection [wFirma.pl](https://doc.wfirma.pl/#auth-info-3854b824-3162-4c02-a47b-af2012073033)

PARAMS

outputFormat

xml

Przyjmuje wartość json i xml

inputFormat

xml

Przyjmuje wartość json i xml

company\_id

{{companyId}}

Bodyraw (xml)

xml

```xml
<?xml version="1.0" encoding="UTF-8"?>
<api>
    <payments>
        <payment>
            <object_name>invoice</object_name>
            <object_id>68827818</object_id>
            <value>100.00</value>
            <date>2020-02-20</date>
        </payment>
    </payments>
</api>
```

Example Request

payments/add

View More

curl

```curl
curl --location -g '{{host}}/payments/add?outputFormat=xml&inputFormat=xml&company_id={{companyId}}' \
--data '<?xml version="1.0" encoding="UTF-8"?>
<api>
    <payments>
        <payment>
            <object_name>invoice</object_name>
            <object_id>68827818</object_id>
            <value>100.00</value>
            <date>2020-02-20</date>
        </payment>
    </payments>
</api>'
```

Example Response

- Body
- Headers (0)

No response body

This request doesn't return any response body

No response headers

This request doesn't return any response headers

### GETpayments/find

{{host}}/payments/find?outputFormat=xml&inputFormat=xml&company\_id={{companyId}}

AUTHORIZATIONOAuth 2.0

This request is using OAuth 2.0 from collection [wFirma.pl](https://doc.wfirma.pl/#auth-info-3854b824-3162-4c02-a47b-af2012073033)

PARAMS

outputFormat

xml

Przyjmuje wartość json i xml

inputFormat

xml

Przyjmuje wartość json i xml

company\_id

{{companyId}}

Example Request

payments/find

curl

```curl
curl --location -g '{{host}}/payments/find?outputFormat=xml&inputFormat=xml&company_id={{companyId}}' \
--data ''
```

Example Response

- Body
- Headers (0)

No response body

This request doesn't return any response body

No response headers

This request doesn't return any response headers

### GETpayments/get

{{host}}/payments/get/{{paymentId}}?outputFormat=xml&inputFormat=xml&company\_id={{companyId}}

AUTHORIZATIONOAuth 2.0

This request is using OAuth 2.0 from collection [wFirma.pl](https://doc.wfirma.pl/#auth-info-3854b824-3162-4c02-a47b-af2012073033)

PARAMS

outputFormat

xml

Przyjmuje wartość json i xml

inputFormat

xml

Przyjmuje wartość json i xml

company\_id

{{companyId}}

Example Request

payments/get

View More

curl

```curl
curl --location -g '{{host}}/payments/get/{{paymentId}}?outputFormat=xml&inputFormat=xml&company_id={{companyId}}' \
--data ''
```

Example Response

- Body
- Headers (0)

No response body

This request doesn't return any response body

No response headers

This request doesn't return any response headers

### POSTpayments/edit

{{host}}/payments/edit/{{paymentId}}?outputFormat=xml&inputFormat=xml&company\_id={{companyId}}

AUTHORIZATIONOAuth 2.0

This request is using OAuth 2.0 from collection [wFirma.pl](https://doc.wfirma.pl/#auth-info-3854b824-3162-4c02-a47b-af2012073033)

PARAMS

outputFormat

xml

Przyjmuje wartość json i xml

inputFormat

xml

Przyjmuje wartość json i xml

company\_id

{{companyId}}

Bodyraw (xml)

xml

```xml
<?xml version="1.0" encoding="UTF-8"?>
<api>
    <payments>
        <payment>
            <value>1</value>
        </payment>
    </payments>
</api>
```

Example Request

payments/edit

View More

curl

```curl
curl --location -g '{{host}}/payments/edit/{{paymentId}}?outputFormat=xml&inputFormat=xml&company_id={{companyId}}' \
--data '<?xml version="1.0" encoding="UTF-8"?>
<api>
    <payments>
        <payment>
            <value>1</value>
        </payment>
    </payments>
</api>'
```

Example Response

- Body
- Headers (0)

No response body

This request doesn't return any response body

No response headers

This request doesn't return any response headers

### DELETEpayments/delete

{{host}}/payments/delete/{{paymentId}}?outputFormat=xml&inputFormat=xml&company\_id={{companyId}}

AUTHORIZATIONOAuth 2.0

This request is using OAuth 2.0 from collection [wFirma.pl](https://doc.wfirma.pl/#auth-info-3854b824-3162-4c02-a47b-af2012073033)

PARAMS

outputFormat

xml

Przyjmuje wartość json i xml

inputFormat

xml

Przyjmuje wartość json i xml

company\_id

{{companyId}}

Example Request

payments/delete

View More

curl

```curl
curl --location -g --request DELETE '{{host}}/payments/delete/{{paymentId}}?outputFormat=xml&inputFormat=xml&company_id={{companyId}}' \
--data ''
```

Example Response

- Body
- Headers (0)

No response body

This request doesn't return any response body

No response headers

This request doesn't return any response headers

## payment\_cashboxes

Moduł odpowiedzialny za zarządzanie kasami

##### Akcje

- **find**
- **get**

##### Pola

View More

| **Nazwa pola** | **Przeznaczenie** | **Opis** |
| --- | --- | --- |
| _**id**_ | Tylko do odczytu | Klucz główny |
| _**series\_id\_kp**_ | Tylko do odczytu | Seria dla dokumentów KP |
| _**series\_id\_kw**_ | Tylko do odczytu | Seria dla dokumentów KW |
| _**series\_id\_kwz**_ | Tylko do odczytu | Seria dla dokumentów wniosków o zaliczkę |
| _**series\_id\_krz**_ | Tylko do odczytu | Seria dla dokumentów rozliczenia wniosków o zaliczkę |
| _**name**_ | Tylko do odczytu | Nazwa kasy |
| _**init**_ | Tylko do odczytu | Wartość początkowa |
| _**currency**_ | Tylko do odczytu | Waluta kasy |
| _**created**_ | Tylko do odczytu | Data i godzina utworzenia wpisu |
| _**modified**_ | Tylko do odczytu | Data i godzina zmodyfikowania wpisu |

AUTHORIZATIONOAuth 2.0

This folder is using OAuth 2.0 from collection [wFirma.pl](https://doc.wfirma.pl/#auth-info-3854b824-3162-4c02-a47b-af2012073033)

### GETpayment\_cashboxes/find

{{host}}/payment\_cashboxes/find?outputFormat=xml&inputFormat=xml&company\_id={{companyId}}

AUTHORIZATIONOAuth 2.0

This request is using OAuth 2.0 from collection [wFirma.pl](https://doc.wfirma.pl/#auth-info-3854b824-3162-4c02-a47b-af2012073033)

PARAMS

outputFormat

xml

Przyjmuje wartość json i xml

inputFormat

xml

Przyjmuje wartość json i xml

company\_id

{{companyId}}

Example Request

payment\_cashboxes/find

View More

curl

```curl
curl --location -g '{{host}}/payment_cashboxes/find?outputFormat=xml&inputFormat=xml&company_id={{companyId}}' \
--data ''
```

Example Response

- Body
- Headers (0)

No response body

This request doesn't return any response body

No response headers

This request doesn't return any response headers

### GETpayment\_cashboxes/get

{{host}}/payment\_cashboxes/get/{{paymentCashboxId}}?outputFormat=xml&inputFormat=xml&company\_id={{companyId}}

AUTHORIZATIONOAuth 2.0

This request is using OAuth 2.0 from collection [wFirma.pl](https://doc.wfirma.pl/#auth-info-3854b824-3162-4c02-a47b-af2012073033)

PARAMS

outputFormat

xml

Przyjmuje wartość json i xml

inputFormat

xml

Przyjmuje wartość json i xml

company\_id

{{companyId}}

Example Request

payment\_cashboxes/get

View More

curl

```curl
curl --location -g '{{host}}/payment_cashboxes/get/{{paymentCashboxId}}?outputFormat=xml&inputFormat=xml&company_id={{companyId}}' \
--data ''
```

Example Response

- Body
- Headers (0)

No response body

This request doesn't return any response body

No response headers

This request doesn't return any response headers

## series

Moduł odpowiedzialny za zarządzanie seriami numeracji

##### Akcje

- **add**
- **delete**
- **edit**
- **find**
- **get**

##### Pola

| **Nazwa pola** | **Przeznaczenie** | **Opis** |
| --- | --- | --- |
| _**id**_ | Tylko do odczytu | Klucz główny |
| _**name**_ | Odczyt i zapis | Nazwa serii |
| _**template**_ | Odczyt i zapis | Wzorzec serii. Zasady tworzenia wzorców opisane są [tutaj](https://wfirma.pl/artykul/faktury-serie). |
| _**initnumber**_ | Odczyt i zapis | Numer początkowy serii |
| _**type**_ | Odczyt i zapis | Rodzaj dokumentów, dla których ma zastosowanie dana seria numeracji |
| _**reset**_ | Odczyt i zapis | Kiedy numer serii będzie resetowany: `yearly` \- co rok, `monthy` \- co miesiąc - wymagany znacznik `[miesiąc]`, `daily` \- codziennie - wymagane znaczniki `[miesiąc]` i `[dzień]` |
| _**created**_ | Tylko do odczytu | Data i godzina utworzenia wpisu |
| _**modified**_ | Tylko do odczytu | Data i godzina zmodyfikowania wpisu |

AUTHORIZATIONOAuth 2.0

This folder is using OAuth 2.0 from collection [wFirma.pl](https://doc.wfirma.pl/#auth-info-3854b824-3162-4c02-a47b-af2012073033)

### POSTseries/add

{{host}}/series/add?outputFormat=xml&inputFormat=xml&company\_id={{companyId}}

AUTHORIZATIONOAuth 2.0

This request is using OAuth 2.0 from collection [wFirma.pl](https://doc.wfirma.pl/#auth-info-3854b824-3162-4c02-a47b-af2012073033)

PARAMS

outputFormat

xml

Przyjmuje wartość json i xml

inputFormat

xml

Przyjmuje wartość json i xml

company\_id

{{companyId}}

Bodyraw (xml)

View More

xml

```xml
<?xml version="1.0" encoding="UTF-8"?>
<api>
    <series>
        <series>
            <name>Seria numeracji</name>
            <template>FV [numer]/[rok]</template>
            <initnumber>1</initnumber>
            <visibility>visible</visibility>
            <type>normal</type>
            <reset>yearly</reset>
        </series>
    </series>
</api>
```

Example Request

series/add

View More

curl

```curl
curl --location -g '{{host}}/series/add?outputFormat=xml&inputFormat=xml&company_id={{companyId}}' \
--data '<?xml version="1.0" encoding="UTF-8"?>
<api>
    <series>
        <series>
            <name>Seria numeracji</name>
            <template>FV [numer]/[rok]</template>
            <initnumber>1</initnumber>
            <visibility>visible</visibility>
            <type>normal</type>
            <reset>yearly</reset>
        </series>
    </series>
</api>'
```

Example Response

- Body
- Headers (0)

No response body

This request doesn't return any response body

No response headers

This request doesn't return any response headers

### GETseries/find

{{host}}/series/find?outputFormat=xml&inputFormat=xml&company\_id={{companyId}}

AUTHORIZATIONOAuth 2.0

This request is using OAuth 2.0 from collection [wFirma.pl](https://doc.wfirma.pl/#auth-info-3854b824-3162-4c02-a47b-af2012073033)

PARAMS

outputFormat

xml

Przyjmuje wartość json i xml

inputFormat

xml

Przyjmuje wartość json i xml

company\_id

{{companyId}}

Example Request

series/find

curl

```curl
curl --location -g '{{host}}/series/find?outputFormat=xml&inputFormat=xml&company_id={{companyId}}' \
--data ''
```

Example Response

- Body
- Headers (0)

No response body

This request doesn't return any response body

No response headers

This request doesn't return any response headers

### GETseries/get

{{host}}/series/get/{{seriesId}}?outputFormat=xml&inputFormat=xml&company\_id={{companyId}}

AUTHORIZATIONOAuth 2.0

This request is using OAuth 2.0 from collection [wFirma.pl](https://doc.wfirma.pl/#auth-info-3854b824-3162-4c02-a47b-af2012073033)

PARAMS

outputFormat

xml

Przyjmuje wartość json i xml

inputFormat

xml

Przyjmuje wartość json i xml

company\_id

{{companyId}}

Example Request

series/get

View More

curl

```curl
curl --location -g '{{host}}/series/get/{{seriesId}}?outputFormat=xml&inputFormat=xml&company_id={{companyId}}' \
--data ''
```

Example Response

- Body
- Headers (0)

No response body

This request doesn't return any response body

No response headers

This request doesn't return any response headers

### POSTseries/edit

{{host}}/series/notes/ID?outputFormat=xml&inputFormat=xml

AUTHORIZATIONOAuth 2.0

This request is using OAuth 2.0 from collection [wFirma.pl](https://doc.wfirma.pl/#auth-info-3854b824-3162-4c02-a47b-af2012073033)

PARAMS

outputFormat

xml

Przyjmuje wartość json i xml

inputFormat

xml

Przyjmuje wartość json i xml

Example Request

series/edit

curl

```curl
curl --location -g --request POST '{{host}}/series/notes/ID?outputFormat=xml&inputFormat=xml' \
--data ''
```

Example Response

- Body
- Headers (0)

No response body

This request doesn't return any response body

No response headers

This request doesn't return any response headers

### DELETEseries/del

{{host}}/series/del/ID?outputFormat=xml&inputFormat=xml

AUTHORIZATIONOAuth 2.0

This request is using OAuth 2.0 from collection [wFirma.pl](https://doc.wfirma.pl/#auth-info-3854b824-3162-4c02-a47b-af2012073033)

HEADERS

Content-Type

application/x-www-form-urlencoded

PARAMS

outputFormat

xml

Przyjmuje wartość json i xml

inputFormat

xml

Przyjmuje wartość json i xml

Example Request

series/del

curl

```curl
curl --location -g --request DELETE '{{host}}/series/del/ID?outputFormat=xml&inputFormat=xml' \
--header 'Content-Type: application/x-www-form-urlencoded' \
--data ''
```

Example Response

- Body
- Headers (0)

No response body

This request doesn't return any response body

No response headers

This request doesn't return any response headers

## tags

Moduł odpowiedzialny za zarządzanie etykietami

##### Akcje

- **add** \- dodanie etykiety
- **delete** \- usunięcie etykiety na podstawie **ID**
- **edit** \- modyfikacja etykiety na podstawie **ID**
- **find** \- pobranie listy etykiet
- **get** \- pobranie szczegółów etykiety na podstawie **ID**

##### Pola

View More

| **Nazwa pola** | **Przeznaczenie** | **Opis** |
| --- | --- | --- |
| _**id**_ | Tylko do odczytu | Klucz główny |
| _**name**_ | Odczyt i zapis | Nazwa etykiety |
| _**color\_background**_ | Odczyt i zapis | Kolor tła w notacji heksadecymalnej np ff0000 |
| _**color**_ | Odczyt i zapis | Kolor w notacji heksadecymalnej np ff0000 |
| _**invoice**_ | Odczyt i zapis | Faktury |
| _**expense**_ | Odczyt i zapis | Wydatki |
| _**good**_ | Odczyt i zapis | Produkty |
| _**contractor**_ | Odczyt i zapis | Kontrahenci |
| _**contact**_ | Odczyt i zapis | Kontakty |
| _**document**_ | Odczyt i zapis | Dokumenty |
| _**payment**_ | Odczyt i zapis | Płatności |
| _**staff\_employee**_ | Odczyt i zapis | Pracownicy |
| _**staff\_contract\_header**_ | Odczyt i zapis | Umowy pracowników |
| _**staff\_salary**_ | Odczyt i zapis | Listy płac |
| _**staff\_contract\_civil\_bill**_ | Odczyt i zapis | Rachunki do umów cywilnoprawnych |
| _**declaration\_header**_ | Odczyt i zapis | Deklaracje |
| _**warehouse\_document**_ | Odczyt i zapis | Dokumenty magazynowe |
| _**payment\_cashbox\_document**_ | Odczyt i zapis | Dokumenty kasowe |
| _**shop\_transaction**_ | Odczyt i zapis | Transakcje ze sklepu (moduł allegro) |
| _**created**_ | Tylko do odczytu | Data i godzina utworzenia wpisu |
| _**modified**_ | Tylko do odczytu | Data i godzina zmodyfikowania wpisu |

**Czy w danym miejscu będzie dostępna etykieta (wartości: `1` -TAK, `0` \- NIE)**

AUTHORIZATIONOAuth 2.0

This folder is using OAuth 2.0 from collection [wFirma.pl](https://doc.wfirma.pl/#auth-info-3854b824-3162-4c02-a47b-af2012073033)

### POSTtags/add

{{host}}/tags/add?outputFormat=xml&inputFormat=xml&company\_id={{companyId}}

AUTHORIZATIONOAuth 2.0

This request is using OAuth 2.0 from collection [wFirma.pl](https://doc.wfirma.pl/#auth-info-3854b824-3162-4c02-a47b-af2012073033)

PARAMS

outputFormat

xml

Przyjmuje wartość json i xml

inputFormat

xml

Przyjmuje wartość json i xml

company\_id

{{companyId}}

Bodyraw (xml)

View More

xml

```xml
<?xml version="1.0" encoding="UTF-8"?>
<api>
    <tags>
        <tag>
            <id>3932</id>
            <name>Testowa etykieta</name>
            <color_background>ec7000</color_background>
            <color_text>fff0e1</color_text>
            <invoice>1</invoice>
            <expense>1</expense>
            <good>1</good>
            <contractor>1</contractor>
            <contractor_service>1</contractor_service>
            <contact>1</contact>
            <crm_task>1</crm_task>
            <document>1</document>
            <payment>1</payment>
            <staff_employee>1</staff_employee>
            <staff_contract_header>1</staff_contract_header>
            <staff_salary>1</staff_salary>
            <staff_contract_civil_bill>1</staff_contract_civil_bill>
            <declaration_header>1</declaration_header>
            <warehouse_document>1</warehouse_document>
            <payment_cashbox_document>1</payment_cashbox_document>
            <shop_order>1</shop_order>
            <vatregister>1</vatregister>
            <visibility>visible</visibility>
        </tag>
    </tags>
</api>
```

Example Request

tags/add

View More

curl

```curl
curl --location -g '{{host}}/tags/add?outputFormat=xml&inputFormat=xml&company_id={{companyId}}' \
--data '<?xml version="1.0" encoding="UTF-8"?>
<api>
    <tags>
        <tag>
            <id>3932</id>
            <name>Testowa etykieta</name>
            <color_background>ec7000</color_background>
            <color_text>fff0e1</color_text>
            <invoice>1</invoice>
            <expense>1</expense>
            <good>1</good>
            <contractor>1</contractor>
            <contractor_service>1</contractor_service>
            <contact>1</contact>
            <crm_task>1</crm_task>
            <document>1</document>
            <payment>1</payment>
            <staff_employee>1</staff_employee>
            <staff_contract_header>1</staff_contract_header>
            <staff_salary>1</staff_salary>
            <staff_contract_civil_bill>1</staff_contract_civil_bill>
            <declaration_header>1</declaration_header>
            <warehouse_document>1</warehouse_document>
            <payment_cashbox_document>1</payment_cashbox_document>
            <shop_order>1</shop_order>
            <vatregister>1</vatregister>
            <visibility>visible</visibility>
        </tag>
    </tags>
</api>'
```

Example Response

- Body
- Headers (0)

No response body

This request doesn't return any response body

No response headers

This request doesn't return any response headers

### GETtags/find

{{host}}/tags/find?outputFormat=xml&inputFormat=xml&company\_id={{companyId}}

AUTHORIZATIONOAuth 2.0

This request is using OAuth 2.0 from collection [wFirma.pl](https://doc.wfirma.pl/#auth-info-3854b824-3162-4c02-a47b-af2012073033)

PARAMS

outputFormat

xml

Przyjmuje wartość json i xml

inputFormat

xml

Przyjmuje wartość json i xml

company\_id

{{companyId}}

Example Request

tags/find

curl

```curl
curl --location -g '{{host}}/tags/find?outputFormat=xml&inputFormat=xml&company_id={{companyId}}' \
--data ''
```

Example Response

- Body
- Headers (0)

No response body

This request doesn't return any response body

No response headers

This request doesn't return any response headers

### GETtags/get

{{host}}/tags/get/{{tagId}}?outputFormat=xml&inputFormat=xml&company\_id={{companyId}}

AUTHORIZATIONOAuth 2.0

This request is using OAuth 2.0 from collection [wFirma.pl](https://doc.wfirma.pl/#auth-info-3854b824-3162-4c02-a47b-af2012073033)

PARAMS

outputFormat

xml

Przyjmuje wartość json i xml

inputFormat

xml

Przyjmuje wartość json i xml

company\_id

{{companyId}}

Example Request

tags/get

curl

```curl
curl --location -g '{{host}}/tags/get/{{tagId}}?outputFormat=xml&inputFormat=xml&company_id={{companyId}}' \
--data ''
```

Example Response

- Body
- Headers (0)

No response body

This request doesn't return any response body

No response headers

This request doesn't return any response headers

### POSTtags/edit

{{host}}/tags/notes/{{termId}}?outputFormat=xml&inputFormat=xml&company\_id={{companyId}}

AUTHORIZATIONOAuth 2.0

This request is using OAuth 2.0 from collection [wFirma.pl](https://doc.wfirma.pl/#auth-info-3854b824-3162-4c02-a47b-af2012073033)

PARAMS

outputFormat

xml

Przyjmuje wartość json i xml

inputFormat

xml

Przyjmuje wartość json i xml

company\_id

{{companyId}}

Example Request

tags/edit

View More

curl

```curl
curl --location -g --request POST '{{host}}/tags/notes/{{termId}}?outputFormat=xml&inputFormat=xml&company_id={{companyId}}' \
--data ''
```

Example Response

- Body
- Headers (0)

No response body

This request doesn't return any response body

No response headers

This request doesn't return any response headers

### DELETEtags/delete

{{host}}/tags/delete/{{termId}}?outputFormat=xml&inputFormat=xml&company\_id={{companyId}}

AUTHORIZATIONOAuth 2.0

This request is using OAuth 2.0 from collection [wFirma.pl](https://doc.wfirma.pl/#auth-info-3854b824-3162-4c02-a47b-af2012073033)

HEADERS

Content-Type

application/x-www-form-urlencoded

PARAMS

outputFormat

xml

Przyjmuje wartość json i xml

inputFormat

xml

Przyjmuje wartość json i xml

company\_id

{{companyId}}

Example Request

tags/delete

View More

curl

```curl
curl --location -g --request DELETE '{{host}}/tags/delete/{{termId}}?outputFormat=xml&inputFormat=xml&company_id={{companyId}}' \
--header 'Content-Type: application/x-www-form-urlencoded' \
--data ''
```

Example Response

- Body
- Headers (0)

No response body

This request doesn't return any response body

No response headers

This request doesn't return any response headers

## taxregisters

##### Akcje

- **get** \- pobieranie wpisów z KPiR

##### Identyfikatory adresu

| **Nazwa parametru** | **Opis** |
| --- | --- |
| _**year**_ | rok za który mają zostać pobrane wpisy |
| _**month**_ | miesiąc za który mają zostać pobrane wpisy (opcjonalnie) |

##### Moduły

- **taxregisters** (pojedynczy wpis z KPiR)
- **sums** (suma z poprzednich miesięcy)
- **totalSums** (suma z poprzednich oraz obecnego miesiąca)

##### Pola

View More

| **Nazwa pola** | **Przeznaczenie** | **Opis** |
| --- | --- | --- |
| _**lp**_ | Tylko do odczytu | liczba porządkowa |
| _**date**_ | Tylko do odczytu | data\_księgowania\_do\_kpir w formacie **Y-m-d** |
| _**name**_ | Tylko do odczytu | nazwa dokumentu lub faktury |
| _**descripion**_ | Tylko do odczytu | opis |
| _**income\_sale**_ | Tylko do odczytu | kwota sprzedaży towarów i usług |
| _**income\_odd**_ | Tylko do odczytu | kwota pozostałych przychodów |
| _**income**_ | Tylko do odczytu | kwota **razem** przychodów |
| _**expense\_purchase**_ | Tylko do odczytu | kwota zakupu towarów handlowych i materiałów |
| _**expense\_purchase\_cost**_ | Tylko do odczytu | kwota ubocznych kosztów zakupu |
| _**expense\_salaries**_ | Tylko do odczytu | kwota wynagrodzenia w gotówce i naturze |
| _**expense\_odd**_ | Tylko do odczytu | kwota pozostałych wydatków |
| _**expense**_ | Tylko do odczytu | kwota **razem** wydatków |
| _**inventory**_ | Tylko do odczytu | kwota kosztu zakupu wyposażenia |
| _**expense\_research\_description**_ | Tylko do odczytu | opis kosztów badawczo-rozwojowych |
| _**expense\_research**_ | Tylko do odczytu | kwota kosztów badawczo-rozwojowych |
| _**annotation**_ | Tylko do odczytu | dodatkowy opis |
| _**expense\_correction**_ | Tylko do odczytu | korekta wydatku **0** lub **1** |
| _**contractor\_name**_ | Tylko do odczytu | nazwa kontrahenta |
| _**contractor\_address**_ | Tylko do odczytu | adres kontrahenta |

AUTHORIZATIONOAuth 2.0

This folder is using OAuth 2.0 from collection [wFirma.pl](https://doc.wfirma.pl/#auth-info-3854b824-3162-4c02-a47b-af2012073033)

### GETtaxregisters/get

{{host}}/taxregisters/get/{{year}}/{{month}}?outputFormat=xml&inputFormat=xml&company\_id={{companyId}}

AUTHORIZATIONOAuth 2.0

This request is using OAuth 2.0 from collection [wFirma.pl](https://doc.wfirma.pl/#auth-info-3854b824-3162-4c02-a47b-af2012073033)

PARAMS

outputFormat

xml

inputFormat

xml

company\_id

{{companyId}}

Example Request

taxregisters/get

View More

curl

```curl
curl --location -g '{{host}}/taxregisters/get/{{year}}/{{month}}?outputFormat=xml&inputFormat=xml&company_id={{companyId}}'
```

Example Response

- Body
- Headers (0)

No response body

This request doesn't return any response body

No response headers

This request doesn't return any response headers

## terms

##### Akcje

- **add** \- dodanie terminu
- **delete** \- usunięcie terminu na podstawie ID
- **edit** \- modyfikacja terminu
- **find** \- pobranie listy terminów
- **get** \- pobranie szczegółów terminu na podstawie ID

##### Pola

View More

| **Nazwa pola** | **Przeznaczenie** | **Opis** |
| --- | --- | --- |
| _**id**_ | Tylko do odczytu | Klucz główny |
| _**date**_ | Odczyt i zapis | Data rozpoczęcia terminu |
| _**hour**_ | Odczyt i zapis | Godzina rozpoczęcia terminu |
| _**description**_ | Odczyt i zapis | Notatka do terminu |
| _**group\_id**_ | Odczyt i zapis | Id grupy terminów |
| _**type**_ | Odczyt i zapis | Rodzaj terminu: `normal` \- zwykły, `cycle_day_of_week` \- cykliczny w dniu tygodnia, `cycle_day_of_month` \- cykliczny w dniu miesiąca |
| _**contractor\_id**_ | Odczyt i zapis | Id kontrahenta |
| _**contact\_id**_ | Odczyt i zapis | Id kontaktu |
| _**created**_ | Tylko do odczytu | Data i godzina utworzenia wpisu |
| _**modified**_ | Tylko do odczytu | Data i godzina zmodyfikowania wpisu |

AUTHORIZATIONOAuth 2.0

This folder is using OAuth 2.0 from collection [wFirma.pl](https://doc.wfirma.pl/#auth-info-3854b824-3162-4c02-a47b-af2012073033)

### POSTterms/add

{{host}}/terms/add?outputFormat=xml&inputFormat=xml&company\_id={{companyId}}

AUTHORIZATIONOAuth 2.0

This request is using OAuth 2.0 from collection [wFirma.pl](https://doc.wfirma.pl/#auth-info-3854b824-3162-4c02-a47b-af2012073033)

PARAMS

outputFormat

xml

Przyjmuje wartość json i xml

inputFormat

xml

Przyjmuje wartość json i xml

company\_id

{{companyId}}

Bodyraw (xml)

View More

xml

```xml
<?xml version="1.0" encoding="UTF-8"?>
<api>
    <terms>
        <term>
            <description>termin A</description>
            <date>2020-08-04</date>
            <hour>12:34:59</hour>
            <term_group_id>13</term_group_id>
            <type>normal</type>
        </term>
    </terms>
</api>
```

Example Request

terms/add

View More

curl

```curl
curl --location -g '{{host}}/terms/add?outputFormat=xml&inputFormat=xml&company_id={{companyId}}' \
--data '<?xml version="1.0" encoding="UTF-8"?>
<api>
    <terms>
        <term>
            <description>termin A</description>
            <date>2020-08-04</date>
            <hour>12:34:59</hour>
            <term_group_id>13</term_group_id>
            <type>normal</type>
        </term>
    </terms>
</api>'
```

Example Response

- Body
- Headers (0)

No response body

This request doesn't return any response body

No response headers

This request doesn't return any response headers

### GETterms/find

{{host}}/terms/find?outputFormat=xml&inputFormat=xml&company\_id={{companyId}}

AUTHORIZATIONOAuth 2.0

This request is using OAuth 2.0 from collection [wFirma.pl](https://doc.wfirma.pl/#auth-info-3854b824-3162-4c02-a47b-af2012073033)

PARAMS

outputFormat

xml

Przyjmuje wartość json i xml

inputFormat

xml

Przyjmuje wartość json i xml

company\_id

{{companyId}}

Example Request

terms/find

curl

```curl
curl --location -g '{{host}}/terms/find?outputFormat=xml&inputFormat=xml&company_id={{companyId}}' \
--data ''
```

Example Response

- Body
- Headers (0)

No response body

This request doesn't return any response body

No response headers

This request doesn't return any response headers

### GETterms/get

{{host}}/terms/get/{{termId}}?outputFormat=xml&inputFormat=xml&company\_id={{companyId}}

AUTHORIZATIONOAuth 2.0

This request is using OAuth 2.0 from collection [wFirma.pl](https://doc.wfirma.pl/#auth-info-3854b824-3162-4c02-a47b-af2012073033)

PARAMS

outputFormat

xml

Przyjmuje wartość json i xml

inputFormat

xml

Przyjmuje wartość json i xml

company\_id

{{companyId}}

Example Request

terms/get

View More

curl

```curl
curl --location -g '{{host}}/terms/get/{{termId}}?outputFormat=xml&inputFormat=xml&company_id={{companyId}}' \
--data ''
```

Example Response

- Body
- Headers (0)

No response body

This request doesn't return any response body

No response headers

This request doesn't return any response headers

### POSTterms/edit

{{host}}/terms/notes/{{termId}}?outputFormat=xml&inputFormat=xml&company\_id={{companyId}}

AUTHORIZATIONOAuth 2.0

This request is using OAuth 2.0 from collection [wFirma.pl](https://doc.wfirma.pl/#auth-info-3854b824-3162-4c02-a47b-af2012073033)

HEADERS

Content-Type

application/x-www-form-urlencoded

PARAMS

outputFormat

xml

Przyjmuje wartość json i xml

inputFormat

xml

Przyjmuje wartość json i xml

company\_id

{{companyId}}

Example Request

terms/edit

View More

curl

```curl
curl --location -g --request POST '{{host}}/terms/notes/{{termId}}?outputFormat=xml&inputFormat=xml&company_id={{companyId}}' \
--header 'Content-Type: application/x-www-form-urlencoded' \
--data ''
```

Example Response

- Body
- Headers (0)

No response body

This request doesn't return any response body

No response headers

This request doesn't return any response headers

### DELETEterms/delete

{{host}}/terms/delete/{{termId}}?outputFormat=xml&inputFormat=xml&company\_id={{companyId}}

AUTHORIZATIONOAuth 2.0

This request is using OAuth 2.0 from collection [wFirma.pl](https://doc.wfirma.pl/#auth-info-3854b824-3162-4c02-a47b-af2012073033)

PARAMS

outputFormat

xml

Przyjmuje wartość json i xml

inputFormat

xml

Przyjmuje wartość json i xml

company\_id

{{companyId}}

Example Request

terms/delete

View More

curl

```curl
curl --location -g --request DELETE '{{host}}/terms/delete/{{termId}}?outputFormat=xml&inputFormat=xml&company_id={{companyId}}' \
--data ''
```

Example Response

- Body
- Headers (0)

No response body

This request doesn't return any response body

No response headers

This request doesn't return any response headers

## term\_groups

##### Akcje

- **add** \- dodanie grupy terminów
- **delete** \- usunięcie grupy terminów na podstawie ID
- **edit** \- modyfikacja grupy terminów
- **find** \- pobranie listy grup terminów
- **get** \- pobranie szczegółów grupy terminów na podstawie ID

##### Pola

| **Nazwa pola** | **Przeznaczenie** | **Opis** |
| --- | --- | --- |
| _**id**_ | Tylko do odczytu | Klucz główny |
| _**name**_ | Odczyt i zapis | Nazwa grupy |
| _**is\_readonly**_ | Odczyt i zapis | Pole decyduje o tym czy grupa i jej zadania mogą być modyfikowane z poziomu serwisu wFirma.pl |
| _**created**_ | Tylko do odczytu | Data i godzina utworzenia wpisu |
| _**modified**_ | Tylko do odczytu | Data i godzina zmodyfikowania wpisu |

AUTHORIZATIONOAuth 2.0

This folder is using OAuth 2.0 from collection [wFirma.pl](https://doc.wfirma.pl/#auth-info-3854b824-3162-4c02-a47b-af2012073033)

### POSTterm\_groups/add

{{host}}/term\_groups/add?outputFormat=xml&inputFormat=xml&company\_id={{companyId}}

AUTHORIZATIONOAuth 2.0

This request is using OAuth 2.0 from collection [wFirma.pl](https://doc.wfirma.pl/#auth-info-3854b824-3162-4c02-a47b-af2012073033)

PARAMS

outputFormat

xml

Przyjmuje wartość json i xml

inputFormat

xml

Przyjmuje wartość json i xml

company\_id

{{companyId}}

Bodyraw (xml)

xml

```xml
<?xml version="1.0" encoding="UTF-8"?>
<api>
    <term_groups>
        <term_group>
            <name>grupa API</name>
            <is_readonly>1</is_readonly>
        </term_group>
    </term_groups>
</api>
```

Example Request

term\_groups/add

curl

```curl
curl --location -g '{{host}}/term_groups/add?outputFormat=xml&inputFormat=xml&company_id={{companyId}}' \
--data '<?xml version="1.0" encoding="UTF-8"?>
<api>
    <term_groups>
        <term_group>
            <name>grupa API</name>
            <is_readonly>1</is_readonly>
        </term_group>
    </term_groups>
</api>'
```

Example Response

- Body
- Headers (0)

No response body

This request doesn't return any response body

No response headers

This request doesn't return any response headers

### GETterm\_groups/find

{{host}}/term\_groups/find?outputFormat=xml&inputFormat=xml&company\_id={{companyId}}

AUTHORIZATIONOAuth 2.0

This request is using OAuth 2.0 from collection [wFirma.pl](https://doc.wfirma.pl/#auth-info-3854b824-3162-4c02-a47b-af2012073033)

PARAMS

outputFormat

xml

Przyjmuje wartość json i xml

inputFormat

xml

Przyjmuje wartość json i xml

company\_id

{{companyId}}

Example Request

term\_groups/find

curl

```curl
curl --location -g '{{host}}/term_groups/find?outputFormat=xml&inputFormat=xml&company_id={{companyId}}' \
--data ''
```

Example Response

- Body
- Headers (0)

No response body

This request doesn't return any response body

No response headers

This request doesn't return any response headers

### GETterm\_groups/get

{{host}}/term\_groups/get/{{termGroupId}}?outputFormat=xml&inputFormat=xml&company\_id={{companyId}}

AUTHORIZATIONOAuth 2.0

This request is using OAuth 2.0 from collection [wFirma.pl](https://doc.wfirma.pl/#auth-info-3854b824-3162-4c02-a47b-af2012073033)

PARAMS

outputFormat

xml

Przyjmuje wartość json i xml

inputFormat

xml

Przyjmuje wartość json i xml

company\_id

{{companyId}}

Example Request

term\_groups/get

View More

curl

```curl
curl --location -g '{{host}}/term_groups/get/{{termGroupId}}?outputFormat=xml&inputFormat=xml&company_id={{companyId}}' \
--data ''
```

Example Response

- Body
- Headers (0)

No response body

This request doesn't return any response body

No response headers

This request doesn't return any response headers

### POSTterm\_groups/edit

{{host}}/term\_groups/notes/{{termGroupId}}?outputFormat=xml&inputFormat=xml&company\_id={{companyId}}

AUTHORIZATIONOAuth 2.0

This request is using OAuth 2.0 from collection [wFirma.pl](https://doc.wfirma.pl/#auth-info-3854b824-3162-4c02-a47b-af2012073033)

PARAMS

outputFormat

xml

Przyjmuje wartość json i xml

inputFormat

xml

Przyjmuje wartość json i xml

company\_id

{{companyId}}

Example Request

term\_groups/edit

View More

curl

```curl
curl --location -g --request POST '{{host}}/term_groups/notes/{{termGroupId}}?outputFormat=xml&inputFormat=xml&company_id={{companyId}}' \
--data ''
```

Example Response

- Body
- Headers (0)

No response body

This request doesn't return any response body

No response headers

This request doesn't return any response headers

### DELETEterm\_groups/delete

{{host}}/term\_groups/delete/{{termGroupId}}?outputFormat=xml&inputFormat=xml&company\_id={{companyId}}

AUTHORIZATIONOAuth 2.0

This request is using OAuth 2.0 from collection [wFirma.pl](https://doc.wfirma.pl/#auth-info-3854b824-3162-4c02-a47b-af2012073033)

PARAMS

outputFormat

xml

Przyjmuje wartość json i xml

inputFormat

xml

Przyjmuje wartość json i xml

company\_id

{{companyId}}

Example Request

term\_groups/delete

View More

curl

```curl
curl --location -g --request DELETE '{{host}}/term_groups/delete/{{termGroupId}}?outputFormat=xml&inputFormat=xml&company_id={{companyId}}' \
--data ''
```

Example Response

- Body
- Headers (0)

No response body

This request doesn't return any response body

No response headers

This request doesn't return any response headers

## translation\_languages

Lista języków (wersji dwujęzycznych) faktur

##### Akcje

- **find**
- **get**

##### Pola

| **Nazwa pola** | **Przeznaczenie** | **Opis** |
| --- | --- | --- |
| _**id**_ | Tylko do odczytu | Klucz główny |
| _**name**_ | Tylko do odczytu | Nazwa wersji dwujęzycznej |
| _**code**_ | Tylko do odczytu | Kod drugiego języka |
| _**active**_ | Tylko do odczytu | Można używać tylko tych języków, które mają ustawioną wartość `1`. Możliwe że w przyszłości pole zostanie zlikwidowane. |
| _**created**_ | Tylko do odczytu | Data i godzina utworzenia wpisu |
| _**modified**_ | Tylko do odczytu | Data i godzina zmodyfikowania wpisu |

AUTHORIZATIONOAuth 2.0

This folder is using OAuth 2.0 from collection [wFirma.pl](https://doc.wfirma.pl/#auth-info-3854b824-3162-4c02-a47b-af2012073033)

### GETtranslation\_languages/find

{{host}}/translation\_languages/find?outputFormat=xml&inputFormat=xml&company\_id={{companyId}}

AUTHORIZATIONOAuth 2.0

This request is using OAuth 2.0 from collection [wFirma.pl](https://doc.wfirma.pl/#auth-info-3854b824-3162-4c02-a47b-af2012073033)

PARAMS

outputFormat

xml

Przyjmuje wartość json i xml

inputFormat

xml

Przyjmuje wartość json i xml

company\_id

{{companyId}}

Example Request

translation\_languages/find

View More

curl

```curl
curl --location -g '{{host}}/translation_languages/find?outputFormat=xml&inputFormat=xml&company_id={{companyId}}' \
--data ''
```

Example Response

- Body
- Headers (0)

No response body

This request doesn't return any response body

No response headers

This request doesn't return any response headers

### GETtranslation\_languages/get

{{host}}/translation\_languages/get/{{translationLanguageId}}?outputFormat=xml&inputFormat=xml&company\_id={{companyId}}

AUTHORIZATIONOAuth 2.0

This request is using OAuth 2.0 from collection [wFirma.pl](https://doc.wfirma.pl/#auth-info-3854b824-3162-4c02-a47b-af2012073033)

PARAMS

outputFormat

xml

Przyjmuje wartość json i xml

inputFormat

xml

Przyjmuje wartość json i xml

company\_id

{{companyId}}

Example Request

translation\_languages/get

View More

curl

```curl
curl --location -g '{{host}}/translation_languages/get/{{translationLanguageId}}?outputFormat=xml&inputFormat=xml&company_id={{companyId}}' \
--data ''
```

Example Response

- Body
- Headers (0)

No response body

This request doesn't return any response body

No response headers

This request doesn't return any response headers

## user\_companies

Ustawienia użytkowników w firmie

##### Akcje

- **find** \- pobieranie listy użytkowników w firmie
- **get** \- pobieranie szczegółów użytkownika w firmie na podstawie **ID**

AUTHORIZATIONOAuth 2.0

This folder is using OAuth 2.0 from collection [wFirma.pl](https://doc.wfirma.pl/#auth-info-3854b824-3162-4c02-a47b-af2012073033)

### GETuser\_companies/find

{{host}}/user\_companies/find?inputFormat=xml&outputFormat=xml

Nie działa wyświetlanie wybranych pól przez:
UserCompany.company\_id

Mogłyby zostać pobrane niebezpieczne dla klientów pola które powinny być ukryte.

Nie działa wyszukiwanie po "CompanyPack" - jest to spowodowane zagnieżdżonym bindem.

AUTHORIZATIONOAuth 2.0

This request is using OAuth 2.0 from collection [wFirma.pl](https://doc.wfirma.pl/#auth-info-3854b824-3162-4c02-a47b-af2012073033)

PARAMS

inputFormat

xml

Przyjmuje wartość json i xml

outputFormat

xml

Przyjmuje wartość json i xml

Example Request

user\_companies/find

curl

```curl
curl --location -g '{{host}}/user_companies/find?inputFormat=xml&outputFormat=xml' \
--data ''
```

Example Response

- Body
- Headers (0)

No response body

This request doesn't return any response body

No response headers

This request doesn't return any response headers

### GETuser\_companies/get

{{host}}/user\_companies/get/{{userCompanyId}}?inputFormat=xml&outputFormat=xml

Jako parametr userCompanyId należy podać api.user\_companies.user\_company.id który jest ID relacji pomiędzy firmą a użytkownikiem.

AUTHORIZATIONOAuth 2.0

This request is using OAuth 2.0 from collection [wFirma.pl](https://doc.wfirma.pl/#auth-info-3854b824-3162-4c02-a47b-af2012073033)

PARAMS

inputFormat

xml

Przyjmuje wartość json i xml

outputFormat

xml

Przyjmuje wartość json i xml

Example Request

user\_companies/get

curl

```curl
curl --location -g '{{host}}/user_companies/get/{{userCompanyId}}?inputFormat=xml&outputFormat=xml' \
--data ''
```

Example Response

- Body
- Headers (0)

No response body

This request doesn't return any response body

No response headers

This request doesn't return any response headers

## users

##### Akcje

- **get** \- pobieranie listy użytkowników

AUTHORIZATIONOAuth 2.0

This folder is using OAuth 2.0 from collection [wFirma.pl](https://doc.wfirma.pl/#auth-info-3854b824-3162-4c02-a47b-af2012073033)

### GETusers/get

{{host}}/users/get/{{userCompanyId}}?outputFormat=xml&inputFormat=xml&company\_id={{companyId}}

AUTHORIZATIONOAuth 2.0

This request is using OAuth 2.0 from collection [wFirma.pl](https://doc.wfirma.pl/#auth-info-3854b824-3162-4c02-a47b-af2012073033)

PARAMS

outputFormat

xml

Przyjmuje wartość json i xml

inputFormat

xml

Przyjmuje wartość json i xml

company\_id

{{companyId}}

Example Request

users/get

View More

curl

```curl
curl --location -g '{{host}}/users/get/{{userCompanyId}}?outputFormat=xml&inputFormat=xml&company_id={{companyId}}' \
--data ''
```

Example Response

- Body
- Headers (0)

No response body

This request doesn't return any response body

No response headers

This request doesn't return any response headers

## vat\_codes

##### Powiązane moduły

- **vat\_code\_periods** (pełny, mnogi)

##### Akcje

- **find**
- **get**

##### Pola

| **Nazwa pola** | **Przeznaczenie** | **Opis** |
| --- | --- | --- |
| _**id**_ | Tylko do odczytu | Klucz główny |
| _**declaration\_country\_id**_ | Tylko do odczytu | Identyfikator kraju dla zagranicznej stawki VAT, w przypadku Polski wartość `0` |
| _**label**_ | Tylko do odczytu |  |
| _**rate**_ | Tylko do odczytu | Stawka w procentach np. `23` |
| _**code**_ | Tylko do odczytu | Kod stawki, dotyczy tylko stawek krajowych. Przykładowe wartości `WDT`, `ZW`, `23`. |
| _**type**_ | Tylko do odczytu | `reduced` \- obniżona, `standard`, `other` \- pozostałe |
| _**priority**_ | Tylko do odczytu | Kolejność na wydruku faktury w podsumowaniu VAT |
| _**created**_ | Tylko do odczytu | Data i godzina utworzenia wpisu |
| _**modified**_ | Tylko do odczytu | Data i godzina zmodyfikowania wpisu |

AUTHORIZATIONOAuth 2.0

This folder is using OAuth 2.0 from collection [wFirma.pl](https://doc.wfirma.pl/#auth-info-3854b824-3162-4c02-a47b-af2012073033)

### GETvat\_codes/find

{{host}}/vat\_codes/find?outputFormat=xml&inputFormat=xml&company\_id={{companyId}}

AUTHORIZATIONOAuth 2.0

This request is using OAuth 2.0 from collection [wFirma.pl](https://doc.wfirma.pl/#auth-info-3854b824-3162-4c02-a47b-af2012073033)

PARAMS

outputFormat

xml

Przyjmuje wartość json i xml

inputFormat

xml

Przyjmuje wartość json i xml

company\_id

{{companyId}}

Example Request

vat\_codes/find

curl

```curl
curl --location -g '{{host}}/vat_codes/find?outputFormat=xml&inputFormat=xml&company_id={{companyId}}' \
--data ''
```

Example Response

- Body
- Headers (0)

No response body

This request doesn't return any response body

No response headers

This request doesn't return any response headers

### GETvat\_codes/get

{{host}}/vat\_codes/get/{{vatCodeId}}?outputFormat=xml&inputFormat=xml&company\_id={{companyId}}

AUTHORIZATIONOAuth 2.0

This request is using OAuth 2.0 from collection [wFirma.pl](https://doc.wfirma.pl/#auth-info-3854b824-3162-4c02-a47b-af2012073033)

PARAMS

outputFormat

xml

Przyjmuje wartość json i xml

inputFormat

xml

Przyjmuje wartość json i xml

company\_id

{{companyId}}

Example Request

vat\_codes/get

View More

curl

```curl
curl --location -g '{{host}}/vat_codes/get/{{vatCodeId}}?outputFormat=xml&inputFormat=xml&company_id={{companyId}}' \
--data ''
```

Example Response

- Body
- Headers (0)

No response body

This request doesn't return any response body

No response headers

This request doesn't return any response headers

## vat\_contents

##### Pola

| **Nazwa pola** | **Przeznaczenie** | **Opis** |
| --- | --- | --- |
| _**id**_ | Tylko do odczytu | Klucz główny |
| _**object\_name**_ | Tylko do odczytu | `Invoice` |
| _**object\_id**_ | Tylko do odczytu | Id faktury |
| _**vat\_code\_id**_ | Odczyt i zapis | Zapis tylko przy fakturze z typem inny przychód |
| _**netto**_ | Odczyt i zapis | Zapis tylko przy fakturze z typem inny przychód |
| _**tax**_ | Odczyt i zapis | Zapis tylko przy fakturze z typem inny przychód |
| _**brutto**_ | Odczyt i zapis | Zapis tylko przy fakturze z typem inny przychód |
| _**created**_ | Tylko do odczytu | Data i godzina utworzenia wpisu |
| _**modified**_ | Tylko do odczytu | Data i godzina zmodyfikowania wpisu |

AUTHORIZATIONOAuth 2.0

This folder is using OAuth 2.0 from collection [wFirma.pl](https://doc.wfirma.pl/#auth-info-3854b824-3162-4c02-a47b-af2012073033)

## vehicle\_run\_rates

AUTHORIZATIONOAuth 2.0

This folder is using OAuth 2.0 from collection [wFirma.pl](https://doc.wfirma.pl/#auth-info-3854b824-3162-4c02-a47b-af2012073033)

### GETvehicle\_run\_rates/find

{{host}}/vehicle\_run\_rates/find?outputFormat=xml&inputFormat=xml&company\_id={{companyId}}

AUTHORIZATIONOAuth 2.0

This request is using OAuth 2.0 from collection [wFirma.pl](https://doc.wfirma.pl/#auth-info-3854b824-3162-4c02-a47b-af2012073033)

PARAMS

outputFormat

xml

Przyjmuje wartość json i xml

inputFormat

xml

Przyjmuje wartość json i xml

company\_id

{{companyId}}

Example Request

vehicle\_run\_rates/find

View More

curl

```curl
curl --location -g '{{host}}/vehicle_run_rates/find?outputFormat=xml&inputFormat=xml&company_id={{companyId}}'
```

Example Response

- Body
- Headers (0)

No response body

This request doesn't return any response body

No response headers

This request doesn't return any response headers

## vehicles

##### Akcje

- **find** \- pobieranie listy pojazdów
- **get** \- pobieranie szczegółów pojazdu o podanym **id**
- **add** \- dodawanie pojazdu
- **delete** \- usunięcie pojazdu o podanym **id**
- **edit** \- edycja pojazdu o podanym **id**

| **Nazwa pola** | **Przeznaczenie** | **Opis** |
| --- | --- | --- |
| _**id**_ | Tylko do odczytu | Klucz główny |
| _**register**_ | Odczyt i zapis | Numer rejestracyjny |
| _**type**_ | Odczyt i zapis | Typ pojazdu - **truck**, **car**, **motor**, **motor-bike** |
| _**ownership**_ | Odczyt i zapis | Forma własności - **leasing**, **private**, **other** |
| _**truck\_type**_ | Odczyt i zapis | Typ samochodu ciężarowego - **normal** (powyżej 3,5t i poniżej z VAT-1/ VAT-2), **quasi** (poniżej 3,5t bez VAT-1/ VAT-2) |
| _**tax\_purpose**_ | Odczyt i zapis | Sposób używania - **mixed**, **company** |
| _**vat\_leasing\_below\_limit**_ | Odczyt i zapis | Wartość poniżej 150 tys. zł - **0** lub **1** |
| _**vat\_leasing\_date**_ | Odczyt i zapis | Data umowy w formacie RRRR-MM-DD |
| _**vat\_leasing\_value**_ | Odczyt i zapis | Wartość pojazdu - wartość typu float |

AUTHORIZATIONOAuth 2.0

This folder is using OAuth 2.0 from collection [wFirma.pl](https://doc.wfirma.pl/#auth-info-3854b824-3162-4c02-a47b-af2012073033)

### POSTvehicles/add

{{host}}/vehicles/add/?outputFormat=xml&inputFormat=xml&company\_id={{companyId}}

AUTHORIZATIONOAuth 2.0

This request is using OAuth 2.0 from collection [wFirma.pl](https://doc.wfirma.pl/#auth-info-3854b824-3162-4c02-a47b-af2012073033)

HEADERS

Content-Type

application/xml

PARAMS

outputFormat

xml

inputFormat

xml

company\_id

{{companyId}}

Bodyraw (xml)

View More

xml

```xml
<api>
    <vehicles>
        <vehicle>
            <name>Aston Martin DB9</name>
            <register>DW435457</register>
            <type>car</type>
            <ownership>private</ownership>
            <truck_type>normal</truck_type>
            <tax_purpose>mixed</tax_purpose>
            <vat_leasing_below_limit>1</vat_leasing_below_limit>
            <vat_leasing_date>2020-03-12</vat_leasing_date>
            <vat_leasing_value>100</vat_leasing_value>
        </vehicle>
    </vehicles>
</api>
```

Example Request

vehicles/add

View More

curl

```curl
curl --location -g '{{host}}/vehicles/add/?outputFormat=xml&inputFormat=xml&company_id={{companyId}}' \
--header 'Content-Type: application/xml' \
--data '<api>
    <vehicles>
        <vehicle>
            <name>Aston Martin DB9</name>
            <register>DW435457</register>
            <type>car</type>
            <ownership>private</ownership>
            <truck_type>normal</truck_type>
            <tax_purpose>mixed</tax_purpose>
            <vat_leasing_below_limit>1</vat_leasing_below_limit>
            <vat_leasing_date>2020-03-12</vat_leasing_date>
            <vat_leasing_value>100</vat_leasing_value>
        </vehicle>
    </vehicles>
</api>'
```

Example Response

- Body
- Headers (0)

No response body

This request doesn't return any response body

No response headers

This request doesn't return any response headers

### GETvehicles/delete

{{host}}/vehicles/delete/{{vehicleId}}?outputFormat=xml&inputFormat=xml&company\_id={{companyId}}

AUTHORIZATIONOAuth 2.0

This request is using OAuth 2.0 from collection [wFirma.pl](https://doc.wfirma.pl/#auth-info-3854b824-3162-4c02-a47b-af2012073033)

PARAMS

outputFormat

xml

inputFormat

xml

company\_id

{{companyId}}

Example Request

vehicles/delete

View More

curl

```curl
curl --location -g '{{host}}/vehicles/delete/{{vehicleId}}?outputFormat=xml&inputFormat=xml&company_id={{companyId}}'
```

Example Response

- Body
- Headers (0)

No response body

This request doesn't return any response body

No response headers

This request doesn't return any response headers

### POSTvehicles/edit

{{host}}/vehicles/edit/{{vehicleId}}?outputFormat=xml&inputFormat=xml&company\_id={{companyId}}

AUTHORIZATIONOAuth 2.0

This request is using OAuth 2.0 from collection [wFirma.pl](https://doc.wfirma.pl/#auth-info-3854b824-3162-4c02-a47b-af2012073033)

PARAMS

outputFormat

xml

inputFormat

xml

company\_id

{{companyId}}

Example Request

vehicles/edit

View More

curl

```curl
curl --location -g --request POST '{{host}}/vehicles/edit/{{vehicleId}}?outputFormat=xml&inputFormat=xml&company_id={{companyId}}'
```

Example Response

- Body
- Headers (0)

No response body

This request doesn't return any response body

No response headers

This request doesn't return any response headers

### GETvehicles/get

{{host}}/vehicles/get/{{vehicleId}}?outputFormat=xml&inputFormat=xml&company\_id={{companyId}}

AUTHORIZATIONOAuth 2.0

This request is using OAuth 2.0 from collection [wFirma.pl](https://doc.wfirma.pl/#auth-info-3854b824-3162-4c02-a47b-af2012073033)

PARAMS

outputFormat

xml

inputFormat

xml

company\_id

{{companyId}}

Example Request

vehicles/get

View More

curl

```curl
curl --location -g '{{host}}/vehicles/get/{{vehicleId}}?outputFormat=xml&inputFormat=xml&company_id={{companyId}}'
```

Example Response

- Body
- Headers (0)

No response body

This request doesn't return any response body

No response headers

This request doesn't return any response headers