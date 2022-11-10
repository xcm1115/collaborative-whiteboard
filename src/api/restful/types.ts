declare type RestfulValueRaw = string | number | null | undefined;

declare type RestfulBody =
  | string
  | Record<string, unknown>
  | null
  | undefined
  | Record<string, unknown>[];

declare interface RestfulRequestMeta {
  id?: RestfulValueRaw;
  path?: RestfulValueRaw;
  body?: RestfulBody;
  query?: string | RestfulBody;
}

declare interface RestfulClientInit {
  resource: string;
  initOptions?: RequestInit;
  headers?: HeadersInit;
  tokenParent?: string | null;
  // checkCSRFToken?: boolean;
  parseJson?: boolean;
  verifyCode?: boolean;
  verifyCodeEqual?: string;
  verifyCodeField?: string;
  verifyMsgField?: string;
  showMessage?: boolean;
  isUpload?: boolean;
  signalAborted?: boolean;
  renewPath?: string;
}

declare interface RestfulResponseJSON extends Record<string | number | symbol, unknown> {
  code: number;
  message: string;
  data: unknown;
}

declare interface RestfulClientVerifyInit extends RestfulClientInit {
  parseJson?: boolean;
  verifyCode?: boolean;
  verifyCodeEqual?: string;
  verifyCodeField?: string;
  verifyMsgField?: string;
  showMessage?: boolean;
  hasAbNormalCode?: boolean;
}

export type {
  RestfulValueRaw,
  RestfulBody,
  RestfulRequestMeta,
  RestfulClientInit,
  RestfulResponseJSON,
  RestfulClientVerifyInit,
};
