import Vue from 'vue'
import Vuex from 'vuex'

// Modules
import app from './app'
import appConfig from './app-config'
import devices from './devices'
import logs from './logs'
import tables from './tables'
import tableFields from './table-fields'
import verticalMenu from './vertical-menu'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    app,
    appConfig,
    devices,
    logs,
    tables,
    tableFields,
    verticalMenu,
  },
  strict: process.env.DEV,
})
