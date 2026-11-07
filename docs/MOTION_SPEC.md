# Spécification de mouvement

## Moteur

Toutes les animations sont déterministes. Utiliser `useCurrentFrame`, `interpolate` et, si utile, `spring`. Les vidéos de référence doivent être lues avec le composant vidéo Remotion adapté à la version utilisée. Ne pas recourir à une animation CSS indépendante du temps du rendu.

## Rythme

- Entrée de titre en 12 à 15 images avec un déplacement de 28 pixels maximum.
- Arrivée de fenêtre en 18 à 25 images. Décélération rapide, puis tenue.
- Pression de contrôle en 3 à 5 images. Retour sans rebond excessif.
- Une phase de résultat lisible après la saisie ou le changement de couleur.
- Une pause longue sur l’adresse, environ les deux dernières secondes.

Les fenêtres bougent davantage que les textes. La typographie importante tient sa position après l’entrée. La perspective reste limitée pour garder les créations reconnaissables.

## Courbes

L’entrée utilise la fonction `1 - (1 - t)^4`, proche d’une décélération franche. Pour un déplacement entre deux positions, une interpolation douce ou un spring amorti convient. Si un spring est introduit, commencer avec damping 26, stiffness 140 et mass 1, puis regarder le rendu à vitesse réelle.

Un seul ressort par geste. Un curseur ne rebondit pas après un clic. Les choix de palette deviennent immédiatement compréhensibles. Les boucles décoratives ne sont pas nécessaires.

## Interaction du nom

1. Le contrôle arrive.
2. Le curseur se pose dans le champ.
3. Le nom se saisit.
4. La bonne capture se révèle.
5. Le résultat reste visible.

Les captures du Pilates avant et après ont le même format et le même cadrage. Le dévoilement se fait dans une fenêtre fixe. Ne pas inventer le texte du site dans l’image.

## Interaction de couleur

Les quatre états sont olive, encre, terre et prune. Les captures viennent du vrai thème. Les pastilles expriment ici un choix d’ambiance du thème Pilates. Ce film ne promet pas la même collection d’ambiances à tous les concepts.

Chaque clic sonne au même moment que le changement d’état. Le curseur vise le centre de la pastille. La capture suivante garde ses proportions.

## Performance

Les images sont locales. Éviter les captures géantes pleines pages dans une animation où seul le premier écran est visible. Limiter les filtres coûteux. Les ombres sont contenues aux fenêtres. Aucun iframe du site dans le rendu.

## Lisibilité

Regarder la version verticale à environ un tiers de sa taille. Le message principal, le nom saisi, le résultat et l’adresse doivent rester identifiables. Les mentions secondaires restent secondaires. Le rendu ne doit pas demander de mettre la vidéo en pause pour comprendre la proposition.
