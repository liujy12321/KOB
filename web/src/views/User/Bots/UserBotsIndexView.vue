<template>
    <ContentField>
        My bots
    </ContentField>
</template>

<script>
import ContentField from '../../../components/ContentField.vue'
import $ from 'jquery'
import { useStore } from 'vuex'

export default {
    components: {
        ContentField
    },
    setup() {
        const store = useStore();
        // $.ajax ({
        //     url: "http://localhost:3000/user/bot/add/",
        //     type: "POST",
        //     data: {
        //         title: "the title of the bot",
        //         description: "the description of the bot",
        //         content: "the content of the bot",
        //     },
        //     headers: {
        //         Authorization: "Bearer " + store.state.user.token,
        //     },
        //     success(resp) {
        //         console.log(resp);
        //     },
        //     error(resp) {
        //         console.log(resp);
        //     }
        // })

        // $.ajax ({
        //     url: "http://localhost:3000/user/bot/remove/",
        //     type: "POST",
        //     data: {
        //         bot_id: 3,
        //     },
        //     headers: {
        //         Authorization: "Bearer " + store.state.user.token,
        //     },
        //     success(resp) {
        //         console.log(resp);
        //     },
        //     error(resp) {
        //         console.log(resp);
        //     }
        // })

        $.ajax ({
            url: "http://localhost:3000/user/bot/update/",
            type: "POST",
            data: {
                bot_id: 4,
                title: "bot number 5",
                description: "the description of bot No.5",
                content: "the content of bot No.5",
            },
            headers: {
                Authorization: "Bearer " + store.state.user.token,
            },
            success(resp) {
                console.log(resp);
            },
            error(resp) {
                console.log(resp);
            }
        })
    }
}
</script>

<style scoped>

</style>