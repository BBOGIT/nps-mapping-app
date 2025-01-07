export type TemplateType = 'shopify' | 'amazon' | 'other';

export interface TableData {
  [key: string]: string;
}

export interface TemplateResponse {
  data: TableData[];
}