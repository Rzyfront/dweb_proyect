import { Request, Response } from 'express';
import Role from '../models/auth/Role';
import User from '../models/auth/User';
import RoleUser from '../models/auth/RoleUser';
import { RoleStatus } from '../types/auth.types';
import { Op } from 'sequelize';

class RoleController {
  // Crear un nuevo rol
  public async createRole(req: Request, res: Response): Promise<void> {
    const { name, status } = req.body;
    try {
      if (!name) {
        res.status(400).json({ message: 'Role name is required' });
        return;
      }
      const existingRole = await Role.findOne({ where: { name } });
      if (existingRole) {
        res.status(400).json({ message: `Role with name '${name}' already exists` });
        return;
      }
      const newRole = await Role.create({
        name,
        status: status || RoleStatus.ACTIVATE,
      });
      res.status(201).json(newRole);
      return;
    } catch (error: any) {
      res.status(500).json({ message: 'Error creating role', error: error.message });
      return;
    }
  }

  // Listar todos los roles
  public async getAllRoles(req: Request, res: Response): Promise<void> {
    try {
      const roles = await Role.findAll({
        include: [
          { model: User, as: 'users', attributes: ['id', 'username', 'email'], through: { attributes: ['status'] } }
        ]
      });
      res.status(200).json(roles);
      return;
    } catch (error: any) {
      res.status(500).json({ message: 'Error fetching roles', error: error.message });
      return;
    }
  }

  // Obtener un rol por ID
  public async getRoleById(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    try {
      const role = await Role.findByPk(id, {
        include: [
          { model: User, as: 'users', attributes: ['id', 'username', 'email'], through: { attributes: ['status'] } }
        ]
      });
      if (role) {
        res.status(200).json(role);
        return;
      } else {
        res.status(404).json({ message: 'Role not found' });
        return;
      }
    } catch (error: any) {
      res.status(500).json({ message: 'Error fetching role', error: error.message });
      return;
    }
  }

  // Actualizar el nombre o estado de un rol
  public async updateRole(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    const { name, status } = req.body;
    try {
      const role = await Role.findByPk(id);
      if (!role) {
        res.status(404).json({ message: 'Role not found' });
        return;
      }

      if (name && name !== role.name) {
        const existingRoleWithName = await Role.findOne({ where: { name, id: { [Op.ne]: id } } });
        if (existingRoleWithName) {
          res.status(400).json({ message: `Another role with name '${name}' already exists` });
          return;
        }
        role.name = name;
      }

      if (status && Object.values(RoleStatus).includes(status)) {
        role.status = status;
      }
      
      await role.save();
      res.status(200).json(role);
      return;
    } catch (error: any) {
      res.status(500).json({ message: 'Error updating role', error: error.message });
      return;
    }
  }

  // Eliminación lógica de un rol (cambiar status a DEACTIVATE)
  public async deleteRole(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    try {
      const role = await Role.findByPk(id);
      if (!role) {
        res.status(404).json({ message: 'Role not found' });
        return;
      }
      // Opcional: Verificar si el rol está en uso antes de desactivarlo
      // const usersWithRole = await RoleUser.count({ where: { role_id: id, status: RoleStatus.ACTIVATE } });
      // if (usersWithRole > 0) {
      //   res.status(400).json({ message: 'Role is currently assigned to active users and cannot be deactivated. Please remove users from this role first.' });
      //   return;
      // }

      role.status = RoleStatus.DEACTIVATE;
      await role.save();
      res.status(200).json({ message: 'Role deactivated successfully' });
      return;
    } catch (error: any) {
      res.status(500).json({ message: 'Error deactivating role', error: error.message });
      return;
    }
  }

  // Asociar un rol a un usuario
  public async assignRoleToUser(req: Request, res: Response): Promise<void> {
    const { userId, roleId } = req.body;
    try {
      if (!userId || !roleId) {
        res.status(400).json({ message: 'userId and roleId are required' });
        return;
      }

      const user = await User.findByPk(userId);
      if (!user) {
        res.status(404).json({ message: 'User not found' });
        return;
      }

      const role = await Role.findByPk(roleId);
      if (!role) {
        res.status(404).json({ message: 'Role not found' });
        return;
      }
      
      if (role.status === RoleStatus.DEACTIVATE) {
        res.status(400).json({ message: 'Cannot assign a deactivated role' });
        return;
      }

      const [roleUser, created] = await RoleUser.findOrCreate({
        where: { user_id: userId, role_id: roleId },
        defaults: { user_id: userId, role_id: roleId, status: RoleStatus.ACTIVATE },
      });

      if (!created && roleUser.status === RoleStatus.ACTIVATE) {
        res.status(200).json({ message: 'User already has this role and it is active', roleUser });
        return;
      }
      
      if (!created && roleUser.status === RoleStatus.DEACTIVATE) {
        roleUser.status = RoleStatus.ACTIVATE;
        await roleUser.save();
        res.status(200).json({ message: 'Role assignment reactivated', roleUser });
        return;
      }

      res.status(201).json({ message: 'Role assigned to user successfully', roleUser });
      return;
    } catch (error: any) {
      res.status(500).json({ message: 'Error assigning role to user', error: error.message });
      return;
    }
  }

  // Desasociar un rol de un usuario (cambiar status en RoleUser a DEACTIVATE)
  public async removeRoleFromUser(req: Request, res: Response): Promise<void> {
    const { userId, roleId } = req.body; // O req.params si se prefiere
    try {
      if (!userId || !roleId) {
        res.status(400).json({ message: 'userId and roleId are required' });
        return;
      }
      const roleUser = await RoleUser.findOne({
        where: { user_id: userId, role_id: roleId },
      });

      if (!roleUser) {
        res.status(404).json({ message: 'Role assignment not found for this user' });
        return;
      }

      if (roleUser.status === RoleStatus.DEACTIVATE) {
        res.status(200).json({ message: 'Role assignment is already inactive' });
        return;
      }

      roleUser.status = RoleStatus.DEACTIVATE;
      await roleUser.save();
      res.status(200).json({ message: 'Role removed from user successfully (deactivated)' });
      return;
    } catch (error: any) {
      res.status(500).json({ message: 'Error removing role from user', error: error.message });
      return;
    }
  }
}

export default new RoleController();
