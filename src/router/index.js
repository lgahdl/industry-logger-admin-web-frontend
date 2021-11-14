import Vue from 'vue'
import VueRouter from 'vue-router'

// Components
import Devices from '@/views/devices'
import Tables from '@/views/tables'
import TableFields from '@/views/table-fields'

// Routes

Vue.use(VueRouter)

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  scrollBehavior() {
    return { x: 0, y: 0 }
  },
  routes: [
    { path: '/', redirect: { name: 'devices' } },
    { path: '/devices', name: 'devices', component: Devices },
    { path: '/devices/:idDevice/tables', name: 'tables', component: Tables },
    { path: '/devices/:idDevice/tables/:idTable/table-fields', name: 'table-fields', component: TableFields },
    {
      path: '*',
      redirect: 'error-404',
    },
  ],
})

router.beforeEach((to, _, next) => next())

// ? For splash screen
// Remove afterEach hook if you are not using splash screen
router.afterEach(() => {
  // Remove initial loading
  const appLoading = document.getElementById('loading-bg')
  if (appLoading) {
    appLoading.style.display = 'none'
  }
})

export default router
