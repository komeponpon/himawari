import express, { Request, Response } from 'express';
import { Router } from 'express';
import { AuthService } from './service';
import { RequestHandler } from 'express';

const router = Router();

// ログインエンドポイント
const loginHandler: RequestHandler = async (req: express.Request, res: express.Response) => {
  try {
    const { userId, password } = req.body;

    // 必須フィールドの検証
    if (!userId || !password) {
      res.status(400).json({ error: 'ユーザーIDとパスワードは必須です' });
      return;
    }

    // 認証情報の検証
    const user = await AuthService.validateCredentials(userId, password);

    // JWTトークンの生成
    const token = AuthService.generateToken(user);

    // レスポンスの送信
    res.json({
      token,
      user: {
        id: user.id,
        userId: user.userId,
        customerGroup: user.customerGroup,
        roles: user.roles
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(401).json({ error: 'ログインに失敗しました' });
  }
};

router.post('/login', loginHandler);

export default router;