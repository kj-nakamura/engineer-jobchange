# CLAUDE.md

本プロジェクトは、エンジニア向けの転職支援サイトです。  
ユーザーが「転職動機」と「職種」を選ぶことで、最適な転職サービスを推薦する機能を提供します。  
初期フェーズでは最小構成（MVP）で構築し、今後の拡張を前提としない設計とします。

- 開発サーバーは勝手に起動しないこと

---

## ✅ 使用技術スタック（MVP）

- フレームワーク: **Next.js (Pages Router)**
- 言語: **TypeScript**
- スタイリング: **Tailwind CSS**
- データ形式: **JSON（ローカルファイル）**
- デプロイ環境: **Vercel**

---

## ✅ 機能一覧

- 転職サービス一覧表示
- 「転職動機 × 職種」からのレコメンド表示
- レコメンドは以下の3分類：
  - **exactMatch**: 動機と職種の両方にマッチ
  - **partialMatch**: どちらか一方にマッチ
  - **others**: どちらにもマッチしない（基本は非表示）

---

## ✅ タグ定義

### 転職動機（`motiveTags`）

| タグID | 表示名             |
|--------|------------------|
| high_salary | 年収アップ         |
| remote_work | フルリモート希望     |
| career_up | キャリアアップ     |
| management | マネジメント志向   |
| change_domain | 業界・職種を変えたい |
| restart | キャリア再出発      |
| stable_env | 安定した環境を求める |
| side_project | 副業・複業と両立したい |

### 職種（`jobTypeTags`）

| タグID | 表示名             |
|--------|------------------|
| frontend | フロントエンドエンジニア |
| backend | バックエンドエンジニア  |
| mobile | モバイルアプリエンジニア |
| infra | インフラ・SRE・DevOps |
| pm | プロジェクトマネージャー |
| ml | 機械学習・AIエンジニア |
| generalist | フルスタック         |
| unexp | 未経験・実務なし      |

---

## ✅ レコメンドロジック概要

```ts
function recommendServices(
  allServices: Service[],
  motiveTags: string[],
  jobTypeTags: string[]
): {
  exactMatch: Service[],
  partialMatch: Service[],
  others: Service[]
}
