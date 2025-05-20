import { useEffect, useState } from "react";

/**
 * Hook React pour charger dynamiquement OpenCV.js et attendre son initialisation.
 * Retourne { loaded, error }.
 */
export function useOpenCV() {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (window.cv) {
      setLoaded(true);
      return;
    }
    const script = document.createElement("script");
    script.src = "https://docs.opencv.org/4.x/opencv.js";
    script.setAttribute("async", "true");
    script.async = true;
    script.onload = async () => {
      cv = await cv;
      if (window.cv && window.cv["onRuntimeInitialized"]) {
        window.cv["onRuntimeInitialized"] = () => setLoaded(true);
      } else {
        setLoaded(true); // fallback
      }
    };
    script.onerror = (e) => setError(e);
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return { loaded, error };
}
