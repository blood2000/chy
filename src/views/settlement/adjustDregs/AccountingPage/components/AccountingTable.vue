<template>
  <div>
    <el-table
      :data="list"
      style="width: 100%"
      @select="tabSelecedOne"
      @select-all="tabSelecedAll"
      @header-click="headerClick"
    >
      <el-table-column type="expand">
        <template slot-scope="props">
          <RefactorTable
            :ref="'RefactorTable_'+props.$index"
            :data="props.row.childs"
            :table-columns-config="columns"
            :cb-data="props.row.selectChilds"
            @selection-change="(lists)=>handleSelectionChange(lists, props.row )"
          >
            <template #icStatus="{row}">
              <span>{{ selectDictLabel([
                { 'dictLabel': '未核对', 'dictValue': '0' },
                { 'dictLabel': '已核对', 'dictValue': '1' },
              ], row.icStatus) }}</span>
            </template>
          </RefactorTable>

        </template>
      </el-table-column>

      <el-table-column
        type="selection"
        width="55"
      />

      <template v-for="(item,index) in com">
        <el-table-column
          v-if="item.isShow"
          :key="index"
          :label="item.label"
          :prop="item.prop"
        >
          <template slot-scope="scope">

            <div v-if="item.prop === 'edit'">
              <el-button
                v-hasPermi="['transportation:waybillBalanceInfo:batchCheck']"
                size="mini"
                type="text"
                @click="handleTableBtn([scope.row])"
              >核算</el-button>
            </div>

            <span v-else>{{ scope.row[item.prop] }}</span>
          </template>
        </el-table-column>
      </template>


    </el-table>

    <!-- 核算弹窗 -->
    <adjust-dialog ref="AdjustDialog" :open.sync="adjustdialog" :psort="nowSort" :title="'结算审核'" @refresh="()=>{$emit('refresh'); multiple=true }" />
  </div>
</template>



<script>

// 核算弹窗
import AdjustDialog from '../../adjustDialog';

const com = [
//   {
//     'prop': 'companyCode',
//     'isShow': true,
//     'label': '发货企业',
//     'sortNum': 2,
//     'width': 180
//   },
  {
    'prop': 'cardBatchNo',
    'isShow': true,
    'label': '卡批号',
    'sortNum': 2,
    'width': 180
  },
  {
    'label': '调度者名称',
    'prop': 'teamName',
    'isShow': true,
    'sortNum': 3,
    'width': '120',
    'tooltip': true
  },
  {
    'label': '项目',
    'prop': 'projectName',
    'isShow': true,
    'sortNum': 5,
    'width': '120',
    'tooltip': true
  },
  {
    'label': '渣土场',
    'prop': 'ztcName',
    'isShow': true,
    'sortNum': 6,
    'width': '120',
    'tooltip': true
  },
  {
    'label': '运单数量',
    'prop': 'loadNum',
    'isShow': true,
    'sortNum': 7,
    'width': '120',
    'tooltip': true
  },
  {
    'label': '运费结算金额',
    'prop': 'freightAmount',
    'isShow': false,
    'sortNum': 8,
    'width': '120',
    'tooltip': true
  },
  {
    'label': '装车数量',
    'prop': 'loadNum',
    'isShow': true,
    'sortNum': 11,
    'width': '120',
    'tooltip': true
  },
  {
    'label': '实发趟数',
    'prop': 'actualTripsNum',
    'isShow': true,
    'sortNum': 11,
    'width': '120',
    'tooltip': true
  },
  {
    'label': '结算趟数',
    'prop': 'settlementTripsNum',
    'isShow': true,
    'sortNum': 11,
    'width': '120',
    'tooltip': true
  },
  //   {
  //     'label': '运单号',
  //     'prop': 'waybillCods',
  //     'isShow': true,
  //     'sortNum': 11,
  //     'width': '120',
  //     'tooltip': true
  //   },
  //   {
  //     'label': '操作人',
  //     'prop': 'opName',
  //     'isShow': true,
  //     'sortNum': 12,
  //     'width': '120',
  //     'tooltip': true
  //   },
  {
    'prop': 'edit',
    'isShow': true,
    'label': '操作',
    'width': 120,
    'fixed': 'left'
  }
];



export default {
  components: { AdjustDialog },

  props: {
    myData: {
      type: Array,
      default: () => [] ||
        [
          {
            'wayBillCode': 'f2459547a0f7484cbcb1254ffd298539',
            'mainOrderNumber': '2106171345416853',
            'waybillNo': '2106181625296015',
            'deliveryCompany': '彩虹堂建设工程有限公司',
            'orderClient': '贺彩善[17712345678]',
            'isChild': 0,
            'driverName': '何友印',
            'driverPhone': '15606020878',
            'goodsBigType': '1800',
            'licenseNumber': '闽J12356',
            'loadWeight': '1.00',
            'unloadWeight': '1.00',
            'goodsPrice': 0,
            'freightPrice': null,
            'deliveryFeeDeserved': 0,
            'deliveryFeePractical': 0,
            'deliveryCashFee': 0,
            'serviceFee': 0,
            'serviceTaxFee': 0,
            'taxPayment': 0,
            'driverAddFee': 0,
            'driverReductionFee': 0,
            'loadAddress': '广东省深圳市南山区南山区',
            'loadContact': '贺彩善',
            'loadContactPhone': '17712345678',
            'unloadAddress': '福建省福州市台江区中捷大厦(江滨中大道北)中捷金融大厦(建设中)',
            'unloadContact': null,
            'unloadContactPhone': null,
            'isReturn': 1,
            'lastLoadingTime': null,
            'orderTime': '2021-06-17 13:45:41',
            'receiveTime': '2021-06-18 16:25:00',
            'wayBillUpdateTime': '2021-06-18 18:03:40',
            'isApplyMoneyBack': 0,
            'applyMoneyBackRemark': null,
            'taxFreeFee': 0,
            'taxFee': 0,
            'stowageStatus': '2',
            'weight': null,
            'teamLeaderName': '15859109123',
            'teamName': '测试小强调度',
            'teamUserCode': '50fed9612cee4ea6bde0393f2ed93d8e',
            'icStatus': '0',
            'shipperCopeFee': '0.00',
            'projectName': '南山智城',
            'ztcName': '垃圾渣土场'
          },
          {
            'wayBillCode': '18e8f1541d414a8f8e9a795a35e9068d',
            'mainOrderNumber': '2106171345416853',
            'waybillNo': '2106171727088541',
            'deliveryCompany': '彩虹堂建设工程有限公司',
            'orderClient': '贺彩善[17712345678]',
            'isChild': 0,
            'driverName': '何友印',
            'driverPhone': '15606020878',
            'goodsBigType': '1800',
            'licenseNumber': '闽AQ7001',
            'loadWeight': '1.00',
            'unloadWeight': '1.00',
            'goodsPrice': 0,
            'freightPrice': null,
            'deliveryFeeDeserved': 0,
            'deliveryFeePractical': 0,
            'deliveryCashFee': 0,
            'serviceFee': 0,
            'serviceTaxFee': 0,
            'taxPayment': 0,
            'driverAddFee': 0,
            'driverReductionFee': 0,
            'loadAddress': '广东省深圳市南山区南山区',
            'loadContact': '贺彩善',
            'loadContactPhone': '17712345678',
            'unloadAddress': '福建省福州市台江区中捷大厦(江滨中大道北)中捷金融大厦(建设中)',
            'unloadContact': null,
            'unloadContactPhone': null,
            'isReturn': 1,
            'lastLoadingTime': null,
            'orderTime': '2021-06-17 13:45:41',
            'receiveTime': '2021-06-17 17:27:00',
            'wayBillUpdateTime': '2021-06-17 17:57:27',
            'isApplyMoneyBack': 0,
            'applyMoneyBackRemark': null,
            'taxFreeFee': 0,
            'taxFee': 0,
            'stowageStatus': '2',
            'weight': null,
            'teamLeaderName': '15859109123',
            'teamName': '测试小强调度',
            'teamUserCode': '50fed9612cee4ea6bde0393f2ed93d8e',
            'icStatus': '0',
            'shipperCopeFee': '0.00',
            'projectName': '南山智城',
            'ztcName': '麻药'
          },
          {
            'wayBillCode': 'c5fc3080d8604c719387436873175190',
            'mainOrderNumber': '2106171345416853',
            'waybillNo': '2106171641337033',
            'deliveryCompany': '彩虹堂建设工程有限公司',
            'orderClient': '贺彩善[17712345678]',
            'isChild': 0,
            'driverName': '何友印',
            'driverPhone': '15606020878',
            'goodsBigType': '1800',
            'licenseNumber': '闽J12356',
            'loadWeight': '1.00',
            'unloadWeight': '1.00',
            'goodsPrice': 0,
            'freightPrice': null,
            'deliveryFeeDeserved': 0,
            'deliveryFeePractical': 0,
            'deliveryCashFee': 0,
            'serviceFee': 0,
            'serviceTaxFee': 0,
            'taxPayment': 0,
            'driverAddFee': 0,
            'driverReductionFee': 0,
            'loadAddress': '广东省深圳市南山区南山区',
            'loadContact': '贺彩善',
            'loadContactPhone': '17712345678',
            'unloadAddress': '福建省福州市台江区中捷大厦(江滨中大道北)中捷金融大厦(建设中)',
            'unloadContact': null,
            'unloadContactPhone': null,
            'isReturn': 1,
            'lastLoadingTime': null,
            'orderTime': '2021-06-17 13:45:41',
            'receiveTime': '2021-06-17 16:41:00',
            'wayBillUpdateTime': '2021-06-17 20:52:06',
            'isApplyMoneyBack': 0,
            'applyMoneyBackRemark': null,
            'taxFreeFee': 0,
            'taxFee': 0,
            'stowageStatus': '2',
            'weight': null,
            'teamLeaderName': '15859109123',
            'teamName': '测试小强调度',
            'teamUserCode': '50fed9612cee4ea6bde0393f2ed93d8e',
            'icStatus': '0',
            'shipperCopeFee': '0.00',
            'projectName': '南山智城',
            'ztcName': '麻药'
          },
          {
            'wayBillCode': '992052d0f38948deb08257cae688feba',
            'mainOrderNumber': '2106171345416853',
            'waybillNo': '2106171628295785',
            'deliveryCompany': '彩虹堂建设工程有限公司',
            'orderClient': '贺彩善[17712345678]',
            'isChild': 0,
            'driverName': '何友印',
            'driverPhone': '15606020878',
            'goodsBigType': '1800',
            'licenseNumber': '闽AQ7001',
            'loadWeight': '1.00',
            'unloadWeight': '1.00',
            'goodsPrice': 0,
            'freightPrice': null,
            'deliveryFeeDeserved': 0,
            'deliveryFeePractical': 0,
            'deliveryCashFee': 0,
            'serviceFee': 0,
            'serviceTaxFee': 0,
            'taxPayment': 0,
            'driverAddFee': 0,
            'driverReductionFee': 0,
            'loadAddress': '广东省深圳市南山区南山区',
            'loadContact': '贺彩善',
            'loadContactPhone': '17712345678',
            'unloadAddress': '福建省福州市台江区中捷大厦(江滨中大道北)中捷金融大厦(建设中)',
            'unloadContact': null,
            'unloadContactPhone': null,
            'isReturn': 1,
            'lastLoadingTime': null,
            'orderTime': '2021-06-17 13:45:41',
            'receiveTime': '2021-06-17 16:28:00',
            'wayBillUpdateTime': '2021-06-17 16:34:25',
            'isApplyMoneyBack': 0,
            'applyMoneyBackRemark': null,
            'taxFreeFee': 0,
            'taxFee': 0,
            'stowageStatus': '2',
            'weight': null,
            'teamLeaderName': '15859109123',
            'teamName': '测试小强调度',
            'teamUserCode': '50fed9612cee4ea6bde0393f2ed93d8e',
            'icStatus': '0',
            'shipperCopeFee': '0.00',
            'projectName': '南山智城',
            'ztcName': '麻药'
          },
          {
            'wayBillCode': 'a34e19b4fd2d4446b48b9824b72cba0d',
            'mainOrderNumber': '2106171345416853',
            'waybillNo': '2106171346078760',
            'deliveryCompany': '彩虹堂建设工程有限公司',
            'orderClient': '贺彩善[17712345678]',
            'isChild': 0,
            'driverName': '何友印',
            'driverPhone': '15606020878',
            'goodsBigType': '1800',
            'licenseNumber': '闽AQ7001',
            'loadWeight': '1.00',
            'unloadWeight': '1.00',
            'goodsPrice': 0,
            'freightPrice': null,
            'deliveryFeeDeserved': 0,
            'deliveryFeePractical': 0,
            'deliveryCashFee': 0,
            'serviceFee': 0,
            'serviceTaxFee': 0,
            'taxPayment': 0,
            'driverAddFee': 0,
            'driverReductionFee': 0,
            'loadAddress': '广东省深圳市南山区南山区',
            'loadContact': '贺彩善',
            'loadContactPhone': '17712345678',
            'unloadAddress': '福建省福州市台江区中捷大厦(江滨中大道北)中捷金融大厦(建设中)',
            'unloadContact': null,
            'unloadContactPhone': null,
            'isReturn': 1,
            'lastLoadingTime': null,
            'orderTime': '2021-06-17 13:45:41',
            'receiveTime': '2021-06-17 13:46:00',
            'wayBillUpdateTime': '2021-06-17 13:53:21',
            'isApplyMoneyBack': 0,
            'applyMoneyBackRemark': null,
            'taxFreeFee': 0,
            'taxFee': 0,
            'stowageStatus': '2',
            'weight': null,
            'teamLeaderName': '15859109123',
            'teamName': '测试小强调度',
            'teamUserCode': '50fed9612cee4ea6bde0393f2ed93d8e',
            'icStatus': '0',
            'shipperCopeFee': '0.00',
            'projectName': '南山智城',
            'ztcName': '麻药'
          },
          {
            'wayBillCode': '9d9b750365ce4aa483975373ffa03c03',
            'mainOrderNumber': '2106161053344262',
            'waybillNo': '2106162014585905',
            'deliveryCompany': '彩虹堂建设工程有限公司',
            'orderClient': '贺彩善[17712345678]',
            'isChild': 0,
            'driverName': '何友印',
            'driverPhone': '15606020878',
            'goodsBigType': '1800',
            'licenseNumber': '闽J12356',
            'loadWeight': '1.00',
            'unloadWeight': '1.00',
            'goodsPrice': 0,
            'freightPrice': null,
            'deliveryFeeDeserved': 0,
            'deliveryFeePractical': 0,
            'deliveryCashFee': 0,
            'serviceFee': 0,
            'serviceTaxFee': 0,
            'taxPayment': 0,
            'driverAddFee': 0,
            'driverReductionFee': 0,
            'loadAddress': '福建省福州市晋安区谢记莆田卤面',
            'loadContact': '贺彩善',
            'loadContactPhone': '17712345678',
            'unloadAddress': '福建省福州市台江区中捷大厦(江滨中大道北)中捷金融大厦(建设中)',
            'unloadContact': null,
            'unloadContactPhone': null,
            'isReturn': 1,
            'lastLoadingTime': null,
            'orderTime': '2021-06-16 10:53:34',
            'receiveTime': '2021-06-16 20:14:00',
            'wayBillUpdateTime': '2021-06-16 20:26:31',
            'isApplyMoneyBack': 0,
            'applyMoneyBackRemark': null,
            'taxFreeFee': 0,
            'taxFee': 0,
            'stowageStatus': '2',
            'weight': null,
            'teamLeaderName': '18912345678',
            'teamName': '钓鱼台',
            'teamUserCode': '48afcf3384984445a10dd631094139ef',
            'icStatus': '0',
            'shipperCopeFee': '0.00',
            'projectName': '测统计项目2',
            'ztcName': '麻药'
          },
          {
            'wayBillCode': 'f77f489c79f04ac5bf5a036e1ca7d470',
            'mainOrderNumber': '2106161141191013',
            'waybillNo': '2106161149358864',
            'deliveryCompany': '渣土货主公司',
            'orderClient': '渣土货主[15859109601]',
            'isChild': 0,
            'driverName': '测试独立强',
            'driverPhone': '15859109001',
            'goodsBigType': '1800',
            'licenseNumber': '闽AQ8001',
            'loadWeight': '1.00',
            'unloadWeight': '1.00',
            'goodsPrice': 0,
            'freightPrice': null,
            'deliveryFeeDeserved': 0,
            'deliveryFeePractical': 0,
            'deliveryCashFee': 1,
            'serviceFee': 0,
            'serviceTaxFee': 0,
            'taxPayment': 0.06,
            'driverAddFee': 0,
            'driverReductionFee': 0,
            'loadAddress': '福建省福州市晋安区易速递',
            'loadContact': '渣土货主',
            'loadContactPhone': '15859109601',
            'unloadAddress': '福建省福州市台江区江滨中大道鼓山大桥旁富邦总部大楼',
            'unloadContact': null,
            'unloadContactPhone': null,
            'isReturn': 1,
            'lastLoadingTime': null,
            'orderTime': '2021-06-16 11:41:19',
            'receiveTime': '2021-06-16 11:49:00',
            'wayBillUpdateTime': '2021-06-18 11:20:24',
            'isApplyMoneyBack': 1,
            'applyMoneyBackRemark': '1231231231',
            'taxFreeFee': 0,
            'taxFee': 1.06,
            'stowageStatus': '2',
            'weight': null,
            'teamLeaderName': '15859109120',
            'teamName': '测试网商小强调度',
            'teamUserCode': '55221c19f4954853b46dca4a2b481e58',
            'icStatus': '1',
            'shipperCopeFee': '0.00',
            'projectName': '616测试项目1',
            'ztcName': '616测试1'
          },
          {
            'wayBillCode': 'a1a07201595846f1b40d0bb397f5abfe',
            'mainOrderNumber': '2106161053018645',
            'waybillNo': '2106161123552533',
            'deliveryCompany': '彩虹堂建设工程有限公司',
            'orderClient': '贺彩善[17712345678]',
            'isChild': 0,
            'driverName': '何友印',
            'driverPhone': '15606020878',
            'goodsBigType': '1800',
            'licenseNumber': '闽J12356',
            'loadWeight': '1.00',
            'unloadWeight': '1.00',
            'goodsPrice': 0,
            'freightPrice': null,
            'deliveryFeeDeserved': 0,
            'deliveryFeePractical': 0,
            'deliveryCashFee': 0,
            'serviceFee': 0,
            'serviceTaxFee': 0,
            'taxPayment': 0,
            'driverAddFee': 0,
            'driverReductionFee': 0,
            'loadAddress': '福建省福州市仓山区马尾大桥',
            'loadContact': '贺彩善',
            'loadContactPhone': '17712345678',
            'unloadAddress': '福建省福州市台江区台江区鼓山大桥',
            'unloadContact': null,
            'unloadContactPhone': null,
            'isReturn': 1,
            'lastLoadingTime': null,
            'orderTime': '2021-06-16 10:53:01',
            'receiveTime': '2021-06-16 11:23:00',
            'wayBillUpdateTime': '2021-06-16 11:33:59',
            'isApplyMoneyBack': 0,
            'applyMoneyBackRemark': null,
            'taxFreeFee': 0,
            'taxFee': 0,
            'stowageStatus': '2',
            'weight': null,
            'teamLeaderName': '18912345678',
            'teamName': '钓鱼台',
            'teamUserCode': '48afcf3384984445a10dd631094139ef',
            'icStatus': '0',
            'shipperCopeFee': '0.00',
            'projectName': '测试统计项目1',
            'ztcName': '鼓山大桥'
          },
          {
            'wayBillCode': 'c78ce28e383e48e991d8a6095b3b74c2',
            'mainOrderNumber': '2106161053344262',
            'waybillNo': '2106161123299163',
            'deliveryCompany': '彩虹堂建设工程有限公司',
            'orderClient': '贺彩善[17712345678]',
            'isChild': 0,
            'driverName': '何友印',
            'driverPhone': '15606020878',
            'goodsBigType': '1800',
            'licenseNumber': 'jwjwj',
            'loadWeight': '1.00',
            'unloadWeight': '1.00',
            'goodsPrice': 0,
            'freightPrice': null,
            'deliveryFeeDeserved': 0,
            'deliveryFeePractical': 0,
            'deliveryCashFee': 0,
            'serviceFee': 0,
            'serviceTaxFee': 0,
            'taxPayment': 0,
            'driverAddFee': 0,
            'driverReductionFee': 0,
            'loadAddress': '福建省福州市晋安区谢记莆田卤面',
            'loadContact': '贺彩善',
            'loadContactPhone': '17712345678',
            'unloadAddress': '福建省福州市台江区中捷大厦(江滨中大道北)中捷金融大厦(建设中)',
            'unloadContact': null,
            'unloadContactPhone': null,
            'isReturn': 1,
            'lastLoadingTime': null,
            'orderTime': '2021-06-16 10:53:34',
            'receiveTime': '2021-06-16 11:23:00',
            'wayBillUpdateTime': '2021-06-16 11:55:30',
            'isApplyMoneyBack': 0,
            'applyMoneyBackRemark': null,
            'taxFreeFee': 0,
            'taxFee': 0,
            'stowageStatus': '2',
            'weight': null,
            'teamLeaderName': '18912345678',
            'teamName': '钓鱼台',
            'teamUserCode': '48afcf3384984445a10dd631094139ef',
            'icStatus': '0',
            'shipperCopeFee': '0.00',
            'projectName': '测统计项目2',
            'ztcName': '麻药'
          },
          {
            'wayBillCode': '7cd4c38ba09743b1bd5725e9d870c633',
            'mainOrderNumber': '2106161053018645',
            'waybillNo': '2106161102368886',
            'deliveryCompany': '彩虹堂建设工程有限公司',
            'orderClient': '贺彩善[17712345678]',
            'isChild': 0,
            'driverName': '何友印',
            'driverPhone': '15606020878',
            'goodsBigType': '1800',
            'licenseNumber': 'jwjwj',
            'loadWeight': '1.00',
            'unloadWeight': '1.00',
            'goodsPrice': 0,
            'freightPrice': null,
            'deliveryFeeDeserved': 0,
            'deliveryFeePractical': 0,
            'deliveryCashFee': 0,
            'serviceFee': 0,
            'serviceTaxFee': 0,
            'taxPayment': 0,
            'driverAddFee': 0,
            'driverReductionFee': 0,
            'loadAddress': '福建省福州市仓山区马尾大桥',
            'loadContact': '贺彩善',
            'loadContactPhone': '17712345678',
            'unloadAddress': '福建省福州市台江区台江区鼓山大桥',
            'unloadContact': null,
            'unloadContactPhone': null,
            'isReturn': 1,
            'lastLoadingTime': null,
            'orderTime': '2021-06-16 10:53:01',
            'receiveTime': '2021-06-16 11:02:00',
            'wayBillUpdateTime': '2021-06-16 11:10:10',
            'isApplyMoneyBack': 0,
            'applyMoneyBackRemark': null,
            'taxFreeFee': 0,
            'taxFee': 0,
            'stowageStatus': '2',
            'weight': null,
            'teamLeaderName': '18912345678',
            'teamName': '钓鱼台',
            'teamUserCode': '48afcf3384984445a10dd631094139ef',
            'icStatus': '0',
            'shipperCopeFee': '0.00',
            'projectName': '测试统计项目1',
            'ztcName': '鼓山大桥'
          }
        ]
    },
    columns: {
      type: Array,
      default: () => []
    },
    sort: {
      type: String,
      default: 'cardBatchNo'
    }
  },

  data() {
    return {
      com,

      // 弹框数据
      adjustdialog: false,

      selected: [], // 选中外层

      nowSort: this.sort

    };
  },

  computed: {
    // 父过来的数据, 进一步处理
    list() {
      const arr = [];
      const object = {};
      this.myData.forEach(e => {
        const str = e[this.nowSort];
        const array = object[str];
        if (array) {
          array.push(e);
        } else {
          const suibian = [e];
          object[str] = suibian;
        }
      });


      for (const item in object) {
        const obj = {
          freightAmount: 0
        };
        object[item].forEach(ite => {
          obj['freightAmount'] += ite['taxFee'] - 0; // 运费结算金额(取含税价字段)
          obj['teamName'] = ite['teamName']; // 调度者Code
          //   obj['teamCode'] = ite['teamCode']; // 调度者Code

          obj['ztcName'] = ite['ztcName']; // 渣土场（卸货地）
          // obj['land'] = ite['unloadAddress']; // 渣土场（卸货地）
          //   obj['landCode'] = ite['unloadAddressCode']; // 	渣土场（卸货地）Code
          obj['projectName'] = ite['projectName']; // 	项目（装货地）
          obj['cardBatchNo'] = ite['cardBatchNo'] || null; // 	卡批次(初次读卡的时候存在)
          // obj['load'] = ite['loadAddress']; // 	项目（装货地）
        //   obj['loadCode'] = ite['loadAddressCode']; // 	项目（装货地）Code
        });

        obj['loadNum'] = object[item].length; // 装车数量
        obj['actualTripsNum'] = object[item].length; // 实发趟数（次）
        obj['settlementTripsNum'] = object[item].length; // 结算趟数
        obj['waybillCods'] = object[item].map(e => e.wayBillCode); // 	运单CodeIds
        obj['childs'] = object[item];
        obj['selectChilds'] = [];
        obj['$_id'] = this.genID();

        arr.push(obj);
      }

      return arr;
    }

  },

  watch: {
    sort() {
      // console.log(this.sort);
      this.nowSort = this.sort;
      this.isDuo();
    }
  },

  methods: {
    // 选中运单 data = 当前选中的   row = 当前行  this.list
    handleSelectionChange(data, row) {
      const selectChilds = [];
      row.childs.forEach((e, index) => {
        data.forEach(ee => {
          if (e.wayBillCode === ee.wayBillCode) {
            // 选中
            selectChilds.push(index);
          }
        });
      });

      row.selectChilds = selectChilds;

      this.isDuo();
    },
    // 点击单个
    tabSelecedOne(selection, row) {
      let isok = false;
      selection.forEach(e => {
        if (e.$_id === row.$_id) {
          // 找到说明是 选中
          isok = true;
        }
      });
      if (isok) {
        row.selectChilds = row.childs.map((e, index) => index);
      } else {
        row.selectChilds = [];
      }

      this.isDuo();
    },
    // 点击全选
    tabSelecedAll(selection) {
      if (selection.length) {
        selection.forEach(e => {
          e.selectChilds = e.childs.map((_, index) => index);
        });
      } else {
        this.list.forEach(e => {
          e.selectChilds = [];
        });
      }
      this.isDuo();
    },

    // 判断多选
    isDuo() {
      const arr = [];
      this.list.forEach(e => {
        arr.push(e.selectChilds.length > 0);
      });

      this.$emit('ismultiple', arr.some(e => e));
    },

    /** 核算事件 批量核算也是触发这个函数 */
    handleTableBtn(rowArr) {
      const lists = rowArr || this.list;

      this.adjustdialog = true;
      const arr = [];
      lists.forEach(e => {
        // 找出选中的下标
        if (!rowArr) {
          e.selectChilds.forEach(se => {
            arr.push(e.childs[se]);
          });
        } else {
          e.childs.forEach((ee) => {
            arr.push(ee);
          });
        }
      });

      console.log(arr);

      this.$refs.AdjustDialog.setForm(arr);
    },

    /** headerClick **/
    headerClick(column, event) {
      // console.log(column.property);
      this.nowSort = column.property;
    },

    /** 生成随机id */
    genID(length = 5) {
      return Number(Math.random().toString().substr(3, length) + Date.now()).toString(36);
    }


  }
};
</script>

<style>
.demo-table-expand {
  font-size: 0;
}
.demo-table-expand label {
  width: 90px;
  color: #99a9bf;
}
.demo-table-expand .el-form-item {
  margin-right: 0;
  margin-bottom: 0;
  width: 50%;
}
</style>
