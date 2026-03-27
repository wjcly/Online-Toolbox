import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const clothingDir = path.join(__dirname, '../public/assets');
const categories = [
  { id: 'children-men', name: '男童', folder: 'children/men' },
  { id: 'children-women', name: '女童', folder: 'children/women' },
  { id: 'major-men', name: '男装', folder: 'major/men' },
  { id: 'major-women', name: '女装', folder: 'major/women' }
];

categories.forEach(cat => {
  const categoryDir = path.join(clothingDir, cat.folder);
  
  if (fs.existsSync(categoryDir)) {
    const files = fs.readdirSync(categoryDir)
      .filter(file => /\.(jpg|jpeg|png)$/i.test(file))
      .sort();
    
    const indexPath = path.join(categoryDir, 'index.json');
    fs.writeFileSync(indexPath, JSON.stringify(files, null, 2));
    
    console.log(`${cat.name} (${cat.folder}): ${files.length} files`);
  }
});

console.log('\nIndex files generated successfully!');
