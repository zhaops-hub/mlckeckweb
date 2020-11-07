<template>
  <div class="app-container">
    <el-dialog v-loading="loading" title="编辑用户" :visible="dialogVisible" width="30%" @close="close"></el-dialog>
  </div>
</template>

<script>
export default {
  props: ['id', 'dialogVisible'],
  data() {},
  async mounted() {},
  methods: {}
}
</script>
