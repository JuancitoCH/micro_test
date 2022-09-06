// const Users = require('./user')
const jwt = require('jsonwebtoken')
const {jwt_secret} = require('./config/envs')
const bcrypt = require('bcrypt')
const axios = require('axios').default


class Auth{
    // constructor(){
    // }
    async register(data){
        
        const {password} = data
        if(password) data.password = await this.cryptPassword(password)

        
        // const userRegistered = await this.userService.create(data)
        const userRegistered = (await axios.post("http://localhost:4000/api/user/create",data)).data
        if(userRegistered.success === false) return userRegistered
        
        const token  = this.getToken(userRegistered.data)
        // eliminamos password de la respuesta del return
        userRegistered.data.password=null
        delete userRegistered.data.password

        return {
            message:"User Register Succefully",
            success:true,
            data:{
                user:userRegistered.data,
                token
            }
        }
    }

    async login({email,password}){
        if(!email || !password) return {success:false,message:"You must include Credentials"}
        const response = (await axios.get("http://localhost:4000/api/user/one/"+email)).data

        if(response.success==false) return {success:false,message:'Email has not been registered'}
        const passwordCompare = await bcrypt.compare(password,response.data.password)
        if(!passwordCompare) return {success:false,message:"Incorrect Credentials"}

        const token = this.getToken(response.data)
        response.data.password=null
        delete response.data.password
        return {
            message:"User Login Succefully",
            success:true,
            data:{
                user:response.data,
                token
            }
        }
    }

    async cryptPassword(password){
        const salt = await bcrypt.genSalt(10)
        const cryptPassword = await bcrypt.hash(password,salt)
        return cryptPassword
    }


    getToken(userData,time="7d"){
        const user = {
            // id:userData._id,
            name:userData.name,
            lastname:userData.lastName,
            password:userData.password,
            email:userData.email,
            role:userData.role
        }
        const token = jwt.sign(user,jwt_secret,{expiresIn:time})
        return token
    }
}

module.exports = Auth