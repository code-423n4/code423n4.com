import React from "react";
import { Tweet } from "react-twitter-widgets";

const TweetEmbed = ({ tweetId }) => {
    return <Tweet tweetId={tweetId} options={{ theme: "dark" }} />;
};

export default TweetEmbed;
