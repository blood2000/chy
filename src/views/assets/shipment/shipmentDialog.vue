<template>
  <el-dialog :class="[{'i-add':title==='新增'},{'i-check':title==='审核'}]" :title="title" :visible="visible" width="800px" append-to-body :close-on-click-modal="disable" @close="cancel">
    <el-form ref="form" :model="form" :rules="rules" :disabled="disable" label-width="170px">
      <!--  修改：目前只有发货企业 -->
      <!-- <el-form-item label="发货人/发货企业" prop="shipperType">
              <el-select
                v-model="form.shipperType"
                class="width90"
              >
                <el-option
                  v-for="dict in typeOptions"
                  :key="dict.dictValue"
                  :label="dict.dictLabel"
                  :value="dict.dictValue"
                />
              </el-select>
            </el-form-item>-->
      <el-form-item label="手机号/账号" prop="telphone">
        <el-input ref="telphone" v-model="form.telphone" placeholder="请输入手机号/账号" :disabled="form.id?true:false" class="width90" clearable @blur="getUserAlreadyExist" />
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input v-model="form.password" type="password" :placeholder="form.id?'密码未修改可不填写':'请输入密码'" class="width60 mr3" clearable />
        <span class="g-color-blue">(初始密码为{{ initialPassword }})</span>
      </el-form-item>
      <el-form-item>
        <el-row v-viewer>
          <!--   客服建议去掉合并管理员和法人信息-->
          <el-col :span="7">
            <p class="upload-image-label">身份证(人像面)</p>
            <upload-image v-model="form.identificationImg" :disabled="disable" image-type="id-card" side="front" icon-type="idcard" @fillForm="fillForm" />
          </el-col>
          <el-col :span="7">
            <p class="upload-image-label">身份证(国徽面)</p>
            <upload-image v-model="form.identificationBackImg" :disabled="disable" image-type="id-card" side="back" icon-type="idcard_back" @fillForm="fillForm" />
          </el-col>
          <!--   客服建议去掉-->
          <!-- <el-col :span="7">
                      <p class="upload-image-label">手持身份证照</p>
                      <upload-image v-model="form.identificationInhandImg" icon-type="idcard_hand" :disabled="disable" />
                    </el-col>-->
          <!-- <el-col v-show="form.shipperType === 1" :span="7">
                      <p class="upload-image-label">法人身份证(人像面)</p>
                      <upload-image v-model="form.artificialIdentificationImg" icon-type="idcard" :disabled="disable" @fillForm="fillForm"/>
                    </el-col>
                    <el-col v-show="form.shipperType === 1" :span="7">
                      <p class="upload-image-label">法人身份证(国徽面)</p>
                      <upload-image v-model="form.artificialIdentificationBackImg" icon-type="idcard_back" :disabled="disable" @fillForm="fillForm"/>
                    </el-col>-->
          <!--   客服建议去掉-->
          <!--<el-col v-show="form.shipperType === 1" :span="7" class="mt">
                      <p class="upload-image-label">法人手持身份证照</p>
                      <upload-image v-model="form.artificialIdentificationInhandImg" icon-type="idcard_hand" :disabled="disable" />
                    </el-col>-->
          <el-col v-show="form.shipperType === 1" :span="7">
            <p class="upload-image-label">营业执照</p>
            <upload-image v-model="form.businessLicenseImg" :disabled="disable" icon-type="organization" image-type="business-license" @fillForm="fillForm" />
          </el-col>
        </el-row>
      </el-form-item>
      <el-form-item label="姓名" prop="adminName">
        <el-input v-model="form.adminName" placeholder="支持自动识别" class="width90" clearable />
      </el-form-item>
      <el-form-item label="身份证号" prop="identificationNumber">
        <el-input v-model="form.identificationNumber" placeholder="支持自动识别" class="width90" clearable />
      </el-form-item>
      <el-form-item prop="identificationEndTime">
        <label slot="label"><span style="color: #ff4949">* </span>身份证有效期</label>
        <el-date-picker
          v-model="form.identificationBeginTime"
          clearable
          class="width28"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="支持自动识别"
        />
        至
        <el-date-picker
          v-model="form.identificationEndTime"
          clearable
          class="width28 mr3"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="支持自动识别"
          :disabled="!!form.identificationEffective"
        />
        <el-checkbox v-model="form.identificationEffective">长期有效</el-checkbox>
      </el-form-item>
      <!-- 选择省/市/区 -->
      <!-- <province-city-county
              ref="ChooseArea"
              :visible="visible"
              :disabled="disable"
              :prop-province-code="form.provinceCode"
              :prop-city-code="form.cityCode"
              :prop-county-code="form.countyCode"
              @refresh="(data) => {
                form.provinceCode = data.provinceCode;
                form.cityCode = data.cityCode;
                form.countyCode = data.countyCode;
              }"
            />-->
      <el-form-item label="详细地址" prop="area">
        <el-input v-model="form.area" clearable placeholder="支持自动识别" class="width90" />
      </el-form-item>
      <!-- <el-form-item label="网点" prop="branchCode">
              <el-select
                v-model="form.branchCode"
                filterable
                remote
                reserve-keyword
                placeholder="请输入网点"
                class="width90"
                :remote-method="getBranchOptions"
                :loading="loading"
              >
                <el-option
                  v-for="item in branchOptions"
                  :key="item.code"
                  :label="item.name"
                  :value="item.code"
                />
              </el-select>
            </el-form-item> -->
      <template v-if="form.shipperType === 1">
        <el-form-item label="企业名称" prop="companyName" :rules="[{ required: true, message: '企业名称不能为空', trigger: 'blur' }]">
          <el-input v-model="form.companyName" placeholder="支持自动识别" class="width90" clearable />
          <!-- <el-select
                      v-model="form.companyName"
                      style="width: 90%"
                      filterable
                      allow-create
                      default-first-option
                      placeholder="请选择企业"
                      @change="changeCompany"
                    >
                      <el-option
                        v-for="item in companyList"
                        :key="item.orgName"
                        :label="item.orgName"
                        :value="item"
                      />
                    </el-select>-->
        </el-form-item>
        <el-form-item label="统一社会信用代码" prop="organizationCodeNo" :rules="[{ required: true, message: '统一社会信用代码不能为空', trigger: 'blur' }]">
          <el-input v-model="form.organizationCodeNo" placeholder="请输入统一社会信用代码" class="width90" clearable />
        </el-form-item>
        <!--  去掉营业执照-->
        <!-- <el-form-item label="营业执照号" prop="businessLicenseNo">
                  <el-input v-model="form.businessLicenseNo" placeholder="支持自动识别" class="width90" clearable />
                </el-form-item>-->
        <!-- 与管理员共用-->
        <!-- <el-form-item label="法人姓名" prop="artificialName">
                  <el-input v-model="form.artificialName" placeholder="请输入法人姓名" class="width90" clearable />
                </el-form-item>
                <el-form-item label="法人身份证" prop="artificialIdentificationNumber">
                  <el-input v-model="form.artificialIdentificationNumber" placeholder="请输入法人身份证" class="width90" clearable />
                </el-form-item>-->
      </template>
      <el-form-item label="票制类别" prop="ticketType">
        <el-select
          v-model="form.ticketType"
          filterable
          clearable
          class="width90"
          @change="changeTicketType"
        >
          <el-option
            v-for="dict in ticketTypeOptions"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictValue"
          />
        </el-select>
      </el-form-item>
      <el-row :gutter="20">
        <el-col :span="11">
          <el-form-item label="税点(%)" prop="texPoint">
            <el-input-number v-model="form.texPoint" controls-position="right" :precision="2" placeholder="请输入税点" :step="1" :min="0" :max="99.99" clearable @input="changeTextPoint" />
          </el-form-item>
        </el-col>
        <el-col :span="11">
          <el-form-item prop="dispatchPoints">
            <label slot="label">
              <el-tooltip
                class="item"
                effect="light"
                placement="right"
              >
                <i class="el-icon-question" />
                <ul slot="content">
                  <li class="g-text">调度费点数 = 税点</li>
                  <!--  <li class="g-text">一票制：调度费点数 = 税点</li>-->
                  <!-- <li class="g-text">二票制：调度费点数 = 税点</li>-->
                  <!--  <li class="g-text">非一票制：调度费点数 = [税点/(100-税点)]*100</li>-->
                </ul>
              </el-tooltip>
              调度费点数(%)
            </label>
            <el-input v-model="form.dispatchPoints" disabled placeholder="请输入调度费点数" clearable />
          </el-form-item>
        </el-col>
      </el-row>
      <template v-if="form.ticketType == '2'">
        <el-form-item label="服务费税率(%)" prop="serviceRate" :rules="[{ required: true, message: '服务费税率不能为空', trigger: 'blur' }]">
          <el-input-number v-model="form.serviceRate" controls-position="right" :precision="2" placeholder="请输入服务费税率" :step="1" :min="0" :max="100" class="width90" clearable />
        </el-form-item>
        <!-- <el-form-item label="服务费比例(%)" prop="serviceRatio"  :rules="[{ required: true, message: '服务费比例不能为空', trigger: 'blur' }]" >
                  <el-input-number v-model="form.serviceRatio" controls-position="right" :precision="2" placeholder="请输入服务费比例" :step="1" :min="0" :max="100" class="width90" clearable />
                </el-form-item>-->
      </template>
      <el-form-item label="票务规则" prop="payInvoiceType">
        <el-select
          v-model="form.payInvoiceType"
          clearable
          filterable
          class="width90"
        >
          <el-option
            v-for="dict in payInvoiceTypeOptions"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictValue"
          />
        </el-select>
      </el-form-item>
      <!-- <el-form-item label="是否冻结" prop="isFreezone">
              <el-select
                v-model="form.isFreezone"
                clearable
                filterable
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
            <el-form-item label="货源是否审核" prop="supplyIsAuth">
              <el-select
                v-model="form.supplyIsAuth"
                clearable
                filterable
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
      <el-form-item label="是否独立核算" prop="isAccount">
        <el-select
          v-model="form.isAccount"
          clearable
          filterable
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
      <!-- <el-form-item label="核算方式" prop="accountType">
              <el-select v-model="form.accountType" placeholder="请选择核算方式" filterable clearable class="width90">
                <el-option
                  v-for="dict in accountTypeOptions"
                  :key="dict.dictValue"
                  :label="dict.dictLabel"
                  :value="dict.dictValue"
                />
              </el-select>
            </el-form-item>-->
      <!-- <el-form-item label="是否抹零" prop="isWipe">
              <el-select
                v-model="form.isWipe"
                clearable
                filterable
                class="width28 mr3"
              >
                <el-option
                  v-for="dict in isOptions"
                  :key="dict.dictValue"
                  :label="dict.dictLabel"
                  :value="dict.dictValue"
                />
              </el-select>
              <el-select v-model="form.wipeType" placeholder="请选择抹零方式" filterable clearable class="width28">
                <el-option
                  v-for="dict in wipeTypeOptions"
                  :key="dict.dictValue"
                  :label="dict.dictLabel"
                  :value="dict.dictValue"
                />
              </el-select>
            </el-form-item>-->
      <!-- <el-form-item label="是否开启合理路耗">
              <el-select
                v-model="form.isConsumption"
                clearable
                filterable
                class="width28 mr3"
              >
                <el-option
                  v-for="dict in isOptions"
                  :key="dict.dictValue"
                  :label="dict.dictLabel"
                  :value="dict.dictValue"
                />
              </el-select>
              <el-select
                v-model="form.consumptionUnit"
                filterable
                clearable
                class="width28 mr3"
                placeholder="路耗单位"
              >
                <el-option
                  v-for="dict in consumptionUnitOptions"
                  :key="dict.dictValue"
                  :label="dict.dictLabel"
                  :value="dict.dictValue"
                />
              </el-select>
              <el-input-number v-model="form.consumptionMin" :controls="false" placeholder="最小值" class="width12" />
              至
              <el-input-number v-model="form.consumptionMax" :controls="false" placeholder="最大值" class="width12" />
            </el-form-item>-->
      <el-row :gutter="20">
        <el-col :span="23">
          <el-form-item label="授信保护期" prop="creditEndTime">
            <el-date-picker
              v-model="form.creditStartTime"
              clearable
              class="width45"
              type="datetime"
              placeholder="授信开始日期"
            />
            <span style="margin: 0 1.5%;">至</span>
            <el-date-picker
              v-model="form.creditEndTime"
              clearable
              class="width45 mr3"
              type="datetime"
              placeholder="授信结束日期"
              default-time="23:59:59"
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <!--<el-col v-if="form.isMonthly" :span="11">-->
        <el-col :span="11">
          <el-form-item label="授信金额" prop="creditAmount">
            <el-input-number v-model="form.creditAmount" :precision="2" :min="0" :max="1000000000" :controls="false" placeholder="保留两位小数" />
          </el-form-item>
        </el-col>
        <el-col :span="11">
          <el-form-item label="是否月结" prop="isMonthly">
            <el-select
              v-model="form.isMonthly"
              clearable
              filterable
            >
              <el-option
                v-for="dict in isOptions"
                :key="dict.dictValue"
                :label="dict.dictLabel"
                :value="dict.dictValue"
              />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="11">
          <el-form-item label="是否预付运费" prop="isPrepaid">
            <el-select
              v-model="form.isPrepaid"
              clearable
              filterable
              style="width: 200px"
            >
              <el-option
                v-for="dict in isOptions"
                :key="dict.dictValue"
                :label="dict.dictLabel"
                :value="dict.dictValue"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col v-if="form.isPrepaid === 1" :span="11">
          <el-form-item label="预付运费类型" prop="repaidType">
            <el-select
              v-model="form.repaidType"
              clearable
              filterable
            >
              <el-option
                v-for="dict in repaidTypeOptions"
                :key="dict.dictValue"
                :label="dict.dictLabel"
                :value="dict.dictValue"
              />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="11">
          <el-form-item label="负责的运营团队" prop="operateOrgCode">
            <el-select
              v-model="form.operateOrgCode"
              clearable
              filterable
              style="width: 200px"
              @change="selectOrgCode"
            >
              <el-option
                v-for="dict in marketList"
                :key="dict.orgCode"
                :label="dict.market"
                :value="dict.orgCode"
              />
            </el-select>
            <!-- <treeselect
                          v-model="form.operateOrgCode"
                          :options="operateOrgList"
                          :normalizer="normalizer"
                          :show-count="true"
                          placeholder="请选择运营团队"
                          @select="selectOrgCode"
                        /> -->
          </el-form-item>
        </el-col>
        <el-col v-if="form.operateOrgCode" :span="11">
          <el-form-item label="负责的业务员" prop="operateUserCode">
            <el-select
              v-model="form.operateUserCode"
              clearable
              filterable
            >
              <el-option
                v-for="dict in operateUserList"
                :key="dict.userCode"
                :label="dict.userName + ' ('+dict.phonenumber+')'"
                :value="dict.userCode"
              />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <h5 class="g-card-title g-strong mb20 ml10">
        通用配置
        <div class="h5-divider" style="width: 91%" />
      </h5>
      <el-row :gutter="20">
        <el-col :span="11">
          <el-form-item label="允许未审核司机/车辆接单" prop="allowNoAuditDriverToReceive">
            <el-radio-group v-model="form.allowNoAuditDriverToReceive">
              <el-radio
                v-for="dict in allowOptions"
                :key="dict.dictValue"
                :label="parseInt(dict.dictValue)"
              >{{ dict.dictLabel }}</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :span="11">
          <el-form-item label="修改司机实收金额" prop="editDriverActualAmount">
            <el-radio-group v-model="form.editDriverActualAmount">
              <el-radio
                v-for="dict in allowOptions"
                :key="dict.dictValue"
                :label="parseInt(dict.dictValue)"
              >{{ dict.dictLabel }}</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="11">
          <el-form-item prop="noNeedUnloadImg">
            <el-checkbox v-model="form.noNeedUnloadImg">是否不需要卸货图片</el-checkbox>
          </el-form-item>
        </el-col>
        <el-col :span="11">
          <el-form-item prop="openProjectDesignView">
            <el-checkbox v-model="form.openProjectDesignView">开启&nbsp;项目版统计视图</el-checkbox>
          </el-form-item>
        </el-col>
        <el-col :span="11">
          <el-form-item prop="isNeedLoadingCertificate">
            <el-checkbox v-model="form.isNeedLoadingCertificate">是否需要装货凭证</el-checkbox>
          </el-form-item>
        </el-col>
      </el-row>
      <h5 class="g-card-title g-strong mb20 ml10">
        普通货物配置
        <div class="h5-divider" style="width: 87%" />
      </h5>
      <el-row :gutter="20">
        <el-col :span="11">
          <el-form-item label="单货源多商品" prop="singleSourceMultiCommodity">
            <el-radio-group v-model="form.singleSourceMultiCommodity">
              <el-radio
                v-for="dict in allowOptions"
                :key="dict.dictValue"
                :label="parseInt(dict.dictValue)"
              >{{ dict.dictLabel }}</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :span="11">
          <el-form-item label="单货源多装货地" prop="singleSourceMultiLoadingLocations">
            <el-radio-group v-model="form.singleSourceMultiLoadingLocations">
              <el-radio
                v-for="dict in allowOptions"
                :key="dict.dictValue"
                :label="parseInt(dict.dictValue)"
              >{{ dict.dictLabel }}</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :span="11">
          <el-form-item label="单货源多卸货地" prop="singleSourceMultiUnloadingLocations">
            <el-radio-group v-model="form.singleSourceMultiUnloadingLocations">
              <el-radio
                v-for="dict in allowOptions"
                :key="dict.dictValue"
                :label="parseInt(dict.dictValue)"
              >{{ dict.dictLabel }}</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :span="11">
          <el-form-item label="是否需要申请打款环节" prop="isNeedApplicationForPayment">
            <el-radio-group v-model="form.isNeedApplicationForPayment">
              <el-radio
                v-for="dict in needOptions"
                :key="dict.dictValue"
                :label="parseInt(dict.dictValue)"
              >{{ dict.dictLabel }}</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <div v-if="title === '新增' || title === '编辑'" slot="footer" class="dialog-footer">
      <el-button type="primary" :loading="buttonLoading" @click="submitForm">确 定</el-button>
      <el-button @click="cancel">取 消</el-button>
    </div>
    <div v-if="title === '审核'" slot="footer" class="dialog-footer">
      <el-button type="primary" :loading="authButtonLoading" @click="reviewForm(3)">审核通过</el-button>
      <el-button type="danger" :loading="authButtonLoading" @click="reviewForm(2)">审核不通过</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { addShipment, updateShipment, authRead, examine, getShipmentEnterprise, getMarket, getOperateOrg, getOperateUser } from '@/api/assets/shipment';
import { getUserAlreadyExist } from '@/api/system/user';
// import { getWaybillStatus } from '@/api/assets/shipment';
import { listDeptAll } from '@/api/system/dept';
import { getBranchList } from '@/api/system/branch';
import UploadImage from '@/components/UploadImage/index';
// import ProvinceCityCounty from '@/components/ProvinceCityCounty';
import { praseBooleanToNum, praseNumToBoolean } from '@/utils/ddc';
// import Treeselect from '@riophae/vue-treeselect';

export default {
  components: {
    UploadImage
    // ProvinceCityCounty
    // Treeselect
  },
  props: {
    title: {
      type: String,
      default: ''
    },
    open: Boolean,
    disable: Boolean
  },
  data() {
    return {
      buttonLoading: false,
      authButtonLoading: false,
      // 初始密码
      initialPassword: 'abcd1234@',
      // 货主类型数据字典
      typeOptions: [
        { dictLabel: '发货人', dictValue: 0 },
        { dictLabel: '发货企业', dictValue: 1 }
      ],
      // 是否冻结字典
      isFreezoneOptions: [
        { dictLabel: '正常', dictValue: 0 },
        { dictLabel: '冻结', dictValue: 1 }
      ],
      // 票制类别字典
      ticketTypeOptions: [],
      // 是否字典
      isOptions: [
        { dictLabel: '否', dictValue: 0 },
        { dictLabel: '是', dictValue: 1 }
      ],
      // 预付运费
      repaidTypeOptions: [
        { dictLabel: '接单前', dictValue: 0 },
        { dictLabel: '卸货前', dictValue: 1 }
      ],
      // 是否允许
      allowOptions: [
        { dictLabel: '允许', dictValue: 0 },
        { dictLabel: '不允许', dictValue: 1 }
      ],
      needOptions: [
        { dictLabel: '需要', dictValue: 0 },
        { dictLabel: '不需要', dictValue: 1 }
      ],
      payInvoiceTypeOptions: [
        { dictLabel: '打款成功后', dictValue: '7' },
        { dictLabel: '申请打款后', dictValue: '6' }
      ],
      // 核算方式字典
      accountTypeOptions: [],
      // 抹零方式字典
      wipeTypeOptions: [],
      // 路耗单位字典
      consumptionUnitOptions: [],
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        telphone: [
          { required: true, message: '手机号/账号不能为空', trigger: 'blur' },
          { validator: this.formValidate.telphone, trigger: 'blur' }
        ],
        adminName: [
          { required: true, message: '姓名不能为空', trigger: ['blur', 'change'] },
          { validator: this.formValidate.name, trigger: ['blur', 'change'] }
        ],
        identificationNumber: [
          { required: true, message: '身份证号不能为空', trigger: ['blur', 'change'] },
          { validator: this.formValidate.idCard, trigger: ['blur', 'change'] }
        ],
        identificationEndTime: [
          { validator: (rules, value, callback) => this.formValidate.idCardValidate(rules, value, callback, this.form.identificationBeginTime, this.form.identificationEffective), trigger: ['change', 'blur'] },
          { validator: (rules, value, callback) => this.formValidate.isExpired(rules, value, callback, this.form.identificationEffective), trigger: ['change', 'blur'] }
        ],
        artificialIdentificationNumber: [
          { validator: this.formValidate.idCard, trigger: ['blur', 'change'] }
        ],
        creditAmount: [
          { validator: this.formValidate.number, trigger: 'blur' }
        ],
        ticketType: [
          { required: true, message: '票制类别不能为空', trigger: 'blur' }
        ],
        texPoint: [
          { required: true, message: '税点不能为空', trigger: ['change', 'blur'] }
        ],
        password: [
          { validator: this.formValidate.passWord, trigger: 'blur' }
        ],
        payInvoiceType: [
          { required: true, message: '票务规则不能为空', trigger: ['change', 'blur'] }
        ],
        creditEndTime: [
          { validator: (rules, value, callback) => this.formValidate.idCardTimeValidate(rules, value, callback, this.form.creditStartTime, '授信保护期'), trigger: ['change', 'blur'] }
        ]
      },
      // 网点查询
      loading: false,
      branchOptions: [],
      companyList: [],
      marketList: [],
      marketMap: {},
      operateUserList: [],
      // 部门树选项
      operateOrgList: undefined,
      // 部门树键值转换
      normalizer(node) {
        return {
          id: node.code, // 键名转换，方法默认是label和children进行树状渲染
          label: node.label,
          children: node.children
        };
      }
    };
  },
  computed: {
    visible: {
      get() {
        return this.open;
      },
      set(v) {
        this.$emit('update:open', v);
      }
    }
  },
  created() {
    this.getDictsOptions();
    this.getMarketList();
    // this.getOperateOrgList();
    // 不用了
    // this.getCompanyList();
  },
  methods: {
    // 获取运营团队
    getMarketList() {
      getMarket().then((response) => {
        this.marketList = response.data;
        response.data.forEach(e => {
          this.marketList[e.orgCode] = e.id;
        });
      });
    },
    getOperateOrgList() {
      getOperateOrg().then((response) => {
        this.operateOrgList = response.data;
      });
    },
    // 手动刷新校验
    selectOrgCode(data) {
      if (data) {
        this.form.marketId = this.marketList[data];
        this.getOperateUserList(data);
      } else {
        this.form.operateUserCode = '';
      }
      /* this.$nextTick(() => {
        this.$refs.form.validateField('operateOrgCode');
        if (this.form.operateOrgCode) {
          this.getOperateUserList(this.form.operateOrgCode);
        }
      }); */
    },
    // 获取业务员
    getOperateUserList(orgCode) {
      getOperateUser({ orgCode: orgCode }).then((response) => {
        this.operateUserList = response.data;
      });
    },
    changeTextPoint(value) {
      if (this.form.ticketType === '1') { // 一票制：调度费点数=原来的『税点(%) 』备注：运单结算使用的比例
        this.$set(this.form, 'dispatchPoints', value);
        this.$set(this.form, 'serviceRate', '');// 服务费税率
      } else if (this.form.ticketType === '2') { // 二票制：服务费税率(%)、调度费点数=原来的『服务费比例』备注：运单结算使用的比例
        this.$set(this.form, 'dispatchPoints', value);
      } else if (this.form.ticketType === '3') { // 非一票制：调度费点数=原来的『税点(%) 』备注：运单结算使用的比例是「合同税点/（1-合同税点）」
        this.$set(this.form, 'serviceRate', '');// 服务费税率
        if (value === '' || value === undefined || value === null) {
          this.$set(this.form, 'dispatchPoints', undefined);
        } else {
          this.$set(this.form, 'dispatchPoints', ((value / (100 - value)) * 100).toFixed(2));
        }
      }
    },
    changeTicketType(value) {
      if (value === '1') { // 一票制：调度费点数=原来的『税点(%) 』备注：运单结算使用的比例
        this.$set(this.form, 'dispatchPoints', this.form.texPoint);
        this.$set(this.form, 'serviceRate', '');// 服务费税率
      } else if (value === '2') { // 二票制：服务费税率(%)、调度费点数=原来的『服务费比例』备注：运单结算使用的比例
        this.$set(this.form, 'dispatchPoints', this.form.texPoint);
      } else if (value === '3') { // 非一票制：调度费点数=原来的『税点(%) 』备注：运单结算使用的比例是「合同税点/（1-合同税点）」
        this.$set(this.form, 'serviceRate', '');// 服务费税率
        if (this.form.texPoint === '' || this.form.texPoint === undefined || this.form.texPoint === null) {
          this.$set(this.form, 'dispatchPoints', undefined);
        } else {
          this.$set(this.form, 'dispatchPoints', ((this.form.texPoint / (100 - this.form.texPoint)) * 100).toFixed(2));
        }
      }
    },
    changeCompany(item) {
      if (item.orgCode) {
        this.form.companyCode = item.orgCode;
        this.getCompany(item.orgCode);
      } else {
        this.form.companyName = item;
      }
      if (item.orgName) {
        this.form.companyName = item.orgName;
      }
    },
    getCompanyList() {
      listDeptAll().then((response) => {
        this.companyList = response.data;
      });
    },
    getCompany(companyCode) {
      getShipmentEnterprise(companyCode).then((response) => {
        this.form = Object.assign(this.form, response.data);
      });
    },
    /** 查询字典 */
    getDictsOptions() {
      // 核算规则
      /* this.getDicts('balance_rule').then((response) => {
        this.accountTypeOptions = response.data;
      }); */
      // 票制类别
      this.getDicts('assets_ticket_type').then((response) => {
        this.ticketTypeOptions = response.data;
      });
      // 票制规则
      /* getWaybillStatus().then((response) => {
        response.data.forEach(e => {
          this.payInvoiceTypeOptions.push({ dictValue: e.value.toString(), dictLabel: e.name });
        });
      });*/
      // 合理路耗计量单位
      /* this.getDicts('consumption_unit').then((response) => {
        this.consumptionUnitOptions = response.data;
      }); */
      // 抹零方式
      /* this.getDicts('wipe_type').then((response) => {
        this.wipeTypeOptions = response.data;
      }); */
    },
    /** 提交按钮 */
    submitForm() {
      // const flag = this.$refs.ChooseArea.submit();
      const flag = true;
      this.$refs['form'].validate(valid => {
        if (valid && flag) {
          this.buttonLoading = true;
          // 类型为发货人的时候，企业相关字段不能传
          if (this.form.shipperType === 0) {
            this.form.companyName = null;
            this.form.artificialName = null;
            this.form.artificialIdentificationNumber = null;
            this.form.organizationCodeNo = null;
            this.form.businessLicenseNo = null;
            this.form.artificialIdentificationImg = null;
            this.form.artificialIdentificationBackImg = null;
            this.form.artificialIdentificationInhandImg = null;
            this.form.businessLicenseImg = null;
          }
          /*  if (!this.form.isMonthly) {
            this.form.creditAmount = null;
          }*/
          this.form.identificationEffective = praseBooleanToNum(this.form.identificationEffective);
          if (this.form.ticketType === '1') { // 一票制：调度费点数=原来的『税点(%) 』备注：运单结算使用的比例
            this.$set(this.form, 'dispatchPoints', this.form.texPoint);
            this.$set(this.form, 'serviceRate', '');// 服务费税率
          } else if (this.form.ticketType === '2') { // 二票制：服务费税率(%)、调度费点数=原来的『服务费比例』备注：运单结算使用的比例
            this.$set(this.form, 'dispatchPoints', this.form.texPoint);
          } else if (this.form.ticketType === '3') { // 非一票制：调度费点数=原来的『税点(%) 』备注：运单结算使用的比例是「合同税点/（1-合同税点）」
            this.$set(this.form, 'serviceRate', '');// 服务费税率
            this.$set(this.form, 'dispatchPoints', ((this.form.texPoint / (100 - this.form.texPoint)) * 100).toFixed(2));
          }
          var noNeedUnloadImg = 0;
          if (this.form.noNeedUnloadImg === true) {
            noNeedUnloadImg = 1;
          }
          var openProjectDesignView = 1;
          if (this.form.openProjectDesignView === true) {
            openProjectDesignView = 0;
          }
          var isNeedLoadingCertificate = 1;
          if (this.form.isNeedLoadingCertificate === true) {
            isNeedLoadingCertificate = 0;
          }
          // 复制管理员图片至法人
          this.form.artificialIdentificationImg = this.form.identificationImg;
          this.form.artificialIdentificationBackImg = this.form.identificationBackImg;
          var extendForm = { noNeedUnloadImg: noNeedUnloadImg, openProjectDesignView: openProjectDesignView, isNeedLoadingCertificate: isNeedLoadingCertificate };
          // eslint-disable-next-line no-undef
          this.form = Object.assign(this.form, extendForm);
          if (this.form.id) {
            updateShipment(this.form).then(response => {
              this.buttonLoading = false;
              this.msgSuccess('修改成功');
              this.close();
              this.$emit('refresh');
            }).catch(() => {
              this.buttonLoading = false;
            });
          } else {
            if (!this.form.password && this.form.password !== undefined) {
              this.form.password = this.initialPassword;
            }
            addShipment(this.form).then(response => {
              this.buttonLoading = false;
              this.msgSuccess('新增成功');
              this.close();
              this.$emit('refresh');
            }).catch(() => {
              this.buttonLoading = false;
            });
          }
        } else {
          this.msgWarning('填写的信息不完整或有误，请核对后重新提交');
        }
      });
    },
    /** 取消按钮 */
    cancel() {
      this.close();
      this.reset();
    },
    /** 审核通过/未通过按钮 */
    reviewForm(key) {
      // const flag = this.$refs.ChooseArea.submit();
      const flag = true;
      this.$refs['form'].validate(valid => {
        if (key === 2 || (valid && flag)) {
          this.authButtonLoading = true;
          this.form.authStatus = key;
          this.form.identificationEffective = praseNumToBoolean(this.form.identificationEffective);
          examine(this.form).then(response => {
            this.msgSuccess('操作成功');
            this.close();
            this.$emit('refresh');
            this.authButtonLoading = false;
          }).catch(() => {
            this.authButtonLoading = false;
          });
        } else {
          this.msgWarning('填写的信息不完整或有误，不能通过审核');
        }
      });
    },
    // 关闭弹窗
    close() {
      this.$emit('update:open', false);
    },
    // 表单重置
    reset() {
      this.buttonLoading = false;
      this.form = {
        adminName: null,
        adminCode: null,
        telphone: null,
        password: null,
        companyCode: null,
        companyName: null,
        shipperType: 1,
        identificationNumber: null,
        identificationBeginTime: null,
        identificationEndTime: null,
        identificationEffective: null,
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
        delFlag: null,
        authTime: null,
        provinceCode: null,
        cityCode: null,
        countyCode: null,
        isAccount: 1, // 是否独立核算，默认是
        accountType: null,
        isWipe: null,
        area: null,
        wipeType: null,
        isMonthly: 0,
        isPrepaid: 1, // 是否预付运费，默认是
        repaidType: 0, // 预付运费类型
        payInvoiceType: '7',
        isConsumption: null,
        consumptionUnit: null,
        consumptionMin: null,
        consumptionMax: null,
        dispatchPoints: null,
        creditAmount: null,
        ticketType: null,
        serviceRatio: null,
        serviceRate: null,
        supplyIsAuth: 0, // 是否审核货源，默认否
        noNeedUnloadImg: 0,
        openProjectDesignView: 1,
        singleSourceMultiCommodity: 1,
        singleSourceMultiLoadingLocations: 1,
        singleSourceMultiUnloadingLocations: 1,
        isNeedLoadingCertificate: 0,
        editDriverActualAmount: 1,
        allowNoAuditDriverToReceive: 1,
        isNeedApplicationForPayment: 0,
        creditStartTime: null,
        creditEndTime: null
        // branchCode: null
      };
      this.resetForm('form');
    },
    // 表单赋值
    setForm(data) {
      this.form = data;
      this.form.identificationEffective = praseNumToBoolean(this.form.identificationEffective);
      if (this.form.noNeedUnloadImg === 0) {
        this.form.noNeedUnloadImg = false;
      } else {
        this.form.noNeedUnloadImg = true;
      }
      if (this.form.openProjectDesignView === 0) {
        this.form.openProjectDesignView = true;
      } else {
        this.form.openProjectDesignView = false;
      }
      if (this.form.isNeedLoadingCertificate === 0) {
        this.form.isNeedLoadingCertificate = true;
      } else {
        this.form.isNeedLoadingCertificate = false;
      }
      if (this.form.branchCode && this.form.branchName) {
        this.branchOptions = [{
          code: this.form.branchCode,
          name: this.form.branchName
        }];
      }
      if (this.form.operateOrgCode) {
        this.form.marketId = this.marketList[this.form.operateOrgCode];
        this.getOperateUserList(this.form.operateOrgCode);
      }
    },
    // 已读
    authRead(data) {
      data.identificationEffective = praseBooleanToNum(data.identificationEffective);
      authRead(data).then(response => {
        this.$emit('refresh');
      });
    },
    // 查询网点列表
    getBranchOptions(query) {
      if (query !== '') {
        this.loading = true;
        getBranchList({
          name: query
        }).then(response => {
          this.loading = false;
          this.branchOptions = response.data;
        });
      } else {
        this.branchOptions = [];
      }
    },
    // 图片识别后回填
    fillForm(type, data, side) {
      switch (type) {
        case 'id-card':
          if (side === 'front') {
            if (data.name) {
              this.$set(this.form, 'adminName', data.name);
              this.$set(this.form, 'artificialName', data.name);
            } else {
              this.$set(this.form, 'adminName', '');
              this.$set(this.form, 'artificialName', '');
            }
            if (data.number) {
              this.$set(this.form, 'identificationNumber', data.number);
              this.$set(this.form, 'artificialIdentificationNumber', data.number);
            } else {
              this.$set(this.form, 'identificationNumber', '');
              this.$set(this.form, 'artificialIdentificationNumber', '');
            }
            if (data.address) {
              this.$set(this.form, 'area', data.address);
            } else {
              this.$set(this.form, 'area', '');
            }
          }
          if (side === 'back') {
            if (data.valid_from) {
              this.$set(this.form, 'identificationBeginTime', data.valid_from);
            } else {
              this.$set(this.form, 'identificationBeginTime', '');
            }
            if (data.valid_to) {
              if (data.valid_to === '长期') {
                this.$set(this.form, 'identificationEffective', true);
              } else if (data.valid_to !== '') {
                if (data.valid_to.startsWith('9999')) {
                  this.$set(this.form, 'identificationEffective', true);
                } else {
                  this.$set(this.form, 'identificationEndTime', data.valid_to);
                }
              }
            } else {
              this.$set(this.form, 'identificationEffective', false);
              this.$set(this.form, 'identificationEndTime', '');
            }
          }
          break;
        // 营业执照
        case 'business-license':
          // 公司名称
          if (data.name) {
            this.$set(this.form, 'companyName', data.name);
          } else {
            this.$set(this.form, 'companyName', '');
          }
          // 统一信用代码
          if (data.registration_number) {
            this.$set(this.form, 'organizationCodeNo', data.registration_number);
          } else {
            this.$set(this.form, 'organizationCodeNo', '');
          }
          // 法人姓名
          /* if (data.legal_representative) {
            this.$set(this.form, 'artificialName', data.legal_representative);
          } else {
            this.$set(this.form, 'artificialName', '');
          }*/
          break;
        default:
          break;
      }
    },
    getUserAlreadyExist() {
      if (this.form.telphone) {
        getUserAlreadyExist({ phoneNum: this.form.telphone }).then(response => {
          if (response.code === 500) {
            this.msgWarning(response.msg);
            this.$nextTick(() => {
              this.$refs.telphone.focus();
            });
          }
        }).catch(() => {
          this.$nextTick(() => {
            this.$refs.telphone.focus();
          });
        });
      }
    }
  }
};
</script>

<style scoped lang="scss">
    .mr3{
        margin-right: 3%;
    }
    .mt{
        margin-top: 22px;
    }
    .width90{
        width: 90%;
    }
    .width70{
        width: 70%;
    }
    .width60{
        width: 60%;
    }
    .width50{
        width: 50%;
    }
    .width45{
        width: 45%;
    }
    .width28{
        width: 28%;
    }
    .width12{
        width: 12%;
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
    /* 标题样式 */
    .g-card-title{
        display: flex;
        justify-content: space-between;
        align-items: center;
        >.h5-divider{
            margin-left: 8px;
            height: 1px;
            border-bottom: 1px dashed #DAD3D3;
        }
    }
</style>
