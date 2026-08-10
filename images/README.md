# Afbeeldingenmap

Elke fiets heeft een eigen submap met dezelfde naam als het "id"-veld in data/bikes.json, bijvoorbeeld:

```
images/villette-hollande/cover.jpg
images/villette-hollande/1.jpg
images/villette-hollande/2.jpg
```

## Aanbevolen bestandsformaat: WEBP

Gebruik bij voorkeur .webp in plaats van .jpg voor nieuwe foto's (kleiner bestand, snellere website).
De code werkt met elk formaat (.jpg, .png, .webp) — je moet alleen de bestandsnaam in bikes.json
exact laten overeenkomen met de geuploade afbeelding.

## Belangrijk: 9 fietsen hebben nu placeholder-foto's in bikes.json

Voor deze fietsen staat in data/bikes.json een geschat aantal foto's (1.jpg, 2.jpg, 3.jpg):
altera, amslod-hamilton-sx, colorado-arrow, gazelle-medeo-x-tra-innergy,
sparta-e-motion-c2, stella-albatros, stella-vicenza.

Voor sparta-f7-e staat 9 foto's (1.jpg t/m 9.jpg) en voor sparta-f8-e-limited-series 8 foto's
(1.jpg t/m 8.jpg), gebaseerd op het aantal bestanden dat al in de lokale mappen stond.

**Controleer na het uploaden altijd of het aantal foto's in de map overeenkomt met het aantal
in het "gallery"-veld van die fiets in bikes.json — voeg regels toe of verwijder ze indien nodig.**

## Hero-foto (bovenaan de homepage)

```
images/hero.webp
```

## Logo

`images/logo.svg` — logo in de header en als favicon.
