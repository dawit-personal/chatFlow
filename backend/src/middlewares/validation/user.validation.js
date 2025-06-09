const Joi = require('joi');

const searchUserSchema = Joi.object({
  firstName: Joi.string()
    .min(2)
    .regex(/^[^\d]+$/)
    .required()
    .messages({
      'string.base': 'Name must be a string',
      'string.min': 'Name must be at least 2 characters long',
      'string.pattern.base': 'Name must not contain numbers',
      'any.required': 'Name is required',
    }),
});

module.exports = {
  searchUserSchema,
};