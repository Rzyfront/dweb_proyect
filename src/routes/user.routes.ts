import { Router } from 'express';
import { getAllUsers, getUserById, createUser, updateUser, deleteUser } from '../controllers/user.controller';

const router = Router();

router.get('/', getAllUsers);
router.get('/:id', getUserById);
router.post('/', createUser);
router.put('/:id', updateUser);
router.delete('/:id', deleteUser);


// router.post('/login', loginUser);
// router.post('/register', registerUser);
// router.post('/logout', logoutUser);
// router.post('/forgot-password', forgotPassword);


export default router;