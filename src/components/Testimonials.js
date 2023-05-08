import React from "react";
// import Swiper core and required modules
import { Navigation, Pagination, Scrollbar, A11y } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css/bundle";

// object with quotes, has quote, author, author title, author link, viewMode

const testimonials = [
  {
    quote:
      "One of the things I enjoy most about competing on @code4rena is getting to read lots of code and see new techniques in the wild.",
    author: "Horsefacts",
    authorTitle: "",
    authorLink: "https://twitter.com/eth_call/status/1621940992411574284",
    viewMode: "warden",
  },
  {
    quote:
      "We greatly enjoyed our @code4rena experience - here's why it is the best value in auditing: quick spin-up time, flexible bounty awards, open nature means more eyes on your code, by our count ~10x more vs traditional audit shops, helpful community of wardens and judges",
    author: "@_benjaminhughes",
    authorTitle: "",
    authorLink:
      "https://twitter.com/_benjaminhughes/status/1554527455087558658?s=20&t=SxGE6sz2wxxChjUfrCW3dQ",
    viewMode: "sponsor",
  },
  {
    quote:
      "After grinding for 14 months I finally reached my goal of being the first to cross 1M$ on the @code4rena leaderboard. Thanks to everyone involved, this has been very fun, lucrative, and I learned a lot by seeing other wardens' vulnerabilities that I missed.",
    author: "Cmichel",
    authorTitle: "",
    authorLink: "https://twitter.com/cmichelio/status/1521241247159140355",
    viewMode: "warden",
  },
  {
    quote:
      "Just went through the latest @code4rena audit report of the @blur_io exchange. This report is a great example of why audits are so important - wardens were able to discover a high risk exploit that would've allowed sellers to steal funds from buyers.",
    author: "cygaar",
    authorTitle: "",
    authorLink: "https://twitter.com/0xCygaar/status/1601065454771924992",
    viewMode: "warden",
  },
  {
    quote:
      "These @code4rena payouts are ridiculous. I'm tempted to drop everything and tunnel vision that",
    author: "@DeGatchi",
    authorTitle: "",
    authorLink: "https://twitter.com/DeGatchi/status/1624020967281557504",
    viewMode: "warden",
  },
  {
    quote: "C4 wardens > any single audit shop IMO",
    author: "@_benjaminhughes",
    authorTitle: "",
    authorLink: "https://twitter.com/_benjaminhughes",
    viewMode: "sponsor",
  },
  {
    quote:
      "Thank you to all of the wardens who have been working on our code base. So many great questions and so many many of them. I hope you'll all come try it out when we're live and critique the user experience from top to bottom. 10/10 would work with y'all again.",
    author: "androolloyd",
    authorTitle: "",
    authorLink: "",
    viewMode: "sponsor",
  },
];

const breakpoints = {
  750: {
    slidesPerView: 2,
    spaceBetween: 16,
  },
  1024: {
    slidesPerView: 2.5,
    spaceBetween: 32,
  },
};

const Testimonials = ({ viewMode }) => (
  <div className="testimonials">
    <h2 className="type__headline__l">Don't just take our word for it.</h2>
    {/* Warden View */}
    {/* {!viewMode ||
      (viewMode === "warden" && ( */}
    <>
      <div className="swiper-holder">
        <Swiper
          modules={[Navigation, Pagination, Scrollbar, A11y]}
          spaceBetween={32}
          slidesPerView={1}
          navigation
          pagination={{ clickable: true }}
          scrollbar={{ draggable: true }}
          breakpoints={breakpoints}
        >
          {testimonials.map((testimonial, index) => (
            <SwiperSlide key={index}>
              <blockquote className="testimonials__quote">
                <p className="testimonials__quote-text">{testimonial.quote}</p>
                <p className="testimonials__author-text">
                  <strong>
                    —
                    {testimonial.authorLink ? (
                      <a
                        href={testimonial.authorLink}
                        target="_blank"
                        rel="noreferrer"
                      >
                        {testimonial.author}
                      </a>
                    ) : (
                      testimonial.author
                    )}
                  </strong>
                  {/* <em>{testimonial.authorTitle}</em> */}
                </p>
              </blockquote>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </>
    {/* ))} */}

    {/* Sponsor View */}
    {/* {viewMode && viewMode === "sponsor" && (
      <>
        <div className="testimonials__quotes">
          <blockquote className="testimonials__quote">
            <p className="type__body__m">
              “We were able to find and fix a critical vulnerability in our
              application before it was exploited by an attacker.”
            </p>
            <p className="type__body__m">
              <strong>— John Doe</strong>
              <br />
              <em>CEO, Company Name</em>
            </p>
          </blockquote>
        </div>
      </>
    )} */}
  </div>
);

export default Testimonials;
