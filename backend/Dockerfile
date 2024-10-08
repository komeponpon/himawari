# ベースイメージ
FROM node:20.14

# 作業ディレクトリの設定
WORKDIR /usr/src/app

# パッケージファイルをコピー
COPY package*.json ./

# 依存関係のインストール
RUN npm install

# ソースコードをコピー
COPY . .

# 開発サーバーの起動
CMD ["npm", "run", "dev"]
