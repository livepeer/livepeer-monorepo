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
    if (shouldBeLoggedIn === true && !token) {
      router.replace("/login");
    }
    // Check for user rather than token so we don't redirect until we've checked
    if (shouldBeLoggedIn === false && user) {
      router.replace("/app/user");
    }
  }, [user, token]);
};
