const bcrypt = require('bcryptjs');
const { dbRun } = require('../config/sqlite-database');
const { v4 } = require('uuid');

(async () => {
  try {
    const id = v4();
    const hashed = await bcrypt.hash('pass1234', 10);
    await dbRun(
      'INSERT INTO users (id, username, email, password, firstName, lastName, createdAt) VALUES (?, ?, ?, ?, ?, ?, datetime("now"))',
      [id, 'testlogin', 'testlogin@example.com', hashed, 'Test', 'Login']
    );
    console.log('Inserted user id:', id);
  } catch (e) {
    console.error('Insert error:', e.message || e);
  }
  process.exit();
})();
