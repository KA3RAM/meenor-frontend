import styles from "./Contact.module.css"


import emailsvg from "../../assets/icons/contactUs/emailsvg.svg"
import instagramsvg from "../../assets/icons/contactUs/instagramsvg.svg"
import linkdinsvg from "../../assets/icons/contactUs/linkdinsvg.svg"
import whatsappsvg from "../../assets/icons/contactUs/whatsappsvg.svg"
import xsvg from "../../assets/icons/contactUs/xsvg.svg"
import youtubesvg from "../../assets/icons/contactUs/youtubesvg.svg"

export default function Contact() {
    return(
        <div className={styles.ContactUsWrapper}>
            <h2 className={styles.ContactWhithUs}>ارتباط با ما</h2>
            <p className={styles["intro-text"]}>
            خوشحال می‌شویم نظرات، انتقادات و پیشنهادات شما را دریافت کنیم.  
            از طریق شبکه‌های اجتماعی یا ایمیل با ما در تماس باشید و تجربه‌ی خود را با Meenor به اشتراک بگذارید.
            </p>

            <div className={styles["contact-info"]}>
                
                <div className={styles["contact-item"]}>
                    <img src={instagramsvg} alt="#" />
                    {/* <a href="https://instagram.com" target="_blank">Meenor@</a> */}
                    <div className={styles["contact-extra"]}>ما را در اینستاگرام دنبال کنید</div>
                </div>

                
                <div className={styles["contact-item"]}>
                    <img src={xsvg} alt="#" />
                    {/* <a href="https://twitter.com" target="_blank">Meenor@</a> */}
                    <div className={styles["contact-extra"]}>جدیدترین اخبار در توییتر</div>
                </div>

            
                <div className={styles["contact-item"]}>
                    <img src={emailsvg} alt="#" />
                    {/* <a href="mailto:contact@versus.com">Email</a> */}
                    <div className={styles["contact-extra"]}>ایمیل مستقیم به ما</div>
                </div>

                
                <div className={styles["contact-item"]}>
                    <img src={whatsappsvg} alt="#" />
                    {/* <a href="https://wa.me/989120000000" target="_blank">WhatsApp</a> */}
                    <div className={styles["contact-extra"]}>چت مستقیم در واتساپ</div>
                </div>

            
                <div className={styles["contact-item"]}>
                    <img src={linkdinsvg} alt="#" />
                    {/* <a href="https://linkedin.com" target="_blank">LinkedIn</a> */}
                    <div className={styles["contact-extra"]}>شبکه حرفه‌ای ما</div>
                </div>

                
                <div className={styles["contact-item"]}>
                    <img src={youtubesvg} alt="#" />
                    {/* <a href="https://youtube.com" target="_blank">YouTube</a> */}
                    <div className={styles["contact-extra"]}>ویدئوهای ما در یوتیوب</div>
                </div>
            </div>

            <div className={styles["feedback-box"]}>
                <h3>انتقادات و پیشنهادات</h3>
                <textarea placeholder="نظرات، انتقادات یا پیشنهادات خود را اینجا بنویسید..."></textarea>
                <button>ارسال</button>
            </div>


        </div>
            


    )
}