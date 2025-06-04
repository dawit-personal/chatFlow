const authService = require('../../services/auth.service');

// @desc    Register a new user
// @route   POST /auth/register
// @access  Public
async function register(req, res, next) {
    const { email, password, firstName, lastName, profilePicture } = req.body;

    try {
        const result = await authService.registerUser({ email, password, firstName, lastName, profilePicture });
        return res.status(201).json({
            message: 'User registered successfully',
            email: result.email
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

// @desc    Login user
// @route   POST /auth/login
// @access  Public
async function login(req, res, next) {
    const { email, password } = req.body;

    try {
        const result = await authService.loginUser({ email, password }, req.ip, req.headers['user-agent']);
        return res.status(200).json({
            message: 'Login successful',
            token: result.token, // Assuming service returns a token
            email: result.email
        });
    } catch (error) {
        console.error('Login error:', error);

        if (error.message === 'Invalid email or password') {
            return res.status(401).json({ message: error.message });
        }

        return res.status(500).json({ message: 'Server error during login.' });
    }
}

module.exports = {
    register,
    login,
}; 