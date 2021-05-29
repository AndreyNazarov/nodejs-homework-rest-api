const express = require("express");
const router = express.Router();
const ctrl = require("../../../controllers/contacts");
const { validateCreate } = require("./validation");
// const passport = require("passport");
// require("../config/passport");

const guard = require("../../../helper/guard");

router.get("/", guard, ctrl.getAll);

router.get("/:contactId", guard, ctrl.getById);

router.post("/", guard, validateCreate, ctrl.create);

router.delete("/:contactId", guard, ctrl.remove);

router.patch("/:contactId", guard, ctrl.update);
router.patch("/:contactId/favorite", guard, ctrl.favUpdate);

module.exports = router;
