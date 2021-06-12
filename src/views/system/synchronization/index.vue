<template>
  <div>
    <div class="app-container">
      <el-row :gutter="20">
        <el-col :span="6">
          <el-card class="box-card" shadow="hover">
            <div @click="setShipment">
              <span class="g-pot bigger g-color-blue mr5" />
              货主信息同步redis
            </div>
          </el-card>
        </el-col>
        <el-col :span="6">
          <el-card class="box-card" shadow="hover">
            <div @click="setUser">
              <span class="g-pot bigger g-color-blue mr5" />
              用户信息同步redis
            </div>
          </el-card>
        </el-col>
        <el-col :span="6">
          <el-card class="box-card" shadow="hover">
            <div @click="setDriver">
              <span class="g-pot bigger g-color-blue mr5" />
              司机信息同步redis
            </div>
          </el-card>
        </el-col>
        <el-col :span="6">
          <el-card class="box-card" shadow="hover">
            <div @click="setTeam">
              <span class="g-pot bigger g-color-blue mr5" />
              调度者信息同步redis
            </div>
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
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  &:hover{
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.2);
  }
  ::v-deep.el-card__body{
    padding: 0;
    >div{
      padding: 15px 20px 20px 20px;
    }
  }
}
</style>
