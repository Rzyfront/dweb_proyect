import { DataTypes, Model } from 'sequelize';
import sequelize from '../../config/database'; // Ajusta la ruta según tu estructura
import { RoleStatus } from '../../types/auth.types'; // Ajusta la ruta según tu estructura
import Resource from './Resource'; // Ajusta la ruta según tu estructura
import Role from './Role'; // Ajusta la ruta según tu estructura

interface ResourceRoleAttributes {
  id?: number;
  resource_id: number;
  role_id: number;
  status: RoleStatus; // Reutilizando RoleStatus, podría ser un Enum específico si es necesario
}

class ResourceRole extends Model<ResourceRoleAttributes> implements ResourceRoleAttributes {
  public id!: number;
  public resource_id!: number;
  public role_id!: number;
  public status!: RoleStatus;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

ResourceRole.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    resource_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Resource,
        key: 'id',
      },
    },
    role_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Role,
        key: 'id',
      },
    },
    status: {
      type: DataTypes.ENUM(...Object.values(RoleStatus)),
      allowNull: false,
      defaultValue: RoleStatus.ACTIVATE,
    },
  },
  {
    sequelize,
    modelName: 'ResourceRole',
    tableName: 'resource_roles',
    timestamps: true,
    indexes: [
      {
        unique: true,
        fields: ['resource_id', 'role_id'], // Evitar duplicados de permisos
      },
    ],
  }
);

export default ResourceRole;
