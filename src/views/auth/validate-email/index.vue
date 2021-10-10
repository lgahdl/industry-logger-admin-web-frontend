<template>
  <div
    class="auth-wrapper auth-v1 px-2"
    style="height:100vh; width:100vw; align-items: center; display: flex; flex-direction: column; justify-content: center"
  >
    <b-spinner
      v-if="!verified"
      style="width: 10rem; height: 10rem; color: #3888FF; font-size:1rem"
    />
    <template v-else>
      <div
        class="auth-inner py-2"
        style="width:100%; display: flex; align-items: center; justify-content: center"
      >
        <b-card
          class="mb-0 w-25"
          style="box-shadow: none !important; min-width:450px"
        >
          <b-link class="brand-logo">
            <div
              class="align-items-center flex-grow-1 d-flex"
              style="position: relative; left: -1rem; width:5rem; height:auto"
            >
              <img
                src="../../../assets/images/logo/logo-blue.svg"
                style="width:3rem; height:auto"
              >
            </div>
          </b-link>
          <template v-if="!invalid">
            <div
              class="d-flex align-items-center justify-content-center my-4"
              style="width:100%"
            >
              <feather-icon
                size="50"
                icon="CheckCircleIcon"
                color="#44D065"
              />
            </div>
            <h1 class="brand-text my-2 font-weight-bolder text-center">
              {{ $t("#Auth #ValidateEmail #Success Title") }}
            </h1>
            <h5 class="brand-text my-2 font-weight-bolder text-center">
              {{ $t("#Auth #ValidateEmail #Success Description") }}
            </h5>
            <custom-button
              variant="secondary"
              :title="$t('#Button Go To Student')"
              class="px-1 my-2"
              append-icon="ArrowRightIcon"
              style="height: 40px"
              @click="goTo(`${studentsUrl}`)"
            />
            <custom-button
              variant="outline-secondary"
              :title="$t('#Button Go To Admin')"
              class="px-1 my-2"
              append-icon="ArrowRightIcon"
              style="height: 40px; box-shadow: none !important"
              @click="goTo(`${adminUrl}`)"
            />
          </template>
          <template v-else>
            <div
              class="d-flex align-items-center justify-content-center my-4"
              style="width:100%"
            >
              <feather-icon
                size="50"
                icon="XCircleIcon"
                color="red"
              />
            </div>
            <h1 class="brand-text my-2 font-weight-bolder text-center">
              {{ $t("#Auth #ValidateEmail #Invalid Title") }}
            </h1>
            <h5 class="brand-text my-2 font-weight-bolder text-center">
              {{ $t("#Auth #ValidateEmail #Invalid Description") }}
            </h5>
            <custom-button
              variant="secondary"
              :title="$t('#Button Go To Student')"
              class="px-1 my-2"
              append-icon="ArrowRightIcon"
              style="height: 40px"
              @click="goTo(`${studentsUrl}`)"
            />
            <custom-button
              variant="outline-secondary"
              :title="$t('#Button Go To Admin')"
              class="px-1 my-2"
              append-icon="ArrowRightIcon"
              style="height: 40px; box-shadow: none !important"
              @click="goTo(`${adminUrl}`)"
            />
          </template>
          <transition
            name="fade"
            mode="out-in"
          />
          <b-card-text class="mt-2" />
        </b-card>

      </div>
    </template>

  </div>
</template>

<script>

import FirebaseService from '@/services/firebase.service'

export default {
  name: 'ValidateEmail',
  data: () => ({
    invalid: true,
    verified: false,
  }),
  computed: {
    studentsUrl() {
      return process.env.VUE_APP_ROOT_STUDENTS_URL
    },
    adminUrl() {
      return process.env.VUE_APP_ROOT_ADMIN_URL
    },
  },
  beforeMount() {
    this.validationCode = this.$route.query.oobCode
    this.validateEmail()
  },
  methods: {
    async validateEmail() {
      try {
        await FirebaseService.verifyEmail(this.validationCode)
        this.invalid = false
        this.verified = true
      } catch (error) {
        this.invalid = true
        this.verified = true
      }
    },
    goTo(url) {
      window.location.href = url
    },
  },
}
</script>

<style scoped>

</style>