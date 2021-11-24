import React, { useCallback, useState, useRef } from "react";
import { graphql } from "gatsby";
import clsx from "clsx";
import HCaptcha from "@hcaptcha/react-hcaptcha";
import DefaultLayout from "../layouts/DefaultLayout";
import * as styles from "../components/reporter/Form.module.scss";
import * as widgetStyles from "../components/reporter/widgets/Widgets.module.scss";
import { Widgets } from "../components/reporter/widgets";

export default function JudgeApplication() {
  const [state, setState] = useState({
    handle: "",
    title: "",
  });
  const url = `/.netlify/functions/apply-for-judge`;
  const formData = {
    handle: state.handle,
    title: state.title,
  };
  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setState((state) => {
      return { ...state, [name]: value };
    });
  }, []);
  const applyForJudge = () => {
    (async () => {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      if (response.ok) {
        console.log("yep");
      } else {
        console.log("nope");
        try {
          const res = await response.json();
          if (res.error) {
            console.log("not this either");
          }
        } catch (err) {
          console.log("super no");
        }
      }
    })();
  };
  return (
    <DefaultLayout pageTitle="Judge Application | Code 423n4">
      <div className="wrapper-main">
        <h1 className="page-header">Judge Application</h1>
        <form>
          <input type="text" name="handle" onChange={handleChange}></input>
          <input type="text" name="title" onChange={handleChange}></input>
          <button type="button" onClick={applyForJudge}>
            sdiufhisuh
          </button>
        </form>
      </div>
    </DefaultLayout>
  );
}
