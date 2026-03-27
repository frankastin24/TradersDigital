<template>
    <div class="jobs">
        <h1>All Jobs</h1>

        <div v-for="job in store.upcomingJobs.concat(store.newJobs)" :key="job.id" class="job-card">
            <p><strong>Customer:</strong> {{ job.customerName }}</p>
            <p><strong>Date:</strong> {{ job.date }}</p>
            <button @click="store.selectJob(job)">View Details</button>
        </div>
         
        <p v-if="store.upcomingJobs.concat(store.newJobs).length === 0">You have no jobs.</p>
    </div>
</template>

<script setup>
import { useAppStore } from '../store/store';
const store = useAppStore();
</script>   