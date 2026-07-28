import {Outlet} from "react-router-dom"
import styles from "./ChatLayout.module.css"

/* -------------------------------- component ------------------------------- */
import Sidebar from "../components/Sidebar/Sidebar"



export default function ChatLayout() {
    return (
        <div className={styles.BlackWrapper}>
            <Sidebar />

            <div className={styles.MainContent}>
                <Outlet />
            </div>
        </div>

    )
       
    
}