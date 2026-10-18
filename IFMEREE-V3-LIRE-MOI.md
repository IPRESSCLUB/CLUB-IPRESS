# IPRESS — IFMEREE, édition encre v3

Le site complet est prêt pour un hébergement statique GitHub Pages. Aucun build, compte tiers ou appel à un générateur d’images n’est nécessaire pour afficher les nouvelles illustrations.

## Mise en ligne

1. Décompresser cette archive.
2. Mettre **tous les fichiers extraits** dans le dossier publié du dépôt. `index.html` doit être directement à sa racine, avec les images, scripts, styles, polices et vidéo à côté. Déposer uniquement le ZIP sur GitHub ne publie pas son contenu.
3. Dans GitHub Pages, conserver la branche et le dossier de publication habituels. Attendre la fin du déploiement, puis recharger la page sans le cache (Ctrl + F5).

Les noms et chemins sont relatifs, avec leur casse exacte. Ils fonctionnent sous `/CLUB-IPRESS/` ou `/IPRESS/`, sans supposer que le site est à la racine du domaine. Ne pas renommer les fichiers d’images isolément.

## Ce qui change

- Deux nouvelles illustrations détaillées issues des photographies IFMEREE fournies : façade, vitrages sombres, relief, grain, branches naturelles et palmiers articulés.
- Des états trait/matière provenant chacun d’une même composition, sans changement de perspective ni de cadrage pendant les animations.
- Des panneaux noir/blanc/gris, y compris leurs règles et repères. Le seul accent chromatique est le cercle `#B8DD70` du campus, placé derrière les surfaces opaques.
- Révélation de la façade par masques de structure, détails, arbres, contexte et matière. La durée de 6,4 secondes est un réglage de cette réalisation, pas une mesure certifiée de Heron.
- Campus révélé du haut vers le bas par un masque courbe avec bruit, déplacement et bord adouci. La progression suit le défilement natif et s’inverse au retour.
- Inscriptions secondaires du panneau IFMEREE recomposées avec un texte lisible. Les illustrations restent des interprétations artistiques des photos, pas des relevés architecturaux.
- Chargement décodé avant animation, repli statique, respect du bouton de réduction des animations et de la préférence système.

Le HTML depuis la section `#home` jusqu’à la fin est identique au ZIP fourni. Les scripts IPRESS, styles hors introduction, galerie, personnages, caméra, vidéo, recrutement et liens sont conservés.

## Fichiers utiles

- `index.html` : site complet.
- `ifmeree-intro.css`, `ifmeree-intro.js` : cadre et comportement de l’introduction.
- `ifmeree-art.js` : progression déterministe des deux masques.
- `ifmeree-facade.svg`, `ifmeree-campus.svg` : scènes sources avec les mêmes masques que le site et images relatives.
- Les quatre PNG `ifmeree-…-outline.png` / `ifmeree-…-shaded.png` : illustrations alignées. Leur transparence conserve le ciel ; les surfaces architecturales sont opaques.
- `IFMEREE-verification.html` : contrôle manuel séparé, curseurs des deux animations et cadres de 1440, 1024, 390 et 360 px.
- `IFMEREE-progression-statique.png` : cinq états par scène, rendus par librsvg hors navigateur.
- `IFMEREE-VERIFICATION.md` : contrôles effectués et limites.
- `IFMEREE-FILES.json` : inventaire et empreintes des fichiers.

## Limite de validation

Le rendu des illustrations a été examiné à l’arrêt et à cinq progressions. Les interactions ont été testées dans un DOM simulé. L’infrastructure de prévisualisation locale n’était pas disponible : **cette version n’a pas fait l’objet d’une validation visuelle de sa page complète dans un navigateur desktop/mobile, ni d’une mesure de fluidité sur téléphone physique**. Aucun enregistrement vidéo ni fausse capture navigateur n’est fourni. La page de contrôle facilite cette vérification après publication.
