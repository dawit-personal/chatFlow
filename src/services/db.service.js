import models from '../db/models/index.js'; // Adjusted import path
const { sequelize } = models; // Destructure the sequelize instance from the models export

// Placeholder for loggingService if not defined elsewhere
// import loggingService from './logging.service'; // Example if you have one
const loggingService = {
  error: (error, message, code) => {
    console.error(`Error Code: ${code} - ${message}:`, error);
  }
};

class DBService {
  static async performTransaction(callback, postCommitCallback = null, maxRetries = 3) {
    let attempts = 0;
    while (attempts < maxRetries) {
      const transaction = await sequelize.transaction();
      try {
        // Execute the main transaction callback
        const result = await callback(transaction);

        // Commit the transaction
        await transaction.commit();

        // Execute post-commit callback if provided
        if (postCommitCallback) {
          await postCommitCallback();
        }

        // Return the result of the main transaction callback
        return result;
      } catch (error) {
        // Check if the transaction is still active before attempting rollback
        if (transaction && !transaction.finished) { // Added check for transaction existence
          await transaction.rollback();
        }

        console.error(error, 'performTransaction failed', 31);
        // Handle retry logic for specific errors
        if (error.message.includes('Lock wait timeout exceeded')) {
          attempts += 1;
          console.log(`Retrying transaction... Attempt ${attempts}`, 'performTransaction', 20);
          if (attempts >= maxRetries) {
            throw new Error('Max retries reached. Transaction failed.');
          }
        } else {
          throw error;
        }
      }
    }
  }
}

export default DBService;
