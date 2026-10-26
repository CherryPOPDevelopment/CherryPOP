require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });

const fs = require('fs');
const path = require('path');
const mysql = require('mysql2/promise');

const OUTPUT = path.join(__dirname, '..', 'd1-data-import.sql');
const DEFAULT_ADMIN_HASH = '$2a$12$tUBe72W088ZV73.R5lLK7..ydheXjF/9RKMoOyOFR2kFjHNQZTkla';
const TABLES = {
  users: ['id', 'username', 'email', 'password_hash', 'role', 'created_at'],
  inquiries: [
    'id', 'name', 'email', 'service_type', 'budget', 'message', 'status',
    'payment_status', 'stripe_session_id', 'created_at', 'updated_at',
  ],
  site_content: ['id', 'section', 'content', 'updated_at'],
  password_reset_tokens: ['id', 'user_id', 'token_hash', 'expires_at', 'used', 'created_at'],
};

function sqlValue(value) {
  if (value === null || value === undefined) return 'NULL';
  if (Buffer.isBuffer(value)) return `X'${value.toString('hex')}'`;
  if (typeof value === 'number') return Number.isFinite(value) ? String(value) : 'NULL';
  if (typeof value === 'boolean') return value ? '1' : '0';
  return `'${String(value).replace(/\0/g, '\uFFFD').replace(/'/g, "''")}'`;
}

async function main() {
  if (!process.argv.includes('--confirm-sensitive-output')) {
    throw new Error(
      'Export includes personal data and password hashes. Rerun with --confirm-sensitive-output to write the private SQL export.',
    );
  }

  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    port: Number.parseInt(process.env.DB_PORT || '3306', 10),
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'cherrypop_dev',
    dateStrings: true,
  });

  try {
    const statements = [
      'DELETE FROM password_reset_tokens;',
      'DELETE FROM inquiries;',
      'DELETE FROM site_content;',
      'DELETE FROM users;',
    ];

    for (const [table, columns] of Object.entries(TABLES)) {
      const [rows] = await connection.query(`SELECT ${columns.join(', ')} FROM \`${table}\``);
      if (table === 'users' && rows.some(row => row.password_hash === DEFAULT_ADMIN_HASH)) {
        throw new Error(
          'The seeded admin account still has the published default password. Change it in XAMPP before exporting users.',
        );
      }
      for (const row of rows) {
        const values = columns.map(column => sqlValue(row[column])).join(', ');
        statements.push(
          `INSERT INTO \`${table}\` (${columns.map(column => `\`${column}\``).join(', ')}) VALUES (${values});`,
        );
      }
      console.log(`Exported ${rows.length} ${table} rows.`);
    }

    fs.writeFileSync(OUTPUT, `${statements.join('\n')}\n`, { encoding: 'utf8', flag: 'w' });
    console.log(`Private import file written to ${OUTPUT}`);
  } finally {
    await connection.end();
  }
}

main().catch(error => {
  console.error('D1 data export failed:', error.message);
  process.exitCode = 1;
});
