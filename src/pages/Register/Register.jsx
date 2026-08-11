
import styles from "./Register.module.css"
import {Link, useNavigate} from "react-router-dom";
import {useRef, useState} from "react";
import {
    creat_static_good_cpu,
    creat_static_good_gpu, creat_static_good_phone_details,
    login_send_data_token,
    register_send_data_axios
} from "../../services/Axios";
import Snackbar from "../../components/Snackbar/Snackbar";
import {useSnackbar} from "../../components/Snackbar/useSnackbar";
import {getErrorMessage} from "../../utils/getErrorMessage";

export default function Register() {
    const { snackbar, showSnackbar, closeSnackbar } = useSnackbar();
    // برای جلوگیری از سابمیت تکراری (کلیک چندباره روی دکمه تا جواب سرور بیاد)
    const [submitting, setSubmitting] = useState(false);


    // -----------------------------------------------------

    const creat_good = async () => {
        try {
            let data ={
                "name": "Samsung Galaxy S24 Ultra",
                "image_link": "https://fdn2.gsmarena.com/vv/bigpic/samsung-galaxy-s26-ultra-new.jpg",
                "network_technology": "GSM / HSPA / EVDO / LTE / 5G",
                "announced": "2023, February 6",
                "body_dimensions": "165.5 x 78.1 x 8.9 mm",
                "body_weight": "214 g",
                "body_build": "Glass front (Corning Gorilla Armor 2), glass back (Gorilla Glass Victus 2), aluminum frame",
                "SIM": "Nano-SIM + Nano-SIM + eSIM + eSIM (max 2 at a time) - INT\nNano-SIM + eSIM + eSIM (max 2 at a time) - USA\nNano-SIM + Nano-SIM - CN",
                "display_type": "Dynamic LTPO AMOLED 2X",
                "display_refresh_rate": 150,
                "display_brightness": 1200,
                "display_size": "[]",
                "display_resolution": "1440 x 3120 pixels, 19.5:9 ratio (~450 ppi density)",
                "display_protection": "Corning Gorilla Armor 2, Mohs level 4",
                "operating_system": "Android 16, up to 7 major Android upgrades, One UI 8.5",
                "chipset": "Qualcomm SM8850-1-AD Snapdragon 8 Elite Gen 5 (3 nm)",
                "CPU": "Octa-core (2x4.74 GHz Oryon V3 Phoenix L + 6x3.62 GHz Oryon V3 Phoenix M)",
                "GPU": "Adreno 840 (1.3GHz)",
                "memory_card_slot": "Yes",
                "internal_memory": "256GB 12GB RAM\n512GB 12GB RAM\n1TB 16GB RAM",
                "back_camera": "200 MP, f/1.4, 23mm (wide), 1/1.3\", 0.6µm, multi-directional PDAF, OIS\n10 MP, f/2.4, 67mm (telephoto), 1/3.94\", 1.0µm, PDAF, OIS, 3x optical zoom\n50 MP, f/2.9, 111mm (periscope telephoto), 1/2.52\", 0.7µm, PDAF, OIS, 5x optical zoom\n50 MP, f/1.9, 120˚ (ultrawide), 1/2.5\", 0.7µm, dual pixel PDAF, Super Steady video",
                "back_camera_features": "Laser AF, Best Face, Horizon Lock, LED flash, auto-HDR, panorama",
                "back_camera_video": "8K@24/30fps\n4K@30/60/120fps\n1080p@30/60/120/240fps",
                "selfie_camera": "12 MP, f/2.2, 23mm (wide), 1/3.2\", 1.12µm, dual pixel PDAF",
                "selfie_camera_video": "4K@30/60fps\n1080p@30fps",
                "loudspeaker": "Yes, with stereo speakers",
                "headphone_jack": "No",
                "bluetooth": "6.0, A2DP, LE",
                "positioning": "GPS, GLONASS, BDS, GALILEO, QZSS",
                "NFC": "Yes",
                "USB": "USB Type-C 3.2, DisplayPort 1.2, OTG",
                "sensors": "Fingerprint (under display, ultrasonic), accelerometer, gyro, proximity, compass, barometer",
                "battery_type": "Li-Ion",
                "battery_size": 5000,
                "wired_charging_speed": 60,
                "charging": "60W wired, PD3.0, 75% in 30 min\n25W wireless (Qi2.2)\n4.5W reverse wireless",
                "colors": "Cobalt Violet, Sky Blue, Black, White, Silver Shadow, Pink Gold",
                "price": 350000,
                "AnTuTu": 25686,
                "GeekBench": 1074
            }
    
    
            await creat_static_good_phone_details(data);
    
            console.log("Created");
    
        } catch (err) {
            console.error("STATUS:", err.response?.status);
            console.error("ERROR DATA:", err.response?.data);
            console.error("ERROR:", err);        }
    
    
    };
    
    creat_good()


    // -----------------------------------------------------



    const navigate = useNavigate();
    const goToHome = () => {
        navigate("/");

    }

    const username_ref = useRef(null);
    const firstname_ref = useRef(null);
    const lastname_ref = useRef(null);
    const email_ref = useRef(null);
    const password_ref = useRef(null);


    const fetch_send_input_data = async () => {
        if (submitting) return;
        setSubmitting(true);
        try {
            let data_register ={
                first_name: firstname_ref.current.value,
                last_name: lastname_ref.current.value,
                username: username_ref.current.value,
                email: email_ref.current.value,
                password: password_ref.current.value,

            }
            let data_login ={
                username: username_ref.current.value,
                password: password_ref.current.value,
            }
            await register_send_data_axios(data_register);


            await fetch_get_token(data_login);

        } catch (err) {
            showSnackbar(getErrorMessage(err), "error");
        } finally {
            setSubmitting(false);
        }


    };


    const fetch_get_token = async (input_pass_and_user) => {
        try {
            let { data: token } = await login_send_data_token(input_pass_and_user);
            localStorage.setItem("token", token.token);

            showSnackbar("ثبت‌نام با موفقیت انجام شد", "success");
            // یه تاخیر کوچیک قبل از ریدایرکت، وگرنه کاربر فرصت دیدن اسنک‌بار رو پیدا نمی‌کنه.
            setTimeout(() => {
                goToHome();
            }, 900);


        } catch (err) {
            throw err; // بذار fetch_send_input_data (که این تابع رو صدا زده) پیام خطا رو نشون بده
        }


    };

    return (
        <div className={styles.register_wrapper}>
            <Snackbar message={snackbar?.message} type={snackbar?.type} onClose={closeSnackbar} />
            <h1 className={styles.title_reg}>ثبت‌ نام</h1>
            <p className={styles.subtitle_reg}>حساب کاربری جدید بسازید و وارد دنیای مینور شوید</p>
            <form id={styles.register}>
                {/* name */}
                <label className={styles.reg_field}>
                    <p className={styles.label}>نام</p>
                    <div className={styles["input-wrap"]}>
                        <input ref={firstname_ref} name="name" type="text" required />
                    </div>
                </label>


                {/* last name */}
                <label className={styles.reg_field}>
                    <p className={styles.label}> نام خانوادگی</p>
                    <div className={styles["input-wrap"]}>
                        <input ref={lastname_ref} type="text" name="last-name" required />
                    </div>
                </label>

                {/* username */}
                <label className={styles.reg_field}>
                    <p className={styles.label}>نام کاربری</p>
                    <div className={styles["input-wrap"]}>
                        <input ref={username_ref} type="username" name="username" placeholder="مثلاً: ali_reza"  autoComplete="username" required />
                        
                    </div>
                </label>

                {/* email */}
                <label className={styles.reg_field}>
                    <p className={styles.label}>ایمیل</p>
                    <div className={styles["input-wrap"]}>
                        <input ref={email_ref}  type="email" name="email" placeholder="you@example.com" autoComplete="email" required />
                    </div>
                </label>

                {/* password */}
                <label className={styles.reg_field}>
                    <p className={styles.label}>گذرواژه</p>
                    <div className={styles["input-wrap"]}>
                        <input ref={password_ref} type="password" placeholder="********" name="password" autoComplete="password" required/>
                    </div>
                </label>

                <button type="submit" className={styles.btn} disabled={submitting} onClick={(e) => {
                    e.preventDefault();
                    fetch_send_input_data();
                }}>{submitting ? "در حال ثبت‌نام..." : "ایجاد حساب"}</button>
                <p className={styles.meta}>
                قبلاً حساب دارید؟{" "}
                <Link to="/login">ورود</Link>
                </p>
            </form>
        </div>
    )
}