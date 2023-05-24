import App from './App'

// #ifndef VUE3
import Vue from 'vue'
import uView from '@/uni_modules/uview-ui'
Vue.use(uView)
import './uni.promisify.adaptor'
import store from '@/store';

let vuexStore = require("@/store/$u.mixin.js");
Vue.mixin(vuexStore);

Vue.config.productionTip = false
App.mpType = 'app'

const app = new Vue({
	store,
  ...App
})
console.log('after app')
import * as global from '@/src/manager/global.js'

import YPFileModel from '@/src/model/YPFileModel.js'
store.state.g_curFile = new YPFileModel({file_id: 'testid'})
Vue.prototype.$u.vuex('g_curFile.', store.state.g_curFile)
app.$mount()

// #endif

// #ifdef VUE3
import { createSSRApp } from 'vue'
export function createApp() {
  const app = createSSRApp(App)
  return {
    app
  }
}
// #endif