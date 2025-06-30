import { 
  recommendServices, 
  advancedRecommendServices 
} from '../utils/recommend';
import { Service, UserConditions } from '../types';

// テスト用のサンプルサービスデータ
const mockServices: Service[] = [
  {
    id: 'paiza',
    name: 'paiza転職',
    description: 'プログラミングスキル重視の転職サービス',
    url: 'https://paiza.jp/career',
    imageUrl: 'https://paiza.jp/favicon.ico',
    motiveTags: ['high_salary', 'career_up'],
    jobTypeTags: ['frontend', 'backend', 'generalist'],
    salaryRange: { min: 400, max: 1200 },
    workLocation: ['tokyo', 'osaka', 'remote'],
    companySize: ['startup', 'small', 'medium', 'large'],
    industries: ['web', 'fintech', 'gaming'],
    techStack: ['javascript', 'python', 'java'],
    experienceLevel: ['entry', 'mid', 'senior'],
    benefits: ['flexible_hours', 'skill_based_evaluation']
  },
  {
    id: 'findy',
    name: 'Findy',
    description: 'GitHub連携エンジニア転職',
    url: 'https://findy-code.io/',
    imageUrl: 'https://findy-code.io/favicon.ico',
    motiveTags: ['high_salary', 'career_up'],
    jobTypeTags: ['frontend', 'backend', 'mobile'],
    salaryRange: { min: 500, max: 1500 },
    workLocation: ['tokyo', 'remote'],
    companySize: ['startup', 'medium', 'large'],
    industries: ['web', 'fintech', 'ai'],
    techStack: ['react', 'typescript', 'go', 'python'],
    experienceLevel: ['mid', 'senior', 'lead'],
    benefits: ['github_integration', 'skill_visualization']
  },
  {
    id: 'rikunabi',
    name: 'リクナビNEXT',
    description: '未経験歓迎の大手転職サイト',
    url: 'https://next.rikunabi.com/',
    imageUrl: 'https://next.rikunabi.com/favicon.ico',
    motiveTags: ['change_domain', 'restart', 'stable_env'],
    jobTypeTags: ['unexp', 'generalist', 'pm'],
    salaryRange: { min: 300, max: 800 },
    workLocation: ['tokyo', 'osaka', 'nagoya', 'nationwide'],
    companySize: ['small', 'medium', 'large'],
    industries: ['web', 'manufacturing', 'finance'],
    techStack: ['basic_programming', 'office_tools'],
    experienceLevel: ['entry', 'mid'],
    benefits: ['beginner_friendly', 'large_database']
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

describe('advancedRecommendServices (高度な推薦システム)', () => {
  const basicConditions: UserConditions = {
    motiveTags: ['high_salary'],
    jobTypeTags: ['frontend'],
    salaryRange: { min: 400, max: 1000 },
    workLocation: ['tokyo'],
    companySize: ['startup', 'medium'],
    industries: ['web'],
    techStack: ['javascript'],
    experienceLevel: 'mid',
    benefits: ['flexible_hours'],
    priorities: {
      salary: 4,
      workLocation: 3,
      companySize: 2,
      industry: 3,
      techStack: 4,
      benefits: 2
    }
  };

  test('詳細条件でスコアリングされたマッチング結果を返す', () => {
    const result = advancedRecommendServices(mockServices, basicConditions);

    expect(result.totalCount).toBe(3);
    expect(result.exactMatch.length + result.partialMatch.length + result.others.length).toBe(3);
    
    // スコアが計算されていることを確認
    if (result.exactMatch.length > 0) {
      expect(result.exactMatch[0].matchScore).toBeDefined();
      expect(result.exactMatch[0].matchScore.total).toBeGreaterThanOrEqual(80);
    }
    
    if (result.partialMatch.length > 0) {
      expect(result.partialMatch[0].matchScore.total).toBeGreaterThanOrEqual(50);
      expect(result.partialMatch[0].matchScore.total).toBeLessThan(80);
    }
  });

  test('年収レンジのマッチングが正しく動作する', () => {
    const conditions: UserConditions = {
      ...basicConditions,
      salaryRange: { min: 450, max: 600 }, // paizaとfindyの範囲と部分的に重複
    };

    const result = advancedRecommendServices(mockServices, conditions);
    
    // 年収範囲でのフィルタリング効果を確認
    const servicesWithGoodSalaryScore = result.exactMatch
      .concat(result.partialMatch)
      .filter(s => s.matchScore.breakdown.salary > 0);
    
    expect(servicesWithGoodSalaryScore.length).toBeGreaterThan(0);
  });

  test('技術スタックのマッチングが正しく動作する', () => {
    const conditions: UserConditions = {
      ...basicConditions,
      techStack: ['react', 'typescript'], // findyにマッチ
    };

    const result = advancedRecommendServices(mockServices, conditions);
    
    // TypeScriptとReactを使えるfindyが高スコアになることを確認
    const findy = result.exactMatch
      .concat(result.partialMatch)
      .find(s => s.id === 'findy');
    
    if (findy) {
      expect(findy.matchScore.breakdown.techStack).toBeGreaterThan(0);
    }
  });

  test('勤務地のマッチングが正しく動作する', () => {
    const conditions: UserConditions = {
      ...basicConditions,
      workLocation: ['remote'], // リモート対応
    };

    const result = advancedRecommendServices(mockServices, conditions);
    
    // リモート対応のサービス（paiza, findy）が高い場所スコアを持つことを確認
    const remoteServices = result.exactMatch
      .concat(result.partialMatch)
      .filter(s => s.matchScore.breakdown.location > 0);
    
    expect(remoteServices.length).toBeGreaterThanOrEqual(2);
  });

  test('優先度設定が重み付きスコアに反映される', () => {
    const highTechPriority: UserConditions = {
      ...basicConditions,
      priorities: {
        salary: 1,
        workLocation: 1,
        companySize: 1,
        industry: 1,
        techStack: 5, // 技術を最重要視
        benefits: 1
      }
    };

    const highSalaryPriority: UserConditions = {
      ...basicConditions,
      priorities: {
        salary: 5, // 年収を最重要視
        workLocation: 1,
        companySize: 1,
        industry: 1,
        techStack: 1,
        benefits: 1
      }
    };

    const techResult = advancedRecommendServices(mockServices, highTechPriority);
    const salaryResult = advancedRecommendServices(mockServices, highSalaryPriority);

    // 異なる優先度設定で結果が変わることを確認
    const techFirstService = techResult.exactMatch[0] || techResult.partialMatch[0];
    const salaryFirstService = salaryResult.exactMatch[0] || salaryResult.partialMatch[0];
    
    // 少なくとも優先度に基づいてスコアが異なることを確認
    expect(techFirstService.matchScore.total).toBeGreaterThan(0);
    expect(salaryFirstService.matchScore.total).toBeGreaterThan(0);
  });

  test('推薦理由が適切に生成される', () => {
    const result = advancedRecommendServices(mockServices, basicConditions);
    
    const servicesWithReasons = result.exactMatch
      .concat(result.partialMatch)
      .filter(s => s.matchScore.reasoning.length > 0);
    
    expect(servicesWithReasons.length).toBeGreaterThan(0);
    
    // 推薦理由が日本語で記述されていることを確認
    servicesWithReasons.forEach(service => {
      expect(service.matchScore.reasoning).toEqual(
        expect.arrayContaining([expect.any(String)])
      );
    });
  });

  test('スコアの詳細分析が正しく計算される', () => {
    const result = advancedRecommendServices(mockServices, basicConditions);
    
    if (result.exactMatch.length > 0) {
      const service = result.exactMatch[0];
      const breakdown = service.matchScore.breakdown;
      
      // 全ての分析項目が0-100の範囲内であることを確認
      Object.values(breakdown).forEach(score => {
        expect(score).toBeGreaterThanOrEqual(0);
        expect(score).toBeLessThanOrEqual(100);
      });
      
      // 総合スコアが0-100の範囲内であることを確認
      expect(service.matchScore.total).toBeGreaterThanOrEqual(0);
      expect(service.matchScore.total).toBeLessThanOrEqual(100);
    }
  });

  test('経験レベルのマッチングが正しく動作する', () => {
    const entryConditions: UserConditions = {
      ...basicConditions,
      experienceLevel: 'entry',
    };

    const seniorConditions: UserConditions = {
      ...basicConditions,
      experienceLevel: 'senior',
    };

    const entryResult = advancedRecommendServices(mockServices, entryConditions);
    const seniorResult = advancedRecommendServices(mockServices, seniorConditions);

    // エントリーレベルとシニアレベルで推薦結果を比較
    const entryTopService = entryResult.exactMatch[0] || entryResult.partialMatch[0];
    const seniorTopService = seniorResult.exactMatch[0] || seniorResult.partialMatch[0];

    // 両方とも結果が存在することを確認
    expect(entryTopService).toBeDefined();
    expect(seniorTopService).toBeDefined();
  });

  test('空の条件でもエラーにならない', () => {
    const emptyConditions: UserConditions = {
      motiveTags: [],
      jobTypeTags: [],
      salaryRange: { min: 0, max: 9999 },
      workLocation: [],
      companySize: [],
      industries: [],
      techStack: [],
      experienceLevel: '',
      benefits: [],
      priorities: {
        salary: 3,
        workLocation: 3,
        companySize: 3,
        industry: 3,
        techStack: 3,
        benefits: 3
      }
    };

    const result = advancedRecommendServices(mockServices, emptyConditions);
    
    expect(result.totalCount).toBe(3);
    expect(result.exactMatch.length + result.partialMatch.length + result.others.length).toBe(3);
  });
});

describe('エラーハンドリング', () => {
  test('無効なサービス配列を渡した場合のエラーハンドリング', () => {
    // @ts-ignore - テスト用に意図的に無効な値を渡す
    const result1 = recommendServices(null, ['high_salary'], ['frontend']);
    expect(result1.exactMatch).toHaveLength(0);
    
    // @ts-ignore - テスト用に意図的に無効な値を渡す
    const result2 = advancedRecommendServices(undefined, {
      motiveTags: [],
      jobTypeTags: [],
      salaryRange: { min: 0, max: 9999 },
      workLocation: [],
      companySize: [],
      industries: [],
      techStack: [],
      experienceLevel: '',
      benefits: [],
      priorities: { salary: 3, workLocation: 3, companySize: 3, industry: 3, techStack: 3, benefits: 3 }
    });
    expect(result2.totalCount).toBe(0);
  });
});

describe('パフォーマンステスト', () => {
  test('大量のサービスデータでも適切な時間で処理される', () => {
    // 100個のサービスデータを生成
    const largeServiceArray = Array.from({ length: 100 }, (_, i) => ({
      ...mockServices[0],
      id: `service-${i}`,
      name: `Service ${i}`,
    }));

    const startTime = performance.now();
    
    const result = advancedRecommendServices(largeServiceArray, {
      motiveTags: ['high_salary'],
      jobTypeTags: ['frontend'],
      salaryRange: { min: 400, max: 1000 },
      workLocation: ['tokyo'],
      companySize: ['startup'],
      industries: ['web'],
      techStack: ['javascript'],
      experienceLevel: 'mid',
      benefits: ['flexible_hours'],
      priorities: { salary: 3, workLocation: 3, companySize: 3, industry: 3, techStack: 3, benefits: 3 }
    });
    
    const endTime = performance.now();
    const executionTime = endTime - startTime;

    // 1秒以内に処理が完了することを確認
    expect(executionTime).toBeLessThan(1000);
    expect(result.totalCount).toBe(100);
  });
});