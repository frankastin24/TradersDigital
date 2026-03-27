import path from 'path';
import fs from 'fs';

function serveStaticIfExists(staticDir) {
  return function(req, res, next) {
    // Build absolute file path
    const requestedPath = path.join(staticDir, req.path);

    // Check if file exists and is a file
    fs.stat(requestedPath, (err, stats) => {
      if (!err && stats.isFile()) {
        res.sendFile(requestedPath);
      } else {
        next();
      }
    });
  };
}

export default serveStaticIfExists;