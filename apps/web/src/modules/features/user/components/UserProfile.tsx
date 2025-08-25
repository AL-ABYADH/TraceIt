import React from "react";
import { useUser } from "../hooks/useUser";

export function UserProfile() {
  const { user, loading, error } = useUser();

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error loading user.</div>;
  if (!user) return <div>No user data.</div>;

  return (
    <div>
      <h2>User Profile</h2>
      {/* <p>Name: {user.name}</p>
      <p>Email: {user.email}</p> */}
    </div>
  );
}
