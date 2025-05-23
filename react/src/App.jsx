import { useState } from "react";
import "./App.css";

import { processImage } from "../../dist/index.js";
import { loadImageToMat } from "../../dist/utils/loadImageToMat.js";
import { useOpenCV } from "./useOpenCV";

function App() {
  const { loaded: opencvLoaded, error: opencvError } = useOpenCV();
  const [images, setImages] = useState([]);
  const [results, setResults] = useState([]);
  const [processing, setProcessing] = useState(false);
  const [form, setForm] = useState({
    maxWidth: 1024,
    maxHeight: 1024,
    grayscale: false,
    quality: 0.7,
    format: "image/webp",
    minBlur: 280,
    minContrast: 50,
    minSSIM: 0.999,
    minPSNR: 35,
  });

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
        result = await processImage(img, { ...form });
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
    }
    setResults(newResults);
    setProcessing(false);
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
        <div
          style={{
            marginBottom: 12,
            padding: 20,
            borderRadius: 12,
            border: "1px solid #e0e0e0",
            background: "linear-gradient(90deg,#f8fafc 60%,#f1f5f9 100%)",
            boxShadow: "0 2px 8px 0 #0001",
            maxWidth: 540,
            marginLeft: "auto",
            marginRight: "auto",
          }}
        >
          <h2
            style={{
              fontSize: "1.15em",
              marginBottom: 8,
              color: "#2a5ad7",
              letterSpacing: 0.5,
              fontWeight: 700,
            }}
          >
            Paramètres d'optimisation
          </h2>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              processImages();
            }}
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 18,
              alignItems: "center",
              background: "none",
            }}
          >
            <label
              style={{
                display: "flex",
                flexDirection: "column",
                fontWeight: 500,
              }}
            >
              Largeur max (px)
              <input
                type="number"
                min={100}
                max={3000}
                value={form.maxWidth}
                style={{
                  width: "100%",
                  marginTop: 4,
                  borderRadius: 4,
                  border: "1px solid #d0d0d0",
                  padding: 4,
                }}
                onChange={(e) =>
                  setForm((f) => ({ ...f, maxWidth: Number(e.target.value) }))
                }
              />
            </label>
            <label
              style={{
                display: "flex",
                flexDirection: "column",
                fontWeight: 500,
              }}
            >
              Hauteur max (px)
              <input
                type="number"
                min={100}
                max={3000}
                value={form.maxHeight}
                style={{
                  width: "100%",
                  marginTop: 4,
                  borderRadius: 4,
                  border: "1px solid #d0d0d0",
                  padding: 4,
                }}
                onChange={(e) =>
                  setForm((f) => ({ ...f, maxHeight: Number(e.target.value) }))
                }
              />
            </label>
            <label
              style={{
                display: "flex",
                flexDirection: "column",
                fontWeight: 500,
              }}
            >
              Qualité
              <input
                type="number"
                min={0.1}
                max={1}
                step={0.01}
                value={form.quality}
                style={{
                  width: "100%",
                  marginTop: 4,
                  borderRadius: 4,
                  border: "1px solid #d0d0d0",
                  padding: 4,
                }}
                onChange={(e) =>
                  setForm((f) => ({ ...f, quality: Number(e.target.value) }))
                }
              />
            </label>
            <label
              style={{
                display: "flex",
                flexDirection: "column",
                fontWeight: 500,
              }}
            >
              Format
              <select
                value={form.format}
                style={{
                  width: "100%",
                  marginTop: 4,
                  borderRadius: 4,
                  border: "1px solid #d0d0d0",
                  padding: 4,
                }}
                onChange={(e) =>
                  setForm((f) => ({ ...f, format: e.target.value }))
                }
              >
                <option value="image/webp">WebP</option>
                <option value="image/jpeg">JPEG</option>
                <option value="image/png">PNG</option>
              </select>
            </label>
            <label
              style={{
                display: "flex",
                flexDirection: "column",
                fontWeight: 500,
              }}
            >
              <span style={{ marginBottom: 2 }}>Niveaux de gris</span>
              <input
                type="checkbox"
                checked={form.grayscale}
                onChange={(e) =>
                  setForm((f) => ({ ...f, grayscale: e.target.checked }))
                }
                style={{ marginTop: 4, width: 18, height: 18 }}
              />
            </label>
            <label
              style={{
                display: "flex",
                flexDirection: "column",
                fontWeight: 500,
              }}
            >
              minBlur
              <input
                type="number"
                min={0}
                max={10000}
                value={form.minBlur}
                style={{
                  width: "100%",
                  marginTop: 4,
                  borderRadius: 4,
                  border: "1px solid #d0d0d0",
                  padding: 4,
                }}
                onChange={(e) =>
                  setForm((f) => ({ ...f, minBlur: Number(e.target.value) }))
                }
              />
            </label>
            <label
              style={{
                display: "flex",
                flexDirection: "column",
                fontWeight: 500,
              }}
            >
              minContrast
              <input
                type="number"
                min={0}
                max={255}
                value={form.minContrast}
                style={{
                  width: "100%",
                  marginTop: 4,
                  borderRadius: 4,
                  border: "1px solid #d0d0d0",
                  padding: 4,
                }}
                onChange={(e) =>
                  setForm((f) => ({
                    ...f,
                    minContrast: Number(e.target.value),
                  }))
                }
              />
            </label>
            <label
              style={{
                display: "flex",
                flexDirection: "column",
                fontWeight: 500,
              }}
            >
              minSSIM
              <input
                type="number"
                min={0}
                max={1}
                step={0.0001}
                value={form.minSSIM}
                style={{
                  width: "100%",
                  marginTop: 4,
                  borderRadius: 4,
                  border: "1px solid #d0d0d0",
                  padding: 4,
                }}
                onChange={(e) =>
                  setForm((f) => ({ ...f, minSSIM: Number(e.target.value) }))
                }
              />
            </label>
            <label
              style={{
                display: "flex",
                flexDirection: "column",
                fontWeight: 500,
              }}
            >
              minPSNR
              <input
                type="number"
                min={0}
                max={100}
                value={form.minPSNR}
                style={{
                  width: "100%",
                  marginTop: 4,
                  borderRadius: 4,
                  border: "1px solid #d0d0d0",
                  padding: 4,
                }}
                onChange={(e) =>
                  setForm((f) => ({ ...f, minPSNR: Number(e.target.value) }))
                }
              />
            </label>
            <div
              style={{
                gridColumn: "1/3",
                margin: "10px 0 0 0",
                textAlign: "center",
              }}
            >
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleFiles}
                disabled={processing || !opencvLoaded}
                style={{ margin: "0 0 8px 0", fontSize: "1em" }}
              />
              <button
                style={{
                  borderRadius: 6,
                  padding: "10px 28px",
                  fontWeight: "bold",
                  background: "#2a5ad7",
                  color: "#fff",
                  border: "none",
                  fontSize: "1.08em",
                  boxShadow: "0 1px 4px #0001",
                  cursor:
                    processing || images.length === 0 || !opencvLoaded
                      ? "not-allowed"
                      : "pointer",
                  opacity:
                    processing || images.length === 0 || !opencvLoaded
                      ? 0.6
                      : 1,
                  marginTop: 8,
                }}
                type="submit"
                disabled={processing || images.length === 0 || !opencvLoaded}
              >
                {processing ? "Processing..." : "Lancer le batch"}
              </button>
            </div>
          </form>
        </div>
        <button
          onClick={processImages}
          disabled={true}
          style={{ display: "none" }}
        >
          {processing ? "Processing..." : "Process Images"}
        </button>
        <ul style={{ marginTop: 24, paddingLeft: 0 }}>
          {images.map((img, idx) => (
            <li key={img.name} style={{ marginBottom: 16, listStyle: "none" }}>
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
                    <div>
                      <b>Taille initiale :</b>{" "}
                      {results[idx].originalSizePx.width} x{" "}
                      {results[idx].originalSizePx.height} px —{" "}
                      {images[idx] && images[idx].size
                        ? `${Math.round(images[idx].size / 1024)} Ko`
                        : "? Ko"}
                    </div>
                    <div>
                      <b>Taille compressée :</b>{" "}
                      {results[idx].optimizedSizePx.width} x{" "}
                      {results[idx].optimizedSizePx.height} px —{" "}
                      {results[idx].blob
                        ? `${Math.round(results[idx].blob.size / 1024)} Ko`
                        : "? Ko"}
                    </div>
                    <div>
                      <b>Lisible :</b>{" "}
                      {results[idx].analysis &&
                      typeof results[idx].analysis.isReadable !== "undefined"
                        ? results[idx].analysis.isReadable
                          ? "Oui"
                          : "Non"
                        : "?"}
                    </div>
                    <div>
                      <b>blurScore :</b>{" "}
                      {results[idx].analysis?.blurScore?.toFixed(1) ?? "?"}
                    </div>
                    <div>
                      <b>contrastScore :</b>{" "}
                      {results[idx].analysis?.contrastScore?.toFixed(1) ?? "?"}
                    </div>
                    <div>
                      <b>Feedbacks :</b>{" "}
                      {results[idx].analysis?.feedbacks?.length
                        ? results[idx].analysis.feedbacks.map((f, i) => (
                            <span
                              key={i}
                              style={{ color: "#b00", marginRight: 8 }}
                            >
                              🔴 {f}
                            </span>
                          ))
                        : "Aucun"}
                    </div>
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
                        margin: "4px auto",
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
