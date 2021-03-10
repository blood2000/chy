<template>
  <el-dialog :title="title" :visible="visible" width="800px" append-to-body @close="cancel">
    <el-form ref="form" :model="form" :rules="rules" :disabled="disable" label-width="140px">
      <el-form-item label="发货人/发货企业" prop="shipperType">
        <el-select
          class="width90"
          v-model="form.shipperType"
          clearable
          size="small"
        >
          <el-option
            v-for="dict in typeOptions"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictValue"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="姓名" prop="adminName">
        <el-input v-model="form.adminName" placeholder="支持自动识别" size="small" class="width90" clearable/>
      </el-form-item>
      <el-form-item label="身份证号" prop="identificationNumber">
        <el-input v-model="form.identificationNumber" placeholder="支持自动识别" size="small" class="width90" clearable/>
      </el-form-item>
      <template v-if="form.shipperType === 1">
        <el-form-item label="公司名称" prop="companyName">
          <el-input v-model="form.companyName" placeholder="请输入公司名称" size="small" class="width90" clearable/>
        </el-form-item>
        <el-form-item label="统一社会信用代码" prop="organizationCodeNo">
          <el-input v-model="form.organizationCodeNo" placeholder="请输入统一社会信用代码" size="small" class="width90" clearable/>
        </el-form-item>
      </template>
      <el-form-item label="营业执照号" prop="businessLicenseNo">
        <el-input v-model="form.businessLicenseNo" placeholder="请输入营业执照号" size="small" class="width90" clearable/>
      </el-form-item>
      <el-form-item label="法人身份证" prop="artificialIdentificationNumber">
        <el-input v-model="form.artificialIdentificationNumber" placeholder="请输入法人身份证" size="small" class="width90" clearable/>
      </el-form-item>
      <el-form-item>
        <el-row>
          <el-col :span="7" class="mb">
            <p class="upload-image-label">管理员身份证正面照</p>
            <upload-image :value="form.identificationImg"></upload-image>
          </el-col>
          <el-col :span="7" class="mb">
            <p class="upload-image-label">管理员身份证背面照</p>
            <upload-image :value="form.identificationBackImg"></upload-image>
          </el-col>
          <el-col :span="7" class="mb">
            <p class="upload-image-label">手持身份证照</p>
            <upload-image :value="form.identificationInhandImg"></upload-image>
          </el-col>
          <el-col :span="7">
            <p class="upload-image-label">营业执照照</p>
            <upload-image :value="form.businessLicenseImg"></upload-image>
          </el-col>
          <el-col :span="7">
            <p class="upload-image-label">法人身份证正面照</p>
            <upload-image :value="form.artificialIdentificationImg"></upload-image>
          </el-col>
        </el-row>
      </el-form-item>
      <el-form-item label="审核状态">
        <el-radio-group v-model="form.authStatus">
          <el-radio
            v-for="dict in statusOptions"
            :key="dict.dictValue"
            :label="parseInt(dict.dictValue)"
          >{{dict.dictLabel}}</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="是否冻结" prop="isFreezone">
        <el-select
          v-model="form.isFreezone"
          clearable
          size="small"
          class="width90"
        >
          <el-option
            v-for="dict in isFreezoneOptions"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictValue"
          />
        </el-select>
      </el-form-item>

      <!-- <el-form-item label="所在区域" prop="shipmentArea">
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
      </el-form-item> -->
      <!-- <el-form-item label="税点(%)" prop="shipmentTaxPoint">
        <el-input-number v-model="form.shipmentTaxPoint" controls-position="right" size="small" placeholder="请输入税点" :min="0" :max="100" class="width90" />
      </el-form-item> -->
      <!-- <el-form-item label="服务费比例" prop="shipmentServiceRatio">
        <el-input-number v-model="form.shipmentServiceRatio" controls-position="right" size="small" placeholder="请输入服务费比例" :min="0" :max="100" class="width90" />
      </el-form-item> -->
      <!-- <el-form-item label="服务费税率" prop="shipmentTaxTate">
        <el-input-number v-model="form.shipmentTaxTate" controls-position="right" size="small" placeholder="请输入服务费税率" :min="0" :max="100" class="width90" />
      </el-form-item> -->
      <!-- <el-form-item label="去零" prop="shipmentGoZero">
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
      </el-form-item> -->
      <!-- <el-form-item label="合理路耗" prop="shipmentConsume">
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
      </el-form-item> -->
      <!-- <el-form-item label="是否月结客户" prop="shipmentMonthly">
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
      </el-form-item> -->
      <!-- <el-form-item label="是否预付运费" prop="shipmentPrepaid">
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
      </el-form-item> -->
      <!-- <el-form-item label="索票阶段" prop="shipmentAskTicket">
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
      </el-form-item> -->
      <!-- <el-form-item label="货源代收调度" prop="shipmentSupplyDispatch">
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
      </el-form-item> -->
      <!-- <el-form-item>
        <el-checkbox v-model="form.isReview">货源是否需要平台审核</el-checkbox>
        <el-checkbox v-model="form.isImage">是否不需要卸货图片</el-checkbox>
      </el-form-item> -->
    </el-form>

    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="submitForm">确 定</el-button>
      <el-button @click="cancel">取 消</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { addShipment, updateShipment } from "@/api/assets/shipment";
import UploadImage from '@/components/UploadImage/index';

export default {
  props: {
    title: String,
    open: Boolean,
    disable: Boolean
  },
  components: {
    UploadImage
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
  data() {
    return {
      // 字典
      typeOptions: [
        {dictLabel: '发货人', dictValue: 0},
        {dictLabel: '发货企业', dictValue: 1}
      ],
      // 审核状态字典
      statusOptions: [
        {dictLabel: '未审核', dictValue: 0},
        {dictLabel: '审核中', dictValue: 1},
        {dictLabel: '审核未通过', dictValue: 2},
        {dictLabel: '审核通过', dictValue: 3}
      ],
      // 是否冻结字典
      isFreezoneOptions: [
        {dictLabel: '正常', dictValue: 0},
        {dictLabel: '冻结', dictValue: 1}
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
        adminName: [
          { required: true, message: "姓名不能为空", trigger: "blur" }
        ],
        identificationNumber: [
          { required: true, message: "身份证号不能为空", trigger: "blur" }
        ],
        companyName: [
          { required: true, message: "公司名称不能为空", trigger: "blur" }
        ],
        organizationCodeNo: [
          { required: true, message: "统一社会信用代码不能为空", trigger: "blur" }
        ]
      }
    }
  },
  created() {
    
  },
  methods: {
    /** 提交按钮 */
    submitForm: function() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != undefined) {
            updateShipment(this.form).then(response => {
              this.msgSuccess("修改成功");
              this.close();
              this.$emit('refresh');
            });
          } else {
            const shipmentInfo = this.form;
            addShipment(shipmentInfo).then(response => {
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
        id: null,
        code: null,
        adminName: null,
        adminCode: null,
        companyCode: null,
        companyName: null,
        shipperType: null,
        identificationNumber: null,
        identificationImg: null,
        identificationBackImg: null,
        identificationInhandImg: null,
        businessLicenseImg: null,
        businessLicenseNo: null,
        organizationCodeNo: null,
        artificialIdentificationNumber: null,
        artificialIdentificationImg: null,
        authStatus: 0,
        isFreezone: null,
        createTime: null,
        updateTime: null,
        createCode: null,
        updateCode: null,
        delFlag: null
      };
      this.resetForm("form");
    },
    // 表单赋值
    setForm(data) {
      this.form = data;
    }
  }
}
</script>

<style scoped>
.mr3{
  margin-right: 3%;
}
.mb{
  margin-bottom: 22px;
}
.width90{
  width: 90%;
}
.width28{
  width: 28%;
}
/* 计数器样式 */
.el-input-number ::v-deep.el-input__inner{
  text-align: left;
}
/* 上传图片文字样式 */
.upload-image-label{
  margin: 0;
  line-height: 24px;
}
</style>