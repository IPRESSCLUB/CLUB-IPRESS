# Correction des deux scènes IFMEREE — 18 octobre 2026

Cette archive contient le site complet et les deux nouvelles illustrations. Elle part de votre fichier `CLUB-IPRESS-main.zip`.

## Installation sur GitHub Pages

1. Décompresser le ZIP.
2. Copier **tout son contenu** à la racine de la branche/dossier publié de `CLUB-IPRESS`. `index.html`, les fichiers JS/CSS et les photographies doivent rester au même niveau.
3. Remplacer les fichiers de mêmes noms. Ne pas téléverser seulement `index.html`, ni le ZIP sans le décompresser.
4. Après le déploiement GitHub Pages, recharger la page. Les fichiers d’introduction ont un nouveau suffixe de cache.

Les liens locaux sont relatifs ; aucun chemin `/assets/...` ni chemin du poste de travail n’est nécessaire. Aucune installation Node, Python ou GSAP n’est requise pour faire fonctionner le site. La publication sur votre dépôt n’a pas été effectuée dans cette session.

## Ce qui a changé

- Deux SVG construits à partir des proportions et éléments reconnaissables des photographies fournies : toiture, volumes en retrait, fenêtres ouvrantes, claustras, lettres IFMEREE, allée, portique, palmiers et panneau.
- Les contours, les surfaces blanches, les matières et les ombres utilisent la même géométrie et les mêmes coordonnées. Aucun bitmap n’est intégré dans ces SVG.
- Façade : 269 tracés animés, organisés par familles. Structure, ouvertures, végétation, claustras, lettres et bardage se développent avec chevauchement pendant 6,4 secondes de temps visible. La profondeur apparaît pendant la dernière partie. Le dessin terminé conserve ces mêmes tracés.
- Campus : 375 tracés ; les contours restent visibles. Les matières, ombres, hachures et le cercle vert se développent du haut vers le bas sous un front irrégulier commun. La position de défilement détermine directement l’état ; remonter restitue exactement les états précédents.
- Guides et coordonnées locales au pointeur dans la première scène, réservés à la souris/pointeur fin. Aucun effet de loupe, aucune interception de la molette, du tactile ou du glisser.
- Défilement natif sans épinglage. Progression du campus : 0 lorsque le haut de son illustration est à 64 % de la hauteur de fenêtre, 1 à 5 %. L’initialisation, les changements de taille, les polices et les liens directs recalculent cet état.
- Mode réduit du système et bouton IPRESS respectés. Illustration complète sans JavaScript ; dimensions réservées ; abandon vers le rendu complet si le démarrage est trop tardif. La séquence d’entrée attend les polices au maximum 1,2 seconde et s’arrête hors écran ou dans un onglet masqué.

Seuls `index.html`, `ifmeree-intro.css` et `ifmeree-intro.js` ont été modifiés parmi les fichiers d’origine. De la section `#home` jusqu’à la fin du document, le HTML est identique octet pour octet. Les photographies, vidéo, personnages, ordre de l’équipe, liens, formulaire et scripts IPRESS d’origine sont conservés. Les anciennes images d’introduction sont conservées dans le dossier mais ne sont plus utilisées par les scènes.

## Sources éditables et contrôle

- `ifmeree-facade.svg` et `ifmeree-campus.svg` : sources vectorielles autonomes, éditables dans un logiciel SVG.
- `ifmeree-artwork-source.py` : géométrie de construction, avec Python et fontTools si vous souhaitez régénérer les SVG. Les SVG générés doivent ensuite remplacer les SVG correspondants intégrés à `index.html` et à la page de contrôle.
- `ifmeree-art.js` : moteur partagé des états ; `ifmeree-intro.js` : temps, défilement, pointeur et réduction du mouvement.
- `IFMEREE-verification.html` : page séparée avec curseurs de progression, lecture de la façade et aperçu du site aux largeurs 1440, 1024, 390 et 360 px. Après publication, elle est disponible dans le même dossier que `index.html`. Cette page n’est pas liée dans la navigation publique du site.
- `IFMEREE-etapes-vectorielles.png` : cinq états de chaque dessin, 0/25/50/75/100 %. Il s’agit de rendus SVG statiques, **pas de captures du navigateur**.
- `IFMEREE-VERIFICATION.md` : résultats et limites détaillés.

## Différences restantes

L’illustration est une interprétation vectorielle épurée des photos, pas un relevé architectural à l’échelle. Les palmes, motifs répétitifs et petits caractères du panneau sont simplifiés. La texture est plus géométrique et moins dense que celle de Heron. La durée de 6,4 secondes est un réglage proposé, pas une durée mesurée du dessin de Heron. Un ajustement visuel côte à côte dans un navigateur reste nécessaire pour valider le rythme et la densité finale.
