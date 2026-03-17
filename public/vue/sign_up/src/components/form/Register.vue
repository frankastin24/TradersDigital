<template>
    <div v-if="store.step == 1">

        <h3>Start your free trail today</h3>

        <input name="email" type="email" @input="displayEmailError = false" placeholder="Email Address" v-model="store.form.email">
        <p class="error" v-if="displayEmailError">{{ emailError }}</p>

       
        <button class="register-button" @click="createAccount">Continue With Email</button>

        <button class="register-button" id="register-with-fb">Continue With Facebook</button>
        <button class="register-button" id="register-with-google">Continue With Google</button>
       
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

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    // Minimum 6 characters, at least 1 special character
   
    let isValid = true;

    // Validate email
    if (!emailRegex.test(store.form.email)) {
        displayEmailError.value = true;
        isValid = false;
    } else {
        displayEmailError.value = false;
    }

    // Validate password
   

    if (isValid) {

        const formData = new FormData();
        formData.append('email',store.form.email)
        formData.append('package', store.form.package);
        formData.append('billing', store.form.billing);
        
        const response = await fetch('/api/create-user', {
            method: 'POST',
            body: formData
        });

        const json = await response.json();

        store.next();
    
    }

}


</script>