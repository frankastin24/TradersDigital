<template>
    <div class="settings">
        
        <h1>Settings</h1>

        <p>Manage your account settings here.</p>

        <div class="email">
            <h2>Change Email</h2>
            <input type="email" v-model="email" placeholder="New Email">
            <button @click="changeEmail">Update Email</button>  
        </div>

        <div class="password">
            <h2>Change Password</h2>
            <input type="password" v-model="currentPassword" placeholder="Current Password">
            <input type="password" v-model="newPassword" placeholder="New Password">
            <button @click="changePassword">Update Password</button>        
        </div>

        <button @click="store.setAppState('home')">Back</button>

    </div>
</template>

<script setup>
import { ref } from 'vue';
import { useAppStore } from '../store/store';

const store = useAppStore();

const email = ref('');
const currentPassword = ref('');
const newPassword = ref('');

const changeEmail = () => {
    if (!email.value) return;
    store.changeEmail(email.value)
        .then(() => {
            alert('Email updated');
            email.value = '';
        })
        .catch((error) => {
            alert(error.message || 'Failed to update email');
        });
};

const changePassword = () => {
    if (!currentPassword.value || !newPassword.value) return;
    store.changePassword(currentPassword.value, newPassword.value)
        .then(() => {
            alert('Password updated');
            currentPassword.value = '';
            newPassword.value = '';
        })
        .catch((error) => {
            alert(error.message || 'Failed to update password');
        });
};
</script>