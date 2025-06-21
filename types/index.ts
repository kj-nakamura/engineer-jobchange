export interface Service {
  id: string;
  name: string;
  description: string;
  url: string;
  motiveTags: string[];
  jobTypeTags: string[];
}

export interface Tag {
  id: string;
  label: string;
}

export interface TagData {
  motiveTags: Tag[];
  jobTypeTags: Tag[];
}

export interface RecommendationResult {
  exactMatch: Service[];
  partialMatch: Service[];
  others: Service[];
}