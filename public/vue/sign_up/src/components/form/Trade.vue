<template>
  <div v-if="store.step === 3">
    <h3>Select Trade</h3>

    <input
      class="search"
      type="text"
      v-model="searchString"
      @input="search"
      placeholder="Search for your trade..."
    />

    <!-- SEARCH RESULTS -->
    <div v-if="businessTypeState === 'search'">
      <button class="btn-small" @click="backToTypes">← Back To Trade Categories</button>

      <div class="flex justify-center flex-wrap">
        <div
          v-for="trade in searchResults"
          :key="trade"
          class="trade-option"
          @click="selectTrade(trade)"
        >
          {{ trade }}
        </div>
      </div>
    </div>

   

    <!-- TRADES IN A TYPE -->
    <div v-else-if="businessTypeState === 'trades'">
      
      <div class="flex justify-center flex-wrap">
        <div
          v-for="trade in popularTrades"
          :key="trade"
          class="trade-option"
          @click="selectTrade(trade)"
        >
          {{ trade }}
        </div>
      </div>
    </div>

    <div class="flex justify-between">
      <button class="btn" @click="prev">Back</button>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from "vue";
import { useAppStore } from "../../store/store";

const store = useAppStore();

const businessTypeState = ref("trades"); // 'types' | 'trades' | 'search'
const searchString = ref("");
const currentTrades = ref([]);
const searchResults = ref([]);
const trades = ref({});

const popularTrades = [
  "Builder",
  "Plumber",
  "Electrician (Domestic)",
  "Carpenter",
]

const tradeTypes = [
  "Construction & Building Trades",
  "Plumbing & Heating",
  "Electrical",
  "Carpentry & Joinery",
  "Roofing & Exteriors",
  "Finishing Trades",
  "Landscaping & Outdoor",
  "HVAC & Specialist Systems",
  "Windows, Doors & Glazing",
  "Cleaning & Maintenance Trades",
  "Specialist & Compliance",
  "Infrastructure & Utilities",
  "Commercial & Industrial Trades"
];

onMounted(() => {
 
  const response = await fetch('/data/trades.json');
  const data = await response.json();
  trades.value = data;

});

function search() {
  const q = (searchString.value || "").trim().toLowerCase();

  if (!q) {
    searchResults.value = [];
    businessTypeState.value = "trades";
    return;
  }

  const results = [];
  for (const type of tradeTypes) {
    for (const trade of trades[type] || []) {
      if (trade.toLowerCase().includes(q)) results.push(trade);
    }
  }

  if(results.length > 4) {
    const deletecount = results.length - 4;
    results.splice(4,deletecount);
  }

  searchResults.value = [...new Set(results)];
  businessTypeState.value = "search";
}


const selectTrade = async (trade) => {
  store.form.trade = trade;
  const formData = new FormData();
  formData.append('trade',store.form.trade);

  const response = await fetch('/api/set-trade', {
    method:'post',
    body : formData
  }) 

  store.next();
}

function backToTypes() {
  businessTypeState.value = "types";
  currentTrades.value = [];
  // keep searchString as-is (or clear it if you prefer)
}

function prev() {
  store.prev?.();
  // or: store.step-- (depends on how your store is written)
}
</script>