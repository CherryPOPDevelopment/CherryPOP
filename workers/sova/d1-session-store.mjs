import { env } from 'cloudflare:workers';
import session from '../../SOVA-demo/node_modules/express-session/index.js';

const DEFAULT_TTL_MS = 24 * 60 * 60 * 1000;

// Isolates are short-lived, so demo sessions are kept in D1 instead of process memory.
export class D1SessionStore extends session.Store {
  get(sid, callback) {
    env.DB.prepare('SELECT sess FROM demo_sessions WHERE sid = ? AND expires > ?')
      .bind(sid, Date.now())
      .first()
      .then((row) => callback(null, row ? JSON.parse(row.sess) : null), callback);
  }

  set(sid, sess, callback) {
    const expires = sess.cookie && sess.cookie.expires
      ? new Date(sess.cookie.expires).getTime()
      : Date.now() + DEFAULT_TTL_MS;
    env.DB.prepare('INSERT OR REPLACE INTO demo_sessions (sid, sess, expires) VALUES (?, ?, ?)')
      .bind(sid, JSON.stringify(sess), expires)
      .run()
      .then(() => {
        if (Math.random() < 0.02) {
          return env.DB.prepare('DELETE FROM demo_sessions WHERE expires <= ?').bind(Date.now()).run();
        }
        return undefined;
      })
      .then(() => callback(null), callback);
  }

  destroy(sid, callback) {
    env.DB.prepare('DELETE FROM demo_sessions WHERE sid = ?')
      .bind(sid)
      .run()
      .then(() => callback(null), callback);
  }

  touch(sid, sess, callback) {
    const expires = sess.cookie && sess.cookie.expires
      ? new Date(sess.cookie.expires).getTime()
      : Date.now() + DEFAULT_TTL_MS;
    env.DB.prepare('UPDATE demo_sessions SET expires = ? WHERE sid = ?')
      .bind(expires, sid)
      .run()
      .then(() => callback(null), callback);
  }
}
