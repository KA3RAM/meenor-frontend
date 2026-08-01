import styles from "./Seacrh.module.css"
import { ReactComponent as SearchIcon} from "../../assets/icons/PostImages/search.svg"

export default function Search() {
    return(
        <div className={styles.SearchWholeWrapper}>
            <div className={styles.searchbox}>
                <SearchIcon/>
                <input type="text" placeholder="سرچ کنید..."/>
            </div>
            
        </div>
    )
}