import React, { useEffect } from "react";
import DefaultLayout from "../templates/DefaultLayout";
import { navigate } from "gatsby"

export default function ErrorPage() {
  useEffect(() => {
    setTimeout(() => {
      navigate("/", { replace: true });
    }, 4000)
  }, []);

  return (
    <DefaultLayout bodyClass="landing" key={"404 page"}>
      <div className="container-404">
        <h1>Page not found 🐺</h1>
        <p>
          It seems that something is wrong. If you feel like this page should
          exist, please reach out to the team.
        </p>
        <img src="/images/404.jpg" alt="Code 423n4" className="placeholder" />
      </div>
    </DefaultLayout>
  );
}