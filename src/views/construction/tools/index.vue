<!-- 根据主菜单修改子菜单状态 -->
<template>
  <div>
    <div class="app-container app-container--search">
      <el-form ref="queryForm" :model="queryParams" :inline="true">
        <el-form-item label="车牌号" prop="keywords">
          <el-input
            v-model.trim="queryParams.licenseNumber"
            placeholder="请输入车牌号"
            clearable
            size="small"
            class="input-width"
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            icon="el-icon-search"
            size="mini"
            :loading="loading"
            @click="handleConfirm"
          >
            确认
          </el-button>
          <!-- <el-button type="primary" plain icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button> -->
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import { updateSubMenuStatus } from "@/api/construction/comon";
export default {
  name: "Tools",
  data() {
    return {
      loading: false,
      queryParams: {
        licenseNumber: "",
      },
    };
  },

  components: {},

  computed: {},

  methods: {
    handleConfirm() {
      this.loading = true;
      updateSubMenuStatus(this.queryParams).then((res) => {
        this.loading = false;
        console.log("修改子菜单状态", res);
        if (res.code !== 200) {
          this.$message({
            type: "error",
            message: res.msg,
          });
        } else {
          this.$message({
            type: "success",
            message: res.msg,
          });
        }
      });
    },
  },
};
</script>
<style lang='scss' scoped>
</style>