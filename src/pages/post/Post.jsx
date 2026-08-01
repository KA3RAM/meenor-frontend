import { useRef, useState } from "react"
import styles from "./Post.module.css"
import Art from "../../assets/images/Arthur.jpg"
import lock from "../../assets/images/lock.jpeg"
import sample1 from "../../assets/images/mobile_samples/sample2.jpeg"

/* ---------------------------------- SVG COMPONENTS --------------------------------- */
import { ReactComponent as CommentsIcon } from "../../assets/icons/PostImages/Coments.svg"
import { ReactComponent as ViewsIcon } from "../../assets/icons/PostImages/Views.svg"
import { ReactComponent as ThreeDotsIcon } from "../../assets/icons/PostImages/Threedots.svg"
import { ReactComponent as SavesIcon } from "../../assets/icons/PostImages/Nsave.svg"
import { ReactComponent as ShareIcon } from "../../assets/icons/PostImages/Share.svg"
import { ReactComponent as LikeIcon } from "../../assets/icons/PostImages/like.svg"
import { ReactComponent as DislikeIcon } from "../../assets/icons/PostImages/dislike.svg"

export default function Post() {
    const [comentText, setComentText] = useState("")
    const textareaRef = useRef(null)

    const MAX_TEXTAREA_HEIGHT = 200 // بعد از این ارتفاع (به px)، خود باکس اسکرول می‌خوره
    const MAX_COMENT_LENGTH = 500 // حداکثر تعداد کاراکتر مجاز برای کامنت

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

    const handleComentChange = (e) => {
        const value = e.target.value.slice(0, MAX_COMENT_LENGTH)
        setComentText(value)

        const el = textareaRef.current
        if (!el) return

        // ریست ارتفاع تا اسکرول‌هایت درست محاسبه شه
        el.style.height = "auto"

        if (el.scrollHeight > MAX_TEXTAREA_HEIGHT) {
            // از حد مشخص که رد شد، ارتفاع ثابت می‌مونه و خود باکس اسکرول‌بار می‌گیره
            el.style.height = MAX_TEXTAREA_HEIGHT + "px"
            el.style.overflowY = "auto"
            // اسکرول به آخرین خطی که کاربر داره تایپ می‌کنه (پایین باکس)
            el.scrollTop = el.scrollHeight
        } else {
            // تا قبل از حد مشخص، باکس بزرگ می‌شه و اسکرول لازم نیست
            el.style.height = el.scrollHeight + "px"
            el.style.overflowY = "hidden"
        }

        // اسکرول خودکار صفحه به سمت باکس کامنت وقتی داره بزرگ می‌شه
        el.scrollIntoView({ behavior: "smooth", block: "center" })
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


                <div className={styles.PostSingularComents}>
                    <h3 className={styles.h3}>نظرات</h3>
                    <hr className={styles.hr} />
                    <div className={styles.UserComentWrapper}>
                        <img className={styles.UserProfilePic} src={lock} alt="" />
                        <div className={styles.ComentInputBox}>
                            <textarea
                                ref={textareaRef}
                                className={styles.UserComent}
                                name="coment"
                                rows={1}
                                maxLength={MAX_COMENT_LENGTH}
                                placeholder="پاسخ خود را بنویسید..."
                                value={comentText}
                                onChange={handleComentChange}
                            />
                            <span
                                className={styles.ComentCounter}
                                style={comentText.length >= MAX_COMENT_LENGTH ? { color: "#f4212e" } : undefined}
                            >
                                {comentText.length}/{MAX_COMENT_LENGTH}
                            </span>
                        </div>
                        <button className={styles.SendComent}>پاسخ</button>
                    </div>
                    <hr className={styles.hr} />



                    <div className={styles.ComentsPeopleWrapper}>
                        <div className={styles.HeaderInfo}>
                            <img className={styles.pictureProfile} src={Art} alt="" />
                            <p className={styles.Name}>Arthur MacWaters</p>
                            <p className={styles.Handle}>@ArthurMacwaters</p>
                            <span className={styles.Dot}>·</span>
                            <p className={styles.Date}>Jul 28</p>
                        </div>
                        <p className={styles.PeopleComentContent}>سلام این کامنت برای تست است</p>
                    </div>
                    <hr className={styles.HrComent} />

                    <div className={styles.ComentsPeopleWrapper}>
                        <div className={styles.HeaderInfo}>
                            <img className={styles.pictureProfile} src={Art} alt="" />
                            <p className={styles.Name}>Arthur MacWaters</p>
                            <p className={styles.Handle}>@ArthurMacwaters</p>
                            <span className={styles.Dot}>·</span>
                            <p className={styles.Date}>Jul 28</p>
                        </div>
                        <p className={styles.PeopleComentContent}> لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ و با استفاده از طراحان گرافیک است. چاپگرها و متون بلکه روزنامه و مجله در ستون و سطرآنچنان که لازم است و برای شرایط فعلی تکنولوژی مورد نیاز و کاربردهای متنوع با هدف بهبود ابزارهای کاربردی می باشد. کتابهای زیادی در شصت و سه درصد گذشته، حال و آینده شناخت فراوان جامعه و متخصصان را می طلبد تا با نرم افزارها شناخت بیشتری را برای طراحان رایانه ای علی الخصوص طراحان خلاقی و فرهنگ پیشرو در زبان فارسی ایجاد کرد. در این صورت می توان امید داشت که تمام و دشواری موجود در ارائه راهکارها و شرایط سخت تایپ به پایان رسد وزمان مورد نیاز شامل حروفچینی دستاوردهای اصلی و جوابگوی سوالات پیوسته اهل دنیای موجود طراحی اساسا مورد استفاده قرار گیرد.</p>
                    </div>
                    <hr className={styles.HrComent} />

                    <div className={styles.ComentsPeopleWrapper}>
                        <div className={styles.HeaderInfo}>
                            <img className={styles.pictureProfile} src={Art} alt="" />
                            <p className={styles.Name}>Arthur MacWaters</p>
                            <p className={styles.Handle}>@ArthurMacwaters</p>
                            <span className={styles.Dot}>·</span>
                            <p className={styles.Date}>Jul 28</p>
                        </div>
                        <p className={styles.PeopleComentContent}>     ظرفیت نرم‌افزار وحدت بادی فارسی کارآفرینی تحقق ساختگی سادگی مشاوره بازخورد متنوع! ابداع بازاریابی داروسازی معماری تناسب متاورس طبیعت کاربردهای. محتوا دیجیتال دستاوردهای مستمر انتشار تحلیلی دنیا منطق آزادی دشواری جهانی داده نقادانه استفاده. ترکیبی کارایی گیرنده حقیقت متخصصان ابداع علم ارزش. توزیع فضا شناخت متنوع رهبری انتخاب ارزیابی گرافیک تجدد نامفهوم ساختگی ایجاد تجدد توسعه؟</p>
                    </div>
                    <hr className={styles.HrComent} />

                    <div className={styles.ComentsPeopleWrapper}>
                        <div className={styles.HeaderInfo}>
                            <img className={styles.pictureProfile} src={Art} alt="" />
                            <p className={styles.Name}>Arthur MacWaters</p>
                            <p className={styles.Handle}>@ArthurMacwaters</p>
                            <span className={styles.Dot}>·</span>
                            <p className={styles.Date}>Jul 28</p>
                        </div>
                        <p className={styles.PeopleComentContent}>سلام این کامنت برای تست است</p>
                    </div>
                    <hr className={styles.HrComent} />


                    <div>

                    </div>
                </div>



            </div>

        </div>
    )
}