<template>
    <div class="card">
        <div class="step-names flex">
                <p>Account</p>
                <p>Trade</p>
                <p>Name</p>
                <p>Details</p>
                <p>About</p>

            </div>

            <div class="progress">
                <template v-for="i in 5">
                    <div :class="store.step >= i ? 'active' : ''"></div>
                </template>
            </div>

            <Register />
            <Trade />
            <Name />
            <Details />
            <About />

    </div>
</template>
<script setup>

import { useAppStore } from '../store/store';
const store = useAppStore();

import Register from './form/Register.vue';
import Trade from './form/Trade.vue';
import Name from './form/Name.vue';
import Details from './form/Details.vue';
import About from './form/About.vue';

</script>