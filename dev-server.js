/**
 * CareerPath AI — Zero-Dependency Local Development Server
 * Serves static assets and maps /api/* endpoints to serverless function modules.
 */

import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = parseInt(process.env.PORT || '3000', 10);

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.ico': 'image/x-icon',
  '.webmanifest': 'application/manifest+json',
  '.txt': 'text/plain; charset=utf-8',
  '.xml': 'application/xml; charset=utf-8'
};

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  const pathname = url.pathname;

  // Add standard dev security headers
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');

  // Route API endpoints
  if (pathname.startsWith('/api/')) {
    let endpointName = pathname.replace('/api/', '').split('?')[0];
    if (endpointName === 'career/coach') endpointName = 'getCoachResponse';
    else if (endpointName === 'career/interview') endpointName = 'getInterviewPrep';
    else if (endpointName === 'career/recommend' || endpointName === 'career/advice') endpointName = 'getCareerAdvice';
    else if (endpointName === 'career/resume') endpointName = 'analyzeResume';
    else endpointName = endpointName.split('/')[0];

    const modulePath = path.join(__dirname, 'api', `${endpointName}.js`);

    if (fs.existsSync(modulePath)) {
      try {
        let body = {};
        if (req.method === 'POST') {
          const buffers = [];
          for await (const chunk of req) {
            buffers.push(chunk);
          }
          const rawBody = Buffer.concat(buffers).toString();
          if (rawBody) {
            body = JSON.parse(rawBody);
          }
        }

        // Mock express/vercel res object
        const mockRes = {
          statusCode: 200,
          setHeader: (name, val) => res.setHeader(name, val),
          status(code) {
            this.statusCode = code;
            return this;
          },
          json(data) {
            res.writeHead(this.statusCode, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(data));
          }
        };

        const mockReq = {
          method: req.method,
          headers: req.headers,
          body,
          query: Object.fromEntries(url.searchParams.entries()),
          socket: req.socket
        };

        const { default: handler } = await import(`file://${modulePath}?t=${Date.now()}`);
        await handler(mockReq, mockRes);
        return;
      } catch (err) {
        console.error(`[API Error] ${pathname}:`, err);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: err.message || 'Internal server error' }));
        return;
      }
    } else {
      res.writeHead(404, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: `API route not found: ${pathname}` }));
      return;
    }
  }

  // Serve static files
  let safePath = path.normalize(pathname).replace(/^(\.\.[/\\])+/, '');
  if (safePath === '/' || safePath === '\\') {
    safePath = '/index.html';
  }

  const filePath = path.join(__dirname, safePath);
  let targetFile = filePath;
  if (!fs.existsSync(targetFile) && fs.existsSync(filePath + '.html')) {
    targetFile = filePath + '.html';
  }

  if (fs.existsSync(targetFile) && fs.statSync(targetFile).isFile()) {
    const ext = path.extname(targetFile).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';
    res.writeHead(200, { 'Content-Type': contentType });
    fs.createReadStream(targetFile).pipe(res);
  } else {
    // SPA fallback
    const fallbackPath = path.join(__dirname, 'index.html');
    if (fs.existsSync(fallbackPath)) {
      res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
      fs.createReadStream(fallbackPath).pipe(res);
    } else {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('404 Not Found');
    }
  }
});

server.listen(PORT, () => {
  console.log(`CareerPath AI dev server running at http://localhost:${PORT}`);
});
