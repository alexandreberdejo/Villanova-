## Aperçu

VillaNova est un site web statique qui agrège les événements culturels de Marseille via l'API **OpenAgenda**. L
'utilisateur peut parcourir les événements, les filtrer par catégorie, effectuer une recherche et consulter le
détail de chaque événement.

## Pages

| Fichier | Description |
|---|---|
| `index.html` | Page d'accueil — liste et filtrage des événements |
| `event-detail.html` | Page de détail d'un événement |

## Fonctionnalités

- Affichage des événements sous forme de cartes (6 par page)
- Filtrage par catégorie : Concerts, Expositions, Spectacles, Festivals
- Barre de recherche en temps réel
- Pagination avec navigation clavier
- Page de détail avec date, lieu, adresse, tarif et description
- Bouton de réservation (simulé)
- Fallback sur des données locales si l'API est indisponible
- Chargement paresseux des images (`loading="lazy"`) avec fallback Picsum

## Technologies

- **HTML5** — structure sémantique
- **SCSS** (compilé vers `css/style.css`) — styles modulaires
- **JavaScript vanilla** — aucune dépendance externe
- **OpenAgenda API v2** — source de données événementielles

## Structure du projet

```
vilanova/
├── index.html
├── event-detail.html
├── css/
│   ├── style.css           # CSS compilé
│   ├── style.scss          # Point d'entrée SCSS
│   ├── _variables.scss
│   ├── _mixins.scss
│   ├── _base.scss
│   ├── _accessibilite.scss
│   ├── _header.scss
│   ├── _banniere.scss
│   ├── _filtres.scss
│   ├── _evenements.scss
│   ├── _cartes.scss
│   ├── _pagination.scss
│   ├── _detail.scss
│   └── _footer.scss
└── js/
    ├── app.js              # Logique principale (liste + filtres)
    └── detail.js           # Logique page de détail
```

## Lancer le projet

Le site est 100 % statique. Il suffit d'ouvrir `index.html` dans un navigateur.

> Pour éviter les erreurs CORS lors de l'appel à l'API, il est recommandé d'utiliser un serveur local :

```bash
# avec Python
python -m http.server 8080

# avec Node.js (npx)
npx serve .
```

Puis ouvrir `http://localhost:8080`.

## Compiler le SCSS

Si vous modifiez les fichiers `.scss`, recompilez vers `css/style.css` :

```bash
# avec sass (npm)
npm install -g sass
sass css/style.scss css/style.css --watch
```

## Accessibilité

- Lien d'évitement (`Aller au contenu`)
- Attributs ARIA (`aria-label`, `aria-pressed`, `aria-current`, `aria-live`)
- Navigation clavier complète sur les cartes et la pagination
- Classes `.cache` pour les éléments visuellement masqués mais lisibles par les lecteurs d'écran

## API

Les données proviennent de l'agenda public **VillaNova** sur OpenAgenda :

```
https://api.openagenda.com/v2/agendas/2119473/events
```

En cas d'échec de l'API, des données de secours locales sont automatiquement utilisées pour garantir l'affichag
e.

---

© 2026 VillaNova Marseille — Données : OpenAgenda
