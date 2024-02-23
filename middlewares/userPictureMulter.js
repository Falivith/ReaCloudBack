const multer = require('multer');
const sharp = require('sharp'); //necessário para redimensionar a imagem
const fs = require('fs'); //necessário para redimensionar a imagem

// Configuração do storage do multer para definir o destino dos uploads e nomes de arquivos
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/') // Pasta onde os arquivos serão salvos
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + '.' + file.originalname.split('.').pop()) // Gerando um nome de arquivo único
  }
});

const fileFilter = (req, file, cb) => {
     const extensaoImg = ['image/png', 'image/jpg', 'image/jpeg'].find(acceptedFormat => acceptedFormat == file.mimetype);

    if(extensaoImg){
     return cb(null, true);
    }
    return cb(null, false);
 }

const upload = multer({ storage: storage, fileFilter: fileFilter, limits: { fileSize: 1 * 1024 * 1024 } });
// estou usando limits para limitar o upload de arquivo para 1MB

const resizeImage = (req, res, next) => {
     if (!req.file) return next(); // Se nenhum arquivo foi enviado, pula para o próximo middleware
   
     const filePath = req.file.path;
     sharp(filePath)
       .resize(200, 200, { //pra salvar todas as fotos de perfil em 200px por 200px
          fit: 'inside', // pra não perder as proporções
          withoutEnlargement: true // não fica dando zoom caso a img for pequena
        })
       .toBuffer()
       .then(data => {
         fs.writeFileSync(filePath, data); // Substitui o arquivo original pelo redimensionado
         next();
       })
       .catch(err => {
         console.error(err);
         res.status(500).json({ error: 'Erro ao processar a imagem.' });
       });
   };

module.exports = { upload, resizeImage };