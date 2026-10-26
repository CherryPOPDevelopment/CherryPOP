import runtime from '../../SOVA-demo/backend/runtime.js';
import { PrecompiledView } from './views-runtime.js';
import { D1SessionStore } from './d1-session-store.mjs';

runtime.View = PrecompiledView;
runtime.sessionStore = new D1SessionStore();
runtime.serveStatic = false;
