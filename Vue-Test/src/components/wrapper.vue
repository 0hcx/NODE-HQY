<template>
	<div class="wrapper">
   <router-view></router-view> 
 </div>
</template>

<script>

  export default {
    name: 'wrapper'
  }

</script>

<style scoped>
  .wrapper {
   display: flex;
   justify-content: center;
   align-items: center;
 }
</style>
