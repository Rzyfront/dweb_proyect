import { DataTypes, Model } from 'sequelize';
import sequelize from '../../config/database';
import { RoleStatus } from '../../types/auth.types';
import User from './User'; // Importa el modelo User
import RoleUser from './RoleUser'; // Importa el modelo RoleUser
import Resource from './Resource'; // Importa el modelo Resource
import ResourceRole from './ResourceRole'; // Importa el modelo ResourceRole

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

  public readonly users?: User[]; // Para la relación con User
  public readonly resources?: Resource[]; // Para la relación con Resource
}

Role.init(
  {
    id: {
      type: DataTypes.INTEGER,
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

// Definición de la asociación muchos a muchos entre Role y User
Role.belongsToMany(User, {
  through: RoleUser, // Tabla intermedia
  foreignKey: 'role_id', // Clave foránea en RoleUser que referencia a Role
  otherKey: 'user_id', // Clave foránea en RoleUser que referencia a User
  as: 'users', // Alias para acceder a los usuarios con este rol
});

// Definición de la asociación muchos a muchos entre Role y Resource
Role.belongsToMany(Resource, {
  through: ResourceRole, // Tabla intermedia
  foreignKey: 'role_id', // Clave foránea en ResourceRole que referencia a Role
  otherKey: 'resource_id', // Clave foránea en ResourceRole que referencia a Resource
  as: 'resources', // Alias para acceder a los recursos asociados a este rol
});

export default Role;
