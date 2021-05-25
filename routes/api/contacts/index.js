const express = require("express");
const router = express.Router();
const ctrl = require("../../../controllers/contacts");
const { validateCreate } = require("./validation");
router.get("/", ctrl.getAll);

router.get("/:contactId", ctrl.getById);

router.post("/", validateCreate, ctrl.create);

router.delete("/:contactId", ctrl.remove);

router.patch("/:contactId", ctrl.update);
router.patch("/:contactId/favorite", ctrl.favUpdate);

module.exports = router;
