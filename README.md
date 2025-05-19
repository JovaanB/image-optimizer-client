# image-optimizer-client

Librairie JavaScript pour optimiser et analyser la lisibilité des images côté client avec OpenCV.js.

## Fonctionnalités principales

- **Redimensionnement automatique** (écologie, performance, max 1024x1024)
- **Détection de flou** (Laplacien)
- **Détection de contraste faible**
- **Détection de zones vides/blanches/noires**
- **Conversion optionnelle en niveaux de gris**
- **Aperçu et export optimisé avant upload**
- **Feedback utilisateur en direct**
- **Téléchargement de l'image optimisée**

## Démo rapide

Ouvrez `demo.html` dans un navigateur (avec un serveur local, ex : `python3 -m http.server`).

## Utilisation

```js
import { processImage } from "./src/index.js";
import { loadImageToMat } from "./src/utils/loadImageToMat.js";

const mat = await loadImageToMat(file);
const result = processImage(mat, { grayscale: false });
// result.dataUrl, result.analysis, result.blob, ...
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
  indicators: {
    blurScore: 123.4,
    contrastScore: 45.6,
    isReadable: false,
    feedbacks: ['L\'image semble floue']
  },
  blob: Blob // pour téléchargement
}
```

## Dépendances

- [OpenCV.js](https://docs.opencv.org/4.x/opencv.js) (CDN ou local)

## Structure

- `src/` : code source principal
- `demo.html` : démo interactive

## Contribuer

- Fork, PR, issues bienvenus !
- Convention de commit : [Conventional Commits](https://www.conventionalcommits.org/)

## Licence

MIT
