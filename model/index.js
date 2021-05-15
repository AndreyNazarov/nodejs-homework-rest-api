const Contact = require("./schemas/contact");
// const fs = require("fs/promises");
// const path = require("path");
// const contactsPath = path.join(__dirname, "contacts.json");
// const { v4: uuidv4 } = require("uuid");

const listContacts = async () => {
  try {
    return await Contact.find();
  } catch (err) {
    return err;
  }
};

const getContactById = async (contactId) => {
  try {
    return await Contact.findOne({ _id: contactId });
  } catch (err) {
    return err;
  }
};

const removeContact = async (contactId) => {
  try {
    return await Contact.findByIdAndRemove({ _id: contactId });
  } catch (err) {
    return err;
  }
};

const addContact = async (body) => {
  try {
    return await Contact.create(body);
  } catch (err) {
    return err;
  }
};

const updateContact = async (contactId, body) => {
  try {
    return await Contact.findByIdAndUpdate(
      {
        _id: contactId,
      },
      { ...body },
      { new: true }
    );
  } catch (err) {
    return err;
  }
};

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
};
