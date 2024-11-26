import { Request, Response, NextFunction } from 'express';
import { AuthService } from './service';

// 認証ミドルウェア
export const authenticateToken = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({ error: '認証が必要です' });
    }

    const user = await AuthService.validateToken(token);
    req.user = user;
    next();
  } catch (error) {
    return res.status(403).json({ error: 'トークンが無効です' });
  }
};

// customer_groupによるアクセス制御
export const customerGroupFilter = async (req: Request, res: Response, next: NextFunction) => {
  if (!req.user) {
    return res.status(401).json({ error: '認証が必要です' });
  }

  // 管理者ロールの場合はフィルタリングをスキップ
  if (req.user.roles.includes('admin')) {
    return next();
  }

  // ユーザーのcustomer_groupをリクエストに追加
  req.query.customer_group = req.user.customerGroup;
  next();
};