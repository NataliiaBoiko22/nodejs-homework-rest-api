// const contactsOperations = require("../models/contacts");
const { Contact } = require("../models/contact");
const { HttpError, ctrlWrapper } = require("../helpers");
const { contactValidate, contactUpdateValidate } = require("../models/contact");

const getAll = async (req, res, next) => {
  const { _id: owner, favorite } = req.user;
  const { page = 1, limit = 20 } = req.query;
  const skip = (page - 1) * limit;

  const filter = { owner };
  if (favorite) {
    filter.favorite = favorite === "true";
  }

  const allContacts = await Contact.find(filter)
    .skip(skip)
    .limit(parseInt(limit))
    .populate("owner", "name email");

  return res.status(200).json(allContacts);
};

// const getAll = async (req, res) => {
//   const { _id: owner } = req.user;
//   const { page = 1, limit = 20 } = req.query;
//   const skip = (page - 1) * limit;
//   const result = await Contact.find({ owner })
//     .skip(skip)
//     .limit(limit)
//     .populate("owner", "name email");
//   res.json(result);
// };
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
  const { _id: owner } = req.user;
  const { error } = contactValidate(req.body);
  if (error) {
    const errorMessage = error.details[0].message.replace(/['"]/g, "");
    const fieldName = errorMessage.split(" ")[0];
    return res
      .status(400)
      .json({ message: `missing required ${fieldName} field` });
  } else {
    const result = await Contact.create({ ...req.body, owner });
    res.status(201).send(result);
  }
};

const updateCont = async (req, res, next) => {
  const { id } = req.params;
  const { name, email, phone } = req.body;

  if (!name && !email && !phone) {
    return res.status(400).json({ message: "missing fields" });
  } else {
    const { error } = contactValidate(req.body);
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
  const { favorite } = req.body;
  const { error } = contactUpdateValidate();
  if (error) {
    return res.status(400).json({ message: error.message });
  }
  if (!favorite) {
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
