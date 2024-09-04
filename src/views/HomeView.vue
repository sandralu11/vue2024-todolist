<script setup>
import axios from 'axios'
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
const router = useRouter()
const api = 'https://todolist-api.hexschool.io'
const isShow = ref(true)
let isLogin = ref(false)
//註冊
const signupRes = ref('')
const messageSignup = ref('')
const signUp = ref({ email: '', password: '', nickname: '' })
const signupButton = async () => {
  try {
    console.log(`${api}/users/sign_up`)
    const res = await axios.post(`${api}/users/sign_up`, signUp.value)
    console.log(res)
    signupRes.value = res.data.uid
    alert('註冊成功')
    isShow.value = true
  } catch (error) {
    console.log(error)
    messageSignup.value = '驗證失敗: ' + error.response.data.message
    alert(messageSignup.value)
  }
}
//登入
const signinRes = ref('')
const signIn = ref({ email: '', password: '' })
const messageSignIn = ref('')
const user = ref({
  nickname: '',
  uid: ''
})
const signinButton = async () => {
  try {
    const res = await axios.post(`${api}/users/sign_in`, signIn.value)
    // console.log(res)
    // cookie存token
    signinRes.value = res.data.token
    //寫入：cookie =token
    document.cookie = `todolistCookieName=${res.data.token}`
    router.push({
      path: '/todo',
      query: {
        name: res.data.nickname
      }
    })
    user.value = res.data
    // console.log(user)
  } catch (error) {
    messageSignIn.value = '驗證失敗:' + error.message
    // console.log(messageSignIn)
  }
}
</script>
<template>
  <!-- login_page -->
  <div id="loginPage" class="bg-yellow" v-if="!isLogin && isShow">
    <div class="conatiner loginPage vhContainer">
      <div class="side">
        <a href="#">
          <img
            class="logoImg"
            src="https://raw.githubusercontent.com/hexschool/2022-web-layout-training/main/todolist/logo.png"
            alt=""
          />
        </a>
        <img
          class="d-m-n"
          src="https://raw.githubusercontent.com/hexschool/2022-web-layout-training/main/todolist/img.png"
          alt="workImg"
        />
      </div>
      <div>
        <form class="formControls" action="index.html" @submit.prevent="handleSubmit">
          <h2 class="formControls_txt">最實用的線上代辦事項服務</h2>
          <label class="formControls_label" for="email">Email</label>
          <input
            class="formControls_input"
            type="text"
            id="email"
            name="email"
            placeholder="請輸入 email"
            required
            v-model="signIn.email"
          />
          <span class="error">此欄位不可留空</span>
          <label class="formControls_label" for="pwd">密碼</label>
          <input
            class="formControls_input"
            type="password"
            name="pwd"
            id="pwd"
            placeholder="請輸入密碼"
            required
            v-model="signIn.password"
          />
          <span>{{ messageSignIn }}</span>
          <input class="formControls_btnSubmit" type="submit" @click="signinButton" value="登入" />
          <a class="formControls_btnLink" @click="isShow = !isShow">註冊帳號</a>
        </form>
      </div>
    </div>
  </div>

  <!-- sign up -->
  <div id="signUpPage" class="bg-yellow" v-if="!isShow">
    <div class="conatiner signUpPage vhContainer">
      <div class="side">
        <a href="#"
          ><img
            class="logoImg"
            src="https://raw.githubusercontent.com/hexschool/2022-web-layout-training/main/todolist/logo.png"
            alt=""
        /></a>
        <img
          class="d-m-n"
          src="https://raw.githubusercontent.com/hexschool/2022-web-layout-training/main/todolist/img.png"
          alt="workImg"
        />
      </div>
      <div>
        <form class="formControls" action="index.html">
          <h2 class="formControls_txt">註冊帳號</h2>
          <label class="formControls_label" for="email">Email</label>
          <input
            class="formControls_input"
            type="email"
            id="email"
            name="email"
            placeholder="請輸入 email"
            required
            v-model="signUp.email"
          />
          <label class="formControls_label" for="name">您的暱稱</label>
          <input
            class="formControls_input"
            type="text"
            name="name"
            id="name"
            placeholder="請輸入您的暱稱"
            v-model="signUp.nickname"
          />
          <label class="formControls_label" for="pwd">密碼</label>
          <input
            class="formControls_input"
            type="password"
            name="pwd"
            id="pwd"
            placeholder="請輸入密碼"
            required
            v-model="signUp.password"
          />
          <label class="formControls_label" for="pwd">再次輸入密碼</label>
          <input
            class="formControls_input"
            type="password"
            name="pwd"
            id="pwd"
            placeholder="請再次輸入密碼"
            required
          />
          <input
            class="formControls_btnSubmit"
            type="button"
            @click="signupButton"
            value="註冊帳號"
          />
          <a class="formControls_btnLink" @click.prevent="isShow = !isShow">登入</a>
        </form>
      </div>
    </div>
  </div>

</template>

<style scoped src="./HomeView.css"></style>
