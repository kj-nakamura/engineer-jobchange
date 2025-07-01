import { 
  recommendServices 
} from '../utils/recommend';
import { Service } from '../types';

// テスト用のサンプルサービスデータ
const mockServices: Service[] = [
  {
    id: 'paiza',
    name: 'paiza転職',
    description: 'プログラミングスキル重視の転職サービス',
    url: 'https://paiza.jp/career',
    imageUrl: 'https://paiza.jp/favicon.ico',
    motiveTags: ['high_salary', 'career_up'],
    jobTypeTags: ['frontend', 'backend', 'generalist']
  },
  {
    id: 'findy',
    name: 'Findy',
    description: 'GitHub連携エンジニア転職',
    url: 'https://findy-code.io/',
    imageUrl: 'https://findy-code.io/favicon.ico',
    motiveTags: ['high_salary', 'career_up'],
    jobTypeTags: ['frontend', 'backend', 'mobile']
  },
  {
    id: 'rikunabi',
    name: 'リクナビNEXT',
    description: '未経験歓迎の大手転職サイト',
    url: 'https://next.rikunabi.com/',
    imageUrl: 'https://next.rikunabi.com/favicon.ico',
    motiveTags: ['change_domain', 'restart', 'stable_env'],
    jobTypeTags: ['unexp', 'generalist', 'pm']
  }
];

describe('recommendServices (レガシー関数)', () => {
  test('転職動機にマッチするサービスを正しく推薦する', () => {
    const result = recommendServices(
      mockServices, 
      ['high_salary'], 
      []
    );

    expect(result.exactMatch).toHaveLength(0); // 職種が空なので完全マッチなし
    expect(result.partialMatch).toHaveLength(2); // paiza, findy
    expect(result.others).toHaveLength(1); // rikunabi
    
    const partialMatchIds = result.partialMatch.map(s => s.id);
    expect(partialMatchIds).toContain('paiza');
    expect(partialMatchIds).toContain('findy');
  });

  test('職種にマッチするサービスを正しく推薦する', () => {
    const result = recommendServices(
      mockServices, 
      [], 
      ['frontend']
    );

    expect(result.exactMatch).toHaveLength(0); // 動機が空なので完全マッチなし
    expect(result.partialMatch).toHaveLength(2); // paiza, findy
    expect(result.others).toHaveLength(1); // rikunabi
  });

  test('動機と職種の両方にマッチするサービスを完全マッチとして推薦する', () => {
    const result = recommendServices(
      mockServices, 
      ['high_salary'], 
      ['frontend']
    );

    expect(result.exactMatch).toHaveLength(2); // paiza, findy
    expect(result.partialMatch).toHaveLength(0);
    expect(result.others).toHaveLength(1); // rikunabi
  });

  test('マッチしない条件の場合、othersに分類される', () => {
    const result = recommendServices(
      mockServices, 
      ['nonexistent_motive'], 
      ['nonexistent_job']
    );

    expect(result.exactMatch).toHaveLength(0);
    expect(result.partialMatch).toHaveLength(0);
    expect(result.others).toHaveLength(3);
  });

  test('空の配列を渡した場合、エラーにならない', () => {
    const result = recommendServices([], ['high_salary'], ['frontend']);
    
    expect(result.exactMatch).toHaveLength(0);
    expect(result.partialMatch).toHaveLength(0);
    expect(result.others).toHaveLength(0);
  });
});

describe('エラーハンドリング', () => {
  test('無効なサービス配列を渡した場合のエラーハンドリング', () => {
    // @ts-ignore - テスト用に意図的に無効な値を渡す
    const result1 = recommendServices(null, ['high_salary'], ['frontend']);
    expect(result1.exactMatch).toHaveLength(0);
  });
});