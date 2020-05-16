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
    component: () => import(/* webpackChunkName: "home" */ '../components/Home.vue'),
    redirect:'/welcome',
    children:[
      {
        path:'/welcome',
        component:() => import(/* webpackChunkName: "welcome" */ '../components/Welcome.vue'),
      },
      {
        path:'/users',
        component:() => import(/* webpackChunkName: "users" */ '../components/user/users.vue'),
      },
      {
        path:'/rights',
        component:() => import(/* webpackChunkName: "rights" */ '../components/power/rights.vue'),
      },
      {
        path:'/roles',
        component:() => import(/* webpackChunkName: "roles" */ '../components/power/roles.vue'),
      },
      {
        path:'/categories',
        component:() => import(/* webpackChunkName: "cate" */ '../components/goods/cate.vue'),
      },
      {
        path:'/params',
        component:() => import(/* webpackChunkName: "params" */ '../components/goods/params.vue'),
      },
      {
        path:'/goods',
        component:() => import(/* webpackChunkName: "list" */ '../components/goods/list.vue'),
        
      },
      {
        path:'/goods/add',
        component:() => import(/* webpackChunkName: "list" */ '../components/goods/add.vue'),
        
      },
    ],
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
