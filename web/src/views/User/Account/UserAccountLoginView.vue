<template>
    <ContentField>
        <!-- 
            bootstrap里的：
            grid：横纵分成12份，放到中间3份
            justify:居中
            form：
                表单，和submit绑定，submit.prevent表示非默认行为，一旦点击则触发login
                v-model：和username和password绑定，这样输入的值就和setup()的username和password对应起来了
            button：提交按钮
         -->
        <div class="row justify-content-md-center">
            <div class="col-3">
                <form @submit.prevent="login">
                    <div class="mb-3">
                        <label for="username" class="form-label">Username</label>
                        <input v-model="username" type="text" class="form-control" id="username" aria-describedby="Please enter the Username">
                    </div>
                    <div class="mb-3">
                        <label for="password" class="form-label">Password</label>
                        <input v-model="password" type="password" class="form-control" id="password" aria-describedby="Please enter the Password">
                    </div>
                    <div class="error-message">{{ error_message }}</div>
                    <button type="submit" class="btn btn-primary">Submit</button>
                </form>
            </div>
        </div>
    </ContentField>
</template>

<script>
import ContentField from '../../../components/ContentField.vue' //在account文件夹下，所以多了一层目录
import { useStore } from 'vuex' //引入全局变量
import { ref } from 'vue' //引入变量
import router from '@/router/index'

export default {
    components: {
        ContentField
    },
    setup() {
        const store = useStore(); //取出全局变量
        let username = ref(''); //一开始是空的
        let password = ref('');
        let error_message = ref('');

        /* 
        如果点击了就会触发这个函数，需要和form表单绑定起来
        如果想调用全局中actions里的函数，需要用dispatch
        dispatch：取login函数，需要获得username和password的value，查看获取的结果
         */
        const login = () => {
            error_message.value = ""; //每次提交都需要清空error_message
            store.dispatch("login", {
                username: username.value,
                password: password.value,
                success() {
                    store.dispatch("getinfo", { //更新用户信息
                        success() {
                            router.push({ name: 'home'}); //登录成功后跳转到主界面
                            console.log(store.state.user);
                        }
                    })
                },
                error() {
                    error_message.value = "Username or password is not correct";
                }
            })
        }

        return {
            username,
            password,
            error_message,
            login,
        }

    }
}
</script>

<style scoped>
/* 调整button，让它占满 */
button {
    width: 100%;
}
div.error-message {
    color: red;
}

</style>