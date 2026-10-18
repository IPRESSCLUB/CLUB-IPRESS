# Introduction IFMEREE Tanger — IPRESS

## Contenu de la livraison

Le site statique complet est fourni, avec `index.html` à la racine. Tous les fichiers du ZIP d’origine sont conservés, y compris la vidéo, les photographies, les personnages, les polices et Three.js. Aucune installation ni compilation n’est nécessaire.

Décompresser l’archive puis placer son contenu à la racine du dépôt publié avec GitHub Pages. Conserver les noms de fichiers et l’arborescence `assets/` et `vendor/`. Les chemins relatifs fonctionnent sous `/IPRESS/`. Le fichier `.nojekyll` permet de servir le projet comme site statique.

## Fichiers modifiés et ajoutés

- `index.html` : chargement des nouveaux styles et du nouveau script ; insertion de l’introduction avant `#home`. Un seul en-tête est conservé. Le contenu allant de la section `#home` à la fin du document reste identique à l’original.
- `ifmeree-intro.css` : composition architecturale, règles fines, graduations, croix, typographie et dispositions adaptées aux petits écrans. Les nouveaux sélecteurs sont limités à `.ifmeree-intro`.
- `ifmeree-intro.js` : dessin d’entrée, guides locaux, coordonnées réelles en pixels, révélation de couleur selon le défilement, complément au survol et connexion au contrôle d’animation existant.
- `assets/ifmeree/facade-ink.webp` : dessin de la façade, 1774 × 887 pixels.
- `assets/ifmeree/campus-color.webp` : illustration du campus, 1536 × 1024 pixels. La version monochrome et les deux calques colorés utilisent exactement ce même fichier et la même géométrie.
- `.nojekyll` et cette note de livraison.

Les deux nouveaux fichiers image pèsent ensemble environ 736 Kio. Les scripts, styles et médias d’origine n’ont pas été modifiés.

## Fonctionnement

La façade apparaît par des tracés SVG et sept zones de révélation correspondant aux volumes et détails du bâtiment, pendant environ 2,5 secondes. Le défilement reste disponible immédiatement. Le dessin terminé conserve son intérêt sans interaction.

Sur ordinateur avec pointeur précis, le réticule bleu, les deux guides et les coordonnées suivent le pointeur dans le premier cadre. Les coordonnées décrivent une position dans l’interface, pas des dimensions du bâtiment. Le vocabulaire de déplacement du site de référence est adapté à ces guides locaux ; aucun panneau de diagnostic ni avertissement architectural n’est repris.

Le campus reste lisible à l’encre pendant que le défilement révèle progressivement ses couleurs. Le mouvement est réversible. Une fenêtre circulaire de couleur suit le pointeur sur les appareils compatibles, sans modifier la progression du défilement. Sur petit écran ou pointeur tactile, le défilement suffit.

Le bouton d’animation IPRESS existant contrôle aussi les nouveaux effets. La préférence système de réduction du mouvement est respectée selon le même comportement que le site d’origine. Sans JavaScript, les illustrations complètes, les textes et les liens restent présents.

Le script n’ajoute pas de boucle de rendu permanente : les mises à jour sont regroupées sur une frame et l’observation du campus évite le travail de défilement lorsqu’il est hors écran.

## Vérifications effectuées

- Présence des 51 fichiers d’origine ; seul `index.html` diffère parmi ces fichiers.
- Comparaison exacte du document d’origine depuis `#home` jusqu’à sa fin : inchangé.
- Identifiants uniques, ancres présentes et références HTML/CSS locales résolues, avec respect de la casse.
- Syntaxe des sept fichiers JavaScript et analyse syntaxique du nouveau CSS.
- Vérification des métriques de la grande typographie avec la police fournie, pour des largeurs de 320 à 1920 pixels.
- Tests DOM simulés de la fin du dessin, des coordonnées locales, de la sortie du pointeur, de la progression du défilement et de son retour en arrière, de la révélation au survol, du bouton de réduction du mouvement, des liens et de l’absence de boucle de frames permanente.
- Tests DOM simulés du menu, des disciplines, de la sélection des sept membres et des flèches clavier, de la galerie et de sa fermeture, du déclencheur photo, du dialogue d’inscription, des centres d’intérêt, de l’ouverture et de la validation du formulaire.
- Présentation de confirmation vérifiée avec une réponse serveur simulée. Aucune candidature réelle n’a été envoyée ; la configuration du formulaire d’origine est préservée.

## Limites de vérification

**Le rendu réel sur ordinateur et mobile n’a pas pu être contrôlé dans le navigateur.** Le service d’aperçu a échoué au démarrage à cause d’une restriction de montage du conteneur ; le navigateur n’a pas pu atteindre l’aperçu local. Les tests DOM ne remplacent pas un contrôle visuel. L’absence de débordement, le rendu des masques SVG/CSS, le timing perçu, les interactions natives et la console dans un vrai navigateur restent donc à confirmer. La scène Three.js d’origine est conservée mais n’a pas été exécutée dans un navigateur lors de cette livraison.

La première composition et ses guides s’appuient sur l’inspection du site Heron et les captures fournies. La transition du deuxième visuel est une adaptation du brief et des captures ; sa correspondance exacte avec le défilement du site Heron n’a pas pu être confirmée.

Les illustrations ont été générées à partir des deux photographies fournies, puis optimisées pour le Web. Leur composition et les inscriptions IFMEREE ont été inspectées. Les petits détails sont interprétés comme dans un dessin architectural ; il ne s’agit pas de relevés techniques.

Le lien externe mène à `https://ifmeree.ac.ma/`, dans un nouvel onglet avec `noopener noreferrer` et une indication accessible. Le texte se limite à la mission de formation et aux trois filières demandées, sans chiffres ou promesses ajoutés.
