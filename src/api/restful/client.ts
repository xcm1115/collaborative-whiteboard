// Taken from https://gitlab.com/pharmony/restful-json-api-client/-/tree/master
import Md5 from 'blueimp-md5';
import qs from 'qs';

import { RestfulBody, RestfulClientInit, RestfulRequestMeta, RestfulValueRaw } from './types';

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const JWT_TOKEN_ID = 'dlp_jwt_token';
const JWT_RENEW_PATH_ID = 'dlp_jwt_renew_path';

// // Usage
// // Most simple use case
// // This example creates a UsersApi class, which allows you to request any of the CRUD actions :
// export default class UsersApi extends BeesRestful {
//   constructor () {
//     super(
//       'https://myapp.com/api', {  // The base URL of the API to consume
//         resource: 'users'         // The resource of the API to consume
//     })
//   }
// }

// // From now on, you can instantiate it and call CRUD actions :

// const usersApi = new UsersApi()

// usersApi.index() // Calls a GET on https://myapp.com/api/users
// usersApi.get({ id: 1 }) // Calls a GET on https://myapp.com/api/users/1
// usersApi.create({ name: 'zedtux' }) // Send a POST to https://myapp.com/api/users
// usersApi.modify(2, { name: 'john' }) // Send a PATCH to https://myapp.com/api/users/2
// usersApi.update(2, { name: 'john' }) // Send a PUT to https://myapp.com/api/users/2
// usersApi.destroy(2) // Send a DELETE to https://myapp.com/api/users/2

class RestfulClient {
  constructor(
    baseUrl: string,
    {
      resource,
      initOptions,
      headers = {},
      tokenParent = null,
      isUpload = false,
      parseJson = true,
      signalAborted = true,
      renewPath = '',
    }: RestfulClientInit
  ) {
    if (!baseUrl) {
      throw new Error('missing baseUrl');
    }
    if (!resource) {
      throw new Error('missing resource');
    }

    this.originalHeaders = {};

    this.parseJson = parseJson;
    this.isUpload = isUpload;

    this.resetHeaders();
    this.headers = { ...this.headers, ...headers };
    this.originalHeaders = { ...this.originalHeaders, ...headers };

    if (initOptions) {
      this.initOptions = initOptions;
    }

    // 'http://example.dev/api/'.substring(0, 4) === "http://example.dev/api"
    this.baseUrl = baseUrl.endsWith('/') ? baseUrl.substring(0, baseUrl.length - 1) : baseUrl;

    // '/user/'.substring(1) === "/user"
    let resourceFolder = resource.endsWith('/')
      ? resource.substring(0, resource.length - 1)
      : resource;
    // '/user'.substring(1) === "user"
    resourceFolder = resourceFolder.startsWith('/') ? resourceFolder.substring(1) : resourceFolder;
    // user path to 'http://example.dev/api/user'
    this.resource = resourceFolder;

    this.tokenParent = tokenParent;
    this.renewPath = renewPath;

    if (signalAborted) {
      this.controller = new AbortController();
    } else {
      this.controller = null;
    }
  }

  initOptions?: RequestInit;
  headers?: HeadersInit;
  originalHeaders?: HeadersInit;
  baseUrl: string | null = '';
  tokenParent: string | null = '';
  resource: string | null = '';
  isUpload = false;
  parseJson = true;
  renewPath: string | null = '';
  controller: AbortController | null = null;

  static reset() {
    localStorage.removeItem(JWT_TOKEN_ID);
  }

  static setJwtRenewPath(path: string) {
    localStorage.setItem(JWT_RENEW_PATH_ID, path);
  }

  static jwt() {
    return localStorage.getItem(JWT_TOKEN_ID);
  }

  static json(response: Response) {
    try {
      return onFetchJson(response);
    } catch (e: any) {
      return Promise.reject(new Error(`${e.message} \n ${response.url}`));
    }
  }

  static async textJson(response: Response) {
    // return onFetchTextJson(response);
    try {
      return await onFetchTextJson(response);
    } catch (ex: any) {
      // catch error message
      const exJson = { code: 5999, message: ex.message, data: [] };
      return exJson;
    }
  }

  static baseFetch(input: RequestInfo, init?: RequestInit) {
    return fetch(input, init);
  }

  resetHeaders() {
    let headers: HeadersInit = {
      Accept: 'application/json',
    };

    if (!this.isUpload) {
      headers = { ...headers, 'Content-Type': 'application/json' };
    }

    this.headers = headers;
  }

  /*
   ** Build the full route to be called.
   *
   *  Given baseUrl is 'https://mydom.co/api' and resource is 'users'
   *
   *  - Without any params: https://mydom.co/api/users
   *  - With id 1: https://mydom.co/api/users/1
   *  - With id 1 and path 'unlock': https://mydom.co/api/users/1/unlock
   */
  toFullRoute(id: RestfulValueRaw = null, path: RestfulValueRaw = null) {
    if (path === null && !id) {
      throw new Error('missing id');
    }
    // let baseUrl = this
    return `${this.baseUrl}/${this.resource}${id ? `/${id}` : ''}${path && `/${path}`}`;
  }

  /*
   ** Build and execute RESTful request.
   *
   *  method: HTTP Verb to be used for this request (GET, POST, PUT, PATCH, DELETE) (Required)
   *  id: Resource ID (Optional)
   *  path: Additional path for this request (See toFullRoute()) (Optional)
   *  body: Request body or request query when verb is GET or DELETE (Optional)
   */
  toBuildFetch(
    method: string,
    { id = 0, path = '', body = null, query = '' }: RestfulRequestMeta = {}
  ) {
    let fullRoute = this.toFullRoute(id, path);

    let postBody = body || null;

    if (['GET', 'DELETE'].includes(method) && postBody) {
      const strQuery = qs.stringify(postBody, { arrayFormat: 'repeat' });

      fullRoute = `${fullRoute}?${strQuery}`;
      postBody = null;
    } else if (query) {
      const strQuery = qs.stringify(query);
      fullRoute = `${fullRoute}?${strQuery}`;
    } else {
      fullRoute = `${fullRoute}`;
    }

    let baseUrl = BASE_URL;

    if (baseUrl && !baseUrl.endsWith('/') && !fullRoute.startsWith('/')) {
      baseUrl = `${baseUrl}/`;
    } else if (baseUrl && baseUrl.endsWith('/') && fullRoute.startsWith('/')) {
      baseUrl = baseUrl.substring(0, baseUrl.length - 1);
    }

    if (!fullRoute.startsWith('http://') && !fullRoute.startsWith('https://')) {
      fullRoute = `${baseUrl}${fullRoute}`;
    }

    const init: RequestInit = {
      ...(this.initOptions || {}),
      method,
      headers: this.headers,
    };

    if (this.controller) {
      init.signal = this.controller.signal;
    }

    // console.log('this.isUpload && postBody', this.isUpload, postBody);

    if (this.isUpload && postBody) {
      const formData = new FormData();
      Object.entries(postBody).forEach(([key, value]) => {
        if (value instanceof File) {
          formData.append(key, value);
        } else if (Array.isArray(value)) {
          value.forEach((file) => {
            formData.append(key, file.value || file);
          });
        } else {
          formData.append(key, String(value));
        }
      });
      init.body = formData;
    } else if (postBody) {
      init.body = JSON.stringify(postBody);
    }

    const jwt = localStorage.getItem(JWT_TOKEN_ID);
    if (jwt) {
      init.headers = { ...init.headers, Authorization: `Bearer ${jwt}` };
    } else {
      init.headers = { ...this.originalHeaders };
    }

    return RestfulClient.baseFetch(fullRoute, init);
  }

  /*
   ** This function runs the fetch request, then checks for a JWT token from the
   *  response's body and stores it if any.
   *
   *  Later, when the fetch request is rejected (error 401), this function tries
   *  to renew the JWT, in the case of the renewPath is configured, and update
   *  it before to run again the fetch request with the new JWT.
   *  This should makes transparent to the external app the JWT renewal.
   *
   */
  async buildFetchWithJwtSupport(
    method: string,
    { id = 0, path = '', body = null, query = '' }: RestfulRequestMeta = {}
  ) {
    const fetchPromise = this.toBuildFetch(method, {
      id,
      path,
      body,
      query,
    });

    const response = await fetchPromise;
    if (response.ok) {
      /*
       ** Before to return the successful Promise, let's see if we don't have
       *  a JWT in the body ...
       *
       *  We are using .clone() here in order to do somehting with the data,
       *  without altering the response object which will be returned to the
       *  external app.
       */
      response
        .clone()
        .text()
        .then((text) => {
          let json = {};
          if (text && text !== '') {
            try {
              json = JSON.parse(text);
            } catch {
              return {};
            }
          }
          return json;
        })
        .then((json_1) => this.storeTokenIfAnyFoundFrom(json_1));

      // Returns the successful Promise to the external so that it can
      // consume its precious data.
      return fetchPromise;
    }
    if (response.status === 401) {
      const currentJwt = localStorage.getItem(JWT_TOKEN_ID);
      if (currentJwt) {
        const renewPath = localStorage.getItem(JWT_RENEW_PATH_ID);
        if (renewPath) {
          return this.tryRenewJwt(currentJwt, renewPath)
            .then(RestfulClient.json)
            .then((json_2: Record<string, unknown>) => {
              this.storeTokenIfAnyFoundFrom(json_2);
              // Re-run the initial request, with the new JWT, and return the
              // promise, whatever happen ...
              return this.toBuildFetch(method, {
                id,
                path,
                body,
                query,
              });
            })
            .catch(
              () =>
                // Something went wrong while renewing the JWT, let's the external
                // app knows it.
                fetchPromise
            );
        }
        // Okay so we don't know where to renew the JWT, so let's return
        // the failed promise to the external app.
        return fetchPromise;
      }
      // We aren't authorized here, and have no JWT, so returns the
      // promise to the external app so that it can handle it and do
      // something.
      return fetchPromise;
    }
    return await fetchPromise;
  }

  // Retrieves the JWT token from the response body.
  // In the case a `tokenParent` has been passed to the constructor, it will be
  // used instead in order to look for the token Field.
  storeTokenIfAnyFoundFrom(payload: Record<string, unknown>) {
    // Default place is at the root
    let responseToken = '';

    if (typeof payload.token === 'string') {
      responseToken = payload.token;
    } else if (this.tokenParent && this.tokenParent in payload) {
      // Now check from the given `tokenParent` if any
      let data = { token: '' };
      data = { ...data, token: String(payload[this.tokenParent] || '') };
      responseToken = data.token;
    }

    // Stores what has been found if any
    if (responseToken) {
      localStorage.setItem(JWT_TOKEN_ID, responseToken);
    }
  }

  tryRenewJwt(jwt: string, renewPath: string) {
    return RestfulClient.baseFetch(renewPath, {
      method: 'POST',
      headers: this.originalHeaders,
      body: JSON.stringify({ token: jwt }),
    });
  }

  async request(
    method: string,
    { id = 0, path = '', body = null, query = null }: RestfulRequestMeta = {}
  ) {
    const result = this.buildFetchWithJwtSupport(method, {
      id,
      path,
      body,
      query,
    });

    if (this.parseJson) {
      const response = await result;
      return RestfulClient.json(response);
    }

    return result;
  }

  abort() {
    if (this.controller) {
      this.controller.abort();
    }
  }

  // usersApi.index()
  // Call a GET on https://myapp.com/api/users
  index(query?: RestfulBody) {
    if (query) {
      return this.request('GET', { body: query });
    }

    return this.request('GET');
  }

  // usersApi.get({ id: 1 })
  // Call a GET on https://myapp.com/api/users/1
  get({ id = 0, query }: RestfulRequestMeta = {}) {
    return this.request('GET', { id, body: query });
  }

  // usersApi.create({ name: 'zedtux' })
  // Send a POST to https://myapp.com/api/users
  create(body: RestfulBody, query?: RestfulBody, id?: RestfulValueRaw) {
    return this.request('POST', { id, body, query });
  }

  // usersApi.modify(2, { name: 'john' })
  // Send a PATCH to https://myapp.com/api/users/2
  modify(id?: RestfulValueRaw, body?: RestfulBody, query?: RestfulBody) {
    return this.request('PATCH', { id, body, query });
  }

  // usersApi.update(2, { name: 'john' })
  // Send a PUT to https://myapp.com/api/users/2
  update(id?: RestfulValueRaw, body?: RestfulBody, query?: RestfulBody) {
    return this.request('PUT', { id, body, query });
  }

  // usersApi.destroy(2)
  // Send a DELETE to https://myapp.com/api/users/2
  destroy(id?: RestfulValueRaw, body?: RestfulBody, query?: RestfulBody) {
    return this.request('DELETE', { id, body, query });
  }
}

// 处理接口返回 JSON response.json()
const onFetchJson = (response: Response) => {
  return response.json();
};

// 处理接口返回 text 格式的JSON
const onFetchTextJson = async (response: Response) => {
  const text = await response.text();

  return JSON.parse(text);
};

export { RestfulClient, JWT_TOKEN_ID, JWT_RENEW_PATH_ID, onFetchJson, onFetchTextJson };
