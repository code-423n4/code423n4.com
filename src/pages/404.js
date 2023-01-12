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
    <DefaultLayout bodyClass="landing" key={"404 page"}>
      <div className="container-404">
        <h1>Page not found 🐺</h1>
        <img
          src="/images/c4-404-meme.png"
          alt="404 meme"
          className="placeholder"
        />
      </div>
    </DefaultLayout>
  );
}
