const fs = require('fs');
const path = require('path');
const glob = require('glob');

// Mapping of old RGB values to new ones
const COLOR_MAP = {
  'rgb(242, 241, 236)': 'rgb(255, 255, 255)', // bg main
  'rgb(23, 23, 23)': 'rgb(12, 10, 9)',        // text / stroke
  'rgb(234, 233, 225)': 'rgb(229, 231, 235)', // bg muted
  '#F2F1EC': '#FFFFFF',                      // hex bg main
  '#171717': '#0C0A09',                      // hex text/stroke
  '#EAE9E1': '#E5E7EB'                       // hex bg muted
};

function updateFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let updated = content;
  Object.entries(COLOR_MAP).forEach(([oldColor, newColor]) => {
    const regex = new RegExp(oldColor.replace(/([()])/g, '\\$1'), 'g');
    updated = updated.replace(regex, newColor);
  });

  if (updated !== content) {
    fs.writeFileSync(filePath, updated, 'utf8');
    console.log(`Updated: ${filePath}`);
  }
}

// Locate SVG files inside blog images directory
const svgFiles = glob.sync(path.join(__dirname, '../src/assets/images/blog/**/*.svg'));
svgFiles.forEach(updateFile);

console.log(`\nCompleted updating ${svgFiles.length} SVG file(s).`); 