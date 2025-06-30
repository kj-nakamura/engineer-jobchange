import { Service, UserConditions, MatchScore, ServiceWithScore, RecommendationResult } from '../types';

// レガシー関数（後方互換性のため）
export function recommendServices(
  allServices: Service[],
  motiveTags: string[],
  jobTypeTags: string[]
): RecommendationResult {
  if (!allServices || !Array.isArray(allServices)) {
    return { exactMatch: [], partialMatch: [], others: [], totalCount: 0 };
  }

  const exactMatch: Service[] = [];
  const partialMatch: Service[] = [];
  const others: Service[] = [];

  allServices.forEach(service => {
    const hasMotiveMatch = motiveTags.length > 0 && motiveTags.some(tag => service.motiveTags.includes(tag));
    const hasJobTypeMatch = jobTypeTags.length > 0 && jobTypeTags.some(tag => service.jobTypeTags.includes(tag));

    if (hasMotiveMatch && hasJobTypeMatch) {
      exactMatch.push(service);
    } else if (hasMotiveMatch || hasJobTypeMatch) {
      partialMatch.push(service);
    } else {
      others.push(service);
    }
  });

  return {
    exactMatch,
    partialMatch,
    others,
    totalCount: allServices.length
  };
}

// 新しい高度な推薦システム
export function advancedRecommendServices(
  allServices: Service[],
  conditions: UserConditions
): RecommendationResult {
  if (!allServices || !Array.isArray(allServices)) {
    return { exactMatch: [], partialMatch: [], others: [], totalCount: 0 };
  }

  const servicesWithScores: ServiceWithScore[] = allServices.map(service => ({
    ...service,
    matchScore: calculateMatchScore(service, conditions)
  }));

  // スコアでソート
  servicesWithScores.sort((a, b) => b.matchScore.total - a.matchScore.total);

  const exactMatch: ServiceWithScore[] = [];
  const partialMatch: ServiceWithScore[] = [];
  const others: ServiceWithScore[] = [];

  servicesWithScores.forEach(service => {
    if (service.matchScore.total >= 80) {
      exactMatch.push(service);
    } else if (service.matchScore.total >= 50) {
      partialMatch.push(service);
    } else {
      others.push(service);
    }
  });

  return {
    exactMatch,
    partialMatch,
    others,
    totalCount: allServices.length
  };
}

// マッチスコア計算関数
function calculateMatchScore(service: Service, conditions: UserConditions): MatchScore {
  const scores = {
    motivation: calculateMotivationScore(service, conditions),
    jobType: calculateJobTypeScore(service, conditions),
    salary: calculateSalaryScore(service, conditions),
    location: calculateLocationScore(service, conditions),
    companySize: calculateCompanySizeScore(service, conditions),
    industry: calculateIndustryScore(service, conditions),
    techStack: calculateTechStackScore(service, conditions),
    benefits: calculateBenefitsScore(service, conditions)
  };

  // 重み付きスコア計算
  const { priorities } = conditions;
  const weightedScore = (
    scores.motivation * 2 + // motivation と jobType は常に重要
    scores.jobType * 2 +
    scores.salary * priorities.salary +
    scores.location * priorities.workLocation +
    scores.companySize * priorities.companySize +
    scores.industry * priorities.industry +
    scores.techStack * priorities.techStack +
    scores.benefits * priorities.benefits
  ) / (4 + Object.values(priorities).reduce((a, b) => a + b, 0));

  const reasoning = generateReasoning(service, conditions, scores);

  return {
    total: Math.round(weightedScore),
    breakdown: scores,
    reasoning
  };
}

// 各項目のスコア計算関数
function calculateMotivationScore(service: Service, conditions: UserConditions): number {
  if (conditions.motiveTags.length === 0) return 100;
  
  const matchCount = conditions.motiveTags.filter(tag => 
    service.motiveTags.includes(tag)
  ).length;
  
  return (matchCount / conditions.motiveTags.length) * 100;
}

function calculateJobTypeScore(service: Service, conditions: UserConditions): number {
  if (conditions.jobTypeTags.length === 0) return 100;
  
  const matchCount = conditions.jobTypeTags.filter(tag => 
    service.jobTypeTags.includes(tag)
  ).length;
  
  return (matchCount / conditions.jobTypeTags.length) * 100;
}

function calculateSalaryScore(service: Service, conditions: UserConditions): number {
  const { min: userMin, max: userMax } = conditions.salaryRange;
  
  // サービスに年収レンジが設定されていない場合はデフォルトスコアを返す
  if (!service.salaryRange) {
    return 50; // 中立的なスコア
  }
  
  const { min: serviceMin, max: serviceMax } = service.salaryRange;
  
  // ユーザーの希望範囲とサービス範囲の重複を計算
  const overlapMin = Math.max(userMin, serviceMin);
  const overlapMax = Math.min(userMax, serviceMax);
  
  if (overlapMin > overlapMax) return 0; // 重複なし
  
  const overlapSize = overlapMax - overlapMin;
  const userRangeSize = userMax - userMin;
  
  return (overlapSize / userRangeSize) * 100;
}

function calculateLocationScore(service: Service, conditions: UserConditions): number {
  if (conditions.workLocation.length === 0) return 100;
  if (!service.workLocation || !Array.isArray(service.workLocation)) return 50;
  
  const matchCount = conditions.workLocation.filter(location => 
    service.workLocation.includes(location)
  ).length;
  
  return matchCount > 0 ? 100 : 0;
}

function calculateCompanySizeScore(service: Service, conditions: UserConditions): number {
  if (conditions.companySize.length === 0) return 100;
  if (!service.companySize || !Array.isArray(service.companySize)) return 50;
  
  const matchCount = conditions.companySize.filter(size => 
    service.companySize.includes(size)
  ).length;
  
  return matchCount > 0 ? 100 : 0;
}

function calculateIndustryScore(service: Service, conditions: UserConditions): number {
  if (conditions.industries.length === 0) return 100;
  if (!service.industries || !Array.isArray(service.industries)) return 50;
  
  const matchCount = conditions.industries.filter(industry => 
    service.industries.includes(industry)
  ).length;
  
  return (matchCount / conditions.industries.length) * 100;
}

function calculateTechStackScore(service: Service, conditions: UserConditions): number {
  if (conditions.techStack.length === 0) return 100;
  if (!service.techStack || !Array.isArray(service.techStack)) return 50;
  
  const matchCount = conditions.techStack.filter(tech => 
    service.techStack.includes(tech)
  ).length;
  
  return (matchCount / conditions.techStack.length) * 100;
}

function calculateBenefitsScore(service: Service, conditions: UserConditions): number {
  if (conditions.benefits.length === 0) return 100;
  if (!service.benefits || !Array.isArray(service.benefits)) return 50;
  
  const matchCount = conditions.benefits.filter(benefit => 
    service.benefits.includes(benefit)
  ).length;
  
  return (matchCount / conditions.benefits.length) * 100;
}

// 推薦理由生成
function generateReasoning(
  service: Service, 
  conditions: UserConditions, 
  scores: any
): string[] {
  const reasons: string[] = [];

  if (scores.motivation >= 80) {
    reasons.push('転職動機にマッチしています');
  }
  
  if (scores.jobType >= 80) {
    reasons.push('希望職種に対応しています');
  }
  
  if (scores.salary >= 80) {
    reasons.push('希望年収範囲に合致しています');
  }
  
  if (scores.location >= 80) {
    reasons.push('希望勤務地に対応しています');
  }
  
  if (scores.techStack >= 80) {
    reasons.push('希望技術スタックを扱えます');
  }
  
  if (scores.benefits >= 80) {
    reasons.push('希望する福利厚生があります');
  }

  if (reasons.length === 0) {
    reasons.push('基本的な条件に部分的にマッチしています');
  }

  return reasons;
}