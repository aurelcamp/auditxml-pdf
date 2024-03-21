// import './assets/main.css'

// import { createApp } from 'vue'
// import App from './App.vue'

// createApp(App).mount('#app')

import { createSSRApp } from 'vue';
import App from './App.vue';

export const createApp = () => {
  /**
   * use createSSRApp to render the Vue App in the server
   * and send it to the user to do hydration process
   */
  const app = createSSRApp(App);
  return {
    app,
  };
};

