import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
import './assets/css/global.css'
import './assets/fonts/iconfont.css'

// 树表格插件
import ZkTable from 'vue-table-with-tree-grid'
Vue.component(ZkTable.name, ZkTable)

// 富文本编辑器插件
import VueQuillEditor from 'vue-quill-editor'
import 'quill/dist/quill.core.css' // import styles
import 'quill/dist/quill.snow.css' // for snow theme
import 'quill/dist/quill.bubble.css' // for bubble theme
Vue.use(VueQuillEditor, /* { default global options } */)

import axios from "axios"
axios.defaults.baseURL="http://127.0.0.1:8888/api/private/v1/"
axios.interceptors.request.use(config=>{
  config.headers.Authorization=window.sessionStorage.getItem("token")
  return config;
})
Vue.prototype.$http=axios

// 定义一个全局的过滤器，对时间进行处理
Vue.filter('dateFormat',function(originVal){
 const dt= new Date(originVal);
 const year=dt.getFullYear();
 const month=(dt.getMonth()+1+'').padStart(2,'0');
 const date=(dt.getDate()+'').padStart(2,'0');
 const hour=(dt.getHours()+'').padStart(2,'0');
 const min=(dt.getMinutes()+'').padStart(2,'0');
 const sec=(dt.getSeconds()+'').padStart(2,'0');
 return `${year}-${month}-${date} ${hour}:${min}:${sec}`
})

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
