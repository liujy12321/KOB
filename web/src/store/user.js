/* 
全局信息：需要存当前的用户是谁
主要会存以下信息:
state：存用户的信息，jwt token以及login状态
getters：一般用不到
mutations：修改数据，辅助函数updateUser：将存入的user信息放入state中；updateToken：将token的信息放入state中 */
import $ from 'jquery'
export default {
    state: {
        id: "",
        username: "",
        image: "",
        token: "",
        is_login: false,
    },
    getters: {
    },
    mutations: {
        updateUser(state, user) {
            state.id = user.id;
            state.username = user.username;
            state.image = user.image;
            state.is_login = user.is_login;
        },
        updateToken(state, token) {
            state.token = token;
        }
    },
    actions: {
        login(context, data) {
            $.ajax({
                url: "http://localhost:3000/user/account/token/",
                type: "post",
                data: {
                  username: data.username,
                  password: "password_jimmy",
                },
                success(resp) {
                  console.log(resp);
                },
                error(resp) {
                  console.log(resp);
                }
            });
        }
    },
    modules: {
    }
}