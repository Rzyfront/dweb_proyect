import { DataTypes, Model, Optional } from 'sequelize';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import sequelize from '../../config/database';
import { UserStatus, TokenPayload, RefreshTokenData } from '../../types/auth.types';

// Modelo para la tabla users
export interface UserAttributes {
  id?: number; // id es opcional en la creación porque es autoincremental
  username: string;
  password: string;
  email: string;
  avatar?: string;
  status: UserStatus;
}

// Para la creación, algunos atributos son opcionales (como id)
export type UserCreationAttributes = Optional<UserAttributes, 'id' | 'avatar' | 'status'>;

export class User extends Model<UserAttributes, UserCreationAttributes> implements UserAttributes {
  public id!: number;
  public username!: string;
  public password!: string;
  public email!: string;
  public avatar?: string;
  public status!: UserStatus;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  // Asociaciones
  public readonly roles?: any[];

  // Método para verificar contraseña
  public async checkPassword(password: string): Promise<boolean> {
    return bcrypt.compare(password, this.password);
  }

  // Método para generar JWT (válido por 5 minutos)
  public generateToken(): string {
    const userRoles = this.roles ? this.roles.map(role => role.name) : [];
    const payload: TokenPayload = {
      userId: this.id,
      username: this.username,
      email: this.email,
      roles: userRoles
    };

    return jwt.sign(
      payload,
      process.env.JWT_SECRET || 'default-secret', // Deberías usar variables de entorno para el secreto
      { expiresIn: '5m' }
    );
  }

  // Método para generar refresh token (válido por 1 minuto para testing, ajusta según necesidad)
  public generateRefreshToken(): RefreshTokenData {
    const token = jwt.sign(
      { userId: this.id, type: 'refresh' },
      process.env.JWT_REFRESH_SECRET || 'default-refresh-secret', // Deberías usar variables de entorno
      { expiresIn: '1m' } // Ajusta la expiración según tus necesidades
    );

    const expiresAt = new Date();
    // Ajusta los minutos según el expiresIn del token
    expiresAt.setMinutes(expiresAt.getMinutes() + 1); // Para 1m de expiración

    return { token, expiresAt };
  }
}
User.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    email: { // Asegúrate que el campo email exista o ajústalo
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    avatar: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM(...Object.values(UserStatus)),
      allowNull: false,
      defaultValue: UserStatus.PENDING, // Por defecto un usuario nuevo podría estar pendiente de activación
    },
  },
  {
    sequelize,
    modelName: 'User',
    tableName: 'users',
    timestamps: true, // Habilitar timestamps si no lo estaban
    hooks: {
      beforeCreate: async (user: User) => {
        if (user.password) {
          const salt = await bcrypt.genSalt(10);
          user.password = await bcrypt.hash(user.password, salt);
        }
      },
      beforeUpdate: async (user: User) => {
        // Solo hashear la contraseña si ha cambiado
        if (user.changed('password')) {
          const salt = await bcrypt.genSalt(10);
          user.password = await bcrypt.hash(user.password, salt);
        }
      },
    },
  }
);

// Las asociaciones se definen después de que todos los modelos estén inicializados
// Esto se hará en el archivo index.ts para evitar importaciones circulares

export default User;