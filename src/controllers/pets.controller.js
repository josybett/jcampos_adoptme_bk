import PetDTO from "../dto/Pet.dto.js";
import { petsService } from "../services/index.js"
import CustomError from "../utils/errors/customError.js";
import { ErrorMessages } from "../utils/errors/errorMessages.js";
import __dirname from "../utils/index.js";

const validSpecies = ['dog', 'cat', 'bird', 'rabbit'];
const controller = 'pets.controller.js'

const getAllPets = async(req,res)=>{
    try {
        const pets = await petsService.getAll();
        res.send({status:"success",payload:pets})        
    } catch (error) {
        req.logger.error(`${controller} getAllPets: ${error.message}`)
        res.status(400).send({status:"error", error:error.message})
    }

}

const createPet = async(req,res)=> {
    try {
        const { name, specie, birthDate } = req.body;
        if(!name || !specie || !birthDate) {
            CustomError.createError(ErrorMessages.PET_CREATION.MISSING_FIELDS)
        }

        if (!validSpecies.includes(specie.toLowerCase())) {
            CustomError.createError(ErrorMessages.PET_CREATION.INVALID_SPECIES);
        }

        if (isNaN(Date.parse(birthDate))) {
            CustomError.createError(ErrorMessages.PET_CREATION.INVALID_DATE);
        }
        const pet = PetDTO.getPetInputFrom({name,specie,birthDate});
        const result = await petsService.create(pet);
        res.send({status:"success",payload:result})
    } catch (error) {
        req.logger.error(`${controller} createPet: ${error.message}`)
        res.status(400).send({status:"error", error:error.message})
    }
}

const updatePet = async(req,res) =>{
    try {
        const petUpdateBody = req.body;
        const petId = req.params.pid;
        const result = await petsService.update(petId,petUpdateBody);
        res.send({status:"success",message:"pet updated"})
    } catch (error) {
        req.logger.error(`${controller} updatePet: ${error.message}`)
        res.status(400).send({status:"error", error:error.message})
    }
    
}

const deletePet = async(req,res)=> {
    try {
        const petId = req.params.pid;
        const result = await petsService.delete(petId);
        req.logger.info(`${controller} deletePet: ${result}`);
        res.send({status:"success",message:"pet deleted"});
    } catch (error) {
        req.logger.error(`${controller} deletePet: ${error.message}`)
        res.status(400).send({status:"error", error:error.message}) 
    }

}

const createPetWithImage = async(req,res) =>{
    try {
        const file = req.file;
        const {name,specie,birthDate} = req.body;
        if(!name||!specie||!birthDate) return res.status(400).send({status:"error",error:"Incomplete values"})
        if (!file) {
            res.status(400).send({status:"error", error:"faltan archivos adjuntos" })
        }
        const pet = PetDTO.getPetInputFrom({
            name,
            specie,
            birthDate,
            image: file.path
        });
        const result = await petsService.create(pet);
        res.send({status:"success",payload:result})
    } catch (error) {
        req.logger.error(`${controller} createPetWithImage: ${error.message}`)
        res.status(400).send({status:"error", error:error.message})
    }
}
export default {
    getAllPets,
    createPet,
    updatePet,
    deletePet,
    createPetWithImage
}