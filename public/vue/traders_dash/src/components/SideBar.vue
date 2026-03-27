<template>
<aside class="sidebar">
    <button @click="store.appState = 'home'">Home</button>
    <button @click="store.appState = 'customers'">Customers</button>
    <button @click="store.appState = 'jobs'">Jobs</button>
    <button @click="store.appState = 'services'">Services</button>
    <button @click="store.appState = 'settings'">Settings</button>
</aside>

</template>

<script setup>
import { useAppStore } from '../store/store';
const store = useAppStore();
</script>