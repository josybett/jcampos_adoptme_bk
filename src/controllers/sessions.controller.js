import { usersService } from "../services/index.js";
import { createHash, passwordValidation } from "../utils/index.js";
import jwt from 'jsonwebtoken';
import UserDTO from '../dto/User.dto.js';
import CustomError from "../utils/errors/customError.js";
import { ErrorMessages } from "../utils/errors/errorMessages.js";

const controller = 'sessions.controller.js'

const register = async (req, res) => {
    try {
        const { first_name, last_name, email, password } = req.body;
        if (!first_name || !last_name || !email || !password) {
            console.log(ErrorMessages.USER_REGISTRATION.MISSING_FIELDS)
            CustomError.createError(ErrorMessages.USER_REGISTRATION.MISSING_FIELDS);
        }

        // Email validacióm
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            CustomError.createError(ErrorMessages.USER_REGISTRATION.INVALID_EMAIL);
        }

        // Validación si existe usuario
        const exists = await usersService.getUserByEmail(email);
        if (exists) {
         //   return res.status(400).send({ status: "error", error: "User already exists" });
            CustomError.createError(ErrorMessages.USER_REGISTRATION.EMAIL_EXISTS);
        }

        // Password validacion
        if (password.length < 8 || !/\d/.test(password) || !/[a-zA-Z]/.test(password)) {
            CustomError.createError(ErrorMessages.USER_REGISTRATION.PASSWORD_POLICY);
        }

        const hashedPassword = await createHash(password);
        const user = {
            first_name,
            last_name,
            email,
            password: hashedPassword
        }
        let result = await usersService.create(user);
        res.send({ status: "success", payload: result._id });
    } catch (error) {
        req.logger.error(`${controller} register: ${error.message}`)
        res.status(400).send({status:"error", error:error.message})
    }
}

const login = async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).send({ status: "error", error: "Incomplete values" });
    const user = await usersService.getUserByEmail(email);
    if(!user) return res.status(404).send({status:"error",error:"User doesn't exist"});
    const isValidPassword = await passwordValidation(user,password);
    if(!isValidPassword) return res.status(400).send({status:"error",error:"Incorrect password"});
    const userDto = UserDTO.getUserTokenFrom(user);
    const token = jwt.sign(userDto,'tokenSecretJWT',{expiresIn:"1h"});
    user.last_connection = Date.now();
    try {
        await usersService.update(user._id, user, { new: true });
    } catch (error) {
        req.logger.error(`${controller} login: ${error.message}`)
        res.status(400).send({status:"error", error: "Error updating save last_connection"})
    }
    res.cookie('coderCookie',token,{maxAge:3600000}).send({status:"success",message:"Logged in"})
}

const current = async(req,res) =>{
    const cookie = req.cookies['coderCookie']
    const user = jwt.verify(cookie,'tokenSecretJWT');
    if(user)
        return res.send({status:"success",payload:user})
}

const unprotectedLogin  = async(req,res) =>{
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).send({ status: "error", error: "Incomplete values" });
    const user = await usersService.getUserByEmail(email);
    if(!user) return res.status(404).send({status:"error",error:"User doesn't exist"});
    const isValidPassword = await passwordValidation(user,password);
    if(!isValidPassword) return res.status(400).send({status:"error",error:"Incorrect password"});
    const token = jwt.sign(user,'tokenSecretJWT',{expiresIn:"1h"});
    res.cookie('unprotectedCookie',token,{maxAge:3600000}).send({status:"success",message:"Unprotected Logged in"})
}
const unprotectedCurrent = async(req,res)=>{
    const cookie = req.cookies['unprotectedCookie']
    const user = jwt.verify(cookie,'tokenSecretJWT');
    if(user)
        return res.send({status:"success",payload:user})
}
export default {
    current,
    login,
    register,
    current,
    unprotectedLogin,
    unprotectedCurrent
}