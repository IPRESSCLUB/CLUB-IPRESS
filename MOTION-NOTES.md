# IPRESS — mise à jour motion

Téléversez le contenu de ce dossier à la racine de votre dépôt GitHub.
`index.html` reste à la racine. Aucun build, paquet npm ou CDN supplémentaire.

## Changements
- `motion.css` et `motion.js` : transitions progressives, survols et interactions.
- `application.js` : confirmation éditoriale animée, état d’envoi accessible, protection contre les doubles envois.
- `index.html` : chargement des deux fichiers de motion uniquement.
- Tous les médias et tous les autres fichiers existants sont conservés.

Le formulaire conserve son endpoint Web3Forms, sa configuration, ses champs,
sa validation et ses données. La confirmation n’est créée qu’après une réponse
HTTP positive contenant `success: true`. En cas d’échec, les valeurs restent
dans le formulaire et le bouton permet de réessayer. Le succès ne signifie pas
une admission automatique au club.

## Accessibilité et performance
Transitions natives par IntersectionObserver et Web Animations, principalement
opacity/transform, déclenchées une fois par élément. Aucun scroll forcé.
Le réglage système et le bouton existant de réduction des animations sont
respectés. Les animations actives sont arrêtées lors de la réduction.
Sans les API de motion, les interactions et le contenu restent disponibles.
Le focus clavier rejoint la confirmation après l’envoi réussi.

## Vérification
Tests automatisés du DOM : succès, attente, double envoi, échec serveur, erreur
HTTP, panne réseau, JSON invalide, clé absente, piège anti-spam et nouvelle
tentative disponible. Données envoyées identiques à la version précédente.
Champs et contenu HTML existant comparés à la version précédente. Galerie,
photos Photo & vidéo / Son & communication, équipe et chemins locaux vérifiés.
Les réponses du service ont été simulées : aucune fausse candidature envoyée.
La réception réelle dans la boîte IPRESS et le rendu visuel sur les navigateurs
et appareils réels n’ont pas été vérifiés dans cet environnement.

Références :
- https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API
- https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-reduced-motion
- https://web.dev/articles/animations-guide
