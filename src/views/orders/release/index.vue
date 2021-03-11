<template>
  <div class="app-container">
    <div class="header mb8">货源发布</div>

    <!-- 转货信息 -->
    <div class="content">

      <el-form ref="form" :model="form" label-width="110px" :label-position="'left'">

        <el-form-item label="司机附近货源">
          <el-radio-group v-model="form.resource">
            <el-radio label="否" />
            <el-radio label="是" />
          </el-radio-group>
        </el-form-item>

        <el-form-item label="装货省">
          <div class="flex">
            <el-select v-model="form.region" placeholder="---请选择---">
              <el-option label="区域一" value="shanghai" />
              <el-option label="区域二" value="beijing" />
            </el-select>

            <span class="pl-5 pr-5">市: </span>
            <el-select v-model="form.region" placeholder="---请选择---">
              <el-option label="区域一" value="shanghai" />
              <el-option label="区域二" value="beijing" />
            </el-select>

            <span class="pl-5 pr-5">县/区: </span>
            <el-select v-model="form.region" placeholder="---请选择---">
              <el-option label="区域一" value="shanghai" />
              <el-option label="区域二" value="beijing" />
            </el-select>

          </div>

        </el-form-item>

        <el-form-item label="详细地址">
          <el-input v-model="form.name" style="width: 350px" />
        </el-form-item>

        <el-form-item label="活动区域">
          <el-select v-model="form.region" placeholder="请选择活动区域">
            <el-option label="区域一" value="shanghai" />
            <el-option label="区域二" value="beijing" />
          </el-select>
        </el-form-item>
        <el-form-item label="活动时间">
          <el-col :span="11">
            <el-date-picker v-model="form.date1" type="date" placeholder="选择日期" style="width: 100%;" />
          </el-col>
          <el-col class="line" :span="2">-</el-col>
          <el-col :span="11">
            <el-time-picker v-model="form.date2" placeholder="选择时间" style="width: 100%;" />
          </el-col>
        </el-form-item>
        <el-form-item label="即时配送">
          <el-switch v-model="form.delivery" />
        </el-form-item>
        <el-form-item label="活动性质">
          <el-checkbox-group v-model="form.type">
            <el-checkbox label="美食/餐厅线上活动" name="type" />
            <el-checkbox label="地推活动" name="type" />
            <el-checkbox label="线下主题活动" name="type" />
            <el-checkbox label="单纯品牌曝光" name="type" />
          </el-checkbox-group>
        </el-form-item>

        <el-form-item label="活动形式">
          <el-input v-model="form.desc" type="textarea" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit">立即创建</el-button>
          <el-button>取消</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      form: {
        name: '',
        region: '',
        date1: '',
        date2: '',
        delivery: false,
        type: [],
        resource: '',
        desc: ''
      }
    };
  },
  methods: {
    onSubmit() {
      console.log('submit!');
    }
  }
};
</script>
<style lang="scss" scoped>
.header{
    padding-bottom: 10px;
    border-bottom: 1px solid red;
}
.content{
}
</style>
