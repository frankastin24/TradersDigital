<template>
 <div class="flex justify-center interval">
            <input v-model="store.form.billing" type="radio" id="monthly" value="monthly" name="billing">
            <label for="monthly">Monthly</label>

            <input v-model="store.form.billing" type="radio" id="annually" value="annually" name="billing">
            <label for="annually">Annually (save 25%)</label>
        </div>
</template>

<script setup>
import { useAppStore } from '../store/store';
const store = useAppStore();

</script>