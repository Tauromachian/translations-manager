import express from "express";

export const router = express.Router();

import * as collectionsController from "@/server/controllers/collections.controller.js";
import * as languagesController from "@/server/controllers/languages.controller.js";
import * as translationsController from "@/server/controllers/translations.controller.js";

/**
 * @openapi
 * /collections:
 *   get:
 *     summary: Retrieves collections
 *     tags: [Collections]
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
 *     tags: [Collections]
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
 *
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
 *       400:
 *         description: Invalid input
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 */
router.route("/collections")
  .get(collectionsController.index).post(collectionsController.store);

/**
 * @openapi
 * /collections:
 *   delete:
 *     tags: [Collections]
 *     204:
 *       description: Deletes one collection
 *   put:
 *     summary: Edits a Collection
 *     tags: [Collections]
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
 *       400:
 *         description: Invalid input
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 */
router.route("/collections/:id")
  .all((req, res, next) => {
    const { id } = req.params;

    if (!id || Number.isNaN(Number(id))) {
      return res.status(400).json({ error: "ID should be a number" });
    }

    next();
  }).delete(collectionsController.destroy).put(collectionsController.edit);

/**
 * @openapi
 * /languages:
 *   get:
 *     summary: Retrieve a list of all languages
 *     tags: [Languages]
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
 *                     type: number
 *                     example: 1
 *                   name:
 *                     type: string
 *                     example: English
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Internal server error
 *   post:
 *     summary: Create a new language
 *     tags: [Languages]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: Spanish
 *             required:
 *               - name
 *     responses:
 *       201:
 *         description: Language created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: number
 *                   example: 1
 *                 name:
 *                   type: string
 *                   example: Spanish
 *       400:
 *         description: Invalid input data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Invalid input data
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Internal server error
 */
router.route("/languages")
  .get(languagesController.index).post(languagesController.store);

/**
 * @openapi
 * /language-translations-i18n/code/{languageCode}/collection-id/{collectionId}:
 *   get:
 *     summary: Retrieve a i18n compatible JSON of translations of a language and its collection.
 *     tags: [Languages]
 *     parameters:
 *       - in: path
 *         name: languageCode
 *         type: string
 *         required: true
 *         description: Code of the language
 *       - in: path
 *         name: collectionId
 *         type: integer
 *         required: true
 *         description: Collection id of the language
 *     responses:
 *       200:
 *         description: A successful response
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *       400:
 *          description: Bad request
 */
router.get(
  "/language-translations-i18n/code/:languageCode/collection-id/:collectionId",
  languagesController.getLanguageTranslationsForI18N,
);

/**
 * @openapi
 * /languages/{id}:
 *   delete:
 *     summary: Delete a language by ID
 *     tags: [Languages]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the language to delete
 *     responses:
 *       200:
 *         description: Language deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Language deleted successfully
 *       400:
 *         description: Invalid ID
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: ID should be a number
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Internal server error
 *   put:
 *     summary: Update a language by ID
 *     tags: [Languages]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the language to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: French
 *             required:
 *               - name
 *     responses:
 *       200:
 *         description: Language updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: number
 *                   example: 1
 *                 name:
 *                   type: string
 *                   example: French
 *       400:
 *         description: Invalid ID or input data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Invalid ID or input data
 *       404:
 *         description: Language not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Language not found
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Internal server error
 */

router.route("/languages/:id")
  .all((req, res, next) => {
    const { id } = req.params;

    if (!id || Number.isNaN(Number(id))) {
      return res.status(400).json({ error: "ID should be a number" });
    }

    next();
  }).delete(languagesController.destroy).put(languagesController.edit);

/**
 * @openapi
 * /translations:
 *   get:
 *     summary: Retrieve a list of all translations
 *     tags: [Translations]
 *     parameters:
 *       - in: query
 *         name: filter[languagesIds]
 *         style: form
 *         explode: true
 *         schema:
 *            type: array
 *            example: [1,2,3]
 *            items:
 *              type: integer
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
 *                     type: number
 *                     example: 1
 *                   name:
 *                     type: string
 *                     example: English
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Internal server error
 *   post:
 *     summary: Create a new translation
 *     tags: [Translations]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: Spanish
 *             required:
 *               - name
 *     responses:
 *       201:
 *         description: Language created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: number
 *                   example: 1
 *                 name:
 *                   type: string
 *                   example: Spanish
 *       400:
 *         description: Invalid input data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Invalid input data
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Internal server error
 */
router.route("/translations")
  .get(translationsController.index).post(translationsController.store);

/**
 * @openapi
 * /translations/{id}:
 *   delete:
 *     summary: Delete a translation by ID
 *     tags: [Translations]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the translation to delete
 *     responses:
 *       200:
 *         description: Language deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Language deleted successfully
 *       400:
 *         description: Invalid ID
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: ID should be a number
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Internal server error
 *   put:
 *     summary: Update a translation by ID
 *     tags: [Translations]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the translation to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: French
 *             required:
 *               - name
 *     responses:
 *       200:
 *         description: Language updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: number
 *                   example: 1
 *                 name:
 *                   type: string
 *                   example: French
 *       400:
 *         description: Invalid ID or input data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Invalid ID or input data
 *       404:
 *         description: Language not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Language not found
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Internal server error
 */

router.route("/translations/:id")
  .all((req, res, next) => {
    const { id } = req.params;

    if (!id || Number.isNaN(Number(id))) {
      return res.status(400).json({ error: "ID should be a number" });
    }

    next();
  }).delete(translationsController.destroy).put(translationsController.edit);
