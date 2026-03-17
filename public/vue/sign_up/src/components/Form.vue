<template>
    <div class="card">
            <Register />
            <Password />
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
import Password from './form/Password.vue';

</script>