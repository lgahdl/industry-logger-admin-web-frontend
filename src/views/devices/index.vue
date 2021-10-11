<template>
  <div>
    {{ JSON.stringify(devices) }}
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'

export default {
  name: 'Devices',
  computed: {
    ...mapGetters({ devices: 'devices/devices' }),
  },
  beforeMount() {
    this.findAll()
  },
  methods: {
    ...mapActions({ findAll: 'devices/findAll' }),
  },
}
</script>

<style scoped>

</style>