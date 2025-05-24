import { DataTypes, Model } from 'sequelize';
import sequelize from '../../config/database';
import { RoleStatus } from '../../types/auth.types';

interface RoleUserAttributes {
  user_id: number;
  role_id: number;
  status: RoleStatus;
}

class RoleUser extends Model<RoleUserAttributes> implements RoleUserAttributes {
  public user_id!: number;
  public role_id!: number;
  public status!: RoleStatus;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

RoleUser.init(
  {
    user_id: {
      type: DataTypes.INTEGER.UNSIGNED,
      primaryKey: true,
      references: {
        model: 'users',
        key: 'id',
      },
    },
    role_id: {
      type: DataTypes.INTEGER.UNSIGNED,
      primaryKey: true,
      references: {
        model: 'roles',
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
    modelName: 'RoleUser',
    tableName: 'role_users',
    timestamps: true,
  }
);

export default RoleUser;
