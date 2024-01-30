const Recurso = require('../models/recurso');
const fs = require('fs');
const util = require('../util/authentication');
const recursoRouter = require('express').Router();
const reaReceiver = require('../middlewares/reaReceiver')
const { Op } = require('sequelize');

// Consultar (Filtrar) dentre todos os recursos 
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

        res.json(recursos);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Ocorreu um erro com a filtragem dos recursos.' });
    }
});

// Consultar todos os recursos
recursoRouter.get('/', async (req, res) => {
    const reas = await Recurso.findAll({
        logging: false
    }) 
    res.status(201).json(reas);
});

// Consultar os recursos de um usuário
recursoRouter.get('/user', async (req, res) => {
    const decodedToken = await util.checkToken(req)

    const userId = decodedToken.id;
    
    try {
        const reas = await Recurso.findAll({
            where: { user_id: userId },
            logging: false
        });

        if (!reas.length) {
            return res.status(404).json({ error: 'Não foram encontrados recursos para esse usuário.' });
        }

        return res.status(200).json(reas);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Erro na consulta de recursos.' });
    }
});

// Postar um recurso
recursoRouter.post('/', reaReceiver.single('thumb'), async (req, res) => {
    const decodedToken = await util.checkToken(req);

    if (req.body) {
        const imageFile = fs.readFileSync(req.file.path); // read uploaded file from temporary directory
        const buffer = Buffer.from(imageFile); // convert file data to buffer

        const recurso = await Recurso.create({ ...req.body, user_id: decodedToken.id });

        const recursoPronto = await recurso.update({
            thumb: buffer
        }, { returning: true });

        fs.unlink(req.file.path, (err) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ error: 'Erro ao deletar o arquivo temporário' });
            }
        });

        if (recursoPronto) {
            res.status(201).json(recursoPronto);
            console.log("Recurso cadastrado com sucesso.");
        } else {
            res.status(400).json(recursoPronto);
            console.log("Falha ao cadastrar recurso. (Database access failed)");
        }
    } else {
        res.status(400).json("Falha ao cadastrar o recurso. (Null form received)");
    }
});

// Consultar os detalhes de um recurso
recursoRouter.get('/resource/:id', async (req, res) => {

    const resourceId = req.params.id;
    
    try {
        const recurso = await Recurso.findOne({
            where: { id: resourceId }, 
            logging: false // Disable the Log of the query
        });

        if (!recurso) {
            return res.status(404).json({ error: 'O recurso com esse ID não foi encontrado.' });
        }

        return res.status(200).json(recurso);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Ocorreu um erro ao encontrar o recurso.' });
    }
});

// Deletar um recurso
recursoRouter.delete('/:id', async (req, res) => {
    const resourceId = req.params.id;

    try {
        // Validar o usuário
        const decodedToken = await util.checkToken(req)
        const userId = decodedToken.id;

        const recurso = await Recurso.findOne({
            where: { id: resourceId, user_id: userId }, // Adicione a condição para verificar o user_id
            logging: false
        });

        if (!recurso) {
            return res.status(404).json({ error: 'O recurso com esse ID não foi encontrado.' });
        }

        await recurso.destroy();

        return res.status(204).send();
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Ocorreu um erro ao encontrar o recurso.' });
    }
});

module.exports = recursoRouter