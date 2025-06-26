import { Service, RecommendationResult } from '../types';

export function recommendServices(
  allServices: Service[],
  motiveTags: string[],
  jobTypeTags: string[]
): RecommendationResult {
  const exactMatch: Service[] = [];
  const partialMatch: Service[] = [];
  const others: Service[] = [];

  if (!allServices || !Array.isArray(allServices)) {
    return { exactMatch, partialMatch, others };
  }

  allServices.forEach(service => {
    // AND検索: 選択された全てのタグにマッチするかチェック
    const motivesMatch = motiveTags.length === 0 || motiveTags.every(tag => service.motiveTags.includes(tag));
    const jobTypesMatch = jobTypeTags.length === 0 || jobTypeTags.every(tag => service.jobTypeTags.includes(tag));

    if (motivesMatch && jobTypesMatch && (motiveTags.length > 0 || jobTypeTags.length > 0)) {
      exactMatch.push(service);
    } else {
      // 部分マッチ: 選択されたタグの一部にマッチ
      const hasAnyMotiveMatch = motiveTags.length > 0 && motiveTags.some(tag => service.motiveTags.includes(tag));
      const hasAnyJobTypeMatch = jobTypeTags.length > 0 && jobTypeTags.some(tag => service.jobTypeTags.includes(tag));
      
      if (hasAnyMotiveMatch || hasAnyJobTypeMatch) {
        partialMatch.push(service);
      } else {
        others.push(service);
      }
    }
  });

  return {
    exactMatch,
    partialMatch,
    others
  };
}