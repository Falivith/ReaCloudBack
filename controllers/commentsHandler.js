const express = require('express');
const commentRouter = express.Router();
const util = require('../util/authentication');
const Comment = require('../models/comments');
const User = require('../models/user');
const fs = require('fs');

const getCurrentDate = () => {
    return new Date().toISOString();
};

// Postar comentário
commentRouter.post('/', async (req, res) => {
    try {
        const decodedToken = await util.checkToken(req);

        if (!decodedToken) {
            return res.status(401).json({ error: 'Token inválido ou expirado' });
        }

        if (!req.body.text) {
            return res.status(400).json({ error: 'O texto do comentário é obrigatório' });
        }

        const user = await User.findByPk(decodedToken.id);

        if (!user) {
            return res.status(404).json({ error: 'Usuário não encontrado' });
        }

        const comment = await Comment.create({
            comment: req.body.text,
            user_id: decodedToken.id,
            userPhoto: user.profilePicture,
            resource_id: req.body.resourceId,
            created_at: getCurrentDate()
        });

        res.status(201).json(comment);
        console.log('Comentário recebido e salvo com sucesso:', comment);
    } catch (error) {
        console.error('Erro ao receber e salvar o comentário:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
});

// Consultar todos comentários de um recurso
commentRouter.get('/:id', async (req, res) => {
    try {
        const resourceId = req.params.id;

        if (!resourceId) {
            return res.status(400).json({ error: 'O parâmetro resourceId é obrigatório' });
        }

        const comments = await Comment.findAll({
            where: {
                resource_id: resourceId
            }
        });

        res.status(200).json(comments);
        console.log('Comentários obtidos com sucesso:', comments);
    } catch (error) {
        console.error('Erro ao obter os comentários:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
});


module.exports = commentRouter;
