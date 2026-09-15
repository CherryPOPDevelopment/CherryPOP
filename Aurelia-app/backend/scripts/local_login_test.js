const { dbGet } = require('../config/sqlite-database');
const bcrypt = require('bcryptjs');
const { generateToken } = require('../middleware/auth');

(async () => {
  try {
    const email = 'testlogin@example.com';
    const password = 'pass1234';

    const user = await dbGet('SELECT * FROM users WHERE email = ?', [email]);
    if (!user) {
      console.log('User not found for', email);
      process.exit(0);
    }

    const match = await bcrypt.compare(password, user.password);
    console.log('Password match:', match);
    if (match) {
      const token = generateToken(user.id);
      console.log('Generated token:', token);
    }
  } catch (e) {
    console.error('Error:', e.message || e);
  }
  process.exit(0);
})();
