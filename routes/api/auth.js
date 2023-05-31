const express = require("express");
const ctrl = require("../../controllers/auth");
const { validateBody, authenticate, upload } = require("../../middlewars");
const router = express.Router();

const { schemas } = require("../../models/user");

router.post("/register", validateBody(schemas.registerSchema), ctrl.register);

router.post("/login", validateBody(schemas.loginSchema), ctrl.login);

router.get("/current", authenticate, ctrl.getCurrent);

router.post("/logout", authenticate, ctrl.logout);

router.patch(
  "/",
  authenticate,
  validateBody(schemas.updateSubscription),
  ctrl.updateUser
);
router.patch(
  "/avatars",
  authenticate,
  upload.single("avatar"),
  ctrl.updateAvatar
);
module.exports = router;
