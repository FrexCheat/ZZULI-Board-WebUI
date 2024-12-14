<script setup lang="ts">
onMounted(async () => {
  document.documentElement.setAttribute('theme-mode', 'dark')
  useTitle('ZZULI GPLT Board')
})
</script>

<template>
  <div id="board-gplt">
    <NavBar />
    <RouterView />
    <Footer></Footer>
  </div>
</template>

<style scoped>
#board-gplt {
  color: white;
  width: 100%;
  min-height: 100vh;
  background: url('/bg-gplt.jpg');
  background-size: cover;
  background-repeat: no-repeat;
  background-attachment: fixed;
}
</style>
