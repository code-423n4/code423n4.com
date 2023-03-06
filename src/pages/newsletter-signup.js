import React from "react";
import DefaultLayout from "../templates/DefaultLayout";
import Helmet from "react-helmet";
import * as styles from "../styles/Main.module.scss";

export default function NewsletterSignup({ data, location }) {
  return (
    <DefaultLayout
      pageDescription="Our newsletter is a great way to stay up to date on the latest news from the Code4rena community."
      pageTitle="Newsletter"
      bodyClass="newsletter-signup"
    >
      <Helmet>
        <script type="text/javascript">
          {`{
        window.ap3c = window.ap3c || {};    
        var ap3c = window.ap3c;    
        ap3c.cmd = ap3c.cmd || [];    
        ap3c.cmd.push(function() {        
          ap3c.init('Y4TnnizICO8rg_6aY29kZTRyZW5h', 'https://capture-api.autopilotapp.com/');        
          ap3c.track({v: 0});    
          });    
          ap3c.activity = function(act) { 
            ap3c.act = (ap3c.act || []); 
            ap3c.act.push(act); 
          };    
          var s, t; s = document.createElement('script'); 
          s.type = 'text/javascript'; s.src = "https://cdn3l.ink/app.js";    t = document.getElementsByTagName('script')[0]; t.parentNode.insertBefore(s, t); 
          }`}
        </script>
      </Helmet>
      <div
        id="63d9bc64372e7aca6cfb8b75"
        className={styles.Form__Form + " newsletter-form limited-width"}
      >
        <div
          id="63d9bc64372e7aca6cfb8b75-form"
          className="63d9bc64372e7aca6cfb8b75-template"
        >
          <div
            id="selected-_1hh03zgji"
            className=" ap3w-embeddable-form-63d9bc64372e7aca6cfb8b75 ap3w-embeddable-form-63d9bc64372e7aca6cfb8b75-full ap3w-embeddable-form-63d9bc64372e7aca6cfb8b75-solid "
            data-select="true"
          >
            <form
              id="ap3w-embeddable-form-63d9bc64372e7aca6cfb8b75"
              className="ap3w-embeddable-form-content"
            >
              <div className="ap3-form-br"></div>
              <div
                id="selected-_wdgfwyv2i"
                className="ap3w-text ap3w-text-63d9bc64372e7aca6cfb8b75 ap3w-text--first "
              >
                <div data-select="true">
                  <h1>Subscribe to our newsletter</h1>
                </div>
              </div>
              <div className="ap3-form-br"></div>
              <div
                id="selected-_5iurqd192"
                className={
                  styles.Widget__Container +
                  " ap3w-form-input ap3w-form-input-63d9bc64372e7aca6cfb8b75"
                }
                data-select="true"
                data-field-id="str::email"
                data-merge-strategy="override"
              >
                <label
                  htmlFor="ap3w-form-input-email-63d9bc64372e7aca6cfb8b75"
                  className={styles.Widget__Label + " ap3w-form-input-label"}
                >
                  Email address*
                </label>
                <input
                  type="email"
                  id="ap3w-form-input-email-63d9bc64372e7aca6cfb8b75"
                  step="1"
                  name="email"
                  required=""
                  className={styles.Input__Control + " " + styles.Input__Text}
                />
              </div>
              <div className="ap3-form-br"></div>
              <div
                id="selected-_6rgrtrhd5"
                className=" ap3w-form-button ap3w-form-button-63d9bc64372e7aca6cfb8b75 "
              >
                <button
                  id="ap3w-form-button-63d9bc64372e7aca6cfb8b75"
                  type="submit"
                  data-select="true"
                  data-button-on-click="thank-you"
                  className="button cta-button centered"
                >
                  Subscribe
                </button>
              </div>
            </form>
          </div>
        </div>
        <div
          id="63d9bc64372e7aca6cfb8b75-thank-you"
          className="63d9bc64372e7aca6cfb8b75-template"
          style={{
            display: "none",
            height: "100%",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div
            id="selected-_6y941o8vu"
            className=" ap3w-embeddable-form-63d9bc64372e7aca6cfb8b75 ap3w-embeddable-form-63d9bc64372e7aca6cfb8b75-full ap3w-embeddable-form-63d9bc64372e7aca6cfb8b75-solid "
            data-select="true"
          >
            <form
              id="ap3w-embeddable-form-63d9bc64372e7aca6cfb8b75"
              className="ap3w-embeddable-form-content"
            >
              <div className="ap3-form-br"></div>
              <div
                id="selected-_qlu4tl9lg"
                className="ap3w-text ap3w-text-63d9bc64372e7aca6cfb8b75 ap3w-text--first ap3w-text--last"
              >
                <div data-select="true">
                  <h2>Thank you!</h2>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </DefaultLayout>
  );
}
