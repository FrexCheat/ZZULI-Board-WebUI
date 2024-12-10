<script setup lang="ts">
onMounted(async () => {
  document.documentElement.setAttribute('theme-mode', 'dark')
  useTitle('ZZULI GPLT Board')
})
</script>

<template>
  <NavBar />
  <RouterView />
  <Footer></Footer>
</template>

<style>
#app {
  color: white;
}

html {
  background: url('/bg-gplt.jpg');
  background-repeat: no-repeat;
  background-attachment: fixed;
  background-size: 100% 100%;
}
</style>
