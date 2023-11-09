import React, { ReactNode } from "react";
import { Link } from "gatsby";

// -----------------
// 🍔's first typescript component, please scrutinize
// -----------------

interface BottomCTAProps {
  viewMode?: string;
}

export default function BottomCTA({ viewMode }: BottomCTAProps): JSX.Element {
  return (
    <>
      {!viewMode ||
        (viewMode === "warden" && (
          <div className="bottom-cta">
            <div className="bottom-cta__content limited-width">
              <h1 className="type__headline__m bottom-cta__title">
                Are you ready?
              </h1>
              <h2 className="type__headline__xs bottom-cta__subtitle">
                Secure the crypto ecosystem and get paid.
              </h2>
              <a
                href="https://discord.gg/code4rena"
                className="button button--primary"
                target="_blank"
                rel="noreferrer"
                aria-label={"Get started (Opens in a new window)"}
              >
                Get started
              </a>
            </div>
          </div>
        ))}
      {viewMode === "project" && (
        <div className="bottom-cta">
          <div className="bottom-cta__content limited-width">
            <h1 className="type__headline__m bottom-cta__title">
              Are you ready?
            </h1>
            <h2 className="type__headline__xs bottom-cta__subtitle">
              The best time to secure your project is now.
            </h2>
            <a
              href="https://code4rena.typeform.com/i-want-an-audit"
              className="button button--primary"
              target="_blank"
              rel="noreferrer"
              aria-label={"Get started (Opens in a new window)"}
            >
              Get Started
            </a>
          </div>
        </div>
      )}
    </>
  );
}
