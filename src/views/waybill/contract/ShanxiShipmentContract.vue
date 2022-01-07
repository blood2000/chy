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
      <h3 id="plat_hetong_title" style="text-indent: 4em;">山西道承信息技术有限公司网络货运平台运输委托电子合同</h3>
      <div class="seria" style="margin-top: 30px;">合同编号：<span id="contract_no">{{ obj.contractNo }}</span></div>
      <!-- <div class="seria">签约地：<span id="contract_no"></span></div> -->
      <div class="seria">签约时间：<span id="acreate_time">{{ obj.createTime }}</span></div>
      <br>
      <br>
      <br>
      <div id="first" class="t_num1">托运方(简称“甲方”)：{{ obj.shipmentCompanyName }}</div>
      <div id="business_license_img_no" class="t_num1">统一社会信用代码：{{ obj.shipmentOrganizationCodeNo }}</div>
      <div id="address" class="t_num1">住所：{{ obj.shipmentArea }}</div>
      <div id="faren" class="t_num1">法定代表人：{{ obj.shipmentName }}</div>
      <!-- <div class="companys-box">
					<div class="company-info company1">
						<p class="row row1" id="cdfirst">法定代表人： </p>
					</div>
					<div class="company-info company2">
						<p class="row row1" id="cdsecond">联系方式： </p>
					</div>
					<div class="clear"></div>
				</div> -->
      <br>
      <div id="second" class="t_num1">网络货运平台方(简称“乙方”)：{{ '山西道承信息技术有限公司' }}</div>
      <div class="t_num1">统一社会信用代码：{{ '91149900MA0MUW4H2U' }}</div>
      <div class="t_num1">住所：{{ '山西转型综合改革示范区学府产业园电商街8号电子商务产业园A座12层、13层、16层易通天下公司众创空间第A081号工位' }}</div>
      <div class="t_num1">法定代表人：{{ '施联文' }}</div>
      <!-- 	<div class="companys-box">
					<div class="company-info company1">
						<p class="row row1" id="ddfirst">法定代表人： </p>
					</div>
					<div class="company-info company2">
						<p class="row row1" id="ddsecond">联系方式： </p>
					</div>
					<div class="clear"></div>
				</div> -->
      <br>
      <br>
      <br>
      <p class="Paragraph">本合同适用于山西道承信息技术有限公司超好运网络货运平台（以下简称“超好运平台”）所有注册认证的货主会员。根据《中华人民共和国民法典》及有关法律、法规的规定，为保证双方的合法权益，经甲乙双方协商一致，甲乙双方在自愿、平等、诚信的基础上签订本合同，就甲方委托乙方进行货物运输事宜达成如下协议：</p>
      <br>
      <div class="same-div">
        <h4><b>一、	运输概况</b></h4>
        <p>乙方同意接受甲方委托，提供本次货物运输服务。本次运输详情以超好运平台上甲方发布的货源单并由实际承运方确认接受而生成的相关运单为准。本次货物运输信息表大概如下：</p>
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
              <td id="amount">￥{{ floor(obj.shipperCopeFee) }}</td>
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
              <td colspan="5">{{ obj.orderRemark }}</td>
            </tr>
          </tbody></table>
      </div>
      <br>
      <div class="same-div">
        <h4><b>二、运输要求</b></h4>
        <p>1、本次运输采用：汽车公路运输。</p>
        <p>2、本次运输如无特别说明为不限时运输，但是乙方和/或实际承运人应按安全、高效的原则尽快将货物运达甲方指定的收货地点。</p>
        <p>3、本次运输如有装货时间限制或到货时间限制，甲方应与实际承运人承接运单后向实际承运人再次告知。如有逾期装货或者逾期到货，由甲方自行向实际承运人追索损失，与乙方无关。</p>
        <p>4、本次运输的实际承运人资质和实际承运车辆无特定要求，如有则相应信息应在甲方发布的货源单中注明，在乙方和/或实际承运人到达起运地进行装货前，甲方应进行充分审核，货物装上实际运输车辆离开起运地即视同甲方充分认可实际承运人资质及运输车辆车况等符合本次运输要求。</p>
      </div>
      <br>
      <div class="same-div">
        <h4><b>三、费用结算</b></h4>
        <p>1、本次运输实际运费以卸货时收货人测算的运输单位和数量及既定的计费规则为依据，具体信息以甲方所使用的超好运平台上的页面展示为准。运输单位为：每件/每吨/每千克或其它运单约定的运输单位。</p>
        <p>2、本次运单所含运费总额未完全支付完毕之前，如订单内容发生变化，甲、乙双方可协商变更未支付运费部分的金额，具体变更情况由双方另行签署补充协议确定。</p>
        <p>3、本次运输完成确认流程为，实际承运人将货物送达目的地交付收货人并在超好运平台上完成卸货操作后，甲方应于24小时内完成卸货确认，或假如72小时内甲方未对货物数量质量等情况提出异议亦不进行卸货确认也视同甲方确认实际承运人完成货物运输。</p>
        <p>4、本次运输确认完成后，甲方应于三个工作日内核算并支付本运单的运输费用，乙方授权超好运平台自动核减留存运费并将剩余运费支付给实际承运人。如双方对运费结算期限和留存运费比例另有约定，以双方约定为准，但是结算期限不得超过 六 个自然月。</p>
        <p>5、若因甲方或收货人因错误确认收货数量、错误确认运费金额或其他各种原因等，导致实际结算的运费有误，甲方应无条件配合乙方并按照超好运平台相关规定进行操作，包括但不限于重新核算、二次支付、退款重付等，以确保实际承运人和乙方收到应收的运输费用，甲乙双方或和实际承运人三方另行协商书面约定的除外。</p>
        <p>6、在乙方或实际承运方将货物交付收货之前，因甲方或收货人要求乙方或实际承运人中止运输、返还货物、变更到达地或将货物交给其他收货人，因此增加的费用由甲方与实际承运方自行协商确认，无法达成一致的按实际产生的费用及造成的损失进行结算，由此增加的费用由甲方直接付给实际承运方，与乙方无关。</p>
      </div>
      <br>
      <div class="same-div">
        <h4><b>五、违约责任</b></h4>
        <p>1、乙方没有按时将货物在指定地点交给收货人的，每逾期一天，按当次运单约定运费百分之二的标准向甲方支付违约金。</p>
        <p>2、乙方如将货物错运到货地点或接货人，应无偿运至合同规定的到货地点或接货人。如果货物逾期到达，乙方应偿付逾期交货的违约金。</p>
        <p>3、若甲方在经乙方催告后 48 个小时内仍未完成确认或签收，则视为甲方逾期，每逾期一天，甲方应自实际承运人已实际卸货签到或乙方有充分理由认为运输已完成之日起按相应运单约定运费的日万分之二的标准向乙方支付违约金，逾期超过 30 日的，乙方有权单方解除本合同并要求甲方按照相应运单约定运费总额的20%承担相应违约责任。</p>
      </div>
      <br>
      <div class="same-div">
        <h4><b>六、通知与送达</b></h4>
        <p>1、本协议履行过程中，甲方有任何疑问应通过超好运平台或指定客服电话联系乙方解决，乙方应通过本协议约定的联系电话以短信方式通知或通过超好运平台通知甲方。</p>
        <p>2、乙方的通知自发出之日起第三日视为对甲方送达成功及甲方对通知内容的认可，甲方清楚且承诺所提供的电话为甲方或甲方代表有效的联系电话。甲方需要变更联系电话的，应第一时间通过超好运平台操作变更，否则由此产生的不利后果由甲方自行承担。</p>
        <!-- <h4><b style="color: red;">五、运费支付：甲方同意最迟不晚于发布运单之前，先向超好运平台指定的账户缴存不少于本单运费的预付运费和预付服务费。甲方在确认运单完成后，乙方委托超好运平台按照运单约定将甲方已预先缴纳的运费及服务费支付给乙方，乙方每笔运单收取甲方该笔运单运费的一定比率作为服务费。具体的操作流程及操作规则以超好运平台规定的流程为准。</b></h4> -->
      </div>
      <br>
      <div class="same-div">
        <h4><b>七、其他条款</b></h4>
        <p>1、本合同未尽事宜，双方可另行协商补充约定。 </p>
        <p>2、本合同在履行过程中发生争议，由双方协商解决，协商不成的，甲乙双方同意由乙方住所地的人民法院管辖审理双方的纠纷或争议。</p>
        <p>3、本电子协议内容为甲乙双方真实意愿表示，在实际承运人承接甲方货源单后自动生效，双方均知晓并同意以上协议内容。</p>
      </div>
      <br>
      <br>
      <br>
      <div class="companys-box">
        <div class="company-info company1">
          <font id="jiafangspan" style="color:#FFF;font-size:10px">{{ obj.aaaaaaaaaaaaa || '' }}</font>
          <p id="dfirst" class="row row1">甲方： {{ obj.shipmentCompanyName }}</p>
          <p class="row row1">签章：</p>
          <font id="jiafangspan" style="color:#FFF;font-size:10px">&nbsp;</font>
          <!-- <p class="row row2">签约时间：</p> -->
          <img v-if="obj.isDzqzContract === 1" class="seal-img" :src="obj.sealPath" alt="">
        </div>
        <div class="company-info company2" style="margin-left: 5%">
          <font id="yifangspan" style="color:#FFF;font-size:10px;bottom: 50px;">{{ obj.aaaaaaaaaaaaa || '' }}</font>
          <p id="dsecond" class="branch-name row row1">乙方： {{ '山西道承信息技术有限公司' }}</p>
          <p class="row row1">签章：</p>
          <font id="yifangspan" style="color:#FFF;font-size:10px">&nbsp;</font>
          <!-- <p class="row row2">签约时间：{{ parseTime(obj.createTime, '{y}-{m}-{d} {h}:{i}:{s}') }}</p> -->
          <img v-if="obj.isDzqzContract === 1" class="seal-img" src="~@/assets/images/icon/icon_shanxi.png" alt="">
        </div>
        <div class="clear" />
      </div>

      <!-- 公司章 -->

    </div>

  </div>
</template>

<script>
export default {
  name: 'CompanyContract',
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
table th, table td {
    border-bottom: 1px solid #000;
    border-right: 1px solid #000;
    font-weight: normal;
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
</style>
