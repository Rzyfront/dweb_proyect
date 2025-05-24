import { DataTypes, Model } from 'sequelize';
import sequelize from '../../config/database';
import { RoleStatus } from '../../types/auth.types';

interface RoleAttributes {
  id?: number;
  name: string;
  status: RoleStatus;
}

class Role extends Model<RoleAttributes> implements RoleAttributes {
  public id!: number;
  public name!: string;
  public status!: RoleStatus;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  // Las asociaciones se definirán en src/models/index.ts
  public readonly users?: any[];
  public readonly resources?: any[];
}

Role.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    status: {
      type: DataTypes.ENUM(...Object.values(RoleStatus)),
      allowNull: false,
      defaultValue: RoleStatus.ACTIVATE,
    },
  },
  {
    sequelize,
    modelName: 'Role',
    tableName: 'roles',
    timestamps: true,
  }
);

// Las asociaciones se definen en src/models/index.ts para evitar duplicados

export default Role;
