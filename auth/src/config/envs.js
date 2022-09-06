require ('dotenv').config()

const config={
    port: process.env.PORT,
    jwt_secret: process.env.JWT_SECRET,
    // mode:process.env.NODE_ENV
}

module.exports=config