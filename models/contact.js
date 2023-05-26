const { Schema, model } = require("mongoose");
const { handleMongooseError } = require("../helpers");
const Joi = require("joi");
const contactSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Set name for contact"],
    },
    email: {
      type: String,
    },
    phone: {
      type: String,
    },
    favorite: {
      type: Boolean,
      default: false,
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: "user",
    },
  },
  { versionKey: false, timestamps: true }
);

const addSchema = Joi.object({
  name: Joi.string().min(2).max(30).required(),
  email: Joi.string()
    .email({
      minDomainSegments: 2,
      tlds: { allow: ["com", "net", "org"] },
    })
    .required(),
  phone: Joi.string().min(3).max(15).required(),
  favorite: Joi.bool(),
});

const updateFavoriteSchema = Joi.object({
  favorite: Joi.boolean().required(),
});

const validator = (schema) => (body) => {
  return schema.validate(body, { abortEarly: false });
};
const contactValidate = validator(addSchema);
const contactUpdateValidate = validator(updateFavoriteSchema);

contactSchema.post("save", handleMongooseError);

const Contact = model("contact", contactSchema);
module.exports = { Contact, contactValidate, contactUpdateValidate };
