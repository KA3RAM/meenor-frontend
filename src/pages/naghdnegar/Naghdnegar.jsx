import { useState } from "react";
import styles from "./Naghdnegar.module.css"
import Art from "../../assets/images/Arthur.jpg"
import sample1 from "../../assets/images/mobile_samples/sample2.jpeg"

/* ---------------------------------- SVG COMPONENTS --------------------------------- */
import { ReactComponent as CommentsIcon } from "../../assets/icons/PostImages/Coments.svg"
import { ReactComponent as ViewsIcon } from "../../assets/icons/PostImages/Views.svg"
import { ReactComponent as ThreeDotsIcon } from "../../assets/icons/PostImages/Threedots.svg"
import { ReactComponent as SavesIcon } from "../../assets/icons/PostImages/Saves.svg"
import { ReactComponent as ShareIcon } from "../../assets/icons/PostImages/Share.svg"
import { ReactComponent as LikeIcon } from "../../assets/icons/PostImages/like.svg"
import { ReactComponent as DislikeIcon } from "../../assets/icons/PostImages/dislike.svg"

import { useNavigate } from "react-router-dom";

export default function Naghdnegar() {

    const navigate = useNavigate();

    const [activeStates, setActiveStates] = useState({
        like: false,
        dislike: false,
        save: false,
    });

    const toggleLike = () => {
        setActiveStates(prev => ({
            ...prev,
            like: !prev.like,
            dislike: false, // اگه لایک بزنه دیسلایک خاموش بشه
        }));
    };

    const toggleDislike = () => {
        setActiveStates(prev => ({
            ...prev,
            dislike: !prev.dislike,
            like: false, // اگه دیسلایک بزنه لایک خاموش بشه
        }));
    };

    const toggleSave = () => {
        setActiveStates(prev => ({
            ...prev,
            save: !prev.save,
        }));
    };

    const goToRegister = () => {
        navigate("/register");
    }

    if (!localStorage.getItem("token")) {
        navigate("/register");
    }

    return (
        <div className={styles.wrapper}>

            <div className={styles.UserPost}>

                <div className={styles.PostHeader}>
                    <div className={styles.HeaderInfo}>
                        <img className={styles.pictureProfile} src={Art} alt="" />
                        <p className={styles.Name}>Arthur MacWaters</p>
                        <p className={styles.Handle}>@ArthurMacwaters</p>
                        <span className={styles.Dot}>·</span>
                        <p className={styles.Date}>Jul 28</p>
                    </div>

                    <button className={styles.ThreeDots}>
                        <ThreeDotsIcon />
                    </button>
                </div>

                <div className={styles.PostContentWrapper}>
                    <p>I met with the team of the Lockheed Martin defense company – one of the strongest enterprises in the United States, with which we have been cooperating for a long time. Lockheed Martin is the company that produces ATACMS, HIMARS, F-16s, and missiles for Patriot systems.</p>
                </div>

                <div className={styles.PostImgWrapper}>
                    <img className={styles.PostImg} src={sample1} alt="" />
                </div>

                <div className={styles.PostStats}>
                    <div className={styles.LeftSide}>

                        <button
                            className={`${styles.SavesWrapper} ${activeStates.save ? styles.Active : ""}`}
                            onClick={toggleSave}
                        >
                            <SavesIcon />
                            <p>571</p>
                        </button>

                        <button
                            className={`${styles.LikesWrapper} ${activeStates.like ? styles.Active : ""}`}
                            onClick={toggleLike}
                        >
                            <LikeIcon />
                            <p>4.7K</p>
                        </button>

                        <button
                            className={`${styles.DislikeWrapper} ${activeStates.dislike ? styles.Active : ""}`}
                            onClick={toggleDislike}
                        >
                            <DislikeIcon />
                            <p>4.7K</p>
                        </button>

                        <button className={styles.ComentsWrapper}>
                            <CommentsIcon />
                            <p>307</p>
                        </button>

                        <button className={styles.ViewsWrapper}>
                            <ViewsIcon />
                            <p>417K</p>
                        </button>
                    </div>

                    <div className={styles.RightSide}>
                        <button className={styles.SharesWrapper}>
                            <ShareIcon />
                        </button>
                    </div>
                </div>

            </div>

        </div>
    )
}