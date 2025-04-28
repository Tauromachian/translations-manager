import express from "npm:express@5";

export const router = express.Router();

import * as collectionsController from "../controllers/collections.controller.js";
import * as languagesController from "../controllers/languages.controller.js";

router.route("/collections")
  .get(collectionsController.index).post(collectionsController.store);

router.route("/collections/:id")
  .all((req, res, next) => {
    const { id } = req.params;

    if (!id || Number.isNaN(Number(id))) {
      return res.status(400).json({ error: "ID should be a number" });
    }

    next();
  }).delete(collectionsController.destroy).put(collectionsController.edit);

router.route("/languages")
  .get(languagesController.index).post(languagesController.store);

router.route("/languages/:id")
  .all((req, res, next) => {
    const { id } = req.params;

    if (!id || Number.isNaN(Number(id))) {
      return res.status(400).json({ error: "ID should be a number" });
    }

    next();
  }).delete(languagesController.destroy).put(languagesController.edit);
