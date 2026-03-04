<template>
    <div v-if="store.step === 4">
        <h3>Business Details</h3>
        <input type="text" placeholder="Location (Town/City)" v-model="store.form.location">
        <input type="number" placeholder="Years in business" v-model="store.form.years">
        <input type="text" placeholder="Phone Number" v-model="store.form.phone">
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