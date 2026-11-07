# AZEL Motion Studio

Un pack de production pour réaliser une vidéo de démonstration Azel avec Claude Code et Remotion.

## Commencer

1. Ouvrir ce dossier dans Claude Code.
2. Lui transmettre le contenu de `PROMPT_POUR_CLAUDE.txt`.
3. Garder `public`, `src`, `docs`, les licences et le fichier de verrouillage des dépendances ensemble.

Le dossier `renders` contient le master vertical Full HD de 24 secondes et son aperçu léger. Ouvrir `renders/OUVRIR_APERCU.html` pour consulter le pack.

Le projet contient déjà une base Remotion animée. Les textes, le curseur, les contrôles et les fenêtres sont des calques indépendants. Les quatre images générées sont des références artistiques et des visuels utilisables séparément.

## Contenu

- Quatre keyframes publicitaires verticaux, en PNG, avec leur provenance.
- Quinze captures réelles du site et de sa personnalisation. Cinq états du thème Pilates, quatre exemples sur mobile, galerie et interface réelle.
- Douze visuels de showroom supplémentaires, selon le contenu du dossier.
- Le symbole original, sa vidéo, des SVG transparents et les éléments graphiques utiles.
- Les polices locales Instrument Sans et Instrument Serif, avec licences OFL.
- Quatre effets sonores synthétiques originaux, WAV 48 kHz.
- Un film de 24 secondes et une déclinaison de 15 secondes, en code.
- Des compositions verticales 9:16, feed 4:5 et paysage 16:9.
- Direction artistique, storyboard, spécification d’animation, texte et guide d’adaptation.

`ASSETS.json` donne les dimensions, empreintes et chemins exacts. Le dossier `renders` contient les rendus de contrôle inclus dans cette livraison.

## Lancer le projet

Node.js 20 ou plus récent et npm.

```sh
npm ci
npm run studio
```

Pour vérifier le code et produire le film vertical en Full HD.

```sh
npm run check
npm run render
```

Autres rendus.

```sh
npm run render:short
npm run render:feed
npm run render:wide
npm run preview
npm run stills
```

Le premier rendu peut télécharger le navigateur utilisé par Remotion. Si un Chrome compatible existe déjà, utiliser l’option `--browser-executable` de la CLI. Les scripts Node lisent aussi la variable optionnelle `CHROME_PATH`.

## Modifications rapides

| Besoin | Fichier |
| --- | --- |
| Couleurs et durée des séquences | `src/theme.ts` |
| Texte, mise en scène et personnalisation | `src/scenes/Scenes.tsx` |
| Fenêtres, symbole, curseur et typographie | `src/components/Primitives.tsx` |
| Sons et enchaînement | `src/Film.tsx` |
| Formats et durée totale | `src/Root.tsx` |
| Captures de sites | `public/screens` et `public/showroom` |

Si une durée change dans `theme.ts`, synchroniser `durationInFrames` dans `Root.tsx`. Les images restent des captures des fonctionnalités actuelles. Les interfaces illustrées dans le film sont une mise en scène de ces possibilités, pas un CMS client livré.

## Livrables conseillés

Un master 24 secondes, une version 15 secondes, trois formats, un poster et une version sans son. Le rendu reste compréhensible sans voix off. Les identifiants des compositions sont visibles dans Remotion Studio.
