# Vérification — IFMEREE encre v3

## Référence examinée

Heron (`https://heronaiapp.com/`) a été consulté dans un navigateur réel : chargement et état terminé de la façade, déplacement du pointeur, puis défilement avant/arrière du second dessin et états intermédiaires. Son image de façade dans `.home-hero-img-inner` a bien une taille intrinsèque de 2060 × 1037. La seconde scène combine `.ink-mask-img.main` et `.ink-mask-img.sub.ink-filter`, avec un masque courbe, du bruit fractal, une déformation, un flou et un ajustement alpha.

Ces observations ont guidé le travail, sans prétendre mesurer exactement toutes les phases d’ouverture ni reproduire ses durées à l’identique. Aucune image du bâtiment de Heron n’est utilisée dans le site livré. L’architecture provient des deux photographies IFMEREE fournies.

## Illustrations

Deux nouveaux dessins détaillés ont remplacé les polygones et arbres symboliques de la version précédente. L’état trait est dérivé de chaque composition ombrée enregistrée ; il ne s’agit pas d’une seconde génération indépendante. Les lettres secondaires de l’enseigne ont été recomposées pour éviter les erreurs de génération. Les filtres de fabrication sont précalculés dans les PNG : le navigateur ne refait pas l’extraction des traits.

Contrôle des quatre fichiers : toutes les composantes visibles vérifient R = G = B. Dimensions 1799 × 874 pour la façade, 1616 × 973 pour le campus. Les deux variantes de chaque scène ont un canal alpha identique. Des échantillons de murs, sol et enseigne sont entièrement opaques ; une plaque blanche répare une découpe transparente près du toit avant la composition du cercle. Le cercle est un élément séparé, vert `#B8DD70`, sans mélange colorant les surfaces.

Les dessins terminés, les branches, vitrages, palmiers et inscriptions ont été examinés en rendus fixes. Les planches `IFMEREE-progression-statique.png` et `IFMEREE-details-statiques.png` sont produites par le moteur SVG librsvg. **Ce ne sont pas des captures du site dans un navigateur.**

## Animation et robustesse vérifiées dans le code/DOM simulé

- Façade : 0/25/50/75/100 %, masques sur les mêmes images, arrêt hors écran/onglet caché, reprise, pas de boucle de dessin après achèvement.
- Campus : mêmes états, parcours inverse, conservation de l’état à l’arrêt, progression recalculée après changement de hauteur de fenêtre. Le masque se déplace dans les coordonnées du dessin ; redimensionner le SVG conserve l’alignement de ses couches.
- Souris : repères localisés à la première scène ; pas d’influence sur le masque du campus. Pointeur tactile ignoré pour cet effet, défilement natif conservé.
- Décodage des quatre images avant activation ; succès, échec simulé et décodage encore en attente contrôlés. En cas d’échec, les images statiques restent disponibles. Le délai de garde de 4 s ne bloque ni la lecture ni les liens.
- Préférence de mouvement réduit, bouton existant, navigation directe par ancre et délai de démarrage expiré.
- Absence d’IntersectionObserver : solution de repli fondée sur les positions de défilement.
- Masque bruiteux limité à une bande de 1796 × 320 unités ; bruit stable, aucune animation du filtre lui-même. Le reste du masque est une surface simple. Ces choix limitent le travail de dessin sans constituer une mesure de performances.

## Préservation et fonctionnalités

Comparaison binaire avec le ZIP joint : HTML depuis `#home` inchangé ; autres scripts/styles IPRESS et médias conservés. Seuls l’introduction, ses sources d’art et ses documents de contrôle sont remplacés. Les anciens exports propres à l’introduction, devenus inutiles, sont retirés.

Tests DOM simulés : menu mobile, accordéons, équipe par boutons et clavier, ouverture/navigation/fermeture de galerie, déclencheur photo, fenêtres de recrutement, sélection d’intérêts, erreurs de formulaire et succès avec réseau simulé. **Aucun formulaire réel n’a été envoyé.** Les comportements de rendu WebGL et la lecture vidéo n’ont pas été évalués dans un navigateur pour cette version ; leurs fichiers sont inchangés.

Les références locales du HTML, des scripts, styles et SVG sont contrôlées avec casse exacte ; pas de ressource manquante ni d’identifiant dupliqué. Le ZIP contient `index.html` directement à sa racine et `.nojekyll`.

## Validation qui reste à faire dans un navigateur

L’environnement de prévisualisation locale est indisponible. Le site corrigé n’a donc pas été inspecté visuellement en navigateur desktop, ni en viewport mobile émulé, ni sur téléphone physique. Aucune fluidité à 60/120 Hz, compatibilité Safari réelle ou absence de débordement à chaque largeur ne peut être affirmée à partir des tests simulés. Aucun enregistrement vidéo du site corrigé n’est fourni.

Les règles responsive existantes sont conservées, avec les proportions des nouvelles illustrations réservées dans la mise en page. Après publication, utiliser `IFMEREE-verification.html` pour inspecter 1440/1024/390/360 px, faire défiler dans les deux sens, activer la réduction des animations, puis vérifier sur téléphone réel. Cette page de contrôle ne s’affiche pas dans la navigation publique.

## Ressources de conception lues

Les guides Frontend Design (Anthropic), GSAP (MengTo), animate / review-animations / animation-performance (Emil Kowalski), Web Design Guidelines (Vercel), ainsi que leurs fichiers de soutien pertinents et la documentation officielle GSAP, ont été consultés. Il s’agit de ressources lues pour cette réalisation, pas de plugins installés dans le site. Le mouvement est implémenté en JavaScript natif sans dépendance GSAP supplémentaire.
