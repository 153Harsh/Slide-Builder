import JSZip from "jszip";

import { saveAs } from "file-saver";

import type {
  SlideType,
} from "../store/editorStore";

import { generateReactApp } from "./generateReactApp";

export async function generateViteProject(
  slides: SlideType[]
) {
  const zip = new JSZip();

  // --------------------
  // SRC FOLDER
  // --------------------

  const srcFolder =
    zip.folder("src");

  // --------------------
  // APP.JSX
  // --------------------

  const appCode =
    generateReactApp(
      slides
    );

  srcFolder?.file(
    "App.jsx",
    appCode
  );

  // --------------------
  // MAIN.JSX
  // --------------------

  srcFolder?.file(
    "main.jsx",
    `
import React from "react";
import ReactDOM from "react-dom/client";

import App from "./App";

import "./index.css";

ReactDOM.createRoot(
  document.getElementById("root")
).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
`
  );

  // --------------------
  // INDEX.CSS
  // --------------------

  srcFolder?.file(
    "index.css",
    `
* {
  box-sizing: border-box;
}

body {
  margin: 0;

  font-family:
    Arial,
    sans-serif;

  overflow: hidden;
}
`
  );

  // --------------------
  // PACKAGE.JSON
  // --------------------

  zip.file(
    "package.json",
    `
{
  "name": "generated-app",

  "private": true,

  "version": "0.0.0",

  "type": "module",

  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  },

  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0"
  },

  "devDependencies": {
    "@vitejs/plugin-react": "^4.0.0",
    "vite": "^5.0.0"
  }
}
`
  );

  // --------------------
  // VITE CONFIG
  // --------------------

  zip.file(
    "vite.config.js",
    `
import { defineConfig } from "vite";

import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
});
`
  );

  // --------------------
  // INDEX.HTML
  // --------------------

  zip.file(
    "index.html",
    `
<!DOCTYPE html>

<html lang="en">
  <head>
    <meta charset="UTF-8" />

    <meta
      name="viewport"
      content="
        width=device-width,
        initial-scale=1.0
      "
    />

    <title>
      Generated App
    </title>
  </head>

  <body>
    <div id="root"></div>

    <script
      type="module"
      src="/src/main.jsx"
    ></script>
  </body>
</html>
`
  );

  // --------------------
  // GENERATE ZIP
  // --------------------

  const content =
    await zip.generateAsync({
      type: "blob",
    });

  saveAs(
    content,
    "generated-react-app.zip"
  );
}