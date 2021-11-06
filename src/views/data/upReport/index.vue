<template>
  <div v-loading="loading" class="app-container">
    <el-row style="width:80%">
      <el-form ref="mform" :model="mform" :rules="rules" label-width="300px">
        <el-form-item label="原始单号" prop="originalDocumentNumber">
          <el-input v-model="mform.originalDocumentNumber" style="width:90%; margin-right:10px;" placeholder="请输入原始单号" />
          <el-tooltip class="item" effect="dark" content="上游企业委托运输单号: 9999999999" placement="right">
            <i class="el-icon-question" />
          </el-tooltip>
        </el-form-item>
        <el-form-item label="联运单号" prop="shippingNoteNumber">
          <el-input v-model="mform.shippingNoteNumber" style="width:90%; margin-right:10px;" placeholder="请输入联运单号" />
          <el-tooltip class="item" effect="dark" placement="right">
            <div slot="content">多式联运经营者公司代码（4 位大写英文字母）<br>+客户代码（4位字符）<br>+年月日（8位，例如：20210225）<br>+流水号（4 位，例：0001）。<br>联运单证编码总长度 20 位。</div>
            <i class="el-icon-question" />
          </el-tooltip>
        </el-form-item>
        <el-form-item label="分段号" prop="serialNumber">
          <el-input v-model="mform.serialNumber" style="width:90%; margin-right:10px;" placeholder="请输入分段号" />
        </el-form-item>
        <el-form-item label="运输总工具数" prop="vehicleAmount">
          <el-input v-model="mform.vehicleAmount" style="width:90%; margin-right:10px;" placeholder="请输入运输总工具数" />
        </el-form-item>
        <el-form-item label="运输组织类型代码" prop="transportTypeCode">
          <el-select v-model="mform.transportTypeCode" placeholder="请选择运输组织类型代码" style="width:90%; margin-right:10px;">
            <el-option
              v-for="item in [
                { label:'公路运输', value:1 },
                { label:'公铁联运', value:2 },
                { label:'公水联运', value:3 },
                { label:'公空联运', value:4 },
                { label:'公铁水联运', value:5 },
                { label:'公铁空联运', value:6 },
                { label:'公水空联运', value:7 },
                { label:'公铁水空联运', value:8 },
                { label:'水铁联运', value:9 },
                { label:'空铁联运', value:10 },
                { label:'空水联运', value:11 },
                { label:'水铁空联运', value:12 },
              ]"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="运单上传时间" prop="sendToProDateTime">
          <!-- 时间 -->
          <el-date-picker v-model="mform.sendToProDateTime" type="datetime" placeholder="运单上传时间" value-format="yyyyMMddHHmmss" style="width:90%; margin-right:10px;" />
        </el-form-item>
        <el-form-item label="网络货运" prop="carrier">
          <el-input v-model="mform.carrier" style="width:90%; margin-right:10px;" placeholder="请输入网络货运" />
        </el-form-item>
        <el-form-item label="统一社会信用代码" prop="unifiedSocialCreditIdentifier">
          <el-input v-model="mform.unifiedSocialCreditIdentifier" style="width:90%; margin-right:10px;" placeholder="请输入统一社会信用代码" />
        </el-form-item>
        <el-form-item label="运输经营许可证编号" prop="permitNumber">
          <el-input v-model="mform.permitNumber" style="width:90%; margin-right:10px;" placeholder="请输入运输经营许可证编号" />
        </el-form-item>
        <el-form-item label="运单生成时间" prop="consignmentDateTime">
          <!-- 时间 -->
          <el-date-picker v-model="mform.consignmentDateTime" type="datetime" placeholder="运单生成时间" value-format="yyyyMMddHHmmss" style="width:90%; margin-right:10px;" />
        </el-form-item>
        <el-form-item label="业务类型代码" prop="businessTypeCode">
          <el-select v-model="mform.businessTypeCode" placeholder="请选择业务类型代码" style="width:90%; margin-right:10px;">
            <el-option
              v-for="item in [
                { label:'干线普货运输', value:'1002996' },
                { label:'城市配送', value:'1003997' },
                { label:'农村配送', value:'1003998' },
                { label:'集装箱运输', value:'1002998' },
                { label:'其他', value:'1003999' },
              ]"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="发货（装货）日期时间" prop="despatchActualDateTime">
          <!-- 时间 -->
          <el-date-picker v-model="mform.despatchActualDateTime" type="datetime" placeholder="发货（装货）日期时间" value-format="yyyyMMddHHmmss" style="width:90%; margin-right:10px;" />
        </el-form-item>
        <el-form-item label="收货（卸货）日期时间" prop="goodsReceiptDateTime">
          <!-- 时间 -->
          <el-date-picker v-model="mform.goodsReceiptDateTime" type="datetime" placeholder="选择收货（卸货）日期时间" value-format="yyyyMMddHHmmss" style="width:90%; margin-right:10px;" />
        </el-form-item>
        <el-form-item label="运费金额（元）" prop="totalMonetaryAmount">
          <el-input-number v-model.number="mform.totalMonetaryAmount" :precision="3" :step="0.1" :controls="false" style="width:90%; margin-right:10px; text-align:left;" />
        </el-form-item>

        <!--  -->
        <el-form-item label="托运人名称" prop="consignorInfo.consignor">
          <el-input v-model="mform.consignorInfo.consignor" style="width:90%; margin-right:10px;" placeholder="请输入托运人名称" />
        </el-form-item>
        <el-form-item label="托运人统一社会信用代码或个人证件号" prop="consignorInfo.consignorId">
          <el-input v-model="mform.consignorInfo.consignorId" style="width:90%; margin-right:10px;" placeholder="请输入托运人统一社会信用代码或个人证件号" />
        </el-form-item>
        <el-form-item label="装货地址" prop="consignorInfo.placeOfLoading">
          <el-input v-model="mform.consignorInfo.placeOfLoading" style="width:90%; margin-right:10px;" placeholder="请输入装货地址" />
        </el-form-item>
        <el-form-item label="装货地点的国家行政区划代码或国别代码" prop="consignorInfo.countrySubdivisionCode">
          <el-input v-model="mform.consignorInfo.countrySubdivisionCode" style="width:90%; margin-right:10px;" placeholder="请输入装货地点的国家行政区划代码或国别代码" />
        </el-form-item>
        <!--  -->
        <el-form-item label="收货方名称" prop="consigneeInfo.consignee">
          <el-input v-model="mform.consigneeInfo.consignee" style="width:90%; margin-right:10px;" placeholder="请输入收货方名称" />
        </el-form-item>
        <el-form-item label="收货方统一社会信用代码或个人证件号码" prop="consigneeInfo.consigneeId">
          <el-input v-model="mform.consigneeInfo.consigneeId" style="width:90%; margin-right:10px;" placeholder="请输入收货方统一社会信用代码或个人证件号码" />
        </el-form-item>
        <el-form-item label="收货地址" prop="consigneeInfo.goodsReceiptPlace">
          <el-input v-model="mform.consigneeInfo.goodsReceiptPlace" style="width:90%; margin-right:10px;" placeholder="请输入收货地址" />
        </el-form-item>
        <el-form-item label="收货地点的国家行政区划代码或国别代码" prop="consigneeInfo.countrySubdivisionCode">
          <el-input v-model="mform.consigneeInfo.countrySubdivisionCode" style="width:90%; margin-right:10px;" placeholder="请输入收货地点的国家行政区划代码或国别代码" />
        </el-form-item>
        <!--  -->
        <el-form-item label="运输类型" prop="vehicleInfo.transportType">
          <el-select v-model="mform.vehicleInfo.transportType" placeholder="请选择运输类型" style="width:90%; margin-right:10px;">
            <el-option
              v-for="item in [
                { label:'公路', value:'1' },
                { label:'铁路', value:'2' },
                { label:'水路', value:'3' },
                { label:'航空', value:'4' },
              ]"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="运输工具牌照号" prop="vehicleInfo.vehicleNumber">
          <el-input v-model="mform.vehicleInfo.vehicleNumber" style="width:90%; margin-right:10px;" placeholder="请输入运输工具牌照号" />
        </el-form-item>
        <el-form-item label="车牌颜色代码" prop="vehicleInfo.vehiclePlateColorCode">
          <el-select v-model="mform.vehicleInfo.vehiclePlateColorCode" placeholder="请选择车牌颜色" filterable clearable style="width:90%; margin-right:10px;">
            <el-option
              v-for="dict in licenseColorOptions"
              :key="dict.dictValue"
              :label="dict.dictLabel"
              :value="dict.dictValue"
            />
          </el-select>

        </el-form-item>
        <el-form-item label="发货日期时间" prop="vehicleInfo.despatchActualDateTime">
          <!-- 时间 -->
          <el-date-picker v-model="mform.vehicleInfo.despatchActualDateTime" type="datetime" placeholder="选择发货日期时间" value-format="yyyyMMddHHmmss" style="width:90%; margin-right:10px;" />
        </el-form-item>
        <el-form-item label="收货日期时间" prop="vehicleInfo.goodsReceiptDateTime">
          <!-- 时间 -->
          <el-date-picker v-model="mform.vehicleInfo.goodsReceiptDateTime" type="datetime" placeholder="选择收货日期时间" value-format="yyyyMMddHHmmss" style="width:90%; margin-right:10px;" />
        </el-form-item>
        <el-form-item label="装货地址" prop="vehicleInfo.placeOfLoading">
          <el-input v-model="mform.vehicleInfo.placeOfLoading" style="width:90%; margin-right:10px;" placeholder="请输入装货地址" />
        </el-form-item>
        <el-form-item label="收货地址" prop="vehicleInfo.goodsReceiptPlace">
          <el-input v-model="mform.vehicleInfo.goodsReceiptPlace" style="width:90%; margin-right:10px;" placeholder="请输入收货地址" />
        </el-form-item>
        <el-form-item label="装货地址的国家行政区划代码或国别代码" prop="vehicleInfo.loadingCountrySubdivisionCode">
          <el-input v-model="mform.vehicleInfo.loadingCountrySubdivisionCode" style="width:90%; margin-right:10px;" placeholder="请输入装货地址的国家行政区划代码或国别代码" />
        </el-form-item>
        <el-form-item label="收货地址的国家行政区划代码或国别代码" prop="vehicleInfo.receiptCountrySubdivisionCode">
          <el-input v-model="mform.vehicleInfo.receiptCountrySubdivisionCode" style="width:90%; margin-right:10px;" placeholder="请输入收货地址的国家行政区划代码或国别代码" />
        </el-form-item>

        <el-form-item>
          <el-divider content-position="left">驾驶员</el-divider>
        </el-form-item>

        <el-form-item label="姓名" prop="vehicleInfo.driver[0].driverName">
          <el-input v-model="mform.vehicleInfo.driver[0].driverName" style="width:90%; margin-right:10px;" placeholder="请输入姓名" />
        </el-form-item>
        <el-form-item label="身份证号" prop="vehicleInfo.driver[0].drivingLicense">
          <el-input v-model="mform.vehicleInfo.driver[0].drivingLicense" style="width:90%; margin-right:10px;" placeholder="请输入身份证号" />
        </el-form-item>

        <el-form-item>
          <el-divider content-position="left">货物信息</el-divider>
        </el-form-item>

        <el-form-item label="集装箱号" prop="vehicleInfo.goodsInfo[0].goodsNo">
          <el-input v-model="mform.vehicleInfo.goodsInfo[0].goodsNo" style="width:90%; margin-right:10px;" placeholder="请输入集装箱号" />
        </el-form-item>
        <el-form-item label="货物名称" prop="vehicleInfo.goodsInfo[0].descriptionOfGoods">
          <el-input v-model="mform.vehicleInfo.goodsInfo[0].descriptionOfGoods" style="width:90%; margin-right:10px;" placeholder="请输入货物名称" />
        </el-form-item>
        <el-form-item label="货物类型分类代码" prop="vehicleInfo.goodsInfo[0].cargoTypeClassificationCode">
          <el-select v-model="mform.vehicleInfo.goodsInfo[0].cargoTypeClassificationCode" placeholder="请选择货物类型分类代码" filterable clearable style="width:90%; margin-right:10px;">
            <el-option
              v-for="dict in goodsTypeOptions"
              :key="dict.dictValue"
              :label="dict.dictLabel"
              :value="dict.dictValue"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="货物项毛重" prop="vehicleInfo.goodsInfo[0].goodsItemGrossWeight">
          <el-input v-model="mform.vehicleInfo.goodsInfo[0].goodsItemGrossWeight" style="width:90%; margin-right:10px;" placeholder="请输入货物项毛重" />
        </el-form-item>
        <el-form-item label="体积" prop="vehicleInfo.goodsInfo[0].cube">
          <el-input v-model="mform.vehicleInfo.goodsInfo[0].cube" style="width:90%; margin-right:10px;" placeholder="请输入体积" />
        </el-form-item>
        <el-form-item label="总件数" prop="vehicleInfo.goodsInfo[0].totalNumberOfPackages">
          <el-input v-model="mform.vehicleInfo.goodsInfo[0].totalNumberOfPackages" style="width:90%; margin-right:10px;" placeholder="请输入总件数" />
        </el-form-item>

        <el-form-item>
          <el-divider />
        </el-form-item>

        <el-form-item label="实际承运人名称" prop="actualCarrierInfo.actualCarrierName">
          <el-input v-model="mform.actualCarrierInfo.actualCarrierName" style="width:90%; margin-right:10px;" placeholder="请输入实际承运人名称" />
        </el-form-item>
        <el-form-item label="实际承运人统一社会信用代码或证件号码" prop="actualCarrierInfo.actualCarrierId">
          <el-input v-model="mform.actualCarrierInfo.actualCarrierId" style="width:90%; margin-right:10px;" placeholder="请输入实际承运人统一社会信用代码或证件号码" />
        </el-form-item>
        <el-form-item label="实际承运人道路运输经营许可证号" prop="actualCarrierInfo.actualCarrierBusinessLicense">
          <el-input v-model="mform.actualCarrierInfo.actualCarrierBusinessLicense" style="width:90%; margin-right:10px;" placeholder="请输入实际承运人道路运输经营许可证号" />
        </el-form-item>
        <!--  -->
        <el-form-item label="保险单号" prop="insuranceInformation.policyNumber">
          <el-input v-model="mform.insuranceInformation.policyNumber" style="width:90%; margin-right:10px;" placeholder="请输入保险单号" />
        </el-form-item>
        <el-form-item label="保险公司代码" prop="insuranceInformation.insuranceCompanyCode">
          <el-select v-model="mform.insuranceInformation.insuranceCompanyCode" placeholder="请选择保险公司代码" style="width:90%; margin-right:10px;">
            <el-option
              v-for="item in [
                { label:'安邦财产保险股份有限公司', value:'ABIC' },
                { label:'永诚财产保险股份有限公司', value:'AICS' },
                { label:'中银保险有限公司', value:'BOCI' },
                { label:'渤海财产保险股份有限公司', value:'BPIC' },
                { label:'长安责任保险股份有限公司', value:'CAIC' },
                { label:'中国大地财产保险股份有限公司', value:'CCIC' },
                { label:'中华联合财产保险公司', value:'CICP' },
                { label:'中国太平洋财产保险股份有限公司', value:'CPIC' },
                { label:'都邦财产保险股份有限公司', value:'DBIC' },
                { label:'中国人寿财产保险公司', value:'GPIC' },
                { label:'华安财产保险股份有限公司', value:'HAIC' },
                { label:'华泰财产保险股份有限公司', value:'HTIC' },
                { label:'民安保险(中国)有限公司', value:'MACN' },
                { label:'中国平安财产保险股份有限公司', value:'PAIC' },
                { label:'中国人民财产保险股份有限公司', value:'PICC' },
                { label:'天安保险股份有限公司', value:'TAIC' },
                { label:'太平保险有限公司', value:'TPIC' },
                { label:'英大泰和人寿保险股份有限公司', value:'YDCX' },
                { label:'阳光财产保险股份有限公司', value:'YGBX' },
                { label:'紫金财产保险公司', value:'ZKIC' },
                { label:'永安财产保险股份有限公司', value:'YAIC' },
                { label:'天平保险公司', value:'TPBX' },
                { label:'安诚财产保险股份有限公司', value:'ACIC' },
                { label:'鼎和财产保险股份有限公司', value:'DHIC' },
                { label:'安联保险公司', value:'ALIC' },
                { label:'其他保险公司', value:'QITA' },
              ]"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <!--  -->
        <el-form-item label="货物运单二维码链接地址" prop="qrCodeUrl">
          <el-input v-model="mform.qrCodeUrl" style="width:90%; margin-right:10px;" placeholder="请输入货物运单二维码链接地址" />
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="mform.remark" style="width:90%; margin-right:10px;" placeholder="请输入备注" />
        </el-form-item>


        <el-form-item>
          <el-button type="primary" @click="onSubmit">提交</el-button>
          <el-button @click="resetForm">重置</el-button>
        </el-form-item>
      </el-form>
    </el-row>
    <!-- <form-create v-if="false" v-model="fApi" :rule="rule" :option="option" :value.sync="value" /> -->

  </div>
</template>

<script>
// import formCreate from '@form-create/element-ui';


import { commonDslyReport } from '@/api/data/report';
export default {
  // components: {
  //   formCreate: formCreate.$form()
  // },
  data() {
    return {
      // 实例对象
      // fApi: {},
      // // 表单数据
      // value: {
      //   consignorInfo: {
      //     consignor: ''
      //   }
      // },
      // // 表单生成规则
      // rule: rules,
      // // 组件参数配置
      // option: {
      //   // 表单提交事件
      //   onSubmit: (formData) => {
      //     // alert(JSON.stringify(formData));
      //     // this.onSubmit();
      //   },
      //   submitBtn: {
      //     innerText: '提交'
      //   },
      //   form: {
      //     // 行内表单模式
      //     inline: false,
      //     // 表单域标签的位置，如果值为 left 或者 right 时，则需要设置 label-width
      //     labelPosition: 'right',
      //     // 表单域标签的后缀
      //     labelSuffix: undefined,
      //     // 是否显示必填字段的标签旁边的红色星号
      //     hideRequiredAsterisk: false,
      //     // 表单域标签的宽度，例如 '50px'。作为 Form 直接子元素的 form-item 会继承该值。支持 auto。
      //     labelWidth: '300px',
      //     // 是否显示校验错误信息
      //     showMessage: true,
      //     // 是否以行内形式展示校验信息
      //     inlineMessage: false,
      //     // 是否在输入框中显示校验结果反馈图标
      //     statusIcon: false,
      //     // 是否在 rules 属性改变后立即触发一次验证
      //     validateOnRuleChange: true,
      //     // 是否禁用该表单内的所有组件。若设置为 true，则表单内组件上的 disabled 属性不再生效
      //     disabled: false,
      //     // 用于控制该表单内组件的尺寸 medium / small / mini
      //     size: undefined,
      //     // 是否显示 label
      //     title: true
      //   }
      // },

      // 正常操作
      loading: false,
      mform: {
        'originalDocumentNumber': '',
        'shippingNoteNumber': '',
        'serialNumber': '',
        'vehicleAmount': undefined,
        'transportTypeCode': undefined,
        'sendToProDateTime': '',
        'carrier': '',
        'unifiedSocialCreditIdentifier': '',
        'permitNumber': '',
        'consignmentDateTime': '',
        'businessTypeCode': '1002996',
        'despatchActualDateTime': '',
        'goodsReceiptDateTime': '',
        'totalMonetaryAmount': '',
        'consignorInfo': {
          'consignor': '',
          'consignorId': '',
          'placeOfLoading': '',
          'countrySubdivisionCode': ''
        },
        'consigneeInfo': {
          'consignee': '',
          'consigneeId': '',
          'goodsReceiptPlace': '',
          'countrySubdivisionCode': ''
        },
        'vehicleInfo': {
          'transportType': '',
          'vehicleNumber': '',
          'vehiclePlateColorCode': '',
          'despatchActualDateTime': '',
          'goodsReceiptDateTime': '',
          'placeOfLoading': '',
          'goodsReceiptPlace': '',
          'loadingCountrySubdivisionCode': '',
          'receiptCountrySubdivisionCode': '',
          'driver': [
            {
              'driverName': '',
              'drivingLicense': ''
            }
          ],
          'goodsInfo': [
            {
              'goodsNo': '',
              'descriptionOfGoods': '',
              'cargoTypeClassificationCode': '',
              'goodsItemGrossWeight': undefined,
              'cube': undefined,
              'totalNumberOfPackages': undefined
            }
          ]
        },
        'actualCarrierInfo': {
          'actualCarrierName': '',
          'actualCarrierId': '',
          'actualCarrierBusinessLicense': ''
        },
        'insuranceInformation': {
          'policyNumber': '',
          'insuranceCompanyCode': ''
        },
        'qrCodeUrl': '',
        'remark': ''
      },
      rules: {
        'originalDocumentNumber': [
          { required: true, message: '请输入原始单号', trigger: 'blur' }
        ],
        'shippingNoteNumber': [
          { required: true, message: '请输入联运单号', trigger: 'blur' }
        ],
        'serialNumber': [
          { required: true, message: '请输入分段号', trigger: 'blur' }
        ],
        'vehicleAmount': [
          { required: true, message: '请输入运输总工具数', trigger: 'blur' }
        ],
        'transportTypeCode': [
          { required: true, message: '请输入运输组织类型代码', trigger: 'change' }
          // { required: true, message: '请输入运输组织类型代码', trigger: 'blur' }
        ],
        'sendToProDateTime': [
          { required: true, message: '请输入运单上传时间', trigger: 'change' }
        ],
        'carrier': [
          { required: true, message: '请输入网络货运', trigger: 'blur' }
        ],
        'unifiedSocialCreditIdentifier': [
          { required: true, message: '请输入统一社会信用代码', trigger: 'blur' }
        ],
        'permitNumber': [
          { required: true, message: '请输入运输经营许可证编号', trigger: 'blur' }
        ],
        'consignmentDateTime': [
          { required: true, message: '请输入运单生成时间', trigger: 'change' }
        ],
        'businessTypeCode': [
          { required: true, message: '请输入业务类型代码', trigger: 'change' }
          // { required: true, message: '请输入业务类型代码', trigger: 'blur' }
        ],
        'despatchActualDateTime': [
          { required: true, message: '请输入发货（装货）日期时间', trigger: 'change' }
        ],
        'goodsReceiptDateTime': [
          { required: true, message: '请输入收货（卸货）日期时间', trigger: 'change' }
        ],
        'totalMonetaryAmount': [
          { required: true, type: 'number', message: '请输入运费金额', trigger: 'blur' }
        ],
        'consignorInfo.consignor': [
          { required: true, message: '请输入托运人名称', trigger: 'blur' }
        ],
        'consignorInfo.consignorId': [
          { required: true, message: '请输入托运人统一社会信用代码或个人证件号', trigger: 'blur' }
        ],
        'consignorInfo.placeOfLoading': [
          { required: true, message: '请输入装货地址', trigger: 'blur' }
        ],
        'consignorInfo.countrySubdivisionCode': [
          { required: true, message: '请输入装货地点的国家行政区划代码或国别代码', trigger: 'blur' }
        ],
        'consigneeInfo.consignee': [
          { required: true, message: '请输入收货方名称', trigger: 'blur' }
        ],
        'consigneeInfo.consigneeId': [
          { required: false, message: '请输入收货方统一社会信用代码或个人证件号码', trigger: 'blur' }
        ],
        'consigneeInfo.goodsReceiptPlace': [
          { required: true, message: '请输入收货地址', trigger: 'blur' }
        ],
        'consigneeInfo.countrySubdivisionCode': [
          { required: true, message: '请输入收货地点的国家行政区划代码或国别代码', trigger: 'blur' }
        ],
        'vehicleInfo.transportType': [
          { required: true, message: '请输入运输类型', trigger: 'change' }
          // { required: true, message: '请输入运输类型', trigger: 'blur' }
        ],
        'vehicleInfo.vehicleNumber': [
          { required: true, message: '请输入运输工具牌照号', trigger: 'blur' }
        ],
        'vehicleInfo.vehiclePlateColorCode': [
          { required: true, message: '请输入车牌颜色代码', trigger: 'change' }
          // { required: true, message: '请输入车牌颜色代码', trigger: 'blur' }
        ],
        'vehicleInfo.despatchActualDateTime': [
          { required: true, message: '请输入发货日期时间', trigger: 'change' }
        ],
        'vehicleInfo.goodsReceiptDateTime': [
          { required: true, message: '请输入收货日期时间', trigger: 'change' }
        ],
        'vehicleInfo.placeOfLoading': [
          { required: true, message: '请输入装货地址', trigger: 'blur' }
        ],
        'vehicleInfo.goodsReceiptPlace': [
          { required: true, message: '请输入收货地址', trigger: 'blur' }
        ],
        'vehicleInfo.loadingCountrySubdivisionCode': [
          { required: true, message: '请输入装货地址的国家行政区划代码或国别代码', trigger: 'blur' }
        ],
        'vehicleInfo.receiptCountrySubdivisionCode': [
          { required: true, message: '请输入收货地址的国家行政区划代码或国别代码', trigger: 'blur' }
        ],

        'vehicleInfo.driver[0].driverName': [
          { required: false, message: '请输入姓名', trigger: 'blur' }
        ],
        'vehicleInfo.driver[0].drivingLicense': [
          { required: false, message: '请输入身份证号', trigger: 'blur' }
        ],

        'vehicleInfo.goodsInfo[0].goodsNo': [
          { required: false, message: '请输入集装箱号', trigger: 'blur' }
        ],
        'vehicleInfo.goodsInfo[0].descriptionOfGoods': [
          { required: true, message: '请输入货物名称', trigger: 'blur' }
        ],
        'vehicleInfo.goodsInfo[0].cargoTypeClassificationCode': [
          { required: true, message: '请输入货物类型分类代码', trigger: 'change' }
          // { required: true, message: '请输入货物类型分类代码', trigger: 'blur' }
        ],
        'vehicleInfo.goodsInfo[0].goodsItemGrossWeight': [
          { required: true, message: '请输入货物项毛重', trigger: 'blur' }
        ],
        'vehicleInfo.goodsInfo[0].cube': [
          { required: false, message: '请输入体积', trigger: 'blur' }
        ],
        'vehicleInfo.goodsInfo[0].totalNumberOfPackages': [
          { required: false, message: '请输入总件数', trigger: 'blur' }
        ],

        'actualCarrierInfo.actualCarrierName': [
          { required: true, message: '请输入实际承运人名称', trigger: 'blur' }
        ],
        'actualCarrierInfo.actualCarrierId': [
          { required: true, message: '请输入实际承运人统一社会信用代码或证件号码', trigger: 'blur' }
        ],
        'actualCarrierInfo.actualCarrierBusinessLicense': [
          { required: false, message: '请输入实际承运人道路运输经营许可证号', trigger: 'blur' }
        ],

        'insuranceInformation.policyNumber': [
          { required: false, message: '请输入保险单号', trigger: 'blur' }
        ],
        'insuranceInformation.insuranceCompanyCode': [
          { required: false, message: '请输入保险公司代码', trigger: 'change' }
          // { required: false, message: '请输入保险公司代码', trigger: 'blur' }
        ],
        'qrCodeUrl': [
          { required: true, message: '请输入货物运单二维码链接地址', trigger: 'blur' }
        ],
        'remark': [
          { required: false, message: '请输入备注', trigger: 'blur' }
        ]

      },


      // 字典值
      licenseColorOptions: [],
      goodsTypeOptions: []
    };
  },

  created() {
    // 车牌颜色
    this.getDicts('licenseColor').then(response => {
      this.licenseColorOptions = response.data;
    });
    // 货物类型
    this.getDicts('goodsType').then(response => {
      this.goodsTypeOptions = response.data;
    });
  },
  methods: {
    onSubmit() {
      this.$refs['mform'].validate((valid) => {
        if (valid) {
          this.loading = true;
          commonDslyReport(this.mform).then(res => {
            console.log(res);
            this.loading = false;
            if (res.data.code === 1001) {
              this.msgSuccess(res.data.msg);
            } else {
              this.msgError(res.data.msg);
            }
          }).catch(err => {
            console.log(err);
            this.loading = false;
          });
        } else {
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs['mform'].resetFields();
    }
  }
};
</script>

<style lang="scss" scoped>
.el-input-number ::v-deep.el-input__inner {
  text-align: left;
}
</style>

