<template>
    <div class="home">
        
        <h1>Welcome {{ store.user.firstName }}</h1>

        <div class="home-section">
            <h2>Upcoming Jobs</h2>

            <div v-for="job in store.upcomingJobs" :key="job.id" class="job-card">
                <p><strong>Customer:</strong> {{ job.customerName }}</p>
                <p><strong>Date:</strong> {{ job.date }}</p>
                <button @click="store.selectJob(job)">View Details</button>
            </div>
             
            <p v-if="store.upcomingJobs.length === 0">You have no upcoming jobs.</p>
        </div>

        <div class="home-section new-jobs">
            <h2>New Jobs</h2>

            <div v-for="job in store.newJobs" :key="job.id" class="job-card">
                <p><strong>Customer:</strong> {{ job.customerName }}</p>
                <p><strong>Date:</strong> {{ job.date }}</p>
                <button @click="store.selectJob(job)">View Details</button>
            </div>
             
            <p v-if="store.newJobs.length === 0">You have no new jobs.</p>
        </div>

    </div>
</template>

<script setup>

import { useAppStore } from '../store/store';
const store = useAppStore();    

</script>