import styles from "./login.module.css"
import {Link, useNavigate} from "react-router-dom";
import {useRef} from "react";
import {login_send_data_token} from "../../services/Axios";

export default function Login() {
    const navigate = useNavigate();
    const goToHome = () => {
        navigate("/");

    }

    const username_ref = useRef(null);
    const password_ref = useRef(null);

    const handleLogin = async () => {

        try {
            let data_login = {
                username: username_ref.current.value,
                password: password_ref.current.value,
            }

            let { data: token } = await login_send_data_token(data_login);
            localStorage.setItem("token", token.token);


            goToHome()

        } catch (err) {
            console.error("An error occurred:", err);
        }
    };
    return (
        <div className={styles.login_wrapper}>
            <h1 className={styles.title_log}>ورود</h1>
            <p className={styles.subtitle_reg}> خوش اومدی! وارد حساب کاربریت شو و از دنیای مینور لذت ببر ✨</p>
            <form id={styles.login}>

                {/* username */}
                <label className={styles.log_field}>
                    <p className={styles.label}>نام کاربری</p>
                    <div className={styles["input-wrap"]}>
                        <input ref={username_ref} type="username" name="username" placeholder="مثلاً: ali_reza"  autoComplete="username" required />
                        
                    </div>
                </label>

                {/* password */}
                <label className={styles.log_field}>
                    <p className={styles.label}>گذرواژه</p>
                    <div className={styles["input-wrap"]}>
                        <input ref={password_ref} type="password" placeholder="********" name="password" autoComplete="password" required/>
                    </div>
                </label>

                <button type="submit" className={styles.btn} onClick={(e) => {
                    e.preventDefault()
                    handleLogin()
                }}> ورود به حساب</button>
                <p className={styles.meta}>حساب ندارید؟ <Link to="/register">ثبت‌نام</Link></p>

            </form>
        </div>
    )
}