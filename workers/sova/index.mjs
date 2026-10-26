import './setup.mjs';
import { httpServerHandler } from 'cloudflare:node';
import app from '../../SOVA-demo/backend/app.js';

const PORT = 8080;
app.listen(PORT);

export default httpServerHandler({ port: PORT });
