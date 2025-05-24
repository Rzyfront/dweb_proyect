import { Request, Response } from 'express';
import User from '../models/auth/User';
import Role from '../models/auth/Role';
import Resource from '../models/auth/Resource';
import RoleUser from '../models/auth/RoleUser';

// Obtener todos los usuarios
export const getAllUsers = async (req: Request, res: Response): Promise<void> => {
  try {
    const users = await User.findAll({
      include: [
        {
          model: Role,
          as: 'roles',
          attributes: ['id', 'name', 'status'],
          through: { 
            attributes: ['status']
          },
          include: [
            {
              model: Resource,
              as: 'resources',
              attributes: ['id', 'path', 'method', 'status'],
              through: { 
                attributes: ['status']
              }
            }
          ]
        }
      ]
    });
    res.json(users);
    return;
  } catch (error: any) {
    console.error('Error al obtener usuarios:', error);
    res.status(500).json({ error: 'Error al obtener usuarios', details: error.message });
    return;
  }
};

// Obtener un usuario por ID con sus relaciones (roles y recursos)
export const getUserById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    
    const user = await User.findByPk(id, {
      include: [
        {
          model: Role,
          as: 'roles',
          attributes: ['id', 'name', 'status'],
          through: { 
            attributes: ['status']
          },
          include: [
            {
              model: Resource,
              as: 'resources',
              attributes: ['id', 'path', 'method', 'status'],
              through: { 
                attributes: ['status']
              }
            }
          ]
        }
      ]
    });
    
    if (!user) {
      res.status(404).json({ error: 'Usuario no encontrado' });
      return;
    }

    res.json(user);
    return;
  } catch (error: any) {
    console.error('Error al obtener usuario:', error);
    res.status(500).json({ 
      error: 'Error al obtener usuario', 
      details: error.message
    });
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
