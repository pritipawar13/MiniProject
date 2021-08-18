const Joi = require('joi');

const studentschema = Joi.object({
  Firstname: Joi.string().required(),
  Lastname: Joi.string().required(),
  Email: Joi.string().email().lowercase().required(),
  PhoneNumber: Joi.number().max(10).required(),
  Address: Joi.string().min(2).max(100).required(),
  ProfilePhoto: Joi.string().required(),
});

module.exports = {
  studentschema,
};
