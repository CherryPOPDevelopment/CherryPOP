require('dotenv').config();
const bcryptjs = require('bcryptjs');
const { getOne, update } = require('../config/mysql-database');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

async function resetPassword() {
  try {
    rl.question('Enter user email: ', async (email) => {
      if (!email) {
        console.log('Email is required');
        rl.close();
        process.exit(1);
      }

      // Find user
      const user = await getOne('SELECT * FROM users WHERE LOWER(email) = LOWER(?)', [email.trim()]);
      
      if (!user) {
        console.log('User not found');
        rl.close();
        process.exit(1);
      }

      console.log(`Found user: ${user.username} (${user.email})`);
      console.log(`Current password hash: ${user.password ? user.password.substring(0, 20) + '...' : 'NULL'}`);

      rl.question('Enter new password: ', async (newPassword) => {
        if (!newPassword || newPassword.length < 6) {
          console.log('Password must be at least 6 characters');
          rl.close();
          process.exit(1);
        }

        // Hash new password
        const hashedPassword = await bcryptjs.hash(newPassword, 10);
        
        // Update password
        await update(
          'UPDATE users SET password = ? WHERE id = ?',
          [hashedPassword, user.id]
        );

        console.log('Password reset successfully!');
        console.log(`New password hash: ${hashedPassword.substring(0, 20)}...`);
        rl.close();
        process.exit(0);
      });
    });
  } catch (error) {
    console.error('Error:', error.message);
    rl.close();
    process.exit(1);
  }
}

resetPassword();
