const express = require("express");
const router = express.Router();
const { isValidId } = require("../../middlewars");
const ctrl = require("../../controllers/contacts");

router.get("/", ctrl.getAll);

router.get("/:id", isValidId, ctrl.getById);

router.post("/", ctrl.addCont);

router.put("/:id", isValidId, ctrl.updateCont);

router.patch("/:id/favorite", isValidId, ctrl.updateFavorite);

router.delete("/:id", isValidId, ctrl.deleteCont);

module.exports = router;
