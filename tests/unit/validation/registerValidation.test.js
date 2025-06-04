const { registerSchema } = require('../../../src/middlewares/validation/registerValidation');

describe('Register Validation Schema', () => {
  const validInput = {
    email: 'user@example.com',
    password: 'Str0ng@Password!',
    confirmPassword: 'Str0ng@Password!',
  };

  test('should pass with valid input', () => {
    const { error } = registerSchema.validate(validInput);
    expect(error).toBeUndefined();
  });

  test('should fail if email is missing', () => {
    const { error } = registerSchema.validate({
      ...validInput,
      email: undefined,
    });
    expect(error.details[0].message).toBe('Email is required.');
  });

  test('should fail if email is empty string', () => {
    const { error } = registerSchema.validate({
      ...validInput,
      email: '',
    });
    expect(error.details[0].message).toBe('Email is required.');
  });

  test('should fail if email is invalid format', () => {
    const { error } = registerSchema.validate({
      ...validInput,
      email: 'invalid-email',
    });
    expect(error.details[0].message).toBe('Please provide a valid email address.');
  });

  test('should fail if password is missing', () => {
    const { error } = registerSchema.validate({
      ...validInput,
      password: undefined,
    });
    expect(error.details[0].message).toBe('Password is required.');
  });

  test('should fail if password is empty string', () => {
    const { error } = registerSchema.validate({
      ...validInput,
      password: '',
    });
    expect(error.details[0].message).toBe('Password is required.');
  });

  test('should fail if password is too short', () => {
    const { error } = registerSchema.validate({
      ...validInput,
      password: 'Short1!',
      confirmPassword: 'Short1!',
    });
    expect(error.details[0].message).toBe('Password must be at least 12 characters long.');
  });

  test('should fail if password lacks complexity', () => {
    const { error } = registerSchema.validate({
      ...validInput,
      password: 'alllowercasepassword',
      confirmPassword: 'alllowercasepassword',
    });
    expect(error.details[0].message).toBe(
      'Password must include at least one uppercase letter, one lowercase letter, one number, and one special character (e.g., !@#$%^&*).'
    );
  });

  test('should fail if confirmPassword is missing', () => {
    const { error } = registerSchema.validate({
      ...validInput,
      confirmPassword: undefined,
    });
    expect(error.details[0].message).toBe('Confirm password is required.');
  });

  test('should fail if confirmPassword is empty string', () => {
    const { error } = registerSchema.validate({
      ...validInput,
      confirmPassword: '',
    });
    expect(error.details[0].message).toBe('Passwords do not match.');
  });

  test('should fail if confirmPassword does not match password', () => {
    const { error } = registerSchema.validate({
      ...validInput,
      confirmPassword: 'Different@Password1',
    });
    expect(error.details[0].message).toBe('Passwords do not match.');
  });
});
