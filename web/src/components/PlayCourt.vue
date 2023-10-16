<template>
    <div class="playcourt">
        <GameMap />
    </div>
    
</template>

<script>
import GameMap from './GameMap.vue'

export default {
    components: {
        GameMap,
    }
}
</script>

<style scoped>
div.playcourt {
    width: 60vw;
    height: 70vh;
    margin: 40px auto;

}
</style>