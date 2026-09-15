/**
 * Check Email Verification Fields
 */

require('dotenv').config({ path: require('path').join(__dirname, '..', '..', '.env') });
const mysql = require('mysql2/promise');

async function checkVerificationFields() {
  console.log('\n========================================');
  console.log('CHECKING EMAIL VERIFICATION FIELDS');
  console.log('========================================\n');

  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'aurelia_contacts'
  });

  try {
    const [columns] = await connection.query(`
      SELECT COLUMN_NAME, DATA_TYPE, COLUMN_DEFAULT, IS_NULLABLE
      FROM INFORMATION_SCHEMA.COLUMNS
      WHERE TABLE_SCHEMA = ? 
      AND TABLE_NAME = 'users'
      AND COLUMN_NAME IN ('isVerified', 'verificationCode', 'verificationCodeExpires')
      ORDER BY ORDINAL_POSITION
    `, [process.env.DB_NAME || 'aurelia_contacts']);

    if (columns.length === 0) {
      console.log('❌ No verification fields found\n');
    } else {
      console.log('Existing verification fields:\n');
      columns.forEach(col => {
        console.log(`✅ ${col.COLUMN_NAME}`);
        console.log(`   Type: ${col.DATA_TYPE}`);
        console.log(`   Default: ${col.COLUMN_DEFAULT}`);
        console.log(`   Nullable: ${col.IS_NULLABLE}\n`);
      });
    }

    // Check what's missing
    const existing = columns.map(c => c.COLUMN_NAME);
    const required = ['isVerified', 'verificationCode', 'verificationCodeExpires'];
    const missing = required.filter(r => !existing.includes(r));

    if (missing.length > 0) {
      console.log('Missing fields:', missing.join(', '));
      console.log('\nAdding missing fields...\n');

      if (missing.includes('isVerified')) {
        await connection.query(`
          ALTER TABLE users 
          ADD COLUMN isVerified BOOLEAN DEFAULT FALSE AFTER password
        `);
        console.log('✅ Added isVerified');
      }

      if (missing.includes('verificationCode')) {
        await connection.query(`
          ALTER TABLE users 
          ADD COLUMN verificationCode VARCHAR(10) NULL AFTER ${existing.includes('isVerified') ? 'isVerified' : 'password'}
        `);
        console.log('✅ Added verificationCode');
      }

      if (missing.includes('verificationCodeExpires')) {
        await connection.query(`
          ALTER TABLE users 
          ADD COLUMN verificationCodeExpires DATETIME NULL AFTER verificationCode
        `);
        console.log('✅ Added verificationCodeExpires');
      }
    }

    // Set existing users as verified
    const [result] = await connection.query(`
      UPDATE users 
      SET isVerified = TRUE 
      WHERE isVerified = FALSE OR isVerified IS NULL
    `);
    console.log(`\n✅ Set ${result.affectedRows} existing users as verified`);

    console.log('\n========================================');
    console.log('✅ VERIFICATION FIELDS READY!');
    console.log('========================================\n');

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await connection.end();
  }
}

checkVerificationFields();
