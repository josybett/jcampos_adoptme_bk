import { usersService } from "../services/index.js"
import CustomError from "../utils/errors/customError.js";
import { ErrorMessages } from "../utils/errors/errorMessages.js";

const controller = 'users.controller.js'
const saveUser = async(req, res)=>{
    try{
    console.log('aqui llega')
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
    const existingUser = await usersService.findOne({ email });
    if (existingUser) {
        CustomError.createError(ErrorMessages.USER_REGISTRATION.EMAIL_EXISTS);
    }

    // Password validacion
    if (password.length < 8 || !/\d/.test(password) || !/[a-zA-Z]/.test(password)) {
        CustomError.createError(ErrorMessages.USER_REGISTRATION.PASSWORD_POLICY);
    }
    password = await bcrypt.hash(password, 10);

    const result = await usersService.save(user);
    res.send({status:"success", message:"User created with ID: " + result.id})
    } catch (error) {
        res.status(400).send({status:"error", error:error.message})
    }
}

const getAllUsers = async(req,res)=>{
    const users = await usersService.getAll();
    res.send({status:"success",payload:users})
}

const getUser = async(req,res)=> {
    try {
        const userId = req.params.uid;
        const user = await usersService.getUserById(userId);
        if(!user) return res.status(404).send({status:"error",error:"User not found"})
        res.send({status:"success",payload:user})
    } catch (error) {
        //
        req.logger.error(`${controller} getUser: ${error.message}`);
        res.status(400).send({status:"error", error:(ErrorMessages.DATABASE.QUERY_ERROR)})
        CustomError.createError(ErrorMessages.DATABASE.QUERY_ERROR);
    }
}

const updateUser =async(req,res)=>{
    const updateBody = req.body;
    const userId = req.params.uid;
    const user = await usersService.getUserById(userId);
    if(!user) return res.status(404).send({status:"error", error:"User not found"})
    const result = await usersService.update(userId,updateBody);
    res.send({status:"success",message:"User updated"})
}

const deleteUser = async(req,res) =>{
    const userId = req.params.uid;
    const result = await usersService.getUserById(userId);
    res.send({status:"success",message:"User deleted"})
}

export default {
    deleteUser,
    getAllUsers,
    getUser,
    updateUser,
    saveUser
}