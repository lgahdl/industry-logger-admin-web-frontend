<template>
  <div
    class="auth-wrapper auth-v1 px-2"
    style="height:100vh; width:100vw; align-items: center; display: flex; flex-direction: column; justify-content: center"
  >
    <div
      class="auth-inner py-2"
      style="width:100%; display: flex; align-items: center; justify-content: center"
    >
      <b-card
        :key="forceRenderKey"
        class="mb-0 w-25"
        style="box-shadow: none !important;"
      >
        <b-link class="brand-logo">
          <div
            class="align-items-center flex-grow-1 d-none d-lg-flex"
            style="position: relative; left: -1rem; width:5rem; height:auto"
          >
            <img
              src="../../../assets/images/logo/logo-blue.svg"
              style="width:3rem; height:auto"
            >
          </div>
        </b-link>

        <h1 class="brand-text my-2 font-weight-bolder">
          {{ step == 'info' ? $t("#Auth #SignUp #Title Info") : $t("#Auth #SignUp #Title Validate Email") }}
        </h1>
        <transition
          name="fade"
          mode="out-in"
        >
          <div
            v-if="step==='info'"
          >
            <validation-observer
              ref="emailForm"
              #default="{handleSubmit, invalid}"
            >
              <b-form
                class="auth-login-form mt-2 pt-2"
                @submit.prevent="handleSubmit(submitInfo)"
              >
                <form-input
                  v-model="email"
                  type="email"
                  :name="$t('#Auth #SignUp #FormInputTitle Email')"
                  :title="$t('#Auth #SignUp #FormInputTitle Email')"
                  :placeholder="$t('#Auth #SignUp #FormInputPlaceholder Email')"
                  rules="required|email"
                />
                <form-input
                  v-model="password"
                  type="password"
                  :name="$t('#Auth #SignUp #FormInputTitle Password')"
                  :title="$t('#Auth #SignUp #FormInputTitle Password')"
                  :placeholder="$t('#Auth #SignUp #FormInputPlaceholder Password')"
                  rules="required|strongPassword"
                />
                <form-input
                  v-model="confirmPassword"
                  type="password"
                  :name="$t('#Auth #SignUp #FormInputTitle Confirm Password')"
                  :title="$t('#Auth #SignUp #FormInputTitle Confirm Password')"
                  :placeholder="$t('#Auth #SignUp #FormInputPlaceholder Confirm Password')"
                  :rules="`required|confirmed:${$t('#Auth #SignUp #FormInputTitle Password')}`"
                />
                <custom-button
                  variant="secondary"
                  type="submit"
                  :disabled="invalid"
                  :title="$t('#Button Validate Email')"
                  class="px-1"
                  append-icon="ArrowRightIcon"
                  style="height: 40px"
                />
              </b-form>
            </validation-observer>
          </div>
          <div v-if="step=='validate-email'">
            <div style="margin-bottom: 2rem; text-align: center">
              <span>{{
                $t("#Auth #SignUp #Description Validate Email")
              }}</span>
            </div>
            <form-input
              v-model="email"
              disabled
              :name="$t('#Auth #SignUp #FormInputTitle Email')"
              :title="$t('#Auth #SignUp #FormInputTitle Email')"
              :placeholder="$t('#Auth #SignUp #FormInputPlaceholder Email')"
              rules="required|email"
            />
            <custom-button
              variant="secondary"
              type="submit"
              :title="$t('#Button Send Again')"
              class="px-1"
              append-icon="RefreshCwIcon"
              style="height: 40px"
              @click="sendValidationEmailAgain"
            />
          </div>
        </transition>
        <b-card-text class="mt-2">
          <div
            class="d-flex justify-content-between w-100 mt-1"
          >
            <b-link
              class="d-flex justify-content-between w-100"
              :to="{name: 'login'}"
              @click="signOut"
            >
              <span>{{ $t("#Auth #SignUp Login") }} </span>
              <feather-icon icon="AtSignIcon" />
            </b-link>
          </div>
        </b-card-text>
      </b-card>
      <!-- /Login v1 -->
    </div>
  </div>
</template>

<script>

import FirebaseService from '@/services/firebase.service'

export default {
  name: 'Login',
  data() {
    return {
      email: '',
      password: '',
      confirmPassword: '',
      step: 'info',
      forceRenderKey: 0,
    }
  },
  watch: {
    $route(val) {
      const { query } = val
      const { step, email } = query
      if (step && email) {
        this.step = step
        this.email = email
        this.forceRenderKey += 1
      }
    },
  },
  beforeMount() {
    const { step, email } = this.$route.query
    if (step && email) {
      this.step = step
      this.email = email
      this.forceRenderKey += 1
    }
  },
  methods: {
    async submitInfo() {
      try {
        await FirebaseService.createUserWithEmailAndPassword(this.email, this.password)
        await FirebaseService.sendValidationEmail()
        this.$store.dispatch('user/createMe', { email: this.email })
        this.step = 'validate-email'
      } catch (error) {
        this.$swal({
          title: this.$t('#SweetAlertTitle Firebase Error'),
          html: this.$t(`#SweetAlertDescription Firebase Error ${error.code}`),
          showConfirmButton: false,
          showCancelButton: false,
          timer: 3000,
          icon: 'error',
        })
      }
    },
    async sendValidationEmailAgain() {
      await FirebaseService.sendValidationEmail()
    },
    async signOut() {
      await FirebaseService.signOut()
    },
  },
}
</script>

<style scoped>

</style>