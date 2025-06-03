const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

// Function to generate icons
async function generateIcons() {
    const sizes = [16, 32, 48, 64, 128, 192, 256, 512];
    const svgPath = path.join(__dirname, 'app-icon.svg');
    const outputDir = __dirname;

    // Generate PNG files for each size
    for (const size of sizes) {
        await sharp(svgPath)
            .resize(size, size)
            .png()
            .toFile(path.join(outputDir, `icon-${size}x${size}.png`));
    }

    // Generate ICO file
    const icoSizes = [16, 32, 48];
    const pngBuffers = await Promise.all(
        icoSizes.map(size =>
            sharp(svgPath)
                .resize(size, size)
                .png()
                .toBuffer()
        )
    );

    // Create ICO file
    const ico = require('ico-endec');
    const icoBuffer = ico.encode(pngBuffers);
    fs.writeFileSync(path.join(outputDir, 'favicon.ico'), icoBuffer);
}

// Run the generation
generateIcons().catch(console.error); 