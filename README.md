# Threads

Dette prosjektet er en del av vurderingen i emnet "INFT2002 Webutvikling". Målet med prosjektet er å
lage en webapplikasjon som ligner på "Reddit" og gamle "Forums". Hovedfunsksjonen til "Threads" er å
oprette og lagre "Threads" som består av tittel, innhold, likes, tag og en unik thread-ID, samt
"Subthreads" med sitt eget innhold, subthread-ID, likes og en tilknyttet thread-ID (tenk Subthreads
som en reply eller en kommentar) i en ekstern database, i dette tilfellet MYSQL, og vise det på en
nettside.

## Mal brukt (eksempelkode)

Når vi startet arbeidet med prosjektet, benyttet vi oss av eksempelkoden fra leksjonen om "Klient -
server" som utgangspunkt og begynte å utvikle webapplikasjonen derfra. Dette er årsaken til at noen
av filnavnene, metodene og variablene stemmer som beskrivet i prosjektbeskrivelsen. Et eksempel på
dette er client/src/task-service.tsx filen, når den burde være thread-service.tsx. Eksempelkoden
ligger her: https://gitlab.com/ntnu-dcst2002/todo-client_server.

## Environment Variables/ Configuration files

For å kjøre dette prosjektet, må du legge til følgende enviroment variables i konfigurasjonsfilene
dine.

`server/config.ts`:

```ts
process.env.MYSQL_HOST = 'mysql.stud.ntnu.no';
process.env.MYSQL_USER = 'tvhnguye_threads';
process.env.MYSQL_PASSWORD = '123456';
process.env.MYSQL_DATABASE = 'tvhnguye_threads_dev';
```

`server/test/config.ts`:

```ts
process.env.MYSQL_HOST = 'mysql.stud.ntnu.no';
process.env.MYSQL_USER = 'tvhnguye_threads';
process.env.MYSQL_PASSWORD = '123456';
process.env.MYSQL_DATABASE = 'tvhnguye_threads_test';
```

### URL og port

Selve webapplikasjonen er på localhost:3000

## VPN Database connection

For å koble til databasen utenfor NTNU, må du bruke en VPN. Her er nedlastingslenken til en fra
NTNU: https://apps.ntnu.no/app/0bd6f474-06a0-11ee-9729-005056b25bcf

### Koble til VPN

1. Åpne programmet Cisco Anyconnect
2. Fyll inn vpn.ntnu.no i tekstfeltet som dukker opp
3. Trykk "Connect"
4. Fyll inn ditt NTNU-brukernavn og passord
5. Trykk "OK"
6. Du vil få opp et vindu for å logge på NTNUs tofaktorautentisering. Fyll inn brukernavn@ntnu.no,
   passord og så kode.

## Install dependencies

Installer avhengigheter og start serveren:

```sh
cd server
npm install
npm start
```

### Run server tests:

Kjør server tests:

```sh
npm test
```

### Bundle client files to be served through server

Installer avhengigheter og bunt sammen klientfiler:

```sh
cd client
npm install
npm start
```

## Nåværende funksjonalitet

For øyeblikker har "Threads" følgende funksjonalitet:

#### Threads

- Opprette Threads
- Hente Threads
- Vise Threads
- Endre Threads (buggy)
- Sortere og Søke i Threads
- Like Threads
- Favorite Threads
- Slette Threads

#### Subthreads

- Opprette Subthreads
- Vise Subthreads
- Slette Subthreads
- Like Subthreads

#### Tags

- Hent informasjon om Tags
- Alle Tags med totalt antall Threads per Tag

#### Favorites

- Viser dine favorites
- Kan slette dine favorites

#### Kjente bugs

- Man kan legge til en Thread som favoritt flere ganger og det vises i Favorites siden
- På hovedsiden likes til Threads vises ikke riktig (Viser bare 0)
- Når man edit'er en Thread så oppdaterer den seg ikke automatisk på webapplikasjonen og må edites
  igjen for å oppdatere displayen.

#### Planlagt men ikke fullført funksjonalitet

- Mulighet til å oppdatere Threads og Subthreads
- Mulighet til å sortere Subthreads etter likes

# Oppgavefordeling

## Thai Viet Hong Nguyen

- Laget basis funksjonalitet for å hente ut/ opprette/ endre og slette Threads
- Gjorde det mulig til å søke etter Threads
- Sikret at en Thread må ha en tag
- Laget en system for å vise en liste over de mest populære Threads (flest likes)
- Laget et system for å vise hvor mye Likes en Thread har
- Laget et system for å vise en liste over alle unike tagger og antall Threads for hver tag.
- Laget et system for å kunne lagre Threads som favoritter som vises i en egen favoritt-liste.

## Simen Bjerke

- Laget et system som gjorde det mulig til å stemme opp eller ned på en Thread
- Laget et system som gjorde det mulig til å stemme opp eller den på en Subthread.
- Laget funksjonaliteten for å hente ut alle Subthreads på hovedsiden
- Laget funksjonaliteten til å legge til nye Subthreads på hovedsiden
- Laget funksjonaliteten til å slette en Subthread på hovedsiden
- Laget funksjonaliteten for å slette en Thread på hovedsiden

### Artiom Glotov

- Styling
- ReadME-fil
- Video
