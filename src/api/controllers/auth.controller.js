const authService = require('../../services/auth.service');

// @desc    Register a new user
// @route   POST /auth/register
// @access  Public
async function register(req, res, next) {
    const { email, password, confirmPassword } = req.body;

   

    try {
        const result = await authService.registerUser({ email, password });


        return res.status(201).json({
            message: 'User registered successfully',
           
        });
    } catch (error) {
        // Log the error for server-side debugging
        console.error('Registration error:', error);

        if (error.message === 'Email already exists') {
            return res.status(409).json({ message: error.message });
        }

        // Generic error response
        return res.status(500).json({ message: 'Server error during registration.' });
    }
}

module.exports = {
    register,
}; 