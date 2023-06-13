export type CookieAnalytics = {
  id: string;
  platform: string;
  category: string;
  subCategory: string;
  functionality: string;
  description: string;
  dataController: string;
  GDPRPortal: string;
  retentionPeriod: string;
  usage: string;
  popularity: string;
  comment: string[];
};

export type CookieAnalyticsRaw = {
  ID: string;
  Platform: string;
  Category: string;
  Domain: string;
  Description: string;
  Key: string;
  DataController: string;
  Retention: string;
  GDPR: string;
  Wildcard: string;
};

export type CookieDatabase = {
  [category: string]: Array<CookieAnalyticsRaw>;
};
