# ベースイメージ
FROM node:20.14

# アプリケーションディレクトリの作成
WORKDIR /app

# パッケージをインストール
COPY package*.json ./
RUN npm install

# アプリケーションファイルをコピー
COPY . .
RUN npm run build

# バックエンドサーバーの起動
CMD ["node", "dist/index.js"]
