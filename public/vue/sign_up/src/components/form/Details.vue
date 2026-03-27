<template>
    <div v-if="store.step === 5">
        <h3>Business Details</h3>
        <input type="text" placeholder="Location (Town/City)" v-model="store.form.city">
        <input type="text" placeholder="Phone Number" v-model="store.form.phoneNumber">
        <div class="flex justify-between">
            <button class="btn" @click="store.prev()">Back</button>
            <button class="btn" @click="saveDetails">Next</button>
        </div>
    </div>
</template>
<script setup>

import { useAppStore } from '../../store/store';
const store = useAppStore();

const saveDetails = async () => {
  
  const formData = new FormData();
  
  formData.append('city',store.form.city);
  formData.append('phoneNumber',store.form.phoneNumber);

  const response = await fetch('/api/set-details', {
    method:'post',
    body : formData
  }) 

  store.next();

}

</script>