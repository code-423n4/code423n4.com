import React from "react";
import { navigate } from "@reach/router";
import { useMoralis } from "react-moralis";

export default function PrivateRoute({
  component: Component,
  location,
  ...rest
}) {
  const { isAuthenticated } = useMoralis();
  if (!isAuthenticated && location.pathname !== "/") {
    navigate("/");
    return null;
  }
  return <Component {...rest} />;
}
