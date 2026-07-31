import styles from "./Home.module.css"
import robotAnimation from "../../assets/icons/MainHome/RobotAnimation.json"
import loading from "../../assets/icons/MainHome/Loading.json"

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



/* -------------------------------------------------------------------------- */
/*                                Mobile_sample                               */
/* -------------------------------------------------------------------------- */
import sample1 from "../../assets/images/mobile_samples/sample1.webp"
import sample2 from "../../assets/images/mobile_samples/sample2.jpeg"
import sample3 from "../../assets/images/mobile_samples/sample3.jpeg"
import sample4 from "../../assets/images/mobile_samples/sample4.jpeg"
import sample5 from "../../assets/images/mobile_samples/sample5.jpeg"
import sample6 from "../../assets/images/mobile_samples/sample6.webp"
import sample7 from "../../assets/images/mobile_samples/sample7.webp"
import sample8 from "../../assets/images/mobile_samples/sample8.webp"
import {useNavigate} from "react-router-dom";
import {useState} from "react";







export default function Home() {
    const [token, setToken] = useState(() => {
        return localStorage.getItem("token") || "";
    });
    const navigate = useNavigate();
    const goToChat = () => {
        navigate("/chat");

    }
    const goToNaghd = () => {
        navigate("/naghdnegar");
    }
    const goToRegister = () => {
        navigate("/Register");
    }

    return (
        <div>
            <div className={styles["hero-txt"]}>
                <div className={styles["hero-text"]}>
                    <h1>اسم محصولاتت رو وارد کن، هوش مصنوعی میگه کدوم به‌صرفه‌تره!</h1>
                    <div className={styles["cta-buttons"]}>
                            {/*  onClick={gotoChat}   */}
                        <button onClick={token.length > 1 ? goToChat : goToRegister} className={`${styles.btn} ${styles["btn-primary"]}`}>شروع کنید</button>
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



            
            <h2 className={styles.h2tagg}>بخش نقد نگار</h2>
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
                        <div className={styles.tweeImage}>
                            <img src={sample4} alt="" />
                        </div>
                        
                        <p>
                            بین گلکسی اس۲۴ و شیائومی ۱۴ تی پرو مقایسه کردم. هوش مصنوعی خیلی دقیق بود و کمک کرد بهترین رو انتخاب کنم.
                        </p>
                        <small>۲ ساعت پیش</small>
                        <hr />
                        <div className={styles.tweetHeader}>
                            <img src="https://i.pravatar.cc/100?img=38" alt="" className={styles.avatar}/>

                            <div>
                                <h4>سارا محمدی</h4>
                                <span>sara_mohammadi@</span>
                            </div>
                        </div>
                    </div>
                </SwiperSlide>
                
                <SwiperSlide>
                    <div className={styles.tweetCard}>
                        <div className={styles.tweeImage}>
                            <img src={sample2} alt="" />
                        </div>
                        
                        <p>
                            متاسفانه گوشی که این سایت بهم پیشنهاد داد اصلا اون چیزی نبود که انتظار داشتم. دوربینش برای عکس‌های شب خیلی ضعیف بود و باتری زود خالی میشد.
                        </p>
                        <small>۵ روز پیش</small>
                        <hr />
                        <div className={styles.tweetHeader}>
                            <img src="https://i.pravatar.cc/100?img=15" alt="" className={styles.avatar}/>

                            <div>
                                <h4>مهدی کریمی</h4>
                                <span>mehdikarimi@</span>
                            </div>
                        </div>
                    </div>
                </SwiperSlide>
                
                <SwiperSlide>
                    <div className={styles.tweetCard}>
                        <div className={styles.tweeImage}>
                            <img src={sample1} alt="" />
                        </div>
                        
                        <p>
                            آیفون ۱۵ پرو مکس رو با پیکسل ۹ پرو مقایسه کردم. هوش مصنوعی همه جزئیات رو بررس کرد و انتخابم خیلی راحت شد.
                        </p>
                        <small>۱ هفته پیش</small>
                        <hr />
                        <div className={styles.tweetHeader}>
                            <img src="https://i.pravatar.cc/100?img=8" alt="" className={styles.avatar}/>

                            <div>
                                <h4>امیرحسین نوری</h4>
                                <span>amir_nouri@</span>
                            </div>
                        </div>
                    </div>
                </SwiperSlide>
     
                <SwiperSlide>
                    <div className={styles.tweetCard}>
                        <div className={styles.tweeImage}>
                            <img src={sample3} alt="" />
                        </div>
                        
                        <p>
                            عالی بود، دقیقا همون گوشی رو پیدا کردم که میخواستم. مقایسه‌گر هوش مصنوعی همه گزینه‌ها رو برام بررسی کرد.
                        </p>
                        <small>۲ روز پیش</small>
                        <hr />
                        <div className={styles.tweetHeader}>
                            <img src="https://i.pravatar.cc/100?img=10" alt="" className={styles.avatar}/>

                            <div>
                                <h4>نازنین احمدی</h4>
                                <span>naz_ahmadi@</span>
                            </div>
                        </div>
                    </div>
                </SwiperSlide>


                <SwiperSlide>
                    <div className={styles.tweetCard}>
                        <div className={styles.tweeImage}>
                            <img src={sample8} alt="" />
                        </div>
                        
                        <p>
                            گوشی آنر مجیک ۶ پرو رو با وان‌پلاس ۱۲ مقایسه کردم و انتخابم رو کردم. هوش مصنوعی واقعا بهم کمک کرد تا بهترین تصمیم رو بگیرم. از کیفیت ساخت تا باتری <span>...</span>
                        </p>
                        <small>۴ روز پیش</small>
                        <hr />
                        <div className={styles.tweetHeader}>
                            <img src="https://i.pravatar.cc/100?img=12" alt="" className={styles.avatar}/>

                            <div>
                                <h4>رضا حسینی</h4>
                                <span>reza_hosseini@</span>
                            </div>
                        </div>
                    </div>
                </SwiperSlide>

                <SwiperSlide>
                    <div className={styles.tweetCard}>
                        <div className={styles.tweeImage}>
                            <img src={sample7} alt="" />
                        </div>
                        
                        <p>
                            خیلی خوب بود. هوش مصنوعی دقیقا فهمید من دنبال چه گوشی با چه امکاناتی هستم. پیشنهادش دقیقا همون چیزی بود که میخواستم.
                        </p>
                        <small>۶ روز پیش</small>
                        <hr />
                        <div className={styles.tweetHeader}>
                            <img src="https://i.pravatar.cc/100?img=41" alt="" className={styles.avatar}/>

                            <div>
                                <h4>فاطمه زهرایی</h4>
                                <span>fatemeh_zahraei@</span>
                            </div>
                        </div>
                    </div>
                </SwiperSlide>

                <SwiperSlide>
                    <div className={styles.tweetCard}>
                        <div className={styles.tweeImage}>
                            <img src={sample6} alt="" />
                        </div>
                        
                        <p>
                            برای خرید گوشی سامسونگ گلکسی اس۲۴ اولترا و آیفون ۱۵ پرو مکس با کمک این سایت مقایسه کردم. هوش مصنوعی دقیقا نقاط قوت و ضعف<span> ... </span>
                        </p>
                        <small>۳ روز پیش</small>
                        <hr />
                        <div className={styles.tweetHeader}>
                            <img src="https://i.pravatar.cc/100?img=52" alt="" className={styles.avatar}/>

                            <div>
                                <h4>حمید رضایی</h4>
                                <span>hamid_rezaei@</span>
                            </div>
                        </div>
                    </div>
                </SwiperSlide>

                <SwiperSlide>
                    <div className={styles.tweetCard}>
                        <div className={styles.tweeImage}>
                            <img src={sample5} alt="" />
                        </div>
                        
                        <p>
                            من واقعا نمیدونستم بین این همه گوشی موبایل کدوم رو انتخاب کنم. این سایت با هوش مصنوعیش همه گزینه‌ها رو مقایسه کرد و بهترین رو بهم پیشنهاد داد.<span>...</span>
                        </p>
                        <small>۱ روز پیش</small>
                        <hr />
                        <div className={styles.tweetHeader}>
                            <img src="https://i.pravatar.cc/100?img=20" alt="" className={styles.avatar}/>

                            <div>
                                <h4>زهرا موسوی</h4>
                                <span>zahra_mousavi@</span>
                            </div>
                        </div>
                    </div>
                </SwiperSlide>
            </Swiper>



            <div className={styles.CTA_wrapper}>
                <div className={styles.lottie}>
                   <Lottie
                       animationData={loading}
                       loop={true}
                       autoplay={true}
                       style={{ width: '100%', height: '100%'}}
                   />
                </div>
                <div className={styles.textCTA}>
                   <p> دست به جنبون! وقتشه به بقیه کمک کنی تا محصول بهتری رو برای خرید انتخاب کنن.
                    با ورود به بخش نقد نگار شما میتوانید تجربیات خودتان را با بقیه افراد به اشتراک بگذارید.</p>

                    <button onClick={goToNaghd}>نقد نگار</button>
                </div>
            </div>




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
