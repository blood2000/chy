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
      <div class="seria">签约时间：<span id="acreate_time">{{ obj.createTime }}</span></div>
      <div id="first" class="t_num1">托运方(简称甲方)：{{ obj.shipmentCompanyName }}</div>
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
      <div id="second" class="t_num1">承运方(简称乙方)：{{ obj.branchName }}</div>
      <div class="t_num1">统一社会信用代码：{{ obj.branchOrganizationCodeNo }}</div>
      <div class="t_num1">住所：{{ obj.branchArea }}</div>
      <div class="t_num1">法定代表人：{{ obj.branchArtificialName }}</div>
      <!-- 	<div class="companys-box">
					<div class="company-info company1">
						<p class="row row1" id="ddfirst">法定代表人： </p>
					</div>
					<div class="company-info company2">
						<p class="row row1" id="ddsecond">联系方式： </p>
					</div>
					<div class="clear"></div>
				</div> -->
      <p class="Paragraph">根据《中华人民共和国合同法》及有关法律、法规的规定，为保证双方的合法权益，经甲乙双方协商一致，甲乙双方在自愿、平等、诚信的基础上签订本合同，以便双方共同遵守，本合同适用于福建大道成物流科技有限公司超好运网络货运平台（以下简称“超好运平台”）所有注册认证的货主会员。</p>
      <div class="same-div">
        <h4><b>一、	乙方同意接受甲方委托，提供货物运输服务。货物信息表如下：</b></h4>
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
              <td id="amount">￥{{ obj.shipperCopeFee }}</td>
              <td><b>合同签订时间</b></td>
              <td id="create_time">{{ obj.createTime }}</td>
              <td><b>货物装车截止时间</b></td>
              <td id="last_loading_time">{{ obj.lastLoadingTime }}</td>
            </tr>
            <tr>
              <td><b>是否开票</b></td>

              <td>{{ '是' }}</td>
              <td><b>备注</b></td>
              <td colspan="4">{{ obj.shipperRemark }}</td>
            </tr>
          </tbody></table>
      </div>
      <div class="same-div">
        <h4><b>二、运输方式：汽车公路运输。</b></h4>











      </div>
      <div class="same-div">
        <h4><b>三、货物包装：甲方指定发货人须按照国家相关规定的标准进行包装；没有统一规定包装标准的，应根据保证货物运输安全的原则进行包装，不得在包装内私自夹带危险品和国家有关规定明令禁止托运的货物，以及与所发布货运信息不相符的货物，甲方保证所托运的货物不属于国家违禁品。</b></h4>










      </div>
      <div class="same-div">
        <h4><b>四、运输期限：乙方应当在运单约定期限内将货物安全运输到约定地点。</b></h4>



      </div>
      <div class="same-div">
        <h4><b style="color: red;">五、运费支付：甲方同意最迟不晚于发布运单之前，先向超好运平台指定的账户缴存不少于本单运费的预付运费和预付服务费。甲方在确认运单完成后，乙方委托超好运平台按照运单约定将甲方已预先缴纳的运费及服务费支付给乙方，乙方每笔运单收取甲方该笔运单运费的%作为服务费。具体的操作流程及操作规则以超好运平台规定的流程为准。</b></h4>










      </div>
      <div class="same-div">
        <h4><b>六、发票</b></h4>

        <p>1、甲方支付运费及服务费后，乙方需向甲方提供等额的税率为9%的运输费增值税专用发票和等额的税率为6%的服务费增值税专用发票。若税务部门调整税率标准，乙方另行通知甲方调整后的税率。</p>
        <p>2、乙方每月10日前与甲方对上月已完结的运单进行对账，核对无误后，乙方根据甲方的要求以运单为核算单位开具增值税专用发票。</p>
        <p>3、乙方只能按照国家规定在运单符合开具增值税专用发票条件下开具，若由于甲方原因导致运单不符合开具增值税专用发票要求的，乙方有权拒绝开具相应的发票。</p>
      </div>
      <div class="same-div">
        <h4><b>七、运输义务与保管责任：甲方将待运输的货物装载到运输车辆上，乙方按运单约定核对清点货物数量并接收，视为运输义务的开始、保管责任的转移。乙方将货物送至运单指定地点，收货人未对货物数量提出异议，在超好运APP上做卸货确认，视为乙方已经按照运输单证的记载和要求交付货物，交付应视为运输义务的终止、保管责任的转移。乙方不承担在装货、卸货过程中的货物运输、货物安全、场地安全等一切责任。</b></h4>


      </div>
      <div class="same-div">
        <h4><b>八、双方权利义务</b></h4>
        <p>1.甲方需自行在“超好运”平台上发布运单，乙方将根据甲方发布的运单信息组织司机前往运单指定的装货地。甲方应遵守"超好运"平台规则，不得在未告知“超好运”平台的前提下，以任何形式代替司机或以司机的名义进行平台操作。</p>
        <p>2.甲方发货人员应当在发货地货物装载之前配合乙方确认货物的数量及价值，完成货物及单据凭证的交接工作。</p>
        <p>3.乙方应按照运单约定，按时将货物送达至甲方指定的收货地。</p>
        <p>4.乙方应根据承运货物的需要，按货物的不同特性，提供具备合法营运资格的，技术状况良好、经济适用的车辆，并能满足所运货物贸易的要求。</p>
        <p>5.除了按照合同支付运费及服务费外，甲方不承担在运输过程中发生的费用包括燃油费用、驾驶人员工资福利、车辆通行费用、车辆维修费用、交通违章罚款、交通事故赔偿费用等。</p>
        <p>6.在乙方将货物交付收货人之前，甲方可要求乙方中止运输、返还货物、变更到达地或将货物交给其他收货人，因此增加的费用由甲方与司机自行协商确认，无法达成一致意见的，按照实际产生的费用及造成的损失进行结算。</p>
        <p>7.为确保承运货物安全，乙方已向保险公司投保货运保险，若因意外事件造成货物损失由保险公司直接向甲方理赔，若由于刑事犯罪行为造成甲方货物损失的，由乙方协助报案处理，乙方不承担赔偿责任。</p>
        <p>8.甲方应当按照本合同约定标准和时间向乙方支付运费和服务费。</p>
        <p>9.乙方有权根据国家相关政策的变化调整上述条款中的服务费比例，但应当提前五个工作日以书面形式告知甲方。甲方若有异议应当在收到书面通知后的三个工作日内(下称"反馈期间”)给予乙方反馈，不反馈或逾期反馈则视为甲方同意该调整。自双方签署补充合同之日起或反馈期间届满之日起，甲乙双方间执行调整后的服务费比例。</p>
        <p>10.在装货、卸货、交货等过程中发生的任何货损均与乙方无关，由甲方自行承担或向责任人追责。</p>
        <p>11.甲方在超好运平台发布非公开货源或虽发布为公开货源但实际上为非公开货源，包括但不限于甲方自己或通过信息部及其他渠道推荐、指定实际承运人的，在运输过程中若因实际承运人资质存在瑕疵、车辆超载、超限、超速、车辆发生事故、货物毁损、灭失、短少等产生的任何纠纷及损失，皆由甲方负责处理井承担相应的法律责任，乙方仅提供必要的协助。</p>
      </div>
      <div class="same-div">
        <h4><b>十、违约责任</b></h4>

        <p>1.乙方通过"超好运"平台接收甲方所发布的运单，若甲方发布虚假、错误运单，
          导致乙方无法履行本合同项下义务的，乙方不承担违约责任。因甲方发布虚假、
          错误运单，导致乙方受有损失的，甲方应承担赔偿责任。</p>
        <p>2.乙方没有按时将货物在指定地点交给收货人的，每逾期一天，按当次运单约定
          运费万分之二的标准向甲方支付违约金，因自然灾害等不可抗力导致的迟延交货
          和非乙方及实际承运人（司机）原因导致的交通事故致使乙方延期交货的情况除
          外。同时，甲乙双方协商一致确认，若乙方在实际运输过程中遭遇临时性的、突
          发性的交通堵塞，经乙方提交相关证据证明后，甲方同意放弃向乙方追究迟延交
          货的违约责任和上述违约金条款约定的求偿权。</p>
        <p>3.乙方如将货物错运到货地点或接货人，应无偿运至合同规定的到货地点或接货
          人。如果货物因前述乙方过错逾期到达，乙方应偿付逾期交货的违约金。</p>
        <p>4.甲方应严格遵守道路安全相关的法律、法规及规章，不得指使、强令要求实际承运人超载、超限运输，对于实际承运人要求超载、超限运输的应当拒绝，否则由此产生的相关纠纷由甲方自行解决，相应的法律责任由甲方自行承担，与乙方无关，乙方仅提供必要的协助。若因此给乙方造成经济损失的，甲方应承担全部赔偿责任。</p>
        <p>5.甲方托运的货物到达目的地后，甲方应当按照超好运平台操作流程与操作规则及时在超好运平台上确认或签收运单，若自实际承运人已实际卸货签到或乙方有充分理由认为运输已完成之日起24个小时内，甲方未能完成确认或签收的，应视为相应运输己完成，甲方应按本合同约定及时向乙方支付运费及服务费(如有)，乙方亦有权直接扣划相应的运费及服务费。若甲方在经乙方催告后48个小时内仍未完成确认或签收，则视为甲方逾期，每逾期一天，甲方应自实际承运人已实际卸货签到或乙方有充分理由认为运输已完成之日起按相应运单约定运费的日万分之二的标准向乙方支付违约金，逾期超过30日的，乙方有权单方解除本合同并要求甲方按照相应运单约定运费总额的20%承担相应违约责任。</p>

      </div>
      <div class="same-div">
        <h4><b>十一、通知</b></h4>
        <p>甲乙双方按照本合同记载的住所地通过EMS或顺丰快递方式邮寄发出书面通知第三日即视为送达对方，或按照双方留存的联系人手机号码发出短信通知即视为已送达对方。若联系信息发生变更，一方需及时以书面形式告知另一方。</p>
      </div>
      <div class="same-div">
        <h4><b>十二、其他</b></h4>

        <p>1.本电子合同一式两份，甲、乙双方各持一份，具有同等法律效力。</p>
        <p>2.本合同自甲乙双方合同签订起生效。</p>
        <p>3.执行合同发生争议时，甲、乙双方应尽可能通过协商解决，协商解决不成的，双方同意由乙方住所地的人民法院管辖审理双方的争议或纠纷。</p>
        <p>4.本合同未尽事宜，双方可另行协商补充约定。补充合同是本合同的附件，与本合同具有同等法律效力。</p>
      </div>
      <div class="companys-box">
        <div class="company-info company1">
          <font id="jiafangspan" style="color:#FFF;font-size:10px">{{ obj.aaaaaaaaaaaaa || '' }}</font>
          <p id="dfirst" class="row row1">甲方： {{ obj.shipmentCompanyName }}</p>
          <p class="row row1">法定代表人或授权代表(签名)：</p>
          <font id="jiafangspan" style="color:#FFF;font-size:10px">&nbsp;</font>
          <p class="row row2">甲方(盖章)：</p>
        </div>
        <div class="company-info company2" style="margin-left: 5%">
          <font id="yifangspan" style="color:#FFF;font-size:10px;bottom: 50px;">{{ obj.aaaaaaaaaaaaa || '' }}</font>
          <p id="dsecond" class="row row1">乙方： {{ obj.branchName }}</p>
          <p class="row row1">法定代表人或授权代表(签名)：</p>
          <font id="yifangspan" style="color:#FFF;font-size:10px">&nbsp;</font>
          <p class="row row2">乙方(盖章)：</p>
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
</style>
