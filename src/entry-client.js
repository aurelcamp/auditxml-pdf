import { createApp } from './main.js';

/**
 * initiate the Vue App for a client-side application
 */
const { app } = createApp();
app.provide('xmlUrl', 'http://localhost:5174/auditReglementaire.xml')
app.mount('#app');
