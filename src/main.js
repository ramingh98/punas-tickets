import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import ToastPlugin from 'vue-toast-notification';
import 'vue-toast-notification/dist/theme-bootstrap.css';
import  './utils/axios';
import CKEditor from '@ckeditor/ckeditor5-vue';

createApp(App).use(store).use(router).use(CKEditor).use(ToastPlugin).mount('#app')