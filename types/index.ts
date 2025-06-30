export interface Service {
  id: string;
  name: string;
  description: string;
  url: string;
  imageUrl: string;
  motiveTags: string[];
  jobTypeTags: string[];
  // 新しい詳細属性
  salaryRange: {
    min: number;
    max: number;
  };
  workLocation: string[]; // ['tokyo', 'osaka', 'remote', 'nationwide']
  companySize: string[]; // ['startup', 'small', 'medium', 'large']
  industries: string[]; // ['web', 'fintech', 'gaming', 'ai', 'consulting']
  techStack: string[]; // ['react', 'node', 'aws', 'docker', etc.]
  experienceLevel: string[]; // ['entry', 'mid', 'senior', 'lead']
  benefits: string[]; // ['flexible_hours', 'full_remote', 'stock_options', etc.]
}

export interface Tag {
  id: string;
  label: string;
}

export interface TagData {
  motiveTags: Tag[];
  jobTypeTags: Tag[];
  salaryRanges: Tag[];
  workLocations: Tag[];
  companySizes: Tag[];
  industries: Tag[];
  techStacks: Tag[];
  experienceLevels: Tag[];
  benefits: Tag[];
}

export interface UserConditions {
  motiveTags: string[];
  jobTypeTags: string[];
  salaryRange: {
    min: number;
    max: number;
  };
  workLocation: string[];
  companySize: string[];
  industries: string[];
  techStack: string[];
  experienceLevel: string;
  benefits: string[];
  // 優先度設定 (1-5の重要度)
  priorities: {
    salary: number;
    workLocation: number;
    companySize: number;
    industry: number;
    techStack: number;
    benefits: number;
  };
}

export interface MatchScore {
  total: number; // 0-100の総合スコア
  breakdown: {
    motivation: number;
    jobType: number;
    salary: number;
    location: number;
    companySize: number;
    industry: number;
    techStack: number;
    benefits: number;
  };
  reasoning: string[]; // マッチした理由のリスト
}

export interface ServiceWithScore extends Service {
  matchScore: MatchScore;
}

export interface RecommendationResult {
  exactMatch: ServiceWithScore[];
  partialMatch: ServiceWithScore[];
  others: ServiceWithScore[];
  totalCount: number;
}