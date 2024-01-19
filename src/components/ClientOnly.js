import React, { useState, useEffect } from "react";

const ClientOnly = ({ children }) => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => setIsClient(true), []);

  return <React.Fragment key={isClient}>{children}</React.Fragment>;
};

export default ClientOnly;
