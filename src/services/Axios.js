import axios from "axios";


export const CHB_send_input_good = (input) => {
    const token = localStorage.getItem("token");
    const url = `http://127.0.0.1:8000/chatbot/search_phone/?search=${input}`;
    if(input.length > 0){
        return axios.get(url,{
            headers: {
                "authorization": `Token ${token}`,
            }
        });
    }
}
export const register_send_data_axios = (input) => {
    const url = `http://127.0.0.1:8000/account/register/`;
    return axios.post(url, input)
}
export const login_send_data_token = (input) => {
    const url = `http://127.0.0.1:8000/account/login/`;
    return axios.post(url, input);
}

//-----------------------

export const creat_static_good_cpu = (input) => {
    const token = localStorage.getItem("token");
    const url = `http://127.0.0.1:8000/chatbot/register_cpu/`;
    return axios.post(url,input,{
        headers: {
            "authorization": `Token ${token}`,
        }
    });
}
export const creat_static_good_gpu = (input) => {
    const token = localStorage.getItem("token");
    const url = `http://127.0.0.1:8000/chatbot/register_gpu/`;
    return axios.post(url,input,{
        headers: {
            "authorization": `Token ${token}`,
        }
    });
}
export const creat_static_good_phone_details = (input) => {
    const token = localStorage.getItem("token");
    const url = `http://127.0.0.1:8000/chatbot/register_phone/`;
    return axios.post(url,input,{
        headers: {
            "authorization": `Token ${token}`,
        }
    });
}

export const get_phone_details = (input) => {
    const token = localStorage.getItem("token");
    const url = `http://127.0.0.1:8000/chatbot/get_phone/${input}/`;
    return axios.get(url,{
        headers: {
            "authorization": `Token ${token}`,
        }
    });
}

export const add_to_wishlist_chatBot = (input) => {
    const token = localStorage.getItem("token");
    const url = `http://127.0.0.1:8000/chatbot/wishlist_phone/${input}/`
    return axios.get(url,{
        headers: {
            "authorization": `Token ${token}`,
        }
    });


}
// export const delete_wishlist_chatBot = (input) => {
//     const token = localStorage.getItem("token");
//     const url = `http://127.0.0.1:8000/chatbot/wishlist_phone/${input}/`
//     return axios.delete(url,{
//         headers: {
//             "authorization": `Token ${token}`,
//         }
//     })
// }

export const check_if_wishlist_chatBot = (input) => {
    const token = localStorage.getItem("token");
    const url = `http://127.0.0.1:8000/chatbot/is_wishlisted/${input}/`
    return axios.get(url,{
        headers: {
            "authorization": `Token ${token}`,
        }
    })
}
export const get_all_wishlist_phone = () => {
    const token = localStorage.getItem("token");
    const url = `http://127.0.0.1:8000/chatbot/wishlisted_phone/`
    return axios.get(url,{
        headers: {
            "authorization": `Token ${token}`,
        }
    });


}


export const like_phone_chatbot = (input) => {
    const token = localStorage.getItem("token");
    const url = `http://127.0.0.1:8000/chatbot/like_phone/${input}/`
    return axios.get(url,{
        headers: {
            "authorization": `Token ${token}`,
        }
    });


}

export const unlike_phone_chatbot = (input) => {
    const token = localStorage.getItem("token");
    const url = `http://127.0.0.1:8000/chatbot/like_phone/${input}/`
    return axios.delete(url,{
        headers: {
            "authorization": `Token ${token}`,
        }
    });


}

export const check_if_like_chatbot = (input) => {
    const token = localStorage.getItem("token");
    const url = `http://127.0.0.1:8000/chatbot/is_liked/${input}/`
    return axios.get(url,{
        headers: {
            "authorization": `Token ${token}`,
        }
    });


}





export const get_user_profile = () => {
    const token = localStorage.getItem("token");
    const url = `http://127.0.0.1:8000/account/profile/`;
    return axios.get(url, {
        headers: {
            "authorization": `Token ${token}`,
        }
    });
}

export const edit_user_profile = (f_name,l_name,username,image) => {
    const token = localStorage.getItem("token");
    const url = `http://127.0.0.1:8000/account/update/`;
    const formData = new FormData();
    formData.append("first_name", f_name);
    formData.append("last_name", l_name);
    formData.append("username", username);
    if (image) formData.append("profile_pic", image);
    return axios.put(url, formData ,{
        headers: {
            "authorization": `Token ${token}`,
        }
    });
}

export const edit_user_profile_password = (input_edit_data) => {
    const token = localStorage.getItem("token");
    const url = `http://127.0.0.1:8000/account/password_update/`;
    return axios.put(url, input_edit_data ,{
        headers: {
            "authorization": `Token ${token}`,
        }
    });
}


// نقدنگار

export const creat_post = (phone, image, content) => {
    const token = localStorage.getItem("token");
    const url = `http://127.0.0.1:8000/naghdnegar/create_post/`;
    const formData = new FormData();
    formData.append("phone", phone);
    if (image) formData.append("image", image);
    formData.append("content", content);
    return  axios.post(url, formData, {
        headers: {
            "authorization": `Token ${token}`,
        }
    });

}
export const feed_post = () => {
    const token = localStorage.getItem("token");
    const url = `http://127.0.0.1:8000/naghdnegar/feed/`;
    return axios.get(url, {
        headers: {
            "authorization": `Token ${token}`,
        }
    })
}


export const get_post = (input) => {
    const token = localStorage.getItem("token");
    const url = `http://127.0.0.1:8000/naghdnegar/get_post/${input}/`;
    return axios.get(url, {
        headers: {
            "authorization": `Token ${token}`,
        }
    })
}

// قبلاً این تابع فقط یه پارامتر (input) می‌گرفت و همونو هم به‌عنوان id پست توی URL،
// هم به‌عنوان مقدار reaction توی بادی می‌فرستاد — که کاملاً اشتباه بود. الان دو تا
// پارامتر جدا می‌گیره: آیدی پست، و مقدار واکنش ("like" یا "dislike").
export const reaction_change_post = (postId, reaction) => {
    const token = localStorage.getItem("token");
    const url = `http://127.0.0.1:8000/naghdnegar/react_post/${postId}/`;
    const data = {
        "reaction" : reaction
    }
    return axios.post(url, data ,{
        headers: {
            "authorization": `Token ${token}`,
        }
    })
}


export const filter_post = (input) => {
    const token = localStorage.getItem("token");
    const url = `http://127.0.0.1:8000/naghdnegar/filter_post/${input}/`
    return axios.get(url, {
        headers: {
            "authorization": `Token ${token}`,
        }
    })
}


export const get_short_phone = (input) => {
    const token = localStorage.getItem("token");
    const url = `http://127.0.0.1:8000/naghdnegar/get_short_phone/${input}/`
    return axios.get(url, {
        headers: {
            "authorization": `Token ${token}`,
        }
    })
}

export const user_profile = () => {
    const token = localStorage.getItem("token");
    const url = `http://127.0.0.1:8000/account/user_profile/`;
    return axios.get(url, {
        headers: {
            "authorization": `Token ${token}`,
        }
    })
}

export const get_comment = (input) => {
    const token = localStorage.getItem("token");
    const url = `http://127.0.0.1:8000/naghdnegar/get_comments/${input}/`
    return axios.get(url, {
        headers: {
            "authorization": `Token ${token}`,
        }
    })
}


export const set_comment = (postId, input) => {
    const token = localStorage.getItem("token");
    const url = `http://127.0.0.1:8000/naghdnegar/comment/${postId}/`;
    return axios.post(url,input, {
        headers: {
            "authorization": `Token ${token}`,
        }
    })
}

// پروفایل عمومیِ یه کاربر دلخواه (نه فقط خودِ کاربر لاگین‌شده) — برای نشون‌دادن
// اسم/عکس نویسنده‌ی هر پست یا کامنت، با آیدی همون کاربر (فیلد "user" که توی
// جواب get_post/get_comments برمی‌گرده).
export const get_poster_profile = (input) => {
    const token = localStorage.getItem("token");
    const url = `http://127.0.0.1:8000/get_profile/${input}/`
    return axios.get(url, {
        headers: {
            "authorization": `Token ${token}`,
        }
    })
}





