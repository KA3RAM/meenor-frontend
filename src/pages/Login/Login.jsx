import styles from "./login.module.css"
import { Link } from "react-router-dom";

export default function Login() {
    return (
        <div className={styles.login_wrapper}>
            <h1 className={styles.title_log}>ورود</h1>
            <p className={styles.subtitle_reg}> خوش اومدی! وارد حساب کاربریت شو و از دنیای مینور لذت ببر ✨</p>
            <form id={styles.login}>

                {/* username */}
                <label className={styles.log_field}>
                    <p className={styles.label}>نام کاربری</p>
                    <div className={styles["input-wrap"]}>
                        <input type="username" name="username" placeholder="مثلاً: ali_reza"  autocomplete="username" required />
                        
                    </div>
                </label>

                {/* password */}
                <label className={styles.log_field}>
                    <p className={styles.label}>گذرواژه</p>
                    <div className={styles["input-wrap"]}>
                        <input type="password" placeholder="********" name="password" autoComplete="password" required/>
                    </div>
                </label>

                <button type="submit" className={styles.btn}> ورود به حساب</button>
                <p className={styles.meta}>حساب ندارید؟ <Link to="/register">ثبت‌نام</Link></p>

            </form>
        </div>
    )
}