const path = require('path');

module.exports = {
  entry: '/index.js', // Входной файл вашей игры
  output: {
    filename: 'bundle.js', // Имя выходного файла
    path: path.resolve(__dirname, 'dist'), // Папка, куда будет сохраняться собранный HTML-файл
  },
};