import React, { useEffect } from "react";
import { Tweet } from "react-twitter-widgets";
import * as styles from "./TweetEmbed.module.scss";

const TweetPlaceholder = () => {
    return (
        <div className={styles.container}>
            <div className={styles.content}>
                <span
                    className={styles.skeleton}
                    style={{ height: "2.25rem" }}
                ></span>
                <span
                    className={styles.skeleton}
                    style={{ height: "7rem", margin: "1.25rem 0" }}
                ></span>
                <span
                    className={styles.skeleton}
                    style={{ height: "1.25rem" }}
                ></span>
            </div>
            <div className={styles.footer}>
                <span
                    className={styles.skeleton}
                    style={{ height: "1.25rem" }}
                ></span>
            </div>
        </div>
    );
};

const TweetEmbed = ({ tweetId }) => {
    const [isInClient, setIsInClient] = React.useState(false);

    useEffect(() => {
        setIsInClient(true);
    }, []);

    return isInClient ? <Tweet tweetId={tweetId} options={{ theme: "dark" }} /> : <TweetPlaceholder />;
};

export default TweetEmbed;
