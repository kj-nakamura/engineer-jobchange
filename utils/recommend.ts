import { Service, RecommendationResult } from '../types';

export function recommendServices(
  allServices: Service[],
  motiveTags: string[],
  jobTypeTags: string[]
): RecommendationResult {
  const exactMatch: Service[] = [];
  const partialMatch: Service[] = [];
  const others: Service[] = [];

  allServices.forEach(service => {
    const hasMotiveMatch = motiveTags.some(tag => service.motiveTags.includes(tag));
    const hasJobTypeMatch = jobTypeTags.some(tag => service.jobTypeTags.includes(tag));

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