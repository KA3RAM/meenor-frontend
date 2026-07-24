import styles from "./Profile.module.css"
import image from "../../assets/images/star-wars-the-mandalorian-and-grogu-movie-7l.jpg"
import image2 from "../../assets/images/Lock.jpg"



export default function Profile() {
    return (
        <div className={styles.profile_wrapper}>
            <div className={styles.top_profile_card}>
                <div className={styles.profile_picture_wrapper}>
                    <img className={styles.profile_picture} src={image} alt="profile" />
                </div>
            
                <div className={styles.account_info_wrapper}>
                    <p className={styles.account_info}>Kasra Aghayari</p>
                    <p className={styles.account_info}>@KA3RAM</p>
                    <button>ویرایش</button>
                </div>

                
            </div>
            <div className={styles.buttom_profile_card}>
                <p className={styles.whishlisttag}>علاقه مندی ها</p>

                <div className={styles.whishlist_card_wrapper}>


                    
                    <div className={styles.whishlist_card}>
                        <div className={styles.product_img_wrapper}>
                            <img className={styles.product_img} src={image2} alt="product_name" />
                        </div> 
                        <p>ASUS TUF GAMING</p>
                    </div>

                    <div className={styles.whishlist_card}>
                        <div className={styles.product_img_wrapper}>
                            <img className={styles.product_img} src={image2} alt="product_name" />
                        </div> 
                        <p>ASUS TUF GAMING</p>
                    </div>

                    <div className={styles.whishlist_card}>
                        <div className={styles.product_img_wrapper}>
                            <img className={styles.product_img} src={image2} alt="product_name" />
                        </div> 
                        <p>ASUS TUF GAMING</p>
                    </div>

                    <div className={styles.whishlist_card}>
                        <div className={styles.product_img_wrapper}>
                            <img className={styles.product_img} src={image2} alt="product_name" />
                        </div> 
                        <p>ASUS TUF GAMING</p>
                    </div>

                    <div className={styles.whishlist_card}>
                        <div className={styles.product_img_wrapper}>
                            <img className={styles.product_img} src={image2} alt="product_name" />
                        </div> 
                        <p>ASUS TUF GAMING</p>
                    </div>

                    <div className={styles.whishlist_card}>
                        <div className={styles.product_img_wrapper}>
                            <img className={styles.product_img} src={image2} alt="product_name" />
                        </div> 
                        <p>ASUS TUF GAMING</p>
                    </div>

                    <div className={styles.whishlist_card}>
                        <div className={styles.product_img_wrapper}>
                            <img className={styles.product_img} src={image2} alt="product_name" />
                        </div> 
                        <p>ASUS TUF GAMING</p>
                    </div>

                    <div className={styles.whishlist_card}>
                        <div className={styles.product_img_wrapper}>
                            <img className={styles.product_img} src={image2} alt="product_name" />
                        </div> 
                        <p>ASUS TUF GAMING</p>
                    </div>

                    <div className={styles.whishlist_card}>
                        <div className={styles.product_img_wrapper}>
                            <img className={styles.product_img} src={image2} alt="product_name" />
                        </div> 
                        <p>ASUS TUF GAMING</p>
                    </div>


                    <div className={styles.whishlist_card}>
                        <div className={styles.product_img_wrapper}>
                            <img className={styles.product_img} src={image2} alt="product_name" />
                        </div> 
                        <p>ASUS TUF GAMING</p>
                    </div>
                </div>
            </div>
        </div>
    )
}