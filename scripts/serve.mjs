import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { resolve, sep, extname } from 'node:path';

const root = resolve('dist');
const port = Number(process.env.PORT || 4173);
const types = { '.html': 'text/html', '.css': 'text/css', '.js': 'text/javascript', '.json': 'application/json', '.svg': 'image/svg+xml', '.xml': 'application/xml' };
createServer(async (req, res) => {
  try {
    let path = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
    // Preview under the same project subpath as GitHub Pages.
    if (path === '/awesome-rea') path = '/';
    if (path.startsWith('/awesome-rea/')) path = path.slice('/awesome-rea'.length);
    if (path.endsWith('/')) path += 'index.html';
    const target = resolve(root, '.' + path);
    if (!target.startsWith(root + sep)) throw new Error('Invalid path');
    res.writeHead(200, { 'Content-Type': (types[extname(target)] || 'application/octet-stream') + '; charset=utf-8' });
    res.end(await readFile(target));
  } catch {
    res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('Not found');
  }
}).listen(port, '127.0.0.1', () => console.log(`Preview: http://127.0.0.1:${port}/awesome-rea/`));
