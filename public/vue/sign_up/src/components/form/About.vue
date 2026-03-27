<template>
    <div v-if="store.step === 6">

        <h3>About your business</h3>
        
        <label>Years of experience:</label>
        <input type="number" v-model="store.form.experience">
        <label>Areas you serve:</label>
        <input type="text" placeholder="Areas" v-model="store.form.areas">
        <label>Main services:</label>
        <input type="text" placeholder="Main services" v-model="store.form.services">

        <div class="flex justify-between">
            <button class="btn" @click="store.prev()">Back</button>
            <button class="btn" @click="submit()">Launch My Website</button>
        </div>

    </div>
</template>
<script setup>

import { useAppStore } from '../../store/store';
const store = useAppStore();

const submit = async () => {

    const formData = new FormData();
    formData.append('experience', store.form.experience);
    formData.append('areas', store.form.areas);
    formData.append('mainServices', store.form.services);
    
    const response = await fetch('/api/set-about', {
        method : 'post',
        body: formData
    });

   

    window.location = '/generate-website';

}

</script>