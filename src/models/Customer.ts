import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

// Modelo para la tabla customers
export interface CustomerAttributes {
  id: number;
  name: string;
  email: string;
  phone?: string;
  identityDocument?: string;
  nationality?: string;
}

export type CustomerCreationAttributes = Optional<CustomerAttributes, 'id'>;

export class Customer extends Model<CustomerAttributes, CustomerCreationAttributes> implements CustomerAttributes {
  public id!: number;
  public name!: string;
  public email!: string;
  public phone?: string;
  public identityDocument?: string;
  public nationality?: string;
}

Customer.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    phone: DataTypes.STRING(20),
    identityDocument: {
      type: DataTypes.STRING(50),
      field: 'identity_document',
    },
    nationality: DataTypes.STRING(50),
  },
  {
    sequelize,
    modelName: 'Customer',
    tableName: 'customers',
    timestamps: false,
  }
);

export default Customer;