<template>

    <div class="services">
        <h1>Services</h1>
        <header>
            <div class="check-box">
            <input v-model="displayPrices" type="checkbox"/>
            <label for="displayPrices">Display Prices On Website</label>
            </div>
        </header>

        <div class="service-list">
            <div class="service" v-for="(service, index) in services" :key="index">
                <input type="text" v-model="service.name" placeholder="Service Name"/>
                <textarea v-model="service.description" placeholder="Service Description"></textarea>
                <input type="number" v-model="service.minPrice" placeholder="Min Price"/>
                <input type="number" v-model="service.maxPrice" placeholder="Max Price"/>
                
                <div class="checkbox">
                    <input type="checkbox" v-model="service.featured"/>
                    <label for="featured">Feature Service On Homepage</label>
                </div>

                <button class="btn-small" @click="removeService(index)">Remove</button>
            </div>  
    </div>

</template>