# Spiritual Growth Tracker

A Progressive Web Application (PWA) designed to help users track their daily spiritual growth by monitoring their progress in the Fruits of the Spirit and identifying areas where they might be walking in the Works of the Flesh.

## Features

- Daily tracking of Fruits of the Spirit
- Monitoring of Works of the Flesh
- Interactive calendar with date selection
- Visual progress charts and statistics
- Responsive design for all devices
- Progressive Web App (PWA) support
- Offline functionality
- Data persistence using local storage
- Dark/Light mode support
- Mobile-first design

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
  - Babel

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/spiritualgrowthtracker/spiritual-growth-tracker.github.io.git
   cd spiritual-growth-tracker.github.io
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm start
   ```

4. Open your browser and visit:
   ```
   http://localhost:8080
   ```

### Development

- Watch mode for development:
  ```bash
  npm start
  ```

- Production build:
  ```bash
  npm run build
  ```

- Clean and rebuild:
  ```bash
  npm run clean:build
  ```

## Project Structure

```
spiritual-growth-tracker/
├── assets/
│   ├── css/
│   │   ├── app.css
│   │   └── bootstrap-icons.css
│   ├── js/
│   │   ├── app.js
│   │   └── vendor.js
│   ├── images/
│   │   └── icons/
├── dist/           # Built files
├── .github/        # GitHub Actions workflows
├── webpack.config.js
├── postcss.config.js
├── package.json
└── README.md
```

## Performance Optimizations

- Code splitting for better load times
- Asset compression and minification
- Browser caching for static assets
- Optimized images and fonts
- CSS optimization with PostCSS
- JavaScript minification with Terser
- Tree shaking for unused code
- Vendor chunk splitting

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