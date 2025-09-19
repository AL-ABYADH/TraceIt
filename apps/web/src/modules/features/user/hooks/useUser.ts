// Example hook for user data
import { useEffect, useState } from "react";

export function useUser() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  //   useEffect(() => {
  //     fetchUser()
  //       .then(setUser)
  //       .catch(setError)
  //       .finally(() => setLoading(false));
  //   }, []);

  return { user, loading, error };
}
