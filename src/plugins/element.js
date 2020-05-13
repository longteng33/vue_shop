import Vue from 'vue'
import { Button,Form,FormItem,Input,Message} from 'element-ui'


Vue.use(Button)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Input)
Vue.use(Input)
// Message组件不同于其它组件，要挂载到Vue的全局上
Vue.prototype.$message=Message;