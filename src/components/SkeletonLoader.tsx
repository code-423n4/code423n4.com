import React, { ReactNode } from "react";

interface SkeletonProps {
  layout?: string;
}

export default function SkeletonLoader({ layout }: SkeletonProps): JSX.Element {
  return (
    <div className={"skeleton-loader" + (layout ? layout : "")}>
      <div>
        <div></div>
        <div></div>
      </div>
    </div>
  );
}
