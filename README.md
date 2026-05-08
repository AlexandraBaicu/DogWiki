# Dog Explorer - Documentatie Proiect

**Nume Prenume:** Baicu Alexandra-Paula
**Grupa:** 1145 SIMPRE
**Link video prezentare:** 
**Link publicare (GitHub/Vercel):** 

1. Introducere
# DoggWiki 🐾

Salut! DoggWiki este o mica aplicatie web pe care am facut-o ca sa poti cauta super usor informatii si poze cu diferite rase de caini. Am facut proiectul acesta in React (mai exact cu Vite) ca sa demonstrez practic cum pot sa integrez si sa gestionez mai multe servicii de cloud in aceeasi aplicatie (partea de conturi/logare si partea din care scot date prin API-uri REST).

2. Descriere problema
Problema de la care am plecat e destul de simpla: de multe ori, cand vrei sa afli lucruri despre o rasa de caine, trebuie sa cauti poze pe un site, apoi sa intri pe Wikipedia pentru informatii, apoi sa cauti cat traieste si asa mai departe. 
Asa ca aplicatia mea rezolva treaba asta: **centralizeaza toate datele intr-o singura pagina simpla**. Folosind servicii cloud, site-ul aduce instant poze, texte si detalii din mai multe surse, iar pe deasupra tine minte istoricul si favoritele tale datorita unui sistem de logare pus la punct.

3. Descriere API
Ca sa functioneze, aplicatia foloseste 3 servicii din cloud (dintre care 2 comunica prin API REST):

1. **Firebase Authentication (Backend-as-a-Service):** Asta e primul meu serviciu din cloud. Il folosesc ca sa ma ocup de creare de conturi, logare si pastrarea sesiunii utilizatorului. Partea buna e ca securizeaza site-ul si imi permite sa salvez ce cautari si favorite are fiecare user pe baza email-ului.
2. **Wikipedia REST API:** Asta e al doilea serviciu cloud (care e open-source). Apelez endpoint-ul de la Wikipedia (`ro.wikipedia.org/api/rest_v1/`) ca sa extrag in timp real pe site rezumate cu informatii despre rasa cautata.
3. **Dog API (`dog.ceo`):** Un alt API public pe care l-am adaugat ca sa imi dea poze random si de calitate cu rasa pe care o scrie user-ul.

4. Flux de date 

Am folosit o arhitectura Client-Server clasica. Frontend-ul (interfata in React) face request-uri asincrone spre serverele externe ca sa aduca date.

**Autentificare si Autorizare (prin Firebase):**
- User-ul isi baga datele in pagina de Login.
- React trimite request-ul, criptat, spre serverele Google Firebase.
- Daca totul este ok, Firebase trimite inapoi un Token de autorizare, iar functia de state prinde token-ul si te lasa in aplicatie. Fara logarea asta, nu se poate ajunge pe pagina unde se fac cererile catre restul API-urilor.

**Exemplu Request / Response (la Wikipedia REST API):**
Sa zicem ca user-ul cauta rasa "Husky". In spate, aplicatia face un request HTTP catre serverul Wikipedia.
- **Metoda HTTP:** `GET`
- **Endpoint:** `https://ro.wikipedia.org/api/rest_v1/page/summary/Husky`
- **Autentificare:** Nu e nevoie, e un API public gratuit.

**Cum arata raspunsul pe care il primesc de la ei (JSON Extras - Cod 200 OK):**
```json
{
  "title": "Husky",
  "extract": "Husky este un nume general pentru o categorie de caini folositi pentru a trage sanii in regiunile nordice. Acestia se disting printr-un stil de alergare rapid si rezistenta ridicata.",
  "type": "standard"
}
```
Dupa ce prind datele acestea asincron (cu async/await), extrag doar proprietatea `extract` din JSON si o afisez reorganizata pe ecran. In paralel se face si request-ul pentru poza la `https://dog.ceo/api/breed/husky/images/random` ca sa se incarce deodata cu textul.

5. Capturi ecran aplicatie

6. Referinte
1.React.js Official Documentation (Pentru arhitectura componentelor si state management) - https://react.dev/
2.Vite.js Guide (Pentru configurarea rapida a mediului de dezvoltare) - https://vitejs.dev/guide/
3.Firebase Authentication Docs (Pentru implementarea serviciului cloud de logare si persistenta) - https://firebase.google.com/docs/auth/web/start
4.Wikipedia REST API (Documentatia pentru endpoint-ul gratuit de informatii) - https://en.wikipedia.org/api/rest_v1/
5.Dog API (Dog CEO) (Pentru preluarea de fotografii) - https://dog.ceo/dog-api/
6.Lucide Icons (Pentru pachetul de iconite moderne folosite in interfata) - https://lucide.dev/

