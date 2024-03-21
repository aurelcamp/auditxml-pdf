<script setup lang="ts">
import { ref } from 'vue';

const val = ref(42)
</script>

<template>
    <div class="bloc1">
        Voici le bloc1 avec la valeur {{ val }}
    </div>
</template>

<style>
.bloc1 {
    border: 2px solid red;
}
</style>