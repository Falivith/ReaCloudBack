const express = require('express');
const commentRouter = express.Router();
const util = require('../controllers/authentication.js');
const Comment = require('../models/comment.js');
const User = require('../models/user.js');

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
            },
            include: [{
                model: User,
                attributes: ['given_name', 'profilePicture']
            }]
        });

        response = {
            comments: comments,
        }
        
        res.status(200).json(comments);
    } catch (error) {
        console.error('Erro ao obter os comentários:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
});

// Deletar comentário
commentRouter.delete('/:id', async (req, res) => {
    try {
        const commentId = req.params.id;
        const decodedToken = await util.checkToken(req);

        if (!decodedToken) {
            return res.status(401).json({ error: 'Token inválido ou expirado' });
        }

        const comment = await Comment.findByPk(commentId);

        if (!comment) {
            return res.status(404).json({ error: 'Comentário não encontrado' });
        }

        // Verifique se o usuário que está tentando deletar o comentário é o autor do mesmo
        if (decodedToken.id !== comment.user_id) {
            return res.status(403).json({ error: 'Você não tem permissão para deletar este comentário' });
        }

        // Se o usuário for o autor do comentário, proceda com a exclusão
        await comment.destroy();
        res.status(204).end(); // Retorna 204 No Content para indicar que o comentário foi deletado com sucesso
        console.log('Comentário deletado com sucesso:', commentId);
    } catch (error) {
        console.error('Erro ao deletar o comentário:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
});

module.exports = commentRouter;
