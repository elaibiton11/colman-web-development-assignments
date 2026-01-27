import { Router } from 'express';
import userController from '../controllers/user_controller';

const router = Router();

/**
 * @route POST /users
 * @desc Add a New User
 */
router.post('/', userController.createUser);

/**
 * @route GET /users
 * @desc Get All Users
 */
router.get('/', userController.getAllUsers);

/**
 * @route GET /users/:id
 * @desc Get a User by ID
 */
router.get('/:id', userController.getUserById);

/**
 * @route PUT /users/:id
 * @desc Update a User
 */
router.put('/:id', userController.updateUser);

/**
 * @route DELETE /users/:id
 * @desc Delete a User
 */
router.delete('/:id', userController.deleteUser);

export default router;
