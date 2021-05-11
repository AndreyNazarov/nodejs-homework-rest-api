const fs = require("fs/promises");
const path = require("path");
const contactsPath = path.join(__dirname, "contacts.json");
const { v4: uuidv4 } = require("uuid");

const listContacts = async () => {
  try {
    const data = await fs.readFile(contactsPath);
    const parsedContacts = JSON.parse(data);

    return parsedContacts;
  } catch (err) {
    return err;
  }
};

const getContactById = async (contactId) => {
  try {
    const data = await fs.readFile(contactsPath);
    const parsedContacts = JSON.parse(data);

    const contact = parsedContacts.filter((item) => {
      return item.id.toString() === contactId;
    });

    return contact;
  } catch (err) {
    return err;
  }
};

const removeContact = async (contactId) => {
  try {
    const data = await fs.readFile(contactsPath);
    const parsedContacts = JSON.parse(data);
    const contact = parsedContacts.filter(
      (contact) => contact.id.toString() !== contactId
    );
    const newContacts = await fs.writeFile(
      contactsPath,
      JSON.stringify(contact)
    );
    return newContacts;
  } catch (err) {
    return err;
  }
};

const addContact = async (body) => {
  try {
    const id = uuidv4();
    const record = {
      id,
      body,
    };
    const data = await fs.readFile(contactsPath);
    const content = JSON.parse(data);
    content.push(record);
    await fs.writeFile(contactsPath, JSON.stringify(content));
    return content;
  } catch (err) {
    return err;
  }
};

const updateContact = async (contactId, body) => {
  try {
    const data = await fs.readFile(contactsPath);
    const parsedContacts = JSON.parse(data);
    const contact = parsedContacts.find(
      (contact) => contact.id.toString() === contactId
    );
    // console.log();
    const newContact = Object.assign(contact, { ...body });
    parsedContacts.splice(parsedContacts.indexOf(contact), 1, newContact);
    console.log(parsedContacts);
    await fs.writeFile(contactsPath, JSON.stringify(parsedContacts));

    return newContact;
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
