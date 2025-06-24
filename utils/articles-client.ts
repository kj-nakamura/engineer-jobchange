import { Service } from '../types';

export interface Article {
  id: string;
  title: string;
  description: string;
  publishDate: string;
  category: string;
  service?: Service;
  tags?: string[];
  relatedArticles?: string[];
}

export interface ArticleCategory {
  id: string;
  name: string;
  description: string;
}

// カテゴリ定義
export const articleCategories: ArticleCategory[] = [
  {
    id: 'services',
    name: '転職サービス評判',
    description: '各転職サービスの詳細な評判と特徴'
  },
  {
    id: 'job-types',
    name: '職種別転職ガイド',
    description: 'エンジニア職種別の転職情報とアドバイス'
  },
  {
    id: 'career-goals',
    name: '転職動機別戦略',
    description: '転職動機に応じた戦略とノウハウ'
  },
  {
    id: 'comparisons',
    name: '比較・ランキング',
    description: '転職サービスの比較とランキング情報'
  },
  {
    id: 'guides',
    name: '転職ハウツー',
    description: '履歴書作成、面接対策などの実践的ガイド'
  },
  {
    id: 'trends',
    name: '業界動向・トレンド',
    description: 'IT業界の転職市場動向と将来予測'
  },
  {
    id: 'regions',
    name: '地域別転職情報',
    description: '地域別のIT転職市場と企業情報'
  }
];

// サービス記事のみを生成する関数（後方互換性のため）
export function generateArticles(services: Service[]): Article[] {
  const serviceArticleData = {
    paiza: {
      title: "paiza転職の評判は？口コミから分かる特徴とメリット・デメリット",
      description: "paiza転職の実際の評判と口コミを徹底調査。利用者の体験談から分かるメリット・デメリット、おすすめな人の特徴まで詳しく解説します。"
    },
    green: {
      title: "Greenの評判は？口コミから分かる特徴とメリット・デメリット", 
      description: "Green（グリーン）の実際の評判と口コミを徹底調査。IT・Web業界特化の転職サイトの特徴、メリット・デメリットを詳しく解説。"
    },
    levtech: {
      title: "レバテックキャリアの評判は？口コミから分かる特徴とメリット・デメリット",
      description: "レバテックキャリアの実際の評判と口コミを徹底調査。IT業界特化の転職エージェントの特徴、メリット・デメリットを詳しく解説。"
    },
    findy: {
      title: "Findyの評判は？口コミから分かる特徴とメリット・デメリット",
      description: "Findyの実際の評判と口コミを徹底調査。GitHub連携でスキルを可視化する転職サービスの特徴、メリット・デメリットを詳しく解説。"
    },
    geekly: {
      title: "Geeklyの評判は？口コミから分かる特徴とメリット・デメリット",
      description: "Geeklyの実際の評判と口コミを徹底調査。IT・Web・ゲーム業界特化の転職エージェントの特徴、メリット・デメリットを詳しく解説。"
    },
    bizreach: {
      title: "ビズリーチの評判は？口コミから分かる特徴とメリット・デメリット",
      description: "ビズリーチの実際の評判と口コミを徹底調査。ハイクラス転職サイトの特徴、メリット・デメリット、おすすめな人を詳しく解説します。"
    },
    rikunabi: {
      title: "リクナビNEXTの評判は？口コミから分かる特徴とメリット・デメリット",
      description: "リクナビNEXTの実際の評判と口コミを徹底調査。業界最大級の転職サイトの特徴、メリット・デメリット、未経験者へのサポートを詳しく解説。"
    },
    lapras: {
      title: "LAPRAS SCOUTの評判は？口コミから分かる特徴とメリット・デメリット",
      description: "LAPRAS SCOUTの実際の評判と口コミを徹底調査。AI技術でエンジニアのスキルを可視化するスカウト型転職サービスの特徴、メリット・デメリットを詳しく解説。"
    },
    wantedly: {
      title: "Wantedlyの評判は？口コミから分かる特徴とメリット・デメリット",
      description: "Wantedlyの実際の評判と口コミを徹底調査。「やりがい」でつながる転職サービスの特徴、メリット・デメリット、スタートアップ転職について詳しく解説。"
    },
    forkwell: {
      title: "Forkwell Jobsの評判は？口コミから分かる特徴とメリット・デメリット",
      description: "Forkwell Jobsの実際の評判と口コミを徹底調査。エンジニア向け求人サービスの特徴、技術記事投稿でのスカウト獲得、メリット・デメリットを詳しく解説。"
    }
  };

  return services.map(service => {
    const articleInfo = serviceArticleData[service.id as keyof typeof serviceArticleData];
    return {
      id: service.id,
      title: articleInfo?.title || `${service.name}の評判と特徴`,
      description: articleInfo?.description || `${service.name}の詳細な評判と特徴について解説します。`,
      publishDate: "2025-06-23",
      category: 'services',
      service
    };
  }).sort((a, b) => a.service!.name.localeCompare(b.service!.name));
}