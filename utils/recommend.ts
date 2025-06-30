import { Service, RecommendationResult } from '../types';

// レガシー関数（後方互換性のため）
export function recommendServices(
  allServices: Service[],
  motiveTags: string[],
  jobTypeTags: string[]
): RecommendationResult {
  if (!allServices || !Array.isArray(allServices)) {
    return { exactMatch: [], partialMatch: [], others: [] };
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
    others
  };
}

