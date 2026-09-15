/**
 * Add Email Verification Fields to Users Table
 */

require('dotenv').config({ path: require('path').join(__dirname, '..', '..', '.env') });
const mysql = require('mysql2/promise');

async function addEmailVerificationFields() {
  console.log('\n========================================');
  console.log('ADDING EMAIL VERIFICATION FIELDS');
  console.log('========================================\n');

  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'aurelia_contacts'
  });

  try {
    // Check if columns already exist
    const [columns] = await connection.query(
      `SHOW COLUMNS FROM users LIKE 'isVerified'`
    );

    if (columns.length > 0) {
      console.log('✅ Verification fields already exist!');
      return;
    }

    console.log('Adding verification fields...\n');

    // Add isVerified column
    await connection.query(`
      ALTER TABLE users 
      ADD COLUMN isVerified BOOLEAN DEFAULT FALSE AFTER password
    `);
    console.log('✅ Added isVerified column');

    // Add verificationCode column
    await connection.query(`
      ALTER TABLE users 
      ADD COLUMN verificationCode VARCHAR(10) NULL AFTER isVerified
    `);
    console.log('✅ Added verificationCode column');

    // Add verificationCodeExpires column
    await connection.query(`
      ALTER TABLE users 
      ADD COLUMN verificationCodeExpires DATETIME NULL AFTER verificationCode
    `);
    console.log('✅ Added verificationCodeExpires column');

    // Set existing users as verified (they registered before this feature)
    await connection.query(`
      UPDATE users 
      SET isVerified = TRUE 
      WHERE isVerified = FALSE OR isVerified IS NULL
    `);
    console.log('✅ Set existing users as verified');

    console.log('\n========================================');
    console.log('✅ EMAIL VERIFICATION FIELDS ADDED!');
    console.log('========================================\n');

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await connection.end();
  }
}

addEmailVerificationFields();
