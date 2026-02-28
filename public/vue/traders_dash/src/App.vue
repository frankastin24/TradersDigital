<template>
    <div class="traders_dash">
        <SideBar />
        <div class="main-content">
            <Home v-if="store.appState === 'home'" />
            <Calendar v-if="store.appState === 'calendar'" />
            <Customers v-if="store.appState === 'customers'" />
            <Customer v-if="store.appState === 'customerDetails'" />
            <AddCustomer v-if="store.appState === 'addCustomer'" />
            <Jobs v-if="store.appState === 'jobs'" />
            <JobDescription v-if="store.appState === 'jobDetails'" />
            <Invoices v-if="store.appState === 'invoices'" />
            <Settings v-if="store.appState === 'settings'" />
        </div> 
    </div>
</template>

<script setup>

import { onMounted, ref } from 'vue';

const courses = ref([]);

const searchQuery = ref('');

onMounted(async () => {

   
    const json = await response.json();

    templates.value = json;

})



</script>
