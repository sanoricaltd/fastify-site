export interface IVerify {
  visitorId: string;
  requestId?: string;
  bLang?: string;
  shallow?: boolean;
  referer?: string;
  gclid?: string;
  ip?: string;
  userAgent?: string;
  requestUrl?: string;
}

export interface ILink {
  gclid?: string;
  ip?: string;
  visitorId?: string;
  userAgent?: string;
  campaignId?: string;
}
