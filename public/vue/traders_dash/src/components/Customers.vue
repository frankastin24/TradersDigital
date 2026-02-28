<template>
    <div class="customers">
        <h1>Customers</h1>
        <div v-for="customer in store.customers" :key="customer.id" class="customer-card">
            <p><strong>Name:</strong> {{ customer.name }}</p>
            <p><strong>Email:</strong> {{ customer.email }}</p>
            <button @click="store.appState = 'customerDetails'; store.selectedCustomer = customer">View Details</button>
        </div>
        <p v-if="store.customers.length === 0">You have no customers yet.</p>
        <button @click="store.appState = 'addCustomer'">Add Customer</button>
    </div>
</template>

<script setup>
import { useAppStore } from '../store/store';   
const store = useAppStore();
</script>