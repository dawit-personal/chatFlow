const Joi = require('joi');

const { registerSchema } = require('../../../src/middlewares/validation/auth.validation');
describe('Register Validation Schema', () => {
  const validInput = {
    email: 'test@example.com',
    password: 'StrongPass123!',
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
