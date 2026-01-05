export interface Trend {
  title: string;
  description: string;
  importance: 'high' | 'medium' | 'low';
  keywords: string[];
}

export interface Source {
  url: string;
  title: string;
  reliability: 'high' | 'medium' | 'low';
}

export interface ResearchData {
  trends: Trend[];
  insights: string[];
  sources: Source[];
}
