const userService = require('../../services/user.service');
// @desc    Get user profile
// @route   GET /users/me
// @access  Private
async function getMe(req, res, next) {
   
    try {
       
        const userId = req.user.userId; 
        const user = await userService.getUserById(userId);
        return res.status(201).json({
            user,
            message: 'Success',
       
        });
    } catch (error) {
        // Log the error for server-side debugging
        console.error('Registration error:', error);

        // Generic error response
        return res.status(500).json({ message: 'Server error during registration.' });
    }
}

async function searchByFirstName(req, res, next) {
    const { firstName } = req.body;
    const users = await userService.searchByFirstName(firstName);
    res.json(users);
}


module.exports = {
   getMe,
   searchByFirstName,
}; 