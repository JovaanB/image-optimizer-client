# React + Vite Batch Image Optimizer

This project is a React front-end using Vite. It allows users to upload multiple images and processes them in batch using an image processing library (`image-optimizer-client`).

## Features

- Upload multiple images at once
- Batch processing with clear UI feedback for each image
- Efficient and user-friendly interface

## Usage

1. Start the development server:
   ```sh
   npm run dev
   ```
2. Open your browser to the provided local URL.
3. Upload images and click "Process Images" to see results for each image.

## Note

- The image processing logic uses a placeholder. Integrate `image-optimizer-client` in `src/App.jsx` when available.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
