const fs = require('fs');
const path = require('path');
const readline = require('readline');

const inputName = process.argv[2];
if (!inputName) {
  console.error('❌ Please provide a model name (e.g. chat)');
  process.exit(1);
}

// Capitalize first letter for model class name
function toPascalCase(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function toCamelCase(str) {
  return str.charAt(0).toLowerCase() + str.slice(1);
}

const modelName = toPascalCase(inputName);        // Chat
const camelModelName = toCamelCase(modelName);    // chat
const className = `${modelName}Repository`;
const fileName = `${camelModelName}.repository.js`;
const filePath = path.join(__dirname, '../src/repositories', fileName);

const content = `const { ${modelName} } = require('../../db/models');

class ${className} {
  async create${modelName}(data, options = {}) {
    return await ${modelName}.create(data, options);
  }

  async get${modelName}ById(id) {
    return await ${modelName}.findByPk(id);
  }

  async getAll${modelName}s() {
    return await ${modelName}.findAll();
  }

  async update${modelName}(id, updates, options = {}) {
    const item = await ${modelName}.findByPk(id, options);
    if (!item) return null;
    return await item.update(updates, options);
  }

  async delete${modelName}(id, options = {}) {
    return await ${modelName}.destroy({ where: { id }, ...options });
  }

  async count${modelName}s() {
    return await ${modelName}.count();
  }

  async find${modelName}(where = {}, attributes = null) {
    return await ${modelName}.findOne({
      where,
      attributes: attributes || null,
      raw: true,
    });
  }

  async findAll${modelName}s({ where = {}, offset = 0, limit = 10 }) {
    return await ${modelName}.findAll({
      where,
      offset,
      limit,
      order: [['updatedAt', 'DESC']],
      raw: true,
    });
  }
}

module.exports = new ${className}();
`;

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function askQuestion(query) {
  return new Promise((resolve) => rl.question(query, (ans) => resolve(ans.trim())));
}

async function run() {
  if (fs.existsSync(filePath)) {
    const answer = await askQuestion(`❗ File ${fileName} already exists. Overwrite? (Y/n): `);
    if (answer && answer.toLowerCase() !== 'y') {
      console.log('❌ Operation cancelled. No files were overwritten.');
      rl.close();
      process.exit(0);
    }
  } else {
    const createAnswer = await askQuestion(`Create file ${fileName}? (Y/n): `);
    if (createAnswer && createAnswer.toLowerCase() !== 'y') {
      console.log('❌ Operation cancelled. No files were created.');
      rl.close();
      process.exit(0);
    }
  }

  fs.writeFileSync(filePath, content);
  console.log(`✅ Repository created at: ${filePath}`);

  rl.close();
}

run();
