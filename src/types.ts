import { RouteGenericInterface, RouteHandlerMethod, RawServerDefault, RawRequestDefaultExpression, RawReplyDefaultExpression, preHandlerAsyncHookHandler, preHandlerHookHandler } from 'fastify';
import { SiteStates } from './enums/site-states';

export type TPreHandlerAsyncHookHandler<Request extends RouteGenericInterface> = preHandlerAsyncHookHandler<
  RawServerDefault,
  RawRequestDefaultExpression<RawServerDefault>,
  RawReplyDefaultExpression<RawServerDefault>,
  Request
>;

export type TPreHandlerHookHandler<Request extends RouteGenericInterface> = preHandlerHookHandler<
  RawServerDefault,
  RawRequestDefaultExpression<RawServerDefault>,
  RawReplyDefaultExpression<RawServerDefault>,
  Request
>;

export type TRouteHandlerMethod<RequestInterface extends RouteGenericInterface> = RouteHandlerMethod<
  RawServerDefault,
  RawRequestDefaultExpression<RawServerDefault>,
  RawReplyDefaultExpression<RawServerDefault>,
  RequestInterface
>;

export interface IRouteView {
  Querystring: {
    gclid?: string;
    gbraid?: string;
  };
}

export interface IRouteApi {
  Body: {
    id?: string;
    requestId?: string;
    visitorId?: string;
    bLang?: string;
    nonce: string;
  };
}

export interface IRouteTransport {
  Params: {
    id?: string;
  };
}

export interface IVerify {
  state: SiteStates;
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
