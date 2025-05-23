import { Request, Response } from 'express';
import User, { UserCreationAttributes } from '../models/auth/User'; // Ajusta la ruta
import RefreshToken from '../models/auth/RefreshToken'; // Ajusta la ruta
import { UserStatus, RefreshTokenStatus, DeviceInfo } from '../types/auth.types'; // Ajusta la ruta
import Role from '../models/auth/Role'; // Ajusta la ruta
import RoleUser from '../models/auth/RoleUser'; // Ajusta la ruta

export const register = async (req: Request, res: Response) => {
  const { username, email, password, avatar } = req.body;

  try {
    // Verificar si el usuario ya existe
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: 'User with this email already exists' });
    }

    const newUserAttributes: UserCreationAttributes = {
      username,
      email,
      password,
      avatar: avatar || null, // Opcional
      status: UserStatus.ACTIVATE, // O UserStatus.PENDING si requiere verificación
    };

    const newUser = await User.create(newUserAttributes);

    // Opcional: Asignar un rol por defecto al usuario, por ejemplo 'USER_ROLE'
    const defaultRole = await Role.findOne({ where: { name: 'USER_ROLE' } }); // Asegúrate que este rol exista
    if (defaultRole) {
      await RoleUser.create({
        user_id: newUser.id,
        role_id: defaultRole.id,
        status: 'ACTIVATE' // O el estado que corresponda
      });
      // Recargar el usuario para incluir los roles en el token
      await newUser.reload({ include: [{ model: Role, as: 'roles' }] });
    }


    const accessToken = newUser.generateToken();
    const refreshTokenData = newUser.generateRefreshToken();

    // Guardar el refresh token en la base de datos
    const deviceInfo: DeviceInfo = {
        userAgent: req.headers['user-agent'],
        ip: req.ip,
        platform: req.headers['sec-ch-ua-platform'] || 'unknown'
    };

    await RefreshToken.create({
      user_id: newUser.id,
      token: refreshTokenData.token,
      expires_at: refreshTokenData.expiresAt,
      status: RefreshTokenStatus.ACTIVE,
      device_info: JSON.stringify(deviceInfo) // Convertir a string si es JSON
    });

    return res.status(201).json({
      message: 'User registered successfully',
      user: {
        id: newUser.id,
        username: newUser.username,
        email: newUser.email,
        avatar: newUser.avatar,
        status: newUser.status,
        roles: newUser.roles?.map(r => r.name) // Mostrar nombres de roles
      },
      accessToken,
      refreshToken: refreshTokenData.token
    });

  } catch (error: any) {
    console.error('Registration error:', error);
    return res.status(500).json({ message: 'Error registering user', error: error.message });
  }
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({
      where: { email },
      include: [{ model: Role, as: 'roles' }] // Incluir roles para el token
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.status !== UserStatus.ACTIVATE) {
      return res.status(403).json({ message: `User is not active. Current status: ${user.status}` });
    }

    const isPasswordValid = await user.checkPassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const accessToken = user.generateToken();
    const refreshTokenData = user.generateRefreshToken();

    // Invalidar tokens de refresco antiguos para el mismo dispositivo (opcional pero recomendado)
    // await RefreshToken.update(
    //   { status: RefreshTokenStatus.REVOKED },
    //   { where: { user_id: user.id, device_info: JSON.stringify(deviceInfo) } } // Ajustar según cómo almacenes device_info
    // );
    
    const deviceInfo: DeviceInfo = {
        userAgent: req.headers['user-agent'],
        ip: req.ip,
        platform: req.headers['sec-ch-ua-platform'] || 'unknown'
    };


    await RefreshToken.create({
      user_id: user.id,
      token: refreshTokenData.token,
      expires_at: refreshTokenData.expiresAt,
      status: RefreshTokenStatus.ACTIVE,
      device_info: JSON.stringify(deviceInfo)
    });

    return res.status(200).json({
      message: 'Login successful',
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        avatar: user.avatar,
        status: user.status,
        roles: user.roles?.map(r => r.name)
      },
      accessToken,
      refreshToken: refreshTokenData.token
    });

  } catch (error: any) {
    console.error('Login error:', error);
    return res.status(500).json({ message: 'Error during login', error: error.message });
  }
};


export const refreshToken = async (req: Request, res: Response) => {
    const refreshTokenHeader = req.body.refreshToken || req.headers['x-refresh-token'] as string;

    if (!refreshTokenHeader) {
        return res.status(400).json({ message: 'Refresh token not provided' });
    }

    try {
        const oldRefreshToken = await RefreshToken.findOne({
            where: {
                token: refreshTokenHeader,
                status: RefreshTokenStatus.ACTIVE,
            },
        });

        if (!oldRefreshToken) {
            return res.status(401).json({ message: 'Refresh token not found or not active' });
        }

        if (oldRefreshToken.isExpired()) {
            oldRefreshToken.status = RefreshTokenStatus.EXPIRED; // O REVOKED
            await oldRefreshToken.save();
            return res.status(401).json({ message: 'Refresh token expired' });
        }

        const user = await User.findByPk(oldRefreshToken.user_id, {
            include: [{ model: Role, as: 'roles' }]
        });

        if (!user || user.status !== UserStatus.ACTIVATE) {
            return res.status(401).json({ message: 'User not found or not active' });
        }

        // Generar nuevo token de acceso
        const newAccessToken = user.generateToken();
        // Opcional: generar también un nuevo refresh token (rotación de refresh tokens)
        // const newRefreshTokenData = user.generateRefreshToken();
        // oldRefreshToken.status = RefreshTokenStatus.REVOKED; // Revocar el antiguo
        // await oldRefreshToken.save();
        // await RefreshToken.create({
        //   user_id: user.id,
        //   token: newRefreshTokenData.token,
        //   expires_at: newRefreshTokenData.expiresAt,
        //   status: RefreshTokenStatus.ACTIVE,
        //   device_info: oldRefreshToken.device_info // Mantener la misma info de dispositivo
        // });

        res.status(200).json({
            message: 'Token refreshed successfully',
            accessToken: newAccessToken,
            // refreshToken: newRefreshTokenData.token // Si se genera uno nuevo
        });

    } catch (error: any) {
        console.error('Refresh token error:', error);
        return res.status(500).json({ message: 'Error refreshing token', error: error.message });
    }
};


export const logout = async (req: Request, res: Response) => {
    const refreshTokenHeader = req.body.refreshToken || req.headers['x-refresh-token'] as string;

    if (!refreshTokenHeader) {
        return res.status(400).json({ message: 'Refresh token not provided for logout' });
    }

    try {
        const refreshTokenInstance = await RefreshToken.findOne({
            where: { token: refreshTokenHeader, status: RefreshTokenStatus.ACTIVE },
        });

        if (refreshTokenInstance) {
            refreshTokenInstance.status = RefreshTokenStatus.REVOKED;
            await refreshTokenInstance.save();
        }
        // No es necesario invalidar el JWT de acceso, ya que es stateless y expirará por sí solo.
        // El cliente debe eliminarlo.

        return res.status(200).json({ message: 'Logout successful. Refresh token has been revoked.' });
    } catch (error: any) {
        console.error('Logout error:', error);
        return res.status(500).json({ message: 'Error during logout', error: error.message });
    }
};