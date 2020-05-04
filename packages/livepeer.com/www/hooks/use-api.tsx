import { useState, useContext, createContext, useEffect } from "react";
import fetch from "isomorphic-fetch";
import jwt from "jsonwebtoken";
import { User, Error as ApiError, ApiToken, Stream } from "@livepeer/api";
import qs from "qs";

/**
 * Primary React API client. Definitely a "first pass". Should be replaced with some
 * helpers around a nice auto-generated TypeScript client from our Swagger schema.
 */

type ApiState = {
  user?: User;
  token?: string;
  userRefresh?: number;
};

const PERSISTENT_TOKEN = "PERSISTENT_TOKEN";
const storeToken = token => {
  try {
    localStorage.setItem(PERSISTENT_TOKEN, token);
  } catch (err) {
    console.error(`
      Error storing persistent token: ${err.message}. Usually this means that you're in a
      Safari private window and you don't want the token to persist anyway.
    `);
  }
};

const getStoredToken = () => {
  try {
    return localStorage.getItem(PERSISTENT_TOKEN);
  } catch (err) {
    console.error(`Error retrieving persistent token: ${err.message}.`);
    return null;
  }
};

const clearToken = () => {
  try {
    localStorage.removeItem(PERSISTENT_TOKEN);
  } catch (err) {
    console.error(`Error clearing persistent token: ${err.message}.`);
  }
};

const makeContext = (state: ApiState, setState) => {
  const context = {
    ...state,
    async fetch(url, opts: RequestInit = {}) {
      let headers = new Headers(opts.headers || {});
      if (state.token && !headers.has("authorization")) {
        headers.set("authorization", `JWT ${state.token}`);
      }
      const res = await fetch(`/api${url}`, {
        ...opts,
        headers
      });
      if (res.status === 204) {
        return [res];
      }
      // todo: not every endpoint will return JSON
      const body = await res.json();
      // todo: this can go away once we standardize on body.errors
      if (!Array.isArray(body.errors) && typeof body.error === "string") {
        body.errors = [body.error];
      }
      return [res, body];
    },

    async login(email, password) {
      const [res, body] = await context.fetch("/user/token", {
        method: "POST",
        body: JSON.stringify({ email, password }),
        headers: {
          "content-type": "application/json"
        }
      });
      if (res.status !== 201) {
        return body;
      }
      const { token } = body;
      storeToken(token);
      setState(state => ({ ...state, token }));
      return res;
    },

    async register(email, password) {
      const [res, body] = await context.fetch("/user", {
        method: "POST",
        body: JSON.stringify({ email, password }),
        headers: {
          "content-type": "application/json"
        }
      });
      if (res.status !== 201) {
        return body;
      }
      return context.login(email, password);
    },

    async verify(email, emailValidToken) {
      const res = await context.fetch("/user/verify", {
        method: "POST",
        body: JSON.stringify({ email, emailValidToken }),
        headers: {
          "content-type": "application/json"
        }
      });
      setState({ ...state, userRefresh: Date.now() });
    },

    async makePasswordResetToken(email) {
      const [res, body] = await context.fetch("/user/password/reset-token", {
        method: "POST",
        body: JSON.stringify({ email }),
        headers: {
          "content-type": "application/json"
        }
      });
      return body;
    },

    async resetPassword(email, resetToken, password) {
      const [res, body] = await context.fetch("/user/password/reset", {
        method: "POST",
        body: JSON.stringify({ email, resetToken, password }),
        headers: {
          "content-type": "application/json"
        }
      });
      if (res.status !== 201) {
        return body;
      }
      return context.login(email, password);
    },

    async getUser(userId, opts = {}): Promise<[Response, User | ApiError]> {
      const [res, user] = await context.fetch(`/user/${userId}`, opts);
      return [res, user as User | ApiError];
    },

    async getUsers(opts = {}): Promise<[Response, User | ApiError]> {
      let [res, users] = await context.fetch(`/user`, opts);
      users = users.map(o => o[Object.keys(o)[0]]);

      if (res.status !== 201) {
        return users;
      }
      return res;
    },

    async makeUserAdmin(
      email,
      opts = {}
    ): Promise<[Response, User | ApiError]> {
      const [res, body] = await context.fetch("/user/make-admin", {
        method: "POST",
        body: JSON.stringify({ email }),
        headers: {
          "content-type": "application/json"
        }
      });

      if (res.status !== 201) {
        return body;
      }

      return res;
    },

    async logout() {
      setState(state => ({ ...state, user: null, token: null }));
      clearToken();
    },

    async getStreams(userId): Promise<Array<Stream>> {
      const [res, streams] = await context.fetch(`/stream/user/${userId}`);
      if (res.status !== 200) {
        throw new Error(streams);
      }
      return streams.sort((a, b) => (b.lastSeen||0) - (a.lastSeen||0));
    },

    async getApiTokens(userId): Promise<[ApiToken]> {
      const [res, tokens] = await context.fetch(
        `/api-token?${qs.stringify({ userId })}`
      );
      if (res.status !== 200) {
        throw new Error(tokens);
      }
      return tokens;
    },

    async createApiToken(params): Promise<ApiToken> {
      const [res, token] = await context.fetch(`/api-token`, {
        method: "POST",
        body: JSON.stringify(params),
        headers: {
          "content-type": "application/json"
        }
      });
      if (res.status !== 201) {
        throw new Error(JSON.stringify(res.errors));
      }
      return token;
    },

    async deleteApiToken(id: string): Promise<void> {
      const [res, body] = await context.fetch(`/api-token/${id}`, {
        method: "DELETE"
      });
      if (res.status !== 204) {
        throw new Error(body);
      }
    }
  };
  return context;
};

export const ApiContext = createContext(makeContext({} as ApiState, () => {}));

export const ApiProvider = ({ children }) => {
  const [state, setState] = useState<ApiState>({
    token: getStoredToken()
  });

  const context = makeContext(state, setState);

  // If our token changes, auto-refresh our current user
  useEffect(() => {
    if (state.token) {
      const data = jwt.decode(state.token);
      context.getUser(data.sub).then(([res, user]) => {
        if (res.status !== 200) {
          clearToken();
          setState(state => ({ ...state, token: null }));
        } else {
          setState(state => ({ ...state, user: user as User }));
        }
      });
    }
  }, [state.token, state.userRefresh]);

  return <ApiContext.Provider value={context}>{children}</ApiContext.Provider>;
};

export default function useApi() {
  return useContext(ApiContext);
}
