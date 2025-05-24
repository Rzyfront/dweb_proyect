import { DataTypes, Model, ForeignKey, BelongsTo } from 'sequelize';
import sequelize from '../../config/database';
import { RefreshTokenStatus, DeviceInfo } from '../../types/auth.types';

interface RefreshTokenAttributes {
  id?: number;
  user_id: number;
  token: string;
  device_info?: string;
  status: RefreshTokenStatus;
  expires_at: Date;
}

class RefreshToken extends Model<RefreshTokenAttributes> implements RefreshTokenAttributes {
  public id!: number;
  public user_id!: number;
  public token!: string;
  public device_info?: string;
  public status!: RefreshTokenStatus;
  public expires_at!: Date;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  // Asociaciones - se definen en src/models/index.ts
  public User?: any;

  // Método para verificar si el token ha expirado
  public isExpired(): boolean {
    return new Date() > this.expires_at;
  }

  // Método para revocar el token
  public async revoke(): Promise<void> {
    this.status = RefreshTokenStatus.DEACTIVATE;
    await this.save();
  }
}

RefreshToken.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    user_id: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id',
      },
    },
    token: {
      type: DataTypes.STRING(512), // Especificamos longitud para poder usar unique
      allowNull: false,
      unique: true,
    },
    device_info: {
      type: DataTypes.JSON,
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM(...Object.values(RefreshTokenStatus)),
      allowNull: false,
      defaultValue: RefreshTokenStatus.ACTIVATE,
    },
    expires_at: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: 'RefreshToken',
    tableName: 'refresh_tokens',
    timestamps: true,
  }
);

// Las asociaciones se definen en src/models/index.ts

export default RefreshToken;
