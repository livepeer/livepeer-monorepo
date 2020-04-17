import useApi from "./use-api";
import { useEffect } from "react";
import { useRouter } from "next/router";

/**
 * Verifies that the user is logged in. Redirects to /login if not. Pass
 * `false` to verify that the user is _not_ logged in.
 */
export default (shouldBeLoggedIn = true) => {
  const { user, token } = useApi();
  const router = useRouter();

  useEffect(() => {
    if (shouldBeLoggedIn === true) {
      if (!token) {
        router.replace("/login");
      } else if (user && user.emailValid === false) {
        router.replace("/app/user/verify");
      }
    }
    // Check for user rather than token so we don't redirect until we've checked
    if (shouldBeLoggedIn === false && user) {
      if (user.emailValid === false) {
        router.replace("/app/user/verify");
      } else {
        router.replace("/app/user");
      }
    }
  }, [user, token]);
};
