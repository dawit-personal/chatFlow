const Joi = require('joi');

// Inline schema definition for registration validation
const registerSchema = Joi.object({
  email: Joi.string().email().required().messages({
    'string.email': 'Please provide a valid email address.',
    'string.empty': 'Email is required.',
    'any.required': 'Email is required.',
  }),
  password: Joi.string()
    .min(12)
    .pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[!@#$%^&*()_+\\-=\\[\\]{};\':"\\\\|,.<>\\/?]).*$'))
    .required()
    .messages({
      'string.min': 'Password must be at least 12 characters long.',
      'string.pattern.base':
        'Password must include at least one uppercase letter, one lowercase letter, one number, and one special character (e.g., !@#$%^&*).',
      'string.empty': 'Password is required.',
      'any.required': 'Password is required.',
    }),
  confirmPassword: Joi.string().required().valid(Joi.ref('password')).messages({
    'any.only': 'Passwords do not match.',
    'string.empty': 'Confirm password is required.',
    'any.required': 'Confirm password is required.',
  }),
  firstName: Joi.string()
    .pattern(/^[A-Za-z]+$/)
    .required()
    .messages({
      'string.empty': 'First name is required.',
      'any.required': 'First name is required.',
      'string.pattern.base': 'First name can only contain letters.',
    }),
  lastName: Joi.string()
    .pattern(/^[A-Za-z]+$/)
    .required()
    .messages({
      'string.empty': 'Last name is required.',
      'any.required': 'Last name is required.',
      'string.pattern.base': 'Last name can only contain letters.',
    }),
  profilePicture: Joi.string().optional().messages({
    'string.uri': 'Profile picture must be a valid URL.',
  }),
});

describe('Register Validation Schema', () => {
  const validInput = {
    email: 'test@example.com',
    password: 'St',
    confirmPassword: 'StrongPass123!',
    firstName: 'John',
    lastName: 'Doe',
    profilePicture: 'https://example.com/profile.jpg',
  };

  test('should pass with valid input', () => {
    const { error } = registerSchema.validate(validInput);
    expect(error).toBeUndefined();
  });

  test('should fail if email is missing', () => {
    const { error } = registerSchema.validate({ ...validInput, email: undefined });
    expect(error).toBeDefined();
    expect(error.details[0].message).toBe('Email is required.');
  });

  test('should fail if email is empty string', () => {
    const { error } = registerSchema.validate({ ...validInput, email: '' });
    expect(error).toBeDefined();
  });

  test('should fail if email is invalid format', () => {
    const { error } = registerSchema.validate({ ...validInput, email: 'invalid-email' });
    expect(error).toBeDefined();
  });

  test('should fail if password is missing', () => {
    const { error } = registerSchema.validate({ ...validInput, password: undefined });
    expect(error).toBeDefined();
  });

  test('should fail if password is empty string', () => {
    const { error } = registerSchema.validate({ ...validInput, password: '' });
    expect(error).toBeDefined();
  });

  test('should fail if password is too short', () => {
    const { error } = registerSchema.validate({ ...validInput, password: 'Short1!' });

    console.log('Validation error:', error);
    expect(error).toBeDefined();
  });

  test('should fail if password lacks complexity', () => {
    const { error } = registerSchema.validate({ ...validInput, password: 'alllowercasepassword' });
    expect(error).toBeDefined();
  });

  test('should fail if confirmPassword is missing', () => {
    const { error } = registerSchema.validate({ ...validInput, confirmPassword: undefined });
    expect(error).toBeDefined();
  });

  test('should fail if confirmPassword is empty string', () => {
    const { error } = registerSchema.validate({ ...validInput, confirmPassword: '' });
    expect(error).toBeDefined();
  });

  test('should fail if confirmPassword does not match password', () => {
    const { error } = registerSchema.validate({ ...validInput, confirmPassword: 'Mismatch123!' });
    expect(error).toBeDefined();
  });
});
