const jwt = require('jsonwebtoken')
const Recurso = require('../models/recurso');
const fs = require('fs');
const getTokenFrom = require('../util/authentication');
const recursoRouter = require('express').Router();
const reaReceiver = require('../middlewares/reaReceiver')

recursoRouter.get('/', async (req, res) => {
    const reas = await Recurso.findAll();
    res.status(201).json(reas);
});

recursoRouter.post('/', reaReceiver.single('thumb'), async (request, response) => {

    // Validação Usuário
    const decodedToken = await jwt.verify(getTokenFrom(request), process.env.SECRET)
    console.log(decodedToken)
    if (!decodedToken) {
        return response.status(401).json({ error: 'token invalid' })
    }

    console.log(request.body)
    if(request.body){

        const imageFile = fs.readFileSync(request.file.path); // read uploaded file from temporary directory
        const buffer = Buffer.from(imageFile); // convert file data to buffer

        console.log(request.body)

        const recurso = await Recurso.create({...request.body, user_id: decodedToken.id})

        const recursoPronto = await recurso.update({
            thumb: buffer
            }, { returning: true });
      
        fs.unlink(request.file.path, (err) => {
          if (err) {
            console.error(err);
            return response.status(500).json({ error: 'Error deleting file' });
          }
        });
        
        if (recursoPronto){
            response.status(201).json(recursoPronto);
            console.log("Recurso cadastrado com sucesso.");
        }
        else{
            response.status(400).json(recursoPronto);
            console.log("Falha ao cadastrar recurso. (Database access failed)");
        }
    }
    else{
        response.status(400).json("Falha ao cadastrar o recurso. (Null form received)");
    }
})

module.exports = recursoRouter