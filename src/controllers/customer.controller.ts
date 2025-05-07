import { Request, Response } from 'express';
import Customer from '../models/Customer';

// Obtener todos los clientes
export const getAllCustomers = async (req: Request, res: Response): Promise<void> => {
  try {
    const customers = await Customer.findAll();
    res.json(customers);
    return;
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener clientes' });
    return;
  }
};

// Obtener un cliente por ID
export const getCustomerById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const customer = await Customer.findByPk(id);
    if (!customer) {
      res.status(404).json({ error: 'Cliente no encontrado' });
      return;
    }
    res.json(customer);
    return;
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener cliente' });
    return;
  }
};

// Crear un nuevo cliente
export const createCustomer = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, phone, identityDocument, nationality } = req.body;
    const customer = await Customer.create({ name, email, phone, identityDocument, nationality });
    res.status(201).json(customer);
    return;
  } catch (error) {
    res.status(400).json({ error: 'Error al crear cliente' });
    return;
  }
};

// Actualizar un cliente
export const updateCustomer = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { name, email, phone, identityDocument, nationality } = req.body;
    const customer = await Customer.findByPk(id);
    if (!customer) {
      res.status(404).json({ error: 'Cliente no encontrado' });
      return;
    }
    await customer.update({ name, email, phone, identityDocument, nationality });
    res.json(customer);
    return;
  } catch (error) {
    res.status(400).json({ error: 'Error al actualizar cliente' });
    return;
  }
};

// Eliminar un cliente
export const deleteCustomer = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const customer = await Customer.findByPk(id);
    if (!customer) {
      res.status(404).json({ error: 'Cliente no encontrado' });
      return;
    }
    await customer.destroy();
    res.json({ message: 'Cliente eliminado' });
    return;
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar cliente' });
    return;
  }
};
