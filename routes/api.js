import express from "npm:express@5";

export const router = express.Router();

import {
  destroy,
  edit,
  index,
  store,
} from "../controllers/collections.controller.js";

router.route("/collections")
  .get(index).post(store);

router.route("/collections/:id")
  .all((req, res, next) => {
    const { id } = req.params;

    if (!id || Number.isNaN(Number(id))) {
      return res.status(400).json({ error: "ID should be a number" });
    }

    next();
  }).delete(destroy).put(edit);
