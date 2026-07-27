import styles from "./Home.module.css"
import robotAnimation from "../../assets/icons/MainHome/RobotAnimation.json"

import highspeedsvg from "../../assets/icons/MainHome/highspeed.svg"
import tahlilsvg from "../../assets/icons/MainHome/tahlilperson.svg"
import comparesvg from "../../assets/icons/MainHome/comparelogo.svg"

import chartSVG from "../../assets/icons/MainHome/chart.svg"
import dataSVG from "../../assets/icons/MainHome/data.svg"
import iconAiSVG from "../../assets/icons/MainHome/icon-ai.svg"
import kalaSVG from "../../assets/icons/MainHome/kala.svg"
import Lottie from "lottie-react";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";

import "swiper/css";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

export default function Home() {
    return (
        <div>
            <div className={styles["hero-txt"]}>
                <div className={styles["hero-text"]}>
                    <h1>اسم محصولاتت رو وارد کن، هوش مصنوعی میگه کدوم به‌صرفه‌تره!</h1>
                    <div className={styles["cta-buttons"]}>
                            {/*  onClick={gotoChat}   */}
                        <button                   className={`${styles.btn} ${styles["btn-primary"]}`}>شروع کنید</button>
                        <button className={`${styles.btn} ${styles["btn-secondary"]}`}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 24 24"><path d="M12 16l4-5h-3V4h-2v7H8l4 5zm8-2v6H4v-6H2v8h20v-8h-2z"/></svg>
                            دانلود اپ
                        </button>
                    </div>
                </div>

                <div className={styles.lottie}>
                   <Lottie
                       animationData={robotAnimation}
                       loop={true}
                       autoplay={true}
                       style={{ width: '100%', height: '100%'}}
                   />
                </div>
            </div>

           
            <h2 className={styles.h2tag}><span className={styles.how_span}>چطور</span> کار میکند</h2>
            <div className={styles["how-it-works"]}>
                <div className={styles.step}>
                    <img src={kalaSVG} alt="f" className={styles["step-icon"]}/>
                    <p>ورود نام محصول</p>
                </div>

                <svg className={styles.larrow_svg} width="34px" height="34px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" transform="matrix(-1, 0, 0, 1, 0, 0)"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M6 12H18M18 12L13 7M18 12L13 17" stroke="#828282" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path> </g></svg>
                <div className={styles.step}>
                    <img src={dataSVG} alt="f" className={styles["step-icon"]}/>
                    <p>جمع‌اوری اطلاعات</p>
                </div>
                
                <svg className={styles.larrow_svg} width="34px" height="34px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" transform="matrix(-1, 0, 0, 1, 0, 0)"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M6 12H18M18 12L13 7M18 12L13 17" stroke="#828282" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path> </g></svg>
                <div className={styles.step}>
                    <img src={iconAiSVG} alt="f" className={styles["step-icon"]} />
                    <p>تحلیل هوش مصنوعی</p>
                </div>

                <svg className={styles.larrow_svg} width="34px" height="34px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" transform="matrix(-1, 0, 0, 1, 0, 0)"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M6 12H18M18 12L13 7M18 12L13 17" stroke="#828282" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path> </g></svg>
                <div className={styles.step}>
                    <img src={chartSVG} alt="f" className={styles["step-icon"]}/>
                    <p>نمایش نتایج و نمودار</p>
                </div>
            </div>



            
                <h2 className={styles.h2tag}>نظرات کاربران</h2>

                <Swiper className={styles.mmm} modules={[Autoplay]} slidesPerView={3} spaceBetween={20} loop={true}
                autoplay={{ delay: 2500, disableOnInteraction: false, pauseOnMouseEnter: true,}}
                breakpoints={{
                    320: {
                    slidesPerView: 1,
                    },
                    768: {
                    slidesPerView: 2,
                    },
                    1024: {
                    slidesPerView: 3,
                    },
                }}
                >
                    <SwiperSlide>
                        <div className={styles.tweetCard}>
                            <div className={styles.tweetHeader}>
                                <img
                                src="https://i.pravatar.cc/100?img=1"
                                alt=""
                                className={styles.avatar}
                                />

                                <div>
                                <h4>علی رضایی</h4>
                                <span>@alirezaei</span>
                                </div>
                            </div>

                            <p>
                                برای خرید لپ‌تاپ از این سایت استفاده کردم. تحلیل هوش مصنوعی واقعا
                                کمک کرد بهترین گزینه رو پیدا کنم.
                            </p>

                            <small>۲ ساعت پیش</small>
                        </div>
                    </SwiperSlide>


                </Swiper>








            <h2 className={styles.h2tag}>دمو</h2>
            <div className={styles.demo}>
                <div className={styles["demo-inner"]}>

                    
                    <div className={styles["demo-desc"]}>
                    <h3>پیشنمایش دمو</h3>
                    <p>در این بخش می‌توانید نمونه‌ای از نحوه نمایش خروجی‌های سیستم را ببینید. این دمو صرفاً نمایشی است و داده‌ها فرضی هستند — نمودار زیر رفتار نمونه‌ای قیمت و امتیاز محصولات را نشان می‌دهد. حالت گفتگو (chat) نیز برای شبیه‌سازی تعامل با سیستم اضافه شده تا بتوانید پیام‌ها و پاسخ‌ها را تجربه کنید.</p>
                    </div>

                    <div className={styles["demo-box"]}>
                        <div className={styles["demo-placeholder"]}>اینجا پیش‌نمایش نمودار و چت نمایش داده می‌شود</div>
                        <div id={styles.chartContainer}><canvas id={styles.demoChart}></canvas></div>

                        <div className={styles.chat} id={styles.chatWindow}>
                            <div className={`${styles.msg} ${styles.user}`}>محصول A را با محصول B مقایسه کن </div>
                            <div className={`${styles.msg} ${styles.bot}`}>متوجه شدم؛ در اینجا بررسی این دو محصول را مشاهده می‌کنید. نتایج شامل نمودار قیمت، نمودار مقایسه ویژگی‌ها و رتبه‌بندی ستاره‌ای است.</div>
                        </div>
                        <div className={styles["chat-input"]}>
                            <input  id={styles.chatInput} placeholder="پیام خود را بنویسید... (مثلاً: محصول X)" />
                            <button  id={styles.sendBtn}>ارسال</button>
                        </div>
                    </div>                
                   

                </div>
            </div>

          
            <h2 className={styles.h2tag}>ویژگی‌ها</h2>
            <div className={styles.features}>
                <div className={styles.feature}>
                
                    <img src={highspeedsvg} alt="highspeedlogo" />
                    <h3>سرعت بالا</h3>
                    <p>پردازش سریع و زمان پاسخ پایین باعث می‌شود تصمیم‌گیری‌ها در کوتاه‌ترین زمان انجام شود؛ مناسب برای تست‌های بلادرنگ و تحلیل‌های دسته‌ای.</p>
                </div>

                <div className={styles.feature}>
                
                    <img src={tahlilsvg} alt="tahlilpersonlogo" />
                    <h3>تحلیل بی‌طرف</h3>
                    <p>استفاده از مجموعه‌داده‌های گسترده و معیارهای معتبر به همراه الگوریتم‌های شفاف تضمین می‌کند نتایج تا حد امکان بدون گرایش ارائه شوند.</p>
                </div>

                <div className={styles.feature}>
                    
                    <img src={comparesvg} alt="highspeed-logo" />
                    <h3>مقایسه بصری</h3>
                    <p>نمایش نتایج به شکل نمودارها، جداول و دیاگرام‌ها به تصمیم‌گیرندگان کمک می‌کند تا تغییرات را سریع‌تر درک و مقایسه کنند.</p>
                </div>
            </div>
        </div>
    )
}
