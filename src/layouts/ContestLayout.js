import React, { useState } from "react";
import { graphql } from "gatsby";
import DefaultLayout from "./DefaultLayout";
import ReactMarkdown from "react-markdown";

const ContestLayout = (props) => {
  const [artOpen, setArtOpen] = useState(false);
  let artClass = artOpen ? "open" : null;
  const { title, sponsor, details, fields } = props.data.contestsCsv;
  const artURL = "http://placeimg.com/1200/675/arch/grayscale";
  return (
    <DefaultLayout pageTitle={title} bodyClass="contests-page">
      <article className="wrapper-main">
        <div
          style={{ backgroundImage: `url(${artURL})` }}
          onClick={() => setArtOpen((isOpen) => !isOpen)}
          className={`${artClass} contest-artwork`}
          aria-label={`${title} artwork. Expands on click.`}
        />
        <section className="top-section">
          <div className="sponsor-image">
            <a href={sponsor.link}>
              <img
                src={sponsor.image.childImageSharp.resize.src}
                alt={sponsor.name}
              />
            </a>
          </div>
          <h1 className="header-live">{title}</h1>
          <p>{details}</p>
          <div class="button-wrapper">
            <a
              href={fields.submissionPath}
              className="button button-small primary"
            >
              Submit Finding
            </a>
          </div>
        </section>
        <section>
          <ReactMarkdown children={fields.readmeContent} />
        </section>
      </article>
    </DefaultLayout>
  );
};

export default ContestLayout;

export const pageQuery = graphql`
  query ContestsId($contestId: Int) {
    contestsCsv(contestid: { eq: $contestId }) {
      amount
      contestid
      details
      end_time
      fields {
        submissionPath
        readmeContent
      }
      hide
      league
      repo
      start_time
      sponsor {
        name
        image {
          childImageSharp {
            resize(width: 160) {
              src
            }
          }
        }
        link
      }
      title
    }
  }
`;
