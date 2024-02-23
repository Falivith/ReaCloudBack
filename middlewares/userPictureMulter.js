const multer = require('multer');

// Configuração do storage do multer para definir o destino dos uploads e nomes de arquivos
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/') // Pasta onde os arquivos serão salvos
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + '.' + file.originalname.split('.').pop()) // Gerando um nome de arquivo único
  }
});

const upload = multer({ storage: storage });

module.exports = upload;
