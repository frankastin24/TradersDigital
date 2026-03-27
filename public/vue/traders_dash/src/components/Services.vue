<template>

    <div class="services">
        <h1>Services</h1>
        <header>
            <div class="check-box">
            <input v-model="displayPrices" type="checkbox"/>
            <label for="displayPrices">Display Prices On Website</label>
            </div>
        </header>

        <div class="service-list">
            <div class="service" v-for="(service, index) in store.services" :key="index">
                <input type="text" v-model="service.name" placeholder="Service Name"/>
                <textarea v-model="service.description" placeholder="Service Description"></textarea>
                <input type="number" v-model="service.minPrice" placeholder="Min Price"/>
                <input type="number" v-model="service.maxPrice" placeholder="Max Price"/>
                
                <div class="checkbox">
                    <input type="checkbox" v-model="service.featured"/>
                    <label for="featured">Feature Service On Homepage</label>
                </div>

                <button class="btn-small" @click="removeService(index)">Remove</button>
            </div>  
        </div>

        <div class="flex gap-2">
            <button class="btn" @click="store.addService()">Add Service</button>
            <button class="btn" @click="saveServices">Save Services</button>
            <button class="btn" @click="store.setAppState('home')">Back</button>
        </div>
    </div>

</template>

<script setup>
import { computed } from 'vue';
import { useAppStore } from '../store/store';

const store = useAppStore();

const displayPrices = computed({
    get: () => store.displayPrices,
    set: (value) => {
        store.updateDisplayPrices(value).catch((error) => {
            alert(error.message || 'Failed to save preference');
        });
    }
});

const removeService = (index) => {
    store.removeService(index).catch((error) => {
        alert(error.message || 'Failed to remove service');
    });
};

const saveServices = async () => {
    try {
        await store.saveServices();
        alert('Services saved');
    } catch (error) {
        alert(error.message || 'Failed to save services');
    }
};
</script>