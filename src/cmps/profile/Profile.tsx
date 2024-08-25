import React from "react";
import { useParams } from "react-router-dom";

export default function Profile() {
  const { username } = useParams();

  return <div>username logged in {username}</div>;
}
