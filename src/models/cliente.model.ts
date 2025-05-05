import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

interface ClienteAttributes {
  id: number;
  nombre: string;
  correo: string;
  telefono?: string;
  documento_identidad?: string;
  nacionalidad?: string;
}

type ClienteCreationAttributes = Optional<ClienteAttributes, 'id'>;

class Cliente extends Model<ClienteAttributes, ClienteCreationAttributes> implements ClienteAttributes {
  public id!: number;
  public nombre!: string;
  public correo!: string;
  public telefono?: string;
  public documento_identidad?: string;
  public nacionalidad?: string;
}

Cliente.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    nombre: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    correo: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    telefono: DataTypes.STRING(20),
    documento_identidad: DataTypes.STRING(50),
    nacionalidad: DataTypes.STRING(50),
  },
  {
    sequelize,
    modelName: 'Cliente',
    tableName: 'clientes',
    timestamps: false,
  }
);

export default Cliente;