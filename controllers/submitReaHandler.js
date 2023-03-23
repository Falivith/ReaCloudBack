const jwt = require('jsonwebtoken')
const Recurso = require('../models/recurso');
const getTokenFrom = require('../util/authentication');



const recursoRouter = require('express').Router()



// recursoRouter.get()


recursoRouter.get('/', async (request, response) => {
    
    response.json("oi")
})


recursoRouter.post('/', async (request, response) => {
    
    const decodedToken = await jwt.verify(getTokenFrom(request), process.env.SECRET)
    console.log(decodedToken)
    if (!decodedToken) {
        return response.status(401).json({ error: 'token invalid' })
    }
    const recurso = await Recurso.create({...request.body, email: decodedToken.username})
    if (recurso){
        response.status(201).json(recurso)
    }
    else{
        response.status(400).json(recurso)
    }
})

module.exports = recursoRouter


