import { Request, Response } from 'express';
import User from '../models/User';

// Obtener todos los usuarios
export const getAllUsers = async (req: Request, res: Response): Promise<void> => {
  try {
    const users = await User.findAll();
    res.json(users);
    return;
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener usuarios' });
    return;
  }
};

// Obtener un usuario por ID
export const getUserById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const user = await User.findByPk(id);
    if (!user) {
      res.status(404).json({ error: 'Usuario no encontrado' });
      return;
    }
    res.json(user);
    return;
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener usuario' });
    return;
  }
};

// Crear un nuevo usuario
export const createUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { username, password, email } = req.body;
    const user = await User.create({ username, password, email });
    res.status(201).json(user);
    return;
  } catch (error) {
    res.status(400).json({ error: 'Error al crear usuario' });
    return;
  }
};

// Actualizar un usuario
export const updateUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { username, password, email } = req.body;
    const user = await User.findByPk(id);
    if (!user) {
      res.status(404).json({ error: 'Usuario no encontrado' });
      return;
    }
    await user.update({ username, password, email });
    res.json(user);
    return;
  } catch (error) {
    res.status(400).json({ error: 'Error al actualizar usuario' });
    return;
  }
};

// Eliminar un usuario
export const deleteUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const user = await User.findByPk(id);
    if (!user) {
      res.status(404).json({ error: 'Usuario no encontrado' });
      return;
    }
    await user.destroy();
    res.json({ message: 'Usuario eliminado' });
    return;
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar usuario' });
    return;
  }
};
