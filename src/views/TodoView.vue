<script setup>
import axios from 'axios'
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
const api = 'https://todolist-api.hexschool.io'
//驗證登入
const myToken = document.cookie.replace(
  /(?:(?:^|.*;\s*)todolistCookieName\s*\=\s*([^;]*).*$)|^.*$/,
  '$1'
)
const route = useRoute()
const router = useRouter()
const user = ref({
  nickname: route.query.name
})
const addLoading=ref(false)
//撈資料
onMounted(() => {
  if (myToken) {
    getTodos()
  } else {
    router.push('/LoginPage')
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
    router.push('/')
  } catch (error) {
    console.log(error.message)
  }
}
//代辦事項
const text = ref('')
const todos = ref([])
const newtodo = ref('')
//讀取
const getTodos = async () => {
  const fetch_response = await fetch(`${api}/todos`, { headers: { Authorization: myToken } })
  const res = await fetch_response.json()
  todos.value = res.data
}
//新增
const addTodo = async () => {
    if(newtodo.value.length<=0){
        return
    }
    addLoading.value=true
  const fetch_response = await fetch(`${api}/todos`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: myToken
    },
    body: JSON.stringify({content:newtodo.value})
  })
  const res = await fetch_response.json()
  newtodo.value = ''
  await getTodos()
  addLoading.value=false
}
//刪除
const deleteTodo = async (item) => {
  const id = item.id
  const fetch_response = await fetch(`${api}/todos/${id}`, {
    method: 'DELETE',
    headers: {
      Authorization: myToken
    },
  })
  const res = await fetch_response.json(id)
  await getTodos()
}
//tab
const changeState = async (id) => {
  const fetch_response = await fetch(`${api}/todos/${id}/toggle`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: myToken
    }
  })
  const res = await fetch_response.json()
  await getTodos()
}
const tabs = ref([{ title: '全部' }, { title: '待完成' }, { title: '已完成' }])
const selectedIndex = ref(0)
const filterList = computed(() => {
  if (selectedIndex.value === 1) {
    return todos.value.filter((todo) => todo.status == false)
  } else if (selectedIndex.value === 2) {
    return todos.value.filter((todo) => todo.status == true)
  } else {
    return todos.value
  }
})
//待完成數量
const unfinishedCount = computed(() => {
  const unfinished = todos.value.filter((todo) => todo.status == false)
  return unfinished.length
})
</script>

<template>
  <div id="todoListPage" class="bg-half">
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
          <input type="text" placeholder="請輸入待辦事項" v-model="newtodo" />
          <button @click="addTodo" class="add-btn" :disabled="addLoading"> + </button>
        </div>
        <div v-if="todos.length<=0">目前尚無待辦事項</div>
        <div class="todoList_list" v-else>
          <ul class="todoList_tab">
            <li v-for="(tab, index) in tabs" :key="index" @click="selectedIndex = index">
              <a :class="{ active: selectedIndex === index }">{{ tab.title }}</a>
            </li>
          </ul>
          <div class="todoList_items">
            <ul class="todoList_item">
              <li v-for="item in filterList" :key="item.id">
                <label class="todoList_label">
                  <input
                    class="todoList_input"
                    type="checkbox"
                    @click="changeState(item.id, item.status)"
                    :checked="item.status"
                  />
                  <span :class="{ 'text-decoration-line-through': item.status }">
                    {{ item.content }}
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

<style scoped src="./HomeView.css"></style>
