// In-memory store for demonstration purposes
const users = [];
let userIdCounter = 1;

// @desc    Register a new user (simulated)
// @param   userData - Object containing email and password
async function registerUser(userData) {
    const { email, password } = userData;

  
    const existingUser = users.find(user => user.email === email);
    if (existingUser) {
     
        throw new Error('Email already exists');
    }

    console.log(`Simulating hashing for password: ${password}`);
    const hashedPassword = `hashed_${password}`;

    const newUser = {
        id: userIdCounter++,
        email: email,
        password: hashedPassword, // Store the hashed password
    };

    // Simulate saving the user to the database
    users.push(newUser);
    console.log('Current users in memory:', users);

    // Return some data about the created user (excluding sensitive info like password)
    return {
        id: newUser.id,
        email: newUser.email,
        message: 'User created successfully (simulated)'
    };
}

module.exports = {
    registerUser,
}; 