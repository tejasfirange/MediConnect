const { runMigration } = require('./server/services/migrationService');

async function migrate() {
  await runMigration();
  process.exit(0);
}

migrate();
