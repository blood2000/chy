<template>
  <div>
    <div class="app-container">
      <el-row :gutter="20">
        <el-col :span="6">
          <el-card class="box-card" shadow="hover">
            <div @click="setShipment">货主信息同步redis</div>
          </el-card>
        </el-col>
        <el-col :span="6">
          <el-card class="box-card" shadow="hover">
            <div @click="setUser">用户信息同步redis</div>
          </el-card>
        </el-col>
        <el-col :span="6">
          <el-card class="box-card" shadow="hover">
            <div @click="setDriver">司机信息同步redis</div>
          </el-card>
        </el-col>
        <el-col :span="6">
          <el-card class="box-card" shadow="hover">
            <div @click="setTeam">调度者信息同步redis</div>
          </el-card>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
import { setShipmentInfoRedisAll, setUserRoleInfoRedisAll, setDriverRedisAll, setTeamrRedisAll } from '@/api/system/synchronization';

export default {
  name: 'Synchronization',
  data() {
    return {

    };
  },
  methods: {
    setShipment() {
      setShipmentInfoRedisAll().then(() => {
        this.msgSuccess('同步成功');
      });
    },
    setUser() {
      setUserRoleInfoRedisAll().then(() => {
        this.msgSuccess('同步成功');
      });
    },
    setDriver() {
      setDriverRedisAll().then(() => {
        this.msgSuccess('同步成功');
      });
    },
    setTeam() {
      setTeamrRedisAll().then(() => {
        this.msgSuccess('同步成功');
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.box-card{
  cursor: default;
  ::v-deep.el-card__body{
    padding: 0;
    >div{
      padding: 15px 20px 20px 20px;
    }
  }
}
</style>
