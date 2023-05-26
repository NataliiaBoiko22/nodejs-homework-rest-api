const express = require("express");
const router = express.Router();
const { isValidId } = require("../../middlewars");
const ctrl = require("../../controllers/contacts");
const authenticate = require("../../middlewars/authenticate");

router.get("/", authenticate, ctrl.getAll);

router.get("/:id", authenticate, isValidId, ctrl.getById);

router.post("/", authenticate, ctrl.addCont);

router.put("/:id", authenticate, isValidId, ctrl.updateCont);

router.patch("/:id/favorite", authenticate, isValidId, ctrl.updateFavorite);

router.delete("/:id", authenticate, isValidId, ctrl.deleteCont);

module.exports = router;
