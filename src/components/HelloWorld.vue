<script setup>
import axios from 'axios'
import { ref, onMounted, computed } from 'vue'

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
    console.log(res)
    // cookie存token
    signinRes.value = res.data.token
    //寫入：cookie =token
    document.cookie = `todolistCookieName=${res.data.token}`
    isLogin.value = true
    user.value = res.data
    console.log(user)
  } catch (error) {
    messageSignIn.value = '驗證失敗:' + error.message
    console.log(messageSignIn)
  }
}
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
    user.value = res.data
    isLogin.value = true
    console.log(res)
  } catch (error) {
    console.log(error.message)
  }
})
//登出
const signoutButton = async () => {
  try {
    const res = await axios.post(
      `${api}/users/sign_out`,
      {},
      {
        headers: {
          authorization: myToken
        }
      }
    )
    console.log(res)
    isLogin.value = false
  } catch (error) {
    console.log(error.message)
  }
}
//代辦事項
const text = ref('')
const todos = ref([])
const tabs = ref([{ title: '全部' }, { title: '待完成' }, { title: '已完成' }])

const addTodo = () => {
  //新增文字匡內容至下方資料
  todos.value.push({
    text: text.value,
    id: new Date().getTime(),
    checked: false
  })
  text.value = ''
  // console.log(todos.value)
}
const deleteTodo = (item) => {
  const index = todos.value.findIndex((todo) => todo.id === item.id)
  todos.value.splice(index, 1)
}

//tab
const selectedIndex = ref(0)
const filterList = computed(() => {
  if (selectedIndex.value === 1) {
    return todos.value.filter((todo) => todo.checked == false)
  } else if (selectedIndex.value === 2) {
    return todos.value.filter((todo) => todo.checked == true)
  } else {
    return todos.value
  }
})
//全部數量
const unfinishedCount = computed(() => {
  const unfinished = todos.value.filter((todo) => todo.checked == false)
  return unfinished.length
})
//沒有數量時待目前尚無待辦事項
const noCountShow = ref(true)
const noCount = computed(() => {
  if (todos.value.length === 0) {
    return '目前尚無待辦事項'
  } else {
    noCountShow.value = false
  }
})
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

  <!-- ToDo List -->
  <div id="todoListPage" class="bg-half" v-if="isLogin">
    <nav>
      <h1><a href="#">ONLINE TODO LIST</a></h1>
      <ul>
        <li class="todo_sm">
          <span>{{ user.nickname }}的代辦</span>
        </li>
        <li><a @click="signoutButton">登出</a></li>
      </ul>
    </nav>
    <div class="conatiner todoListPage vhContainer">
      <div class="todoList_Content">
        <div class="inputBox">
          <input type="text" placeholder="請輸入待辦事項" v-model="text" />
          <a @click="addTodo"> + </a>
        </div>
        <div v-if="noCountShow">{{ noCount }}</div>
        <div class="todoList_list" v-if="!noCountShow">
          <ul class="todoList_tab">
            <li v-for="(tab, index) in tabs" :key="index" @click="selectedIndex = index">
              <a href="#" :class="{ active: selectedIndex === index }">{{ tab.title }}</a>
            </li>
          </ul>
          <div class="todoList_items">
            <ul class="todoList_item">
              <li v-for="item in filterList" :key="item.id">
                <label class="todoList_label">
                  <input class="todoList_input" type="checkbox" v-model="item.checked" />
                  <span :class="{ 'text-decoration-line-through': item.checked }">
                    {{ item.text }}
                  </span>
                </label>
                <button type="button" @click="deleteTodo(item)" class="btn">X</button>
              </li>
            </ul>
            <div class="todoList_statistics">
              <p>{{ unfinishedCount }} 個待完成項目</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
button,
a {
  cursor: pointer;
}
.error {
  display: none;
}
input[type='text']:user-invalid + .error {
  display: block;
}

.logoImg {
  margin-bottom: 16px;
}

.vhContainer {
  height: 100vh;
}

.bg-yellow {
  background-color: #ffd370;
}

.bg-half {
  background-image: linear-gradient(175deg, #ffd370 60%, #fff 40%);
}

.conatiner {
  margin: 0 auto;
  padding: 87px 32px;
}

@media (max-width: 576px) {
  .conatiner {
    padding: 18px 32px;
  }
}

.side {
  width: 386px;
  -webkit-box-orient: vertical;
  -webkit-box-direction: normal;
  -ms-flex-direction: column;
  flex-direction: column;
  -webkit-box-pack: center;
  -ms-flex-pack: center;
  justify-content: center;
  -webkit-box-align: center;
  -ms-flex-align: center;
  align-items: center;
}

@media (max-width: 576px) {
  .side {
    width: 100%;
  }
}

nav {
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-pack: justify;
  -ms-flex-pack: justify;
  justify-content: space-between;
  padding: 24px 32px 0 32px;
}

@media (max-width: 576px) {
  nav {
    margin-bottom: 16px;
  }
}

nav h1 a {
  width: 243px;
  height: 39px;
  background: url(https://upload.cc/i1/2022/03/23/8vTzYG.png) no-repeat;
  display: block;
  text-indent: 101%;
  overflow: hidden;
  white-space: nowrap;
}

nav ul {
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  font-size: 1rem;
}

@media (max-width: 576px) {
  nav ul li {
    margin-top: 11px;
  }
}

nav ul a {
  text-decoration: none;
  color: #333333;
  margin-left: 24px;
}

@media (max-width: 576px) {
  nav ul a {
    margin-left: 0;
  }
}

nav ul a:hover {
  color: #d87355;
}

nav ul a span {
  font-weight: bold;
}

@media (max-width: 576px) {
  nav ul .todo_sm {
    display: none;
  }
}

@media (max-width: 576px) {
  .d-m-n {
    display: none;
  }
}

.formControls {
  margin-left: 100px;
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-orient: vertical;
  -webkit-box-direction: normal;
  -ms-flex-direction: column;
  flex-direction: column;
}

@media (max-width: 576px) {
  .formControls {
    margin-left: 0;
  }
}

.formControls .formControls_txt {
  font-size: 1.5rem;
  font-weight: bold;
  margin-bottom: 24px;
}

@media (max-width: 576px) {
  .formControls .formControls_txt {
    font-size: 1.25rem;
    text-align: center;
  }
}

.formControls .formControls_label {
  font-size: 0.875rem;
  font-weight: bold;
  margin: 16px 0 4px 0;
}

.formControls .formControls_input {
  font-weight: normal;
  border: none;
  border-radius: 10px;
  width: 304px;
  padding: 12px 16px;
  margin: 4px 0;
}

.formControls .formControls_input:focus {
  outline: 3px solid #fff;
}

.formControls .formControls_input::-webkit-input-placeholder {
  color: #9f9a91;
}

.formControls .formControls_input:-ms-input-placeholder {
  color: #9f9a91;
}

.formControls .formControls_input::-ms-input-placeholder {
  color: #9f9a91;
}

.formControls .formControls_input::placeholder {
  color: #9f9a91;
}

.formControls .formControls_btnSubmit {
  width: 128px;
  height: 48px;
  border: none;
  border-radius: 10px;
  background: #333333;
  color: #fff;
  -ms-flex-item-align: center;
  -ms-grid-row-align: center;
  align-self: center;
  margin: 24px 0;
  font-weight: bold;
  cursor: pointer;
  text-align: center;
  font-size: 1rem;
}

.formControls a {
  text-decoration: none;
}

.formControls span {
  margin: 4px 0 16px 0;
  color: #d87355;
  font-size: 0.875rem;
}

.formControls .formControls_btnLink {
  display: block;
  color: #333333;
  font-weight: bold;
  text-decoration: none;
  text-align: center;
}

.loginPage {
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-pack: justify;
  -ms-flex-pack: justify;
  justify-content: space-between;
  -webkit-box-align: center;
  -ms-flex-align: center;
  align-items: center;
  width: 800px;
}

@media (max-width: 576px) {
  .loginPage {
    width: 100%;
    -webkit-box-orient: vertical;
    -webkit-box-direction: normal;
    -ms-flex-direction: column;
    flex-direction: column;
    margin: 0 auto;
    padding: 48px 31px;
    -webkit-box-pack: start;
    -ms-flex-pack: start;
    justify-content: start;
  }
}

.signUpPage {
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-pack: justify;
  -ms-flex-pack: justify;
  justify-content: space-between;
  -webkit-box-align: center;
  -ms-flex-align: center;
  align-items: center;
  width: 800px;
}

@media (max-width: 576px) {
  .signUpPage {
    width: 100%;
    -webkit-box-orient: vertical;
    -webkit-box-direction: normal;
    -ms-flex-direction: column;
    flex-direction: column;
    margin: 48px auto 0 auto;
    padding: 48px 31px;
  }
}

.todoListPage {
  padding: 16px 32px;
}

@media (max-width: 576px) {
  .todoListPage {
    background-image: linear-gradient(175deg, #ffd370 100%, #fff 0%);
  }
}

.todoList_Content {
  width: 500px;
  margin: 0 auto;
}

@media (max-width: 576px) {
  .todoList_Content {
    width: 100%;
  }
}

.inputBox {
  width: 100%;

  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  position: relative;
  margin-bottom: 16px;
  -webkit-box-shadow: 0 0 15px 0 rgba(0, 0, 0, 0.15);
  box-shadow: 0 0 15px 0 rgba(0, 0, 0, 0.15);
}

.inputBox input {
  background: #fff;
  color: #000;
  border: none;
  border-radius: 10px;
  position: relative;
  width: 100%;
  height: 47px;
  font-size: 1rem;
  padding-left: 16px;
}

.inputBox a {
  display: block;
  width: 40px;
  height: 39px;
  position: absolute;
  background: #333333;
  color: white;
  font-size: 14px;
  text-decoration: none;
  text-align: center;
  border-radius: 10px;
  top: 4px;
  right: 4px;
  padding: 10px;
  cursor: pointer;
}

.todoList_list {
  background: #fff;
  border-radius: 10px;
  -webkit-box-shadow: 0 0 15px 0 rgba(0, 0, 0, 0.15);
  box-shadow: 0 0 15px 0 rgba(0, 0, 0, 0.15);
}

.todoList_list .todoList_tab {
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-pack: space-evenly;
  -ms-flex-pack: space-evenly;
  justify-content: space-evenly;
}

.todoList_list .todoList_tab li {
  width: 100%;
}

.todoList_list .todoList_tab a {
  display: block;
  color: #9f9a91;
  text-decoration: none;
  line-height: 20px;
  font-weight: bold;
  text-align: center;
  padding: 16px;
  border-bottom: 2px solid #efefef;
}
.btn {
  background-color: transparent;
  border: none;
}
.todoList_list .todoList_tab .active {
  color: #333333;
  border-bottom: 2px solid #333333;
}

.todoList_list .todoList_items {
  padding-top: 23px;
  padding-left: 24px;
  padding-right: 17px;
  padding-bottom: 32px;
}

.todoList_list .todoList_items .todoList_item {
  margin-bottom: 8px;
}

.todoList_list .todoList_items .todoList_label {
  width: 100%;
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-align: center;
  -ms-flex-align: center;
  align-items: center;
  border-bottom: 1px solid #e5e5e5;
  padding-bottom: 15px;
  color: #333333;
  line-height: 20.27px;
}

.todoList_list .todoList_items .todoList_input {
  width: 20px;
  height: 20px;
  border: 1px solid #9f9a91;
  border-radius: 5px;
  margin-right: 16px;
}

.todoList_list .todoList_items .todoList_input:checked ~ span {
  color: #9f9a91;
  text-decoration: line-through;
  -webkit-transition: all 0.4s ease-in-out;
  transition: all 0.4s ease-in-out;
}

.todoList_list .todoList_items li {
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-align: center;
  -ms-flex-align: center;
  align-items: center;
  margin-bottom: 17px;
}

.todoList_list .todoList_items li a {
  margin-left: 17px;
  display: block;
  font-size: 14px;
  color: #333333;
  opacity: 0;
}

.todoList_list .todoList_items li:hover a {
  opacity: 1;
}

.todoList_list .todoList_statistics {
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-pack: justify;
  -ms-flex-pack: justify;
  justify-content: space-between;
}

.todoList_list .todoList_statistics p {
  color: #333333;
  font-size: 0.875rem;
}

.todoList_list .todoList_statistics a {
  color: #9f9a91;
  font-size: 0.875rem;
  text-decoration: none;
}
/*# sourceMappingURL=all.css.map */
</style>
