const Joi = require("joi");

const schemaContactCreate = Joi.object({
  name: Joi.string()
    .regex(/[A-Z]\w+/)
    .min(3)
    .max(30)
    .required(),
  favorite: Joi.boolean().optional(),

  phone: Joi.number().integer().required(),

  email: Joi.string()
    .email({
      minDomainSegments: 2,
      tlds: { allow: ["com", "net"] },
    })
    .required(),
});
const schemaUpdate = Joi.object({
  name: Joi.string().min(3).max(30).optional(),

  phone: Joi.number().integer().optional(),

  email: Joi.string()
    .email({
      minDomainSegments: 2,
      tlds: { allow: ["com", "net"] },
    })
    .optional(),
});

const validate = async (schema, body, next) => {
  try {
    await schema.validateAsync(body);
    next();
  } catch (err) {
    next({ status: 400, message: err.message });
  }
};

module.exports.validateCreate = (req, res, next) => {
  return validate(schemaContactCreate, req.body, next);
};
module.exports.validateUpdate = (req, res, next) => {
  return validate(schemaUpdate, req.body, next);
};
