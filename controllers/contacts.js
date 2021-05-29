const Contacts = require("../model/index");

const getAll = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { contacts, total, limit, offset } = await Contacts.listContacts(
      userId,
      req.query
    );

    return res
      .status(200)
      .json({
        status: "success",
        code: 200,
        data: { total, contacts, limit, offset },
      });
  } catch (err) {
    next(err);
  }
};

const getById = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const contact = await Contacts.getContactById(req.params.contactId, userId);

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
};

const create = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const contact = await Contacts.addContact({ ...req.body, owner: userId });
    return res
      .status(201)
      .json({ status: "success", code: 201, data: contact });
  } catch (error) {
    next(error);
  }
};

const remove = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const contact = await Contacts.removeContact(req.params.contactId, userId);

    return res
      .status(200)
      .json({ status: "success", code: 200, data: { contact } });
  } catch (err) {
    next(err);
  }
};

const update = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const contact = await Contacts.updateContact(
      req.params.contactId,
      req.body,
      userId
    );

    return res
      .status(200)
      .json({ status: "success", code: 200, data: { contact } });
  } catch (err) {
    next(err);
  }
};
const favUpdate = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const contact = await Contacts.update(
      req.params.contactId,
      req.body,
      userId
    );
    if (contact) {
      return res
        .status(200)
        .json({ status: "success", code: 200, body: { contact } });
    }
    return res
      .status(404)
      .json({ status: "error", code: 404, message: "Not Found" });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getAll,
  getById,
  create,
  remove,
  update,
  favUpdate,
};
