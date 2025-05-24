import { Request, Response } from 'express';
import Resource from '../models/auth/Resource';
import Role from '../models/auth/Role';
import ResourceRole from '../models/auth/ResourceRole';
import { ResourceStatus, HttpMethod, RoleStatus } from '../types/auth.types';
import { Op } from 'sequelize';

class ResourceController {
  // Crear un nuevo recurso
  public async createResource(req: Request, res: Response): Promise<void> {
    const { path, method, status } = req.body;
    try {
      if (!path || !method) {
        res.status(400).json({ message: 'Resource path and method are required' });
        return;
      }
      if (!Object.values(HttpMethod).includes(method as HttpMethod)) {
        res.status(400).json({ message: `Invalid HTTP method: ${method}` });
        return;
      }

      const existingResource = await Resource.findOne({ where: { path, method } });
      if (existingResource) {
        res.status(400).json({ message: `Resource with path '${path}' and method '${method}' already exists` });
        return;
      }

      const newResource = await Resource.create({
        path,
        method,
        status: status || ResourceStatus.ACTIVATE,
      });
      res.status(201).json(newResource);
      return;
    } catch (error: any) {
      res.status(500).json({ message: 'Error creating resource', error: error.message });
      return;
    }
  }

  // Listar todos los recursos
  public async getAllResources(req: Request, res: Response): Promise<void> {
    try {
      const resources = await Resource.findAll({
        include: [{ model: Role, as: 'roles', attributes: ['id', 'name'], through: { attributes: ['status'] } }]
      });
      res.status(200).json(resources);
      return;
    } catch (error: any) {
      res.status(500).json({ message: 'Error fetching resources', error: error.message });
      return;
    }
  }

  // Obtener un recurso por ID
  public async getResourceById(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    try {
      const resource = await Resource.findByPk(id, {
        include: [{ model: Role, as: 'roles', attributes: ['id', 'name'], through: { attributes: ['status'] } }]
      });
      if (resource) {
        res.status(200).json(resource);
        return;
      } else {
        res.status(404).json({ message: 'Resource not found' });
        return;
      }
    } catch (error: any) {
      res.status(500).json({ message: 'Error fetching resource', error: error.message });
      return;
    }
  }

  // Actualizar un recurso
  public async updateResource(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    const { path, method, status } = req.body;
    try {
      const resource = await Resource.findByPk(id);
      if (!resource) {
        res.status(404).json({ message: 'Resource not found' });
        return;
      }

      let changed = false;
      if (path && path !== resource.path) {
        resource.path = path;
        changed = true;
      }
      if (method && Object.values(HttpMethod).includes(method as HttpMethod) && method !== resource.method) {
        resource.method = method;
        changed = true;
      }

      if (changed) {
        const existingResource = await Resource.findOne({ 
          where: { 
            path: resource.path, 
            method: resource.method, 
            id: { [Op.ne]: id } 
          } 
        });
        if (existingResource) {
          res.status(400).json({ message: `Another resource with path '${resource.path}' and method '${resource.method}' already exists` });
          return;
        }
      }

      if (status && Object.values(ResourceStatus).includes(status)) {
        resource.status = status;
      }
      
      await resource.save();
      res.status(200).json(resource);
      return;
    } catch (error: any) {
      res.status(500).json({ message: 'Error updating resource', error: error.message });
      return;
    }
  }

  // Eliminación lógica de un recurso (cambiar status a DEACTIVATE)
  public async deleteResource(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    try {
      const resource = await Resource.findByPk(id);
      if (!resource) {
        res.status(404).json({ message: 'Resource not found' });
        return;
      }
      resource.status = ResourceStatus.DEACTIVATE;
      await resource.save();
      // Opcional: También desactivar las asociaciones en ResourceRole
      await ResourceRole.update({ status: RoleStatus.DEACTIVATE }, { where: { resource_id: id } });
      res.status(200).json({ message: 'Resource deactivated successfully and its role associations' });
      return;
    } catch (error: any) {
      res.status(500).json({ message: 'Error deactivating resource', error: error.message });
      return;
    }
  }

  // Asociar un recurso a un rol
  public async assignResourceToRole(req: Request, res: Response): Promise<void> {
    const { resourceId, roleId } = req.body;
    try {
      if (!resourceId || !roleId) {
        res.status(400).json({ message: 'resourceId and roleId are required' });
        return;
      }
      const resource = await Resource.findByPk(resourceId);
      if (!resource) {
        res.status(404).json({ message: 'Resource not found' });
        return;
      }
      if (resource.status === ResourceStatus.DEACTIVATE) {
        res.status(400).json({ message: 'Cannot assign a deactivated resource' });
        return;
      }

      const role = await Role.findByPk(roleId);
      if (!role) {
        res.status(404).json({ message: 'Role not found' });
        return;
      }
      if (role.status === RoleStatus.DEACTIVATE) {
        res.status(400).json({ message: 'Cannot assign resource to a deactivated role' });
        return;
      }

      const [resourceRole, created] = await ResourceRole.findOrCreate({
        where: { resource_id: resourceId, role_id: roleId },
        defaults: { resource_id: resourceId, role_id: roleId, status: RoleStatus.ACTIVATE },
      });

      if (!created && resourceRole.status === RoleStatus.ACTIVATE) {
        res.status(200).json({ message: 'Resource already assigned to this role and active', resourceRole });
        return;
      }
      if (!created && resourceRole.status === RoleStatus.DEACTIVATE) {
        resourceRole.status = RoleStatus.ACTIVATE;
        await resourceRole.save();
        res.status(200).json({ message: 'Resource to role assignment reactivated', resourceRole });
        return;
      }

      res.status(201).json({ message: 'Resource assigned to role successfully', resourceRole });
      return;
    } catch (error: any) {
      res.status(500).json({ message: 'Error assigning resource to role', error: error.message });
      return;
    }
  }

  // Desasociar un recurso de un rol (cambiar status en ResourceRole a DEACTIVATE)
  public async removeResourceFromRole(req: Request, res: Response): Promise<void> {
    const { resourceId, roleId } = req.body;
    try {
      if (!resourceId || !roleId) {
        res.status(400).json({ message: 'resourceId and roleId are required' });
        return;
      }
      const resourceRole = await ResourceRole.findOne({
        where: { resource_id: resourceId, role_id: roleId },
      });

      if (!resourceRole) {
        res.status(404).json({ message: 'Resource assignment not found for this role' });
        return;
      }
      
      if (resourceRole.status === RoleStatus.DEACTIVATE) {
        res.status(200).json({ message: 'Resource assignment is already inactive' });
        return;
      }

      resourceRole.status = RoleStatus.DEACTIVATE;
      await resourceRole.save();
      res.status(200).json({ message: 'Resource removed from role successfully (deactivated)' });
      return;
    } catch (error: any) {
      res.status(500).json({ message: 'Error removing resource from role', error: error.message });
      return;
    }
  }
}

export default new ResourceController();
