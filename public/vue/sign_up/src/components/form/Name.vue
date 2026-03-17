<template>
    <div v-if="store.step === 4">
        
        <h3>Business Name</h3>
        
        <input type="text" placeholder="Enter your Business's Name" v-model="store.form.businessName">
        
        <div class="flex justify-between">
            <button class="btn" @click="store.prev()">Back</button>
            <button class="btn" @click="saveName">Next</button>
        </div>

    </div>
</template>
<script setup>

import { useAppStore } from '../../store/store';
const store = useAppStore();

const saveName = async (trade) => {
  
  const formData = new FormData();
  formData.append('businessName',store.form.businessName);

  const response = await fetch('/api/set-name', {
    method:'post',
    body : formData
  }) 

  store.next();
}

</script>