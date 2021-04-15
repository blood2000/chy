<template>
  <el-tabs type="border-card">
    <el-tab-pane label="运单补录" style="padding:0 30px;">
      <div class="container">
        <el-form ref="form" :model="form" :rules="rules" label-width="140px">
          <el-divider content-position="left"><span class="supplement-title">货源信息</span></el-divider>
          <el-row>
            <el-col :span="8">
              <el-form-item label="货源单号" prop="mainOrderCode">
                <el-input v-model="form.mainOrderCode" placeholder="请输入货源单号" class="width90" @change="getOrderDetail" />
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
              <el-form-item v-if="!stowage" label="剩余车数" prop="remainingNumber">
                <el-input v-model="form.remainingNumber" :readonly="true" class="width90" />
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
                  />
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
              <el-form-item label="车辆代码" prop="classificationCode">
                <el-input v-model="form.classificationCode" :readonly="true" class="width90" />
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
              <el-form-item label="装车时间" prop="loadTime">
                <el-date-picker
                  v-model="form.loadTime"
                  clearable
                  size="small"
                  class="width90"
                  type="datetime"
                  value-format="yyyy-MM-dd hh:mm:ss"
                  placeholder="选择装车时间"
                />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="卸车时间" prop="unloadTime">
                <el-date-picker
                  v-model="form.unloadTime"
                  clearable
                  size="small"
                  class="width90"
                  type="datetime"
                  value-format="yyyy-MM-dd hh:mm:ss"
                  placeholder="选择卸车时间"
                />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="运单重量" prop="loadWeight">
                <el-input-number v-model="form.loadWeight" placeholder="请输入运单重量" controls-position="right" :min="0" class="width90" @change="inputWeight" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <el-form-item label="运单总价" prop="wayBillPrice">
                <el-input v-model="form.wayBillPrice" :readonly="true" class="width90" />
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
              <el-form-item label="装货单据">
                <uploadImage v-model="form.identificationBackImage" />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="卸货单据/回执单">
                <uploadImage v-model="form.identificationBackImage" />
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>

        <el-row>
          <el-col :span="2" :offset="11">
            <el-button type="primary" @click="submitForm">确 定</el-button>
          </el-col>
        </el-row>
      </div>
    </el-tab-pane>

    <el-tab-pane label="批量补录">
      <el-row :gutter="10" class="mb8">
        <el-col :span="1.5">
          <el-button
            type="info"
            icon="el-icon-upload2"
            size="mini"
            @click="handleWaybillImport"
          >运输单批量导入</el-button>
        </el-col>
        <el-col :span="1.5">
          <el-button
            v-hasPermi="['waybill:abnormal:edit']"
            type="warning"
            icon="el-icon-upload2"
            size="mini"
            @click="handlePictureImport"
          >装/卸货图片导入</el-button>
        </el-col>
        <el-col :span="1.5">
          <el-button
            type="success"
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
import { extra, getOrder, getGoods, getAddress, driver, vehicle, vehicleInfo, getOrderGoodsProce, getWayBillNo, calculate } from '@/api/waybill/supplement';
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
        'name': null
      },
      vehicleInfoQuery: {
        'pageNum': 1,
        'pageSize': 10,
        'driverCode': null
      },
      loading: false,
      dataOver: false, // 是否请求完了
      // 实际承运车辆选择
      vehicleOptions: [],
      // 弹出层标题
      title: '',
      stowage: false,
      // 是否显示弹出层
      open: false,
      openImport: false,
      // 表单参数
      form: {
      },
      // 表单校验
      rules: {
        description: [
          { required: true, message: '异常说明不能为空', trigger: 'blur' }
        ]
      }
    };
  },
  computed: {
  },
  created() {
    this.reset();
    // this.getDriver();
  },
  methods: {
    // 获取司机列表
    getDriver() {
      driver(this.driverInfoQuery).then(response => {
        this.driverOptions = response.rows;
        console.log(this.driverOptions);
        this.loading = false;
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          extra(this.form).then(response => {
            this.msgSuccess('运单补录成功');
            this.close();
          });
        }
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
        'wayBillPrice': null, // 运单总价
        'wayBillNo': null,
        'remainingNumber': null, // 剩余车数
        'remainingWeight': null, // 剩余吨数、立方数
        'shipmentPrice': null, // 运费单价
        'roadTransportCertificateNumber': null, // 运输许可证号
        'vehicleLoadWeight': null, // 车辆载重
        'classificationCode': null, // 车辆代码
        'm0DictValue': null, // 抹零规则字典值
        'ruleFormulaDictValue': null, // 计算公式
        'shipperCode': null, // 货主Code
        'stowageStatus': null // 配载方式
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
      this.title = '运输单批量导入';
    },
    /** 装/卸货图片导入按钮操作 */
    handlePictureImport() {
      this.open = true;
      this.title = '装/卸货图片导入';
    },
    /** 下载模板 */
    handleDownload() {
      console.log('点击了下载模板按钮');
    //   this.download('assets/driver/importTemplate', {}, `driver_${new Date().getTime()}.xlsx`);
    },
    // 根据货原单号查询信息
    getOrderDetail(e) {
      getOrder(e).then(response => {
        console.log(response);
        if (response.data) {
          this.form.orderCode = response.data.redisOrderInfoVo.code; // 货源编码赋值
          this.form.shipperCode = response.data.redisOrderInfoVo.pubilshCode; // 货主编码赋值
          // 获取货源底下的商品列表
          getGoods(response.data.redisOrderInfoVo.code).then(response => {
            console.log(response);
            this.goodsCodeOptions = response.data;
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
              // 卸货地址
              const address2 = address.filter(item => {
                return item.addressType === '2';
              });
              this.unloadAddressOptions = address2;
            }
          });
          // 获取运单号
          getWayBillNo().then(response => {
            console.log(response);
            this.form.wayBillNo = response.msg;
          });
        } else {
          this.msgError('未查询到货源信息，或输入的货源单号有误！');
        }
      });
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
          this.form.shipmentPrice = response.data.ruleValue;
        });
      }
    },
    // 获取运单总价
    calculate() {
      if (this.form.shipmentPrice && this.form.loadWeight) {
        const calculateBo = {
          driverAddFee: 0,
          driverReductionFee: 0,
          freightPrice: this.form.shipmentPrice,
          loadWeight: this.form.loadWeight,
          m0DictValue: this.form.m0DictValue,
          ruleFormulaDictValue: this.form.ruleFormulaDictValue,
          shipperCode: this.form.shipperCode,
          stowageStatus: this.form.stowageStatus,
          unloadWeight: this.form.loadWeight
        };
        calculate(calculateBo).then(response => {
          console.log(response);
          // this.form.wayBillPrice = response.data.ruleValue;
        });
      }
    },
    // 根据选择的商品查询对应信息
    goodsChoose(e) {
      const result = this.goodsCodeOptions.find((item) => {
        return item.code === e;
      });
      this.form.stowageStatus = result.stowageStatus; // 配载方式赋值
      if (result.stowageStatus === '2') {
        this.stowage = false;
      } else {
        this.stowage = true;
      }
      this.form.remainingNumber = result.remainingNumber;
      this.form.remainingWeight = result.remainingWeight;
      this.getOrderGoodsProce();
    },
    loadChoose() {
      this.getOrderGoodsProce();
    },
    lendChoose() {
      console.log(this.form);
      this.getOrderGoodsProce();
    },
    // 根据选择的司机查询司机拥有的车辆
    driverChoose(e) {
      this.vehicleInfoQuery.driverCode = e;
      vehicle(this.vehicleInfoQuery).then(response => {
        this.vehicleOptions = response.rows;
      });
    },
    // 触发司机远程搜索
    remoteMethod(query) {
      if (query !== '') {
        this.loading = true;
        this.driverInfoQuery.pageNum = 1;
        this.dataOver = false;
        this.driverInfoQuery.name = query;
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
    // 根据选择的车辆获取信息
    vehicleChoose(e) {
      vehicleInfo(e).then(response => {
        console.log(response);
        this.form.roadTransportCertificateNumber = response.data.roadTransportCertificateNumber;
        this.form.vehicleLoadWeight = response.data.vehicleLoadWeight;
        this.form.classificationCode = response.data.classificationCode;
      });
    },
    // 赋值卸货重量
    inputWeight(e) {
      this.form.unloadWeight = e;
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
