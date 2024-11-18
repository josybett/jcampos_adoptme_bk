import { Router } from 'express';
import mocksController from '../controllers/mocks.controller.js';

const router = Router();

router.get('/mockingpets',await mocksController.generatePetsReq);
router.get('/mockingusers',await mocksController.generateUsersReq);
router.post('/generateData',mocksController.generateData);


export default router;
