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

export const edit_user_profile = (input_edit_data) => {
    const token = localStorage.getItem("token");
    const url = `http://127.0.0.1:8000/account/update/`;
    return axios.put(url, input_edit_data ,{
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

export const creat_post = (phone, image, title, content) => {
    const token = localStorage.getItem("token");
    const url = ` http://127.0.0.1:8000/naghdnegar/create_post/ `;
    const formData = new FormData();
    formData.append("phone", phone);
    formData.append("image", image);
    formData.append("title", "nothing to say");
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

export const reaction_change_post = (input) => {
    const token = localStorage.getItem("token");
    const url = `http://127.0.0.1:8000/naghdnegar/react_post/${input}/`;
    const data = {
        "reaction" : input
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









