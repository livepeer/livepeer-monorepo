import { useState, useContext, createContext } from "react";
import fetch from "isomorphic-fetch";
import jwt from "jsonwebtoken";

export const ApiContext = createContext();

export const ApiProvider = ({ children }) => {
  const [state, setState] = useState({ foo: "bar" });

  const context = {
    ...state,

    async fetch(url, opts = {}) {
      let headers = opts.headers || {};
      if (state.token && !headers.authorization) {
        headers.authorization = `JWT ${state.token}`;
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
      const data = jwt.decode(token);
      const userId = data.sub;
      const [userRes, user] = await context.getUser(userId, {
        headers: {
          authorization: `JWT ${token}`
        }
      });
      if (userRes.status !== 200) {
        return body;
      }
      setState({ ...state, token, user });
      return body;
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
      return await context.fetch("/user/verify", {
        method: "POST",
        body: JSON.stringify({ email, emailValidToken }),
        headers: {
          "content-type": "application/json"
        }
      });
    },

    async getUser(userId, opts = {}) {
      return await context.fetch(`/user/${userId}`, opts);
    },

    async logout() {
      setState({ ...state, user: null, token: null });
    }
  };

  return <ApiContext.Provider value={context}>{children}</ApiContext.Provider>;
};

export default function useApi() {
  return useContext(ApiContext);
}
