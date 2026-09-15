require('dotenv').config();
const https = require('https');

const RECAPTCHA_SECRET_KEY = process.env.RECAPTCHA_SECRET_KEY || '6LcB4kosAAAAALx1upvWSiPIlbhYq95aTeYvAZzf';

/**
 * Verify reCAPTCHA token with Google
 * @param {string} token - reCAPTCHA token from frontend
 * @param {string} remoteip - Optional user IP address
 * @returns {Promise<boolean>} - True if valid, false otherwise
 */
async function verifyRecaptcha(token, remoteip = null) {
  if (!token) {
    return false;
  }

  return new Promise((resolve) => {
    const postData = `secret=${RECAPTCHA_SECRET_KEY}&response=${token}${remoteip ? `&remoteip=${remoteip}` : ''}`;
    
    const options = {
      hostname: 'www.google.com',
      port: 443,
      path: '/recaptcha/api/siteverify',
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Content-Length': Buffer.byteLength(postData)
      }
    };

    const req = https.request(options, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        try {
          const result = JSON.parse(data);
          if (!result.success) {
            console.error('reCAPTCHA verification failed:', result['error-codes'] || 'Unknown error');
          }
          // reCAPTCHA is valid if success is true and score is above threshold (for v3) or not present (v2)
          resolve(result.success === true);
        } catch (error) {
          console.error('reCAPTCHA verification parse error:', error.message);
          resolve(false);
        }
      });
    });

    req.on('error', (error) => {
      console.error('reCAPTCHA verification request error:', error.message);
      resolve(false);
    });

    req.write(postData);
    req.end();
  });
}

module.exports = { verifyRecaptcha };
