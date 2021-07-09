<template>
  <el-form
    ref="elForm"
    :model="formData"
    :rules="rules"
    size="medium"
    label-width="150px"
    :label-position="'left'"
  >
    <div class="app-container">
      <div class="header mb8">渣土货源</div>


      <el-form-item label="项目工程" prop="xiangmianigg">
        <!-- 待处理 -->
        <el-tag v-if="formData.xiangmianigg" :type="'warning'">
          {{ formData.xiangmianigg }}
        </el-tag>
        <el-button class="ml10" size="mini" type="primary" @click="openObj = true">请选择项目工程</el-button>
      </el-form-item>

      <el-form-item label="选择调度" prop="diiaidajiogajo">
        <!-- <el-select
          v-model="formData.diiaidajiogajo"
          placeholder="请选择调度"
          filterable
        >
          <el-option
            v-for="(dict,index) in diiaidajiogajo_option"
            :key="index"
            :label="dict.dictLabel"
            :value="dict.dictValue"
          />
        </el-select> -->

        <span>{{ formData.diiaidajiogajo }}</span>
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

        <el-button class="ml10" size="mini" type="primary" @click="scheduling = true">请选择调度</el-button>
      </el-form-item>

      <el-form-item label="渣土类型" prop="zhatuleix">
        <el-radio-group v-model="formData.zhatuleix">
          <el-radio :label="1">渣土场</el-radio>
          <el-radio :label="2">场内</el-radio>
          <el-radio :label="3">自倒</el-radio>
        </el-radio-group>
      </el-form-item>

      <el-form-item label="是否启用电子围栏" prop="isqiqihigii">
        <el-switch v-model="formData.isqiqihigii" />
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

      <el-form-item>
        <el-button type="primary" plain>取 消</el-button>
        <el-button type="primary">立即发布</el-button>
      </el-form-item>

    </div>


    <!-- 打开弹框 -->
    <el-dialog :close-on-click-modal="false" title="项目工程" :visible.sync="openObj" width="80%">
      <div v-if="openObj">
        <ProjectIndex ref="ProjectIndex" :shipment-code="shipmentInfo.code" :iscomponent="true" @selected="(data)=> selectData = data" />

        <el-form-item>
          <div class="ly-t-right">
            <el-button type="primary" plain @click="openObj = false">取 消</el-button>
            <el-button type="primary" @click="formData.xiangmianigg = selectData.projectName; openObj = false;">确 定</el-button>
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

  </el-form>
</template>

<script>
import ProjectIndex from '@/views/enterprise/project';
import GroupIndex from '@/views/enterprise/group';

import { getUserInfo } from '@/utils/auth';
export default {
  components: { ProjectIndex, GroupIndex },

  data() {
    return {
      'formData': {
        'xiangmianigg': undefined,
        'diiaidajiogajo': undefined,
        'zhatuleix': 1,
        'isqiqihigii': true,
        'remark': ''
      },
      'rules': {
        xiangmianigg: [{ required: true, message: '请选择项目工程', trigger: 'change' }],
        diiaidajiogajo: [{ required: true, message: '请选择调度', trigger: 'change' }],
        zhatuleix: [{ required: true, trigger: 'change' }]
      },

      'openObj': false, // 项目工程 弹框
      'selectData': {}, // 选中的项目

      'scheduling': false, // 调度 弹框
      'schedSelect': [], // 选中的调度


      xiangmianigg_option: [],
      diiaidajiogajo_option: []
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
    }
  },

  created() {},

  methods: {

    handlerScheduling() {
      // console.log(this.schedSelect);
      this.scheduling = false;
    },

    // 关闭 (tag)=>schedSelect = schedSelect.filter(e=> e.code !== tag.code)
    hamdlerClose(tag) {
      this.schedSelect = this.schedSelect.filter(e => e.code !== tag.code);
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
