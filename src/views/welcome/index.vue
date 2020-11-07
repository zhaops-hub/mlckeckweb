<template>
  <div class="app-container">
    <h2>welcome {{realName}}</h2>
  </div>
</template>

<script>
export default {
  name: 'welcome',
  components: {},
  data() {
    return {
      realName: ''
    }
  },
  async created() {
    var user = await this.$store.dispatch('user/getInfo')
    this.realName = user.data.userName;
    console.log(user)
  },
  methods: {}
}
</script>
