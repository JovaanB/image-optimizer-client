import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";

import { processImage } from "../../dist/index.js";
import { loadImageToMat } from "../../dist/utils/loadImageToMat.js";
import { useOpenCV } from "./useOpenCV";

function App() {
  const { loaded: opencvLoaded, error: opencvError } = useOpenCV();
  const [count, setCount] = useState(0);
  const [images, setImages] = useState([]);
  const [results, setResults] = useState([]);
  const [processing, setProcessing] = useState(false);

  const handleFiles = (event) => {
    const files = Array.from(event.target.files);
    setImages(files);
    setResults([]);
  };

  const processImages = async () => {
    if (!opencvLoaded) return;
    setProcessing(true);
    const newResults = [];
    for (const file of images) {
      let img;
      try {
        img = await loadImageToMat(file);
      } catch (e) {
        newResults.push({
          status: "error",
          message: `Failed to load ${file.name}: ${e.message}`,
        });
        continue;
      }
      if (!img) {
        newResults.push({
          status: "error",
          message: `Failed to load ${file.name}`,
        });
        continue;
      }
      let result;
      try {
        result = await processImage(img, {
          quality: 10,
          format: "webp",
          maxWidth: 800,
        });
      } catch (e) {
        newResults.push({
          status: "error",
          message: `Failed to process ${file.name}: ${e.message}`,
        });
        continue;
      }
      if (!result || result.status === "error") {
        newResults.push({
          status: "error",
          message: `Failed to process ${file.name}`,
        });
        continue;
      }
      newResults.push(result);
      img.delete();
    }
    setResults(newResults);
    setProcessing(false);
  };

  // Placeholder function simulating image processing
  const fakeOptimizeImage = async (file) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ status: "success", message: `Processed ${file.name}` });
      }, 500);
    });
  };

  return (
    <>
      <div
        className="container"
        style={{
          maxWidth: 600,
          margin: "2rem auto",
          padding: "2rem",
          border: "1px solid #eee",
          borderRadius: 8,
        }}
      >
        <h1>Batch Image Optimizer</h1>
        {!opencvLoaded && (
          <div style={{ color: "orange" }}>Chargement d'OpenCV.js...</div>
        )}
        {opencvError && (
          <div style={{ color: "red" }}>Erreur de chargement OpenCV.js</div>
        )}
        <input
          type="file"
          multiple
          accept="image/*"
          onChange={handleFiles}
          disabled={processing || !opencvLoaded}
        />
        <button
          onClick={processImages}
          disabled={processing || images.length === 0 || !opencvLoaded}
          style={{ marginLeft: 8 }}
        >
          {processing ? "Processing..." : "Process Images"}
        </button>
        <ul style={{ marginTop: 24 }}>
          {images.map((img, idx) => (
            <li key={img.name} style={{ marginBottom: 16 }}>
              <strong>{img.name}</strong> -{" "}
              {results[idx]
                ? results[idx].message
                : processing
                ? "Processing..."
                : "Pending"}
              {results[idx] && results[idx].dataUrl && (
                <>
                  <div
                    style={{
                      fontSize: "0.95em",
                      margin: "6px 0 2px 0",
                      color: "#555",
                    }}
                  >
                    Taille initiale : {results[idx].originalSizePx.width} x{" "}
                    {results[idx].originalSizePx.height} px —{" "}
                    {images[idx] && images[idx].size
                      ? `${Math.round(images[idx].size / 1024)} Ko`
                      : "? Ko"}
                    <br />
                    Taille compressée : {
                      results[idx].optimizedSizePx.width
                    } x {results[idx].optimizedSizePx.height} px —{" "}
                    {results[idx].blob
                      ? `${Math.round(results[idx].blob.size / 1024)} Ko`
                      : "? Ko"}
                  </div>
                  <a
                    href={results[idx].dataUrl}
                    download={img.name.replace(/\.[^/.]+$/, ".webp")}
                    style={{ marginLeft: 12 }}
                  >
                    Télécharger
                  </a>
                  <button
                    style={{ marginLeft: 8 }}
                    onClick={() => {
                      const el = document.getElementById(`preview-${idx}`);
                      if (el)
                        el.style.display =
                          el.style.display === "block" ? "none" : "block";
                    }}
                  >
                    Voir l'image
                  </button>
                  <div style={{ marginTop: 8 }}>
                    <img
                      id={`preview-${idx}`}
                      src={results[idx].dataUrl}
                      alt={img.name}
                      style={{
                        display: "none",
                        maxWidth: "100%",
                        border: "1px solid #ccc",
                        borderRadius: 4,
                        marginTop: 4,
                      }}
                    />
                  </div>
                </>
              )}
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}

export default App;
