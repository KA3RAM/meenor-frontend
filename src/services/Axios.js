import axios from "axios";


export const CHB_send_input_good = (input) => {
    const token = localStorage.getItem("token");
    const url = `http://127.0.0.1:8000/chatbot/search_laptop/?search=${input}`;
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
export const creat_static_good_laptop_details = (input) => {
    const token = localStorage.getItem("token");
    const url = `http://127.0.0.1:8000/chatbot/register_laptop/`;
    return axios.post(url,input,{
        headers: {
            "authorization": `Token ${token}`,
        }
    });
}

export const get_laptop_details = (input) => {
    const token = localStorage.getItem("token");
    const url = `http://127.0.0.1:8000/chatbot/get_laptop/${input}/`;
    return axios.get(url,{
        headers: {
            "authorization": `Token ${token}`,
        }
    });
}

export const add_to_wishlist_chatBot = (input) => {
    const token = localStorage.getItem("token");
    const url = `http://127.0.0.1:8000/chatbot/wishlist_laptop/${input}/`
    return axios.get(url,{
        headers: {
            "authorization": `Token ${token}`,
        }
    });


}
export const get_all_wishlist_laptops = () => {
    const token = localStorage.getItem("token");
    const url = `http://127.0.0.1:8000/chatbot/wishlisted_laptops/`
    return axios.get(url,{
        headers: {
            "authorization": `Token ${token}`,
        }
    });


}


export const like_laptop_chatbot = (input) => {
    const token = localStorage.getItem("token");
    const url = `http://127.0.0.1:8000/chatbot/like_laptop/${input}/`
    return axios.get(url,{
        headers: {
            "authorization": `Token ${token}`,
        }
    });


}

export const unlike_laptop_chatbot = (input) => {
    const token = localStorage.getItem("token");
    const url = `http://127.0.0.1:8000/chatbot/like_laptop/${input}/`
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