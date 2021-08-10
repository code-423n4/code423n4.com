import React from "react";
import TweetEmbed from "../components/TweetEmbed";


const Testimonials = () => (
  <>
    <h5 className="center testimonials-header">The crowd goes wild</h5>
    <div className="testimonials">
      <figure>
        <blockquote>
          <p>
            This result far exceeded previous experiences I’ve had with 2–4
            week-long audits by individual companies. I highly recommend the
            Code 423n4 competitive audit approach for anyone starting a new
            project.
          </p>
        </blockquote>
        <figcaption>
          LSDan <cite>ElasticDAO</cite>
        </figcaption>
      </figure>
      <TweetEmbed tweetId="1400466820759375876" />
      <TweetEmbed tweetId="1382498579118313473" />
      <figure>
        <blockquote>
          <p>
            Overall, I have to say you guys have some very smart folks and some
            of the findings identified are quite good! Definitely a much better
            experience than the traditional audit we had gone through.
          </p>
        </blockquote>
        <figcaption>
          Jason<cite>Fairside</cite>
        </figcaption>
      </figure>
      <TweetEmbed tweetId="1407460200316088321" />
      <TweetEmbed tweetId="1400746871719710728" noConversation />
      <TweetEmbed tweetId="1400747819259023360" noCards />
      <figure>
        <blockquote>
          <p>
            C4 contests attract new, unique and complicated projects so it is a perfect learning opportunity... Here projects seriously invest in their security so it is always a motivation to try my best to find bugs in their code.
          </p>
        </blockquote>
        <figcaption>
          Pauliax/Thunder<cite>C4 Warden</cite>
        </figcaption>
      </figure>
      <figure>
        <blockquote>
          <p>
            Want to give a massive shout out to all the wardens that took part
            in the Reality Cards contest last week- you guys found some really
            amazing stuff- so good that we're considering doing a second round!
            🤣thanks so much guys!
          </p>
        </blockquote>
        <figcaption>
          Andrew<cite>Reality Cards</cite>
        </figcaption>
      </figure>
    </div>
  </>
);

export default Testimonials;
