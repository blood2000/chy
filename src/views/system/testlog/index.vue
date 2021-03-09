<template>
  <div >
    <el-row>
      <el-col :span="6">
        <el-card class="card-left">
            <div slot="header">
              <div class="left_v">
                <span>地区列表</span>
              </div>
            </div>
            <div v-for="o in 4" :key="o">
              {{'列表内容 ' + o }}
            </div>
          </el-card>
      </el-col>
      <el-col :span="18">
        <el-card class="card-rigth">
            <div slot="header">
              <span>地区列表</span>
            </div>
            <div v-for="o in 4" :key="o">
              {{'列表内容 ' + o }}
            </div>
          </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
    name: "testlog",
}
</script>


<style scoped lang='scss'>
.card-rigth{
  margin: 0 15px 15px;
}
.card-left{
  margin-left: 15px;
  margin-bottom: 15px;
}
.left_v{
  border-left: 10px;
  border-color: red;
}
</style>