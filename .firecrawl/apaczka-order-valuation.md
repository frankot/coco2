# Dokumentacja Web API ver. 2

* * *

Menu


- [Wprowadzenie](https://panel.apaczka.pl/dokumentacja_api_v2.php#wprowadzenie)
- [Włączenie Web API](https://panel.apaczka.pl/dokumentacja_api_v2.php#wlaczenie-web-api)
- [Request](https://panel.apaczka.pl/dokumentacja_api_v2.php#request)
- [Autoryzacja - Signature](https://panel.apaczka.pl/dokumentacja_api_v2.php#autoryzacja)
- [Response](https://panel.apaczka.pl/dokumentacja_api_v2.php#response)
- [Endpoints](https://panel.apaczka.pl/dokumentacja_api_v2.php#endpoints)


  - [Lista zamówień](https://panel.apaczka.pl/dokumentacja_api_v2.php#endpoints-orders)
  - [Szczegóły zamówienia](https://panel.apaczka.pl/dokumentacja_api_v2.php#endpoints-order)
  - [List przewozowy](https://panel.apaczka.pl/dokumentacja_api_v2.php#endpoints-waybill)
  - [Zbiorcze potwierdzenie nadań](https://panel.apaczka.pl/dokumentacja_api_v2.php#endpoints-turn-in)
  - [Godziny odbioru](https://panel.apaczka.pl/dokumentacja_api_v2.php#endpoints-pickup_hours)
  - [Wycena zamówienia](https://panel.apaczka.pl/dokumentacja_api_v2.php#endpoints-order_valuation)
  - [Wysłanie zamówienia](https://panel.apaczka.pl/dokumentacja_api_v2.php#endpoints-order_send)
  - [Anulowanie zamówienia](https://panel.apaczka.pl/dokumentacja_api_v2.php#endpoints-cancel_order)
  - [Struktura serwisów](https://panel.apaczka.pl/dokumentacja_api_v2.php#endpoints-service_structure)
  - [Lista punktów nadań](https://panel.apaczka.pl/dokumentacja_api_v2.php#endpoints-points)

- [Struktury](https://panel.apaczka.pl/dokumentacja_api_v2.php#structure)


  - [order](https://panel.apaczka.pl/dokumentacja_api_v2.php#structure-order)

- [API SDK](https://panel.apaczka.pl/dokumentacja_api_v2.php#api-sdk)

## Wprowadzenie

Web API jest interfejsem programistycznym do serwisu apaczka.pl. Umożliwia integrację
zewnętrznych systemów w celu wysyłania przesyłek za pośrednictwem operatora logistycznego
apaczka.pl, bez konieczności logowania się na stronie www serwisu.
Do integracji w środowisku PHP można wykorzystać gotowe [API SDK](https://panel.apaczka.pl/dokumentacja_api_v2.php#api-sdk).


Zachęcamy również do zapoznania się z dokumentacją do integracji mapy punków odbioru na własnej stronie internetowej: [Dokumentacja API v2 Mapa](https://panel.apaczka.pl/dokumentacja_api_v2_mapa.php).


## Włączenie Web API

Do korzystania z apaczka Web API klient musi mieć podpisaną umowę z apaczka.pl oraz posiadać
konto w serwisie. W celu włączenia Web API należy skontaktować się z Centrum Wsparcia
Klienta lub skontaktować się w opiekunem handlowym. Aktualne dane kontaktowe
znajdują się w zakładce [kontakt](https://panel.apaczka.pl/kontakt.html).


Jeśli mają Państwo włączone Web API to w menu po lewej stronie serwisu znajduje się
zakładka Web API. Następnie należy w niej dodać aplikację podając jej nazwę. System
wygeneruje unikalne App ID oraz App Secret, które należy podać w swojej integracji. Możliwe
jest dodanie wielu aplikacji do obsługi różnych integracji.


## Request

Wszystkie dane należy kierować na odpowiedni endpoint na adres Web API:


https://www.apaczka.pl/api/v2/

Lista endpoint\`ów znajduje się w dokumentacji niżej. Każdy request powinien zawierać zestaw danych przesyłanych jako POST. Request powinien wyglądać w następujący sposób:


1

```
$requestData = [\
```\
\
2\
\
```\
    'app_id'    => $appId,\
```\
\
3\
\
```\
    'request'   => $data,\
```\
\
4\
\
```\
    'expires'   => $expires,\
```\
\
5\
\
```\
    'signature' => $signature\
```\
\
6\
\
```\
];
```

- **app\_id** \- identyfikator uzyskany po założeniu aplikacji w zakładce Web Api.
- **request** \- zestaw wymaganych danych zapisanych w strukturze JSON. Dane są opisane przy każdym endpoint.
- **expires** \- timestamp do kiedy ważny jest request. Timestamp musi być większy niż obecny. Maksymalna ważność request\`u to 30 minut.
- **signature** \- podpis zestawu danych. Sposób generowania tego klucza została opisana poniżej.

Po wysłaniu danych otrzymuje się informacje zwrotną - Response.

## Autoryzacja - Signature

Wszystkie przesyłane dane muszą zawierać signature wygenerowany na podstawie przesyłanych
danych. Signature musi być wygenerowana na podstawie App ID, nazwy endpoint\`u, danych w
request oraz daty wygaśnięcia ważności request\`u używając metody HMAC, z wykorzystaniem
algorytmu SHA256, podając jako klucz App Secret. Przykładowy kod do generowania signature w
PHP:


​x

1

```
function getSignature( $string, $key ) {
```

2

```
    return hash_hmac( 'sha256', $string, $key );
```

3

```
}
```

4

```
​
```

5

```
function stringToSign( $appId, $route, $data, $expires ) {
```

6

```
    return sprintf( "%s:%s:%s:%s", $appId, $route, $data, $expires );
```

7

```
}
```

8

```
​
```

9

```
$signature = getSignature( stringToSign( $appId, $route, $data, $expires ), $appSecret );
```

## Response

Każdy Request zwraca response w strukturze JSON. Przykładowy response wygląda tak:


5

1

```
{
```

2

```
   "status":200,
```

3

```
   "message":"",
```

4

```
   "response":{}
```

5

```
}
```

- **status** \- w tej chwili Web Api zwraca dwa statusy: 200 w momencie kiedy odpowiedź jest poprawna oraz 400 w momencie wystąpienia błędu.
- **message** \- informacja dot. request\`u. Najczęściej występuje w przypadku błędu.
- **response** \- zwracane dane. Opis zwracanych danych został opisany dla każdego endpoint\`u.

## Endpoints

Poniżej znajduje się lista endpoint\`ów do wykorzystania w request\`ach do Web Api apaczka.pl. To co jest opisane jako Request w endpoint\`ach to przykładowe dane, które należy wysłać w polu "request".


## Lista zamówień

https://www.apaczka.pl/api/v2/orders/

Endpoint wykorzystywany do pobierania listy ostatnich zamówień. Należy podać limit oraz stronę, którą chce się pobrać. Domyślnie jest zwracana pierwsza strona z 10 wynikami. Maksymalny limit zamówień na stronę jest równy 25.


Request

9

1

```
$requestData = [\
```\
\
2\
\
```\
    'app_id'    => $appId,\
```\
\
3\
\
```\
    'request'   => json_encode( [\
```\
\
4\
\
```\
        'page'  => $page,\
```\
\
5\
\
```\
        'limit' => $limit\
```\
\
6\
\
```\
    ] ),\
```\
\
7\
\
```\
    'expires'   => $expires,\
```\
\
8\
\
```\
    'signature' => $signature\
```\
\
9\
\
```\
];
```

Response

35

1

```
{
```

2

```
   "status":200,
```

3

```
   "message":"",
```

4

```
   "response":{
```

5

```
      "orders":[\
```\
\
6\
\
```\
         {\
```\
\
7\
\
```\
            "id":"",\
```\
\
8\
\
```\
            "service_id":"",\
```\
\
9\
\
```\
            "service_name":"",\
```\
\
10\
\
```\
            "waybill_number":"",\
```\
\
11\
\
```\
            "tracking_url":"",\
```\
\
12\
\
```\
            "status":"NEW",\
```\
\
13\
\
```\
            "shipments_count":1,\
```\
\
14\
\
```\
            "content":"",\
```\
\
15\
\
```\
            "comment":"",\
```\
\
16\
\
```\
            "receiver":{\
```\
\
17\
\
```\
               "name":"",\
```\
\
18\
\
```\
               "contact_person":"",\
```\
\
19\
\
```\
               "email":"",\
```\
\
20\
\
```\
               "phone":"",\
```\
\
21\
\
```\
               "line1":"",\
```\
\
22\
\
```\
               "line2":"",\
```\
\
23\
\
```\
               "postal_code":"",\
```\
\
24\
\
```\
               "city":"",\
```\
\
25\
\
```\
               "country_code":"",\
```\
\
26\
\
```\
               "foreign_address_id":""\
```\
\
27\
\
```\
            },\
```\
\
28\
\
```\
            "created":"",\
```\
\
29\
\
```\
            "delivered":"",\
```\
\
30\
\
```\
            "externalId":"",\
```\
\
31\
\
```\
            "supplier":""\
```\
\
32\
\
```\
         }\
```\
\
33\
\
```\
      ]
```

34

```
   }
```

35

```
}
```

W przypadku braku zamówień response zwróci również status 200.


## Szczegóły zamówienia

https://www.apaczka.pl/api/v2/order/:order\_id/

Endpoint wykorzystywany do pobierania szczegółów zamówienia. Należy podać numer zamówienia :order\_id powiązany ze swoim kontem. :order\_id jest numerem zamówienia a nie numerem listu przewozowego.


Request

6

1

```
$requestData = [\
```\
\
2\
\
```\
    'app_id'    => $appId,\
```\
\
3\
\
```\
    'request'   => json_encode( [] ),\
```\
\
4\
\
```\
    'expires'   => $expires,\
```\
\
5\
\
```\
    'signature' => $signature\
```\
\
6\
\
```\
];
```

Response

75

1

```
{
```

2

```
   "status":200,
```

3

```
   "message":"",
```

4

```
   "response":{
```

5

```
      "order":{
```

6

```
         "id":"",
```

7

```
         "supplier":"",
```

8

```
         "service_id":"",
```

9

```
         "service_name":"",
```

10

```
         "waybill_number":"",
```

11

```
         "pickup":{
```

12

```
            "type":"",
```

13

```
            "date":"",
```

14

```
            "hours_from":"",
```

15

```
            "hours_to":""
```

16

```
         },
```

17

```
         "pickup_number":"",
```

18

```
         "tracking_url":"",
```

19

```
         "status":"",
```

20

```
         "shipments_count":1,
```

21

```
         "shipments":[\
```\
\
22\
\
```\
            {\
```\
\
23\
\
```\
               "shipment_type_code":"",\
```\
\
24\
\
```\
               "weight":"",\
```\
\
25\
\
```\
               "weight_billable":"",\
```\
\
26\
\
```\
               "length":"",\
```\
\
27\
\
```\
               "width":"",\
```\
\
28\
\
```\
               "height":"",\
```\
\
29\
\
```\
               "content":"",\
```\
\
30\
\
```\
               "comment":"",\
```\
\
31\
\
```\
               "waybill_number":"",\
```\
\
32\
\
```\
               "is_nstd":false,\
```\
\
33\
\
```\
               "price":"",\
```\
\
34\
\
```\
               "price_vat":,\
```\
\
35\
\
```\
               "price_gross":""\
```\
\
36\
\
```\
            }\
```\
\
37\
\
```\
         ],
```

38

```
         "content":"",
```

39

```
         "comment":"",
```

40

```
         "sender":{
```

41

```
            "name":"",
```

42

```
            "contact_person":"",
```

43

```
            "email":"",
```

44

```
            "phone":"",
```

45

```
            "line1":"",
```

46

```
            "line2":"",
```

47

```
            "postal_code":"",
```

48

```
            "city":"",
```

49

```
            "country_code":"",
```

50

```
            "foreign_address_id":""
```

51

```
         },
```

52

```
         "receiver":{
```

53

```
            "name":"",
```

54

```
            "contact_person":"",
```

55

```
            "email":"",
```

56

```
            "phone":"",
```

57

```
            "line1":"",
```

58

```
            "line2":"",
```

59

```
            "postal_code":"",
```

60

```
            "city":"",
```

61

```
            "country_code":"",
```

62

```
            "foreign_address_id":""
```

63

```
         },
```

64

```
         "created":"",
```

65

```
         "delivered":"",
```

66

```
         "price":"",
```

67

```
         "price_var":,
```

68

```
         "price_gross":"",
```

69

```
         "cod":false,
```

70

```
         "cod_currency":"PLN",
```

71

```
         "declaration_value":false,
```

72

```
         "externalId":""
```

73

```
      }
```

74

```
   }
```

75

```
}
```

## List przewozowy

https://www.apaczka.pl/api/v2/waybill/:order\_id/

Endpoint wykorzystywany do pobierania etykiety do zamówienia. Należy podać numer zamówienia
:order\_id powiązany ze swoim kontem. :order\_id jest numerem zamówienia a nie numerem listu
przewozowego. List przewozowy jest zakodowany w base64.


Request

6

1

```
$requestData = [\
```\
\
2\
\
```\
    'app_id'    => $appId,\
```\
\
3\
\
```\
    'request'   => json_encode( [] ),\
```\
\
4\
\
```\
    'expires'   => $expires,\
```\
\
5\
\
```\
    'signature' => $signature\
```\
\
6\
\
```\
];
```

Response

8

1

```
{
```

2

```
   "status":200,
```

3

```
   "message":"",
```

4

```
   "response":{
```

5

```
      "waybill":"base64 file",
```

6

```
      "type":"pdf"
```

7

```
   }
```

8

```
}
```

## Zbiorcze potwierdzenie nadań

https://www.apaczka.pl/api/v2/turn\_in/

Endpoint wykorzystywany do pobierania Zbiorczego Potwierdzenia Nadań. Należy podać tablicę
:order\_id powiązany ze swoim kontem. :order\_id jest numerem zamówienia a nie numerem listu
przewozowego. Zbiorczego Potwierdzenia Nadań jest zwracane w formacie pdf zakodowany w base64.


Request

6

1

```
$requestData = [\
```\
\
2\
\
```\
    'app_id'    => $appId,\
```\
\
3\
\
```\
    'request'   => json_encode( ['order_ids' => [1,2,3]] ),\
```\
\
4\
\
```\
    'expires'   => $expires,\
```\
\
5\
\
```\
    'signature' => $signature\
```\
\
6\
\
```\
];
```

Response

7

1

```
{
```

2

```
   "status":200,
```

3

```
   "message":"",
```

4

```
   "response":{
```

5

```
      "turn_in":"base64 pdf"
```

6

```
   }
```

7

```
}
```

## Godziny odbioru

https://www.apaczka.pl/api/v2/pickup\_hours/

Endpoint służący do pobierania godzin odbioru przesyłek przez przewoźników. Należy podać kod pocztowy. Opcjonalne jest podanie id serwisu przez który chcemy nadać przesyłkę. Zwracane są dane na dzień pobierania godzin i następne trzy dni robocze oraz usunięcie indeksu z daty przy podawaniu godzinek.


Prosimy o niepobieranie tych informacji częściej niż raz na 30m.


Request

10

1

```
$requestData = [\
```\
\
2\
\
```\
    'app_id'    => $appId,\
```\
\
3\
\
```\
    'request'   => json_encode( [\
```\
\
4\
\
```\
        'postal_code' => $postal_code,\
```\
\
5\
\
```\
        'service_id' => $service_id,\
```\
\
6\
\
```\
        'remove_index' => false\
```\
\
7\
\
```\
    ] ),\
```\
\
8\
\
```\
    'expires'   => $expires,\
```\
\
9\
\
```\
    'signature' => $signature\
```\
\
10\
\
```\
];
```

Response

49

1

```
{
```

2

```
   "status":200,
```

3

```
   "message":"",
```

4

```
   "response":{
```

5

```
      "postal_code":"00-001",
```

6

```
      "hours":{
```

7

```
         "2018-09-28":{
```

8

```
            "date":"2018-09-28",
```

9

```
            "services":[\
```\
\
10\
\
```\
               {\
```\
\
11\
\
```\
                  "service":"",\
```\
\
12\
\
```\
                  "timefrom":"",\
```\
\
13\
\
```\
                  "timeto":""\
```\
\
14\
\
```\
               }\
```\
\
15\
\
```\
            ]
```

16

```
         },
```

17

```
         "2018-10-01":{
```

18

```
            "date":"2018-10-01",
```

19

```
            "services":[\
```\
\
20\
\
```\
               {\
```\
\
21\
\
```\
                  "service":"",\
```\
\
22\
\
```\
                  "timefrom":"",\
```\
\
23\
\
```\
                  "timeto":""\
```\
\
24\
\
```\
               }\
```\
\
25\
\
```\
            ]
```

26

```
         },
```

27

```
         "2018-10-02":{
```

28

```
            "date":"2018-10-02",
```

29

```
            "services":[\
```\
\
30\
\
```\
               {\
```\
\
31\
\
```\
                  "service":"",\
```\
\
32\
\
```\
                  "timefrom":"",\
```\
\
33\
\
```\
                  "timeto":""\
```\
\
34\
\
```\
               }\
```\
\
35\
\
```\
            ]
```

36

```
         },
```

37

```
         "2018-10-03":{
```

38

```
            "date":"2018-10-03",
```

39

```
            "services":[\
```\
\
40\
\
```\
               {\
```\
\
41\
\
```\
                  "service":"",\
```\
\
42\
\
```\
                  "timefrom":"",\
```\
\
43\
\
```\
                  "timeto":""\
```\
\
44\
\
```\
               }\
```\
\
45\
\
```\
            ]
```

46

```
         }
```

47

```
      }
```

48

```
   }
```

49

```
}
```

## Wycena zamówienia

https://www.apaczka.pl/api/v2/order\_valuation/

Wycena zamówienia na podstawie przesłanych danych w strukturze order. Endpoint zwraca wycenę dla wszystkich zamówień, które są wstanie zrealizować przesyłkę o zadanych parametrach. Jeśli zostanie podany serwis id to zostanie zwrócona wycena dla tego serwisu. Kwoty są podane w groszach.


Request

8

1

```
$requestData = [\
```\
\
2\
\
```\
    'app_id'    => $appId,\
```\
\
3\
\
```\
    'request'   => json_encode( [\
```\
\
4\
\
```\
        'order' => $order // wynikający ze struktury order\
```\
\
5\
\
```\
    ] ),\
```\
\
6\
\
```\
    'expires'   => $expires,\
```\
\
7\
\
```\
    'signature' => $signature\
```\
\
8\
\
```\
];
```

Response

12

1

```
{
```

2

```
   "status":200,
```

3

```
   "message":"",
```

4

```
   "response":{
```

5

```
      "price_table":{
```

6

```
         "1":{ // id serwisu
```

7

```
            "price": "",
```

8

```
            "price_gross": ""
```

9

```
         }
```

10

```
      }
```

11

```
   }
```

12

```
}
```

## Wysłanie zamówienia

https://www.apaczka.pl/api/v2/order\_send/

Złożenie zamówienia na podstawie przesłanych danych w strukturze order. Parametr is\_zebra jest opcjonalny. W przypadku jego nie podania etykieta będzie wygenerowana zgodnie z ustawieniami konta. W przypadku sukcesu endpoint zwraca informacje podstawowe zamówienia.


Request

8

1

```
$requestData = [\
```\
\
2\
\
```\
    'app_id'    => $appId,\
```\
\
3\
\
```\
    'request'   => json_encode( [\
```\
\
4\
\
```\
        'order' => $order // wynikający ze struktury order\
```\
\
5\
\
```\
    ] ),\
```\
\
6\
\
```\
    'expires'   => $expires,\
```\
\
7\
\
```\
    'signature' => $signature\
```\
\
8\
\
```\
];
```

Response

31

1

```
{
```

2

```
   "status":200,
```

3

```
   "message":"",
```

4

```
   "response":{
```

5

```
      "order":{
```

6

```
         "id":"",
```

7

```
         "service_id":"",
```

8

```
         "service_name":"",
```

9

```
         "waybill_number":"",
```

10

```
         "tracking_url":"",
```

11

```
         "status":"",
```

12

```
         "shipments_count":1,
```

13

```
         "content":"",
```

14

```
         "comment":"",
```

15

```
         "receiver":{
```

16

```
            "name":"",
```

17

```
            "contact_person":"",
```

18

```
            "email":"",
```

19

```
            "phone":"",
```

20

```
            "line1":"",
```

21

```
            "line2":"",
```

22

```
            "postal_code":"",
```

23

```
            "city":"",
```

24

```
            "country_code":"",
```

25

```
            "foreign_address_id":""
```

26

```
         },
```

27

```
         "created":"",
```

28

```
         "delivered":""
```

29

```
      }
```

30

```
   }
```

31

```
}
```

## Anulowanie zamówienia

https://www.apaczka.pl/api/v2/cancel\_order/:order\_id/

Endpoint wykorzystywany do anulowania zamówienia. Należy podać numer zamówienia ':order\_id' powiązany ze swoim kontem. ':order\_id' nie jest numerem listu przewozowego.


Request

6

1

```
$requestData = [\
```\
\
2\
\
```\
    'app_id'    => $appId,\
```\
\
3\
\
```\
    'request'   => json_encode( [] ),\
```\
\
4\
\
```\
    'expires'   => $expires,\
```\
\
5\
\
```\
    'signature' => $signature\
```\
\
6\
\
```\
];
```

Response

7

1

```
{
```

2

```
   "status":200,
```

3

```
   "message":"",
```

4

```
   "response":[\
```\
\
5\
\
```\
​\
```\
\
6\
\
```\
   ]
```

7

```
}
```

## Struktura serwisów

https://www.apaczka.pl/api/v2/service\_structure/

Informacje na temat struktury serwisu.


Prosimy o niepobieranie tych informacji częściej niż raz na 24h.


Request

6

1

```
$requestData = [\
```\
\
2\
\
```\
    'app_id'    => $appId,\
```\
\
3\
\
```\
    'request'   => json_encode( [] ),\
```\
\
4\
\
```\
    'expires'   => $expires,\
```\
\
5\
\
```\
    'signature' => $signature\
```\
\
6\
\
```\
];
```

Response

58

1

```
{
```

2

```
   "status":200,
```

3

```
   "message":"",
```

4

```
   "response":{
```

5

```
      "services":[ // serwisy\
```\
\
6\
\
```\
         {\
```\
\
7\
\
```\
            "service_id":"",\
```\
\
8\
\
```\
            "name":"",\
```\
\
9\
\
```\
            "delivery_time":"",\
```\
\
10\
\
```\
            "supplier":"",\
```\
\
11\
\
```\
            "domestic":"0",      // serwis: 1 - krajowy, 0 - zagraniczny\
```\
\
12\
\
```\
            "pickup_courier":"0",// zamówienie kurier: 0 - niedostępne, 1 - dostępne, 2 - wymagane\
```\
\
13\
\
```\
            "door_to_door":"1",  // serwis drzwi-drzwi: 0 - nie, 1 - tak\
```\
\
14\
\
```\
            "door_to_point":"0", // serwis drzwi-punkt\
```\
\
15\
\
```\
            "point_to_point":"0",// serwis punkt-drzwi\
```\
\
16\
\
```\
            "point_to_door":"1"  // serwis punkt-punkt\
```\
\
17\
\
```\
         }\
```\
\
18\
\
```\
      ],
```

19

```
      "options":{ // usługi dodatkowe do zamówienia
```

20

```
         "11":{
```

21

```
            "type":"bool",
```

22

```
            "name":"ROD",
```

23

```
            "desc":"Zwrot dokumentów"
```

24

```
         }
```

25

```
      },
```

26

```
      "package_type":{ // typy przesyłek
```

27

```
         "PACZKA":{
```

28

```
            "type":"PACZKA",
```

29

```
            "desc":""
```

30

```
         }
```

31

```
      },
```

32

```
      "points_type":[ // typy punktu odbioru\
```\
\
33\
\
```\
         "INPOST",\
```\
\
34\
\
```\
         "UPS",\
```\
\
35\
\
```\
         "POCZTA"\
```\
\
36\
\
```\
      ],
```

37

```
      "pickup_type":{ // typy nadania przesyłki
```

38

```
         "COURIER":{
```

39

```
            "type":"COURIER",
```

40

```
            "desc":""
```

41

```
         },
```

42

```
         "SELF":{
```

43

```
            "type":"SELF",
```

44

```
            "desc":""
```

45

```
         }
```

46

```
      },
```

47

```
      "unit_type":{ // typy jednostek (na potrzeby odprawy celnej)
```

48

```
         "PCS":{
```

49

```
            "type":"PCS",
```

50

```
            "desc":""
```

51

```
         },
```

52

```
         "PKG":{
```

53

```
             "type":"PKG",
```

54

```
             "desc":""
```

55

```
         }
```

56

```
      }
```

57

```
   }
```

58

```
}
```

## Lista punktów nadań

https://www.apaczka.pl/api/v2/points/:type

Endpoint zwraca informacje na temat punktów nadań dla :type podany w service\_structure w points\_type.


Prosimy o niepobieranie tych informacji częściej niż raz na 24h.


Request

9

1

```
$requestData = [\
```\
\
2\
\
```\
    'app_id'    => $appId,\
```\
\
3\
\
```\
    'request'   => json_encode( [\
```\
\
4\
\
```\
        'country_code' => $country_code, // Kod ISO 3166-1 alpha-2\
```\
\
5\
\
```\
        'subtype'      => $subtype       // Podtyp punktu\
```\
\
6\
\
```\
    ] ),\
```\
\
7\
\
```\
    'expires'   => $expires,\
```\
\
8\
\
```\
    'signature' => $signature\
```\
\
9\
\
```\
];
```

Response

31

1

```
{
```

2

```
   "status":200,
```

3

```
   "message":"",
```

4

```
   "response":{
```

5

```
      "points":{
```

6

```
         "1999":{
```

7

```
            "type":"",
```

8

```
            "subtype":"",
```

9

```
            "name":"",
```

10

```
            "address":{
```

11

```
               "line1":"",
```

12

```
               "line2":"",
```

13

```
               "state_code":"",
```

14

```
               "postal_code":"",
```

15

```
               "country_code":"",
```

16

```
               "city":"",
```

17

```
               "longitude":"",
```

18

```
               "latitude":""
```

19

```
            },
```

20

```
            "image_url":"",
```

21

```
            "open_hours":"",
```

22

```
            "option_cod":false,     // dostępna usługa COD
```

23

```
            "option_send":true,     // dostępne nadanie
```

24

```
            "option_deliver":true,  // dostępne doręczenie
```

25

```
            "additional_info":"",
```

26

```
            "distance":0,
```

27

```
            "foreign_address_id":""
```

28

```
         }
```

29

```
      }
```

30

```
   }
```

31

```
}
```

## Struktury

Poniżej znajduje się lista struktury wykorzystywanych w request\`ach do Web Api apaczka.pl.


## order

Struktura, jaka powinna zostać wysłana do Web Serwisu, gdzie wymagane są dane dotyczące zamówienia:


135

1

```
$order = json_encode( [\
```\
\
2\
\
```\
    'service_id'     => 0, // endpoint: service_structure response, key: services\
```\
\
3\
\
```\
    'address'        => [\
```\
\
4\
\
```\
        'sender'   => [\
```\
\
5\
\
```\
            'country_code'       => '', // Kod ISO 3166-1 alpha-2\
```\
\
6\
\
```\
            'name'               => '',\
```\
\
7\
\
```\
            'line1'              => '',\
```\
\
8\
\
```\
            'line2'              => '',\
```\
\
9\
\
```\
            'postal_code'        => '',\
```\
\
10\
\
```\
            'state_code'         => '',\
```\
\
11\
\
```\
            'city'               => '',\
```\
\
12\
\
```\
            'is_residential'     => 0,  // adres prywatny: 0 / 1\
```\
\
13\
\
```\
            'contact_person'     => '',\
```\
\
14\
\
```\
            'email'              => '',\
```\
\
15\
\
```\
            'phone'              => '', // (\+?\d{9,20})\
```\
\
16\
\
```\
            'foreign_address_id' => ''  // endpoint: points\
```\
\
17\
\
```\
        ],\
```\
\
18\
\
```\
        'receiver' => [\
```\
\
19\
\
```\
            'country_code'              => '', // Kod ISO 3166-1 alpha-2\
```\
\
20\
\
```\
            'name'                      => '',\
```\
\
21\
\
```\
            'line1'                     => '',\
```\
\
22\
\
```\
            'line2'                     => '',\
```\
\
23\
\
```\
            'postal_code'               => '',\
```\
\
24\
\
```\
            'state_code'                => '',\
```\
\
25\
\
```\
            'city'                      => '',\
```\
\
26\
\
```\
            'is_residential'            => 0,  // 0 / 1\
```\
\
27\
\
```\
            'contact_person'            => '',\
```\
\
28\
\
```\
            'email'                     => '',\
```\
\
29\
\
```\
            'phone'                     => '', // (\+?\d{9,20})\
```\
\
30\
\
```\
            'foreign_address_id'        => '', // endpoint: points\
```\
\
31\
\
```\
            'foreign_address_subtype'   => ''  // zgodne z wartością zwróconą dla punktu przez points, niewymagane\
```\
\
32\
\
```\
        ]\
```\
\
33\
\
```\
    ],\
```\
\
34\
\
```\
    'option'         => [ // endpoint: service_structure response, key: options\
```\
\
35\
\
```\
        '31' => 1, // powiadomienie sms,\
```\
\
36\
\
```\
        '11' => 1, // rod\
```\
\
37\
\
```\
        '19' => 1, // dostawa w sobotę,\
```\
\
38\
\
```\
        '25' => 1, // dostawa w godzinach,\
```\
\
39\
\
```\
        '58' => 1, // ostrożnie\
```\
\
40\
\
```\
    ],\
```\
\
41\
\
```\
    'notification'   => [\
```\
\
42\
\
```\
        'new'      => [ // Powiadomienia o utworzeniu przesyłki\
```\
\
43\
\
```\
            'isReceiverEmail' => 0, // 0 / 1\
```\
\
44\
\
```\
            'isReceiverSms'   => 0, // 0 / 1\
```\
\
45\
\
```\
            'isSenderEmail'   => 0  // 0 / 1\
```\
\
46\
\
```\
        ],\
```\
\
47\
\
```\
        'sent'     => [ // Powiadomienia o wysłaniu przesyłki\
```\
\
48\
\
```\
            'isReceiverEmail' => 0, // 0 / 1\
```\
\
49\
\
```\
            'isReceiverSms'   => 0, // 0 / 1\
```\
\
50\
\
```\
            'isSenderEmail'   => 0, // 0 / 1\
```\
\
51\
\
```\
            'isSenderSms'     => 0, // 0 / 1\
```\
\
52\
\
```\
        ],\
```\
\
53\
\
```\
        'exception' => [ // Powiadomienia o wyjątku\
```\
\
54\
\
```\
            'isReceiverEmail' => 0, // 0 / 1\
```\
\
55\
\
```\
            'isReceiverSms'   => 0, // 0 / 1\
```\
\
56\
\
```\
            'isSenderEmail'   => 0, // 0 / 1\
```\
\
57\
\
```\
            'isSenderSms'     => 0, // 0 / 1\
```\
\
58\
\
```\
        ],\
```\
\
59\
\
```\
        'delivered' => [ // Powiadomienia o doręczeniu\
```\
\
60\
\
```\
            'isReceiverEmail' => 0, // 0 / 1\
```\
\
61\
\
```\
            'isReceiverSms'   => 0, // 0 / 1\
```\
\
62\
\
```\
            'isSenderEmail'   => 0, // 0 / 1\
```\
\
63\
\
```\
            'isSenderSms'     => 0, // 0 / 1\
```\
\
64\
\
```\
        ]\
```\
\
65\
\
```\
    ],\
```\
\
66\
\
```\
    'shipment_value' => 0,  // (int) wartość w groszach\
```\
\
67\
\
```\
    'shipment_currency' => 'PLN'\
```\
\
68\
\
```\
    'cod'            => [\
```\
\
69\
\
```\
        'amount'      => 0, // (int) wartość w groszach\
```\
\
70\
\
```\
        'currency'    => 'PLN',\
```\
\
71\
\
```\
        'bankaccount' => '' // (\d{26}) tylko cyfry,\
```\
\
72\
\
```\
        'country'     => 'PLN',\
```\
\
73\
\
```\
    ],\
```\
\
74\
\
```\
    'pickup'         => [\
```\
\
75\
\
```\
        'type'       => 'SELF', // endpoint: service_structure response, key: pickup_type\
```\
\
76\
\
```\
        'date'       => '',     // Y-m-d\
```\
\
77\
\
```\
        'hours_from' => '',     // H:i - pickup_hours\
```\
\
78\
\
```\
        'hours_to'   => ''      // H:i - pickup_hours\
```\
\
79\
\
```\
    ],\
```\
\
80\
\
```\
    'shipment'       => [\
```\
\
81\
\
```\
        [\
```\
\
82\
\
```\
            'dimension1'         => 10, // (int) długość (length) cm\
```\
\
83\
\
```\
            'dimension2'         => 20, // (int) szerokość (width) cm\
```\
\
84\
\
```\
            'dimension3'         => 30, // (int) wysokość (height) cm\
```\
\
85\
\
```\
            'weight'             => 1,  // (float(5,1)) kg\
```\
\
86\
\
```\
            'is_nstd'            => 0,  // 0 / 1\
```\
\
87\
\
```\
            'shipment_type_code' => 'PACZKA' // endpoint: service_structure response, key: package_type\
```\
\
88\
\
```\
            'customs_data'       => [   // dane odprawy celnej (wymagane w przypadku FedEx International)\
```\
\
89\
\
```\
                [\
```\
\
90\
\
```\
                    'name'        => 'nazwa towaru',\
```\
\
91\
\
```\
                    'description' => 'opis towaru',\
```\
\
92\
\
```\
                    'made_in'     => 'CN',  // kraj produkcji ISO 3166-1 alpha-2\
```\
\
93\
\
```\
                    'unit_type'   => 'PCS', // jednostka 'PCS' - sztuka / 'PKG' - opakowanie\
```\
\
94\
\
```\
                    'unit_price'  => 1550,  // (int) cena/wartość jednostkowa w groszach\
```\
\
95\
\
```\
                    'unit_weight' => 1,     // (float(5,1)) waga jednostki\
```\
\
96\
\
```\
                    'quantity'    => 3,     // (int) ilość opakowań/sztuk (w zależności od unit_type)\
```\
\
97\
\
```\
                    'hs_code'     => '',    // (string) kod HS (Harmonized System)\
```\
\
98\
\
```\
                ],\
```\
\
99\
\
```\
            ]\
```\
\
100\
\
```\
        ],\
```\
\
101\
\
```\
    ],\
```\
\
102\
\
```\
    'customs'        => [\
```\
\
103\
\
```\
        'content_type'   => 'SALE',  // rodzaj odprawy celnej:\
```\
\
104\
\
```\
                                     //   'SALE'               - Towary\
```\
\
105\
\
```\
                                     //   'GIFT'               - Podarunek\
```\
\
106\
\
```\
                                     //   'SAMPLE'             - Próbki\
```\
\
107\
\
```\
                                     //   'RETURN'             - Towary zwracane\
```\
\
108\
\
```\
                                     //   'RETURNING'          - Towary powracające\
```\
\
109\
\
```\
                                     //   'PASSIVE_PROCESSING' - Uszlachetnianie bierne\
```\
\
110\
\
```\
                                     //   'DOCUMENTS'          - Dokumenty\
```\
\
111\
\
```\
        'EORI_number'    => '',      // numer EORI nadawcy\
```\
\
112\
\
```\
        'invoice_source' => 0,       // źródło faktury:\
```\
\
113\
\
```\
                                     //   0 - dostarcz plik (documents.invoice wymagane)\
```\
\
114\
\
```\
                                     //   1 - generuj automatycznie (documents.invoice ignorowane)\
```\
\
115\
\
```\
        'documents'      => [\
```\
\
116\
\
```\
            'invoice'        => [    // faktura — wymagana gdy invoice_source = 0\
```\
\
117\
\
```\
                'base64'    => '',   // zawartość pliku PDF zakodowana w base64\
```\
\
118\
\
```\
                'fileName'  => '',   // nazwa pliku (np. 'faktura.pdf')\
```\
\
119\
\
```\
            ],\
```\
\
120\
\
```\
            'clearance_form' => [    // dokument odprawy celnej\
```\
\
121\
\
```\
                'base64'    => '',\
```\
\
122\
\
```\
                'fileName'  => '',\
```\
\
123\
\
```\
            ],\
```\
\
124\
\
```\
            'authorization'  => [    // upoważnienie\
```\
\
125\
\
```\
                'base64'    => '',\
```\
\
126\
\
```\
                'fileName'  => '',\
```\
\
127\
\
```\
            ],\
```\
\
128\
\
```\
            // opcjonalnie dodatkowe dokumenty pod dowolnym kluczem:\
```\
\
129\
\
```\
            // 'other_nazwa' => ['base64' => '', 'fileName' => ''],\
```\
\
130\
\
```\
        ],\
```\
\
131\
\
```\
    ],\
```\
\
132\
\
```\
    'comment'        => '',\
```\
\
133\
\
```\
    'content'        => '',\
```\
\
134\
\
```\
    'is_zebra'       => 0, // 0 / 1 (wartość opcjonalna, w przypadku nie podania etykieta będzie zgodna z ustawieniami konta)\
```\
\
135\
\
```\
] );
```

## API SDK

Zachęcamy do skorzystania z naszego SDK, w celu przeprowadzenia integracji z serwisem apaczka.pl. SDK można pobrać z tego [linku](https://panel.apaczka.pl/files/sdk-apiv2-0.3.zip).


## Changelog

**1.2.0 - 2026-03-13**

- Dodanie pola `hs_code` do struktury `customs_data` w elemencie przesyłki
- Dodanie struktury `customs` zawierającej: `content_type` (rodzaj odprawy), `EORI_number`, `invoice_source` (0 — plik, 1 — generuj) oraz `documents` (faktura, dokument odprawy, upoważnienie, inne)

**1.1.2 - 2022-08-22**

- Dodanie do '/points' request możliwości zdefiniowania 'country\_code'

**1.1.1 - 2022-07-29**

- Dodanie do '/service\_structure' response informacji o braku/możliwości/konieczności zamówienia kuriera ('pickup\_courier'), w szczegółach serwisu

**1.1.0 - 2022-05-19**

- Dodanie struktury odprawy celnej dla metody '/order\_send'
- Dodanie informacji o punkcie na temat pobrania oraz możliwości nadania i odbioru do '/points/:type' response

**1.0.1 - 2022-02-10**

- Dodanie 'type' do '/waybill' response

**1.0.0 - 2019-09-25**

- Dodanie notyfikacji dla przesyłki
- Poprawki dot. obsługi etykiet