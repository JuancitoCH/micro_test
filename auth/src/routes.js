const express = require('express')
const Auth = require('./auth')
const {verifyToken} = require('./middlewares/auth.middleware')
const {logoutResponse, successfulResponse, authResponse, errorResponse} = require('./helpers/responses.helper')


const auth_router = (app) => {
    
    const router = express.Router()
    const authService = new Auth()

    app.use('/api/auth', router)

    router.post('/login', async (req, res) => {
        const response = await authService.login(req.body)

        response.success 
        ? authResponse(res, 200, true, 'Login successful', response.data) 
        : errorResponse(res, response)
    })

    router.post('/register', async (req, res) => {
        const response = await authService.register(req.body)

        response.success
        ? successfulResponse(res,201,true,response.message,response.data.user
        )
        : errorResponse(res, response.error);
    })

    router.get('/logout', async (req, res) => {
        logoutResponse(res)
    })

    router.get('/sesion',verifyToken,(req,res)=>{
        const {password,iat,exp,...userInfo} = req.userData
        successfulResponse(res,201,true,'Token correcto',userInfo)
    } )
}

module.exports = auth_router