<template>
    <div class="job-description">
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
        <button @click="store.appState = 'change-job-date'">Change Date</button>
        
        <p><strong>Duration:</strong></p>
        <p>{{ store.selectedJob.duration }}</p> 
        <button @click="store.appState = 'change-job-duration'">Change Duration</button>
        
        <p><strong>Description:</strong></p>
        <p>{{ store.selectedJob.description }}</p>
        <button @click="store.appState = 'edit-job-description'">Edit Description</button>

        <p><strong>Notes:</strong></p>
        <p>{{ store.selectedJob.notes }}</p>
        <button @click="store.appState = 'edit-job-notes'">Edit Notes</button>
        
        <button @click="store.appState = 'home'">Back to Home</button>
    </div>
</template>