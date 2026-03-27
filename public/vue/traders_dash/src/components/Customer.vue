<template>
    <div class="customer">
        <template v-if="store.selectedCustomer">
        <h1>Customer Details</h1>
        <p><strong>Name:</strong> {{ store.selectedCustomer.name }}</p>
        <p><strong>Email:</strong> {{ store.selectedCustomer.email }}</p>
        <p><strong>Phone:</strong> {{ store.selectedCustomer.phone }}</p>
        <p><strong>Address:</strong> {{ store.selectedCustomer.address }}</p>
        <p><strong>Notes:</strong> {{ store.selectedCustomer.notes }}</p>
        </template>
        <p v-else>No customer selected.</p>
        
        <button @click="store.appState = 'customers'">Back to Customers</button>

    </div>
</template>

<script setup>
import { useAppStore } from '../store/store';
const store = useAppStore();
</script>