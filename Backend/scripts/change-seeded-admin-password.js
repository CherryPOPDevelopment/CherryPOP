require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });

const { StringDecoder } = require('string_decoder');
const bcrypt = require('bcryptjs');
const mysql = require('mysql2/promise');

const DEFAULT_ADMIN_HASH = '$2a$12$tUBe72W088ZV73.R5lLK7..ydheXjF/9RKMoOyOFR2kFjHNQZTkla';

function readHidden(prompt) {
  const input = process.stdin;
  if (!input.isTTY || typeof input.setRawMode !== 'function') {
    throw new Error('Run this command in an interactive terminal so the password can be entered privately.');
  }

  return new Promise((resolve, reject) => {
    const decoder = new StringDecoder('utf8');
    let value = '';
    process.stdout.write(prompt);
    input.setRawMode(true);
    input.resume();

    const finish = (error, result) => {
      input.removeListener('data', onData);
      input.setRawMode(false);
      process.stdout.write('\n');
      if (error) reject(error);
      else resolve(result);
    };

    const onData = chunk => {
      for (const character of decoder.write(chunk)) {
        if (character === '\u0003') {
          finish(new Error('Password update cancelled.'));
          return;
        }
        if (character === '\r' || character === '\n') {
          finish(null, value);
          return;
        }
        if (character === '\u007f' || character === '\b') {
          value = value.slice(0, -1);
        } else if (character >= ' ') {
          value += character;
        }
      }
    };

    input.on('data', onData);
  });
}

async function main() {
  const password = await readHidden('New admin password (input hidden): ');
  if (password.length < 14) {
    throw new Error('Use a unique password with at least 14 characters.');
  }
  const confirmation = await readHidden('Confirm new admin password: ');
  if (password !== confirmation) throw new Error('Passwords do not match.');

  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    port: Number.parseInt(process.env.DB_PORT || '3306', 10),
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'cherrypop_dev',
  });

  try {
    const hash = await bcrypt.hash(password, 12);
    const [result] = await connection.execute(
      'UPDATE users SET password_hash = ? WHERE username = ? AND password_hash = ?',
      [hash, 'admin', DEFAULT_ADMIN_HASH],
    );
    if (!result.affectedRows) {
      throw new Error('The seeded default admin was not changed. Check that Backend/.env points to the expected XAMPP database.');
    }
    console.log('Updated the seeded admin password in the configured MySQL database.');
  } finally {
    await connection.end();
  }
}

main().catch(error => {
  console.error('Admin password update failed:', error.message);
  process.exitCode = 1;
});
