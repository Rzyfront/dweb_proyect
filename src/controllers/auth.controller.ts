import { Request, Response } from 'express';
import User, { UserCreationAttributes } from '../models/auth/User';
import RefreshToken from '../models/auth/RefreshToken';
import { UserStatus, RefreshTokenStatus, DeviceInfo, RoleStatus } from '../types/auth.types';
import Role from '../models/auth/Role';
import RoleUser from '../models/auth/RoleUser';

class AuthController {
  public async register(req: Request, res: Response): Promise<void> {
    const { username, email, password, avatar } = req.body;

    try {
      const existingUser = await User.findOne({ where: { email } });
      if (existingUser) {
        res.status(400).json({ message: 'User with this email already exists' });
        return;
      }

      const newUserAttributes: UserCreationAttributes = {
        username,
        email,
        password,
        avatar: avatar || undefined,
        status: UserStatus.ACTIVATE, // Por defecto ACTIVATE según la nueva instrucción
      };

      const newUser = await User.create(newUserAttributes);

      // Asignar rol por defecto (opcional, mantenido de la lógica anterior)
      const defaultRole = await Role.findOne({ where: { name: 'USER_ROLE' } });
      if (defaultRole) {
        await RoleUser.create({
          user_id: newUser.id,
          role_id: defaultRole.id,
          status: RoleStatus.ACTIVATE 
        });
        await newUser.reload({ include: [{ model: Role, as: 'roles' }] });
      }

      const accessToken = newUser.generateToken();

      res.status(201).json({
        message: 'User registered successfully',
        user: {
          id: newUser.id,
          username: newUser.username,
          email: newUser.email,
          avatar: newUser.avatar,
          status: newUser.status,
          roles: newUser.roles?.map(r => r.name),
        },
        token: accessToken,
      });
      return;
    } catch (error: any) {
      console.error('Registration error:', error);
      res.status(500).json({ message: 'Error registering user', error: error.message });
      return;
    }
  }

  public async login(req: Request, res: Response): Promise<void> {
    const { email, password } = req.body;

    try {
      const user = await User.findOne({
        where: { email },
        include: [{ model: Role, as: 'roles' }],
      });

      if (!user) {
        res.status(404).json({ message: 'User not found' });
        return;
      }

      if (user.status !== UserStatus.ACTIVATE) {
        res.status(403).json({ message: `User is not active. Current status: ${user.status}` });
        return;
      }

      const isPasswordValid = await user.checkPassword(password);
      if (!isPasswordValid) {
        res.status(401).json({ message: 'Invalid credentials' });
        return;
      }

      const accessToken = user.generateToken();
      const refreshTokenData = user.generateRefreshToken();

      const deviceInfo: DeviceInfo = {
        userAgent: req.headers['user-agent'],
        // ip: req.ip, // Puedes añadir más detalles si lo deseas
        // platform: req.headers['sec-ch-ua-platform'] || 'unknown'
      };

      await RefreshToken.create({
        user_id: user.id,
        token: refreshTokenData.token,
        expires_at: refreshTokenData.expiresAt,
        status: RefreshTokenStatus.ACTIVE,
        device_info: JSON.stringify(deviceInfo),
      });

      res.status(200).json({
        message: 'Login successful',
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          avatar: user.avatar,
          status: user.status,
          roles: user.roles?.map(r => r.name),
        },
        token: accessToken,
        refreshToken: refreshTokenData.token,
      });
      return;
    } catch (error: any) {
      console.error('Login error:', error);
      res.status(500).json({ message: 'Error during login', error: error.message });
      return;
    }
  }

  public async logout(req: Request, res: Response): Promise<void> {
    const refreshTokenHeader = req.body.refreshToken || req.headers['x-refresh-token'] as string;

    if (!refreshTokenHeader) {
      res.status(400).json({ message: 'Refresh token not provided for logout' });
      return;
    }

    try {
      const refreshTokenInstance = await RefreshToken.findOne({
        where: { token: refreshTokenHeader, status: RefreshTokenStatus.ACTIVE },
      });

      if (refreshTokenInstance) {
        refreshTokenInstance.status = RefreshTokenStatus.REVOKED; // Usar REVOKED
        await refreshTokenInstance.save();
      }

      res.status(200).json({ message: 'Logout successful. Refresh token has been revoked.' });
      return;
    } catch (error: any) {
      console.error('Logout error:', error);
      res.status(500).json({ message: 'Error during logout', error: error.message });
      return;
    }
  }
  
  // La función refreshToken no fue solicitada en la nueva estructura de clase.
  // Si la necesitas, podemos añadirla como un método aquí.
  /*
  public async refreshToken(req: Request, res: Response): Promise<Response> {
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
            oldRefreshToken.status = RefreshTokenStatus.EXPIRED;
            await oldRefreshToken.save();
            return res.status(401).json({ message: 'Refresh token expired' });
        }

        const user = await User.findByPk(oldRefreshToken.user_id, {
            include: [{ model: Role, as: 'roles' }]
        });

        if (!user || user.status !== UserStatus.ACTIVATE) {
            return res.status(401).json({ message: 'User not found or not active' });
        }

        const newAccessToken = user.generateToken();

        return res.status(200).json({
            message: 'Token refreshed successfully',
            accessToken: newAccessToken,
        });

    } catch (error: any) {
        console.error('Refresh token error:', error);
        return res.status(500).json({ message: 'Error refreshing token', error: error.message });
    }
  }
  */
}

export default new AuthController();