# Vérification — état réel de cette livraison

## Observation de Heron

Référence consultée dans un navigateur interactif à environ 1363 × 936 px. Le défilement de la seconde scène a été observé à plusieurs positions, ainsi qu’un retour vers une position antérieure.

- Première scène : cadre technique, règle graduée, dessin architectural dense et guides au pointeur. Des états de chargement et le résultat terminé ont été vus. La durée du dessin autonome, séparée du chargement, n’a pas pu être mesurée de façon fiable.
- Seconde scène : développement vertical du haut vers le bas avec une limite irrégulière, de plus en plus d’ombres et de matières, cercle révélé dans la même progression. Les contours de la partie inférieure restent visibles pendant que le haut est déjà rendu. La progression reste stable quand le défilement s’arrête.
- Repères observés sur le rectangle `.home-intro`, haut à environ 275 / 135 / −5 / −145 px, pour une hauteur d’environ 684 px : de presque tous les contours à un rendu complet. Ces valeurs décrivent cette observation ; elles ne sont pas des spécifications universelles du site.
- Le défilement, et non le déplacement du pointeur, commande cette transformation. Aucun diagnostic de bâtiment ou message de violation de la référence n’a été repris.
- Pas de test tactile réel sur Heron. Aucun mécanisme technique interne ou chiffre de performance de Heron n’est affirmé.

## Contrôles réalisés sur la nouvelle version

### Contrôles visuels des fichiers vectoriels, hors navigateur

- Les deux photographies originales ont été examinées et utilisées pour construire la géométrie.
- Les rendus vectoriels à 0/25/50/75/100 % ont été générés et examinés. Les superpositions de lignes derrière les fenêtres et les murs ont été corrigées. Les contours et surfaces restent alignés.
- Les SVG autonomes ont été rendus à 1440, 1024, 390 et 360 px de largeur, avec examen du grand format et de petits formats. Cela contrôle le dessin et sa mise à l’échelle, **pas la mise en page HTML complète à ces largeurs**.
- CairoSVG a servi à produire les images statiques. Les longueurs de traits normalisées ont été converties en unités SVG pour ce rendu hors navigateur. Les fichiers du site gardent leurs attributs SVG `pathLength`.

### Contrôles du code et du DOM simulé

Résultats passants :

- Façade aux cinq étapes ; fenêtres et lettres réellement animées ; géométrie inchangée ; remise à l’état final propre.
- Pause/reprise quand la scène sort du viewport ou l’onglet est masqué ; aucune boucle d’images permanente après achèvement.
- Campus à 0/25/50/75/100 %, puis en sens inverse ; mêmes états ; maintien lorsque le défilement s’arrête.
- Coordonnées locales du pointeur ; retrait au départ ; indépendance de la transformation du campus.
- Mode réduit, bouton existant, pointeur grossier, absence d’IntersectionObserver, démarrage tardif et lien direct `#ifmeree-discover`.
- Recalcul après changement de hauteur de fenêtre.
- Menu, accordéon, sélection de l’équipe aux boutons/clavier, visionneuse et navigation des photos, événement du déclencheur, dialogue, choix des domaines, ouverture et validation du formulaire.
- Succès du formulaire testé avec une réponse réseau simulée : aucune candidature n’a été envoyée.
- Syntaxe des nouveaux scripts, identifiants uniques, références SVG internes, absence de bitmap dans les SVG.
- 49 références locales résolues dans le dossier ; HTML de `#home` à la fin conservé octet pour octet ; fichiers runtime originaux conservés, hors trois fichiers d’intégration IFMEREE.

Ces contrôles n’exécutent pas le moteur de rendu d’un navigateur et ne prouvent ni la fluidité, ni l’absence de débordement visuel.

## Vérifications bloquées / à compléter

L’aperçu local géré n’a pas pu démarrer : erreur de montage `bwrap` / `/proc` de l’environnement. Le navigateur de référence fonctionne, mais la nouvelle version locale n’a pas pu y être ouverte avec les moyens autorisés. La protection de navigation locale n’a pas été contournée.

Par conséquent, **aucune validation visuelle du site HTML complet, aucun enregistrement navigateur de la nouvelle version, aucun test sur appareil réel et aucune mesure de FPS, de coût de peinture ou de fluidité n’ont été réalisés**.

Restent à vérifier en navigateur après ouverture de la version :

- Mises en page complètes à 1440, 1024, 390 et 360 px ; clipping, chevauchements et débordement horizontal.
- Premier chargement et rechargement, réseau ralenti, absence de flash, durée visuelle effective.
- Défilement lent/rapide/inversé, arrêt, navigation clavier et tactile, rotation d’écran.
- Position réelle lors du lien direct, pointeur, bouton de réduction, préférences système.
- Console, requêtes réseau, caméra WebGL et vidéo réelles ; coût du dessin SVG sur appareil ordinaire.
- Comparaison côte à côte avec Heron au même viewport, puis ajustement éventuel du rythme et des textures.

La page `IFMEREE-verification.html` fournit les commandes pour cette revue ; ses boutons de largeur ne simulent pas un appareil ni ses performances. La planche PNG est un livrable statique représentatif, pas une preuve de mouvement.

## Références appliquées

Frontend Design ; GSAP Animation et ses références ; Emil Kowalski animate/recipes, review-animations/standards, animation-performance/performance-cheatsheet ; Vercel web-design-guidelines et Web Interface Guidelines ; documentation ScrollTrigger et DrawSVG.

Ces documents ont été lus comme références. Ils ne sont pas présentés comme des compétences enregistrées ou installées dans un outil. Le choix natif SVG/requestAnimationFrame est permis par le brief : pas de dépendance réseau supplémentaire. L’animation de traits et les clips SVG nécessitent de la peinture ; aucune accélération GPU ni cadence garantie n’est revendiquée.
