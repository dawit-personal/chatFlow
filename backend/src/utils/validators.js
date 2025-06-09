// Generic validation middleware
const validate = (schema) => (req, res, next) => {
    const { error } = schema.validate(req.body, { abortEarly: false }); // abortEarly: false to get all errors
    if (error) {
        const errors = error.details.map((detail) => detail.message);
        return res.status(400).json({ message: "Validation error", errors });
    }
    next();
};

module.exports = {
    validate,
}; 