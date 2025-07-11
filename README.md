# エンジニア転職ナビ

![Test Status](https://github.com/kj-nakamura/engineer-jobchange/workflows/Test%20Suite/badge.svg)
![Deploy Status](https://github.com/kj-nakamura/engineer-jobchange/workflows/Deploy%20to%20Vercel/badge.svg)

エンジニア向けの転職サービス比較・推薦サイトです。転職動機と希望職種を選択することで、最適な転職サービスを見つけることができます。

## 目次

- [📈 SEO対策](#-seo対策)
- [🚀 機能](#-機能)
- [🛠 技術スタック](#-技術スタック)
- [📊 推薦ロジック](#-推薦ロジック)
- [🏃‍♂️ 開発環境](#️-開発環境)
- [🧪 テスト](#-テスト)
- [🚀 デプロイ](#-デプロイ)
- [📈 CI/CD](#-cicd)
- [🤝 コントリビューション](#-コントリビューション)
- [📝 ライセンス](#-ライセンス)
- [🙏 謝辞](#-謝辞)



## 📈 SEO対策

本プロジェクトでは、各記事のSEOを強化するため、以下の戦略を採用しています。

- **キーワード最適化**: 各記事には、ターゲットとなる読者が検索するであろうキーワードを予測し、最適化されたキーワードリストを付与しています。これにより、検索エンジンからの流入を最大化します。
- **タイトル最適化**: 検索結果でのクリック率を高めるため、魅力的かつ情報量の多いタイトルを各記事に設定しています。
- **コンテンツの網羅性**: ユーザーの疑問を解決し、深い情報を提供する網羅的なコンテンツ作成を心がけています。

SEOキーワードとタイトルの一覧は、`seo_keywords_summary.md`ファイルで管理されています。

## 🚀 機能

- **インテリジェントレコメンド**: 転職動機 × 職種の組み合わせで最適なサービスを推薦
- **モダンUI**: レスポンシブデザインとインタラクティブなコンポーネント
- **高速検索**: リアルタイムでの結果更新
- **包括的テスト**: 87のテストで品質を保証

## 🛠 技術スタック

- **Frontend**: Next.js 15 (Pages Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Testing**: Jest + React Testing Library
- **Deployment**: Vercel
- **CI/CD**: GitHub Actions

## 📊 推薦ロジック

### 転職動機タグ
- 年収アップ
- フルリモート希望  
- キャリアアップ
- マネジメント志向
- 業界・職種を変えたい
- キャリア再出発
- 安定した環境を求める
- 副業・複業と両立したい

### 希望職種タグ
- フロントエンドエンジニア
- バックエンドエンジニア
- モバイルアプリエンジニア
- インフラ・SRE・DevOps
- プロジェクトマネージャー
- 機械学習・AIエンジニア
- フルスタック
- 未経験・実務なし

## 🏃‍♂️ 開発環境

### 必要な環境
- Node.js 18.x または 20.x
- npm

### セットアップ

```bash
# リポジトリをクローン
git clone https://github.com/kj-nakamura/engineer-jobchange.git
cd engineer-jobchange

# 依存関係をインストール
npm install

# 環境変数設定（オプション）
cp .env.example .env.local
# .env.localでGoogle Analytics IDを設定

# 開発サーバーを起動
npm run dev
```

http://localhost:3000 でアプリケーションが起動します。

### 環境変数

アナリティクス機能は**Vercelの本番環境でのみ**有効になります：

```bash
# .env.local (開発環境では無効)
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
```

**Vercelデプロイ時の設定:**
1. Vercelダッシュボードで環境変数を設定
2. `NEXT_PUBLIC_GA_ID` にGoogle Analytics 4のトラッキングIDを設定
3. `VERCEL_ENV=production`で自動的にアナリティクスが有効化

### 利用可能なスクリプト

```bash
# 開発サーバー起動
npm run dev

# 本番ビルド
npm run build

# 本番サーバー起動
npm start

# リンター実行
npm run lint

# テスト実行
npm test

# テスト（ウォッチモード）
npm run test:watch

# カバレッジ付きテスト
npm run test:coverage
```

## 🧪 テスト

87個の包括的なテストで品質を保証：

- **ユニットテスト**: レコメンドロジック、コンポーネント
- **統合テスト**: ページ全体の動作
- **データ検証**: JSON整合性、日本語品質
- **E2Eテスト**: ユーザーフロー

```bash
# 全テスト実行
npm test

# カバレッジレポート生成
npm run test:coverage
```

## 🚀 デプロイ

### Vercel（推奨）

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/kj-nakamura/engineer-jobchange)

### 手動デプロイ

1. プロジェクトをビルド
```bash
npm run build
```

2. 静的ファイルをホスティングサービスにアップロード

## 📈 CI/CD

GitHub Actionsを使用した自動化：

- **テストスイート**: プッシュ・PR時の自動テスト実行
- **デプロイ**: mainブランチへのプッシュ時の自動デプロイ
- **PR チェック**: カバレッジレポートとビルド確認

## 🤝 コントリビューション

1. リポジトリをフォーク
2. 機能ブランチを作成 (`git checkout -b feature/amazing-feature`)
3. 変更をコミット (`git commit -m 'feat: add amazing feature'`)
4. ブランチにプッシュ (`git push origin feature/amazing-feature`)
5. Pull Requestを作成

## 📝 ライセンス

このプロジェクトは [MIT License](LICENSE) の下で公開されています。

## 🙏 謝辞

このプロジェクトは [Claude Code](https://claude.ai/code) を使用して開発されました。