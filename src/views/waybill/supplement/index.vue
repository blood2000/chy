<template>
  <el-tabs type="border-card">
    <el-tab-pane label="运单补录" style="padding:0 30px;">
      <div class="container">
        <el-form ref="form" :model="form" :rules="rules" label-width="140px">
          <el-divider content-position="left"><span class="supplement-title">货源信息</span></el-divider>
          <el-row>
            <el-col :span="8">
              <el-form-item label="货源单号" prop="mainOrderCode">
                <el-input v-model="form.mainOrderCode" placeholder="请输入货源单号" class="width90" clearable @change="getOrderDetail" />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="货物名称" prop="goodsCode">
                <el-select
                  v-model="form.goodsCode"
                  placeholder="请选择货物"
                  no-data-text="请先输入货源单号"
                  clearable
                  filterable
                  size="small"
                  class="width90"
                  :disabled="orderDisable"
                  @change="goodsChoose"
                >
                  <el-option
                    v-for="dict in goodsCodeOptions"
                    :key="dict.code"
                    :label="dict.goodsTypeName || dict.goodsBigTypeName || dict.goodsBigType"
                    :value="dict.code"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="运费单价" prop="shipmentPrice">
                <el-input v-model="form.shipmentPrice" :readonly="true" class="width90" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <el-form-item label="装货地址" prop="loadAddressCode">
                <el-select
                  v-model="form.loadAddressCode"
                  placeholder="请选择车辆装货地址"
                  no-data-text="请先输入货源单号"
                  clearable
                  filterable
                  size="small"
                  class="width90"
                  :disabled="orderDisable"
                  @change="loadChoose"
                >
                  <el-option
                    v-for="dict in loadAddressOptions"
                    :key="dict.code"
                    :label="dict.formattedAddress"
                    :value="dict.code"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="卸货地址" prop="unloadAddressCode">
                <el-select
                  v-model="form.unloadAddressCode"
                  placeholder="请选择车辆卸货地址"
                  no-data-text="请先输入货源单号"
                  clearable
                  filterable
                  size="small"
                  class="width90"
                  :disabled="orderDisable"
                  @change="lendChoose"
                >
                  <el-option
                    v-for="dict in unloadAddressOptions"
                    :key="dict.code"
                    :label="dict.formattedAddress"
                    :value="dict.code"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item v-if="!stowage" label="剩余车数" prop="notRobbedOrder">
                <el-input v-model="form.notRobbedOrder" :readonly="true" class="width90" />
              </el-form-item>
              <el-form-item v-if="stowage" label="剩余吨数/立方数" prop="remainingWeight">
                <el-input v-model="form.remainingWeight" :readonly="true" class="width90" />
              </el-form-item>
            </el-col>
          </el-row>

          <el-divider content-position="left"><span class="supplement-title">承运车辆</span></el-divider>
          <el-row>
            <el-col :span="8">
              <el-form-item label="承运司机" prop="driverCode">
                <el-select
                  v-model="form.driverCode"
                  v-el-select-loadmore="loadmore"
                  filterable
                  clearable
                  remote
                  reserve-keyword
                  placeholder="请输入关键词"
                  :remote-method="remoteMethod"
                  :loading="loading"
                  size="small"
                  class="width90"
                  @change="driverChoose"
                >
                  <el-option
                    v-for="dict in driverOptions"
                    :key="dict.code"
                    :label="dict.name"
                    :value="dict.code"
                  >
                    <div class="ly-flex-pack-justify">
                      <span style="margin-right:10px">{{ dict.name }}</span>
                      <span>{{ dict.telphone }}</span>
                    </div>
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="承运车辆" prop="vehicleCode">
                <el-select
                  v-model="form.vehicleCode"
                  placeholder="请选择承运车辆"
                  no-data-text="请先选择承运司机"
                  clearable
                  filterable
                  size="small"
                  class="width90"
                  :disabled="driverDisable"
                  @change="vehicleChoose"
                >
                  <el-option
                    v-for="dict in vehicleOptions"
                    :key="dict.code"
                    :label="dict.licenseNumber"
                    :value="dict.code"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="运输许可号" prop="roadTransportCertificateNumber">
                <el-input v-model="form.roadTransportCertificateNumber" :readonly="true" class="width90" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <el-form-item label="所属调度" prop="teamCode">
                <el-select
                  v-model="form.teamCode"
                  placeholder="请选择所属调度"
                  no-data-text="司机未加入车队"
                  clearable
                  filterable
                  size="small"
                  class="width90"
                  :disabled="driverDisable"
                >
                  <el-option
                    v-for="dict in teamOptions"
                    :key="dict.code"
                    :label="dict.name"
                    :value="dict.code"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="车辆识别码" prop="chassisNumber">
                <el-input v-model="form.chassisNumber" :readonly="true" class="width90" />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="车辆载重" prop="vehicleLoadWeight">
                <el-input v-model="form.vehicleLoadWeight" :readonly="true" class="width90" />
              </el-form-item>
            </el-col>
          </el-row>

          <el-divider content-position="left"><span class="supplement-title">运单信息</span></el-divider>
          <el-row>
            <el-col :span="8">
              <el-form-item label="装货时间" prop="loadTime">
                <el-date-picker
                  v-model="form.loadTime"
                  clearable
                  size="small"
                  class="width90"
                  type="datetime"
                  value-format="yyyy-MM-dd HH:mm:ss"
                  placeholder="选择装货时间"
                  @change="loadTimeChoose"
                />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="卸货时间" prop="unloadTime">
                <el-date-picker
                  v-model="form.unloadTime"
                  clearable
                  size="small"
                  class="width90"
                  type="datetime"
                  value-format="yyyy-MM-dd HH:mm:ss"
                  placeholder="选择卸货时间"
                  @change="unloadTimeChoose"
                />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item v-if="!stowage" label="运单车数" prop="loadWeight">
                <el-input-number v-model="form.loadWeight" placeholder="请输入运单重量" controls-position="right" :precision="2" :min="0" class="width90" @change="inputWeight" />
              </el-form-item>
              <el-form-item v-if="stowage" label="运单重量(吨/立方)" prop="loadWeight">
                <el-input-number v-model="form.loadWeight" placeholder="请输入运单重量" controls-position="right" :precision="2" :min="0" class="width90" @change="inputWeight" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <el-form-item label="货主实付金额" prop="shipperRealPay">
                <el-input v-model="form.shipperRealPay" :readonly="true" class="width90" />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="司机实收金额" prop="driverRealFee">
                <el-input v-model="form.driverRealFee" :readonly="true" class="width90" />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="运输单号" prop="wayBillNo">
                <el-input v-model="form.wayBillNo" :readonly="true" class="width90" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <el-form-item ref="loadAttachment" label="装货单据" prop="loadAttachmentCode">
                <uploadImage v-model="form.loadAttachmentCode" @input="chooseImg" />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item ref="unloadAttachment" label="卸货单据/回执单" prop="unloadAttachmentCode">
                <uploadImage v-model="form.unloadAttachmentCode" @input="chooseImg" />
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>

        <el-row>
          <el-col :span="2" :offset="11">
            <el-button v-hasPermi="['transportation:waybillOper:extra']" type="primary" @click="submitForm">确 定</el-button>
          </el-col>
        </el-row>
      </div>
    </el-tab-pane>

    <el-tab-pane label="批量补录">
      <el-row :gutter="10" class="mb8">
        <el-col :span="1.5">
          <el-button
            type="primary"
            icon="el-icon-upload2"
            size="mini"
            @click="handleWaybillImport"
          >运输单批量导入</el-button>
        </el-col>
        <el-col :span="1.5">
          <el-button
            type="primary"
            icon="el-icon-upload2"
            size="mini"
            @click="handlePictureImport"
          >装/卸货图片导入</el-button>
        </el-col>
        <el-col :span="1.5">
          <el-button
            type="primary"
            icon="el-icon-download"
            size="mini"
            @click="handleDownload"
          >下载模板</el-button>
        </el-col>
      </el-row>
    </el-tab-pane>

    <!-- 运输单批量导入 对话框 -->
    <waybillimport-dialog ref="WaybillimportDialog" :title="title" :open.sync="openImport" />
    <!-- 装/卸货图片导入 对话框 -->
    <pictureimport-dialog ref="PictureimportDialog" :title="title" :open.sync="open" />
  </el-tabs>
</template>

<script>
import { extra, getOrder, getGoods, getAddress, driver, vehicle, vehicleInfo, team, getOrderGoodsProce, getWayBillNo, calculate } from '@/api/waybill/supplement';
import UploadImage from '@/components/UploadImage/index';
import WaybillimportDialog from './waybillimportDialog';
import PictureimportDialog from './pictureimportDialog';

export default {
  components: {
    UploadImage,
    WaybillimportDialog,
    PictureimportDialog
  },
  data() {
    return {
      // 装货地址选择
      loadAddressOptions: [],
      // 商品选择
      goodsCodeOptions: [],
      // 卸货地址选择
      unloadAddressOptions: [],
      // 实际承运司机选择
      driverOptions: [],
      driverInfoQuery: {
        'pageNum': 1,
        'pageSize': 10,
        'authStatus': 3,
        'isFreeze': 0,
        'phoneOrName': null
      },
      vehicleInfoQuery: {
        'authStatus': 3,
        'isFreeze': 0,
        'driverCode': null
      },
      loading: false,
      dataOver: false, // 是否请求完了
      // 实际承运车辆选择
      vehicleOptions: [],
      // 所属调度
      teamOptions: [],
      // 弹出层标题
      title: '',
      stowage: true,
      // 是否显示弹出层
      open: false,
      openImport: false,
      // 表单参数
      form: {
      },
      // 表单校验
      rules: {
        mainOrderCode: [
          { required: true, message: '货源单号不能为空', trigger: 'blur' }
        ],
        goodsCode: [
          { required: true, message: '请选择货物大类', trigger: 'change' }
        ],
        loadAddressCode: [
          { required: true, message: '请选择装货地址', trigger: 'change' }
        ],
        unloadAddressCode: [
          { required: true, message: '请选择卸货地址', trigger: 'change' }
        ],
        driverCode: [
          { required: true, message: '请选择承运司机', trigger: 'change' }
        ],
        vehicleCode: [
          { required: true, message: '请选择承运车辆', trigger: 'change' }
        ],
        loadTime: [
          { required: true, message: '请选择装货时间', trigger: 'blur' }
        ],
        unloadTime: [
          { required: true, message: '请选择卸货时间', trigger: 'blur' }
        ],
        loadWeight: [
          { required: true, message: '运单重量必填', trigger: 'blur' }
        ],
        loadAttachmentCode: [
          { required: true, message: '请上传装货单据', trigger: 'change' }
        ],
        unloadAttachmentCode: [
          { required: true, message: '请上传卸货单据', trigger: 'change' }
        ]
      },
      // 输入货源前前禁用
      orderDisable: true,
      // 输入承运司机前前禁用
      driverDisable: true
    };
  },
  computed: {
  },
  created() {
    this.reset();
    // this.getDriver();
  },
  methods: {
    // 装卸货时间选择判断
    loadTimeChoose(e) {
      const loadtime = new Date(e);
      const loadtimeLong = new Date(e.replace(new RegExp('-', 'gm'), '/')).getTime();
      if (loadtime > new Date()) {
        this.$message({ type: 'warning', message: '装货时间必须早于或等于当前时间！' });
        this.form.loadTime = null;
      } else if (this.form.unloadTime) {
        const unloadtime = new Date(this.form.unloadTime);
        const unloadtimeLong = new Date(this.form.unloadTime.replace(new RegExp('-', 'gm'), '/')).getTime();
        const timeDifference = (unloadtimeLong - loadtimeLong) / (60 * 1000);
        if (loadtime >= unloadtime) {
          this.$message({ type: 'warning', message: '装货时间必须小于卸货时间！' });
          this.form.loadTime = null;
        } else if (timeDifference < 5) {
          this.$message({ type: 'warning', message: '装卸货间隔时间过短，请重新选择装货时间！' });
          this.form.loadTime = null;
        }
      }
    },
    unloadTimeChoose(e) {
      const unloadtime = new Date(e);
      const unloadtimeLong = new Date(e.replace(new RegExp('-', 'gm'), '/')).getTime();
      if (unloadtime > new Date()) {
        this.$message({ type: 'warning', message: '卸货时间必须早于或等于当前时间！' });
        this.form.unloadTime = null;
      } else if (this.form.loadTime) {
        const loadtime = new Date(this.form.loadTime);
        const loadtimeLong = new Date(this.form.loadTime.replace(new RegExp('-', 'gm'), '/')).getTime();
        const timeDifference = (unloadtimeLong - loadtimeLong) / (60 * 1000);
        if (loadtime >= unloadtime) {
          this.$message({ type: 'warning', message: '卸货时间必须大于装货时间！' });
          this.form.unloadTime = null;
        } else if (timeDifference < 5) {
          this.$message({ type: 'warning', message: '装卸货间隔时间过短，请重新选择卸货时间！' });
          this.form.unloadTime = null;
        }
      }
    },
    // 触发司机远程搜索
    remoteMethod(query) {
      if (query !== '') {
        this.loading = true;
        this.driverInfoQuery.pageNum = 1;
        this.dataOver = false;
        this.driverInfoQuery.phoneOrName = query;
        this.driverOptions = [];
        this.getDriver();
      } else {
        this.driverOptions = [];
      }
    },
    // 司机远程搜索列表触底事件
    loadmore() {
      if (this.dataOver) return;
      this.driverInfoQuery.pageNum++;
      this.getDriver();
    },
    // 获取司机列表
    getDriver() {
      driver(this.driverInfoQuery).then(response => {
        this.dataOver = !response.rows.length;
        this.driverOptions = this.driverOptions.concat(response.rows);
        console.log(this.driverOptions);
        this.loading = false;
      }).catch(() => {
        this.loading = false;
      });
    },
    /** 提交按钮 */
    submitForm() {
      const loading = this.$loading({
        lock: true,
        text: '提交中',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      });
      this.$refs['form'].validate(valid => {
        if (valid) {
          if (this.form.loadWeight > 0) {
            if (!this.stowage && this.form.loadWeight !== 1) {
              this.msgWarning('运单车数只能为1车！');
            } else {
              extra(this.form).then(response => {
                this.msgSuccess('运单补录成功');
                this.reset();
                this.orderDisable = true;
                this.driverDisable = true;
              });
            }
          } else {
            this.msgWarning('运单重量或车数必须大于0！');
          }
        }
        loading.close();
      });
    },
    // 表单重置
    reset() {
      this.form = {
        'mainOrderCode': null,
        'orderCode': null,
        'driverCode': null,
        'goodsCode': null,
        'loadAddressCode': null,
        'loadAttachmentCode': null,
        'loadTime': null,
        'loadWeight': 0,
        'remark': null,
        'sourceType': 4,
        'unloadAddressCode': null,
        'unloadAttachmentCode': null,
        'unloadTime': null,
        'unloadWeight': 0,
        'vehicleCode': null,
        'shipperRealPay': null, // 货主实付金额
        'driverRealFee': null, // 司机实收金额
        'wayBillNo': null,
        'notRobbedOrder': null, // 剩余车数
        'remainingWeight': null, // 剩余吨数、立方数
        'shipmentPrice': null, // 运费单价
        'roadTransportCertificateNumber': null, // 运输许可证号
        'vehicleLoadWeight': null, // 车辆载重
        'chassisNumber': null, // 车辆识别码
        'm0DictValue': null, // 抹零规则字典值
        'ruleFormulaDictValue': null, // 计算公式
        'shipperCode': null, // 货主Code
        'stowageStatus': null, // 配载方式
        'teamCode': null, // 所属调度
        'addFee': null, // 增项费用
        'reductionFee': null // 减项费用

      };
      this.resetForm('form');
    },
    // 表单赋值
    setForm(data) {
	    this.form = data;
    },
    /** 运输单批量导入按钮操作 */
    handleWaybillImport() {
      this.openImport = true;
      this.title = '运输单批量导入(未完成，请勿操作)';
    },
    /** 装/卸货图片导入按钮操作 */
    handlePictureImport() {
      this.open = true;
      this.title = '装/卸货图片导入(未完成，请勿操作)';
    },
    /** 下载模板 */
    handleDownload() {
      console.log('点击了下载模板按钮');
    //   this.download('assets/driver/importTemplate', {}, `driver_${new Date().getTime()}.xlsx`);
    },
    // 根据货原单号查询信息
    getOrderDetail(e) {
      if (e) {
        getOrder(e).then(response => {
          console.log(response);
          if (response.data) {
            this.form.orderCode = response.data.redisOrderInfoVo.code; // 货源编码赋值
            this.form.shipperCode = response.data.redisOrderInfoVo.pubilshCode; // 货主编码赋值
            // 获取货源底下的商品列表
            getGoods(response.data.redisOrderInfoVo.code).then(response => {
              console.log(response);
              this.goodsCodeOptions = response.data;
              this.form.goodsCode = this.goodsCodeOptions[0].code;
              this.goodsChoose(this.form.goodsCode);
            });
            // 获取货源底下的装卸货地
            getAddress(response.data.redisOrderInfoVo.code).then(response => {
              console.log(response);
              const address = response.data;
              if (address) {
              // 装货地址
                const address1 = address.filter(item => {
                  return item.addressType === '1';
                });
                this.loadAddressOptions = address1;
                this.form.loadAddressCode = this.loadAddressOptions[0].code;
                // 卸货地址
                const address2 = address.filter(item => {
                  return item.addressType === '2';
                });
                this.unloadAddressOptions = address2;
                this.form.unloadAddressCode = this.unloadAddressOptions[0].code;
                this.getOrderGoodsProce();
              }
            });
            this.form.shipmentPrice = null;
            this.form.notRobbedOrder = null;
            this.form.remainingWeight = null;
            // 获取运单号
            getWayBillNo().then(response => {
              console.log(response);
              this.form.wayBillNo = response.msg;
            });
            this.orderDisable = false;
          } else {
            this.msgError('未查询到货源信息，或输入的货源单号有误！');
          }
        });
      } else {
        this.reset();
        this.orderDisable = true;
        this.driverDisable = true;
      }
    },
    // 获取单个商品的运费单价
    getOrderGoodsProce() {
      // console.log(this.form);
      if (this.form.goodsCode && this.form.loadAddressCode && this.form.unloadAddressCode) {
        const orderGoodsFindPriceBo = {
          loadCode: this.form.loadAddressCode,
          landCode: this.form.unloadAddressCode,
          orderGoodsCode: this.form.goodsCode,
          orderCode: this.form.orderCode
        };
        getOrderGoodsProce(orderGoodsFindPriceBo).then(response => {
          console.log(response);
          // 获取运费单价
          const freightCost = response.data.detailList.find(item => item.ruleItemCode === '17');
          this.form.shipmentPrice = freightCost.ruleValue;
          // 获取抹零规则字典值
          const m0 = response.data.detailList.find(item => item.ruleItemCode === '18');
          if (m0) {
            this.form.m0DictValue = m0.ruleValue;
          } else {
            this.form.m0DictValue = '1';
          }
          // 获取计算公式
          const caculation = response.data.detailList.find(item => item.ruleItemCode === '19');
          this.form.ruleFormulaDictValue = caculation.ruleValue;
          this.form.addFee = response.data.addFee || 0;
          this.form.reductionFee = response.data.reductionFee || 0;
          console.log(this.form);
          setTimeout(() => {
            this.calculate();
          }, 100);
        });
      } else {
        this.form.shipmentPrice = null;
        this.form.shipperRealPay = null;
        this.form.driverRealFee = null;
      }
    },
    // 获取运单总价
    calculate() {
      console.log(this.form);
      if (this.form.loadWeight && this.form.shipmentPrice) {
        const calculateBo = {
          driverAddFee: this.form.addFee,
          driverReductionFee: this.form.reductionFee,
          freightPrice: this.form.shipmentPrice,
          loadWeight: this.form.loadWeight,
          m0DictValue: this.form.m0DictValue,
          ruleFormulaDictValue: this.form.ruleFormulaDictValue,
          shipperCode: this.form.shipperCode,
          stowageStatus: this.form.stowageStatus,
          unloadWeight: this.form.loadWeight
        };
        console.log(calculateBo);
        calculate(calculateBo).then(response => {
          console.log(response);
          this.form.shipperRealPay = response.data.shipperRealPay.toFixed(2);
          this.form.driverRealFee = response.data.driverRealFee.toFixed(2);
        });
      }
    },
    // 根据选择的商品查询对应信息
    goodsChoose(e) {
      if (e) {
        const result = this.goodsCodeOptions.find((item) => {
          return item.code === e;
        });
        this.form.stowageStatus = result.stowageStatus; // 配载方式赋值
        if (result.stowageStatus === '2') {
          this.stowage = false;
          this.form.loadWeight = 1;
          this.form.unloadWeight = 1;
        // this.calculate();
        } else {
          this.stowage = true;
        }
        this.form.notRobbedOrder = !result.notRobbedOrder && result.notRobbedOrder !== 0 ? '不限' : result.notRobbedOrder;
        this.form.remainingWeight = !result.remainingWeight && result.remainingWeight !== 0 ? '不限' : result.remainingWeight;
        this.getOrderGoodsProce();
        this.$forceUpdate(); // 视图强制更新
      } else {
        this.form.notRobbedOrder = null;
        this.form.remainingWeight = null;
        this.getOrderGoodsProce();
      }
    },
    loadChoose() {
      this.getOrderGoodsProce();
      this.$forceUpdate(); // 视图强制更新
    },
    lendChoose() {
      console.log(this.form);
      this.getOrderGoodsProce();
      this.$forceUpdate(); // 视图强制更新
    },
    // 根据选择的司机查询司机拥有的车辆和所属调度
    driverChoose(e) {
      if (e) {
        this.vehicleInfoQuery.driverCode = e;
        vehicle(this.vehicleInfoQuery).then(response => {
          this.vehicleOptions = response.rows;
        });
        team(this.vehicleInfoQuery).then(response => {
          this.teamOptions = response.rows;
        });
        this.form.vehicleCode = null;
        this.form.roadTransportCertificateNumber = null;
        this.form.chassisNumber = null;
        this.form.vehicleLoadWeight = null;
        this.driverDisable = false;
      } else {
        this.driverDisable = true;
        this.form.vehicleCode = null;
        this.form.roadTransportCertificateNumber = null;
        this.form.chassisNumber = null;
        this.form.vehicleLoadWeight = null;
      }
    },
    // 根据选择的车辆获取信息
    vehicleChoose(e) {
      if (e) {
        vehicleInfo(e).then(response => {
          console.log(response);
          this.form.roadTransportCertificateNumber = response.data.roadTransportCertificateNumber;
          this.form.vehicleLoadWeight = response.data.vehicleLoadWeight;
          this.form.chassisNumber = response.data.chassisNumber;
        });
        this.$forceUpdate(); // 视图强制更新
      } else {
        this.form.roadTransportCertificateNumber = null;
        this.form.chassisNumber = null;
        this.form.vehicleLoadWeight = null;
      }
    },
    // 赋值卸货重量
    inputWeight(e) {
      this.form.unloadWeight = e;
      console.log(this.form.unloadWeight);
      this.calculate();
    },
    chooseImg() {
      if (this.form.loadAttachmentCode) {
        this.$refs['loadAttachment'].clearValidate();
      }
      if (this.form.unloadAttachmentCode) {
        this.$refs['unloadAttachment'].clearValidate();
      }
    }
  }
};
</script>

<style>
.container {
  overflow-y: auto;
  height: calc(100vh - 201px);
}
.supplement-title{
    font-size: 18px;
}
.width90{
	width: 90% !important;
}
</style>
