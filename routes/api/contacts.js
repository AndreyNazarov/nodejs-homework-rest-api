const express = require("express");
const router = express.Router();
const Contacts = require("../../model/index");
const { validateCreate, validateUpdate } = require("./validation");
router.get("/", async (_req, res, next) => {
  try {
    const contacts = await Contacts.listContacts();

    return res
      .status(200)
      .json({ status: "success", code: 200, data: { contacts } });
  } catch (err) {
    next(err);
  }
});

router.get("/:contactId", async (req, res, next) => {
  try {
    const contact = await Contacts.getContactById(req.params.contactId);

    if (contact) {
      return res
        .status(200)
        .json({ status: "success", code: 200, data: { contact } });
    }
    return res
      .status(404)
      .json({ status: "error", code: 404, message: "Not Found" });
  } catch (err) {
    next(err);
  }
});

router.post("/", validateCreate, async (req, res, _next) => {
  const contact = await Contacts.addContact(req.body);
  return res
    .status(201)
    .json({ status: "success", code: 201, data: { contact } });
});

router.delete("/:contactId", async (req, res, next) => {
  try {
    const contact = await Contacts.removeContact(req.params.contactId);

    return res
      .status(200)
      .json({ status: "success", code: 200, data: { contact } });
  } catch (err) {
    next(err);
  }
});

router.patch("/:contactId", validateUpdate, async (req, res, next) => {
  try {
    const contact = await Contacts.updateContact(
      req.params.contactId,
      req.body
    );

    return res
      .status(200)
      .json({ status: "success", code: 200, data: { contact } });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
