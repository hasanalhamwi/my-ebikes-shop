# Afbeeldingenmap

Elke fiets heeft een eigen submap met dezelfde naam als het "id"-veld in data/bikes.json, bijvoorbeeld:

```
images/villette-hollande/cover.jpg
images/villette-hollande/1.jpg
images/villette-hollande/2.jpg
```

Nieuwe fiets toevoegen:
1. Maak hier een nieuwe map aan met dezelfde naam als het "id" van de fiets in bikes.json.
2. Upload een hoofdfoto met de naam cover.webp (of cover.jpg), en eventueel extra foto's met een naam naar keuze.
3. Zet dezelfde bestandsnamen in de velden "cover" en "gallery" in data/bikes.json.

## Aanbevolen bestandsformaat: WEBP

Vanaf nu gebruiken we bij voorkeur **.webp** in plaats van .jpg voor alle nieuwe foto's (cover-foto's en slider-foto's), omdat WEBP aanzienlijk kleiner is in bestandsgrootte bij gelijke kwaliteit — dat betekent een sneller ladende website. Voorbeeld voor een nieuwe fiets:

```
images/nieuwe-fiets/cover.webp
images/nieuwe-fiets/1.webp
images/nieuwe-fiets/2.webp
```

En in data/bikes.json:
```json
"cover": "images/nieuwe-fiets/cover.webp",
"gallery": [
  "images/nieuwe-fiets/1.webp",
  "images/nieuwe-fiets/2.webp"
]
```

De code werkt met elk bestandsformaat (.jpg, .png, .webp) zonder enige aanpassing — je hoeft alleen de bestandsnaam in bikes.json exact te laten overeenkomen met de geüploade afbeelding. Bestaande fietsen met .jpg-foto's hoeven niet aangepast te worden; alleen nieuwe foto's gebruiken voortaan .webp.

## Hero-foto (bovenaan de homepage)

```
images/hero.webp
```

Gebruik bij voorkeur een foto met een liggend (landscap) formaat, minimaal 1000 pixels breed.
Tip: gebruik een van je eigen fietsfoto's in plaats van een foto van internet — dat is altijd auteursrechtelijk veilig en oogt persoonlijker.

## Logo

`images/logo.svg` is het logo dat nu in de header en als favicon wordt gebruikt.
