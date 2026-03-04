<template>
    <div v-if="store.step === 3">
        
        <h3>Business Name</h3>
        
        <input type="text" placeholder="Business Name" v-model="store.form.businessName">
        
        <div class="flex justify-between">
            <button class="btn" @click="store.prev()">Back</button>
            <button class="btn" @click="store.next()">Next</button>
        </div>

    </div>
</template>
<script setup>

import { useAppStore } from '../../store/store';
const store = useAppStore();

</script>