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
          {{ $t("#Auth #Login Title") }}
        </h1>
        <transition
          name="fade"
          mode="out-in"
        >
          <template
            v-if="step==='email'"
          >
            <validation-observer
              ref="emailForm"
              #default="{handleSubmit, invalid}"
            >
              <b-form
                class="auth-login-form mt-2 pt-2"
                @submit.prevent="handleSubmit(submitEmail)"
              >
                <form-input
                  v-model="email"
                  type="email"
                  :name="$t('#Auth #Login #FormInputTitle Email')"
                  :title="$t('#Auth #Login #FormInputTitle Email')"
                  :placeholder="$t('#Auth #Login #FormInputPlaceholder Email')"
                  rules="required|email"
                />
                <custom-button
                  variant="secondary"
                  type="submit"
                  :disabled="invalid"
                  :title="$t('#Button Next')"
                  class="px-1"
                  append-icon="ArrowRightIcon"
                  style="height: 40px"
                />
              </b-form>
            </validation-observer>
          </template>
          <template
            v-if="step==='password'"
          >
            <validation-observer
              ref="passwordForm"
              #default="{handleSubmit, invalid}"
            >
              <b-form
                class="auth-login-form mt-2 pt-2"
                @submit.prevent="handleSubmit(submit)"
              >
                <form-input
                  v-model="password"
                  type="password"
                  :name="$t('#Auth #Login #FormInputTitle Password')"
                  :title="$t('#Auth #Login #FormInputTitle Password')"
                  :placeholder="$t('#Auth #Login #FormInputPlaceholder Password')"
                  rules="required"
                />
                <custom-button
                  variant="secondary"
                  type="submit"
                  :disabled="invalid"
                  :title="$t('#Button Login')"
                  class="px-1"
                  append-icon="ArrowRightIcon"
                  style="height: 40px"
                />
              </b-form>
            </validation-observer>
          </template>
        </transition>
        <b-card-text class="mt-2">
          <div class="d-flex justify-content-between w-100">
            <b-link
              :to="{name: 'sign-up'}"
              class="d-flex justify-content-between w-100"
            >
              <span>{{ $t("#Auth #Login Create an account") }} </span>
              <feather-icon icon="LogInIcon" />
            </b-link>
          </div>
          <div
            v-if="step==='password'"
            class="d-flex justify-content-between w-100 mt-1"
          >
            <b-link
              class="d-flex justify-content-between w-100"
              @click="backToEmail"
            >
              <span>{{ $t("#Auth #Login Another Email") }} </span>
              <feather-icon icon="AtSignIcon" />
            </b-link>
          </div>
        </b-card-text>
      </b-card>
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
      step: 'email',
      forceRenderKey: 0,
    }
  },
  methods: {
    submitEmail() {
      this.step = 'password'
      this.forceRenderKey += 1
    },
    submit() {
      FirebaseService.signIn(this.email, this.password).catch(error => {
        this.$swal({
          title: this.$t('#SweetAlertTitle Firebase Error'),
          html: this.$t(`#SweetAlertDescription Firebase Error ${error.code}`),
          showConfirmButton: false,
          showCancelButton: false,
          timer: 1500,
          icon: 'error',
        })
      })
    },
    backToEmail() {
      this.password = ''
      this.email = ''
      this.step = 'email'
      this.forceRenderKey += 1
    },
  },
}
</script>

<style scoped>

</style>