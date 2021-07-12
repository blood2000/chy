<template>
  <el-form
    ref="elForm"
    v-loading="loading"
    :model="formData"
    :rules="rules"
    size="medium"
    label-width="150px"
    :label-position="'left'"
  >
    <div class="app-container">
      <div class="header mb8">渣土货源</div>


      <el-form-item label="项目工程" prop="projectCode">
        <!-- 待处理 -->
        <el-tag v-if="formData.projectCode" :type="'warning'">
          {{ formData.projectName }}
        </el-tag>
        <el-button v-if="!isEdit" class="ml10" size="mini" type="primary" @click="openObj = true">请选择项目工程</el-button>
      </el-form-item>

      <el-form-item label="选择调度" prop="dispatcherCodes">

        <!-- <span>{{ formData.dispatcherCodes }}</span> -->
        <el-tag
          v-for="tag in schedSelect"
          :key="tag.code"
          class="mr10"
          closable
          :type="'warning'"
          @close="hamdlerClose(tag)"
        >
          {{ tag.disName }}
        </el-tag>

        <el-button v-if="!isEdit" class="ml10" size="mini" type="primary" @click="scheduling = true">请选择调度</el-button>
      </el-form-item>

      <el-form-item v-if="false" label="渣土类型" prop="orderType">
        <el-radio-group v-model="formData.orderType" disabled>
          <el-radio label="1200">渣土场</el-radio>
          <el-radio label="2">场内</el-radio>
          <el-radio label="3">自倒</el-radio>
        </el-radio-group>
      </el-form-item>

      <el-form-item label="是否启用电子围栏" prop="geofenceToggle">
        <el-switch v-model="formData.geofenceToggle" />
      </el-form-item>

      <el-form-item v-if="formData.geofenceToggle" label="围栏半径" prop="geofenceRadius">
        <el-input-number v-model="formData.geofenceRadius" :min="0" label="请输入围栏半径" />
        <el-button class="ml10" size="mini" type="primary" @click="hangdlerYulang">预览</el-button>
      </el-form-item>

      <el-form-item label="备注" prop="remark">
        <el-input
          v-model="formData.remark"
          type="textarea"
          placeholder="请输入备注信息"
          :autosize="{ minRows: 4, maxRows: 4 }"
          maxlength="100"
          show-word-limit
          :style="{ width: '500px' }"
        />
      </el-form-item>

      <el-form-item v-if="!isEdit">
        <el-button type="primary" plain @click="handlerReset('elForm')">重 置</el-button>
        <el-button type="primary" :loading="loading" @click="submitForm('elForm')">立即发布</el-button>
      </el-form-item>
      <el-form-item v-else>
        <el-button type="primary" plain @click="$router.back()">返 回</el-button>
      </el-form-item>

    </div>


    <!-- 打开弹框 -->
    <el-dialog :close-on-click-modal="false" title="项目工程" :visible.sync="openObj" width="80%">
      <div v-if="openObj">
        <ProjectIndex ref="ProjectIndex" :shipment-code="shipmentInfo.code" :iscomponent="true" @selected="(data)=> selectData = data" />

        <el-form-item>
          <div class="ly-t-right">
            <el-button type="primary" plain @click="openObj = false">取 消</el-button>
            <el-button type="primary" @click="handlerProject">确 定</el-button>
          </div>
        </el-form-item>
      </div>
    </el-dialog>

    <!-- 打开弹框 -->
    <el-dialog :close-on-click-modal="false" title="选择调度" :visible.sync="scheduling" width="80%">
      <div v-if="scheduling">
        <GroupIndex ref="GroupIndex" :shipment-code="shipmentInfo.code" :iscomponent="true" :cb-data-by-keyword="cbDataByKeyword" @groupSelected="(data)=> schedSelect = data" />

        <el-form-item>
          <div class="ly-t-right">
            <el-button type="primary" plain @click="scheduling = false">取 消</el-button>
            <el-button type="primary" @click="handlerScheduling">确 定</el-button>
          </div>
        </el-form-item>
      </div>
    </el-dialog>

    <!-- 打开电子围栏 -->
    <el-dialog :close-on-click-modal="false" title="预览电子围栏" :visible.sync="mapDialog" width="80%">
      <div v-if="mapDialog">
        <MapDialog v-model="formData.geofenceRadius" :lnglat="lnglat" />
        <div class="ly-t-right mt20">
          <el-button type="primary" @click="mapDialog = false">确 定</el-button>
        </div>
      </div>
    </el-dialog>

  </el-form>
</template>

<script>
import ProjectIndex from '@/views/enterprise/project';
import GroupIndex from '@/views/enterprise/group';

import MapDialog from './MapDialog.vue';

import { getUserInfo } from '@/utils/auth';

import { ztPublishOrder } from '@/api/order/release'; // 发布渣土请求
export default {
  components: { ProjectIndex, GroupIndex, MapDialog },

  props: {
    cbData: {
      type: Object,
      default: null
    }
  },

  data() {
    return {
      loading: false,

      'formData': {
        'projectName': undefined, // 项目名
        'projectCode': undefined, // 项目Code		false
        'dispatcherCodes': [], // 调度车队Code		false
        'orderType': '1200', // 货源类型		false 默认写死
        'geofenceToggle': false, // 电子围栏是否开启 1 是 0 否		false
        'remark': '', // 备注		false
        'geofenceRadius': 0, // 电子围栏范围		false
        'publishMode': 0, // 发布方式 0 货源大厅不可见(只能通过货单号或备注搜索) 1 货源大厅可见 默认写死

        // 选填
        'branchCode': undefined, //
        'orgCode': undefined,
        'publishCode': undefined //	发布人Code		false
      },
      'rules': {
        projectCode: [{ required: true, message: '请选择项目工程', trigger: 'change' }],
        dispatcherCodes: [{ required: true, message: '请选择调度', trigger: 'change' }],
        orderType: [{ required: true, trigger: 'change' }],
        geofenceRadius: [{ required: true, message: '请输入围栏半径', trigger: 'blur' }]
      },

      'openObj': false, // 项目工程 弹框
      'selectData': {}, // 选中的项目

      'scheduling': false, // 调度 弹框
      'schedSelect': [], // 选中的调度

      'mapDialog': false, // 电子围栏
      'lnglat': [] // 项目位置




      // projectCode_option: [],
      // dispatcherCodes_option: []
    };
  },

  computed: {
    shipmentInfo() {
      const { isShipment = false, shipment = {}} = getUserInfo() || {};
      return !isShipment ? (shipment.info || {}) : {};
    },
    cbDataByKeyword() {
      let obj = null;
      if (this.schedSelect.length) {
        obj = { id: this.schedSelect.map(e => e.id) };
      }
      return obj;
    },

    isEdit() {
      return !!this.cbData;
    }
  },

  watch: {
    cbData: {
      handler(data) {
        if (data) {
          console.log(data);

          // 调度者
          this.schedSelect = data.redisOrderSpecifiedVoList.map(e => {
            return {
              disName: e.teamName,
              disUserCode: e.teamInfoCode
            };
          });

          // 项目
          this.selectData = {
            longitude: data.redisAddressList[0].location[0] - 0,
            latitude: data.redisAddressList[0].location[1] - 0
          };

          this.formData = {
            ...this.formData,
            'projectName': data.redisOrderInfoVo.projectName, // 项目名
            'projectCode': data.redisOrderInfoVo.projectCode, // 项目Code		false
            'dispatcherCodes': this.schedSelect.map(e => e.disUserCode), // 调度车队Code		false
            // 'orderType': '1200', // 货源类型		false 默认写死
            'geofenceToggle': data.redisOrderInfoVo.isOpenEnclosure === 1, // 电子围栏是否开启 1 是 0 否		false
            'remark': data.redisOrderInfoVo.remark, // 备注		false
            'geofenceRadius': data.redisOrderInfoVo.geofenceRadius, // 电子围栏范围		false
            'publishMode': data.redisOrderInfoVo.publishMode, // 发布方式 0 货源大厅不可见(只能通过货单号或备注搜索) 1 货源大厅可见 默认写死

            // 选填
            'branchCode': undefined, //
            'orgCode': undefined,
            'publishCode': undefined //	发布人Code		false
          };
        }
      },
      immediate: true
    }
  },

  created() {

  },

  methods: {

    // 项目
    handlerProject() {
      // console.log(this.selectData, '项目'); // 选择好的项目
      this.formData.projectCode = this.selectData.code;
      this.formData.projectName = this.selectData.projectName;
      this.openObj = false;
    },

    // 调度者
    handlerScheduling() {
      // console.log(this.schedSelect, '调度者');
      this.formData.dispatcherCodes = this.schedSelect.map(e => e.disUserCode);
      this.scheduling = false;
    },

    // 关闭
    hamdlerClose(tag) {
      this.schedSelect = this.schedSelect.filter(e => e.code !== tag.code);
    },

    // 预览
    hangdlerYulang() {
      // console.log(this.selectData);

      if (JSON.stringify(this.selectData) === '{}' || !this.selectData.latitude || !this.selectData.longitude) {
        this.$alert('请选择项目工程后才可进行设置围栏半径', '设置提示', {
          confirmButtonText: '确定'
        }).then(() => { this.openObj = true; }).catch(() => {});
      } else {
        const { latitude, longitude } = this.selectData;
        this.lnglat = [longitude, latitude];
        this.mapDialog = true;
        console.log({ latitude, longitude });
      }
    },

    // 提交
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          // console.log(this.formData);

          const qer = {
            ...this.formData,
            'geofenceToggle': this.formData.geofenceToggle ? 1 : 0, // 电子围栏是否开启 1 是 0 否		false
            'geofenceRadius': this.formData.geofenceToggle ? this.formData.geofenceRadius : undefined,
            projectName: undefined // 不需要传这个
          };

          this.loading = true;
          ztPublishOrder(qer).then(res => {
            this.msgSuccess(res.msg);
            // 跳转
            var time1 = setTimeout(() => {
              clearTimeout(time1);
              time1 = null;
              this.loading = false;
              this.$router.push({ name: 'Manage', query: { p: Date.now() }});
            }, 700);
          }).catch(() => {
            this.loading = false;
          });
        } else {
          // console.log('error submit!!');
          return false;
        }
      });
    },

    handlerReset(formName) {
      this.resetForm(formName);
      this.schedSelect = [];
    }
  }

};
</script>

<style lang="scss" scoped>
.header {
  padding-bottom: 10px;
  position: relative;
  font-weight: 700;
  &::before {
    content: "";
    position: absolute;
    width: 3px;
    height: 20px;
    left: -15px;
    top: 1px;
    background-color: #1890ff;
  }
}

</style>
