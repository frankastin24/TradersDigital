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

    </div>
</template>