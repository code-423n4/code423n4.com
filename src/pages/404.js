import React, { useEffect } from "react";
import DefaultLayout from "../templates/DefaultLayout";
import { navigate } from "gatsby";

export default function ErrorPage() {
  useEffect(() => {
    setTimeout(() => {
      navigate("/", { replace: true });
    }, 3000);
  }, []);

  return (
    <DefaultLayout bodyClass="four-oh-four-page" key={"404 page"}>
      <section className="limited-width">
        <h1>Page not found 🐺</h1>
        <div className="four-oh-four-page__image">
          <img
            src="/images/c4-404-meme.png"
            alt="404 meme"
            className="placeholder"
          />
        </div>
      </section>
    </DefaultLayout>
  );
}
