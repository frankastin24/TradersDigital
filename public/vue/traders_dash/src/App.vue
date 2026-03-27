<template>
    <div class="traders_dash">
        <SideBar />
        <div class="main-content">
            <Home v-if="store.appState === 'home'" />
            <Customers v-if="store.appState === 'customers'" />
            <Customer v-if="store.appState === 'customerDetails'" />
            <AddCustomer v-if="store.appState === 'addCustomer'" />
            <Jobs v-if="store.appState === 'jobs'" />
            <JobDescription v-if="store.appState === 'jobDetails'" />
            <ChangeJobDate v-if="store.appState === 'changeJobDate'" />
            <Services v-if="store.appState === 'services'" />
            <Settings v-if="store.appState === 'settings'" />
        </div> 
    </div>
</template>

<script setup>
import { onMounted } from 'vue';
import { useAppStore } from './store/store';
import SideBar from './components/SideBar.vue';
import Home from './components/Home.vue';
import Customers from './components/Customers.vue';
import Customer from './components/Customer.vue';
import AddCustomer from './components/AddCustomer.vue';
import Jobs from './components/Jobs.vue';
import JobDescription from './components/JobDescription.vue';
import ChangeJobDate from './components/ChangeJobDate.vue';
import Services from './components/Services.vue';
import Settings from './components/Settings.vue';

const store = useAppStore();

onMounted(async () => {
    await store.initialize();
});

</script>
