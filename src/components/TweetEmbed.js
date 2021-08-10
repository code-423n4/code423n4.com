import React from "react";
import { Tweet } from "react-twitter-widgets";

const TweetEmbed = ({ tweetId, noConversation, noCards }) => {
    return <Tweet tweetId={tweetId} options={{ 
        theme: 'dark', 
        conversation: noConversation ? 'none' : undefined, 
        cards: noCards ? 'none' : undefined
    }} />;
};

export default TweetEmbed;
