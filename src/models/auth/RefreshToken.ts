import { DataTypes, Model, ForeignKey, BelongsTo } from 'sequelize';
import sequelize from '../../config/database';
import { RefreshTokenStatus, DeviceInfo } from '../../types/auth.types';
import User from './User';

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

  // Asociaciones
  public User?: User;

  // Método para verificar si el token ha expirado
  public isExpired(): boolean {
    return new Date() > this.expires_at;
  }

  // Método para revocar el token
  public async revoke(): Promise<void> {
    this.status = RefreshTokenStatus.REVOKED;
    await this.save();
  }
}

RefreshToken.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id',
      },
    },
    token: {
      type: DataTypes.TEXT,
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
      defaultValue: RefreshTokenStatus.ACTIVE,
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

// Asociaciones
RefreshToken.belongsTo(User, { foreignKey: 'user_id', as: 'User' });

export default RefreshToken;
