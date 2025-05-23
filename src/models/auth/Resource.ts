import { DataTypes, Model } from 'sequelize';
import sequelize from '../../config/database'; // Ajusta la ruta según tu estructura
import { ResourceStatus, HttpMethod } from '../../types/auth.types'; // Ajusta la ruta según tu estructura

interface ResourceAttributes {
  id?: number;
  path: string;
  method: HttpMethod;
  status: ResourceStatus;
}

class Resource extends Model<ResourceAttributes> implements ResourceAttributes {
  public id!: number;
  public path!: string;
  public method!: HttpMethod;
  public status!: ResourceStatus;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Resource.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    path: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    method: {
      type: DataTypes.ENUM(...Object.values(HttpMethod)),
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM(...Object.values(ResourceStatus)),
      allowNull: false,
      defaultValue: ResourceStatus.ACTIVATE,
    },
  },
  {
    sequelize,
    modelName: 'Resource',
    tableName: 'resources',
    timestamps: true,
    // Asegurar que la combinación de path y method sea única
    indexes: [
      {
        unique: true,
        fields: ['path', 'method'],
      },
    ],
  }
);

export default Resource;
