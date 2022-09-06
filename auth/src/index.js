const express = require('express')
const {port} = require('./config/envs')
const auth_router = require('./routes')

const app = express()


app.use(express.json())
auth_router(app)

app.get('/',(req,res)=>{
    return res.json({
        message:"Auth Api Service"
    })
})

app.listen(port,()=>{
    console.log(`Listen on http://localhost:${port}`)
})