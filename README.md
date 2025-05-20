# image-optimizer-client

Librairie JavaScript/TypeScript pour optimiser et analyser la lisibilité des images côté client avec OpenCV.js.

## 🚀 Migration TypeScript

- **Tout le code source est désormais en TypeScript** (`src/`)
- **Typage strict** pour toutes les fonctions et structures de données
- **Build automatique** dans `dist/` pour usage navigateur ES modules
- **Démo** (`demo.html`) compatible avec les modules générés dans `dist/`

## Fonctionnalités principales

- **Redimensionnement automatique** (écologie, performance, max 1024x1024)
- **Détection de flou** (Laplacien)
- **Détection de contraste faible**
- **Détection de zones vides/blanches/noires**
- **Conversion optionnelle en niveaux de gris**
- **Aperçu et export optimisé avant upload**
- **Feedback utilisateur en direct**
- **Téléchargement de l'image optimisée**
- **Affichage des tailles originales et optimisées (px et Ko)**

## Démo rapide

Ouvrez `demo.html` dans un navigateur (avec un serveur local, ex : `python3 -m http.server`).

## Utilisation

```js
import { processImage } from "./dist/index.js";
import { loadImageToMat } from "./dist/utils/loadImageToMat.js";

const mat = await loadImageToMat(file);
const result = processImage(mat, { grayscale: false });
mat.delete();
```

### Exemple de retour de processImage

```js
{
  image: cv.Mat, // image optimisée (OpenCV)
  dataUrl: 'data:image/jpeg;base64,...',
  width: 1024,
  height: 768,
  analysis: {
    blurScore: 123.4,
    contrastScore: 45.6,
    feedbacks: ['L\'image semble floue'],
    isReadable: false
  },
  blob: Blob, // pour téléchargement
  originalSizePx: { width: 2000, height: 3000 },
  optimizedSizePx: { width: 1024, height: 1536 }
}
```

## Dépendances

- [OpenCV.js](https://docs.opencv.org/4.x/opencv.js) (CDN ou local)

## Structure

- `src/` : code source TypeScript
- `dist/` : build JavaScript ES modules pour navigateur
- `demo.html` : démo interactive

## Contribuer

- Fork, PR, issues bienvenus !
- Convention de commit : [Conventional Commits](https://www.conventionalcommits.org/)

## Licence

MIT
