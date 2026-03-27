<template>
    <div class="add-customer">
        <h1>Add Customer</h1>
        <form @submit.prevent="addCustomer">
            <label for="name">Name:</label>
            <input type="text" id="name" v-model="name" required>

            <label for="email">Email:</label>
            <input type="email" id="email" v-model="email" required>

            <label for="phone">Phone:</label>
            <input type="tel" id="phone" v-model="phone">

            <label for="address">Address:</label>
            <textarea id="address" v-model="address"></textarea>

            <label for="notes">Notes:</label>
            <textarea id="notes" v-model="notes"></textarea>

            <button type="submit">Add Customer</button>
        </form>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import { useAppStore } from '../store/store';
const store = useAppStore();    

const name = ref('');
const email = ref('');
const phone = ref('');
const address = ref('');
const notes = ref(''); 

const addCustomer = async () => {

    const newCustomer = {
        id: Date.now(),
        name: name.value,
        email: email.value,
        phone: phone.value,
        address: address.value,
        notes: notes.value
    };

    try {
        await store.addCustomer(newCustomer);
        store.setAppState('customers');
    } catch (error) {
        alert(error.message || 'Failed to add customer');
    }
}

</script>