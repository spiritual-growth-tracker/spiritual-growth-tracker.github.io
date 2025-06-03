# Spiritual Growth Tracker

A web application to help users track their daily spiritual growth by monitoring their progress in the Fruits of the Spirit and identifying areas where they might be walking in the Works of the Flesh.

## Features

- Daily tracking of Fruits of the Spirit
- Monitoring of Works of the Flesh
- Interactive calendar for date selection
- Visual progress charts and statistics
- Responsive design for all devices
- Progressive Web App (PWA) support
- Offline functionality
- Data persistence using local storage

## Tech Stack

- **Frontend:**
  - HTML5
  - CSS3 (with PostCSS for optimization)
  - JavaScript (ES6+)
  - Bootstrap 5
  - Chart.js for data visualization
  - Flatpickr for date picking
  - Bootstrap Icons

- **Build Tools:**
  - Webpack 5
  - PostCSS
  - CSS Nano
  - Terser

- **Server:**
  - Node.js
  - Express.js
  - Compression middleware

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)

### Installation

1. Clone the repository:
   ```bash
   git clone git@github.com:spiritualgrowthtracker/spiritual-growth-tracker.github.io.git
   cd spiritual-growth-tracker
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Build the project:
   ```bash
   npm run build
   ```

4. Start the development server:
   ```bash
   npm start
   ```

5. Open your browser and visit:
   ```
   http://localhost:8080
   ```

### Development

- Watch mode for development:
  ```bash
  npm run watch
  ```

- Production build:
  ```bash
  npm run build
  ```

### GitHub Pages Deployment

The project is automatically deployed to GitHub Pages when changes are pushed to the main branch. The deployment process:

1. Builds the project with production optimizations
2. Deploys the built files to the `gh-pages` branch
3. Makes the site available at `https://github.com/spiritualgrowthtracker/spiritual-growth-tracker.github.io`

To manually trigger a deployment:
1. Go to the "Actions" tab in your GitHub repository
2. Select the "Build and Deploy to GitHub Pages" workflow
3. Click "Run workflow"

## Project Structure

```
spiritual-growth-tracker/
├── assets/
│   ├── src/
│   │   ├── css/
│   │   │   └── styles.css
│   │   ├── js/
│   │   │   └── app.js
│   │   ├── images/
│   │   │   └── icons/
│   │   └── index.html
│   └── dist/
│       ├── css/
│       ├── js/
│       ├── images/
│       ├── fonts/
│       └── index.html
├── .github/
│   └── workflows/
│       └── deploy.yml
├── server.js
├── webpack.config.js
├── postcss.config.js
├── package.json
└── README.md
```

## Performance Optimizations

- Code splitting for better load times
- Asset compression and minification
- Browser caching for static assets
- Lazy loading of components
- Optimized images and fonts
- CSS optimization with PostCSS
- JavaScript minification with Terser

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Android Chrome)

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Bootstrap for the UI framework
- Chart.js for data visualization
- Flatpickr for the date picker
- Bootstrap Icons for the icon set 