const fs = require('fs');
const path = require('path');
const readline = require('readline');

const modelName = process.argv[2];
if (!modelName) {
  console.error('❌ Please provide a model name (e.g. UserProfile)');
  process.exit(1);
}

// Convert to camelCase for filename: UserProfile -> userProfile
function toCamelCase(str) {
  return str.charAt(0).toLowerCase() + str.slice(1);
}

const className = `${modelName}Repository`;
const fileName = `${toCamelCase(modelName)}.repository.js`;
const filePath = path.join(__dirname, '../src/repositories', fileName);

const content = `const { ${modelName} } = require('../../db/models');

class ${className} {
  async create${modelName}(data) {
    return await ${modelName}.create(data);
  }

  async get${modelName}ById(id) {
    return await ${modelName}.findByPk(id);
  }

  async getAll${modelName}s() {
    return await ${modelName}.findAll();
  }

  async update${modelName}(id, updates) {
    const item = await ${modelName}.findByPk(id);
    if (!item) return null;
    return await item.update(updates);
  }

  async delete${modelName}(id) {
    return await ${modelName}.destroy({ where: { id } });
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
