const jwt = require('jsonwebtoken')
const Recurso = require('../models/recurso');
const fs = require('fs');
const util = require('../util/authentication');
const recursoRouter = require('express').Router();
const reaReceiver = require('../middlewares/reaReceiver')
const { Op } = require('sequelize');

recursoRouter.get('/filter', async (req, res) => {
    let { title, currentPage = 1, pageSize = 10 } = req.query;

    const filters = {
        title: {
            [Op.iLike]: `%${title}%`,
        },
    };

    const offset = (currentPage - 1) * pageSize;

    try {
        const recursos = await Recurso.findAll({
            where: filters,
            offset: offset,
            limit: pageSize
        });
        // 'recursos' is an array of Recurso instances that match the query parameters.
        res.json(recursos);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred while retrieving resources.' });
    }
});




recursoRouter.get('/', async (req, res) => {
    const reas = await Recurso.findAll({
        logging: false // Desativar o Log da consulta
    }) 
    res.status(201).json(reas);
});

recursoRouter.get('/user', async (req, res) => {

    // Validate User
    const decodedToken = await util.checkToken(req)

    // Fetch userId from decodedToken
    const userId = decodedToken.id;
    
    try {
        // Fetch Recursos for the specified user
        const reas = await Recurso.findAll({
            where: { user_id: userId }, // filter by user_id
            logging: false // Disable the Log of the query
        });

        // If no resources found, return a 404 response
        if (!reas.length) {
            return res.status(404).json({ error: 'No resources found for the specified user' });
        }

        // If resources were found, return them
        return res.status(200).json(reas);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'An error occurred while fetching resources' });
    }
});




recursoRouter.post('/', reaReceiver.single('thumb'), async (request, response) => {

    // Validação Usuário
    const decodedToken = await util.checkToken(request)

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

// ReaDetails

recursoRouter.get('/resource/:id', async (req, res) => {

    const resourceId = req.params.id;
    
    try {
        const recurso = await Recurso.findOne({
            where: { id: resourceId }, 
            logging: false // Disable the Log of the query
        });

        if (!recurso) {
            return res.status(404).json({ error: 'No resource found for the specified id' });
        }

        return res.status(200).json(recurso);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'An error occurred while fetching the resource' });
    }
});
