import {Outlet} from "react-router-dom"
import Background from "../components/Background/Background"

import styles from "./AuthLayout.module.css"


export default function AuthLayout() {
    return(
        <>
            <Background />

            <main className={styles.containerAuth}>
                <Outlet/>
            </main>
        </>
    )
}