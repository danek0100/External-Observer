export interface Zettel {
  id: string;
  type: 'zettel' | 'task' | 'event' | 'finance' | 'health' | 'contact' | 'diary';
  path?: string;
  created: string;
  updated?: string;
  tags?: string[];
  links?: string[];
  content: string;
  metadata?: Record<string, any>;
  status?: 'draft' | 'active' | 'archived' | 'deleted';
  version: number;
}

export interface ZettelRequest {
  type: string;
  path?: string;
  content: string;
  tags?: string[];
  links?: string[];
  metadata?: Record<string, any>;
  status?: string;
}

export interface ZettelSearchRequest {
  tags?: string[];
  keyword?: string;
  matchAll?: boolean;
} 