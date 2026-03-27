<template>
    <div class="job-description">
        <template v-if="store.selectedJob">
        <h1>Job Details</h1>

        <p><strong>Job ID:</strong> {{ store.selectedJob.id }}</p>

        <p><strong>Job Status:</strong></p>

        <select v-model="store.selectedJob.status" @change="updateJobStatus">
            <option value="scheduled">Scheduled</option>
            <option value="in-progress">In Progress</option>
            <option value="invoiced">Invoiced</option>
            <option value="overdue">Overdue</option>
            <option value="paid">Paid</option>
        </select>
        
        <p><strong>Customer:</strong> {{ store.selectedJob.customer.name }}</p>
        <button @click="store.appState = 'customerDetails'; store.selectedCustomer = store.selectedJob.customer">View Customer Details</button>

        <p><strong>Address:</strong></p>
        <p>{{ store.selectedJob.customer.address }}</p>

        <p><strong>Date:</strong></p>
        <p>{{ store.selectedJob.date }}</p> 
        <button @click="store.appState = 'changeJobDate'">Change Date</button>
        
        <p><strong>Duration:</strong></p>
        <p>{{ store.selectedJob.duration }}</p> 
        <button @click="store.appState = 'home'">Change Duration</button>
        
        <p><strong>Description:</strong></p>
        <p>{{ store.selectedJob.description }}</p>
        <button @click="store.appState = 'home'">Edit Description</button>

        <p><strong>Notes:</strong></p>
        <p>{{ store.selectedJob.notes }}</p>
        <button @click="store.appState = 'home'">Edit Notes</button>
        
        <button @click="store.appState = 'home'">Back to Home</button>
        </template>
        <p v-else>No job selected.</p>
    </div>
</template>

<script setup>
import { useAppStore } from '../store/store';

const store = useAppStore();

const updateJobStatus = () => {
    if (!store.selectedJob) return;
    store.updateSelectedJobStatus(store.selectedJob.status);
};
</script>