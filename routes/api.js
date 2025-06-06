import express from "npm:express@5";

export const router = express.Router();

import * as collectionsController from "../controllers/collections.controller.js";
import * as languagesController from "../controllers/languages.controller.js";
import * as translationsController from "../controllers/translations.controller.js";

/**
 * @openapi
 * /collections:
 *   get:
 *     summary: Retrieves collections
 *     responses:
 *       200:
 *         description: A successful response
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                     example: 1
 *                   name:
 *                     type: string
 *                     example: "AximandiasCorp"
 *                   description:
 *                     type: string
 *                     example: "This is the description of a collection"
 *   post:
 *     summary: Add one collection
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *                 example: "AximandiasCorp"
 *               description:
 *                 type: string
 *                 example: "This is the description of a collection"
 *     responses:
 *       201:
 *         description: Successful insert new collection
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   example: 1
 *                 name:
 *                   type: string
 *                   example: "AximandiasCorp"
 *                 description:
 *                   type: string
 *                   example: "This is the description of a collection"
 */
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

router.route("/translations")
  .get(translationsController.index).post(translationsController.store);

router.route("/translations/:id")
  .all((req, res, next) => {
    const { id } = req.params;

    if (!id || Number.isNaN(Number(id))) {
      return res.status(400).json({ error: "ID should be a number" });
    }

    next();
  }).delete(translationsController.destroy).put(translationsController.edit);
