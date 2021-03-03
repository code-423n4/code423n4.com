import React from "react";
import DefaultLayout from "../layouts/DefaultLayout";
import Nav from "../components/Nav";
import Footer from "../components/Footer";
import Countdown from "../components/Countdown";

class SiteIndex extends React.Component {
  render() {
    // const { data } = this.props;
    // const races = data.races.edges;

    return (
      <DefaultLayout title="Code 423n4" bodyClass="landing">
        <header>
          <Nav />
          <div className="hero">
            <h1>
              <span>Hack DeFi.</span> <span>Compete.</span>{" "}
              <span>Get paid.</span>
            </h1>
            <h5>
              We’re creating a community-driven approach to competitive smart
              contract audits. Join our open organization.
            </h5>
          </div>
        </header>
        <div className="wrapper-main">
          <section>
            <div className="definitions">
              <div>
                <h3>Wardens</h3>
                <p>
                  Hunt exploits in the smart contracts of decentralized
                  protocols.
                </p>
              </div>
              <div>
                <h3>Sponsors</h3>
                <p>
                  Create bounty pools to attract wardens to audit your project.
                </p>
              </div>
              <div>
                <h3>Judges</h3>
                <p>Allocate bounty pools to wardens based on performance.</p>
              </div>
            </div>
            <div className="active-contests">
              <div className="wrapper-sponsor">
                <img src="/images/elasticdao.png" alt="ElasticDAO" />
              </div>
              <div className="wrapper-contest-content">
                <h4>
                  <a href="https://twitter.com/ElasticDAO">Elastic DAO</a>{" "}
                  contest
                </h4>
                <Countdown deadline="March 3 2021 23:59:59 UTC" />
                <p>
                  Read the
                  <a href="https://medium.com/@scott_lew_is/elasticdao-protocol-sponsors-22-eth-bounty-pool-for-code-432n4s-second-contest-fd5e35879d8e">
                    {" "}
                    announcement here
                  </a>
                  . To get involved in future contests,{" "}
                  <a href="https://discord.gg/EY5dvm3evD">
                    join our Discord server
                  </a>
                  .
                </p>
              </div>
            </div>
          </section>
          <section>
            <h5>Want to learn more?</h5>
            <div className="button-wrapper">
              <a
                className="button cta-button"
                href="https://medium.com/@scott_lew_is/introducing-code-432n4-f4a12d92a35d"
              >
                <strong>Read the intro post</strong>
              </a>
            </div>
          </section>
        </div>
        <Footer />
      </DefaultLayout>
    );
  }
}

export default SiteIndex;
