<template>
    <div v-if="store.step === 5">

        <h3>About your business</h3>
        <p>Please write a brief description and history of your business for the About Us page.</p>

        <textarea class="trade-description" v-model="store.form.description"></textarea>


        <div class="flex justify-between">
            <button class="btn" @click="store.prev()">Back</button>
            <button class="btn" @click="submit()">Create Account</button>
        </div>
    </div>
</template>
<script setup>

import { useAppStore } from '../../store/store';
const store = useAppStore();

</script>