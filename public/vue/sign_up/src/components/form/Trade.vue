<template>
  <div v-if="store.step === 2">
    <h3>Select Trade</h3>

    <input
      class="search"
      type="text"
      v-model="searchString"
      @input="search"
      placeholder="Search..."
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

    <!-- TYPES -->
    <div v-else-if="businessTypeState === 'types'" class="flex flex-wrap trade-types justify-center">
      <div
        v-for="type in tradeTypes"
        :key="type"
        class="trade-option"
        @click="selectTradeType(type)"
      >
        {{ type }}
      </div>
    </div>

    <!-- TRADES IN A TYPE -->
    <div v-else-if="businessTypeState === 'trades'">
      <button class="btn-small" @click="backToTypes">← Back</button>

      <div class="flex justify-center flex-wrap">
        <div
          v-for="trade in currentTrades"
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
import { ref } from "vue";
import { useAppStore } from "../../store/store";

const store = useAppStore();

const businessTypeState = ref("types"); // 'types' | 'trades' | 'search'
const searchString = ref("");
const currentTrades = ref([]);
const searchResults = ref([]);

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

const trades = {
  "Construction & Building Trades": [
    "Builder",
    "Bricklayer",
    "Stonemason",
    "Groundworker",
    "Demolition Contractor",
    "Scaffolder",
    "Steel Erector",
    "Concrete Specialist",
    "Cladder",
    "Shopfitter",
    "Property Developer",
    "Loft Conversion Specialist",
    "Basement Conversion Specialist"
  ],
  "Plumbing & Heating": [
    "Plumber",
    "Heating Engineer",
    "Gas Engineer",
    "Boiler Installer",
    "Boiler Repair Specialist",
    "Drainage Engineer",
    "Drain Unblocking Specialist",
    "Bathroom Installer",
    "Wet Room Specialist",
    "Underfloor Heating Installer",
    "Oil Heating Engineer"
  ],
  "Electrical": [
    "Electrician (Domestic)",
    "Electrician (Commercial)",
    "Electrical Contractor",
    "EV Charger Installer",
    "Solar Panel Installer",
    "CCTV Installer",
    "Fire Alarm Installer",
    "Security System Installer",
    "Smart Home Installer",
    "PAT Testing Engineer",
    "Data Cabling Engineer"
  ],
  "Carpentry & Joinery": [
    "Carpenter",
    "Joiner",
    "Kitchen Fitter",
    "Cabinet Maker",
    "Staircase Specialist",
    "Shopfitting Joiner",
    "Timber Frame Specialist"
  ],
  "Roofing & Exteriors": [
    "Roofer",
    "Flat Roofing Specialist",
    "Leadwork Specialist",
    "Guttering Specialist",
    "Fascia & Soffit Installer",
    "Chimney Specialist",
    "Thatched Roof Specialist",
    "Cladding Installer"
  ],
  "Finishing Trades": [
    "Plasterer",
    "Renderer",
    "Dry Liner",
    "Screeder",
    "Tiler (Wall & Floor)",
    "Floor Layer",
    "Vinyl Floor Installer",
    "Carpet Fitter",
    "Painter & Decorator",
    "Wallpaper Specialist"
  ],
  "Landscaping & Outdoor": [
    "Landscaper",
    "Gardener",
    "Tree Surgeon",
    "Arborist",
    "Fencing Contractor",
    "Decking Installer",
    "Driveway Installer",
    "Paving Specialist",
    "Artificial Grass Installer",
    "Grounds Maintenance Contractor"
  ],
  "HVAC & Specialist Systems": [
    "HVAC Engineer",
    "Air Conditioning Installer",
    "Ventilation Specialist",
    "Refrigeration Engineer",
    "Commercial Kitchen Installer",
    "Ductwork Installer"
  ],
  "Windows, Doors & Glazing": [
    "Double Glazing Installer",
    "Window Fitter",
    "Door Installer",
    "Conservatory Installer",
    "Glazier",
    "Locksmith"
  ],
  "Cleaning & Maintenance Trades": [
    "Pressure Washing Contractor",
    "Gutter Cleaning Specialist",
    "Property Maintenance Contractor",
    "Handyman",
    "Facilities Maintenance",
    "Pest Control Technician"
  ],
  "Specialist & Compliance": [
    "Fire Door Installer",
    "Asbestos Removal Contractor",
    "Damp Proofing Specialist",
    "Timber Treatment Specialist",
    "Insulation Installer",
    "Energy Assessor",
    "Building Surveyor",
    "Party Wall Surveyor"
  ],
  "Infrastructure & Utilities": [
    "Civil Engineering Contractor",
    "Utility Contractor",
    "Fibre Broadband Installer",
    "Street Lighting Contractor",
    "Traffic Management Contractor"
  ],
  "Commercial & Industrial Trades": [
    "Industrial Electrician",
    "Industrial Plumber",
    "Mechanical Fitter",
    "Pipefitter",
    "Welder",
    "Fabricator"
  ]
};

function search() {
  const q = (searchString.value || "").trim().toLowerCase();

  if (!q) {
    searchResults.value = [];
    businessTypeState.value = "types";
    return;
  }

  const results = [];
  for (const type of tradeTypes) {
    for (const trade of trades[type] || []) {
      if (trade.toLowerCase().includes(q)) results.push(trade);
    }
  }

  searchResults.value = [...new Set(results)];
  businessTypeState.value = "search";
}

function selectTradeType(type) {
  currentTrades.value = trades[type] || [];
  businessTypeState.value = "trades";
}

function selectTrade(trade) {
  store.form.trade = trade;
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