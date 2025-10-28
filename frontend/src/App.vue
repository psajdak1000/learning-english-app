<script setup lang="ts">
import { ref, onMounted } from "vue";

const status = ref("Loading...");

async function ping() {
  const res = await fetch("/api/hello"); // pójdzie przez proxy do :8080
  if (!res.ok) throw new Error("API error");
  const data = await res.json() as { message: string };
  status.value = data.message;
}

onMounted(() => {
  ping().catch(() => (status.value = "Backend unavailable"));
});
</script>

<template>
  <div style="max-width:720px;margin:4rem auto;font-family:system-ui,sans-serif">
    <h1>English Learning App (Vue)</h1>
    <p>Status backendu: <strong>{{ status }}</strong></p>
  </div>
</template>

<style scoped>
/* możesz zostawić pusto albo dodać swoje style */
</style>
