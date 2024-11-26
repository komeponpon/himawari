import jwt from 'jsonwebtoken';
import { KeycloakUser } from './types';
import { config } from '../config/config';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

export class AuthService {
  static async validateCredentials(userId: string, password: string) {
    const user = await prisma.users.findUnique({
      where: { userId }
    });

    if (!user) {
      throw new Error('ユーザーが見つかりません');
    }

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      throw new Error('パスワードが正しくありません');
    }

    return user;
  }

  static async validateToken(token: string): Promise<KeycloakUser> {
    try {
      return jwt.verify(token, config.jwt.secret) as KeycloakUser;
    } catch (error) {
      throw new Error('Invalid token');
    }
  }

  static generateToken(user: any): string {
    return jwt.sign(
      {
        id: user.id,
        userId: user.userId,
        customerGroup: user.customerGroup,
        roles: user.roles
      },
      config.jwt.secret,
      { expiresIn: '24h' }
    );
  }
}