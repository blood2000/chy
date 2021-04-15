<template>
  <div v-if="obj" class="Whole" style="position: relative;">
    <el-button
      v-print="printObj"
      size="mini"
      type="primary"
      icon="el-icon-printer"
      plain
      class="wholecont-print"
    >打印</el-button>

    <div id="wholecont" class="wholecont-div">

      <h3 id="plat_hetong_title" style="text-indent: 4em;">福建大道成物流科技有限公司无车承运平台运输电子合同</h3>
      <div class="seria" style="margin-top: 30px;">合同编号：<span id="contract_no">{{ obj.contractNo }}</span></div>
      <!-- <div class="seria">签约地：<span id="contract_no"></span></div> -->
      <!--  -->
      <div class="seria">签约时间：<span id="acreate_time">{{ obj.createTime }}</span></div>
      <div id="first" class="t_num1">甲方：{{ obj.branchName }}</div>

      <div id="first2" class="t_num1">统一社会信用代码：{{ obj.branchOrganizationCodeNo }}</div>
      <div id="jiafangPhone" class="t_num1">联系电话：{{ obj.branchPhone }}</div>


      <br>
      <div id="second" class="t_num1">乙方：{{ obj.driverName }}</div>
      <div id="license_number" class="t_num1">车牌号码：{{ obj.licenseNumber }}</div>
      <div id="driver_license" class="t_num1">驾驶证号码(选填)：{{ obj.driverLicense }}</div>
      <div id="identification_number" class="t_num1">身份证号码：{{ obj.driverIdentificationNumber }}</div>
      <div id="driver_phone" class="t_num1">联系电话：{{ obj.driverPhone }}</div>


      <!-- 	<div class="companys-box">
					<div class="company-info company1">
						<p class="row row1" id="ddfirst">法定代表人： </p>
					</div>
					<div class="company-info company2">
						<p class="row row1" id="ddsecond">联系方式： </p>
					</div>
					<div class="clear"></div>
				</div> -->





      <p class="Paragraph">本合同适用于福建大道成物流科技有限公司超好运网络货运平台（以下简称“超好运平台”）所有注册认证的司机会员。甲乙双方达成交易，由甲方委托乙方完成货物运输。双方就货物运输事宜达成以下协议以资共守。</p>

      <div class="same-div">
        <h4><b>一、一、	本批货物内容、运输要求及支付方式见超好运平台上由甲方发布并由乙方确认接受的运单。具体内容如下：</b></h4>
        <h4><b>1、货物信息表</b></h4>
        <table width="93%" border="1" bordercolor="#404040" cellspacing="0" cellpadding="0" style="padding: 25px">
          <tbody><tr>
                   <td width="14%"><b>起运地</b></td>
                   <td id="start_address" width="16%">{{ obj.startAddress }}</td>
                   <td width="17%"><b>发货人</b></td>
                   <td id="shipper_name" width="17%">{{ obj.consignor }}</td>
                   <td width="15%"><b>手机</b></td>
                   <td id="shipper_phone" width="17%">{{ obj.consignorPhone }}</td>
                 </tr>
            <tr>
              <td><b>目的地</b></td>
              <td id="end_address">{{ obj.endAddress }}</td>
              <td><b>收货人</b></td>
              <td id="consignee_name">{{ obj.consignee }}</td>
              <td><b>手机</b></td>
              <td id="consignee_phone">{{ obj.consigneePhone }}</td>
            </tr>
            <tr>
              <td><b>实际承运方</b></td>
              <td id="name">{{ obj.driverName }}</td>
              <td><b>联系电话</b></td>
              <td id="mobile">{{ obj.driverPhone }}</td>
              <td><b>货物名称</b></td>
              <td id="coal_type_name">{{ obj.goodsTypeName || obj.goodsBigTypeName }}</td>
            </tr>
            <tr>
              <td><b>计划数量</b></td>
              <td id="weight">{{ obj.loadWeight }}
                吨
              </td>
              <td><b>货物描述</b></td>
              <td id="goods_type">{{ obj.goodsName }}</td>
              <td><b>货值（元）</b></td>
              <td id="goods_total">{{ obj.goodsAmount }}</td>
            </tr>
            <tr>
              <td><b>运费金额（元）</b></td>
              <td id="amount">￥{{ obj.deliveryFeeDeserved }}</td>
              <td><b>合同签订时间</b></td>
              <td id="create_time">{{ obj.createTime }}</td>
              <td><b>货物装车截止时间</b></td>
              <td id="last_loading_time">{{ obj.lastLoadingTime }}</td>
            </tr>
            <tr>
              <td><b>是否开票</b></td>

              <td>{{ obj.aaaaaaaaaaaaa || '是' }}</td>
              <td><b>备注</b></td>
              <td colspan="4">{{ obj.shipperRemark || '' }}</td>
            </tr>
          </tbody></table>
      </div>


      <div class="same-div">
        <h4><b>、在本次运单所含运费总额未完全支付完毕之前，由于订单内容发生变化，甲、
          乙双方可协商变更未支付运费部分的现金部分的数额，具体变更情况由双方另行
          签署补充协议确定。</b></h4>
      </div>
      <div class="same-div">
        <h4><b>三、乙方应按照运单约定，在约定的时限内，将货物送达到甲方指定的送达地。</b></h4>
      </div>
      <div class="same-div">
        <h4><b>四、乙方按运单约定核对清点并接收待运输的货物后，视为运输义务的开始、保
          管责任的转移。乙方将货物送至运单指定地点，收货人未对货物数量提出异议，
          在“超好运”APP上卸货确认的，视为乙方已经按照运输单证的记载和要求交付货
          物，交付应视为运输义务的终止、保管责任的转移。</b></h4>
      </div>
      <div class="same-div">
        <h4><b>五、乙方应保证承运车辆技术状况良好，并能满足所运货物重量的要求。使用的
          车辆、容器应做到外观整洁，车体、容器内干净无污染物、残留物。</b></h4>

      </div>
      <div class="same-div">
        <h4><b>六、如遇车辆发生意外导致货物的灭失、短少、损坏、变质、污染等问题，乙方
          必须第一时间通知甲方，并应尽一切努力减少货物损失。</b></h4>
      </div>
      <div class="same-div">
        <h4><b>七、乙方自行承担车辆运营需缴纳的各类费用（包括但不限于承担在运输过程中
          发生的费用包括燃油费用、驾驶人员工资福利、车辆通行费用、车辆维修费用、
          交通违章罚款、交通事故赔偿费用等），以及交强险和商业保险，自行承担运输
          期间发生的交通事故、车辆盗抢、货物差损等责任。在接受承运货物时，乙方有
          责任核对所承运的货物与订单信息是否相符，若不相符的，应及时向托运方和甲
          方反映；若发现有违禁物品的，应该拒绝承运；乙方在承接业务时应自行审查所
          承运的货物的资质等要求是否与乙方的条件相匹配，若发现无法匹配的，应该停
          止接单或终止承运。</b></h4>
      </div>

      <div class="same-div">
        <h4><b>八、若乙方在运输过程中使用的移动设备由甲方提供，则乙方在运输工程中负责
          该设备的保管。若运输途中设备遗失，则乙方原价赔偿。
        </b></h4>
      </div>
      <div class="same-div">
        <h4><b>九、乙方授权甲方及超好运平台从以下两方面获取该运单项下车辆位置数据：1.
          通过超好运软件基于GPS和移动网络获取；2.通过第三方机构获取当前位置、
          轨迹跟踪等定位信息。</b></h4>
      </div>
      <div class="same-div">
        <h4><b>十、乙方依照本协议约定完成运单后（以托运方在超好运APP上确认卸货为准），
          甲方应按本协议第一条约定的运费及支付方式委托第三方通过“超好运”平台支
          付运费（现金）至乙方“超好运”平台账号。</b></h4>
      </div>
      <div class="same-div">
        <h4><b>十一、每单货物的实际运费以卸货时收货人测算的运输单位（每件/每吨/每千克
          或其它运单约定的运输单位）数量为计算运费的依据，具体计算规则以乙方所使
          用的“超好运”平台上的页面展示为准。若因收货人在收货时输入错误或计算错误
          导致支付到司机平台账号中的运费比实际应该支付给司机的运费少，则乙方司机
          可以先和发货方物流企业沟通申请补款。发货方物流企业向甲方承运公司提出申
          请，待甲方承运公司审核情况属实之后，委托第三方通过“超好运”平台将运费差
          额补充支付到乙方司机的“超好运”平台账号中。同时发货方应将与本次运费差额
          补充支付相关的线上服务费按照发货方与甲方之间的约定支付给甲方。在乙方将
          货物交付收货人之前，因托运人要求乙方中止运输、返还货物、变更到达地或将
          货物交给其他收货人，因此增加的费用由乙方与托运方自行协商确认，增加的费
          用由乙方直接与托运方结算收款。</b></h4>
      </div>
      <div class="same-div">
        <h4><b>十二、违约责任</b></h4>
        <p>1、运输过程中出现任何货物的灭失、短少、损坏、变质、污染等货物价值减少、
          灭失等情形，由乙方承担货物毁损、灭失的损害赔偿责任，甲方有权停止支付按
          照本协议第一条约定本应支付给乙方的运费，该等运费仍不足以补偿乙方需承担
          的前述损害赔偿责任的，乙方需继续补偿。但乙方证明货物的毁损、灭失是因不
          可抗力、货物本身的自然性质或者合理损耗等原因造成的，乙方不承担损害赔偿
          责任。</p>
        <p>2、乙方没有按时将货物在指定地点交给收货人的，每逾期一天，按当次运单约
          定运费百分之二的标准向甲方支付违约金。</p>
        <p>3、乙方如将货物错运到货地点或接货人，应无偿运至合同规定的到货地点或接
          货人。如果货物逾期到达，乙方应偿付逾期交货的违约金。</p>
        <p>4、本条约定的乙方应付的损害赔偿及违约金等款项，甲乙双方同意委托“超好运”
          平台在应付乙方的其他运费中代扣，具体扣款金额甲乙双方另行协商确定。</p>
      </div>
      <div class="same-div">
        <h4><b>十三、通知与送达</b></h4>
        <p>本协议履行过程中，乙方有任何疑问应通过“超好运”平台或超好运指定客服电话
          联系甲方解决，甲方应通过本协议约定的联系电话以短信方式通知或通过“超好
          运”平台通知乙方。甲方的通知自发出之日起第三日视为对乙方送达成功及乙方
          对内容的默认，因此请乙方提供本人有效的联系电话。乙方需要变更联系电话的，
          应第一时间通过“超好运”平台操作变更，否则由此产生的不利后果由乙方自行承
          担。</p>
      </div>
      <div class="same-div">
        <h4><b>十四、本合同未尽事宜，双方可另行协商补充约定。</b></h4>
      </div>
      <div class="same-div">
        <h4><b>十五、本合同在履行过程中发生争议，由双方协商解决，协商不成的，甲乙双方
          同意由甲方住所地的人民法院管辖审理双方的纠纷或争议。</b></h4>
      </div>
      <div class="same-div">
        <h4><b>十六、本电子协议内容为甲乙双方真实意愿表示，在乙方确认后自动生效，双方
          均知晓并同意以上协议内容。</b></h4>
      </div>
      <div class="companys-box">
        <div class="company-info company1">
          <p id="dfirst" class="row row1">甲方签字： {{ obj.branchName }}</p>
          <font id="jiafangspan" style="color:#FFF;font-size:10px">{{ obj.aaaaaaaaaaaaa || '' }}</font>
          <p class="row row2">(签章)</p>
          <p id="jiafangTime" class="row row2">时间：{{ obj.aaaaaaaaaaaaa || '' }}</p>
        </div>
        <div class="company-info company2" style="margin-left: 5%">
          <p id="dsecond" class="row row1">乙方签字： {{ obj.driverName }}</p>
          <font id="yifangspan" style="color:#FFF;font-size:10px">{{ obj.aaaaaaaaaaaaa || '' }}</font>
          <p class="row row2">(签章)</p>
          <p id="yifangTime" class="row row2">时间：{{ obj.aaaaaaaaaaaaa || '' }}</p>
        </div>
        <div class="clear" />
      </div>

      <!-- 公司章 -->
    </div>

  </div>
</template>

<script>
export default {
  name: 'DriverContract',
  props: {
    obj: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      printObj: {
        id: 'wholecont',
        popTitle: '福建大道成物流科技有限公司',
        extraCss: '',
        extraHead: '<meta http-equiv="Content-Language" content="zh-cn"/>'
      }
    };
  }
};
</script>

<style lang="scss" scoped>
@import url('../../../assets/styles/contract.scss');
</style>
