import { faker } from '@faker-js/faker';
import bcrypt from 'bcrypt';
import CustomError from '../utils/errors/customError.js';
import { ErrorMessages } from '../utils/errors/errorMessages.js';
import { petsService } from "../services/index.js"
import { usersService } from "../services/index.js"
import userModel from '../dao/models/User.js';

const generatePets = async (quantity) => {
    const pets = [];
    
    for(let i = 0; i < quantity; i++) {
        pets.push({
            _id: faker.database.mongodbObjectId(),
            name: faker.animal.dog(),
            specie: faker.helpers.arrayElement(['dog', 'cat', 'bird', 'rabbit']),
            birthDate: faker.date.past(),
            adopted: false,
            owner: null,
            image: faker.image.urlPicsumPhotos({ width: 300, height: 300 }),
            createdAt: faker.date.recent(),
            updatedAt: faker.date.recent(),
            __v: 0
        });
    }

    return pets;
}

const generatePetsReq = async (req, res) => {
    const qt = Number(req?.query?.quantity) && Number(req?.query?.quantity) > 0 ?
                Number(req?.query?.quantity) : 100
    const pets = await generatePets(qt)
    res.send({status:"success",payload:pets})
}

const generateUsers = async (quantity) => {
    const users = [];

    const hashedPassword = await bcrypt.hash('coder123', 10);
    
    for(let i = 0; i < quantity; i++) {
        users.push({
            _id: faker.database.mongodbObjectId(),
            first_name: faker.person.firstName(),
            last_name: faker.person.lastName(),
            email: faker.internet.email(),
            age: faker.number.int({ min: 18, max: 99 }),
            password: hashedPassword,
            role: faker.helpers.arrayElement(['user', 'admin']),
            pets: [],
            createdAt: faker.date.recent(),
            updatedAt: faker.date.recent(),
            __v: 0
        });
    }
    
    return users
}

const generateUsersReq = async (req, res) => {
    const qt = Number(req?.query?.quantity) && Number(req?.query?.quantity) > 0 ?
                Number(req?.query?.quantity) : 50
    const users = await generateUsers(qt)
    res.send({status:"success",payload:users})
}

const generateData = async (req, res) => {
  try{
    const { users, pets } = req.body;
      if(!users || !pets) {
          CustomError.createError(ErrorMessages.GENERATE_DATA.MISSING_FIELDS)
      }
      if(!Number.isInteger(users) || !Number.isInteger(pets) || users < 0 || pets < 0) {
        CustomError.createError(ErrorMessages.GENERATE_DATA.INVALID_FORMAT)
    }
    const result = {
      users: 0,
      pets: 0,
      errors: []
    };
  // Generate and insert users
    if (users > 0) {
        try {
            const mockUsers = await generateUsers(users);
            for (const user of mockUsers) {
                await usersService.create(user);
            }
            //const insertedUsers = await userModel.insertMany(mockUsers);
           // console.log(insertedUsers)
            result.users = mockUsers.length;
        } catch (error) {
            result.errors.push({
                type: 'users',
                message: 'Error inserting users: ' + error.message
            });
        }
    }

    // Generate and insert pets
    if (pets > 0) {
        try {
            const mockPets = await generatePets(pets);
            for (const pet of mockPets) {
                await petsService.create(pet);
            }
            //const insertedPets = await usersService.insertMany(mockPets);
            result.pets = mockPets.length;
        } catch (error) {
            result.errors.push({
                type: 'pets',
                message: 'Error inserting pets: ' + error.message
            });
        }
    }

    // Prepare response message
    let message = 'Data generation completed.';
    if (result.users > 0) message += ` ${result.users} users created.`;
    if (result.pets > 0) message += ` ${result.pets} pets created.`;
    
    res.status(200).json({
        status: result.errors.length === 0 ? 'success' : 'partial_success',
        message,
        details: result,
        errors: result.errors.length > 0 ? result.errors : undefined
    });

  } catch (error) {
    console.log('errors', error.message)
      res.status(500).json({
          status: 'error',
          error: 'Error generating data: ' + error.message
      });
  }
}

// Add a cleanup endpoint for testing purposes
//router.delete('/cleanupMockData', async (req, res) => {
const cleanupMockData = async (req, res) => {
    try {
        const deletedUsers = await userModel.deleteMany({ 
            email: { $regex: '@example.com$' } // Delete only mock users
        });
        const deletedPets = await petModel.deleteMany({ 
            adopted: false,
            owner: null
        });

        res.status(200).json({
            status: 'success',
            message: 'Mock data cleaned up successfully',
            details: {
                usersDeleted: deletedUsers.deletedCount,
                petsDeleted: deletedPets.deletedCount
            }
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            error: 'Error cleaning up mock data: ' + error.message
        });
    }
}

export default {
  generatePetsReq,
  generateUsersReq,
  generateData
};
