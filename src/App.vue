<script setup>
import axios from 'axios'
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
const router = useRouter()
const api = 'https://todolist-api.hexschool.io'
//驗證登入
const myToken = document.cookie.replace(
  /(?:(?:^|.*;\s*)todolistCookieName\s*\=\s*([^;]*).*$)|^.*$/,
  '$1'
)

onMounted(async () => {
  try {
    const res = await axios.get(`${api}/users/checkout`, {
      headers: {
        authorization: myToken
      }
    })
    router.push({
      path: '/todo',
      query: {
        name: res.data.nickname
      }
    })
    console.log(res)
  } catch (error) {
    console.log(error.message)
  }
})


</script>

<template>
  <div class="container">
    <router-view>
  </router-view>
  </div>
</template>

<style scoped>
.container {
  width: 100%;
}
</style>
