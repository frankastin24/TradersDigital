<template>
    <div v-if="store.step == 1">

        <h3>Register</h3>

        <input type="email" @input="displayEmailError = false" placeholder="Email Address" x-model="form.email">
        <p class="error" v-if="displayEmailError">{{ emailError }}</p>

        <input type="password" @input="displayPasswordError = false" placeholder="Password" v-model="store.form.password">
        <p class="error" v-if="displayPasswordError">{{ passwordError }}</p>

        <button class="register-button" @click="createAccount">Continue With Email</button>

        <button class="register-button" id="register-with-fb">Continue With Facebook</button>
        <button class="register-button" id="register-with-google">Continue With Google</button>
        <button class="register-button" id="register-with-apple">Continue With Apple</button>

        <button class="register-button" @click="next">No Email Address?</button>

    </div>
</template>
<script setup>

import { useAppStore } from '../../store/store';
import { ref } from 'vue';
const store = useAppStore();

const emailError = ref('Please enter a valid email address');
const displayEmailError = ref(false);

const passwordError = ref('Minimum 6 characters, at least 1 special character')
const displayPasswordError = ref(false);

const createAccount = async () => {
    // Proper RegExp objects (NOT strings)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    // Minimum 6 characters, at least 1 special character
    const strongPasswordRegex = /^(?=.*[!@#$%^&*(),.?":{}|<>]).{6,}$/;

    let isValid = true;

    // Validate email
    if (!emailRegex.test(store.form.email)) {
        displayEmailError.value = true;
        isValid = false;
    } else {
        displayEmailError.value = false;
    }

    // Validate password
    if (!strongPasswordRegex.test(store.form.password)) {
        displayPasswordError.value = true;
        isValid = false;
    } else {
        displayPasswordError.value = false;
    }

    if (isValid) {
        
        const response = await fetch('/api/createUser', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: store.form.email,
                password: store.form.password
            })
        });

        const json = await response.json();

        if(json.error) {
            alert(json.message)
        } else {
            store.next();
        }
    }



}


</script>