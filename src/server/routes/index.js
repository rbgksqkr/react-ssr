import { Router } from "express";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

import React from "react";
import { renderToString } from "react-dom/server";
import App from "../../client/App";
import { fetchMoviesPopular } from "../apis/movie";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = Router();

router.get("/", async (_, res) => {
  const popularMovies = await fetchMoviesPopular();
  const renderedApp = renderToString(
    <App popularMovies={popularMovies.results} />
  );

  const templatePath = path.join(__dirname, "../../../views", "index.html");
  let template = fs.readFileSync(templatePath, "utf-8");
  template = template.replace(
    "<!--${INIT_DATA_AREA}-->",
    /*html*/ `
    <script>
      window.__INITIAL_DATA__ = {
        movies: ${JSON.stringify(popularMovies)}
      }
    </script>
  `
  );
  const renderedHTML = template.replace(
    "<!--${MOVIE_ITEMS_PLACEHOLDER}-->",
    renderedApp
  );

  res.send(renderedHTML);
});

export default router;
