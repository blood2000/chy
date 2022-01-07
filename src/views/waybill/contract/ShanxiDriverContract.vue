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
    <!-- @click="print" -->
    <div id="wholecont" class="wholecont-div">

      <h3 id="plat_hetong_title" style="text-indent: 4em;">山西道承信息技术有限公司网络货运平台实际承运电子合同</h3>
      <div class="seria" style="margin-top: 30px;">合同编号：<span id="contract_no">{{ obj.contractNo }}</span></div>
      <!-- <div class="seria">签约地：<span id="contract_no"></span></div> -->
      <!--  -->
      <div class="seria">签约时间：<span id="acreate_time">{{ obj.createTime }}</span></div>
      <div id="first" class="t_num1">网络货运平台方(简称“甲方”)：{{ '山西道承信息技术有限公司' }}</div>

      <div id="first2" class="t_num1">统一社会信用代码：{{ '91149900MA0MUW4H2U' }}</div>
      <!-- <div id="jiafangPhone" class="t_num1">联系电话：{{ obj.branchPhone }}</div> -->
      <div id="jiafangPhone" class="t_num1">住所：{{ '山西转型综合改革示范区学府产业园电商街8号电子商务产业园A座12层、13层、16层易通天下公司众创空间第A081号工位' }}</div>
      <div id="jiafangPhone" class="t_num1">法定代表人：{{ '施联文' }}</div>


      <br>
      <div id="second" class="t_num1">实际承运方(简称“乙方”)：{{ obj.driverName }}</div>
      <div id="identification_number" class="t_num1">身份证号码：{{ obj.driverIdentificationNumber }}</div>
      <div id="driver_license" class="t_num1">驾驶证号码（选填）：{{ obj.driverLicense }}</div>
      <div id="driver_phone" class="t_num1">联系方式：{{ obj.driverPhone }}</div>
      <div id="driver_phone" class="t_num1">车牌号：{{ obj.licenseNumber }}</div>


      <!-- 	<div class="companys-box">
					<div class="company-info company1">
						<p class="row row1" id="ddfirst">法定代表人： </p>
					</div>
					<div class="company-info company2">
						<p class="row row1" id="ddsecond">联系方式： </p>
					</div>
					<div class="clear"></div>
				</div> -->





      <p class="Paragraph">本合同适用于山西道承信息技术有限公司超好运网络货运平台（以下简称“超好运平台”）所有注册认证的司机会员。根据《中华人民共和国民法典》及有关法律法规，为保证双方的合法权益，经甲乙双方协商一致，甲乙双方在自愿、平等、诚信的基础上签订本合同，就甲方委托乙方完成货物实际运输事宜达成如下协议：</p>

      <div class="same-div">
        <h4><b>一、运输概况：</b></h4>
        <h4 class="t-indent2">乙方同意接受甲方委托，提供本次货物运输服务。本次运输详情以超好运平台上实际托运方发布的并由乙方确认接受的货源单及相关运单为准。本次货物运输信息表大概如下：</h4>
        <table width="93%" border="1" bordercolor="#404040" cellspacing="0" cellpadding="0" style="padding: 25px">
          <tbody><tr>
                   <td width="14%"><b>起运地</b></td>
                   <td id="start_address" width="16%">{{ obj.startAddress }}</td>
                   <td width="17%"><b>发货人</b></td>
                   <td id="shipper_name" width="17%">{{ obj.consignor }}</td>
                   <td width="15%"><b>发货人手机</b></td>
                   <td id="shipper_phone" width="17%">{{ obj.consignorPhone }}</td>
                 </tr>
            <tr>
              <td><b>目的地</b></td>
              <td id="end_address">{{ obj.endAddress }}</td>
              <td><b>收货人</b></td>
              <td id="consignee_name">{{ obj.consignee }}</td>
              <td><b>收货人手机</b></td>
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
              <td id="weight">
                {{ obj.stowageStatus == '0' ? fixed(obj.loadWeight) + '吨' : (obj.stowageStatus == '1'? fixed(obj.loadWeight) + '立方': floor(obj.loadWeight, 0) + '车') }}
              </td>
              <td><b>货物描述</b></td>
              <td id="goods_type">{{ obj.goodsName }}</td>
              <!-- <td><b>货值（元）</b></td>
              <td id="goods_total">{{ obj.goodsAmount }}</td> -->
              <td><b>运费金额（元）</b></td>
              <td id="amount">￥{{ floor(obj.deliveryFeeDeserved) }}</td>
            </tr>
            <tr>
              <td><b>签约时间</b></td>
              <td id="create_time">{{ obj.createTime }}</td>
              <td><b>装车时间</b></td>
              <td id="last_loading_time">{{ obj.loadTime }}</td>
              <td><b>是否开票</b></td>
              <td>{{ obj.isInvoice === 1? '否':'是' }}</td>
            </tr>
            <tr>
              <td><b>备注</b></td>
              <td colspan="5">{{ obj.orderRemark || '' }}</td>
            </tr>
          </tbody></table>
      </div>


      <div class="same-div">
        <h4><b>二、运输要求</b></h4>
        <h4 class="t-indent2">1、本次运输采用：汽车公路运输。</h4>
        <h4 class="t-indent2">2、乙方作为实际承运人应保证本人驾车技术良好且车辆状况良好，完全可满足本次货物运输需求。</h4>
        <h4 class="t-indent2">3、使用车辆、容器应做到外观整洁，车体、容器内干净无污染物、残留物。</h4>
        <h4 class="t-indent2">4、乙方应按运单约定，在约定的时限内，将货物送达到甲方指定的送达地。</h4>
      </div>
      <div class="same-div">
        <h4><b>三、费用结算</b></h4>
        <h4 class="t-indent2">1、本次运输实际运费以卸货时收货人测算的运输单位和数量及既定的计费规则为依据，具体信息以乙方所使用的超好运平台上的页面展示为准。运输单位为：每件/每吨/每千克或其它运单约定的运输单位。</h4>
        <h4 class="t-indent2">2、本次运单所含运费总额未完全支付完毕之前，如订单内容发生变化，甲、乙双方可协商变更未支付运费部分的金额，具体变更情况由双方另行签署补充协议确定。</h4>
        <h4 class="t-indent2">3、若本次运输费用乙方授权委托他人代为结算收款，则结算期限以甲方和乙方授权委托人另行约定的时限为准。如乙方无授权委托他人结算收款，或无约定结算期限，则结算期限为实际托运方向甲方支付运输费用后30天内。</h4>
        <h4 class="t-indent2">4、若因托运人或收货人进行费用结算时，因错误确认收货数量、错误确认运费金额或其他各种原因等，导致乙方实收运费金额少于乙方应该收到的运费，乙方可向超好运网络货运平台客服进行反馈，并按平台相关规定处理。乙方亦须遵守平台相关规定，如果需要乙方配合进行退款重新核算等，乙方亦应无条件配合。</h4>
        <h4 class="t-indent2">5、在乙方将货物交付收货之前，因托运人要求乙方中止运输、返还货物、变更到达地或将货物交给其他收货人，因此增加的费用由乙方与托运方自行协商确认，增加的费用由乙方直接与托运方结算收款，与甲方无关。</h4>
      </div>
      <div class="same-div">
        <h4><b>四、权责义务</b></h4>
        <h4 class="t-indent2">1、乙方在使用超好运平台承接运输业务时，应遵守国家相关法律法规和超好运平台的各项规定。如乙方利用甲方和超好运平台业务、规定、运营等环节的漏洞进行违法行为，由乙方自行承担法律责任，且如因乙方违法行为给甲方带来损失的，乙方应负责赔偿甲方损失，该损失包括但不限于行政处罚、直接损失、商誉损失、律师费、诉讼费和因举证而产生的各项费用等。</h4>
        <h4 class="t-indent2">2、乙方知悉其个人超好运平台账号密码的重要性，亦清楚本人账号在平台上的各项操作有可能产生法律效力，乙方确保其账号和密码的安全性，其账号下的所有操作均视为本人行为。</h4>
        <h4 class="t-indent2">3、乙方按运单约定核对清点并接收待运输的货物后，视为运输义务的开始、保管责任的转移。乙方将货物送至运单指定地点并在超好运APP上提交装卸货凭证完成卸货操作后，如收货人或托运方在超好运APP上确认卸货或未在超好运平台规定时间内对货物数量等提出异议，视为乙方已经按照运输单证的记载和要求交付货物，交付应视为运输义务的终止、保管责任的转移。</h4>
        <h4 class="t-indent2">4、在接受承运货物时，乙方有责任核对所承运的货物与订单信息是否相符，若不相符的，应及时向托运方和甲方反映，若乙方发现有违禁物品的，乙方有权且应该拒绝承运。</h4>
        <h4 class="t-indent2">5、乙方在承接业务时应自行审查所承运货物的运输资质等要求是否与自身条件相匹配，若发现无法匹配的，乙方应该停止接单或终止承运。</h4>
        <h4 class="t-indent2">6、乙方自行承担车辆运营需缴纳的各类费用（包括但不限于承担在运输过程中发生的费用包括燃油费用、驾驶人员工资福利、车辆通行费用、车辆维修费用、交通违章罚款、交通事故赔偿费用等），以及交强险和商业保险，自行承担运输期间发生的交通事故、车辆盗抢、货物差损等责任。</h4>
        <h4 class="t-indent2">7、若乙方在运输过程中使用了甲方提供的某个或多个设备，则乙方在运输工程中负责该设备的保管，如运输途中设备遗失或损毁，则乙方须原价赔偿。</h4>
        <h4 class="t-indent2">8、乙方授权甲方及超好运平台从以下两方面获取该运单项下车辆位置数据：a.通过超好运软件基于GPS和移动网络获取；b.通过第三方机构获取当前位置、轨迹跟踪等定位信息。</h4>
      </div>
      <div class="same-div">
        <h4><b>五、违约责任</b></h4>
        <h4 class="t-indent2">1、运输过程中出现任何货物的灭失、短少、损坏、变质、污染等货物价值减少、灭失等情形，由乙方承担货物毁损、灭失的损害赔偿责任，甲方有权停止支付按照本协议第一条约定本应支付给乙方的运费，该等运费仍不足以补偿乙方需承担的前述损害赔偿责任的，乙方需继续补偿。但乙方证明货物的毁损、灭失是因不可抗力、货物本身的自然性质或者合理损耗等原因造成的，乙方不承担损害赔偿责任。</h4>
        <h4 class="t-indent2">2、乙方没有按时将货物在指定地点交给收货人的，每逾期一天，按当次运单约定运费百分之二的标准向甲方支付违约金。</h4>
        <h4 class="t-indent2">3、乙方如将货物错运到货地点或接货人，应无偿运至合同规定的到货地点或接货人。如果货物逾期到达，乙方应偿付逾期交货的违约金。</h4>
        <h4 class="t-indent2">4、本条约定的乙方应付的损害赔偿及违约金等款项，甲乙双方同意委托超好运平台在应付乙方的其他运费中代扣，具体扣款金额甲乙双方另行协商确定。</h4>

      </div>
      <div class="same-div">
        <h4><b>六、通知与送达</b></h4>
        <h4 class="t-indent2">1、本协议履行过程中，乙方有任何疑问应通过超好运平台或指定客服电话联系甲方解决，甲方应通过本协议约定的联系电话以短信方式通知或通过超好运平台通知乙方。</h4>
        <h4 class="t-indent2">2、甲方的通知自发出之日起第三日视为对乙方送达成功及乙方对通知内容的认可，乙方清楚且承诺所提供的电话为本人有效的联系电话。乙方需要变更联系电话的，应第一时间通过超好运平台操作变更，否则由此产生的不利后果由乙方自行承担。</h4>
      </div>
      <div class="same-div">
        <h4><b>七、其他条款</b></h4>
        <h4 class="t-indent2">1、本合同未尽事宜，双方可另行协商补充约定。 </h4>
        <h4 class="t-indent2">2、本合同在履行过程中发生争议，由双方协商解决，协商不成的，甲乙双方同意由甲方住所地的人民法院管辖审理双方的纠纷或争议。</h4>
        <h4 class="t-indent2">3、本电子协议内容为甲乙双方真实意愿表示，在乙方确认后自动生效，双方均知晓并同意以上协议内容。</h4>
      </div>

      <div class="companys-box">
        <div class="company-info company1">
          <p id="dfirst" class="row row1">甲方： {{ '山西道承信息技术有限公司' }}</p>
          <font id="jiafangspan" style="color:#FFF;font-size:10px">{{ obj.aaaaaaaaaaaaa || '' }}</font>
          <p class="row row2">签章</p>
          <p id="jiafangTime" class="row row2">签约时间：{{ parseTime(obj.createTime, '{y}-{m}-{d} {h}:{i}:{s}') }}</p>
          <img v-if="obj.isDzqzContract === 1" class="seal-img" src="~@/assets/images/icon/icon_seal.png" alt="">
        </div>
        <div class="company-info company2" style="margin-left: 5%">
          <p id="dsecond" class="row row1">乙方： {{ obj.driverName }}</p>
          <font id="yifangspan" style="color:#FFF;font-size:10px">{{ obj.aaaaaaaaaaaaa || '' }}</font>
          <p class="row row2">签章</p>
          <p id="yifangTime" class="row row2">签约时间：{{ obj.aaaaaaaaaaaaa || '' }}</p>
          <img v-if="obj.isDzqzContract === 1" class="seal-img" :src="obj.sealPath" alt="">
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
        extraCss: 'ddc',
        extraHead: '<meta http-equiv="Content-Language" content="zh-cn"/>'
      },
      src: ''
    };
  },
  methods: {

  }
};
</script>

<style lang="scss" scoped>
@import url('../../../assets/styles/contract.scss');
table th, table td {
    border-bottom: 1px solid #000;
    border-right: 1px solid #000;
    font-weight: normal;
}
div .header-top{
  display: none;
}
@page{
    size:  auto;   /* auto is the initial value */
    margin: 3mm;  /* this affects the margin in the printer settings */
  }

  html{
    background-color: #FFFFFF;
    margin: 0;  /* this affects the margin on the html before sending to printer */
  }

  body{
    border: solid 1px blue ;
    margin: 10mm 15mm 10mm 15mm; /* margin you want for the content */
  }
  .seal-img{
    position: relative;
    top: -200px;
    left: 50px;
    height: 200px;
    width: 200px;
  }

  .t-indent2{
    text-indent: 2em;
  }
</style>
