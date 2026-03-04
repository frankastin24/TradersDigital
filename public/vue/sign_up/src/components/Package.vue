<template>
    <div class="pricing-grid">

            <div @click="store.form.package = 'basic'" class="pricing-card">
                <h4 v-if="store.form.package === 'basic'" class="selected-badge">Selected</h4>
                <h3>Basic</h3>
                <h4>Free for 7 days</h4>
                <p>then £<span>{{amount('basic')}}</span>/mo</p>

                <button v-if="store.form.package === 'professional'" class="btn-primary">Select</button>
            </div>

            <div @click="store.form.package = 'professional'" class=" pricing-card highlight">
                <h4 v-if="store.form.package === 'professional'" class="selected-badge">Selected</h4>
                <h3>Professional</h3>
                <h4>Free for 7 days</h4>
                <p>then £<span x-text="">{{amount('professional')}}</span>/mo</p>
                <button v-if="store.form.package === 'basic'" class="btn-primary">Select</button>
            </div>
        </div>
</template>

<script setup>

import { useAppStore } from '../store/store';
const store = useAppStore();

const prices = {
    professional : {
        monthly : 65,
        annually : 49
    },
    basic : {
        monthly:25,
        annually:19
    }
}

const amount = (plan) => {

    return prices[plan][store.form.billing];

}


</script>