import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    name: 'login',
    component: () => import(/* webpackChunkName: "login" */ '../components/Login.vue')
  },
  {
    path: '/home',
    name: 'home',
    component: () => import(/* webpackChunkName: "home" */ '../components/Home.vue')
  }
]

const router = new VueRouter({
  routes
})
// 全局前置守卫
router.beforeEach((to,from,next)=>{
  if(to.path==="/login"){
    next();
    return;
  }
  // 获取token
  const token=window.sessionStorage.getItem("token");
  if(!token){
    next('/login');
    return;
  }else{
    next();
  }
})
export default router
