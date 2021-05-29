const Contact = require("./schemas/contact");

const listContacts = async (userId, query) => {
  try {
    const {
      limit = 5,
      offset = 0,
      sortBy,
      sortByDesc,
      filter,
      favorite = null,
    } = query;
    const optSearch = { owner: userId };
    if (favorite !== null) {
      optSearch.favorite = favorite;
    }
    const res = await Contact.paginate(optSearch, {
      limit,
      offset,
      select: filter ? filter.split("|").join(" ") : "",
      sort: {
        ...(sortBy ? { [`${sortBy}`]: 1 } : {}),
        ...(sortByDesc ? { [`${sortByDesc}`]: 1 } : {}),
      },
    });
    const { docs: contacts, totalDocs: total } = res;
    return { contacts, total, limit, offset };
  } catch (err) {
    return err;
  }
};

const getContactById = async (contactId, userId) => {
  try {
    return await Contact.findOne({ _id: contactId, owner: userId });
  } catch (err) {
    return err;
  }
};

const removeContact = async (contactId, userId) => {
  try {
    return await Contact.findByIdAndRemove({ _id: contactId, owner: userId });
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

const updateContact = async (contactId, body, userId) => {
  try {
    return await Contact.findByIdAndUpdate(
      {
        _id: contactId,
        owner: userId,
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
