import { usersService } from "../services/index.js"
import CustomError from "../utils/errors/customError.js";
import { ErrorMessages } from "../utils/errors/errorMessages.js";
import bcrypt from 'bcrypt';
import __dirname from "../utils/index.js";

const controller = 'users.controller.js'

const getAllUsers = async(req,res)=>{
    try {
        const users = await usersService.getAll();
        res.send({status:"success",payload:users})
    } catch (error) {
        req.logger.error(`${controller} getAllUsers: ${error.message}`)
        res.status(400).send({status:"error", error:error.message})
    }
    
}

const getUser = async(req,res)=> {
    try {
        const userId = req.params.uid;
        const user = await usersService.getUserById(userId);
        if(!user) return res.status(404).send({status:"error",error:"User not found"})
        res.send({status:"success",payload:user})
    } catch (error) {
        req.logger.error(`${controller} getUser: ${error.message}`)
        res.status(400).send({status:"error", error:error.message})

    }
}

const updateUser = async(req,res)=>{
    console.log('entra aqui')
    try {
        console.log(req)
        const updateBody = req.body;
        console.log(updateBody)
        const userId = req.params.uid;
        const user = await usersService.getUserById(userId);
        if(!user) return res.status(404).send({status:"error", error:"User not found"})
        await usersService.update(userId,updateBody);
        const result = await usersService.getUserById(userId);
        res.send({status:"success",message:"User updated",payload:result})
    } catch (error) {
        req.logger.error(`${controller} updateUser: ${error.message}`)
        res.status(400).send({status:"error", error:error.message})

    }
}

const deleteUser = async(req,res) =>{
    try {
        const userId = req.params.uid;
        const result = await usersService.getUserById(userId);
        req.logger.info(`${controller} deleteUser: ${result}`);
        await usersService.delete(userId)
        res.send({status:"success",message:"User deleted"})
    } catch (error) {
        req.logger.error(`${controller} deleteUser: ${error.message}`)
        res.status(400).send({status:"error", error:error.message})
    }
}

const uploadDocuments = async(req,res)=>{
    try {
        const userId = req.params.uid;
        const user = await usersService.getUserById(userId);

        if(!user) return res.status(404).send({status:"error", error:"User not found"})
        const files = req.files;
        if (!files) {
            res.status(400).send({status:"error", error:"faltan archivos adjuntos" })
        }
        for (let file of files) {
            user.documents.push({
                name: file.originalname,
                path: file.path,
            })
        }
        await usersService.update(user._id, user);
        const result = await usersService.getUserById(userId);

        res.send({status:"success", message:"Documents uploaded", payload: result});
    } catch (error) {
        req.logger.error(`${controller} uploadDocuments: ${error.message}`)
        res.status(400).send({status:"error", error:error.message})
    }
}

export default {
    deleteUser,
    getAllUsers,
    getUser,
    updateUser,
    uploadDocuments
}