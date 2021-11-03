<template>
  <div>
    <el-divider content-position="left">卡信息</el-divider>
    <div>
      <el-row :gutter="20">
        <el-col :span="6">
          <div><span class="b">卡ID:</span>  {{ card16no }}</div>
        </el-col>
        <el-col :span="6" />
        <el-col :span="6" />
        <el-col :span="6" />
      </el-row>
    </div>

    <el-divider content-position="left">用户信息</el-divider>
    <div>
      <el-row :gutter="20">
        <el-col :span="6">
          <div><span class="b"> 版本:</span> {{ userMark }}</div>
        </el-col>
        <el-col :span="6">
          <div><span class="b"> 手机号:</span> {{ userInfo.user_telno || '4版本去掉了' }}</div>
        </el-col>
        <el-col :span="6">
          <div><span class="b"> 项目Id:</span> {{ userInfo.project_id }}</div>
        </el-col>
        <el-col :span="6">
          <div><span class="b"> 调度组电话:</span> {{ userInfo.team_telno }}</div>
        </el-col>
        <el-col :span="6">
          <div><span class="b"> 发卡人电话:</span> {{ userInfo.issuing_telno }}</div>
        </el-col>
        <el-col :span="6">
          <div><span class="b"> 发卡时间:</span> {{ userInfo.issuing_time }}</div>
        </el-col>
        <el-col :span="6">
          <div><span class="b"> 卡批次号:</span> {{ userInfo.issuing_pc }}</div>
        </el-col>
        <el-col :span="6">
          <div><span class="b"> 卡类型:</span> {{ userInfo.icType }}</div>
        </el-col>
      </el-row>
    </div>

    <el-divider content-position="left">运单信息</el-divider>
    <div>
      <el-table
        :data="dataList"
        style="width: 100%"
      >
        <el-table-column
          prop="meter"
          width="80"
          label="版本"
        />
        <el-table-column
          prop="orderId"
          width="150"
          label="货源单号"
        />
        <el-table-column
          prop="waybillNo"
          width="150"
          label="运单单号"
        />
        <el-table-column
          prop="projectName"
          width="80"
          label="项目"
        />
        <el-table-column
          prop="licenseNumber"
          width="100"
          label="车牌号"
        />
        <el-table-column
          prop="driverPhone"
          label="驾驶员用户手机号"
        />
        <el-table-column
          prop="fillTime"
          label="入场时间（时间戳）"
        />
        <el-table-column
          prop="signTime"
          label="出场时间（时间戳）"
        />
        <el-table-column
          prop="serialNumber"
          label="渣土场编号"
        />
      </el-table>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    cardInfoData: {
      type: Object,
      default: () => { return {}; }
    }
  },

  computed: {
    card16no() {
      return this.cardInfoData.GetCardNo ? this.cardInfoData.GetCardNo.data : '-';
    },
    userInfo() {
      return this.cardInfoData.userInfo ? this.cardInfoData.userInfo : {};
    },
    dataList() {
      const list = this.cardInfoData.dataList ? this.cardInfoData.dataList : [];
      return list.map(e => {
        e.meter = this.meter;
        return e;
      });
    },
    meter() {
      return this.cardInfoData.meter ? this.cardInfoData.meter.join('|') + '|' : '';
    },
    userMark() {
      return this.cardInfoData.userMark ? this.cardInfoData.userMark : '';
    }
  }

};
</script>


<style scoped>
.el-col{
    margin: 10px 0;
}
</style>
