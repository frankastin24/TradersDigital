<template>
    <div v-if="store.step == 2">
        <h3>Enter your password</h3>
     <input name="password" type="password" @input="displayPasswordError = false" placeholder="Enter Password" v-model="store.form.password">
     <p class="error" v-if="displayPasswordError">Minimum 6 characters, at least 1 special character</p>
     
      <div class="flex justify-between">
            <button class="btn" @click="store.prev()">Back</button>
            <button class="btn" @click="setPassword">Next</button>
        </div>
    </div>
</template>

<script setup>
import { useAppStore } from '../../store/store';
import { ref } from 'vue';
const store = useAppStore();
const displayPasswordError = ref(false);

const  setPassword = async () => {
    let isValid = true;

    const strongPasswordRegex = /^(?=.*[!@#$%^&*(),.?":{}|<>]).{6,}$/;

    if (!strongPasswordRegex.test(store.form.password)) {
        displayPasswordError.value = true;
        isValid = false;
    } else {
        displayPasswordError.value = false;
    }

    if (!isValid) {
        return;
    }

    const formData = new FormData();
    formData.append('password',store.form.password)

    const response = await fetch('/api/set-password', {
        method : 'post',
        body : formData
    })

    const json = await response.json();

    if(json.passwordSet) {
        store.next();
    }

    if(json.passwordIncorrect) {
        alert('This email is already registered but the password you entered is incorrect');
    }

    if(json.regComplete) {
        window.location = '/dash';
    } else {
        let step = 3;

        if(json.trader.trade) {
            step = 4;
        }

        if(json.trader.businessName) {
            step = 5;
        }

        const stepFiveComplete = json.trader.city && json.trader.phoneNumber;

        if(stepFiveComplete) {
            step = 6;
        }

        store.step = step;
    }

}
</script>