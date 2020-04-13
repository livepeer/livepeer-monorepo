import { useState, useContext, createContext, useEffect } from "react";
import fetch from "isomorphic-fetch";
import jwt from "jsonwebtoken";
import { User, Error as ApiError } from "@livepeer/api";

type ApiState = {
  user?: User;
  token?: string;
};

const makeContext = (state: ApiState, setState) => {
  const context = {
    ...state,
    async fetch(url, opts: RequestInit = {}) {
      let headers = new Headers(opts.headers || {});
      if (state.token && !headers.has("authorization")) {
        headers.set("authorization", `JWT ${state.token}`);
      }
      const res = await fetch(`/api/${url}`, {
        ...opts,
        headers
      });
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

    async getUser(userId, opts = {}): Promise<[Response, User | ApiError]> {
      const [res, user] = await context.fetch(`/user/${userId}`, opts);
      return [res, user as User | ApiError];
    },

    async logout() {
      setState(state => ({ ...state, user: null, token: null }));
    }
  };
  return context;
};

export const ApiContext = createContext(makeContext({} as ApiState, () => {}));

export const ApiProvider = ({ children }) => {
  const [state, setState] = useState<ApiState>({});

  const context = makeContext(state, setState);

  // If our token changes, auto-refresh our current user
  useEffect(() => {
    if (state.token) {
      const data = jwt.decode(state.token);
      context.getUser(data.sub).then(([res, user]) => {
        if (res.status !== 200) {
          setState(state => ({ ...state, token: null }));
        } else {
          setState(state => ({ ...state, user: user as User }));
        }
      });
    }
  }, [state.token]);

  return <ApiContext.Provider value={context}>{children}</ApiContext.Provider>;
};

export default function useApi() {
  return useContext(ApiContext);
}
