'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Enable the pg_trgm extension for trigram indexing
    await queryInterface.sequelize.query(`CREATE EXTENSION IF NOT EXISTS pg_trgm;`);

    // Create a GIN index using trigram operations on firstName
    await queryInterface.sequelize.query(`
      CREATE INDEX userprofiles_firstname_trgm_idx
      ON "UserProfiles" USING GIN ("firstName" gin_trgm_ops);
    `);
  },

  down: async (queryInterface, Sequelize) => {
    // Drop the GIN index
    await queryInterface.sequelize.query(`DROP INDEX IF EXISTS userprofiles_firstname_trgm_idx;`);
  }
};
