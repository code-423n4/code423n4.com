import React from "react";

interface SkeletonProps {
  layout?: string;
  limitedWidth?: boolean;
}

export default function SkeletonLoader({
  layout,
  limitedWidth,
}: SkeletonProps): JSX.Element {
  return (
    <div className={"skeleton-loader " + (layout ? layout : "")}>
      <div className={limitedWidth ? "limited-width" : ""}>
        <div></div>
        <div></div>
      </div>
    </div>
  );
}
