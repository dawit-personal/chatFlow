const Joi = require('joi');

const registerSchema = Joi.object({
    email: Joi.string().email().required().messages({
        'string.email': 'Please provide a valid email address.',
        'string.empty': 'Email is required.',
        'any.required': 'Email is required.'
    }),
    password: Joi.string()
        .min(12) // Enforce minimum length separately for a clearer initial message if only length fails
        .pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[!@#$%^&*()_+\\-=\\[\\]{};\'\":\\\\|,.<>\\/?]).*$'))
        .required()
        .messages({
            'string.min': 'Password must be at least 12 characters long.',
            'string.pattern.base': 'Password must include at least one uppercase letter, one lowercase letter, one number, and one special character (e.g., !@#$%^&*).',
            'string.empty': 'Password is required.',
            'any.required': 'Password is required.'
        }),
    confirmPassword: Joi.string().required().valid(Joi.ref('password')).messages({
        'any.only': 'Passwords do not match.',
        'string.empty': 'Confirm password is required.',
        'any.required': 'Confirm password is required.'
    })
});

const loginSchema = Joi.object({
    email: Joi.string().required().messages({
      'string.empty': 'Email is required',
      'any.required': 'Email is required',
    }),
    password: Joi.string().required().messages({
      'string.empty': 'Password is required',
      'any.required': 'Password is required',
    }),
  });


module.exports = {
    registerSchema,loginSchema
    
}; 