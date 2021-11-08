import React, { useState } from "react";
import { graphql } from "gatsby";
import DefaultLayout from "./DefaultLayout";
import ReactMarkdown from "react-markdown";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import Countdown from "../components/Countdown";
import { getDates } from "../utils/time";

const ContestLayout = (props) => {
  const [artOpen, setArtOpen] = useState(false);
  let artClass = artOpen ? "open" : null;
  const {
    title,
    sponsor,
    details,
    fields,
    amount,
    repo,
    findingsRepo,
    start_time,
    end_time,
  } = props.data.contestsCsv;
  const artURL = "http://placeimg.com/1200/675/arch/grayscale";
  const t = getDates(start_time, end_time);
  return (
    <DefaultLayout pageTitle={title} bodyClass="contest-page">
      <>
        <div class="contest-wrapper contest-artwork-wrapper">
          <Countdown
            state={t.state}
            start={start_time}
            end={end_time}
            isPreview={findingsRepo === ""}
          />
          <div
            // style={{ backgroundImage: `url(${artURL})` }}
            onClick={() => setArtOpen((isOpen) => !isOpen)}
            className={`${artClass} contest-artwork background-pattern`}
            aria-label={`${title} artwork. Expands on click.`}
          />
        </div>
        <section className="top-section contest-wrapper">
          <div className="sponsor-image">
            <a href={sponsor.link}>
              <img
                src={sponsor.image.childImageSharp.resize.src}
                alt={sponsor.name}
                width="90px"
                height="90px"
              />
            </a>
          </div>
          <div class="top-section-text">
            <h1 className="header-live">{title}</h1>
            <p>{details}</p>
            <div class="button-wrapper">
              <a
                href={fields.submissionPath}
                className="button cta-button button-medium primary"
              >
                Submit Finding
              </a>
              <a
                href={repo}
                className="button cta-button button-medium secondary"
              >
                View Contest Repo
              </a>
            </div>
          </div>
          <div className="top-section-amount">
            <p>{amount}</p>
            <p>Total Awards</p>
          </div>
        </section>
        <section>
          <Tabs className="contest-tabs">
            <TabList>
              <Tab>Details</Tab>
              <Tab>FAQ</Tab>
            </TabList>

            <TabPanel>
              <div className="contest-wrapper">
                <ReactMarkdown children={fields.readmeContent} />
              </div>
            </TabPanel>
            <TabPanel>
              <div className="contest-wrapper">
                <h2>FAQ</h2>
                <p>
                  <strong>
                    Corvids love to play pranks on humans and other animals?
                  </strong>
                  Corvids use their intelligence and ability to mimic sounds for
                  their own personal amusement. One zookeeper noted the magpies
                  would mimic the voice of the employee responsible for feeding
                  the chickens. The chickens would come running, but there would
                  be no food. The magpies would do this again and again to the
                  chickens, who never got wise to the prank.
                </p>
              </div>
            </TabPanel>
          </Tabs>
        </section>
      </>
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
