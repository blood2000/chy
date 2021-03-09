<template>
  <el-dialog :title="title" :visible="visible" width="800px" append-to-body @close="cancel">
    <el-form ref="form" :model="form" :rules="rules" label-width="140px">
      <el-form-item label="发货人/发货企业" prop="shipmentShip">
        <el-select
          class="width90"
          v-model="form.shipmentShip"
          clearable
          size="small"
        >
          <el-option
            v-for="dict in shipOptions"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictValue"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="手机号码" prop="shipmentTelephone">
        <el-input v-model="form.shipmentTelephone" placeholder="请输入手机号码" size="small" class="width90"/>
      </el-form-item>
      <el-form-item label="密码" prop="shipmentPassword">
        <el-input v-model="form.shipmentPassword" placeholder="请输入密码" type="password" size="small" class="width90" />
      </el-form-item>
      <el-form-item label="姓名" prop="shipmentName">
        <el-input v-model="form.shipmentName" placeholder="支持自动识别" size="small" class="width90"/>
      </el-form-item>
      <el-form-item label="身份证号" prop="shipmentIDCard">
        <el-input v-model="form.shipmentIDCard" placeholder="支持自动识别" size="small" class="width90"/>
      </el-form-item>
      <template v-if="form.shipmentShip == '发货企业'">
        <el-form-item label="公司名称" prop="shipmentCompany">
          <el-input v-model="form.shipmentCompany" placeholder="请输入公司名称" size="small" class="width90"/>
        </el-form-item>
        <el-form-item label="统一社会信用代码" prop="shipmentSocialCode">
          <el-input v-model="form.shipmentSocialCode" placeholder="请输入营业执照号" size="small" class="width90"/>
        </el-form-item>
      </template>
      <el-form-item label="所在区域" prop="shipmentArea">
        <el-select
          v-model="form.shipmentProvince"
          clearable
          size="small"
          class="width28 mr3"
        >
          <el-option
            v-for="dict in provinceOptions"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictValue"
          />
        </el-select>
        <el-select
          v-model="form.shipmentCity"
          clearable
          size="small"
          class="width28 mr3"
        >
          <el-option
            v-for="dict in cityOptions"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictValue"
          />
        </el-select>
        <el-select
          v-model="form.shipmentCounty"
          clearable
          size="small"
          class="width28"
        >
          <el-option
            v-for="dict in countyOptions"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictValue"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="详细地址" prop="shipmentAddress">
        <el-input v-model="form.shipmentAddress" placeholder="支持自动识别" size="small" class="width90"/>
      </el-form-item>
      
      <el-form-item>
        <upload-image></upload-image>
      </el-form-item>

      <el-form-item label="是否核算运单" prop="shipmentAccounting">
        <el-select
          v-model="form.shipmentAccounting"
          clearable
          size="small"
          class="width90"
        >
          <el-option
            v-for="dict in isOptions"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictValue"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="税点(%)" prop="shipmentTaxPoint">
        <el-input-number v-model="form.shipmentTaxPoint" controls-position="right" size="small" placeholder="请输入税点" :min="0" :max="100" class="width90" />
      </el-form-item>
      <el-form-item label="服务费比例" prop="shipmentServiceRatio">
        <el-input-number v-model="form.shipmentServiceRatio" controls-position="right" size="small" placeholder="请输入服务费比例" :min="0" :max="100" class="width90" />
      </el-form-item>
      <el-form-item label="服务费税率" prop="shipmentTaxTate">
        <el-input-number v-model="form.shipmentTaxTate" controls-position="right" size="small" placeholder="请输入服务费税率" :min="0" :max="100" class="width90" />
      </el-form-item>
      <el-form-item label="去零" prop="shipmentGoZero">
        <el-select
          v-model="form.shipmentGoZero"
          clearable
          size="small"
          class="width90"
        >
          <el-option
            v-for="dict in zeroOptions"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictValue"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="合理路耗" prop="shipmentConsume">
        <el-select
          v-model="form.shipmentConsume"
          clearable
          size="small"
          class="width90"
        >
          <el-option
            v-for="dict in consumeOptions"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictValue"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="是否月结客户" prop="shipmentMonthly">
        <el-select
          v-model="form.shipmentMonthly"
          clearable
          size="small"
          class="width28 mr3"
        >
          <el-option
            v-for="dict in isOptions"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictValue"
          />
        </el-select>
        <el-input-number v-model="form.shipmentAmount" controls-position="right" size="small" placeholder="授信金额(保留两位小数)" :min="0" :max="10000" class="width28" />
      </el-form-item>
      <el-form-item label="是否预付运费" prop="shipmentPrepaid">
        <el-select
          v-model="form.shipmentPrepaid"
          clearable
          size="small"
          class="width90"
        >
          <el-option
            v-for="dict in isOptions"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictValue"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="索票阶段" prop="shipmentAskTicket">
        <el-select
          v-model="form.shipmentAskTicket"
          clearable
          size="small"
          class="width90"
        >
          <el-option
            v-for="dict in askTicketOptions"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictValue"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="货源代收调度" prop="shipmentSupplyDispatch">
        <el-select
          v-model="form.shipmentSupplyDispatch"
          clearable
          size="small"
          class="width90"
        >
          <el-option
            v-for="dict in supplyDispatchOptions"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictValue"
          />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-checkbox v-model="form.isReview">货源是否需要平台审核</el-checkbox>
        <el-checkbox v-model="form.isImage">是否不需要卸货图片</el-checkbox>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="submitForm">确 定</el-button>
      <el-button @click="cancel">取 消</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { addConfig, updateConfig } from "@/api/assets/shipment";
import UploadImage from '@/components/UploadImage/index';

export default {
  props: {
    title: String,
    open: Boolean
  },
  components: {
    UploadImage
  },
  data() {
    return {
      // 字典
      shipOptions: [
        {dictLabel: '发货人', dictValue: '发货人'},
        {dictLabel: '发货企业', dictValue: '发货企业'}
      ],
      isOptions: [
        {dictLabel: '是', dictValue: '是'},
        {dictLabel: '否', dictValue:'否'}
      ],
      // 区域字典
      provinceOptions: [],
      cityOptions: [],
      countyOptions: [],
      // 去零字典
      zeroOptions: [
        {dictLabel: '关闭', dictValue: '关闭'},
        {dictLabel: '1', dictValue:'1'},
        {dictLabel: '10', dictValue:'10'}
      ],
      // 路耗字典
      consumeOptions: [
        {dictLabel: '关闭', dictValue: '关闭'},
        {dictLabel: '定额(kg/车)', dictValue:'定额(kg/车)'},
        {dictLabel: '定率(%/车)', dictValue:'定率(%/车)'}
      ],
      // 索票阶段字典
      askTicketOptions: [
        {dictLabel: '打款后', dictValue: '打款后'},
        {dictLabel: '结算后', dictValue:'结算后'}
      ],
      // 货源代收调度字典
      supplyDispatchOptions: [
        {dictLabel: '关闭', dictValue: '关闭'},
        {dictLabel: '开启', dictValue:'开启'}
      ],
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        shipmentTelephone: [
          { required: true, message: "手机号码不能为空", trigger: "blur" }
        ],
        shipmentName: [
          { required: true, message: "姓名不能为空", trigger: "blur" }
        ],
        shipmentIDCard: [
          { required: true, message: "身份证号不能为空", trigger: "blur" }
        ],
        shipmentArea: [
          { required: true, message: "所在区域不能为空", trigger: "blur" }
        ],
        shipmentAddress: [
          { required: true, message: "详细地址不能为空", trigger: "blur" }
        ],
        shipmentServiceRatio: [
          { required: true, message: "服务费比例不能为空", trigger: "blur" }
        ],
        shipmentTaxTate: [
          { required: true, message: "服务费税率不能为空", trigger: "blur" }
        ],
        shipmentGoZero: [
          { required: true, message: "去零不能为空", trigger: "blur" }
        ],
        shipmentConsume: [
          { required: true, message: "合理路耗不能为空", trigger: "blur" }
        ],
        shipmentCompany: [
          { required: true, message: "公司名称不能为空", trigger: "blur" }
        ],
        shipmentSocialCode: [
          { required: true, message: "统一社会信用代码不能为空", trigger: "blur" }
        ]
      }
    }
  },
  computed: {
    visible: {
      get() {
        return this.open;
      },
      set(v) {
        this.$emit("update:open", v);
      },
    },
  },
  created() {
    
  },
  methods: {
    /** 提交按钮 */
    submitForm: function() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.configId != undefined) {
            updateConfig(this.form).then(response => {
              this.msgSuccess("修改成功");
              this.close();
              this.$emit('refresh');
            });
          } else {
            addConfig(this.form).then(response => {
              this.msgSuccess("新增成功");
              this.close();
              this.$emit('refresh');
            });
          }
        }
      });
    },
    /** 取消按钮 */
    cancel() {
      this.close();
      this.reset();
    },
    // 关闭弹窗
    close() {
      this.$emit("update:open", false);
    },
    // 表单重置
    reset() {
      this.form = {
        configId: undefined,
        shipmentName: undefined,
        configValue: undefined,
        configType: "Y",
        remark: undefined
      };
      this.resetForm("form");
    },
  }
}
</script>

<style scoped>
.mr3{
  margin-right: 3%;
}
.width90{
  width: 90%;
}
.width28{
  width: 28%;
}
.el-input-number ::v-deep.el-input__inner{
  text-align: left;
}
</style>