// const contactsOperations = require("../models/contacts");
const { Contact } = require("../models/contact");
const { HttpError, ctrlWrapper } = require("../helpers");
const { contactValidate, contactUpdateValidate } = require("../models/contact");

const getAll = async (req, res, next) => {
  const allContacts = await Contact.find();

  return res.status(200).json(allContacts);
};

const getById = async (req, res) => {
  const { id } = req.params;
  const contact = await Contact.findById(id);

  if (contact) {
    return res.status(200).json(contact);
  } else {
    throw HttpError(404, "Not found");
  }
};

const addCont = async (req, res, next) => {
  const { error } = contactValidate(req.body);
  if (error) {
    const errorMessage = error.details[0].message.replace(/['"]/g, "");
    const fieldName = errorMessage.split(" ")[0];
    return res
      .status(400)
      .json({ message: `missing required ${fieldName} field` });
  } else {
    const result = await Contact.create(req.body);
    res.status(201).send(result);
  }
};

const updateCont = async (req, res, next) => {
  const { id } = req.params;
  const { name, email, phone } = req.body;

  if (!name && !email && !phone) {
    return res.status(400).json({ message: "missing fields" });
  } else {
    const { error } = contactUpdateValidate(req.body);
    if (error) {
      const errorMessage = error.details[0].message.replace(/['"]/g, "");
      const fieldName = errorMessage.split(" ")[0];
      return res
        .status(400)
        .json({ message: `missing required ${fieldName} field` });
    }
    const result = await Contact.findByIdAndUpdate(id, req.body, { new: true });
    if (!result) {
      throw HttpError(404, "Not found");
    }
    res.status(200).json(result);
  }
};

const updateFavorite = async (req, res, next) => {
  const { id } = req.params;

  const { error } = contactUpdateValidate();
  if (error) {
    return res.status(400).json({ message: `missing field favorite` });
  }
  const result = await Contact.findByIdAndUpdate(id, req.body, { new: true });
  if (!result) {
    throw HttpError(404, "Not found");
  }
  res.status(200).json(result);
};
const deleteCont = async (req, res, next) => {
  const { id } = req.params;
  const result = await Contact.findByIdAndRemove(id);
  if (!result) {
    throw HttpError(404, "Not found");
  }
  res.status(200).json({ message: "Contact deleted" });
};

module.exports = {
  getAll: ctrlWrapper(getAll),
  getById: ctrlWrapper(getById),
  addCont: ctrlWrapper(addCont),
  updateCont: ctrlWrapper(updateCont),
  updateFavorite: ctrlWrapper(updateFavorite),
  deleteCont: ctrlWrapper(deleteCont),
};
