const express = require('express');
const path = require('path');
const compression = require('compression');
const app = express();
const port = 8080;

// Enable compression
app.use(compression());

// MIME type mappings
const mimeTypes = {
    '.html': 'text/html',
    '.css': 'text/css',
    '.js': 'application/javascript',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
    '.ico': 'image/x-icon',
    '.woff': 'font/woff',
    '.woff2': 'font/woff2',
    '.ttf': 'font/ttf',
    '.eot': 'application/vnd.ms-fontobject',
    '.otf': 'font/otf'
};

// Cache control middleware
const cacheControl = (req, res, next) => {
    // Cache static assets for 1 year
    if (req.url.match(/\.(css|js|jpg|jpeg|png|gif|ico|svg|woff|woff2|ttf|eot|otf)$/)) {
        res.setHeader('Cache-Control', 'public, max-age=31536000');
    } else {
        res.setHeader('Cache-Control', 'no-cache');
    }
    next();
};

// Serve static files from the dist directory
app.use('/assets/dist', express.static(path.join(__dirname, 'assets/dist'), {
    setHeaders: (res, filePath) => {
        const ext = path.extname(filePath);
        if (mimeTypes[ext]) {
            res.setHeader('Content-Type', mimeTypes[ext]);
        }
    },
    maxAge: '1y'
}));

// Apply cache control
app.use(cacheControl);

// Serve index.html for all routes
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'assets/dist/index.html'));
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
}); 