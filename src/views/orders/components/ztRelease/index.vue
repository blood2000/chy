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
        <el-button v-if="!isCbdata" class="ml10" size="mini" type="primary" @click="openObj = true">请选择项目工程</el-button>
      </el-form-item>

      <el-form-item label="选择调度" prop="dispatcherCodes">

        <!-- <span>{{ formData.dispatcherCodes }}</span> -->
        <el-tag
          v-for="tag in orderSpecifiedList"
          :key="tag.code"
          class="mr10"
          closable
          :type="'warning'"
          @close="hamdlerClose(tag)"
        >
          {{ tag.driverName || tag.teamName }}
        </el-tag>

        <el-button v-if="!isEdit" class="ml10" size="mini" type="primary" @click="handlerOpen">请选择调度</el-button>
      </el-form-item>

      <el-form-item v-if="false" label="渣土类型" prop="orderType">
        <el-radio-group v-model="formData.orderType" disabled>
          <el-radio label="1200">渣土场</el-radio>
          <el-radio label="2">场内</el-radio>
          <el-radio label="3">自倒</el-radio>
        </el-radio-group>
      </el-form-item>

      <el-form-item v-if="false" label="是否启用电子围栏" prop="geofenceToggle">
        <el-switch v-model="formData.geofenceToggle" :disabled="isCbdata" />
      </el-form-item>

      <el-form-item v-if="false && formData.geofenceToggle" label="围栏半径" prop="geofenceRadius">
        <el-input-number v-model="formData.geofenceRadius" :min="0" label="请输入围栏半径" :disabled="isCbdata" />
        <el-button v-if="!isCbdata" class="ml10" size="mini" type="primary" @click="hangdlerYulang">预览</el-button>
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
        <el-button v-if="!cbData" type="primary" plain @click="handlerReset('elForm')">重 置</el-button>
        <el-button v-else type="primary" plain @click="$router.back()">返 回</el-button>
        <el-button type="primary" :loading="loading" @click="submitForm('elForm')">{{ cbData? '立即保存':'立即发布' }}</el-button>
      </el-form-item>
      <el-form-item v-else>
        <el-button type="primary" plain @click="$router.back()">返 回</el-button>
      </el-form-item>

    </div>


    <!-- 打开弹框 -->
    <el-dialog :close-on-click-modal="false" title="项目工程" :visible.sync="openObj" width="80%">
      <div v-if="openObj">
        <ProjectIndex ref="ProjectIndex" :shipment-code="shipmentInfo.code" :company-code="shipmentInfo.companyCode" :iscomponent="true" @selected="(data)=> selectData = data" />

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
        <GroupIndex
          ref="GroupIndex"
          :shipment-code="shipmentInfo.code"
          :iscomponent="true"
          :cb-data-by-keyword="cbDataByKeyword"
          :cbone-tselected="cboneTselected"
          @groupSelected="(data)=> schedSelect = data"
          @oneSelected="(data)=> oneTselected = data"
        />

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

import { ztPublishOrder, ztUpdateOrder } from '@/api/order/release'; // 发布渣土请求

import { objReduce } from '@/utils/ddc';

export default {
  components: { ProjectIndex, GroupIndex, MapDialog },

  props: {
    cbData: {
      type: Object,
      default: null
    },
    ztshipmentinfo: {
      type: Object,
      default: null
    },
    isT: [Boolean]
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
        'publishMode': 1, // 发布方式 0 货源大厅不可见(只能通过货单号或备注搜索) 1 货源大厅可见 默认写死可见

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
      'lnglat': [], // 项目位置

      'oneTselected': [], // 选中的调度
      'cboneTselected': [], // 回填使用

      orderSpecifiedList: [] // 页面展示的调度者(schedSelect + oneTselected)




      // projectCode_option: [],
      // dispatcherCodes_option: []
    };
  },

  computed: {
    shipmentInfo() {
      const { isShipment = false, shipment = {}} = getUserInfo() || {};

      let shipmentInfo = {};
      if (this.ztshipmentinfo) {
        shipmentInfo = this.ztshipmentinfo;
      } else {
        shipmentInfo = !isShipment ? (shipment.info || {}) : {};
      }

      return shipmentInfo;
    },
    cbDataByKeyword() {
      let obj = {};
      if (this.orderSpecifiedList.length) {
        obj = { disUserCode: this.orderSpecifiedList.map(e => e.code) };
        // obj = { id: this.schedSelect.map(e => e.id) };
      }
      return obj;
    },

    // true: 是详情  false: 是编辑
    isEdit() {
      return this.isT;
    },
    isCbdata() {
      return !!this.cbData;
    }
  },

  watch: {
    cbData: {
      handler(data) {
        if (data) {
          // 调度者
          this.orderSpecifiedList = data.redisOrderSpecifiedVoList.map(e => {
            e = {
              ...e,
              disName: e.teamName,
              teamName: e.teamName,
              disUserCode: e.teamInfoCode,
              code: e.teamInfoCode,
              disUserName: e.nickName,
              name: e.teamName,
              disUserPhone: e.phonenumber.substr(0, 3) + '****' + e.phonenumber.substr(7, 11)
            };

            if (e.isCommonly) {
              this.schedSelect.push(e);
            } else {
              // e.disUserCode = e.code;
              // e.disName = e.teamName;
              // e.disName = e.teamName + '的调度组';
              // e.disUserName = e.nickName;
              // e.disUserPhone = e.phonenumber.substr(0, 3) + '****' + e.phonenumber.substr(7, 11);

              // bool = !e.isCommonly;


              this.oneTselected.push(e);
            }

            return e;
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
            'dispatcherCodes': this.orderSpecifiedList.map(e => e.code), // 调度车队Code		false
            // 'orderType': '1200', // 货源类型		false 默认写死
            'geofenceToggle': data.redisOrderInfoVo.isOpenEnclosure === 1, // 电子围栏是否开启 1 是 0 否		false
            'remark': data.redisOrderInfoVo.remark, // 备注		false
            'geofenceRadius': data.redisOrderInfoVo.geofenceRadius, // 电子围栏范围		false
            'publishMode': data.redisOrderInfoVo.publishMode, // 发布方式 0 货源大厅不可见(只能通过货单号或备注搜索) 1 货源大厅可见 默认写死
            'orderCode': data.redisOrderInfoVo.code || undefined,
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
      this.formData.projectCode = this.selectData.code;
      this.formData.projectName = this.selectData.projectName;
      this.openObj = false;
    },

    // 调度者
    handlerScheduling() {
      // this.formData.dispatcherCodes = this.schedSelect.map(e => e.disUserCode);


      const arr = this.schedSelect.map(e => {
        return {
          // ...e, // 需要其他再加
          _tinCode: e.code,
          code: e.disUserCode,
          teamName: e.disName,
          type: 'info',
          userType: 1,
          isCommonly: true // 添加一个标识区别独立调度者
        };
      });

      const arr2 = this.oneTselected.map(e => {
        return {
          ...e, // 需要其他再加
          disUserCode: e.disUserCode,
          disName: e.disName,
          name: e.name,
          disUserName: e.disUserName,
          disUserPhone: e.disUserPhone,

          // 上面是列表展示字段使用
          _tinCode: e.code,
          code: e.disUserCode,
          teamName: e.disName,
          type: 'info',
          userType: 1,
          isCommonly: false // 添加一个标识区别独立调度者
        };
      });

      // 去重一下
      this.orderSpecifiedList = objReduce(arr.concat(arr2), 'code');

      this.oneTselected = this.orderSpecifiedList.filter(e => !e.isCommonly);

      this.formData.dispatcherCodes = this.orderSpecifiedList.map(e => e.code);

      this.scheduling = false;
    },

    // 关闭
    hamdlerClose(tag) {
      this.orderSpecifiedList = this.orderSpecifiedList.filter(e => e.code !== tag.code);

      this.schedSelect = this.orderSpecifiedList.filter(e => {
        return e.isCommonly;
      });

      this.oneTselected = this.orderSpecifiedList.filter(e => {
        return !e.isCommonly;
      });
    },

    // 预览
    hangdlerYulang() {
      if (JSON.stringify(this.selectData) === '{}' || !this.selectData.latitude || !this.selectData.longitude) {
        this.$alert('请选择项目工程后才可进行设置围栏半径', '设置提示', {
          confirmButtonText: '确定'
        }).then(() => { this.openObj = true; }).catch(() => {});
      } else {
        const { latitude, longitude } = this.selectData;
        this.lnglat = [longitude, latitude];
        this.mapDialog = true;
      }
    },

    // 打开调度者框
    handlerOpen() {
      this.scheduling = true;
      this.cboneTselected = this.oneTselected.map(e => {
        // disName: e.disName
        // disUserName
        // disUserPhone

        return {
          ...e
        };
      });
    },

    // 提交
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          const qer = {
            ...this.formData,
            'publishCode': this.shipmentInfo ? this.shipmentInfo.code : undefined,
            'geofenceToggle': this.formData.geofenceToggle ? 1 : 0, // 电子围栏是否开启 1 是 0 否		false
            'geofenceRadius': this.formData.geofenceToggle ? this.formData.geofenceRadius : undefined,
            projectName: undefined // 不需要传这个
          };


          const fn = this.isCbdata ? ztUpdateOrder : ztPublishOrder;

          this.loading = true;
          fn(qer).then(res => {
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
