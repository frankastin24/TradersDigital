<template>
	<div class="change-job-date">
		<h1>Change Job Date</h1>
		<template v-if="store.selectedJob">
			<p><strong>Job:</strong> {{ store.selectedJob.customerName }}</p>
			<input type="date" v-model="newDate" />
			<div class="flex gap-2">
				<button @click="save">Save</button>
				<button @click="store.setAppState('jobDetails')">Cancel</button>
			</div>
		</template>
		<p v-else>No job selected.</p>
	</div>
</template>

<script setup>
import { ref } from 'vue';
import { useAppStore } from '../store/store';

const store = useAppStore();
const newDate = ref(store.selectedJob?.date || '');

const save = () => {
	if (!newDate.value) return;
	store.updateSelectedJobDate(newDate.value);
	store.setAppState('jobDetails');
};
</script>
