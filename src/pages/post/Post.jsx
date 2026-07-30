import styles from "./Post.module.css"
import Art from "../../assets/images/Arthur.jpg"



import lock from "../../assets/images/lock.jpeg"
import sample1 from "../../assets/images/mobile_samples/sample2.jpeg"

/* ---------------------------------- LOGOS --------------------------------- */
import Likes from "../../assets/icons/PostImages/Likes.svg"
import Coments from "../../assets/icons/PostImages/Coments.svg"
import Views from "../../assets/icons/PostImages/Views.svg"
import ThreeDots from "../../assets/icons/PostImages/Threedots.svg"
import Saves from "../../assets/icons/PostImages/Saves.svg"
import Share from "../../assets/icons/PostImages/Share.svg"

export default function Post() {
    return(
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
                        <img src={ThreeDots} alt="" />
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
                        <button className={styles.SavesWrapper}>
                            <img src={Saves} alt="" />
                            <p>571</p>
                        </button>

                        <button className={styles.LikesWrapper}>
                            <img src={Likes} alt="" />
                            <p>4.7K</p>
                        </button>

                        <button className={styles.ComentsWrapper}>
                            <img src={Coments} alt="" />
                            <p>307</p>
                        </button>

                        <button className={styles.ViewsWrapper}>
                            <img src={Views} alt="" />
                            <p>417K</p>
                        </button>
                    </div>

                    <div className={styles.RightSide}>
                        <button className={styles.SharesWrapper}>
                            <img src={Share} alt="" />
                        </button>
                    </div>
                </div>


                <div className={styles.PostSingularComents}>
                    <h3 className={styles.h3}>نظرات</h3>
                    <hr />
                    <div>

                    </div>
                </div>



            </div>






        </div>
    )
}