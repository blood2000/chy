<template>
  <div v-loading="loading">
    <div>
      <el-form
        ref="queryForm"
        :model="queryParams"
        :inline="true"
        label-width="98px"
      >
        <div class="app-container app-container--search">
          <el-form-item label="卡ID" prop="card16no">
            <el-input
              v-model.trim="queryParams.card16no"
              placeholder="请输入卡ID或读卡获取卡ID"
              clearable
              size="small"
              style="width: 228px"
            />

            <el-button
              class="ml10"
              size="small"
              type="primary"
              plain
              @click="getCardInfo"
            >读卡获取ID</el-button>
          </el-form-item>

          <!-- <el-form-item label="日期" prop="receiveTime">
            <el-date-picker
              v-model.trim="queryParams.receiveTime"
              type="datetimerange"
              unlink-panels
              range-separator="-"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              style="width: 228px"
              value-format="yyyy-MM-dd HH:mm:ss"
              @change="handleQuery"
            />
          </el-form-item> -->
          <el-form-item label="转货日期" prop="loadTime">

            <el-date-picker
              v-model.trim="queryParams.loadTime"
              type="datetime"
              style="width: 228px"
              value-format="yyyy-MM-dd HH:mm:ss"
              placeholder="选择日期时间"
              @change="(value)=>handleQuery(value, 'loadTime')"
            />
          </el-form-item>
          <el-form-item label="卸货日期" prop="unloadTime">

            <el-date-picker
              v-model.trim="queryParams.unloadTime"
              type="datetime"
              style="width: 228px"
              value-format="yyyy-MM-dd HH:mm:ss"
              placeholder="选择日期时间"
              @change="(value)=>handleQuery(value, 'unloadTime')"
            />
          </el-form-item>


          <el-form-item>
            <el-button type="primary" icon="el-icon-search" size="mini">
              搜索
            </el-button>
            <el-button type="primary" plain icon="el-icon-refresh" size="mini">
              重置
            </el-button>
          </el-form-item>
        </div>
      </el-form>
    </div>

    <!-- 迁卡页面 -->
    <div class="app-container">
      <el-row :gutter="10" class="mb8">
        <el-col :span="1.5">
          <el-button
            :type="isConnect ? 'danger' : 'primary'"
            icon="el-icon-turn-off"
            size="mini"
            @click="handlerCarConnect(isConnect)"
          >{{ !isConnect ? "连接本地服务" : "断开本地服务" }}</el-button>
        </el-col>
        <el-col :span="1.5">
          <el-button
            type="success"
            icon="el-icon-mouse"
            size="mini"
            :disabled="!(isConnect && selectedData.length>0)"
            @click="handlerqianka"
          >迁卡</el-button>
        </el-col>

        <el-col :span="1.5" class="fr mr10">
          <el-button
            type="danger"
            icon="el-icon-brush"
            size="mini"
            :disabled="!isConnect"
            @click="handlerCardInit"
          >消卡</el-button>
        </el-col>
      </el-row>


      <el-table
        ref="multipleTable"
        :data="myDatafilter"
        tooltip-effect="dark"
        style="width: 100%"
        :height="540"
        row-key="waybillNo"
      >
        <!-- @selection-change="handleSelectionChange" -->

        <!--

            goodsTypeName: "石头"
            muckyardName: "0906渣一-石头"
            orderCode: "110949797271486aa198a8ff3e64153c"
            waybillCode: "b5d31fea8ba84eaea3c2ec30f4c5ce8b"
            waybillNo: "2110272051340701"

            loadUnloadType: "1001"
            loadUnloadTypeStr: "渣土场"
            loadTime: "2021-10-27 20:51:35"
            unloadTime: "2021-10-27 20:52:34"
            projectName: "100条项目"

             driverName: "测试"
            driverPhone: "15859101001"
            licenseNumber: "闽BQ7801"

       -->
        <el-table-column label="卡批号" width="55" align="center">
          <template slot="header" slot-scope="scope">
            <el-checkbox v-if="scope" v-model="checkAll" :indeterminate="isIndeterminate" @change="handleCheckAllChange" />
          </template>
          <template slot-scope="scope">
            <el-checkbox v-model="scope.row.__isselected" />
          </template>
        </el-table-column>

        <!-- <el-table-column type="selection" width="55" /> -->
        <el-table-column prop="GetCardNo.data" label="卡批号" />
        <el-table-column prop="projectName" label="项目" />

        <el-table-column prop="waybillNo" label="订单号" />

        <el-table-column prop="loadUnloadTypeStr" label="装卸类型" />

        <el-table-column prop="loadTime" label="装货时间" />
        <el-table-column prop="unloadTime" label="卸货时间" />

        <el-table-column prop="address__" label="调度组" />

        <el-table-column prop="driverName" label="司机">
          <template slot-scope="scope">
            {{ scope.row.driverName }}({{ scope.row.driverPhone }})
          </template>
        </el-table-column>

        <el-table-column prop="licenseNumber" label="车牌号" />
        <el-table-column prop="address__" label="发卡人" />
        <el-table-column prop="address__" label="发卡时间">
          <template slot-scope="scope">
            <!-- {{ scope.row.userInfo.issuing_time }} -->
            {{ parseTime(scope.row.userInfo.issuing_time - 0, '{y}-{m}-{d} {h}:{i}:{s}') }}
          </template>
        </el-table-column>
      </el-table>
      <div>数据库:{{ total }} / 卡:{{ carTotal }}</div>
      <div>选中数据: {{ selectedData.length }} 条 </div>

      <!-- 已打款的回单 -->
      <el-dialog v-loading="loading" class="i-adjust" title="迁卡信息" :visible.sync="cardinfoOpen" width="500px" :close-on-click-modal="false" append-to-body>
        <div v-if="cardinfoOpen">
          <div>请换迁入的卡, 本次共抽取 9 条记录</div>

          <div>
            迁往调度:
            <el-select v-model="dispatcher" filterable placeholder="请选择">
              <el-option
                v-for="item in dispatcherOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </div>
          <!-- <div></div> -->
        </div>

        <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="handlerRelocateCard">确 定</el-button>
        </span>
      </el-dialog>
    </div>

    <div v-if="percentage1" class="progress-box">
      <el-alert type="success" :closable="false">
        <div>数据抽取中, {{ percentage }} / {{ selectedData.length }}</div>
        <!-- <el-progress :percentage="percentage1" /> -->
      </el-alert>
    </div>

    <div v-if="percentage2" class="progress-box">
      <el-alert type="success" :closable="false">
        <div>迁卡中, 请勿移动卡片. {{ percentage }} / {{ selectedData.length }}</div>
        <!-- <el-progress :percentage="percentage1" /> -->
      </el-alert>
    </div>
  </div>
</template>
<script>

const daad = [
  {
    'projectName': '100条项目',
    'loadUnloadType': '1001',
    'loadUnloadTypeStr': '渣土场',
    'muckyardName': '0906渣一-石头',
    'loadTime': '2021-10-27 20:51:35',
    'unloadTime': '2021-10-27 20:52:34',
    'waybillCode': 'b5d31fea8ba84eaea3c2ec30f4c5ce8b',
    'waybillNo': '2110272051340701',
    'orderCode': '110949797271486aa198a8ff3e64153c',
    'goodsTypeName': '石头',
    'driverName': '测试',
    'driverPhone': '15859101001',
    'licenseNumber': '闽BQ7801',
    'GetCardNo': {
      'success': true,
      'code': '0000',
      'data': 110030265,
      'source': 'GetCardNo,2,True,B9ED8E0600000000'
    },
    'dataList': [
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110272025198140',
        'projectName': '72731',
        'licenseNumber': '闽BQ7801',
        'driverPhone': '15859101001',
        'fillTime': '1635337520000',
        'signTime': '1635337520000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110272029292976',
        'projectName': '72731',
        'licenseNumber': '闽BQ7801',
        'driverPhone': '15859101001',
        'fillTime': '1635337769000',
        'signTime': '1635337769000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110272030089762',
        'projectName': '72731',
        'licenseNumber': '闽BQ7801',
        'driverPhone': '15859101001',
        'fillTime': '1635337808000',
        'signTime': '1635337808000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110272032106344',
        'projectName': '72731',
        'licenseNumber': '闽BQ7801',
        'driverPhone': '15859101001',
        'fillTime': '1635337931000',
        'signTime': '1635337931000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110272032432975',
        'projectName': '72731',
        'licenseNumber': '闽BQ7801',
        'driverPhone': '15859101001',
        'fillTime': '1635337963000',
        'signTime': '1635337963000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110272033233861',
        'projectName': '72731',
        'licenseNumber': '闽BQ7801',
        'driverPhone': '15859101001',
        'fillTime': '1635338004000',
        'signTime': '1635338004000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110272034162414',
        'projectName': '72731',
        'licenseNumber': '闽BQ7801',
        'driverPhone': '15859101001',
        'fillTime': '1635338061000',
        'signTime': '1635338061000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110272035196738',
        'projectName': '72731',
        'licenseNumber': '闽BQ7801',
        'driverPhone': '15859101001',
        'fillTime': '1635338120000',
        'signTime': '1635338120000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110272037390197',
        'projectName': '72731',
        'licenseNumber': '闽BQ7801',
        'driverPhone': '15859101001',
        'fillTime': '1635338259000',
        'signTime': '1635338259000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110272039198235',
        'projectName': '72731',
        'licenseNumber': '闽BQ7801',
        'driverPhone': '15859101001',
        'fillTime': '1635338359000',
        'signTime': '1635338359000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110272039480730',
        'projectName': '72731',
        'licenseNumber': '闽BQ7801',
        'driverPhone': '15859101001',
        'fillTime': '1635338388000',
        'signTime': '1635338388000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110272040174465',
        'projectName': '72731',
        'licenseNumber': '闽BQ7801',
        'driverPhone': '15859101001',
        'fillTime': '1635338417000',
        'signTime': '1635338417000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110272040461885',
        'projectName': '72731',
        'licenseNumber': '闽BQ7801',
        'driverPhone': '15859101001',
        'fillTime': '1635338446000',
        'signTime': '1635338446000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110272041341258',
        'projectName': '72731',
        'licenseNumber': '闽BQ7801',
        'driverPhone': '15859101001',
        'fillTime': '1635338494000',
        'signTime': '1635338494000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110272043467426',
        'projectName': '72731',
        'licenseNumber': '闽BQ7801',
        'driverPhone': '15859101001',
        'fillTime': '1635338626000',
        'signTime': '1635338626000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110272047431703',
        'projectName': '72731',
        'licenseNumber': '闽BQ7801',
        'driverPhone': '15859101001',
        'fillTime': '1635338864000',
        'signTime': '1635338864000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110272048047399',
        'projectName': '72731',
        'licenseNumber': '闽BQ7801',
        'driverPhone': '15859101001',
        'fillTime': '1635338884000',
        'signTime': '1635338884000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110272049215217',
        'projectName': '72731',
        'licenseNumber': '闽BQ7801',
        'driverPhone': '15859101001',
        'fillTime': '1635338961000',
        'signTime': '1635338961000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110272049574954',
        'projectName': '72731',
        'licenseNumber': '闽BQ7801',
        'driverPhone': '15859101001',
        'fillTime': '1635338997000',
        'signTime': '1635338997000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110272050276492',
        'projectName': '72731',
        'licenseNumber': '闽BQ7801',
        'driverPhone': '15859101001',
        'fillTime': '1635339028000',
        'signTime': '1635339028000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110272051340701',
        'projectName': '72731',
        'licenseNumber': '闽BQ7801',
        'driverPhone': '15859101001',
        'fillTime': '1635339095000',
        'signTime': '1635339095000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110272052410020',
        'projectName': '72731',
        'licenseNumber': '闽BQ7801',
        'driverPhone': '15859101001',
        'fillTime': '1635339161000',
        'signTime': '1635339161000',
        'serialNumber': '157'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110272053296764',
        'projectName': '72731',
        'licenseNumber': '闽BQ7801',
        'driverPhone': '15859101001',
        'fillTime': '1635339209000',
        'signTime': '1635339209000',
        'serialNumber': '157'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110272054113019',
        'projectName': '72731',
        'licenseNumber': '闽BQ7801',
        'driverPhone': '15859101001',
        'fillTime': '1635339251000',
        'signTime': '1635339251000',
        'serialNumber': '157'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110272054456514',
        'projectName': '72731',
        'licenseNumber': '闽BQ7801',
        'driverPhone': '15859101001',
        'fillTime': '1635339285000',
        'signTime': '1635339285000',
        'serialNumber': '157'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110272055408363',
        'projectName': '72731',
        'licenseNumber': '闽BQ7801',
        'driverPhone': '15859101001',
        'fillTime': '1635339341000',
        'signTime': '1635339341000',
        'serialNumber': '157'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110272056176589',
        'projectName': '72731',
        'licenseNumber': '闽BQ7801',
        'driverPhone': '15859101001',
        'fillTime': '1635339377000',
        'signTime': '1635339377000',
        'serialNumber': '157'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110272057075827',
        'projectName': '72731',
        'licenseNumber': '闽BQ7801',
        'driverPhone': '15859101001',
        'fillTime': '1635339428000',
        'signTime': '1635339428000',
        'serialNumber': '157'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110272057414303',
        'projectName': '72731',
        'licenseNumber': '闽BQ7801',
        'driverPhone': '15859101001',
        'fillTime': '1635339462000',
        'signTime': '1635339462000',
        'serialNumber': '157'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110272058166296',
        'projectName': '72731',
        'licenseNumber': '闽BQ7801',
        'driverPhone': '15859101001',
        'fillTime': '1635339496000',
        'signTime': '1635339496000',
        'serialNumber': '157'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110272059298740',
        'projectName': '72731',
        'licenseNumber': '闽BQ7801',
        'driverPhone': '15859101001',
        'fillTime': '1635339569000',
        'signTime': '1635339569000',
        'serialNumber': '157'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110281051189058',
        'projectName': '72731',
        'licenseNumber': '闽BQ7801',
        'driverPhone': '15859101001',
        'fillTime': '1635389479000',
        'signTime': '1635389479000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110281051554780',
        'projectName': '72731',
        'licenseNumber': '闽BQ7801',
        'driverPhone': '15859101001',
        'fillTime': '1635389516000',
        'signTime': '1635389516000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110281052408754',
        'projectName': '72731',
        'licenseNumber': '闽BQ7801',
        'driverPhone': '15859101001',
        'fillTime': '1635389561000',
        'signTime': '1635389561000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110281053294497',
        'projectName': '72731',
        'licenseNumber': '闽BQ7801',
        'driverPhone': '15859101001',
        'fillTime': '1635389610000',
        'signTime': '1635389610000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110281054280667',
        'projectName': '72731',
        'licenseNumber': '闽BQ7801',
        'driverPhone': '15859101001',
        'fillTime': '1635389668000',
        'signTime': '1635389668000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110281055238727',
        'projectName': '72731',
        'licenseNumber': '闽BQ7801',
        'driverPhone': '15859101001',
        'fillTime': '1635389723000',
        'signTime': '1635389723000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110281057017097',
        'projectName': '72731',
        'licenseNumber': '闽BQ7801',
        'driverPhone': '15859101001',
        'fillTime': '1635389821000',
        'signTime': '1635389821000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110281108570566',
        'projectName': '72731',
        'licenseNumber': '闽BQ7802',
        'driverPhone': '15859101002',
        'fillTime': '1635390537000',
        'signTime': '1635390537000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110281109302534',
        'projectName': '72731',
        'licenseNumber': '闽BQ7802',
        'driverPhone': '15859101002',
        'fillTime': '1635390571000',
        'signTime': '1635390571000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110281110236080',
        'projectName': '72731',
        'licenseNumber': '闽BQ7802',
        'driverPhone': '15859101002',
        'fillTime': '1635390623000',
        'signTime': '1635390623000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110281111023618',
        'projectName': '72731',
        'licenseNumber': '闽BQ7802',
        'driverPhone': '15859101002',
        'fillTime': '1635390663000',
        'signTime': '1635390663000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110281111413997',
        'projectName': '72731',
        'licenseNumber': '闽BQ7802',
        'driverPhone': '15859101002',
        'fillTime': '1635390701000',
        'signTime': '1635390701000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110281112342732',
        'projectName': '72731',
        'licenseNumber': '闽BQ7802',
        'driverPhone': '15859101002',
        'fillTime': '1635390754000',
        'signTime': '1635390754000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110281113172977',
        'projectName': '72731',
        'licenseNumber': '闽BQ7802',
        'driverPhone': '15859101002',
        'fillTime': '1635390798000',
        'signTime': '1635390798000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110281114218928',
        'projectName': '72731',
        'licenseNumber': '闽BQ7802',
        'driverPhone': '15859101002',
        'fillTime': '1635390862000',
        'signTime': '1635390862000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110281115212237',
        'projectName': '72731',
        'licenseNumber': '闽BQ7802',
        'driverPhone': '15859101002',
        'fillTime': '1635390921000',
        'signTime': '1635390921000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110281116081769',
        'projectName': '72731',
        'licenseNumber': '闽BQ7802',
        'driverPhone': '15859101002',
        'fillTime': '1635390968000',
        'signTime': '1635390968000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110281116535972',
        'projectName': '72731',
        'licenseNumber': '闽BQ7802',
        'driverPhone': '15859101002',
        'fillTime': '1635391014000',
        'signTime': '1635391014000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110281118048652',
        'projectName': '72731',
        'licenseNumber': '闽BQ7802',
        'driverPhone': '15859101002',
        'fillTime': '1635391085000',
        'signTime': '1635391085000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110281118510090',
        'projectName': '72731',
        'licenseNumber': '闽BQ7802',
        'driverPhone': '15859101002',
        'fillTime': '1635391131000',
        'signTime': '1635391131000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110281119349749',
        'projectName': '72731',
        'licenseNumber': '闽BQ7802',
        'driverPhone': '15859101002',
        'fillTime': '1635391174000',
        'signTime': '1635391174000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110281121126842',
        'projectName': '72731',
        'licenseNumber': '闽BQ7802',
        'driverPhone': '15859101002',
        'fillTime': '1635391272000',
        'signTime': '1635391272000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110281122430352',
        'projectName': '72731',
        'licenseNumber': '闽BQ7802',
        'driverPhone': '15859101002',
        'fillTime': '1635391364000',
        'signTime': '1635391364000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110281125111347',
        'projectName': '72731',
        'licenseNumber': '闽BQ7802',
        'driverPhone': '15859101002',
        'fillTime': '1635391511000',
        'signTime': '1635391511000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110281128237324',
        'projectName': '72731',
        'licenseNumber': '闽BQ7802',
        'driverPhone': '15859101002',
        'fillTime': '1635391703000',
        'signTime': '1635391703000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110281133479295',
        'projectName': '72731',
        'licenseNumber': '闽BQ7802',
        'driverPhone': '15859101002',
        'fillTime': '1635392027000',
        'signTime': '1635392027000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110281134378083',
        'projectName': '72731',
        'licenseNumber': '闽BQ7802',
        'driverPhone': '15859101002',
        'fillTime': '1635392077000',
        'signTime': '1635392077000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110281135251180',
        'projectName': '72731',
        'licenseNumber': '闽BQ7802',
        'driverPhone': '15859101002',
        'fillTime': '1635392125000',
        'signTime': '1635392125000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110281137063354',
        'projectName': '72731',
        'licenseNumber': '闽BQ7802',
        'driverPhone': '15859101002',
        'fillTime': '1635392227000',
        'signTime': '1635392227000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110281335043806',
        'projectName': '72731',
        'licenseNumber': '闽BQ7802',
        'driverPhone': '15859101002',
        'fillTime': '1635399305000',
        'signTime': '1635399305000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110281336000644',
        'projectName': '72731',
        'licenseNumber': '闽BQ7802',
        'driverPhone': '15859101002',
        'fillTime': '1635399361000',
        'signTime': '1635399361000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110281336409518',
        'projectName': '72731',
        'licenseNumber': '闽BQ7802',
        'driverPhone': '15859101002',
        'fillTime': '1635399401000',
        'signTime': '1635399401000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110281337206949',
        'projectName': '72731',
        'licenseNumber': '闽BQ7802',
        'driverPhone': '15859101002',
        'fillTime': '1635399440000',
        'signTime': '1635399440000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110281338015165',
        'projectName': '72731',
        'licenseNumber': '闽BQ7802',
        'driverPhone': '15859101002',
        'fillTime': '1635399481000',
        'signTime': '1635399481000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110281339192280',
        'projectName': '72731',
        'licenseNumber': '闽BQ7802',
        'driverPhone': '15859101002',
        'fillTime': '1635399559000',
        'signTime': '1635399559000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110281340574688',
        'projectName': '72731',
        'licenseNumber': '闽BQ7802',
        'driverPhone': '15859101002',
        'fillTime': '1635399657000',
        'signTime': '1635399657000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110281343492473',
        'projectName': '72731',
        'licenseNumber': '闽BQ7802',
        'driverPhone': '15859101002',
        'fillTime': '1635399830000',
        'signTime': '1635399830000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110281344405858',
        'projectName': '72731',
        'licenseNumber': '闽BQ7802',
        'driverPhone': '15859101002',
        'fillTime': '1635399880000',
        'signTime': '1635399880000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110281345247364',
        'projectName': '72731',
        'licenseNumber': '闽BQ7802',
        'driverPhone': '15859101002',
        'fillTime': '1635399924000',
        'signTime': '1635399924000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110281345597340',
        'projectName': '72731',
        'licenseNumber': '闽BQ7802',
        'driverPhone': '15859101002',
        'fillTime': '1635399959000',
        'signTime': '1635399959000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110281346352346',
        'projectName': '72731',
        'licenseNumber': '闽BQ7802',
        'driverPhone': '15859101002',
        'fillTime': '1635399996000',
        'signTime': '1635399996000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110281347126489',
        'projectName': '72731',
        'licenseNumber': '闽BQ7802',
        'driverPhone': '15859101002',
        'fillTime': '1635400033000',
        'signTime': '1635400033000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110281347490711',
        'projectName': '72731',
        'licenseNumber': '闽BQ7802',
        'driverPhone': '15859101002',
        'fillTime': '1635400069000',
        'signTime': '1635400069000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110281348495361',
        'projectName': '72731',
        'licenseNumber': '闽BQ7802',
        'driverPhone': '15859101002',
        'fillTime': '1635400129000',
        'signTime': '1635400129000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110281349262909',
        'projectName': '72731',
        'licenseNumber': '闽BQ7802',
        'driverPhone': '15859101002',
        'fillTime': '1635400167000',
        'signTime': '1635400167000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110281350047811',
        'projectName': '72731',
        'licenseNumber': '闽BQ7802',
        'driverPhone': '15859101002',
        'fillTime': '1635400204000',
        'signTime': '1635400204000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110281350478056',
        'projectName': '72731',
        'licenseNumber': '闽BQ7802',
        'driverPhone': '15859101002',
        'fillTime': '1635400247000',
        'signTime': '1635400247000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110281351231610',
        'projectName': '72731',
        'licenseNumber': '闽BQ7802',
        'driverPhone': '15859101002',
        'fillTime': '1635400283000',
        'signTime': '1635400283000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110281352072508',
        'projectName': '72731',
        'licenseNumber': '闽BQ7802',
        'driverPhone': '15859101002',
        'fillTime': '1635400327000',
        'signTime': '1635400327000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110281352448066',
        'projectName': '72731',
        'licenseNumber': '闽BQ7802',
        'driverPhone': '15859101002',
        'fillTime': '1635400364000',
        'signTime': '1635400364000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110281353164901',
        'projectName': '72731',
        'licenseNumber': '闽BQ7802',
        'driverPhone': '15859101002',
        'fillTime': '1635400396000',
        'signTime': '1635400396000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110281353548511',
        'projectName': '72731',
        'licenseNumber': '闽BQ7802',
        'driverPhone': '15859101002',
        'fillTime': '1635400434000',
        'signTime': '1635400434000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110281354351601',
        'projectName': '72731',
        'licenseNumber': '闽BQ7802',
        'driverPhone': '15859101002',
        'fillTime': '1635400475000',
        'signTime': '1635400475000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110281355096274',
        'projectName': '72731',
        'licenseNumber': '闽BQ7802',
        'driverPhone': '15859101002',
        'fillTime': '1635400509000',
        'signTime': '1635400509000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110281355520702',
        'projectName': '72731',
        'licenseNumber': '闽BQ7802',
        'driverPhone': '15859101002',
        'fillTime': '1635400552000',
        'signTime': '1635400552000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110281356280861',
        'projectName': '72731',
        'licenseNumber': '闽BQ7802',
        'driverPhone': '15859101002',
        'fillTime': '1635400588000',
        'signTime': '1635400588000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110281357327097',
        'projectName': '72731',
        'licenseNumber': '闽BQ7802',
        'driverPhone': '15859101002',
        'fillTime': '1635400652000',
        'signTime': '1635400652000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110281358093255',
        'projectName': '72731',
        'licenseNumber': '闽BQ7802',
        'driverPhone': '15859101002',
        'fillTime': '1635400689000',
        'signTime': '1635400689000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110281359246951',
        'projectName': '72731',
        'licenseNumber': '闽BQ7802',
        'driverPhone': '15859101002',
        'fillTime': '1635400764000',
        'signTime': '1635400764000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110281400052786',
        'projectName': '72731',
        'licenseNumber': '闽BQ7802',
        'driverPhone': '15859101002',
        'fillTime': '1635400805000',
        'signTime': '1635400805000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110281400585004',
        'projectName': '72731',
        'licenseNumber': '闽BQ7802',
        'driverPhone': '15859101002',
        'fillTime': '1635400859000',
        'signTime': '1635400859000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110281406075289',
        'projectName': '72731',
        'licenseNumber': '闽BQ7802',
        'driverPhone': '15859101002',
        'fillTime': '1635401168000',
        'signTime': '1635401168000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110281407400589',
        'projectName': '72731',
        'licenseNumber': '闽BQ7802',
        'driverPhone': '15859101002',
        'fillTime': '1635401261000',
        'signTime': '1635401261000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110281408246156',
        'projectName': '72731',
        'licenseNumber': '闽BQ7802',
        'driverPhone': '15859101002',
        'fillTime': '1635401304000',
        'signTime': '1635401304000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110281409221479',
        'projectName': '72731',
        'licenseNumber': '闽BQ7802',
        'driverPhone': '15859101002',
        'fillTime': '1635401362000',
        'signTime': '1635401362000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110281410047848',
        'projectName': '72731',
        'licenseNumber': '闽BQ7802',
        'driverPhone': '15859101002',
        'fillTime': '1635401404000',
        'signTime': '1635401404000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110281411005539',
        'projectName': '72731',
        'licenseNumber': '闽BQ7802',
        'driverPhone': '15859101002',
        'fillTime': '1635401460000',
        'signTime': '1635401460000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110281411452612',
        'projectName': '72731',
        'licenseNumber': '闽BQ7802',
        'driverPhone': '15859101002',
        'fillTime': '1635401505000',
        'signTime': '1635401505000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110281413200569',
        'projectName': '72731',
        'licenseNumber': '闽BQ7802',
        'driverPhone': '15859101002',
        'fillTime': '1635401600000',
        'signTime': '1635401600000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110281437396617',
        'projectName': '72731',
        'licenseNumber': '闽BQ7802',
        'driverPhone': '15859101002',
        'fillTime': '1635403059000',
        'signTime': '1635403059000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110281438191109',
        'projectName': '72731',
        'licenseNumber': '闽BQ7802',
        'driverPhone': '15859101002',
        'fillTime': '1635403100000',
        'signTime': '1635403100000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110281438589887',
        'projectName': '72731',
        'licenseNumber': '闽BQ7802',
        'driverPhone': '15859101002',
        'fillTime': '1635403138000',
        'signTime': '1635403138000',
        'serialNumber': '147'
      }
    ],
    'userInfo': {
      'project_id': '72731',
      'team_telno': '15859102001',
      'issuing_telno': '15859109601',
      'issuing_time': '1635403138000',
      'issuing_pc': '1635403844258564',
      'icType': 'r'
    },
    'meter': [
      '1010',
      '2'
    ],
    'userMark': '1000|4|'
  },
  {
    'projectName': '100条项目',
    'loadUnloadType': '1001',
    'loadUnloadTypeStr': '渣土场',
    'muckyardName': '0906渣一-石头',
    'loadTime': '2021-10-28 13:43:50',
    'unloadTime': '2021-10-28 13:44:35',
    'waybillCode': 'a213686f99784e4d92573f3d41ed6376',
    'waybillNo': '2110281343492473',
    'orderCode': '110949797271486aa198a8ff3e64153c',
    'goodsTypeName': '石头',
    'driverName': '李蓝色',
    'driverPhone': '15859101002',
    'licenseNumber': '闽BQ7802',
    'GetCardNo': {
      'success': true,
      'code': '0000',
      'data': 110030265,
      'source': 'GetCardNo,2,True,B9ED8E0600000000'
    },
    'dataList': [
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110272025198140',
        'projectName': '72731',
        'licenseNumber': '闽BQ7801',
        'driverPhone': '15859101001',
        'fillTime': '1635337520000',
        'signTime': '1635337520000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110272029292976',
        'projectName': '72731',
        'licenseNumber': '闽BQ7801',
        'driverPhone': '15859101001',
        'fillTime': '1635337769000',
        'signTime': '1635337769000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110272030089762',
        'projectName': '72731',
        'licenseNumber': '闽BQ7801',
        'driverPhone': '15859101001',
        'fillTime': '1635337808000',
        'signTime': '1635337808000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110272032106344',
        'projectName': '72731',
        'licenseNumber': '闽BQ7801',
        'driverPhone': '15859101001',
        'fillTime': '1635337931000',
        'signTime': '1635337931000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110272032432975',
        'projectName': '72731',
        'licenseNumber': '闽BQ7801',
        'driverPhone': '15859101001',
        'fillTime': '1635337963000',
        'signTime': '1635337963000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110272033233861',
        'projectName': '72731',
        'licenseNumber': '闽BQ7801',
        'driverPhone': '15859101001',
        'fillTime': '1635338004000',
        'signTime': '1635338004000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110272034162414',
        'projectName': '72731',
        'licenseNumber': '闽BQ7801',
        'driverPhone': '15859101001',
        'fillTime': '1635338061000',
        'signTime': '1635338061000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110272035196738',
        'projectName': '72731',
        'licenseNumber': '闽BQ7801',
        'driverPhone': '15859101001',
        'fillTime': '1635338120000',
        'signTime': '1635338120000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110272037390197',
        'projectName': '72731',
        'licenseNumber': '闽BQ7801',
        'driverPhone': '15859101001',
        'fillTime': '1635338259000',
        'signTime': '1635338259000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110272039198235',
        'projectName': '72731',
        'licenseNumber': '闽BQ7801',
        'driverPhone': '15859101001',
        'fillTime': '1635338359000',
        'signTime': '1635338359000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110272039480730',
        'projectName': '72731',
        'licenseNumber': '闽BQ7801',
        'driverPhone': '15859101001',
        'fillTime': '1635338388000',
        'signTime': '1635338388000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110272040174465',
        'projectName': '72731',
        'licenseNumber': '闽BQ7801',
        'driverPhone': '15859101001',
        'fillTime': '1635338417000',
        'signTime': '1635338417000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110272040461885',
        'projectName': '72731',
        'licenseNumber': '闽BQ7801',
        'driverPhone': '15859101001',
        'fillTime': '1635338446000',
        'signTime': '1635338446000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110272041341258',
        'projectName': '72731',
        'licenseNumber': '闽BQ7801',
        'driverPhone': '15859101001',
        'fillTime': '1635338494000',
        'signTime': '1635338494000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110272043467426',
        'projectName': '72731',
        'licenseNumber': '闽BQ7801',
        'driverPhone': '15859101001',
        'fillTime': '1635338626000',
        'signTime': '1635338626000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110272047431703',
        'projectName': '72731',
        'licenseNumber': '闽BQ7801',
        'driverPhone': '15859101001',
        'fillTime': '1635338864000',
        'signTime': '1635338864000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110272048047399',
        'projectName': '72731',
        'licenseNumber': '闽BQ7801',
        'driverPhone': '15859101001',
        'fillTime': '1635338884000',
        'signTime': '1635338884000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110272049215217',
        'projectName': '72731',
        'licenseNumber': '闽BQ7801',
        'driverPhone': '15859101001',
        'fillTime': '1635338961000',
        'signTime': '1635338961000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110272049574954',
        'projectName': '72731',
        'licenseNumber': '闽BQ7801',
        'driverPhone': '15859101001',
        'fillTime': '1635338997000',
        'signTime': '1635338997000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110272050276492',
        'projectName': '72731',
        'licenseNumber': '闽BQ7801',
        'driverPhone': '15859101001',
        'fillTime': '1635339028000',
        'signTime': '1635339028000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110272051340701',
        'projectName': '72731',
        'licenseNumber': '闽BQ7801',
        'driverPhone': '15859101001',
        'fillTime': '1635339095000',
        'signTime': '1635339095000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110272052410020',
        'projectName': '72731',
        'licenseNumber': '闽BQ7801',
        'driverPhone': '15859101001',
        'fillTime': '1635339161000',
        'signTime': '1635339161000',
        'serialNumber': '157'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110272053296764',
        'projectName': '72731',
        'licenseNumber': '闽BQ7801',
        'driverPhone': '15859101001',
        'fillTime': '1635339209000',
        'signTime': '1635339209000',
        'serialNumber': '157'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110272054113019',
        'projectName': '72731',
        'licenseNumber': '闽BQ7801',
        'driverPhone': '15859101001',
        'fillTime': '1635339251000',
        'signTime': '1635339251000',
        'serialNumber': '157'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110272054456514',
        'projectName': '72731',
        'licenseNumber': '闽BQ7801',
        'driverPhone': '15859101001',
        'fillTime': '1635339285000',
        'signTime': '1635339285000',
        'serialNumber': '157'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110272055408363',
        'projectName': '72731',
        'licenseNumber': '闽BQ7801',
        'driverPhone': '15859101001',
        'fillTime': '1635339341000',
        'signTime': '1635339341000',
        'serialNumber': '157'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110272056176589',
        'projectName': '72731',
        'licenseNumber': '闽BQ7801',
        'driverPhone': '15859101001',
        'fillTime': '1635339377000',
        'signTime': '1635339377000',
        'serialNumber': '157'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110272057075827',
        'projectName': '72731',
        'licenseNumber': '闽BQ7801',
        'driverPhone': '15859101001',
        'fillTime': '1635339428000',
        'signTime': '1635339428000',
        'serialNumber': '157'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110272057414303',
        'projectName': '72731',
        'licenseNumber': '闽BQ7801',
        'driverPhone': '15859101001',
        'fillTime': '1635339462000',
        'signTime': '1635339462000',
        'serialNumber': '157'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110272058166296',
        'projectName': '72731',
        'licenseNumber': '闽BQ7801',
        'driverPhone': '15859101001',
        'fillTime': '1635339496000',
        'signTime': '1635339496000',
        'serialNumber': '157'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110272059298740',
        'projectName': '72731',
        'licenseNumber': '闽BQ7801',
        'driverPhone': '15859101001',
        'fillTime': '1635339569000',
        'signTime': '1635339569000',
        'serialNumber': '157'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110281051189058',
        'projectName': '72731',
        'licenseNumber': '闽BQ7801',
        'driverPhone': '15859101001',
        'fillTime': '1635389479000',
        'signTime': '1635389479000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110281051554780',
        'projectName': '72731',
        'licenseNumber': '闽BQ7801',
        'driverPhone': '15859101001',
        'fillTime': '1635389516000',
        'signTime': '1635389516000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110281052408754',
        'projectName': '72731',
        'licenseNumber': '闽BQ7801',
        'driverPhone': '15859101001',
        'fillTime': '1635389561000',
        'signTime': '1635389561000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110281053294497',
        'projectName': '72731',
        'licenseNumber': '闽BQ7801',
        'driverPhone': '15859101001',
        'fillTime': '1635389610000',
        'signTime': '1635389610000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110281054280667',
        'projectName': '72731',
        'licenseNumber': '闽BQ7801',
        'driverPhone': '15859101001',
        'fillTime': '1635389668000',
        'signTime': '1635389668000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110281055238727',
        'projectName': '72731',
        'licenseNumber': '闽BQ7801',
        'driverPhone': '15859101001',
        'fillTime': '1635389723000',
        'signTime': '1635389723000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110281057017097',
        'projectName': '72731',
        'licenseNumber': '闽BQ7801',
        'driverPhone': '15859101001',
        'fillTime': '1635389821000',
        'signTime': '1635389821000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110281108570566',
        'projectName': '72731',
        'licenseNumber': '闽BQ7802',
        'driverPhone': '15859101002',
        'fillTime': '1635390537000',
        'signTime': '1635390537000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110281109302534',
        'projectName': '72731',
        'licenseNumber': '闽BQ7802',
        'driverPhone': '15859101002',
        'fillTime': '1635390571000',
        'signTime': '1635390571000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110281110236080',
        'projectName': '72731',
        'licenseNumber': '闽BQ7802',
        'driverPhone': '15859101002',
        'fillTime': '1635390623000',
        'signTime': '1635390623000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110281111023618',
        'projectName': '72731',
        'licenseNumber': '闽BQ7802',
        'driverPhone': '15859101002',
        'fillTime': '1635390663000',
        'signTime': '1635390663000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110281111413997',
        'projectName': '72731',
        'licenseNumber': '闽BQ7802',
        'driverPhone': '15859101002',
        'fillTime': '1635390701000',
        'signTime': '1635390701000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110281112342732',
        'projectName': '72731',
        'licenseNumber': '闽BQ7802',
        'driverPhone': '15859101002',
        'fillTime': '1635390754000',
        'signTime': '1635390754000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110281113172977',
        'projectName': '72731',
        'licenseNumber': '闽BQ7802',
        'driverPhone': '15859101002',
        'fillTime': '1635390798000',
        'signTime': '1635390798000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110281114218928',
        'projectName': '72731',
        'licenseNumber': '闽BQ7802',
        'driverPhone': '15859101002',
        'fillTime': '1635390862000',
        'signTime': '1635390862000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110281115212237',
        'projectName': '72731',
        'licenseNumber': '闽BQ7802',
        'driverPhone': '15859101002',
        'fillTime': '1635390921000',
        'signTime': '1635390921000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110281116081769',
        'projectName': '72731',
        'licenseNumber': '闽BQ7802',
        'driverPhone': '15859101002',
        'fillTime': '1635390968000',
        'signTime': '1635390968000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110281116535972',
        'projectName': '72731',
        'licenseNumber': '闽BQ7802',
        'driverPhone': '15859101002',
        'fillTime': '1635391014000',
        'signTime': '1635391014000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110281118048652',
        'projectName': '72731',
        'licenseNumber': '闽BQ7802',
        'driverPhone': '15859101002',
        'fillTime': '1635391085000',
        'signTime': '1635391085000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110281118510090',
        'projectName': '72731',
        'licenseNumber': '闽BQ7802',
        'driverPhone': '15859101002',
        'fillTime': '1635391131000',
        'signTime': '1635391131000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110281119349749',
        'projectName': '72731',
        'licenseNumber': '闽BQ7802',
        'driverPhone': '15859101002',
        'fillTime': '1635391174000',
        'signTime': '1635391174000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110281121126842',
        'projectName': '72731',
        'licenseNumber': '闽BQ7802',
        'driverPhone': '15859101002',
        'fillTime': '1635391272000',
        'signTime': '1635391272000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110281122430352',
        'projectName': '72731',
        'licenseNumber': '闽BQ7802',
        'driverPhone': '15859101002',
        'fillTime': '1635391364000',
        'signTime': '1635391364000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110281125111347',
        'projectName': '72731',
        'licenseNumber': '闽BQ7802',
        'driverPhone': '15859101002',
        'fillTime': '1635391511000',
        'signTime': '1635391511000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110281128237324',
        'projectName': '72731',
        'licenseNumber': '闽BQ7802',
        'driverPhone': '15859101002',
        'fillTime': '1635391703000',
        'signTime': '1635391703000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110281133479295',
        'projectName': '72731',
        'licenseNumber': '闽BQ7802',
        'driverPhone': '15859101002',
        'fillTime': '1635392027000',
        'signTime': '1635392027000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110281134378083',
        'projectName': '72731',
        'licenseNumber': '闽BQ7802',
        'driverPhone': '15859101002',
        'fillTime': '1635392077000',
        'signTime': '1635392077000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110281135251180',
        'projectName': '72731',
        'licenseNumber': '闽BQ7802',
        'driverPhone': '15859101002',
        'fillTime': '1635392125000',
        'signTime': '1635392125000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110281137063354',
        'projectName': '72731',
        'licenseNumber': '闽BQ7802',
        'driverPhone': '15859101002',
        'fillTime': '1635392227000',
        'signTime': '1635392227000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110281335043806',
        'projectName': '72731',
        'licenseNumber': '闽BQ7802',
        'driverPhone': '15859101002',
        'fillTime': '1635399305000',
        'signTime': '1635399305000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110281336000644',
        'projectName': '72731',
        'licenseNumber': '闽BQ7802',
        'driverPhone': '15859101002',
        'fillTime': '1635399361000',
        'signTime': '1635399361000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110281336409518',
        'projectName': '72731',
        'licenseNumber': '闽BQ7802',
        'driverPhone': '15859101002',
        'fillTime': '1635399401000',
        'signTime': '1635399401000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110281337206949',
        'projectName': '72731',
        'licenseNumber': '闽BQ7802',
        'driverPhone': '15859101002',
        'fillTime': '1635399440000',
        'signTime': '1635399440000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110281338015165',
        'projectName': '72731',
        'licenseNumber': '闽BQ7802',
        'driverPhone': '15859101002',
        'fillTime': '1635399481000',
        'signTime': '1635399481000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110281339192280',
        'projectName': '72731',
        'licenseNumber': '闽BQ7802',
        'driverPhone': '15859101002',
        'fillTime': '1635399559000',
        'signTime': '1635399559000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110281340574688',
        'projectName': '72731',
        'licenseNumber': '闽BQ7802',
        'driverPhone': '15859101002',
        'fillTime': '1635399657000',
        'signTime': '1635399657000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110281343492473',
        'projectName': '72731',
        'licenseNumber': '闽BQ7802',
        'driverPhone': '15859101002',
        'fillTime': '1635399830000',
        'signTime': '1635399830000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110281344405858',
        'projectName': '72731',
        'licenseNumber': '闽BQ7802',
        'driverPhone': '15859101002',
        'fillTime': '1635399880000',
        'signTime': '1635399880000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110281345247364',
        'projectName': '72731',
        'licenseNumber': '闽BQ7802',
        'driverPhone': '15859101002',
        'fillTime': '1635399924000',
        'signTime': '1635399924000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110281345597340',
        'projectName': '72731',
        'licenseNumber': '闽BQ7802',
        'driverPhone': '15859101002',
        'fillTime': '1635399959000',
        'signTime': '1635399959000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110281346352346',
        'projectName': '72731',
        'licenseNumber': '闽BQ7802',
        'driverPhone': '15859101002',
        'fillTime': '1635399996000',
        'signTime': '1635399996000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110281347126489',
        'projectName': '72731',
        'licenseNumber': '闽BQ7802',
        'driverPhone': '15859101002',
        'fillTime': '1635400033000',
        'signTime': '1635400033000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110281347490711',
        'projectName': '72731',
        'licenseNumber': '闽BQ7802',
        'driverPhone': '15859101002',
        'fillTime': '1635400069000',
        'signTime': '1635400069000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110281348495361',
        'projectName': '72731',
        'licenseNumber': '闽BQ7802',
        'driverPhone': '15859101002',
        'fillTime': '1635400129000',
        'signTime': '1635400129000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110281349262909',
        'projectName': '72731',
        'licenseNumber': '闽BQ7802',
        'driverPhone': '15859101002',
        'fillTime': '1635400167000',
        'signTime': '1635400167000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110281350047811',
        'projectName': '72731',
        'licenseNumber': '闽BQ7802',
        'driverPhone': '15859101002',
        'fillTime': '1635400204000',
        'signTime': '1635400204000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110281350478056',
        'projectName': '72731',
        'licenseNumber': '闽BQ7802',
        'driverPhone': '15859101002',
        'fillTime': '1635400247000',
        'signTime': '1635400247000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110281351231610',
        'projectName': '72731',
        'licenseNumber': '闽BQ7802',
        'driverPhone': '15859101002',
        'fillTime': '1635400283000',
        'signTime': '1635400283000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110281352072508',
        'projectName': '72731',
        'licenseNumber': '闽BQ7802',
        'driverPhone': '15859101002',
        'fillTime': '1635400327000',
        'signTime': '1635400327000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110281352448066',
        'projectName': '72731',
        'licenseNumber': '闽BQ7802',
        'driverPhone': '15859101002',
        'fillTime': '1635400364000',
        'signTime': '1635400364000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110281353164901',
        'projectName': '72731',
        'licenseNumber': '闽BQ7802',
        'driverPhone': '15859101002',
        'fillTime': '1635400396000',
        'signTime': '1635400396000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110281353548511',
        'projectName': '72731',
        'licenseNumber': '闽BQ7802',
        'driverPhone': '15859101002',
        'fillTime': '1635400434000',
        'signTime': '1635400434000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110281354351601',
        'projectName': '72731',
        'licenseNumber': '闽BQ7802',
        'driverPhone': '15859101002',
        'fillTime': '1635400475000',
        'signTime': '1635400475000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110281355096274',
        'projectName': '72731',
        'licenseNumber': '闽BQ7802',
        'driverPhone': '15859101002',
        'fillTime': '1635400509000',
        'signTime': '1635400509000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110281355520702',
        'projectName': '72731',
        'licenseNumber': '闽BQ7802',
        'driverPhone': '15859101002',
        'fillTime': '1635400552000',
        'signTime': '1635400552000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110281356280861',
        'projectName': '72731',
        'licenseNumber': '闽BQ7802',
        'driverPhone': '15859101002',
        'fillTime': '1635400588000',
        'signTime': '1635400588000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110281357327097',
        'projectName': '72731',
        'licenseNumber': '闽BQ7802',
        'driverPhone': '15859101002',
        'fillTime': '1635400652000',
        'signTime': '1635400652000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110281358093255',
        'projectName': '72731',
        'licenseNumber': '闽BQ7802',
        'driverPhone': '15859101002',
        'fillTime': '1635400689000',
        'signTime': '1635400689000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110281359246951',
        'projectName': '72731',
        'licenseNumber': '闽BQ7802',
        'driverPhone': '15859101002',
        'fillTime': '1635400764000',
        'signTime': '1635400764000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110281400052786',
        'projectName': '72731',
        'licenseNumber': '闽BQ7802',
        'driverPhone': '15859101002',
        'fillTime': '1635400805000',
        'signTime': '1635400805000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110281400585004',
        'projectName': '72731',
        'licenseNumber': '闽BQ7802',
        'driverPhone': '15859101002',
        'fillTime': '1635400859000',
        'signTime': '1635400859000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110281406075289',
        'projectName': '72731',
        'licenseNumber': '闽BQ7802',
        'driverPhone': '15859101002',
        'fillTime': '1635401168000',
        'signTime': '1635401168000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110281407400589',
        'projectName': '72731',
        'licenseNumber': '闽BQ7802',
        'driverPhone': '15859101002',
        'fillTime': '1635401261000',
        'signTime': '1635401261000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110281408246156',
        'projectName': '72731',
        'licenseNumber': '闽BQ7802',
        'driverPhone': '15859101002',
        'fillTime': '1635401304000',
        'signTime': '1635401304000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110281409221479',
        'projectName': '72731',
        'licenseNumber': '闽BQ7802',
        'driverPhone': '15859101002',
        'fillTime': '1635401362000',
        'signTime': '1635401362000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110281410047848',
        'projectName': '72731',
        'licenseNumber': '闽BQ7802',
        'driverPhone': '15859101002',
        'fillTime': '1635401404000',
        'signTime': '1635401404000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110281411005539',
        'projectName': '72731',
        'licenseNumber': '闽BQ7802',
        'driverPhone': '15859101002',
        'fillTime': '1635401460000',
        'signTime': '1635401460000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110281411452612',
        'projectName': '72731',
        'licenseNumber': '闽BQ7802',
        'driverPhone': '15859101002',
        'fillTime': '1635401505000',
        'signTime': '1635401505000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110281413200569',
        'projectName': '72731',
        'licenseNumber': '闽BQ7802',
        'driverPhone': '15859101002',
        'fillTime': '1635401600000',
        'signTime': '1635401600000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110281437396617',
        'projectName': '72731',
        'licenseNumber': '闽BQ7802',
        'driverPhone': '15859101002',
        'fillTime': '1635403059000',
        'signTime': '1635403059000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110281438191109',
        'projectName': '72731',
        'licenseNumber': '闽BQ7802',
        'driverPhone': '15859101002',
        'fillTime': '1635403100000',
        'signTime': '1635403100000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110281438589887',
        'projectName': '72731',
        'licenseNumber': '闽BQ7802',
        'driverPhone': '15859101002',
        'fillTime': '1635403138000',
        'signTime': '1635403138000',
        'serialNumber': '147'
      }
    ],
    'userInfo': {
      'project_id': '72731',
      'team_telno': '15859102001',
      'issuing_telno': '15859109601',
      'issuing_time': '1635403138000',
      'issuing_pc': '1635403844258564',
      'icType': 'r'
    },
    'meter': [
      '1010',
      '2'
    ],
    'userMark': '1000|4|'
  },
  {
    'projectName': '100条项目',
    'loadUnloadType': '1001',
    'loadUnloadTypeStr': '渣土场',
    'muckyardName': '0907渣1-细沙',
    'loadTime': '2021-10-27 20:52:41',
    'unloadTime': '2021-10-27 20:53:18',
    'waybillCode': '98089f9f52424fa69dc2dd1ef88059ba',
    'waybillNo': '2110272052410020',
    'orderCode': '110949797271486aa198a8ff3e64153c',
    'goodsTypeName': '细沙',
    'driverName': '测试',
    'driverPhone': '15859101001',
    'licenseNumber': '闽BQ7801',
    'GetCardNo': {
      'success': true,
      'code': '0000',
      'data': 110030265,
      'source': 'GetCardNo,2,True,B9ED8E0600000000'
    },
    'dataList': [
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110272025198140',
        'projectName': '72731',
        'licenseNumber': '闽BQ7801',
        'driverPhone': '15859101001',
        'fillTime': '1635337520000',
        'signTime': '1635337520000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110272029292976',
        'projectName': '72731',
        'licenseNumber': '闽BQ7801',
        'driverPhone': '15859101001',
        'fillTime': '1635337769000',
        'signTime': '1635337769000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110272030089762',
        'projectName': '72731',
        'licenseNumber': '闽BQ7801',
        'driverPhone': '15859101001',
        'fillTime': '1635337808000',
        'signTime': '1635337808000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110272032106344',
        'projectName': '72731',
        'licenseNumber': '闽BQ7801',
        'driverPhone': '15859101001',
        'fillTime': '1635337931000',
        'signTime': '1635337931000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110272032432975',
        'projectName': '72731',
        'licenseNumber': '闽BQ7801',
        'driverPhone': '15859101001',
        'fillTime': '1635337963000',
        'signTime': '1635337963000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110272033233861',
        'projectName': '72731',
        'licenseNumber': '闽BQ7801',
        'driverPhone': '15859101001',
        'fillTime': '1635338004000',
        'signTime': '1635338004000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110272034162414',
        'projectName': '72731',
        'licenseNumber': '闽BQ7801',
        'driverPhone': '15859101001',
        'fillTime': '1635338061000',
        'signTime': '1635338061000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110272035196738',
        'projectName': '72731',
        'licenseNumber': '闽BQ7801',
        'driverPhone': '15859101001',
        'fillTime': '1635338120000',
        'signTime': '1635338120000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110272037390197',
        'projectName': '72731',
        'licenseNumber': '闽BQ7801',
        'driverPhone': '15859101001',
        'fillTime': '1635338259000',
        'signTime': '1635338259000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110272039198235',
        'projectName': '72731',
        'licenseNumber': '闽BQ7801',
        'driverPhone': '15859101001',
        'fillTime': '1635338359000',
        'signTime': '1635338359000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110272039480730',
        'projectName': '72731',
        'licenseNumber': '闽BQ7801',
        'driverPhone': '15859101001',
        'fillTime': '1635338388000',
        'signTime': '1635338388000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110272040174465',
        'projectName': '72731',
        'licenseNumber': '闽BQ7801',
        'driverPhone': '15859101001',
        'fillTime': '1635338417000',
        'signTime': '1635338417000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110272040461885',
        'projectName': '72731',
        'licenseNumber': '闽BQ7801',
        'driverPhone': '15859101001',
        'fillTime': '1635338446000',
        'signTime': '1635338446000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110272041341258',
        'projectName': '72731',
        'licenseNumber': '闽BQ7801',
        'driverPhone': '15859101001',
        'fillTime': '1635338494000',
        'signTime': '1635338494000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110272043467426',
        'projectName': '72731',
        'licenseNumber': '闽BQ7801',
        'driverPhone': '15859101001',
        'fillTime': '1635338626000',
        'signTime': '1635338626000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110272047431703',
        'projectName': '72731',
        'licenseNumber': '闽BQ7801',
        'driverPhone': '15859101001',
        'fillTime': '1635338864000',
        'signTime': '1635338864000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110272048047399',
        'projectName': '72731',
        'licenseNumber': '闽BQ7801',
        'driverPhone': '15859101001',
        'fillTime': '1635338884000',
        'signTime': '1635338884000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110272049215217',
        'projectName': '72731',
        'licenseNumber': '闽BQ7801',
        'driverPhone': '15859101001',
        'fillTime': '1635338961000',
        'signTime': '1635338961000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110272049574954',
        'projectName': '72731',
        'licenseNumber': '闽BQ7801',
        'driverPhone': '15859101001',
        'fillTime': '1635338997000',
        'signTime': '1635338997000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110272050276492',
        'projectName': '72731',
        'licenseNumber': '闽BQ7801',
        'driverPhone': '15859101001',
        'fillTime': '1635339028000',
        'signTime': '1635339028000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110272051340701',
        'projectName': '72731',
        'licenseNumber': '闽BQ7801',
        'driverPhone': '15859101001',
        'fillTime': '1635339095000',
        'signTime': '1635339095000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110272052410020',
        'projectName': '72731',
        'licenseNumber': '闽BQ7801',
        'driverPhone': '15859101001',
        'fillTime': '1635339161000',
        'signTime': '1635339161000',
        'serialNumber': '157'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110272053296764',
        'projectName': '72731',
        'licenseNumber': '闽BQ7801',
        'driverPhone': '15859101001',
        'fillTime': '1635339209000',
        'signTime': '1635339209000',
        'serialNumber': '157'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110272054113019',
        'projectName': '72731',
        'licenseNumber': '闽BQ7801',
        'driverPhone': '15859101001',
        'fillTime': '1635339251000',
        'signTime': '1635339251000',
        'serialNumber': '157'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110272054456514',
        'projectName': '72731',
        'licenseNumber': '闽BQ7801',
        'driverPhone': '15859101001',
        'fillTime': '1635339285000',
        'signTime': '1635339285000',
        'serialNumber': '157'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110272055408363',
        'projectName': '72731',
        'licenseNumber': '闽BQ7801',
        'driverPhone': '15859101001',
        'fillTime': '1635339341000',
        'signTime': '1635339341000',
        'serialNumber': '157'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110272056176589',
        'projectName': '72731',
        'licenseNumber': '闽BQ7801',
        'driverPhone': '15859101001',
        'fillTime': '1635339377000',
        'signTime': '1635339377000',
        'serialNumber': '157'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110272057075827',
        'projectName': '72731',
        'licenseNumber': '闽BQ7801',
        'driverPhone': '15859101001',
        'fillTime': '1635339428000',
        'signTime': '1635339428000',
        'serialNumber': '157'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110272057414303',
        'projectName': '72731',
        'licenseNumber': '闽BQ7801',
        'driverPhone': '15859101001',
        'fillTime': '1635339462000',
        'signTime': '1635339462000',
        'serialNumber': '157'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110272058166296',
        'projectName': '72731',
        'licenseNumber': '闽BQ7801',
        'driverPhone': '15859101001',
        'fillTime': '1635339496000',
        'signTime': '1635339496000',
        'serialNumber': '157'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110272059298740',
        'projectName': '72731',
        'licenseNumber': '闽BQ7801',
        'driverPhone': '15859101001',
        'fillTime': '1635339569000',
        'signTime': '1635339569000',
        'serialNumber': '157'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110281051189058',
        'projectName': '72731',
        'licenseNumber': '闽BQ7801',
        'driverPhone': '15859101001',
        'fillTime': '1635389479000',
        'signTime': '1635389479000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110281051554780',
        'projectName': '72731',
        'licenseNumber': '闽BQ7801',
        'driverPhone': '15859101001',
        'fillTime': '1635389516000',
        'signTime': '1635389516000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110281052408754',
        'projectName': '72731',
        'licenseNumber': '闽BQ7801',
        'driverPhone': '15859101001',
        'fillTime': '1635389561000',
        'signTime': '1635389561000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110281053294497',
        'projectName': '72731',
        'licenseNumber': '闽BQ7801',
        'driverPhone': '15859101001',
        'fillTime': '1635389610000',
        'signTime': '1635389610000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110281054280667',
        'projectName': '72731',
        'licenseNumber': '闽BQ7801',
        'driverPhone': '15859101001',
        'fillTime': '1635389668000',
        'signTime': '1635389668000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110281055238727',
        'projectName': '72731',
        'licenseNumber': '闽BQ7801',
        'driverPhone': '15859101001',
        'fillTime': '1635389723000',
        'signTime': '1635389723000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110281057017097',
        'projectName': '72731',
        'licenseNumber': '闽BQ7801',
        'driverPhone': '15859101001',
        'fillTime': '1635389821000',
        'signTime': '1635389821000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110281108570566',
        'projectName': '72731',
        'licenseNumber': '闽BQ7802',
        'driverPhone': '15859101002',
        'fillTime': '1635390537000',
        'signTime': '1635390537000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110281109302534',
        'projectName': '72731',
        'licenseNumber': '闽BQ7802',
        'driverPhone': '15859101002',
        'fillTime': '1635390571000',
        'signTime': '1635390571000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110281110236080',
        'projectName': '72731',
        'licenseNumber': '闽BQ7802',
        'driverPhone': '15859101002',
        'fillTime': '1635390623000',
        'signTime': '1635390623000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110281111023618',
        'projectName': '72731',
        'licenseNumber': '闽BQ7802',
        'driverPhone': '15859101002',
        'fillTime': '1635390663000',
        'signTime': '1635390663000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110281111413997',
        'projectName': '72731',
        'licenseNumber': '闽BQ7802',
        'driverPhone': '15859101002',
        'fillTime': '1635390701000',
        'signTime': '1635390701000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110281112342732',
        'projectName': '72731',
        'licenseNumber': '闽BQ7802',
        'driverPhone': '15859101002',
        'fillTime': '1635390754000',
        'signTime': '1635390754000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110281113172977',
        'projectName': '72731',
        'licenseNumber': '闽BQ7802',
        'driverPhone': '15859101002',
        'fillTime': '1635390798000',
        'signTime': '1635390798000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110281114218928',
        'projectName': '72731',
        'licenseNumber': '闽BQ7802',
        'driverPhone': '15859101002',
        'fillTime': '1635390862000',
        'signTime': '1635390862000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110281115212237',
        'projectName': '72731',
        'licenseNumber': '闽BQ7802',
        'driverPhone': '15859101002',
        'fillTime': '1635390921000',
        'signTime': '1635390921000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110281116081769',
        'projectName': '72731',
        'licenseNumber': '闽BQ7802',
        'driverPhone': '15859101002',
        'fillTime': '1635390968000',
        'signTime': '1635390968000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110281116535972',
        'projectName': '72731',
        'licenseNumber': '闽BQ7802',
        'driverPhone': '15859101002',
        'fillTime': '1635391014000',
        'signTime': '1635391014000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110281118048652',
        'projectName': '72731',
        'licenseNumber': '闽BQ7802',
        'driverPhone': '15859101002',
        'fillTime': '1635391085000',
        'signTime': '1635391085000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110281118510090',
        'projectName': '72731',
        'licenseNumber': '闽BQ7802',
        'driverPhone': '15859101002',
        'fillTime': '1635391131000',
        'signTime': '1635391131000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110281119349749',
        'projectName': '72731',
        'licenseNumber': '闽BQ7802',
        'driverPhone': '15859101002',
        'fillTime': '1635391174000',
        'signTime': '1635391174000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110281121126842',
        'projectName': '72731',
        'licenseNumber': '闽BQ7802',
        'driverPhone': '15859101002',
        'fillTime': '1635391272000',
        'signTime': '1635391272000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110281122430352',
        'projectName': '72731',
        'licenseNumber': '闽BQ7802',
        'driverPhone': '15859101002',
        'fillTime': '1635391364000',
        'signTime': '1635391364000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110281125111347',
        'projectName': '72731',
        'licenseNumber': '闽BQ7802',
        'driverPhone': '15859101002',
        'fillTime': '1635391511000',
        'signTime': '1635391511000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110281128237324',
        'projectName': '72731',
        'licenseNumber': '闽BQ7802',
        'driverPhone': '15859101002',
        'fillTime': '1635391703000',
        'signTime': '1635391703000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110281133479295',
        'projectName': '72731',
        'licenseNumber': '闽BQ7802',
        'driverPhone': '15859101002',
        'fillTime': '1635392027000',
        'signTime': '1635392027000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110281134378083',
        'projectName': '72731',
        'licenseNumber': '闽BQ7802',
        'driverPhone': '15859101002',
        'fillTime': '1635392077000',
        'signTime': '1635392077000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110281135251180',
        'projectName': '72731',
        'licenseNumber': '闽BQ7802',
        'driverPhone': '15859101002',
        'fillTime': '1635392125000',
        'signTime': '1635392125000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110281137063354',
        'projectName': '72731',
        'licenseNumber': '闽BQ7802',
        'driverPhone': '15859101002',
        'fillTime': '1635392227000',
        'signTime': '1635392227000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110281335043806',
        'projectName': '72731',
        'licenseNumber': '闽BQ7802',
        'driverPhone': '15859101002',
        'fillTime': '1635399305000',
        'signTime': '1635399305000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110281336000644',
        'projectName': '72731',
        'licenseNumber': '闽BQ7802',
        'driverPhone': '15859101002',
        'fillTime': '1635399361000',
        'signTime': '1635399361000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110281336409518',
        'projectName': '72731',
        'licenseNumber': '闽BQ7802',
        'driverPhone': '15859101002',
        'fillTime': '1635399401000',
        'signTime': '1635399401000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110281337206949',
        'projectName': '72731',
        'licenseNumber': '闽BQ7802',
        'driverPhone': '15859101002',
        'fillTime': '1635399440000',
        'signTime': '1635399440000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110281338015165',
        'projectName': '72731',
        'licenseNumber': '闽BQ7802',
        'driverPhone': '15859101002',
        'fillTime': '1635399481000',
        'signTime': '1635399481000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110281339192280',
        'projectName': '72731',
        'licenseNumber': '闽BQ7802',
        'driverPhone': '15859101002',
        'fillTime': '1635399559000',
        'signTime': '1635399559000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110281340574688',
        'projectName': '72731',
        'licenseNumber': '闽BQ7802',
        'driverPhone': '15859101002',
        'fillTime': '1635399657000',
        'signTime': '1635399657000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110281343492473',
        'projectName': '72731',
        'licenseNumber': '闽BQ7802',
        'driverPhone': '15859101002',
        'fillTime': '1635399830000',
        'signTime': '1635399830000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110281344405858',
        'projectName': '72731',
        'licenseNumber': '闽BQ7802',
        'driverPhone': '15859101002',
        'fillTime': '1635399880000',
        'signTime': '1635399880000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110281345247364',
        'projectName': '72731',
        'licenseNumber': '闽BQ7802',
        'driverPhone': '15859101002',
        'fillTime': '1635399924000',
        'signTime': '1635399924000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110281345597340',
        'projectName': '72731',
        'licenseNumber': '闽BQ7802',
        'driverPhone': '15859101002',
        'fillTime': '1635399959000',
        'signTime': '1635399959000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110281346352346',
        'projectName': '72731',
        'licenseNumber': '闽BQ7802',
        'driverPhone': '15859101002',
        'fillTime': '1635399996000',
        'signTime': '1635399996000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110281347126489',
        'projectName': '72731',
        'licenseNumber': '闽BQ7802',
        'driverPhone': '15859101002',
        'fillTime': '1635400033000',
        'signTime': '1635400033000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110281347490711',
        'projectName': '72731',
        'licenseNumber': '闽BQ7802',
        'driverPhone': '15859101002',
        'fillTime': '1635400069000',
        'signTime': '1635400069000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110281348495361',
        'projectName': '72731',
        'licenseNumber': '闽BQ7802',
        'driverPhone': '15859101002',
        'fillTime': '1635400129000',
        'signTime': '1635400129000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110281349262909',
        'projectName': '72731',
        'licenseNumber': '闽BQ7802',
        'driverPhone': '15859101002',
        'fillTime': '1635400167000',
        'signTime': '1635400167000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110281350047811',
        'projectName': '72731',
        'licenseNumber': '闽BQ7802',
        'driverPhone': '15859101002',
        'fillTime': '1635400204000',
        'signTime': '1635400204000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110281350478056',
        'projectName': '72731',
        'licenseNumber': '闽BQ7802',
        'driverPhone': '15859101002',
        'fillTime': '1635400247000',
        'signTime': '1635400247000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110281351231610',
        'projectName': '72731',
        'licenseNumber': '闽BQ7802',
        'driverPhone': '15859101002',
        'fillTime': '1635400283000',
        'signTime': '1635400283000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110281352072508',
        'projectName': '72731',
        'licenseNumber': '闽BQ7802',
        'driverPhone': '15859101002',
        'fillTime': '1635400327000',
        'signTime': '1635400327000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110281352448066',
        'projectName': '72731',
        'licenseNumber': '闽BQ7802',
        'driverPhone': '15859101002',
        'fillTime': '1635400364000',
        'signTime': '1635400364000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110281353164901',
        'projectName': '72731',
        'licenseNumber': '闽BQ7802',
        'driverPhone': '15859101002',
        'fillTime': '1635400396000',
        'signTime': '1635400396000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110281353548511',
        'projectName': '72731',
        'licenseNumber': '闽BQ7802',
        'driverPhone': '15859101002',
        'fillTime': '1635400434000',
        'signTime': '1635400434000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110281354351601',
        'projectName': '72731',
        'licenseNumber': '闽BQ7802',
        'driverPhone': '15859101002',
        'fillTime': '1635400475000',
        'signTime': '1635400475000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110281355096274',
        'projectName': '72731',
        'licenseNumber': '闽BQ7802',
        'driverPhone': '15859101002',
        'fillTime': '1635400509000',
        'signTime': '1635400509000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110281355520702',
        'projectName': '72731',
        'licenseNumber': '闽BQ7802',
        'driverPhone': '15859101002',
        'fillTime': '1635400552000',
        'signTime': '1635400552000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110281356280861',
        'projectName': '72731',
        'licenseNumber': '闽BQ7802',
        'driverPhone': '15859101002',
        'fillTime': '1635400588000',
        'signTime': '1635400588000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110281357327097',
        'projectName': '72731',
        'licenseNumber': '闽BQ7802',
        'driverPhone': '15859101002',
        'fillTime': '1635400652000',
        'signTime': '1635400652000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110281358093255',
        'projectName': '72731',
        'licenseNumber': '闽BQ7802',
        'driverPhone': '15859101002',
        'fillTime': '1635400689000',
        'signTime': '1635400689000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110281359246951',
        'projectName': '72731',
        'licenseNumber': '闽BQ7802',
        'driverPhone': '15859101002',
        'fillTime': '1635400764000',
        'signTime': '1635400764000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110281400052786',
        'projectName': '72731',
        'licenseNumber': '闽BQ7802',
        'driverPhone': '15859101002',
        'fillTime': '1635400805000',
        'signTime': '1635400805000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110281400585004',
        'projectName': '72731',
        'licenseNumber': '闽BQ7802',
        'driverPhone': '15859101002',
        'fillTime': '1635400859000',
        'signTime': '1635400859000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110281406075289',
        'projectName': '72731',
        'licenseNumber': '闽BQ7802',
        'driverPhone': '15859101002',
        'fillTime': '1635401168000',
        'signTime': '1635401168000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110281407400589',
        'projectName': '72731',
        'licenseNumber': '闽BQ7802',
        'driverPhone': '15859101002',
        'fillTime': '1635401261000',
        'signTime': '1635401261000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110281408246156',
        'projectName': '72731',
        'licenseNumber': '闽BQ7802',
        'driverPhone': '15859101002',
        'fillTime': '1635401304000',
        'signTime': '1635401304000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110281409221479',
        'projectName': '72731',
        'licenseNumber': '闽BQ7802',
        'driverPhone': '15859101002',
        'fillTime': '1635401362000',
        'signTime': '1635401362000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110281410047848',
        'projectName': '72731',
        'licenseNumber': '闽BQ7802',
        'driverPhone': '15859101002',
        'fillTime': '1635401404000',
        'signTime': '1635401404000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110281411005539',
        'projectName': '72731',
        'licenseNumber': '闽BQ7802',
        'driverPhone': '15859101002',
        'fillTime': '1635401460000',
        'signTime': '1635401460000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110281411452612',
        'projectName': '72731',
        'licenseNumber': '闽BQ7802',
        'driverPhone': '15859101002',
        'fillTime': '1635401505000',
        'signTime': '1635401505000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110281413200569',
        'projectName': '72731',
        'licenseNumber': '闽BQ7802',
        'driverPhone': '15859101002',
        'fillTime': '1635401600000',
        'signTime': '1635401600000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110281437396617',
        'projectName': '72731',
        'licenseNumber': '闽BQ7802',
        'driverPhone': '15859101002',
        'fillTime': '1635403059000',
        'signTime': '1635403059000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110281438191109',
        'projectName': '72731',
        'licenseNumber': '闽BQ7802',
        'driverPhone': '15859101002',
        'fillTime': '1635403100000',
        'signTime': '1635403100000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110281438589887',
        'projectName': '72731',
        'licenseNumber': '闽BQ7802',
        'driverPhone': '15859101002',
        'fillTime': '1635403138000',
        'signTime': '1635403138000',
        'serialNumber': '147'
      }
    ],
    'userInfo': {
      'project_id': '72731',
      'team_telno': '15859102001',
      'issuing_telno': '15859109601',
      'issuing_time': '1635403138000',
      'issuing_pc': '1635403844258564',
      'icType': 'r'
    },
    'meter': [
      '1010',
      '2'
    ],
    'userMark': '1000|4|'
  },
  {
    'projectName': '100条项目',
    'loadUnloadType': '1001',
    'loadUnloadTypeStr': '渣土场',
    'muckyardName': '0906渣一-石头',
    'loadTime': '2021-10-28 13:44:40',
    'unloadTime': '2021-10-28 13:45:17',
    'waybillCode': '452d1323ffe0471696745d9a35a0ee28',
    'waybillNo': '2110281344405858',
    'orderCode': '110949797271486aa198a8ff3e64153c',
    'goodsTypeName': '石头',
    'driverName': '李蓝色',
    'driverPhone': '15859101002',
    'licenseNumber': '闽BQ7802',
    'GetCardNo': {
      'success': true,
      'code': '0000',
      'data': 110030265,
      'source': 'GetCardNo,2,True,B9ED8E0600000000'
    },
    'dataList': [
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110272025198140',
        'projectName': '72731',
        'licenseNumber': '闽BQ7801',
        'driverPhone': '15859101001',
        'fillTime': '1635337520000',
        'signTime': '1635337520000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110272029292976',
        'projectName': '72731',
        'licenseNumber': '闽BQ7801',
        'driverPhone': '15859101001',
        'fillTime': '1635337769000',
        'signTime': '1635337769000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110272030089762',
        'projectName': '72731',
        'licenseNumber': '闽BQ7801',
        'driverPhone': '15859101001',
        'fillTime': '1635337808000',
        'signTime': '1635337808000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110272032106344',
        'projectName': '72731',
        'licenseNumber': '闽BQ7801',
        'driverPhone': '15859101001',
        'fillTime': '1635337931000',
        'signTime': '1635337931000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110272032432975',
        'projectName': '72731',
        'licenseNumber': '闽BQ7801',
        'driverPhone': '15859101001',
        'fillTime': '1635337963000',
        'signTime': '1635337963000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110272033233861',
        'projectName': '72731',
        'licenseNumber': '闽BQ7801',
        'driverPhone': '15859101001',
        'fillTime': '1635338004000',
        'signTime': '1635338004000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110272034162414',
        'projectName': '72731',
        'licenseNumber': '闽BQ7801',
        'driverPhone': '15859101001',
        'fillTime': '1635338061000',
        'signTime': '1635338061000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110272035196738',
        'projectName': '72731',
        'licenseNumber': '闽BQ7801',
        'driverPhone': '15859101001',
        'fillTime': '1635338120000',
        'signTime': '1635338120000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110272037390197',
        'projectName': '72731',
        'licenseNumber': '闽BQ7801',
        'driverPhone': '15859101001',
        'fillTime': '1635338259000',
        'signTime': '1635338259000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110272039198235',
        'projectName': '72731',
        'licenseNumber': '闽BQ7801',
        'driverPhone': '15859101001',
        'fillTime': '1635338359000',
        'signTime': '1635338359000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110272039480730',
        'projectName': '72731',
        'licenseNumber': '闽BQ7801',
        'driverPhone': '15859101001',
        'fillTime': '1635338388000',
        'signTime': '1635338388000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110272040174465',
        'projectName': '72731',
        'licenseNumber': '闽BQ7801',
        'driverPhone': '15859101001',
        'fillTime': '1635338417000',
        'signTime': '1635338417000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110272040461885',
        'projectName': '72731',
        'licenseNumber': '闽BQ7801',
        'driverPhone': '15859101001',
        'fillTime': '1635338446000',
        'signTime': '1635338446000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110272041341258',
        'projectName': '72731',
        'licenseNumber': '闽BQ7801',
        'driverPhone': '15859101001',
        'fillTime': '1635338494000',
        'signTime': '1635338494000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110272043467426',
        'projectName': '72731',
        'licenseNumber': '闽BQ7801',
        'driverPhone': '15859101001',
        'fillTime': '1635338626000',
        'signTime': '1635338626000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110272047431703',
        'projectName': '72731',
        'licenseNumber': '闽BQ7801',
        'driverPhone': '15859101001',
        'fillTime': '1635338864000',
        'signTime': '1635338864000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110272048047399',
        'projectName': '72731',
        'licenseNumber': '闽BQ7801',
        'driverPhone': '15859101001',
        'fillTime': '1635338884000',
        'signTime': '1635338884000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110272049215217',
        'projectName': '72731',
        'licenseNumber': '闽BQ7801',
        'driverPhone': '15859101001',
        'fillTime': '1635338961000',
        'signTime': '1635338961000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110272049574954',
        'projectName': '72731',
        'licenseNumber': '闽BQ7801',
        'driverPhone': '15859101001',
        'fillTime': '1635338997000',
        'signTime': '1635338997000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110272050276492',
        'projectName': '72731',
        'licenseNumber': '闽BQ7801',
        'driverPhone': '15859101001',
        'fillTime': '1635339028000',
        'signTime': '1635339028000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110272051340701',
        'projectName': '72731',
        'licenseNumber': '闽BQ7801',
        'driverPhone': '15859101001',
        'fillTime': '1635339095000',
        'signTime': '1635339095000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110272052410020',
        'projectName': '72731',
        'licenseNumber': '闽BQ7801',
        'driverPhone': '15859101001',
        'fillTime': '1635339161000',
        'signTime': '1635339161000',
        'serialNumber': '157'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110272053296764',
        'projectName': '72731',
        'licenseNumber': '闽BQ7801',
        'driverPhone': '15859101001',
        'fillTime': '1635339209000',
        'signTime': '1635339209000',
        'serialNumber': '157'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110272054113019',
        'projectName': '72731',
        'licenseNumber': '闽BQ7801',
        'driverPhone': '15859101001',
        'fillTime': '1635339251000',
        'signTime': '1635339251000',
        'serialNumber': '157'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110272054456514',
        'projectName': '72731',
        'licenseNumber': '闽BQ7801',
        'driverPhone': '15859101001',
        'fillTime': '1635339285000',
        'signTime': '1635339285000',
        'serialNumber': '157'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110272055408363',
        'projectName': '72731',
        'licenseNumber': '闽BQ7801',
        'driverPhone': '15859101001',
        'fillTime': '1635339341000',
        'signTime': '1635339341000',
        'serialNumber': '157'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110272056176589',
        'projectName': '72731',
        'licenseNumber': '闽BQ7801',
        'driverPhone': '15859101001',
        'fillTime': '1635339377000',
        'signTime': '1635339377000',
        'serialNumber': '157'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110272057075827',
        'projectName': '72731',
        'licenseNumber': '闽BQ7801',
        'driverPhone': '15859101001',
        'fillTime': '1635339428000',
        'signTime': '1635339428000',
        'serialNumber': '157'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110272057414303',
        'projectName': '72731',
        'licenseNumber': '闽BQ7801',
        'driverPhone': '15859101001',
        'fillTime': '1635339462000',
        'signTime': '1635339462000',
        'serialNumber': '157'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110272058166296',
        'projectName': '72731',
        'licenseNumber': '闽BQ7801',
        'driverPhone': '15859101001',
        'fillTime': '1635339496000',
        'signTime': '1635339496000',
        'serialNumber': '157'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110272059298740',
        'projectName': '72731',
        'licenseNumber': '闽BQ7801',
        'driverPhone': '15859101001',
        'fillTime': '1635339569000',
        'signTime': '1635339569000',
        'serialNumber': '157'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110281051189058',
        'projectName': '72731',
        'licenseNumber': '闽BQ7801',
        'driverPhone': '15859101001',
        'fillTime': '1635389479000',
        'signTime': '1635389479000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110281051554780',
        'projectName': '72731',
        'licenseNumber': '闽BQ7801',
        'driverPhone': '15859101001',
        'fillTime': '1635389516000',
        'signTime': '1635389516000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110281052408754',
        'projectName': '72731',
        'licenseNumber': '闽BQ7801',
        'driverPhone': '15859101001',
        'fillTime': '1635389561000',
        'signTime': '1635389561000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110281053294497',
        'projectName': '72731',
        'licenseNumber': '闽BQ7801',
        'driverPhone': '15859101001',
        'fillTime': '1635389610000',
        'signTime': '1635389610000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110281054280667',
        'projectName': '72731',
        'licenseNumber': '闽BQ7801',
        'driverPhone': '15859101001',
        'fillTime': '1635389668000',
        'signTime': '1635389668000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110281055238727',
        'projectName': '72731',
        'licenseNumber': '闽BQ7801',
        'driverPhone': '15859101001',
        'fillTime': '1635389723000',
        'signTime': '1635389723000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110281057017097',
        'projectName': '72731',
        'licenseNumber': '闽BQ7801',
        'driverPhone': '15859101001',
        'fillTime': '1635389821000',
        'signTime': '1635389821000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110281108570566',
        'projectName': '72731',
        'licenseNumber': '闽BQ7802',
        'driverPhone': '15859101002',
        'fillTime': '1635390537000',
        'signTime': '1635390537000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110281109302534',
        'projectName': '72731',
        'licenseNumber': '闽BQ7802',
        'driverPhone': '15859101002',
        'fillTime': '1635390571000',
        'signTime': '1635390571000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110281110236080',
        'projectName': '72731',
        'licenseNumber': '闽BQ7802',
        'driverPhone': '15859101002',
        'fillTime': '1635390623000',
        'signTime': '1635390623000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110281111023618',
        'projectName': '72731',
        'licenseNumber': '闽BQ7802',
        'driverPhone': '15859101002',
        'fillTime': '1635390663000',
        'signTime': '1635390663000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110281111413997',
        'projectName': '72731',
        'licenseNumber': '闽BQ7802',
        'driverPhone': '15859101002',
        'fillTime': '1635390701000',
        'signTime': '1635390701000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110281112342732',
        'projectName': '72731',
        'licenseNumber': '闽BQ7802',
        'driverPhone': '15859101002',
        'fillTime': '1635390754000',
        'signTime': '1635390754000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110281113172977',
        'projectName': '72731',
        'licenseNumber': '闽BQ7802',
        'driverPhone': '15859101002',
        'fillTime': '1635390798000',
        'signTime': '1635390798000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110281114218928',
        'projectName': '72731',
        'licenseNumber': '闽BQ7802',
        'driverPhone': '15859101002',
        'fillTime': '1635390862000',
        'signTime': '1635390862000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110281115212237',
        'projectName': '72731',
        'licenseNumber': '闽BQ7802',
        'driverPhone': '15859101002',
        'fillTime': '1635390921000',
        'signTime': '1635390921000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110281116081769',
        'projectName': '72731',
        'licenseNumber': '闽BQ7802',
        'driverPhone': '15859101002',
        'fillTime': '1635390968000',
        'signTime': '1635390968000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110281116535972',
        'projectName': '72731',
        'licenseNumber': '闽BQ7802',
        'driverPhone': '15859101002',
        'fillTime': '1635391014000',
        'signTime': '1635391014000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110281118048652',
        'projectName': '72731',
        'licenseNumber': '闽BQ7802',
        'driverPhone': '15859101002',
        'fillTime': '1635391085000',
        'signTime': '1635391085000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110281118510090',
        'projectName': '72731',
        'licenseNumber': '闽BQ7802',
        'driverPhone': '15859101002',
        'fillTime': '1635391131000',
        'signTime': '1635391131000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110281119349749',
        'projectName': '72731',
        'licenseNumber': '闽BQ7802',
        'driverPhone': '15859101002',
        'fillTime': '1635391174000',
        'signTime': '1635391174000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110281121126842',
        'projectName': '72731',
        'licenseNumber': '闽BQ7802',
        'driverPhone': '15859101002',
        'fillTime': '1635391272000',
        'signTime': '1635391272000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110281122430352',
        'projectName': '72731',
        'licenseNumber': '闽BQ7802',
        'driverPhone': '15859101002',
        'fillTime': '1635391364000',
        'signTime': '1635391364000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110281125111347',
        'projectName': '72731',
        'licenseNumber': '闽BQ7802',
        'driverPhone': '15859101002',
        'fillTime': '1635391511000',
        'signTime': '1635391511000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110281128237324',
        'projectName': '72731',
        'licenseNumber': '闽BQ7802',
        'driverPhone': '15859101002',
        'fillTime': '1635391703000',
        'signTime': '1635391703000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110281133479295',
        'projectName': '72731',
        'licenseNumber': '闽BQ7802',
        'driverPhone': '15859101002',
        'fillTime': '1635392027000',
        'signTime': '1635392027000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110281134378083',
        'projectName': '72731',
        'licenseNumber': '闽BQ7802',
        'driverPhone': '15859101002',
        'fillTime': '1635392077000',
        'signTime': '1635392077000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110281135251180',
        'projectName': '72731',
        'licenseNumber': '闽BQ7802',
        'driverPhone': '15859101002',
        'fillTime': '1635392125000',
        'signTime': '1635392125000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110281137063354',
        'projectName': '72731',
        'licenseNumber': '闽BQ7802',
        'driverPhone': '15859101002',
        'fillTime': '1635392227000',
        'signTime': '1635392227000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110281335043806',
        'projectName': '72731',
        'licenseNumber': '闽BQ7802',
        'driverPhone': '15859101002',
        'fillTime': '1635399305000',
        'signTime': '1635399305000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110281336000644',
        'projectName': '72731',
        'licenseNumber': '闽BQ7802',
        'driverPhone': '15859101002',
        'fillTime': '1635399361000',
        'signTime': '1635399361000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110281336409518',
        'projectName': '72731',
        'licenseNumber': '闽BQ7802',
        'driverPhone': '15859101002',
        'fillTime': '1635399401000',
        'signTime': '1635399401000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110281337206949',
        'projectName': '72731',
        'licenseNumber': '闽BQ7802',
        'driverPhone': '15859101002',
        'fillTime': '1635399440000',
        'signTime': '1635399440000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110281338015165',
        'projectName': '72731',
        'licenseNumber': '闽BQ7802',
        'driverPhone': '15859101002',
        'fillTime': '1635399481000',
        'signTime': '1635399481000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110281339192280',
        'projectName': '72731',
        'licenseNumber': '闽BQ7802',
        'driverPhone': '15859101002',
        'fillTime': '1635399559000',
        'signTime': '1635399559000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110281340574688',
        'projectName': '72731',
        'licenseNumber': '闽BQ7802',
        'driverPhone': '15859101002',
        'fillTime': '1635399657000',
        'signTime': '1635399657000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110281343492473',
        'projectName': '72731',
        'licenseNumber': '闽BQ7802',
        'driverPhone': '15859101002',
        'fillTime': '1635399830000',
        'signTime': '1635399830000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110281344405858',
        'projectName': '72731',
        'licenseNumber': '闽BQ7802',
        'driverPhone': '15859101002',
        'fillTime': '1635399880000',
        'signTime': '1635399880000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110281345247364',
        'projectName': '72731',
        'licenseNumber': '闽BQ7802',
        'driverPhone': '15859101002',
        'fillTime': '1635399924000',
        'signTime': '1635399924000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110281345597340',
        'projectName': '72731',
        'licenseNumber': '闽BQ7802',
        'driverPhone': '15859101002',
        'fillTime': '1635399959000',
        'signTime': '1635399959000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110281346352346',
        'projectName': '72731',
        'licenseNumber': '闽BQ7802',
        'driverPhone': '15859101002',
        'fillTime': '1635399996000',
        'signTime': '1635399996000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110281347126489',
        'projectName': '72731',
        'licenseNumber': '闽BQ7802',
        'driverPhone': '15859101002',
        'fillTime': '1635400033000',
        'signTime': '1635400033000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110281347490711',
        'projectName': '72731',
        'licenseNumber': '闽BQ7802',
        'driverPhone': '15859101002',
        'fillTime': '1635400069000',
        'signTime': '1635400069000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110281348495361',
        'projectName': '72731',
        'licenseNumber': '闽BQ7802',
        'driverPhone': '15859101002',
        'fillTime': '1635400129000',
        'signTime': '1635400129000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110281349262909',
        'projectName': '72731',
        'licenseNumber': '闽BQ7802',
        'driverPhone': '15859101002',
        'fillTime': '1635400167000',
        'signTime': '1635400167000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110281350047811',
        'projectName': '72731',
        'licenseNumber': '闽BQ7802',
        'driverPhone': '15859101002',
        'fillTime': '1635400204000',
        'signTime': '1635400204000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110281350478056',
        'projectName': '72731',
        'licenseNumber': '闽BQ7802',
        'driverPhone': '15859101002',
        'fillTime': '1635400247000',
        'signTime': '1635400247000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110281351231610',
        'projectName': '72731',
        'licenseNumber': '闽BQ7802',
        'driverPhone': '15859101002',
        'fillTime': '1635400283000',
        'signTime': '1635400283000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110281352072508',
        'projectName': '72731',
        'licenseNumber': '闽BQ7802',
        'driverPhone': '15859101002',
        'fillTime': '1635400327000',
        'signTime': '1635400327000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110281352448066',
        'projectName': '72731',
        'licenseNumber': '闽BQ7802',
        'driverPhone': '15859101002',
        'fillTime': '1635400364000',
        'signTime': '1635400364000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110281353164901',
        'projectName': '72731',
        'licenseNumber': '闽BQ7802',
        'driverPhone': '15859101002',
        'fillTime': '1635400396000',
        'signTime': '1635400396000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110281353548511',
        'projectName': '72731',
        'licenseNumber': '闽BQ7802',
        'driverPhone': '15859101002',
        'fillTime': '1635400434000',
        'signTime': '1635400434000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110281354351601',
        'projectName': '72731',
        'licenseNumber': '闽BQ7802',
        'driverPhone': '15859101002',
        'fillTime': '1635400475000',
        'signTime': '1635400475000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110281355096274',
        'projectName': '72731',
        'licenseNumber': '闽BQ7802',
        'driverPhone': '15859101002',
        'fillTime': '1635400509000',
        'signTime': '1635400509000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110281355520702',
        'projectName': '72731',
        'licenseNumber': '闽BQ7802',
        'driverPhone': '15859101002',
        'fillTime': '1635400552000',
        'signTime': '1635400552000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110281356280861',
        'projectName': '72731',
        'licenseNumber': '闽BQ7802',
        'driverPhone': '15859101002',
        'fillTime': '1635400588000',
        'signTime': '1635400588000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110281357327097',
        'projectName': '72731',
        'licenseNumber': '闽BQ7802',
        'driverPhone': '15859101002',
        'fillTime': '1635400652000',
        'signTime': '1635400652000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110281358093255',
        'projectName': '72731',
        'licenseNumber': '闽BQ7802',
        'driverPhone': '15859101002',
        'fillTime': '1635400689000',
        'signTime': '1635400689000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110281359246951',
        'projectName': '72731',
        'licenseNumber': '闽BQ7802',
        'driverPhone': '15859101002',
        'fillTime': '1635400764000',
        'signTime': '1635400764000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110281400052786',
        'projectName': '72731',
        'licenseNumber': '闽BQ7802',
        'driverPhone': '15859101002',
        'fillTime': '1635400805000',
        'signTime': '1635400805000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110281400585004',
        'projectName': '72731',
        'licenseNumber': '闽BQ7802',
        'driverPhone': '15859101002',
        'fillTime': '1635400859000',
        'signTime': '1635400859000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110281406075289',
        'projectName': '72731',
        'licenseNumber': '闽BQ7802',
        'driverPhone': '15859101002',
        'fillTime': '1635401168000',
        'signTime': '1635401168000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110281407400589',
        'projectName': '72731',
        'licenseNumber': '闽BQ7802',
        'driverPhone': '15859101002',
        'fillTime': '1635401261000',
        'signTime': '1635401261000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110281408246156',
        'projectName': '72731',
        'licenseNumber': '闽BQ7802',
        'driverPhone': '15859101002',
        'fillTime': '1635401304000',
        'signTime': '1635401304000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110281409221479',
        'projectName': '72731',
        'licenseNumber': '闽BQ7802',
        'driverPhone': '15859101002',
        'fillTime': '1635401362000',
        'signTime': '1635401362000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110281410047848',
        'projectName': '72731',
        'licenseNumber': '闽BQ7802',
        'driverPhone': '15859101002',
        'fillTime': '1635401404000',
        'signTime': '1635401404000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110281411005539',
        'projectName': '72731',
        'licenseNumber': '闽BQ7802',
        'driverPhone': '15859101002',
        'fillTime': '1635401460000',
        'signTime': '1635401460000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110281411452612',
        'projectName': '72731',
        'licenseNumber': '闽BQ7802',
        'driverPhone': '15859101002',
        'fillTime': '1635401505000',
        'signTime': '1635401505000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110281413200569',
        'projectName': '72731',
        'licenseNumber': '闽BQ7802',
        'driverPhone': '15859101002',
        'fillTime': '1635401600000',
        'signTime': '1635401600000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110281437396617',
        'projectName': '72731',
        'licenseNumber': '闽BQ7802',
        'driverPhone': '15859101002',
        'fillTime': '1635403059000',
        'signTime': '1635403059000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110281438191109',
        'projectName': '72731',
        'licenseNumber': '闽BQ7802',
        'driverPhone': '15859101002',
        'fillTime': '1635403100000',
        'signTime': '1635403100000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110281438589887',
        'projectName': '72731',
        'licenseNumber': '闽BQ7802',
        'driverPhone': '15859101002',
        'fillTime': '1635403138000',
        'signTime': '1635403138000',
        'serialNumber': '147'
      }
    ],
    'userInfo': {
      'project_id': '72731',
      'team_telno': '15859102001',
      'issuing_telno': '15859109601',
      'issuing_time': '1635403138000',
      'issuing_pc': '1635403844258564',
      'icType': 'r'
    },
    'meter': [
      '1010',
      '2'
    ],
    'userMark': '1000|4|'
  },
  {
    'projectName': '100条项目',
    'loadUnloadType': '1001',
    'loadUnloadTypeStr': '渣土场',
    'muckyardName': '0907渣1-细沙',
    'loadTime': '2021-10-27 20:53:29',
    'unloadTime': '2021-10-27 20:54:05',
    'waybillCode': '1d394989e9c24958851bff1852b805f8',
    'waybillNo': '2110272053296764',
    'orderCode': '110949797271486aa198a8ff3e64153c',
    'goodsTypeName': '细沙',
    'driverName': '测试',
    'driverPhone': '15859101001',
    'licenseNumber': '闽BQ7801',
    'GetCardNo': {
      'success': true,
      'code': '0000',
      'data': 110030265,
      'source': 'GetCardNo,2,True,B9ED8E0600000000'
    },
    'dataList': [
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110272025198140',
        'projectName': '72731',
        'licenseNumber': '闽BQ7801',
        'driverPhone': '15859101001',
        'fillTime': '1635337520000',
        'signTime': '1635337520000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110272029292976',
        'projectName': '72731',
        'licenseNumber': '闽BQ7801',
        'driverPhone': '15859101001',
        'fillTime': '1635337769000',
        'signTime': '1635337769000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110272030089762',
        'projectName': '72731',
        'licenseNumber': '闽BQ7801',
        'driverPhone': '15859101001',
        'fillTime': '1635337808000',
        'signTime': '1635337808000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110272032106344',
        'projectName': '72731',
        'licenseNumber': '闽BQ7801',
        'driverPhone': '15859101001',
        'fillTime': '1635337931000',
        'signTime': '1635337931000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110272032432975',
        'projectName': '72731',
        'licenseNumber': '闽BQ7801',
        'driverPhone': '15859101001',
        'fillTime': '1635337963000',
        'signTime': '1635337963000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110272033233861',
        'projectName': '72731',
        'licenseNumber': '闽BQ7801',
        'driverPhone': '15859101001',
        'fillTime': '1635338004000',
        'signTime': '1635338004000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110272034162414',
        'projectName': '72731',
        'licenseNumber': '闽BQ7801',
        'driverPhone': '15859101001',
        'fillTime': '1635338061000',
        'signTime': '1635338061000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110272035196738',
        'projectName': '72731',
        'licenseNumber': '闽BQ7801',
        'driverPhone': '15859101001',
        'fillTime': '1635338120000',
        'signTime': '1635338120000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110272037390197',
        'projectName': '72731',
        'licenseNumber': '闽BQ7801',
        'driverPhone': '15859101001',
        'fillTime': '1635338259000',
        'signTime': '1635338259000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110272039198235',
        'projectName': '72731',
        'licenseNumber': '闽BQ7801',
        'driverPhone': '15859101001',
        'fillTime': '1635338359000',
        'signTime': '1635338359000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110272039480730',
        'projectName': '72731',
        'licenseNumber': '闽BQ7801',
        'driverPhone': '15859101001',
        'fillTime': '1635338388000',
        'signTime': '1635338388000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110272040174465',
        'projectName': '72731',
        'licenseNumber': '闽BQ7801',
        'driverPhone': '15859101001',
        'fillTime': '1635338417000',
        'signTime': '1635338417000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110272040461885',
        'projectName': '72731',
        'licenseNumber': '闽BQ7801',
        'driverPhone': '15859101001',
        'fillTime': '1635338446000',
        'signTime': '1635338446000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110272041341258',
        'projectName': '72731',
        'licenseNumber': '闽BQ7801',
        'driverPhone': '15859101001',
        'fillTime': '1635338494000',
        'signTime': '1635338494000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110272043467426',
        'projectName': '72731',
        'licenseNumber': '闽BQ7801',
        'driverPhone': '15859101001',
        'fillTime': '1635338626000',
        'signTime': '1635338626000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110272047431703',
        'projectName': '72731',
        'licenseNumber': '闽BQ7801',
        'driverPhone': '15859101001',
        'fillTime': '1635338864000',
        'signTime': '1635338864000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110272048047399',
        'projectName': '72731',
        'licenseNumber': '闽BQ7801',
        'driverPhone': '15859101001',
        'fillTime': '1635338884000',
        'signTime': '1635338884000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110272049215217',
        'projectName': '72731',
        'licenseNumber': '闽BQ7801',
        'driverPhone': '15859101001',
        'fillTime': '1635338961000',
        'signTime': '1635338961000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110272049574954',
        'projectName': '72731',
        'licenseNumber': '闽BQ7801',
        'driverPhone': '15859101001',
        'fillTime': '1635338997000',
        'signTime': '1635338997000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110272050276492',
        'projectName': '72731',
        'licenseNumber': '闽BQ7801',
        'driverPhone': '15859101001',
        'fillTime': '1635339028000',
        'signTime': '1635339028000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110272051340701',
        'projectName': '72731',
        'licenseNumber': '闽BQ7801',
        'driverPhone': '15859101001',
        'fillTime': '1635339095000',
        'signTime': '1635339095000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110272052410020',
        'projectName': '72731',
        'licenseNumber': '闽BQ7801',
        'driverPhone': '15859101001',
        'fillTime': '1635339161000',
        'signTime': '1635339161000',
        'serialNumber': '157'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110272053296764',
        'projectName': '72731',
        'licenseNumber': '闽BQ7801',
        'driverPhone': '15859101001',
        'fillTime': '1635339209000',
        'signTime': '1635339209000',
        'serialNumber': '157'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110272054113019',
        'projectName': '72731',
        'licenseNumber': '闽BQ7801',
        'driverPhone': '15859101001',
        'fillTime': '1635339251000',
        'signTime': '1635339251000',
        'serialNumber': '157'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110272054456514',
        'projectName': '72731',
        'licenseNumber': '闽BQ7801',
        'driverPhone': '15859101001',
        'fillTime': '1635339285000',
        'signTime': '1635339285000',
        'serialNumber': '157'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110272055408363',
        'projectName': '72731',
        'licenseNumber': '闽BQ7801',
        'driverPhone': '15859101001',
        'fillTime': '1635339341000',
        'signTime': '1635339341000',
        'serialNumber': '157'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110272056176589',
        'projectName': '72731',
        'licenseNumber': '闽BQ7801',
        'driverPhone': '15859101001',
        'fillTime': '1635339377000',
        'signTime': '1635339377000',
        'serialNumber': '157'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110272057075827',
        'projectName': '72731',
        'licenseNumber': '闽BQ7801',
        'driverPhone': '15859101001',
        'fillTime': '1635339428000',
        'signTime': '1635339428000',
        'serialNumber': '157'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110272057414303',
        'projectName': '72731',
        'licenseNumber': '闽BQ7801',
        'driverPhone': '15859101001',
        'fillTime': '1635339462000',
        'signTime': '1635339462000',
        'serialNumber': '157'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110272058166296',
        'projectName': '72731',
        'licenseNumber': '闽BQ7801',
        'driverPhone': '15859101001',
        'fillTime': '1635339496000',
        'signTime': '1635339496000',
        'serialNumber': '157'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110272059298740',
        'projectName': '72731',
        'licenseNumber': '闽BQ7801',
        'driverPhone': '15859101001',
        'fillTime': '1635339569000',
        'signTime': '1635339569000',
        'serialNumber': '157'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110281051189058',
        'projectName': '72731',
        'licenseNumber': '闽BQ7801',
        'driverPhone': '15859101001',
        'fillTime': '1635389479000',
        'signTime': '1635389479000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110281051554780',
        'projectName': '72731',
        'licenseNumber': '闽BQ7801',
        'driverPhone': '15859101001',
        'fillTime': '1635389516000',
        'signTime': '1635389516000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110281052408754',
        'projectName': '72731',
        'licenseNumber': '闽BQ7801',
        'driverPhone': '15859101001',
        'fillTime': '1635389561000',
        'signTime': '1635389561000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110281053294497',
        'projectName': '72731',
        'licenseNumber': '闽BQ7801',
        'driverPhone': '15859101001',
        'fillTime': '1635389610000',
        'signTime': '1635389610000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110281054280667',
        'projectName': '72731',
        'licenseNumber': '闽BQ7801',
        'driverPhone': '15859101001',
        'fillTime': '1635389668000',
        'signTime': '1635389668000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110281055238727',
        'projectName': '72731',
        'licenseNumber': '闽BQ7801',
        'driverPhone': '15859101001',
        'fillTime': '1635389723000',
        'signTime': '1635389723000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110281057017097',
        'projectName': '72731',
        'licenseNumber': '闽BQ7801',
        'driverPhone': '15859101001',
        'fillTime': '1635389821000',
        'signTime': '1635389821000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110281108570566',
        'projectName': '72731',
        'licenseNumber': '闽BQ7802',
        'driverPhone': '15859101002',
        'fillTime': '1635390537000',
        'signTime': '1635390537000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110281109302534',
        'projectName': '72731',
        'licenseNumber': '闽BQ7802',
        'driverPhone': '15859101002',
        'fillTime': '1635390571000',
        'signTime': '1635390571000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110281110236080',
        'projectName': '72731',
        'licenseNumber': '闽BQ7802',
        'driverPhone': '15859101002',
        'fillTime': '1635390623000',
        'signTime': '1635390623000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110281111023618',
        'projectName': '72731',
        'licenseNumber': '闽BQ7802',
        'driverPhone': '15859101002',
        'fillTime': '1635390663000',
        'signTime': '1635390663000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110281111413997',
        'projectName': '72731',
        'licenseNumber': '闽BQ7802',
        'driverPhone': '15859101002',
        'fillTime': '1635390701000',
        'signTime': '1635390701000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110281112342732',
        'projectName': '72731',
        'licenseNumber': '闽BQ7802',
        'driverPhone': '15859101002',
        'fillTime': '1635390754000',
        'signTime': '1635390754000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110281113172977',
        'projectName': '72731',
        'licenseNumber': '闽BQ7802',
        'driverPhone': '15859101002',
        'fillTime': '1635390798000',
        'signTime': '1635390798000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110281114218928',
        'projectName': '72731',
        'licenseNumber': '闽BQ7802',
        'driverPhone': '15859101002',
        'fillTime': '1635390862000',
        'signTime': '1635390862000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110281115212237',
        'projectName': '72731',
        'licenseNumber': '闽BQ7802',
        'driverPhone': '15859101002',
        'fillTime': '1635390921000',
        'signTime': '1635390921000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110281116081769',
        'projectName': '72731',
        'licenseNumber': '闽BQ7802',
        'driverPhone': '15859101002',
        'fillTime': '1635390968000',
        'signTime': '1635390968000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110281116535972',
        'projectName': '72731',
        'licenseNumber': '闽BQ7802',
        'driverPhone': '15859101002',
        'fillTime': '1635391014000',
        'signTime': '1635391014000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110281118048652',
        'projectName': '72731',
        'licenseNumber': '闽BQ7802',
        'driverPhone': '15859101002',
        'fillTime': '1635391085000',
        'signTime': '1635391085000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110281118510090',
        'projectName': '72731',
        'licenseNumber': '闽BQ7802',
        'driverPhone': '15859101002',
        'fillTime': '1635391131000',
        'signTime': '1635391131000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110281119349749',
        'projectName': '72731',
        'licenseNumber': '闽BQ7802',
        'driverPhone': '15859101002',
        'fillTime': '1635391174000',
        'signTime': '1635391174000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110281121126842',
        'projectName': '72731',
        'licenseNumber': '闽BQ7802',
        'driverPhone': '15859101002',
        'fillTime': '1635391272000',
        'signTime': '1635391272000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110281122430352',
        'projectName': '72731',
        'licenseNumber': '闽BQ7802',
        'driverPhone': '15859101002',
        'fillTime': '1635391364000',
        'signTime': '1635391364000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110281125111347',
        'projectName': '72731',
        'licenseNumber': '闽BQ7802',
        'driverPhone': '15859101002',
        'fillTime': '1635391511000',
        'signTime': '1635391511000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110281128237324',
        'projectName': '72731',
        'licenseNumber': '闽BQ7802',
        'driverPhone': '15859101002',
        'fillTime': '1635391703000',
        'signTime': '1635391703000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110281133479295',
        'projectName': '72731',
        'licenseNumber': '闽BQ7802',
        'driverPhone': '15859101002',
        'fillTime': '1635392027000',
        'signTime': '1635392027000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110281134378083',
        'projectName': '72731',
        'licenseNumber': '闽BQ7802',
        'driverPhone': '15859101002',
        'fillTime': '1635392077000',
        'signTime': '1635392077000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110281135251180',
        'projectName': '72731',
        'licenseNumber': '闽BQ7802',
        'driverPhone': '15859101002',
        'fillTime': '1635392125000',
        'signTime': '1635392125000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110281137063354',
        'projectName': '72731',
        'licenseNumber': '闽BQ7802',
        'driverPhone': '15859101002',
        'fillTime': '1635392227000',
        'signTime': '1635392227000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110281335043806',
        'projectName': '72731',
        'licenseNumber': '闽BQ7802',
        'driverPhone': '15859101002',
        'fillTime': '1635399305000',
        'signTime': '1635399305000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110281336000644',
        'projectName': '72731',
        'licenseNumber': '闽BQ7802',
        'driverPhone': '15859101002',
        'fillTime': '1635399361000',
        'signTime': '1635399361000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110281336409518',
        'projectName': '72731',
        'licenseNumber': '闽BQ7802',
        'driverPhone': '15859101002',
        'fillTime': '1635399401000',
        'signTime': '1635399401000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110281337206949',
        'projectName': '72731',
        'licenseNumber': '闽BQ7802',
        'driverPhone': '15859101002',
        'fillTime': '1635399440000',
        'signTime': '1635399440000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110281338015165',
        'projectName': '72731',
        'licenseNumber': '闽BQ7802',
        'driverPhone': '15859101002',
        'fillTime': '1635399481000',
        'signTime': '1635399481000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110281339192280',
        'projectName': '72731',
        'licenseNumber': '闽BQ7802',
        'driverPhone': '15859101002',
        'fillTime': '1635399559000',
        'signTime': '1635399559000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110281340574688',
        'projectName': '72731',
        'licenseNumber': '闽BQ7802',
        'driverPhone': '15859101002',
        'fillTime': '1635399657000',
        'signTime': '1635399657000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110281343492473',
        'projectName': '72731',
        'licenseNumber': '闽BQ7802',
        'driverPhone': '15859101002',
        'fillTime': '1635399830000',
        'signTime': '1635399830000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110281344405858',
        'projectName': '72731',
        'licenseNumber': '闽BQ7802',
        'driverPhone': '15859101002',
        'fillTime': '1635399880000',
        'signTime': '1635399880000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110281345247364',
        'projectName': '72731',
        'licenseNumber': '闽BQ7802',
        'driverPhone': '15859101002',
        'fillTime': '1635399924000',
        'signTime': '1635399924000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110281345597340',
        'projectName': '72731',
        'licenseNumber': '闽BQ7802',
        'driverPhone': '15859101002',
        'fillTime': '1635399959000',
        'signTime': '1635399959000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110281346352346',
        'projectName': '72731',
        'licenseNumber': '闽BQ7802',
        'driverPhone': '15859101002',
        'fillTime': '1635399996000',
        'signTime': '1635399996000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110281347126489',
        'projectName': '72731',
        'licenseNumber': '闽BQ7802',
        'driverPhone': '15859101002',
        'fillTime': '1635400033000',
        'signTime': '1635400033000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110281347490711',
        'projectName': '72731',
        'licenseNumber': '闽BQ7802',
        'driverPhone': '15859101002',
        'fillTime': '1635400069000',
        'signTime': '1635400069000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110281348495361',
        'projectName': '72731',
        'licenseNumber': '闽BQ7802',
        'driverPhone': '15859101002',
        'fillTime': '1635400129000',
        'signTime': '1635400129000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110281349262909',
        'projectName': '72731',
        'licenseNumber': '闽BQ7802',
        'driverPhone': '15859101002',
        'fillTime': '1635400167000',
        'signTime': '1635400167000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110281350047811',
        'projectName': '72731',
        'licenseNumber': '闽BQ7802',
        'driverPhone': '15859101002',
        'fillTime': '1635400204000',
        'signTime': '1635400204000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110281350478056',
        'projectName': '72731',
        'licenseNumber': '闽BQ7802',
        'driverPhone': '15859101002',
        'fillTime': '1635400247000',
        'signTime': '1635400247000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110281351231610',
        'projectName': '72731',
        'licenseNumber': '闽BQ7802',
        'driverPhone': '15859101002',
        'fillTime': '1635400283000',
        'signTime': '1635400283000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110281352072508',
        'projectName': '72731',
        'licenseNumber': '闽BQ7802',
        'driverPhone': '15859101002',
        'fillTime': '1635400327000',
        'signTime': '1635400327000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110281352448066',
        'projectName': '72731',
        'licenseNumber': '闽BQ7802',
        'driverPhone': '15859101002',
        'fillTime': '1635400364000',
        'signTime': '1635400364000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110281353164901',
        'projectName': '72731',
        'licenseNumber': '闽BQ7802',
        'driverPhone': '15859101002',
        'fillTime': '1635400396000',
        'signTime': '1635400396000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110281353548511',
        'projectName': '72731',
        'licenseNumber': '闽BQ7802',
        'driverPhone': '15859101002',
        'fillTime': '1635400434000',
        'signTime': '1635400434000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110281354351601',
        'projectName': '72731',
        'licenseNumber': '闽BQ7802',
        'driverPhone': '15859101002',
        'fillTime': '1635400475000',
        'signTime': '1635400475000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110281355096274',
        'projectName': '72731',
        'licenseNumber': '闽BQ7802',
        'driverPhone': '15859101002',
        'fillTime': '1635400509000',
        'signTime': '1635400509000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110281355520702',
        'projectName': '72731',
        'licenseNumber': '闽BQ7802',
        'driverPhone': '15859101002',
        'fillTime': '1635400552000',
        'signTime': '1635400552000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110281356280861',
        'projectName': '72731',
        'licenseNumber': '闽BQ7802',
        'driverPhone': '15859101002',
        'fillTime': '1635400588000',
        'signTime': '1635400588000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110281357327097',
        'projectName': '72731',
        'licenseNumber': '闽BQ7802',
        'driverPhone': '15859101002',
        'fillTime': '1635400652000',
        'signTime': '1635400652000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110281358093255',
        'projectName': '72731',
        'licenseNumber': '闽BQ7802',
        'driverPhone': '15859101002',
        'fillTime': '1635400689000',
        'signTime': '1635400689000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110281359246951',
        'projectName': '72731',
        'licenseNumber': '闽BQ7802',
        'driverPhone': '15859101002',
        'fillTime': '1635400764000',
        'signTime': '1635400764000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110281400052786',
        'projectName': '72731',
        'licenseNumber': '闽BQ7802',
        'driverPhone': '15859101002',
        'fillTime': '1635400805000',
        'signTime': '1635400805000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110281400585004',
        'projectName': '72731',
        'licenseNumber': '闽BQ7802',
        'driverPhone': '15859101002',
        'fillTime': '1635400859000',
        'signTime': '1635400859000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110281406075289',
        'projectName': '72731',
        'licenseNumber': '闽BQ7802',
        'driverPhone': '15859101002',
        'fillTime': '1635401168000',
        'signTime': '1635401168000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110281407400589',
        'projectName': '72731',
        'licenseNumber': '闽BQ7802',
        'driverPhone': '15859101002',
        'fillTime': '1635401261000',
        'signTime': '1635401261000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110281408246156',
        'projectName': '72731',
        'licenseNumber': '闽BQ7802',
        'driverPhone': '15859101002',
        'fillTime': '1635401304000',
        'signTime': '1635401304000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110281409221479',
        'projectName': '72731',
        'licenseNumber': '闽BQ7802',
        'driverPhone': '15859101002',
        'fillTime': '1635401362000',
        'signTime': '1635401362000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110281410047848',
        'projectName': '72731',
        'licenseNumber': '闽BQ7802',
        'driverPhone': '15859101002',
        'fillTime': '1635401404000',
        'signTime': '1635401404000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110281411005539',
        'projectName': '72731',
        'licenseNumber': '闽BQ7802',
        'driverPhone': '15859101002',
        'fillTime': '1635401460000',
        'signTime': '1635401460000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110281411452612',
        'projectName': '72731',
        'licenseNumber': '闽BQ7802',
        'driverPhone': '15859101002',
        'fillTime': '1635401505000',
        'signTime': '1635401505000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110281413200569',
        'projectName': '72731',
        'licenseNumber': '闽BQ7802',
        'driverPhone': '15859101002',
        'fillTime': '1635401600000',
        'signTime': '1635401600000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110281437396617',
        'projectName': '72731',
        'licenseNumber': '闽BQ7802',
        'driverPhone': '15859101002',
        'fillTime': '1635403059000',
        'signTime': '1635403059000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110281438191109',
        'projectName': '72731',
        'licenseNumber': '闽BQ7802',
        'driverPhone': '15859101002',
        'fillTime': '1635403100000',
        'signTime': '1635403100000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110281438589887',
        'projectName': '72731',
        'licenseNumber': '闽BQ7802',
        'driverPhone': '15859101002',
        'fillTime': '1635403138000',
        'signTime': '1635403138000',
        'serialNumber': '147'
      }
    ],
    'userInfo': {
      'project_id': '72731',
      'team_telno': '15859102001',
      'issuing_telno': '15859109601',
      'issuing_time': '1635403138000',
      'issuing_pc': '1635403844258564',
      'icType': 'r'
    },
    'meter': [
      '1010',
      '2'
    ],
    'userMark': '1000|4|'
  },
  {
    'projectName': '100条项目',
    'loadUnloadType': '1001',
    'loadUnloadTypeStr': '渣土场',
    'muckyardName': '0907渣1-细沙',
    'loadTime': '2021-10-27 20:54:11',
    'unloadTime': '2021-10-27 20:54:41',
    'waybillCode': '8aa3846fd7de4121b0eb6bf040095a3e',
    'waybillNo': '2110272054113019',
    'orderCode': '110949797271486aa198a8ff3e64153c',
    'goodsTypeName': '细沙',
    'driverName': '测试',
    'driverPhone': '15859101001',
    'licenseNumber': '闽BQ7801',
    'GetCardNo': {
      'success': true,
      'code': '0000',
      'data': 110030265,
      'source': 'GetCardNo,2,True,B9ED8E0600000000'
    },
    'dataList': [
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110272025198140',
        'projectName': '72731',
        'licenseNumber': '闽BQ7801',
        'driverPhone': '15859101001',
        'fillTime': '1635337520000',
        'signTime': '1635337520000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110272029292976',
        'projectName': '72731',
        'licenseNumber': '闽BQ7801',
        'driverPhone': '15859101001',
        'fillTime': '1635337769000',
        'signTime': '1635337769000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110272030089762',
        'projectName': '72731',
        'licenseNumber': '闽BQ7801',
        'driverPhone': '15859101001',
        'fillTime': '1635337808000',
        'signTime': '1635337808000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110272032106344',
        'projectName': '72731',
        'licenseNumber': '闽BQ7801',
        'driverPhone': '15859101001',
        'fillTime': '1635337931000',
        'signTime': '1635337931000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110272032432975',
        'projectName': '72731',
        'licenseNumber': '闽BQ7801',
        'driverPhone': '15859101001',
        'fillTime': '1635337963000',
        'signTime': '1635337963000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110272033233861',
        'projectName': '72731',
        'licenseNumber': '闽BQ7801',
        'driverPhone': '15859101001',
        'fillTime': '1635338004000',
        'signTime': '1635338004000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110272034162414',
        'projectName': '72731',
        'licenseNumber': '闽BQ7801',
        'driverPhone': '15859101001',
        'fillTime': '1635338061000',
        'signTime': '1635338061000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110272035196738',
        'projectName': '72731',
        'licenseNumber': '闽BQ7801',
        'driverPhone': '15859101001',
        'fillTime': '1635338120000',
        'signTime': '1635338120000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110272037390197',
        'projectName': '72731',
        'licenseNumber': '闽BQ7801',
        'driverPhone': '15859101001',
        'fillTime': '1635338259000',
        'signTime': '1635338259000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110272039198235',
        'projectName': '72731',
        'licenseNumber': '闽BQ7801',
        'driverPhone': '15859101001',
        'fillTime': '1635338359000',
        'signTime': '1635338359000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110272039480730',
        'projectName': '72731',
        'licenseNumber': '闽BQ7801',
        'driverPhone': '15859101001',
        'fillTime': '1635338388000',
        'signTime': '1635338388000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110272040174465',
        'projectName': '72731',
        'licenseNumber': '闽BQ7801',
        'driverPhone': '15859101001',
        'fillTime': '1635338417000',
        'signTime': '1635338417000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110272040461885',
        'projectName': '72731',
        'licenseNumber': '闽BQ7801',
        'driverPhone': '15859101001',
        'fillTime': '1635338446000',
        'signTime': '1635338446000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110272041341258',
        'projectName': '72731',
        'licenseNumber': '闽BQ7801',
        'driverPhone': '15859101001',
        'fillTime': '1635338494000',
        'signTime': '1635338494000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110272043467426',
        'projectName': '72731',
        'licenseNumber': '闽BQ7801',
        'driverPhone': '15859101001',
        'fillTime': '1635338626000',
        'signTime': '1635338626000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110272047431703',
        'projectName': '72731',
        'licenseNumber': '闽BQ7801',
        'driverPhone': '15859101001',
        'fillTime': '1635338864000',
        'signTime': '1635338864000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110272048047399',
        'projectName': '72731',
        'licenseNumber': '闽BQ7801',
        'driverPhone': '15859101001',
        'fillTime': '1635338884000',
        'signTime': '1635338884000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110272049215217',
        'projectName': '72731',
        'licenseNumber': '闽BQ7801',
        'driverPhone': '15859101001',
        'fillTime': '1635338961000',
        'signTime': '1635338961000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110272049574954',
        'projectName': '72731',
        'licenseNumber': '闽BQ7801',
        'driverPhone': '15859101001',
        'fillTime': '1635338997000',
        'signTime': '1635338997000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110272050276492',
        'projectName': '72731',
        'licenseNumber': '闽BQ7801',
        'driverPhone': '15859101001',
        'fillTime': '1635339028000',
        'signTime': '1635339028000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110272051340701',
        'projectName': '72731',
        'licenseNumber': '闽BQ7801',
        'driverPhone': '15859101001',
        'fillTime': '1635339095000',
        'signTime': '1635339095000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110272052410020',
        'projectName': '72731',
        'licenseNumber': '闽BQ7801',
        'driverPhone': '15859101001',
        'fillTime': '1635339161000',
        'signTime': '1635339161000',
        'serialNumber': '157'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110272053296764',
        'projectName': '72731',
        'licenseNumber': '闽BQ7801',
        'driverPhone': '15859101001',
        'fillTime': '1635339209000',
        'signTime': '1635339209000',
        'serialNumber': '157'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110272054113019',
        'projectName': '72731',
        'licenseNumber': '闽BQ7801',
        'driverPhone': '15859101001',
        'fillTime': '1635339251000',
        'signTime': '1635339251000',
        'serialNumber': '157'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110272054456514',
        'projectName': '72731',
        'licenseNumber': '闽BQ7801',
        'driverPhone': '15859101001',
        'fillTime': '1635339285000',
        'signTime': '1635339285000',
        'serialNumber': '157'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110272055408363',
        'projectName': '72731',
        'licenseNumber': '闽BQ7801',
        'driverPhone': '15859101001',
        'fillTime': '1635339341000',
        'signTime': '1635339341000',
        'serialNumber': '157'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110272056176589',
        'projectName': '72731',
        'licenseNumber': '闽BQ7801',
        'driverPhone': '15859101001',
        'fillTime': '1635339377000',
        'signTime': '1635339377000',
        'serialNumber': '157'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110272057075827',
        'projectName': '72731',
        'licenseNumber': '闽BQ7801',
        'driverPhone': '15859101001',
        'fillTime': '1635339428000',
        'signTime': '1635339428000',
        'serialNumber': '157'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110272057414303',
        'projectName': '72731',
        'licenseNumber': '闽BQ7801',
        'driverPhone': '15859101001',
        'fillTime': '1635339462000',
        'signTime': '1635339462000',
        'serialNumber': '157'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110272058166296',
        'projectName': '72731',
        'licenseNumber': '闽BQ7801',
        'driverPhone': '15859101001',
        'fillTime': '1635339496000',
        'signTime': '1635339496000',
        'serialNumber': '157'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110272059298740',
        'projectName': '72731',
        'licenseNumber': '闽BQ7801',
        'driverPhone': '15859101001',
        'fillTime': '1635339569000',
        'signTime': '1635339569000',
        'serialNumber': '157'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110281051189058',
        'projectName': '72731',
        'licenseNumber': '闽BQ7801',
        'driverPhone': '15859101001',
        'fillTime': '1635389479000',
        'signTime': '1635389479000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110281051554780',
        'projectName': '72731',
        'licenseNumber': '闽BQ7801',
        'driverPhone': '15859101001',
        'fillTime': '1635389516000',
        'signTime': '1635389516000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110281052408754',
        'projectName': '72731',
        'licenseNumber': '闽BQ7801',
        'driverPhone': '15859101001',
        'fillTime': '1635389561000',
        'signTime': '1635389561000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110281053294497',
        'projectName': '72731',
        'licenseNumber': '闽BQ7801',
        'driverPhone': '15859101001',
        'fillTime': '1635389610000',
        'signTime': '1635389610000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110281054280667',
        'projectName': '72731',
        'licenseNumber': '闽BQ7801',
        'driverPhone': '15859101001',
        'fillTime': '1635389668000',
        'signTime': '1635389668000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110281055238727',
        'projectName': '72731',
        'licenseNumber': '闽BQ7801',
        'driverPhone': '15859101001',
        'fillTime': '1635389723000',
        'signTime': '1635389723000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110281057017097',
        'projectName': '72731',
        'licenseNumber': '闽BQ7801',
        'driverPhone': '15859101001',
        'fillTime': '1635389821000',
        'signTime': '1635389821000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110281108570566',
        'projectName': '72731',
        'licenseNumber': '闽BQ7802',
        'driverPhone': '15859101002',
        'fillTime': '1635390537000',
        'signTime': '1635390537000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110281109302534',
        'projectName': '72731',
        'licenseNumber': '闽BQ7802',
        'driverPhone': '15859101002',
        'fillTime': '1635390571000',
        'signTime': '1635390571000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110281110236080',
        'projectName': '72731',
        'licenseNumber': '闽BQ7802',
        'driverPhone': '15859101002',
        'fillTime': '1635390623000',
        'signTime': '1635390623000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110281111023618',
        'projectName': '72731',
        'licenseNumber': '闽BQ7802',
        'driverPhone': '15859101002',
        'fillTime': '1635390663000',
        'signTime': '1635390663000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110281111413997',
        'projectName': '72731',
        'licenseNumber': '闽BQ7802',
        'driverPhone': '15859101002',
        'fillTime': '1635390701000',
        'signTime': '1635390701000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110281112342732',
        'projectName': '72731',
        'licenseNumber': '闽BQ7802',
        'driverPhone': '15859101002',
        'fillTime': '1635390754000',
        'signTime': '1635390754000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110281113172977',
        'projectName': '72731',
        'licenseNumber': '闽BQ7802',
        'driverPhone': '15859101002',
        'fillTime': '1635390798000',
        'signTime': '1635390798000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110281114218928',
        'projectName': '72731',
        'licenseNumber': '闽BQ7802',
        'driverPhone': '15859101002',
        'fillTime': '1635390862000',
        'signTime': '1635390862000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110281115212237',
        'projectName': '72731',
        'licenseNumber': '闽BQ7802',
        'driverPhone': '15859101002',
        'fillTime': '1635390921000',
        'signTime': '1635390921000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110281116081769',
        'projectName': '72731',
        'licenseNumber': '闽BQ7802',
        'driverPhone': '15859101002',
        'fillTime': '1635390968000',
        'signTime': '1635390968000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110281116535972',
        'projectName': '72731',
        'licenseNumber': '闽BQ7802',
        'driverPhone': '15859101002',
        'fillTime': '1635391014000',
        'signTime': '1635391014000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110281118048652',
        'projectName': '72731',
        'licenseNumber': '闽BQ7802',
        'driverPhone': '15859101002',
        'fillTime': '1635391085000',
        'signTime': '1635391085000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110281118510090',
        'projectName': '72731',
        'licenseNumber': '闽BQ7802',
        'driverPhone': '15859101002',
        'fillTime': '1635391131000',
        'signTime': '1635391131000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110281119349749',
        'projectName': '72731',
        'licenseNumber': '闽BQ7802',
        'driverPhone': '15859101002',
        'fillTime': '1635391174000',
        'signTime': '1635391174000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110281121126842',
        'projectName': '72731',
        'licenseNumber': '闽BQ7802',
        'driverPhone': '15859101002',
        'fillTime': '1635391272000',
        'signTime': '1635391272000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110281122430352',
        'projectName': '72731',
        'licenseNumber': '闽BQ7802',
        'driverPhone': '15859101002',
        'fillTime': '1635391364000',
        'signTime': '1635391364000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110281125111347',
        'projectName': '72731',
        'licenseNumber': '闽BQ7802',
        'driverPhone': '15859101002',
        'fillTime': '1635391511000',
        'signTime': '1635391511000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110281128237324',
        'projectName': '72731',
        'licenseNumber': '闽BQ7802',
        'driverPhone': '15859101002',
        'fillTime': '1635391703000',
        'signTime': '1635391703000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110281133479295',
        'projectName': '72731',
        'licenseNumber': '闽BQ7802',
        'driverPhone': '15859101002',
        'fillTime': '1635392027000',
        'signTime': '1635392027000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110281134378083',
        'projectName': '72731',
        'licenseNumber': '闽BQ7802',
        'driverPhone': '15859101002',
        'fillTime': '1635392077000',
        'signTime': '1635392077000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110281135251180',
        'projectName': '72731',
        'licenseNumber': '闽BQ7802',
        'driverPhone': '15859101002',
        'fillTime': '1635392125000',
        'signTime': '1635392125000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110281137063354',
        'projectName': '72731',
        'licenseNumber': '闽BQ7802',
        'driverPhone': '15859101002',
        'fillTime': '1635392227000',
        'signTime': '1635392227000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110281335043806',
        'projectName': '72731',
        'licenseNumber': '闽BQ7802',
        'driverPhone': '15859101002',
        'fillTime': '1635399305000',
        'signTime': '1635399305000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110281336000644',
        'projectName': '72731',
        'licenseNumber': '闽BQ7802',
        'driverPhone': '15859101002',
        'fillTime': '1635399361000',
        'signTime': '1635399361000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110281336409518',
        'projectName': '72731',
        'licenseNumber': '闽BQ7802',
        'driverPhone': '15859101002',
        'fillTime': '1635399401000',
        'signTime': '1635399401000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110281337206949',
        'projectName': '72731',
        'licenseNumber': '闽BQ7802',
        'driverPhone': '15859101002',
        'fillTime': '1635399440000',
        'signTime': '1635399440000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110281338015165',
        'projectName': '72731',
        'licenseNumber': '闽BQ7802',
        'driverPhone': '15859101002',
        'fillTime': '1635399481000',
        'signTime': '1635399481000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110281339192280',
        'projectName': '72731',
        'licenseNumber': '闽BQ7802',
        'driverPhone': '15859101002',
        'fillTime': '1635399559000',
        'signTime': '1635399559000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110281340574688',
        'projectName': '72731',
        'licenseNumber': '闽BQ7802',
        'driverPhone': '15859101002',
        'fillTime': '1635399657000',
        'signTime': '1635399657000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110281343492473',
        'projectName': '72731',
        'licenseNumber': '闽BQ7802',
        'driverPhone': '15859101002',
        'fillTime': '1635399830000',
        'signTime': '1635399830000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110281344405858',
        'projectName': '72731',
        'licenseNumber': '闽BQ7802',
        'driverPhone': '15859101002',
        'fillTime': '1635399880000',
        'signTime': '1635399880000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110281345247364',
        'projectName': '72731',
        'licenseNumber': '闽BQ7802',
        'driverPhone': '15859101002',
        'fillTime': '1635399924000',
        'signTime': '1635399924000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110281345597340',
        'projectName': '72731',
        'licenseNumber': '闽BQ7802',
        'driverPhone': '15859101002',
        'fillTime': '1635399959000',
        'signTime': '1635399959000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110281346352346',
        'projectName': '72731',
        'licenseNumber': '闽BQ7802',
        'driverPhone': '15859101002',
        'fillTime': '1635399996000',
        'signTime': '1635399996000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110281347126489',
        'projectName': '72731',
        'licenseNumber': '闽BQ7802',
        'driverPhone': '15859101002',
        'fillTime': '1635400033000',
        'signTime': '1635400033000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110281347490711',
        'projectName': '72731',
        'licenseNumber': '闽BQ7802',
        'driverPhone': '15859101002',
        'fillTime': '1635400069000',
        'signTime': '1635400069000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110281348495361',
        'projectName': '72731',
        'licenseNumber': '闽BQ7802',
        'driverPhone': '15859101002',
        'fillTime': '1635400129000',
        'signTime': '1635400129000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110281349262909',
        'projectName': '72731',
        'licenseNumber': '闽BQ7802',
        'driverPhone': '15859101002',
        'fillTime': '1635400167000',
        'signTime': '1635400167000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110281350047811',
        'projectName': '72731',
        'licenseNumber': '闽BQ7802',
        'driverPhone': '15859101002',
        'fillTime': '1635400204000',
        'signTime': '1635400204000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110281350478056',
        'projectName': '72731',
        'licenseNumber': '闽BQ7802',
        'driverPhone': '15859101002',
        'fillTime': '1635400247000',
        'signTime': '1635400247000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110281351231610',
        'projectName': '72731',
        'licenseNumber': '闽BQ7802',
        'driverPhone': '15859101002',
        'fillTime': '1635400283000',
        'signTime': '1635400283000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110281352072508',
        'projectName': '72731',
        'licenseNumber': '闽BQ7802',
        'driverPhone': '15859101002',
        'fillTime': '1635400327000',
        'signTime': '1635400327000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110281352448066',
        'projectName': '72731',
        'licenseNumber': '闽BQ7802',
        'driverPhone': '15859101002',
        'fillTime': '1635400364000',
        'signTime': '1635400364000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110281353164901',
        'projectName': '72731',
        'licenseNumber': '闽BQ7802',
        'driverPhone': '15859101002',
        'fillTime': '1635400396000',
        'signTime': '1635400396000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110281353548511',
        'projectName': '72731',
        'licenseNumber': '闽BQ7802',
        'driverPhone': '15859101002',
        'fillTime': '1635400434000',
        'signTime': '1635400434000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110281354351601',
        'projectName': '72731',
        'licenseNumber': '闽BQ7802',
        'driverPhone': '15859101002',
        'fillTime': '1635400475000',
        'signTime': '1635400475000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110281355096274',
        'projectName': '72731',
        'licenseNumber': '闽BQ7802',
        'driverPhone': '15859101002',
        'fillTime': '1635400509000',
        'signTime': '1635400509000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110281355520702',
        'projectName': '72731',
        'licenseNumber': '闽BQ7802',
        'driverPhone': '15859101002',
        'fillTime': '1635400552000',
        'signTime': '1635400552000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110281356280861',
        'projectName': '72731',
        'licenseNumber': '闽BQ7802',
        'driverPhone': '15859101002',
        'fillTime': '1635400588000',
        'signTime': '1635400588000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110281357327097',
        'projectName': '72731',
        'licenseNumber': '闽BQ7802',
        'driverPhone': '15859101002',
        'fillTime': '1635400652000',
        'signTime': '1635400652000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110281358093255',
        'projectName': '72731',
        'licenseNumber': '闽BQ7802',
        'driverPhone': '15859101002',
        'fillTime': '1635400689000',
        'signTime': '1635400689000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110281359246951',
        'projectName': '72731',
        'licenseNumber': '闽BQ7802',
        'driverPhone': '15859101002',
        'fillTime': '1635400764000',
        'signTime': '1635400764000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110281400052786',
        'projectName': '72731',
        'licenseNumber': '闽BQ7802',
        'driverPhone': '15859101002',
        'fillTime': '1635400805000',
        'signTime': '1635400805000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110281400585004',
        'projectName': '72731',
        'licenseNumber': '闽BQ7802',
        'driverPhone': '15859101002',
        'fillTime': '1635400859000',
        'signTime': '1635400859000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110281406075289',
        'projectName': '72731',
        'licenseNumber': '闽BQ7802',
        'driverPhone': '15859101002',
        'fillTime': '1635401168000',
        'signTime': '1635401168000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110281407400589',
        'projectName': '72731',
        'licenseNumber': '闽BQ7802',
        'driverPhone': '15859101002',
        'fillTime': '1635401261000',
        'signTime': '1635401261000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110281408246156',
        'projectName': '72731',
        'licenseNumber': '闽BQ7802',
        'driverPhone': '15859101002',
        'fillTime': '1635401304000',
        'signTime': '1635401304000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110281409221479',
        'projectName': '72731',
        'licenseNumber': '闽BQ7802',
        'driverPhone': '15859101002',
        'fillTime': '1635401362000',
        'signTime': '1635401362000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110281410047848',
        'projectName': '72731',
        'licenseNumber': '闽BQ7802',
        'driverPhone': '15859101002',
        'fillTime': '1635401404000',
        'signTime': '1635401404000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110281411005539',
        'projectName': '72731',
        'licenseNumber': '闽BQ7802',
        'driverPhone': '15859101002',
        'fillTime': '1635401460000',
        'signTime': '1635401460000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110281411452612',
        'projectName': '72731',
        'licenseNumber': '闽BQ7802',
        'driverPhone': '15859101002',
        'fillTime': '1635401505000',
        'signTime': '1635401505000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110281413200569',
        'projectName': '72731',
        'licenseNumber': '闽BQ7802',
        'driverPhone': '15859101002',
        'fillTime': '1635401600000',
        'signTime': '1635401600000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110281437396617',
        'projectName': '72731',
        'licenseNumber': '闽BQ7802',
        'driverPhone': '15859101002',
        'fillTime': '1635403059000',
        'signTime': '1635403059000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110281438191109',
        'projectName': '72731',
        'licenseNumber': '闽BQ7802',
        'driverPhone': '15859101002',
        'fillTime': '1635403100000',
        'signTime': '1635403100000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110281438589887',
        'projectName': '72731',
        'licenseNumber': '闽BQ7802',
        'driverPhone': '15859101002',
        'fillTime': '1635403138000',
        'signTime': '1635403138000',
        'serialNumber': '147'
      }
    ],
    'userInfo': {
      'project_id': '72731',
      'team_telno': '15859102001',
      'issuing_telno': '15859109601',
      'issuing_time': '1635403138000',
      'issuing_pc': '1635403844258564',
      'icType': 'r'
    },
    'meter': [
      '1010',
      '2'
    ],
    'userMark': '1000|4|'
  },
  {
    'projectName': '100条项目',
    'loadUnloadType': '1001',
    'loadUnloadTypeStr': '渣土场',
    'muckyardName': '0907渣1-细沙',
    'loadTime': '2021-10-27 20:54:45',
    'unloadTime': '2021-10-27 20:55:36',
    'waybillCode': 'e6ec83cb068649d48bcbca8dd71ab890',
    'waybillNo': '2110272054456514',
    'orderCode': '110949797271486aa198a8ff3e64153c',
    'goodsTypeName': '细沙',
    'driverName': '测试',
    'driverPhone': '15859101001',
    'licenseNumber': '闽BQ7801',
    'GetCardNo': {
      'success': true,
      'code': '0000',
      'data': 110030265,
      'source': 'GetCardNo,2,True,B9ED8E0600000000'
    },
    'dataList': [
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110272025198140',
        'projectName': '72731',
        'licenseNumber': '闽BQ7801',
        'driverPhone': '15859101001',
        'fillTime': '1635337520000',
        'signTime': '1635337520000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110272029292976',
        'projectName': '72731',
        'licenseNumber': '闽BQ7801',
        'driverPhone': '15859101001',
        'fillTime': '1635337769000',
        'signTime': '1635337769000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110272030089762',
        'projectName': '72731',
        'licenseNumber': '闽BQ7801',
        'driverPhone': '15859101001',
        'fillTime': '1635337808000',
        'signTime': '1635337808000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110272032106344',
        'projectName': '72731',
        'licenseNumber': '闽BQ7801',
        'driverPhone': '15859101001',
        'fillTime': '1635337931000',
        'signTime': '1635337931000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110272032432975',
        'projectName': '72731',
        'licenseNumber': '闽BQ7801',
        'driverPhone': '15859101001',
        'fillTime': '1635337963000',
        'signTime': '1635337963000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110272033233861',
        'projectName': '72731',
        'licenseNumber': '闽BQ7801',
        'driverPhone': '15859101001',
        'fillTime': '1635338004000',
        'signTime': '1635338004000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110272034162414',
        'projectName': '72731',
        'licenseNumber': '闽BQ7801',
        'driverPhone': '15859101001',
        'fillTime': '1635338061000',
        'signTime': '1635338061000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110272035196738',
        'projectName': '72731',
        'licenseNumber': '闽BQ7801',
        'driverPhone': '15859101001',
        'fillTime': '1635338120000',
        'signTime': '1635338120000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110272037390197',
        'projectName': '72731',
        'licenseNumber': '闽BQ7801',
        'driverPhone': '15859101001',
        'fillTime': '1635338259000',
        'signTime': '1635338259000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110272039198235',
        'projectName': '72731',
        'licenseNumber': '闽BQ7801',
        'driverPhone': '15859101001',
        'fillTime': '1635338359000',
        'signTime': '1635338359000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110272039480730',
        'projectName': '72731',
        'licenseNumber': '闽BQ7801',
        'driverPhone': '15859101001',
        'fillTime': '1635338388000',
        'signTime': '1635338388000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110272040174465',
        'projectName': '72731',
        'licenseNumber': '闽BQ7801',
        'driverPhone': '15859101001',
        'fillTime': '1635338417000',
        'signTime': '1635338417000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110272040461885',
        'projectName': '72731',
        'licenseNumber': '闽BQ7801',
        'driverPhone': '15859101001',
        'fillTime': '1635338446000',
        'signTime': '1635338446000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110272041341258',
        'projectName': '72731',
        'licenseNumber': '闽BQ7801',
        'driverPhone': '15859101001',
        'fillTime': '1635338494000',
        'signTime': '1635338494000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110272043467426',
        'projectName': '72731',
        'licenseNumber': '闽BQ7801',
        'driverPhone': '15859101001',
        'fillTime': '1635338626000',
        'signTime': '1635338626000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110272047431703',
        'projectName': '72731',
        'licenseNumber': '闽BQ7801',
        'driverPhone': '15859101001',
        'fillTime': '1635338864000',
        'signTime': '1635338864000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110272048047399',
        'projectName': '72731',
        'licenseNumber': '闽BQ7801',
        'driverPhone': '15859101001',
        'fillTime': '1635338884000',
        'signTime': '1635338884000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110272049215217',
        'projectName': '72731',
        'licenseNumber': '闽BQ7801',
        'driverPhone': '15859101001',
        'fillTime': '1635338961000',
        'signTime': '1635338961000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110272049574954',
        'projectName': '72731',
        'licenseNumber': '闽BQ7801',
        'driverPhone': '15859101001',
        'fillTime': '1635338997000',
        'signTime': '1635338997000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110272050276492',
        'projectName': '72731',
        'licenseNumber': '闽BQ7801',
        'driverPhone': '15859101001',
        'fillTime': '1635339028000',
        'signTime': '1635339028000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110272051340701',
        'projectName': '72731',
        'licenseNumber': '闽BQ7801',
        'driverPhone': '15859101001',
        'fillTime': '1635339095000',
        'signTime': '1635339095000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110272052410020',
        'projectName': '72731',
        'licenseNumber': '闽BQ7801',
        'driverPhone': '15859101001',
        'fillTime': '1635339161000',
        'signTime': '1635339161000',
        'serialNumber': '157'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110272053296764',
        'projectName': '72731',
        'licenseNumber': '闽BQ7801',
        'driverPhone': '15859101001',
        'fillTime': '1635339209000',
        'signTime': '1635339209000',
        'serialNumber': '157'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110272054113019',
        'projectName': '72731',
        'licenseNumber': '闽BQ7801',
        'driverPhone': '15859101001',
        'fillTime': '1635339251000',
        'signTime': '1635339251000',
        'serialNumber': '157'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110272054456514',
        'projectName': '72731',
        'licenseNumber': '闽BQ7801',
        'driverPhone': '15859101001',
        'fillTime': '1635339285000',
        'signTime': '1635339285000',
        'serialNumber': '157'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110272055408363',
        'projectName': '72731',
        'licenseNumber': '闽BQ7801',
        'driverPhone': '15859101001',
        'fillTime': '1635339341000',
        'signTime': '1635339341000',
        'serialNumber': '157'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110272056176589',
        'projectName': '72731',
        'licenseNumber': '闽BQ7801',
        'driverPhone': '15859101001',
        'fillTime': '1635339377000',
        'signTime': '1635339377000',
        'serialNumber': '157'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110272057075827',
        'projectName': '72731',
        'licenseNumber': '闽BQ7801',
        'driverPhone': '15859101001',
        'fillTime': '1635339428000',
        'signTime': '1635339428000',
        'serialNumber': '157'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110272057414303',
        'projectName': '72731',
        'licenseNumber': '闽BQ7801',
        'driverPhone': '15859101001',
        'fillTime': '1635339462000',
        'signTime': '1635339462000',
        'serialNumber': '157'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110272058166296',
        'projectName': '72731',
        'licenseNumber': '闽BQ7801',
        'driverPhone': '15859101001',
        'fillTime': '1635339496000',
        'signTime': '1635339496000',
        'serialNumber': '157'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110272059298740',
        'projectName': '72731',
        'licenseNumber': '闽BQ7801',
        'driverPhone': '15859101001',
        'fillTime': '1635339569000',
        'signTime': '1635339569000',
        'serialNumber': '157'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110281051189058',
        'projectName': '72731',
        'licenseNumber': '闽BQ7801',
        'driverPhone': '15859101001',
        'fillTime': '1635389479000',
        'signTime': '1635389479000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110281051554780',
        'projectName': '72731',
        'licenseNumber': '闽BQ7801',
        'driverPhone': '15859101001',
        'fillTime': '1635389516000',
        'signTime': '1635389516000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110281052408754',
        'projectName': '72731',
        'licenseNumber': '闽BQ7801',
        'driverPhone': '15859101001',
        'fillTime': '1635389561000',
        'signTime': '1635389561000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110281053294497',
        'projectName': '72731',
        'licenseNumber': '闽BQ7801',
        'driverPhone': '15859101001',
        'fillTime': '1635389610000',
        'signTime': '1635389610000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110281054280667',
        'projectName': '72731',
        'licenseNumber': '闽BQ7801',
        'driverPhone': '15859101001',
        'fillTime': '1635389668000',
        'signTime': '1635389668000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110281055238727',
        'projectName': '72731',
        'licenseNumber': '闽BQ7801',
        'driverPhone': '15859101001',
        'fillTime': '1635389723000',
        'signTime': '1635389723000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110281057017097',
        'projectName': '72731',
        'licenseNumber': '闽BQ7801',
        'driverPhone': '15859101001',
        'fillTime': '1635389821000',
        'signTime': '1635389821000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110281108570566',
        'projectName': '72731',
        'licenseNumber': '闽BQ7802',
        'driverPhone': '15859101002',
        'fillTime': '1635390537000',
        'signTime': '1635390537000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110281109302534',
        'projectName': '72731',
        'licenseNumber': '闽BQ7802',
        'driverPhone': '15859101002',
        'fillTime': '1635390571000',
        'signTime': '1635390571000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110281110236080',
        'projectName': '72731',
        'licenseNumber': '闽BQ7802',
        'driverPhone': '15859101002',
        'fillTime': '1635390623000',
        'signTime': '1635390623000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110281111023618',
        'projectName': '72731',
        'licenseNumber': '闽BQ7802',
        'driverPhone': '15859101002',
        'fillTime': '1635390663000',
        'signTime': '1635390663000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110281111413997',
        'projectName': '72731',
        'licenseNumber': '闽BQ7802',
        'driverPhone': '15859101002',
        'fillTime': '1635390701000',
        'signTime': '1635390701000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110281112342732',
        'projectName': '72731',
        'licenseNumber': '闽BQ7802',
        'driverPhone': '15859101002',
        'fillTime': '1635390754000',
        'signTime': '1635390754000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110281113172977',
        'projectName': '72731',
        'licenseNumber': '闽BQ7802',
        'driverPhone': '15859101002',
        'fillTime': '1635390798000',
        'signTime': '1635390798000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110281114218928',
        'projectName': '72731',
        'licenseNumber': '闽BQ7802',
        'driverPhone': '15859101002',
        'fillTime': '1635390862000',
        'signTime': '1635390862000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110281115212237',
        'projectName': '72731',
        'licenseNumber': '闽BQ7802',
        'driverPhone': '15859101002',
        'fillTime': '1635390921000',
        'signTime': '1635390921000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110281116081769',
        'projectName': '72731',
        'licenseNumber': '闽BQ7802',
        'driverPhone': '15859101002',
        'fillTime': '1635390968000',
        'signTime': '1635390968000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110281116535972',
        'projectName': '72731',
        'licenseNumber': '闽BQ7802',
        'driverPhone': '15859101002',
        'fillTime': '1635391014000',
        'signTime': '1635391014000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110281118048652',
        'projectName': '72731',
        'licenseNumber': '闽BQ7802',
        'driverPhone': '15859101002',
        'fillTime': '1635391085000',
        'signTime': '1635391085000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110281118510090',
        'projectName': '72731',
        'licenseNumber': '闽BQ7802',
        'driverPhone': '15859101002',
        'fillTime': '1635391131000',
        'signTime': '1635391131000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110281119349749',
        'projectName': '72731',
        'licenseNumber': '闽BQ7802',
        'driverPhone': '15859101002',
        'fillTime': '1635391174000',
        'signTime': '1635391174000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110281121126842',
        'projectName': '72731',
        'licenseNumber': '闽BQ7802',
        'driverPhone': '15859101002',
        'fillTime': '1635391272000',
        'signTime': '1635391272000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110281122430352',
        'projectName': '72731',
        'licenseNumber': '闽BQ7802',
        'driverPhone': '15859101002',
        'fillTime': '1635391364000',
        'signTime': '1635391364000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110281125111347',
        'projectName': '72731',
        'licenseNumber': '闽BQ7802',
        'driverPhone': '15859101002',
        'fillTime': '1635391511000',
        'signTime': '1635391511000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110281128237324',
        'projectName': '72731',
        'licenseNumber': '闽BQ7802',
        'driverPhone': '15859101002',
        'fillTime': '1635391703000',
        'signTime': '1635391703000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110281133479295',
        'projectName': '72731',
        'licenseNumber': '闽BQ7802',
        'driverPhone': '15859101002',
        'fillTime': '1635392027000',
        'signTime': '1635392027000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110281134378083',
        'projectName': '72731',
        'licenseNumber': '闽BQ7802',
        'driverPhone': '15859101002',
        'fillTime': '1635392077000',
        'signTime': '1635392077000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110281135251180',
        'projectName': '72731',
        'licenseNumber': '闽BQ7802',
        'driverPhone': '15859101002',
        'fillTime': '1635392125000',
        'signTime': '1635392125000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110281137063354',
        'projectName': '72731',
        'licenseNumber': '闽BQ7802',
        'driverPhone': '15859101002',
        'fillTime': '1635392227000',
        'signTime': '1635392227000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110281335043806',
        'projectName': '72731',
        'licenseNumber': '闽BQ7802',
        'driverPhone': '15859101002',
        'fillTime': '1635399305000',
        'signTime': '1635399305000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110281336000644',
        'projectName': '72731',
        'licenseNumber': '闽BQ7802',
        'driverPhone': '15859101002',
        'fillTime': '1635399361000',
        'signTime': '1635399361000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110281336409518',
        'projectName': '72731',
        'licenseNumber': '闽BQ7802',
        'driverPhone': '15859101002',
        'fillTime': '1635399401000',
        'signTime': '1635399401000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110281337206949',
        'projectName': '72731',
        'licenseNumber': '闽BQ7802',
        'driverPhone': '15859101002',
        'fillTime': '1635399440000',
        'signTime': '1635399440000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110281338015165',
        'projectName': '72731',
        'licenseNumber': '闽BQ7802',
        'driverPhone': '15859101002',
        'fillTime': '1635399481000',
        'signTime': '1635399481000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110281339192280',
        'projectName': '72731',
        'licenseNumber': '闽BQ7802',
        'driverPhone': '15859101002',
        'fillTime': '1635399559000',
        'signTime': '1635399559000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110281340574688',
        'projectName': '72731',
        'licenseNumber': '闽BQ7802',
        'driverPhone': '15859101002',
        'fillTime': '1635399657000',
        'signTime': '1635399657000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110281343492473',
        'projectName': '72731',
        'licenseNumber': '闽BQ7802',
        'driverPhone': '15859101002',
        'fillTime': '1635399830000',
        'signTime': '1635399830000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110281344405858',
        'projectName': '72731',
        'licenseNumber': '闽BQ7802',
        'driverPhone': '15859101002',
        'fillTime': '1635399880000',
        'signTime': '1635399880000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110281345247364',
        'projectName': '72731',
        'licenseNumber': '闽BQ7802',
        'driverPhone': '15859101002',
        'fillTime': '1635399924000',
        'signTime': '1635399924000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110281345597340',
        'projectName': '72731',
        'licenseNumber': '闽BQ7802',
        'driverPhone': '15859101002',
        'fillTime': '1635399959000',
        'signTime': '1635399959000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110281346352346',
        'projectName': '72731',
        'licenseNumber': '闽BQ7802',
        'driverPhone': '15859101002',
        'fillTime': '1635399996000',
        'signTime': '1635399996000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110281347126489',
        'projectName': '72731',
        'licenseNumber': '闽BQ7802',
        'driverPhone': '15859101002',
        'fillTime': '1635400033000',
        'signTime': '1635400033000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110281347490711',
        'projectName': '72731',
        'licenseNumber': '闽BQ7802',
        'driverPhone': '15859101002',
        'fillTime': '1635400069000',
        'signTime': '1635400069000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110281348495361',
        'projectName': '72731',
        'licenseNumber': '闽BQ7802',
        'driverPhone': '15859101002',
        'fillTime': '1635400129000',
        'signTime': '1635400129000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110281349262909',
        'projectName': '72731',
        'licenseNumber': '闽BQ7802',
        'driverPhone': '15859101002',
        'fillTime': '1635400167000',
        'signTime': '1635400167000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110281350047811',
        'projectName': '72731',
        'licenseNumber': '闽BQ7802',
        'driverPhone': '15859101002',
        'fillTime': '1635400204000',
        'signTime': '1635400204000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110281350478056',
        'projectName': '72731',
        'licenseNumber': '闽BQ7802',
        'driverPhone': '15859101002',
        'fillTime': '1635400247000',
        'signTime': '1635400247000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110281351231610',
        'projectName': '72731',
        'licenseNumber': '闽BQ7802',
        'driverPhone': '15859101002',
        'fillTime': '1635400283000',
        'signTime': '1635400283000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110281352072508',
        'projectName': '72731',
        'licenseNumber': '闽BQ7802',
        'driverPhone': '15859101002',
        'fillTime': '1635400327000',
        'signTime': '1635400327000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110281352448066',
        'projectName': '72731',
        'licenseNumber': '闽BQ7802',
        'driverPhone': '15859101002',
        'fillTime': '1635400364000',
        'signTime': '1635400364000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110281353164901',
        'projectName': '72731',
        'licenseNumber': '闽BQ7802',
        'driverPhone': '15859101002',
        'fillTime': '1635400396000',
        'signTime': '1635400396000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110281353548511',
        'projectName': '72731',
        'licenseNumber': '闽BQ7802',
        'driverPhone': '15859101002',
        'fillTime': '1635400434000',
        'signTime': '1635400434000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110281354351601',
        'projectName': '72731',
        'licenseNumber': '闽BQ7802',
        'driverPhone': '15859101002',
        'fillTime': '1635400475000',
        'signTime': '1635400475000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110281355096274',
        'projectName': '72731',
        'licenseNumber': '闽BQ7802',
        'driverPhone': '15859101002',
        'fillTime': '1635400509000',
        'signTime': '1635400509000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110281355520702',
        'projectName': '72731',
        'licenseNumber': '闽BQ7802',
        'driverPhone': '15859101002',
        'fillTime': '1635400552000',
        'signTime': '1635400552000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110281356280861',
        'projectName': '72731',
        'licenseNumber': '闽BQ7802',
        'driverPhone': '15859101002',
        'fillTime': '1635400588000',
        'signTime': '1635400588000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110281357327097',
        'projectName': '72731',
        'licenseNumber': '闽BQ7802',
        'driverPhone': '15859101002',
        'fillTime': '1635400652000',
        'signTime': '1635400652000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110281358093255',
        'projectName': '72731',
        'licenseNumber': '闽BQ7802',
        'driverPhone': '15859101002',
        'fillTime': '1635400689000',
        'signTime': '1635400689000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110281359246951',
        'projectName': '72731',
        'licenseNumber': '闽BQ7802',
        'driverPhone': '15859101002',
        'fillTime': '1635400764000',
        'signTime': '1635400764000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110281400052786',
        'projectName': '72731',
        'licenseNumber': '闽BQ7802',
        'driverPhone': '15859101002',
        'fillTime': '1635400805000',
        'signTime': '1635400805000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110281400585004',
        'projectName': '72731',
        'licenseNumber': '闽BQ7802',
        'driverPhone': '15859101002',
        'fillTime': '1635400859000',
        'signTime': '1635400859000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110281406075289',
        'projectName': '72731',
        'licenseNumber': '闽BQ7802',
        'driverPhone': '15859101002',
        'fillTime': '1635401168000',
        'signTime': '1635401168000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110281407400589',
        'projectName': '72731',
        'licenseNumber': '闽BQ7802',
        'driverPhone': '15859101002',
        'fillTime': '1635401261000',
        'signTime': '1635401261000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110281408246156',
        'projectName': '72731',
        'licenseNumber': '闽BQ7802',
        'driverPhone': '15859101002',
        'fillTime': '1635401304000',
        'signTime': '1635401304000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110281409221479',
        'projectName': '72731',
        'licenseNumber': '闽BQ7802',
        'driverPhone': '15859101002',
        'fillTime': '1635401362000',
        'signTime': '1635401362000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110281410047848',
        'projectName': '72731',
        'licenseNumber': '闽BQ7802',
        'driverPhone': '15859101002',
        'fillTime': '1635401404000',
        'signTime': '1635401404000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110281411005539',
        'projectName': '72731',
        'licenseNumber': '闽BQ7802',
        'driverPhone': '15859101002',
        'fillTime': '1635401460000',
        'signTime': '1635401460000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110281411452612',
        'projectName': '72731',
        'licenseNumber': '闽BQ7802',
        'driverPhone': '15859101002',
        'fillTime': '1635401505000',
        'signTime': '1635401505000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110281413200569',
        'projectName': '72731',
        'licenseNumber': '闽BQ7802',
        'driverPhone': '15859101002',
        'fillTime': '1635401600000',
        'signTime': '1635401600000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110281437396617',
        'projectName': '72731',
        'licenseNumber': '闽BQ7802',
        'driverPhone': '15859101002',
        'fillTime': '1635403059000',
        'signTime': '1635403059000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110281438191109',
        'projectName': '72731',
        'licenseNumber': '闽BQ7802',
        'driverPhone': '15859101002',
        'fillTime': '1635403100000',
        'signTime': '1635403100000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110281438589887',
        'projectName': '72731',
        'licenseNumber': '闽BQ7802',
        'driverPhone': '15859101002',
        'fillTime': '1635403138000',
        'signTime': '1635403138000',
        'serialNumber': '147'
      }
    ],
    'userInfo': {
      'project_id': '72731',
      'team_telno': '15859102001',
      'issuing_telno': '15859109601',
      'issuing_time': '1635403138000',
      'issuing_pc': '1635403844258564',
      'icType': 'r'
    },
    'meter': [
      '1010',
      '2'
    ],
    'userMark': '1000|4|'
  },
  {
    'projectName': '100条项目',
    'loadUnloadType': '1001',
    'loadUnloadTypeStr': '渣土场',
    'muckyardName': '0907渣1-细沙',
    'loadTime': '2021-10-27 20:55:41',
    'unloadTime': '2021-10-27 20:56:09',
    'waybillCode': '78a33b0a2c8d47dd8a053998973febc4',
    'waybillNo': '2110272055408363',
    'orderCode': '110949797271486aa198a8ff3e64153c',
    'goodsTypeName': '细沙',
    'driverName': '测试',
    'driverPhone': '15859101001',
    'licenseNumber': '闽BQ7801',
    'GetCardNo': {
      'success': true,
      'code': '0000',
      'data': 110030265,
      'source': 'GetCardNo,2,True,B9ED8E0600000000'
    },
    'dataList': [
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110272025198140',
        'projectName': '72731',
        'licenseNumber': '闽BQ7801',
        'driverPhone': '15859101001',
        'fillTime': '1635337520000',
        'signTime': '1635337520000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110272029292976',
        'projectName': '72731',
        'licenseNumber': '闽BQ7801',
        'driverPhone': '15859101001',
        'fillTime': '1635337769000',
        'signTime': '1635337769000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110272030089762',
        'projectName': '72731',
        'licenseNumber': '闽BQ7801',
        'driverPhone': '15859101001',
        'fillTime': '1635337808000',
        'signTime': '1635337808000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110272032106344',
        'projectName': '72731',
        'licenseNumber': '闽BQ7801',
        'driverPhone': '15859101001',
        'fillTime': '1635337931000',
        'signTime': '1635337931000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110272032432975',
        'projectName': '72731',
        'licenseNumber': '闽BQ7801',
        'driverPhone': '15859101001',
        'fillTime': '1635337963000',
        'signTime': '1635337963000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110272033233861',
        'projectName': '72731',
        'licenseNumber': '闽BQ7801',
        'driverPhone': '15859101001',
        'fillTime': '1635338004000',
        'signTime': '1635338004000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110272034162414',
        'projectName': '72731',
        'licenseNumber': '闽BQ7801',
        'driverPhone': '15859101001',
        'fillTime': '1635338061000',
        'signTime': '1635338061000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110272035196738',
        'projectName': '72731',
        'licenseNumber': '闽BQ7801',
        'driverPhone': '15859101001',
        'fillTime': '1635338120000',
        'signTime': '1635338120000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110272037390197',
        'projectName': '72731',
        'licenseNumber': '闽BQ7801',
        'driverPhone': '15859101001',
        'fillTime': '1635338259000',
        'signTime': '1635338259000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110272039198235',
        'projectName': '72731',
        'licenseNumber': '闽BQ7801',
        'driverPhone': '15859101001',
        'fillTime': '1635338359000',
        'signTime': '1635338359000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110272039480730',
        'projectName': '72731',
        'licenseNumber': '闽BQ7801',
        'driverPhone': '15859101001',
        'fillTime': '1635338388000',
        'signTime': '1635338388000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110272040174465',
        'projectName': '72731',
        'licenseNumber': '闽BQ7801',
        'driverPhone': '15859101001',
        'fillTime': '1635338417000',
        'signTime': '1635338417000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110272040461885',
        'projectName': '72731',
        'licenseNumber': '闽BQ7801',
        'driverPhone': '15859101001',
        'fillTime': '1635338446000',
        'signTime': '1635338446000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110272041341258',
        'projectName': '72731',
        'licenseNumber': '闽BQ7801',
        'driverPhone': '15859101001',
        'fillTime': '1635338494000',
        'signTime': '1635338494000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110272043467426',
        'projectName': '72731',
        'licenseNumber': '闽BQ7801',
        'driverPhone': '15859101001',
        'fillTime': '1635338626000',
        'signTime': '1635338626000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110272047431703',
        'projectName': '72731',
        'licenseNumber': '闽BQ7801',
        'driverPhone': '15859101001',
        'fillTime': '1635338864000',
        'signTime': '1635338864000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110272048047399',
        'projectName': '72731',
        'licenseNumber': '闽BQ7801',
        'driverPhone': '15859101001',
        'fillTime': '1635338884000',
        'signTime': '1635338884000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110272049215217',
        'projectName': '72731',
        'licenseNumber': '闽BQ7801',
        'driverPhone': '15859101001',
        'fillTime': '1635338961000',
        'signTime': '1635338961000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110272049574954',
        'projectName': '72731',
        'licenseNumber': '闽BQ7801',
        'driverPhone': '15859101001',
        'fillTime': '1635338997000',
        'signTime': '1635338997000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110272050276492',
        'projectName': '72731',
        'licenseNumber': '闽BQ7801',
        'driverPhone': '15859101001',
        'fillTime': '1635339028000',
        'signTime': '1635339028000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110272051340701',
        'projectName': '72731',
        'licenseNumber': '闽BQ7801',
        'driverPhone': '15859101001',
        'fillTime': '1635339095000',
        'signTime': '1635339095000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110272052410020',
        'projectName': '72731',
        'licenseNumber': '闽BQ7801',
        'driverPhone': '15859101001',
        'fillTime': '1635339161000',
        'signTime': '1635339161000',
        'serialNumber': '157'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110272053296764',
        'projectName': '72731',
        'licenseNumber': '闽BQ7801',
        'driverPhone': '15859101001',
        'fillTime': '1635339209000',
        'signTime': '1635339209000',
        'serialNumber': '157'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110272054113019',
        'projectName': '72731',
        'licenseNumber': '闽BQ7801',
        'driverPhone': '15859101001',
        'fillTime': '1635339251000',
        'signTime': '1635339251000',
        'serialNumber': '157'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110272054456514',
        'projectName': '72731',
        'licenseNumber': '闽BQ7801',
        'driverPhone': '15859101001',
        'fillTime': '1635339285000',
        'signTime': '1635339285000',
        'serialNumber': '157'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110272055408363',
        'projectName': '72731',
        'licenseNumber': '闽BQ7801',
        'driverPhone': '15859101001',
        'fillTime': '1635339341000',
        'signTime': '1635339341000',
        'serialNumber': '157'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110272056176589',
        'projectName': '72731',
        'licenseNumber': '闽BQ7801',
        'driverPhone': '15859101001',
        'fillTime': '1635339377000',
        'signTime': '1635339377000',
        'serialNumber': '157'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110272057075827',
        'projectName': '72731',
        'licenseNumber': '闽BQ7801',
        'driverPhone': '15859101001',
        'fillTime': '1635339428000',
        'signTime': '1635339428000',
        'serialNumber': '157'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110272057414303',
        'projectName': '72731',
        'licenseNumber': '闽BQ7801',
        'driverPhone': '15859101001',
        'fillTime': '1635339462000',
        'signTime': '1635339462000',
        'serialNumber': '157'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110272058166296',
        'projectName': '72731',
        'licenseNumber': '闽BQ7801',
        'driverPhone': '15859101001',
        'fillTime': '1635339496000',
        'signTime': '1635339496000',
        'serialNumber': '157'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110272059298740',
        'projectName': '72731',
        'licenseNumber': '闽BQ7801',
        'driverPhone': '15859101001',
        'fillTime': '1635339569000',
        'signTime': '1635339569000',
        'serialNumber': '157'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110281051189058',
        'projectName': '72731',
        'licenseNumber': '闽BQ7801',
        'driverPhone': '15859101001',
        'fillTime': '1635389479000',
        'signTime': '1635389479000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110281051554780',
        'projectName': '72731',
        'licenseNumber': '闽BQ7801',
        'driverPhone': '15859101001',
        'fillTime': '1635389516000',
        'signTime': '1635389516000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110281052408754',
        'projectName': '72731',
        'licenseNumber': '闽BQ7801',
        'driverPhone': '15859101001',
        'fillTime': '1635389561000',
        'signTime': '1635389561000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110281053294497',
        'projectName': '72731',
        'licenseNumber': '闽BQ7801',
        'driverPhone': '15859101001',
        'fillTime': '1635389610000',
        'signTime': '1635389610000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110281054280667',
        'projectName': '72731',
        'licenseNumber': '闽BQ7801',
        'driverPhone': '15859101001',
        'fillTime': '1635389668000',
        'signTime': '1635389668000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110281055238727',
        'projectName': '72731',
        'licenseNumber': '闽BQ7801',
        'driverPhone': '15859101001',
        'fillTime': '1635389723000',
        'signTime': '1635389723000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110281057017097',
        'projectName': '72731',
        'licenseNumber': '闽BQ7801',
        'driverPhone': '15859101001',
        'fillTime': '1635389821000',
        'signTime': '1635389821000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110281108570566',
        'projectName': '72731',
        'licenseNumber': '闽BQ7802',
        'driverPhone': '15859101002',
        'fillTime': '1635390537000',
        'signTime': '1635390537000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110281109302534',
        'projectName': '72731',
        'licenseNumber': '闽BQ7802',
        'driverPhone': '15859101002',
        'fillTime': '1635390571000',
        'signTime': '1635390571000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110281110236080',
        'projectName': '72731',
        'licenseNumber': '闽BQ7802',
        'driverPhone': '15859101002',
        'fillTime': '1635390623000',
        'signTime': '1635390623000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110281111023618',
        'projectName': '72731',
        'licenseNumber': '闽BQ7802',
        'driverPhone': '15859101002',
        'fillTime': '1635390663000',
        'signTime': '1635390663000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110281111413997',
        'projectName': '72731',
        'licenseNumber': '闽BQ7802',
        'driverPhone': '15859101002',
        'fillTime': '1635390701000',
        'signTime': '1635390701000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110281112342732',
        'projectName': '72731',
        'licenseNumber': '闽BQ7802',
        'driverPhone': '15859101002',
        'fillTime': '1635390754000',
        'signTime': '1635390754000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110281113172977',
        'projectName': '72731',
        'licenseNumber': '闽BQ7802',
        'driverPhone': '15859101002',
        'fillTime': '1635390798000',
        'signTime': '1635390798000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110281114218928',
        'projectName': '72731',
        'licenseNumber': '闽BQ7802',
        'driverPhone': '15859101002',
        'fillTime': '1635390862000',
        'signTime': '1635390862000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110281115212237',
        'projectName': '72731',
        'licenseNumber': '闽BQ7802',
        'driverPhone': '15859101002',
        'fillTime': '1635390921000',
        'signTime': '1635390921000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110281116081769',
        'projectName': '72731',
        'licenseNumber': '闽BQ7802',
        'driverPhone': '15859101002',
        'fillTime': '1635390968000',
        'signTime': '1635390968000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110281116535972',
        'projectName': '72731',
        'licenseNumber': '闽BQ7802',
        'driverPhone': '15859101002',
        'fillTime': '1635391014000',
        'signTime': '1635391014000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110281118048652',
        'projectName': '72731',
        'licenseNumber': '闽BQ7802',
        'driverPhone': '15859101002',
        'fillTime': '1635391085000',
        'signTime': '1635391085000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110281118510090',
        'projectName': '72731',
        'licenseNumber': '闽BQ7802',
        'driverPhone': '15859101002',
        'fillTime': '1635391131000',
        'signTime': '1635391131000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110281119349749',
        'projectName': '72731',
        'licenseNumber': '闽BQ7802',
        'driverPhone': '15859101002',
        'fillTime': '1635391174000',
        'signTime': '1635391174000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110281121126842',
        'projectName': '72731',
        'licenseNumber': '闽BQ7802',
        'driverPhone': '15859101002',
        'fillTime': '1635391272000',
        'signTime': '1635391272000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110281122430352',
        'projectName': '72731',
        'licenseNumber': '闽BQ7802',
        'driverPhone': '15859101002',
        'fillTime': '1635391364000',
        'signTime': '1635391364000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110281125111347',
        'projectName': '72731',
        'licenseNumber': '闽BQ7802',
        'driverPhone': '15859101002',
        'fillTime': '1635391511000',
        'signTime': '1635391511000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110281128237324',
        'projectName': '72731',
        'licenseNumber': '闽BQ7802',
        'driverPhone': '15859101002',
        'fillTime': '1635391703000',
        'signTime': '1635391703000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110281133479295',
        'projectName': '72731',
        'licenseNumber': '闽BQ7802',
        'driverPhone': '15859101002',
        'fillTime': '1635392027000',
        'signTime': '1635392027000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110281134378083',
        'projectName': '72731',
        'licenseNumber': '闽BQ7802',
        'driverPhone': '15859101002',
        'fillTime': '1635392077000',
        'signTime': '1635392077000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110281135251180',
        'projectName': '72731',
        'licenseNumber': '闽BQ7802',
        'driverPhone': '15859101002',
        'fillTime': '1635392125000',
        'signTime': '1635392125000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110281137063354',
        'projectName': '72731',
        'licenseNumber': '闽BQ7802',
        'driverPhone': '15859101002',
        'fillTime': '1635392227000',
        'signTime': '1635392227000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110281335043806',
        'projectName': '72731',
        'licenseNumber': '闽BQ7802',
        'driverPhone': '15859101002',
        'fillTime': '1635399305000',
        'signTime': '1635399305000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110281336000644',
        'projectName': '72731',
        'licenseNumber': '闽BQ7802',
        'driverPhone': '15859101002',
        'fillTime': '1635399361000',
        'signTime': '1635399361000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110281336409518',
        'projectName': '72731',
        'licenseNumber': '闽BQ7802',
        'driverPhone': '15859101002',
        'fillTime': '1635399401000',
        'signTime': '1635399401000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110281337206949',
        'projectName': '72731',
        'licenseNumber': '闽BQ7802',
        'driverPhone': '15859101002',
        'fillTime': '1635399440000',
        'signTime': '1635399440000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110281338015165',
        'projectName': '72731',
        'licenseNumber': '闽BQ7802',
        'driverPhone': '15859101002',
        'fillTime': '1635399481000',
        'signTime': '1635399481000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110281339192280',
        'projectName': '72731',
        'licenseNumber': '闽BQ7802',
        'driverPhone': '15859101002',
        'fillTime': '1635399559000',
        'signTime': '1635399559000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110281340574688',
        'projectName': '72731',
        'licenseNumber': '闽BQ7802',
        'driverPhone': '15859101002',
        'fillTime': '1635399657000',
        'signTime': '1635399657000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110281343492473',
        'projectName': '72731',
        'licenseNumber': '闽BQ7802',
        'driverPhone': '15859101002',
        'fillTime': '1635399830000',
        'signTime': '1635399830000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110281344405858',
        'projectName': '72731',
        'licenseNumber': '闽BQ7802',
        'driverPhone': '15859101002',
        'fillTime': '1635399880000',
        'signTime': '1635399880000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110281345247364',
        'projectName': '72731',
        'licenseNumber': '闽BQ7802',
        'driverPhone': '15859101002',
        'fillTime': '1635399924000',
        'signTime': '1635399924000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110281345597340',
        'projectName': '72731',
        'licenseNumber': '闽BQ7802',
        'driverPhone': '15859101002',
        'fillTime': '1635399959000',
        'signTime': '1635399959000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110281346352346',
        'projectName': '72731',
        'licenseNumber': '闽BQ7802',
        'driverPhone': '15859101002',
        'fillTime': '1635399996000',
        'signTime': '1635399996000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110281347126489',
        'projectName': '72731',
        'licenseNumber': '闽BQ7802',
        'driverPhone': '15859101002',
        'fillTime': '1635400033000',
        'signTime': '1635400033000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110281347490711',
        'projectName': '72731',
        'licenseNumber': '闽BQ7802',
        'driverPhone': '15859101002',
        'fillTime': '1635400069000',
        'signTime': '1635400069000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110281348495361',
        'projectName': '72731',
        'licenseNumber': '闽BQ7802',
        'driverPhone': '15859101002',
        'fillTime': '1635400129000',
        'signTime': '1635400129000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110281349262909',
        'projectName': '72731',
        'licenseNumber': '闽BQ7802',
        'driverPhone': '15859101002',
        'fillTime': '1635400167000',
        'signTime': '1635400167000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110281350047811',
        'projectName': '72731',
        'licenseNumber': '闽BQ7802',
        'driverPhone': '15859101002',
        'fillTime': '1635400204000',
        'signTime': '1635400204000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110281350478056',
        'projectName': '72731',
        'licenseNumber': '闽BQ7802',
        'driverPhone': '15859101002',
        'fillTime': '1635400247000',
        'signTime': '1635400247000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110281351231610',
        'projectName': '72731',
        'licenseNumber': '闽BQ7802',
        'driverPhone': '15859101002',
        'fillTime': '1635400283000',
        'signTime': '1635400283000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110281352072508',
        'projectName': '72731',
        'licenseNumber': '闽BQ7802',
        'driverPhone': '15859101002',
        'fillTime': '1635400327000',
        'signTime': '1635400327000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110281352448066',
        'projectName': '72731',
        'licenseNumber': '闽BQ7802',
        'driverPhone': '15859101002',
        'fillTime': '1635400364000',
        'signTime': '1635400364000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110281353164901',
        'projectName': '72731',
        'licenseNumber': '闽BQ7802',
        'driverPhone': '15859101002',
        'fillTime': '1635400396000',
        'signTime': '1635400396000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110281353548511',
        'projectName': '72731',
        'licenseNumber': '闽BQ7802',
        'driverPhone': '15859101002',
        'fillTime': '1635400434000',
        'signTime': '1635400434000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110281354351601',
        'projectName': '72731',
        'licenseNumber': '闽BQ7802',
        'driverPhone': '15859101002',
        'fillTime': '1635400475000',
        'signTime': '1635400475000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110281355096274',
        'projectName': '72731',
        'licenseNumber': '闽BQ7802',
        'driverPhone': '15859101002',
        'fillTime': '1635400509000',
        'signTime': '1635400509000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110281355520702',
        'projectName': '72731',
        'licenseNumber': '闽BQ7802',
        'driverPhone': '15859101002',
        'fillTime': '1635400552000',
        'signTime': '1635400552000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110281356280861',
        'projectName': '72731',
        'licenseNumber': '闽BQ7802',
        'driverPhone': '15859101002',
        'fillTime': '1635400588000',
        'signTime': '1635400588000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110281357327097',
        'projectName': '72731',
        'licenseNumber': '闽BQ7802',
        'driverPhone': '15859101002',
        'fillTime': '1635400652000',
        'signTime': '1635400652000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110281358093255',
        'projectName': '72731',
        'licenseNumber': '闽BQ7802',
        'driverPhone': '15859101002',
        'fillTime': '1635400689000',
        'signTime': '1635400689000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110281359246951',
        'projectName': '72731',
        'licenseNumber': '闽BQ7802',
        'driverPhone': '15859101002',
        'fillTime': '1635400764000',
        'signTime': '1635400764000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110281400052786',
        'projectName': '72731',
        'licenseNumber': '闽BQ7802',
        'driverPhone': '15859101002',
        'fillTime': '1635400805000',
        'signTime': '1635400805000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110281400585004',
        'projectName': '72731',
        'licenseNumber': '闽BQ7802',
        'driverPhone': '15859101002',
        'fillTime': '1635400859000',
        'signTime': '1635400859000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110281406075289',
        'projectName': '72731',
        'licenseNumber': '闽BQ7802',
        'driverPhone': '15859101002',
        'fillTime': '1635401168000',
        'signTime': '1635401168000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110281407400589',
        'projectName': '72731',
        'licenseNumber': '闽BQ7802',
        'driverPhone': '15859101002',
        'fillTime': '1635401261000',
        'signTime': '1635401261000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110281408246156',
        'projectName': '72731',
        'licenseNumber': '闽BQ7802',
        'driverPhone': '15859101002',
        'fillTime': '1635401304000',
        'signTime': '1635401304000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110281409221479',
        'projectName': '72731',
        'licenseNumber': '闽BQ7802',
        'driverPhone': '15859101002',
        'fillTime': '1635401362000',
        'signTime': '1635401362000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110281410047848',
        'projectName': '72731',
        'licenseNumber': '闽BQ7802',
        'driverPhone': '15859101002',
        'fillTime': '1635401404000',
        'signTime': '1635401404000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110281411005539',
        'projectName': '72731',
        'licenseNumber': '闽BQ7802',
        'driverPhone': '15859101002',
        'fillTime': '1635401460000',
        'signTime': '1635401460000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110281411452612',
        'projectName': '72731',
        'licenseNumber': '闽BQ7802',
        'driverPhone': '15859101002',
        'fillTime': '1635401505000',
        'signTime': '1635401505000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110281413200569',
        'projectName': '72731',
        'licenseNumber': '闽BQ7802',
        'driverPhone': '15859101002',
        'fillTime': '1635401600000',
        'signTime': '1635401600000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110281437396617',
        'projectName': '72731',
        'licenseNumber': '闽BQ7802',
        'driverPhone': '15859101002',
        'fillTime': '1635403059000',
        'signTime': '1635403059000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110281438191109',
        'projectName': '72731',
        'licenseNumber': '闽BQ7802',
        'driverPhone': '15859101002',
        'fillTime': '1635403100000',
        'signTime': '1635403100000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110281438589887',
        'projectName': '72731',
        'licenseNumber': '闽BQ7802',
        'driverPhone': '15859101002',
        'fillTime': '1635403138000',
        'signTime': '1635403138000',
        'serialNumber': '147'
      }
    ],
    'userInfo': {
      'project_id': '72731',
      'team_telno': '15859102001',
      'issuing_telno': '15859109601',
      'issuing_time': '1635403138000',
      'issuing_pc': '1635403844258564',
      'icType': 'r'
    },
    'meter': [
      '1010',
      '2'
    ],
    'userMark': '1000|4|'
  },
  {
    'projectName': '100条项目',
    'loadUnloadType': '1001',
    'loadUnloadTypeStr': '渣土场',
    'muckyardName': '0907渣1-细沙',
    'loadTime': '2021-10-27 20:56:17',
    'unloadTime': '2021-10-27 20:57:03',
    'waybillCode': '43480cc19fc24f4786152bc50bd70586',
    'waybillNo': '2110272056176589',
    'orderCode': '110949797271486aa198a8ff3e64153c',
    'goodsTypeName': '细沙',
    'driverName': '测试',
    'driverPhone': '15859101001',
    'licenseNumber': '闽BQ7801',
    'GetCardNo': {
      'success': true,
      'code': '0000',
      'data': 110030265,
      'source': 'GetCardNo,2,True,B9ED8E0600000000'
    },
    'dataList': [
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110272025198140',
        'projectName': '72731',
        'licenseNumber': '闽BQ7801',
        'driverPhone': '15859101001',
        'fillTime': '1635337520000',
        'signTime': '1635337520000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110272029292976',
        'projectName': '72731',
        'licenseNumber': '闽BQ7801',
        'driverPhone': '15859101001',
        'fillTime': '1635337769000',
        'signTime': '1635337769000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110272030089762',
        'projectName': '72731',
        'licenseNumber': '闽BQ7801',
        'driverPhone': '15859101001',
        'fillTime': '1635337808000',
        'signTime': '1635337808000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110272032106344',
        'projectName': '72731',
        'licenseNumber': '闽BQ7801',
        'driverPhone': '15859101001',
        'fillTime': '1635337931000',
        'signTime': '1635337931000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110272032432975',
        'projectName': '72731',
        'licenseNumber': '闽BQ7801',
        'driverPhone': '15859101001',
        'fillTime': '1635337963000',
        'signTime': '1635337963000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110272033233861',
        'projectName': '72731',
        'licenseNumber': '闽BQ7801',
        'driverPhone': '15859101001',
        'fillTime': '1635338004000',
        'signTime': '1635338004000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110272034162414',
        'projectName': '72731',
        'licenseNumber': '闽BQ7801',
        'driverPhone': '15859101001',
        'fillTime': '1635338061000',
        'signTime': '1635338061000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110272035196738',
        'projectName': '72731',
        'licenseNumber': '闽BQ7801',
        'driverPhone': '15859101001',
        'fillTime': '1635338120000',
        'signTime': '1635338120000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110272037390197',
        'projectName': '72731',
        'licenseNumber': '闽BQ7801',
        'driverPhone': '15859101001',
        'fillTime': '1635338259000',
        'signTime': '1635338259000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110272039198235',
        'projectName': '72731',
        'licenseNumber': '闽BQ7801',
        'driverPhone': '15859101001',
        'fillTime': '1635338359000',
        'signTime': '1635338359000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110272039480730',
        'projectName': '72731',
        'licenseNumber': '闽BQ7801',
        'driverPhone': '15859101001',
        'fillTime': '1635338388000',
        'signTime': '1635338388000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110272040174465',
        'projectName': '72731',
        'licenseNumber': '闽BQ7801',
        'driverPhone': '15859101001',
        'fillTime': '1635338417000',
        'signTime': '1635338417000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110272040461885',
        'projectName': '72731',
        'licenseNumber': '闽BQ7801',
        'driverPhone': '15859101001',
        'fillTime': '1635338446000',
        'signTime': '1635338446000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110272041341258',
        'projectName': '72731',
        'licenseNumber': '闽BQ7801',
        'driverPhone': '15859101001',
        'fillTime': '1635338494000',
        'signTime': '1635338494000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110272043467426',
        'projectName': '72731',
        'licenseNumber': '闽BQ7801',
        'driverPhone': '15859101001',
        'fillTime': '1635338626000',
        'signTime': '1635338626000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110272047431703',
        'projectName': '72731',
        'licenseNumber': '闽BQ7801',
        'driverPhone': '15859101001',
        'fillTime': '1635338864000',
        'signTime': '1635338864000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110272048047399',
        'projectName': '72731',
        'licenseNumber': '闽BQ7801',
        'driverPhone': '15859101001',
        'fillTime': '1635338884000',
        'signTime': '1635338884000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110272049215217',
        'projectName': '72731',
        'licenseNumber': '闽BQ7801',
        'driverPhone': '15859101001',
        'fillTime': '1635338961000',
        'signTime': '1635338961000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110272049574954',
        'projectName': '72731',
        'licenseNumber': '闽BQ7801',
        'driverPhone': '15859101001',
        'fillTime': '1635338997000',
        'signTime': '1635338997000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110272050276492',
        'projectName': '72731',
        'licenseNumber': '闽BQ7801',
        'driverPhone': '15859101001',
        'fillTime': '1635339028000',
        'signTime': '1635339028000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110272051340701',
        'projectName': '72731',
        'licenseNumber': '闽BQ7801',
        'driverPhone': '15859101001',
        'fillTime': '1635339095000',
        'signTime': '1635339095000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110272052410020',
        'projectName': '72731',
        'licenseNumber': '闽BQ7801',
        'driverPhone': '15859101001',
        'fillTime': '1635339161000',
        'signTime': '1635339161000',
        'serialNumber': '157'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110272053296764',
        'projectName': '72731',
        'licenseNumber': '闽BQ7801',
        'driverPhone': '15859101001',
        'fillTime': '1635339209000',
        'signTime': '1635339209000',
        'serialNumber': '157'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110272054113019',
        'projectName': '72731',
        'licenseNumber': '闽BQ7801',
        'driverPhone': '15859101001',
        'fillTime': '1635339251000',
        'signTime': '1635339251000',
        'serialNumber': '157'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110272054456514',
        'projectName': '72731',
        'licenseNumber': '闽BQ7801',
        'driverPhone': '15859101001',
        'fillTime': '1635339285000',
        'signTime': '1635339285000',
        'serialNumber': '157'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110272055408363',
        'projectName': '72731',
        'licenseNumber': '闽BQ7801',
        'driverPhone': '15859101001',
        'fillTime': '1635339341000',
        'signTime': '1635339341000',
        'serialNumber': '157'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110272056176589',
        'projectName': '72731',
        'licenseNumber': '闽BQ7801',
        'driverPhone': '15859101001',
        'fillTime': '1635339377000',
        'signTime': '1635339377000',
        'serialNumber': '157'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110272057075827',
        'projectName': '72731',
        'licenseNumber': '闽BQ7801',
        'driverPhone': '15859101001',
        'fillTime': '1635339428000',
        'signTime': '1635339428000',
        'serialNumber': '157'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110272057414303',
        'projectName': '72731',
        'licenseNumber': '闽BQ7801',
        'driverPhone': '15859101001',
        'fillTime': '1635339462000',
        'signTime': '1635339462000',
        'serialNumber': '157'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110272058166296',
        'projectName': '72731',
        'licenseNumber': '闽BQ7801',
        'driverPhone': '15859101001',
        'fillTime': '1635339496000',
        'signTime': '1635339496000',
        'serialNumber': '157'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110272059298740',
        'projectName': '72731',
        'licenseNumber': '闽BQ7801',
        'driverPhone': '15859101001',
        'fillTime': '1635339569000',
        'signTime': '1635339569000',
        'serialNumber': '157'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110281051189058',
        'projectName': '72731',
        'licenseNumber': '闽BQ7801',
        'driverPhone': '15859101001',
        'fillTime': '1635389479000',
        'signTime': '1635389479000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110281051554780',
        'projectName': '72731',
        'licenseNumber': '闽BQ7801',
        'driverPhone': '15859101001',
        'fillTime': '1635389516000',
        'signTime': '1635389516000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110281052408754',
        'projectName': '72731',
        'licenseNumber': '闽BQ7801',
        'driverPhone': '15859101001',
        'fillTime': '1635389561000',
        'signTime': '1635389561000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110281053294497',
        'projectName': '72731',
        'licenseNumber': '闽BQ7801',
        'driverPhone': '15859101001',
        'fillTime': '1635389610000',
        'signTime': '1635389610000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110281054280667',
        'projectName': '72731',
        'licenseNumber': '闽BQ7801',
        'driverPhone': '15859101001',
        'fillTime': '1635389668000',
        'signTime': '1635389668000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110281055238727',
        'projectName': '72731',
        'licenseNumber': '闽BQ7801',
        'driverPhone': '15859101001',
        'fillTime': '1635389723000',
        'signTime': '1635389723000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110281057017097',
        'projectName': '72731',
        'licenseNumber': '闽BQ7801',
        'driverPhone': '15859101001',
        'fillTime': '1635389821000',
        'signTime': '1635389821000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110281108570566',
        'projectName': '72731',
        'licenseNumber': '闽BQ7802',
        'driverPhone': '15859101002',
        'fillTime': '1635390537000',
        'signTime': '1635390537000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110281109302534',
        'projectName': '72731',
        'licenseNumber': '闽BQ7802',
        'driverPhone': '15859101002',
        'fillTime': '1635390571000',
        'signTime': '1635390571000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110281110236080',
        'projectName': '72731',
        'licenseNumber': '闽BQ7802',
        'driverPhone': '15859101002',
        'fillTime': '1635390623000',
        'signTime': '1635390623000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110281111023618',
        'projectName': '72731',
        'licenseNumber': '闽BQ7802',
        'driverPhone': '15859101002',
        'fillTime': '1635390663000',
        'signTime': '1635390663000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110281111413997',
        'projectName': '72731',
        'licenseNumber': '闽BQ7802',
        'driverPhone': '15859101002',
        'fillTime': '1635390701000',
        'signTime': '1635390701000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110281112342732',
        'projectName': '72731',
        'licenseNumber': '闽BQ7802',
        'driverPhone': '15859101002',
        'fillTime': '1635390754000',
        'signTime': '1635390754000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110281113172977',
        'projectName': '72731',
        'licenseNumber': '闽BQ7802',
        'driverPhone': '15859101002',
        'fillTime': '1635390798000',
        'signTime': '1635390798000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110281114218928',
        'projectName': '72731',
        'licenseNumber': '闽BQ7802',
        'driverPhone': '15859101002',
        'fillTime': '1635390862000',
        'signTime': '1635390862000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110281115212237',
        'projectName': '72731',
        'licenseNumber': '闽BQ7802',
        'driverPhone': '15859101002',
        'fillTime': '1635390921000',
        'signTime': '1635390921000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110281116081769',
        'projectName': '72731',
        'licenseNumber': '闽BQ7802',
        'driverPhone': '15859101002',
        'fillTime': '1635390968000',
        'signTime': '1635390968000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110281116535972',
        'projectName': '72731',
        'licenseNumber': '闽BQ7802',
        'driverPhone': '15859101002',
        'fillTime': '1635391014000',
        'signTime': '1635391014000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110281118048652',
        'projectName': '72731',
        'licenseNumber': '闽BQ7802',
        'driverPhone': '15859101002',
        'fillTime': '1635391085000',
        'signTime': '1635391085000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110281118510090',
        'projectName': '72731',
        'licenseNumber': '闽BQ7802',
        'driverPhone': '15859101002',
        'fillTime': '1635391131000',
        'signTime': '1635391131000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110281119349749',
        'projectName': '72731',
        'licenseNumber': '闽BQ7802',
        'driverPhone': '15859101002',
        'fillTime': '1635391174000',
        'signTime': '1635391174000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110281121126842',
        'projectName': '72731',
        'licenseNumber': '闽BQ7802',
        'driverPhone': '15859101002',
        'fillTime': '1635391272000',
        'signTime': '1635391272000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110281122430352',
        'projectName': '72731',
        'licenseNumber': '闽BQ7802',
        'driverPhone': '15859101002',
        'fillTime': '1635391364000',
        'signTime': '1635391364000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110281125111347',
        'projectName': '72731',
        'licenseNumber': '闽BQ7802',
        'driverPhone': '15859101002',
        'fillTime': '1635391511000',
        'signTime': '1635391511000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110281128237324',
        'projectName': '72731',
        'licenseNumber': '闽BQ7802',
        'driverPhone': '15859101002',
        'fillTime': '1635391703000',
        'signTime': '1635391703000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110281133479295',
        'projectName': '72731',
        'licenseNumber': '闽BQ7802',
        'driverPhone': '15859101002',
        'fillTime': '1635392027000',
        'signTime': '1635392027000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110281134378083',
        'projectName': '72731',
        'licenseNumber': '闽BQ7802',
        'driverPhone': '15859101002',
        'fillTime': '1635392077000',
        'signTime': '1635392077000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110281135251180',
        'projectName': '72731',
        'licenseNumber': '闽BQ7802',
        'driverPhone': '15859101002',
        'fillTime': '1635392125000',
        'signTime': '1635392125000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110281137063354',
        'projectName': '72731',
        'licenseNumber': '闽BQ7802',
        'driverPhone': '15859101002',
        'fillTime': '1635392227000',
        'signTime': '1635392227000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110281335043806',
        'projectName': '72731',
        'licenseNumber': '闽BQ7802',
        'driverPhone': '15859101002',
        'fillTime': '1635399305000',
        'signTime': '1635399305000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110281336000644',
        'projectName': '72731',
        'licenseNumber': '闽BQ7802',
        'driverPhone': '15859101002',
        'fillTime': '1635399361000',
        'signTime': '1635399361000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110281336409518',
        'projectName': '72731',
        'licenseNumber': '闽BQ7802',
        'driverPhone': '15859101002',
        'fillTime': '1635399401000',
        'signTime': '1635399401000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110281337206949',
        'projectName': '72731',
        'licenseNumber': '闽BQ7802',
        'driverPhone': '15859101002',
        'fillTime': '1635399440000',
        'signTime': '1635399440000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110281338015165',
        'projectName': '72731',
        'licenseNumber': '闽BQ7802',
        'driverPhone': '15859101002',
        'fillTime': '1635399481000',
        'signTime': '1635399481000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110281339192280',
        'projectName': '72731',
        'licenseNumber': '闽BQ7802',
        'driverPhone': '15859101002',
        'fillTime': '1635399559000',
        'signTime': '1635399559000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110281340574688',
        'projectName': '72731',
        'licenseNumber': '闽BQ7802',
        'driverPhone': '15859101002',
        'fillTime': '1635399657000',
        'signTime': '1635399657000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110281343492473',
        'projectName': '72731',
        'licenseNumber': '闽BQ7802',
        'driverPhone': '15859101002',
        'fillTime': '1635399830000',
        'signTime': '1635399830000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110281344405858',
        'projectName': '72731',
        'licenseNumber': '闽BQ7802',
        'driverPhone': '15859101002',
        'fillTime': '1635399880000',
        'signTime': '1635399880000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110281345247364',
        'projectName': '72731',
        'licenseNumber': '闽BQ7802',
        'driverPhone': '15859101002',
        'fillTime': '1635399924000',
        'signTime': '1635399924000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110281345597340',
        'projectName': '72731',
        'licenseNumber': '闽BQ7802',
        'driverPhone': '15859101002',
        'fillTime': '1635399959000',
        'signTime': '1635399959000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110281346352346',
        'projectName': '72731',
        'licenseNumber': '闽BQ7802',
        'driverPhone': '15859101002',
        'fillTime': '1635399996000',
        'signTime': '1635399996000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110281347126489',
        'projectName': '72731',
        'licenseNumber': '闽BQ7802',
        'driverPhone': '15859101002',
        'fillTime': '1635400033000',
        'signTime': '1635400033000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110281347490711',
        'projectName': '72731',
        'licenseNumber': '闽BQ7802',
        'driverPhone': '15859101002',
        'fillTime': '1635400069000',
        'signTime': '1635400069000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110281348495361',
        'projectName': '72731',
        'licenseNumber': '闽BQ7802',
        'driverPhone': '15859101002',
        'fillTime': '1635400129000',
        'signTime': '1635400129000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110281349262909',
        'projectName': '72731',
        'licenseNumber': '闽BQ7802',
        'driverPhone': '15859101002',
        'fillTime': '1635400167000',
        'signTime': '1635400167000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110281350047811',
        'projectName': '72731',
        'licenseNumber': '闽BQ7802',
        'driverPhone': '15859101002',
        'fillTime': '1635400204000',
        'signTime': '1635400204000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110281350478056',
        'projectName': '72731',
        'licenseNumber': '闽BQ7802',
        'driverPhone': '15859101002',
        'fillTime': '1635400247000',
        'signTime': '1635400247000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110281351231610',
        'projectName': '72731',
        'licenseNumber': '闽BQ7802',
        'driverPhone': '15859101002',
        'fillTime': '1635400283000',
        'signTime': '1635400283000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110281352072508',
        'projectName': '72731',
        'licenseNumber': '闽BQ7802',
        'driverPhone': '15859101002',
        'fillTime': '1635400327000',
        'signTime': '1635400327000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110281352448066',
        'projectName': '72731',
        'licenseNumber': '闽BQ7802',
        'driverPhone': '15859101002',
        'fillTime': '1635400364000',
        'signTime': '1635400364000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110281353164901',
        'projectName': '72731',
        'licenseNumber': '闽BQ7802',
        'driverPhone': '15859101002',
        'fillTime': '1635400396000',
        'signTime': '1635400396000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110281353548511',
        'projectName': '72731',
        'licenseNumber': '闽BQ7802',
        'driverPhone': '15859101002',
        'fillTime': '1635400434000',
        'signTime': '1635400434000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110281354351601',
        'projectName': '72731',
        'licenseNumber': '闽BQ7802',
        'driverPhone': '15859101002',
        'fillTime': '1635400475000',
        'signTime': '1635400475000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110281355096274',
        'projectName': '72731',
        'licenseNumber': '闽BQ7802',
        'driverPhone': '15859101002',
        'fillTime': '1635400509000',
        'signTime': '1635400509000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110281355520702',
        'projectName': '72731',
        'licenseNumber': '闽BQ7802',
        'driverPhone': '15859101002',
        'fillTime': '1635400552000',
        'signTime': '1635400552000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110281356280861',
        'projectName': '72731',
        'licenseNumber': '闽BQ7802',
        'driverPhone': '15859101002',
        'fillTime': '1635400588000',
        'signTime': '1635400588000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110281357327097',
        'projectName': '72731',
        'licenseNumber': '闽BQ7802',
        'driverPhone': '15859101002',
        'fillTime': '1635400652000',
        'signTime': '1635400652000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110281358093255',
        'projectName': '72731',
        'licenseNumber': '闽BQ7802',
        'driverPhone': '15859101002',
        'fillTime': '1635400689000',
        'signTime': '1635400689000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110281359246951',
        'projectName': '72731',
        'licenseNumber': '闽BQ7802',
        'driverPhone': '15859101002',
        'fillTime': '1635400764000',
        'signTime': '1635400764000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110281400052786',
        'projectName': '72731',
        'licenseNumber': '闽BQ7802',
        'driverPhone': '15859101002',
        'fillTime': '1635400805000',
        'signTime': '1635400805000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110281400585004',
        'projectName': '72731',
        'licenseNumber': '闽BQ7802',
        'driverPhone': '15859101002',
        'fillTime': '1635400859000',
        'signTime': '1635400859000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110281406075289',
        'projectName': '72731',
        'licenseNumber': '闽BQ7802',
        'driverPhone': '15859101002',
        'fillTime': '1635401168000',
        'signTime': '1635401168000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110281407400589',
        'projectName': '72731',
        'licenseNumber': '闽BQ7802',
        'driverPhone': '15859101002',
        'fillTime': '1635401261000',
        'signTime': '1635401261000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110281408246156',
        'projectName': '72731',
        'licenseNumber': '闽BQ7802',
        'driverPhone': '15859101002',
        'fillTime': '1635401304000',
        'signTime': '1635401304000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110281409221479',
        'projectName': '72731',
        'licenseNumber': '闽BQ7802',
        'driverPhone': '15859101002',
        'fillTime': '1635401362000',
        'signTime': '1635401362000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110281410047848',
        'projectName': '72731',
        'licenseNumber': '闽BQ7802',
        'driverPhone': '15859101002',
        'fillTime': '1635401404000',
        'signTime': '1635401404000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110281411005539',
        'projectName': '72731',
        'licenseNumber': '闽BQ7802',
        'driverPhone': '15859101002',
        'fillTime': '1635401460000',
        'signTime': '1635401460000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110281411452612',
        'projectName': '72731',
        'licenseNumber': '闽BQ7802',
        'driverPhone': '15859101002',
        'fillTime': '1635401505000',
        'signTime': '1635401505000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110281413200569',
        'projectName': '72731',
        'licenseNumber': '闽BQ7802',
        'driverPhone': '15859101002',
        'fillTime': '1635401600000',
        'signTime': '1635401600000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110281437396617',
        'projectName': '72731',
        'licenseNumber': '闽BQ7802',
        'driverPhone': '15859101002',
        'fillTime': '1635403059000',
        'signTime': '1635403059000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110281438191109',
        'projectName': '72731',
        'licenseNumber': '闽BQ7802',
        'driverPhone': '15859101002',
        'fillTime': '1635403100000',
        'signTime': '1635403100000',
        'serialNumber': '147'
      },
      {
        'orderId': '2110071020466679',
        'waybillNo': '2110281438589887',
        'projectName': '72731',
        'licenseNumber': '闽BQ7802',
        'driverPhone': '15859101002',
        'fillTime': '1635403138000',
        'signTime': '1635403138000',
        'serialNumber': '147'
      }
    ],
    'userInfo': {
      'project_id': '72731',
      'team_telno': '15859102001',
      'issuing_telno': '15859109601',
      'issuing_time': '1635403138000',
      'issuing_pc': '1635403844258564',
      'icType': 'r'
    },
    'meter': [
      '1010',
      '2'
    ],
    'userMark': '1000|4|'
  }];

// import AccountingTable from './components/AccountingTable';

// import CarInfo from './components/CarInfo';

// /transportation/cpuCard/listCardData
import { cardHistoryList, cardReplacement, cpuCardListCardData } from '@/api/dregs/card';

import CardReader, { versionMark, userMark } from '@/libs/ICCard/CardReader';
const { action, fn } = CardReader;

import { deepClone } from '@/utils';
import store from '@/store';



export default {
  // name: 'Card',
  //   components: { AccountingTable, CarInfo },

  // beforeRouteLeave: (to, from, next) => {
  //   CardReader.socket.onclose = function() {}; // disable onclose handler first
  //   CardReader.socket.close();
  //   CardReader.socket = null;
  //   next();
  // },

  data() {
    return {
      //   'showSearch': true,
      loading: false,
      total: 0,
      carTotal: 0,
      queryParams: {
        // 固定--
        pageNum: 1,
        pageSize: 10,
        driverNameOrPhone: undefined,
        licenseNumber: undefined,
        card16no: undefined,
        loadTime: undefined,
        unloadTime: undefined
        // receiveTime: []
      },

      //   isShipment: true,
      //   tableColumnsConfig: com,

      myData: daad,
      myDatafilter: daad,
      checkAll: false,
      isIndeterminate: false,

      selectedData: [],

      //   multiple: false,

      // 卡
      isConnect: false,
      cardinfoOpen: false,
      //   cardInfoData: null

      percentage1: false,
      percentage2: false,

      // 迁卡调度者
      dispatcher: undefined,
      dispatcherOptions: [{
        value: '选项1',
        label: '黄金糕'
      }, {
        value: '选项2',
        label: '双皮奶'
      }, {
        value: '选项3',
        label: '蚵仔煎'
      }, {
        value: '选项4',
        label: '龙须面'
      }, {
        value: '选项5',
        label: '北京烤鸭'
      }]
    };
  },

  computed: {
    // api() {
    //   return '454545';
    // },
    percentage() {
      return this.$store.state.icCard.percentage;
    },

    que() {
      return {
        ...this.queryParams,
        beginTime: this.queryParams.receiveTime
          ? this.queryParams.receiveTime[0]
          : undefined,
        endTime: this.queryParams.receiveTime
          ? this.queryParams.receiveTime[1]
          : undefined,
        receiveTime: undefined
      };
    }

    // testProcess() {
    //   return process.env.NODE_ENV === 'development';
    // }
  },

  watch: {
    myDatafilter: {
      handler(e) {
        if (e) {
          this.handlerUpDate();
          this.handleCheckedCitiesChange();
        }
      },
      deep: true
    }
  },

  created() {

    // this.getList();
    // console.log(this.parseTime(1635403138000, '{y}-{m}-{d} {h}:{i}:{s}'));
  },

  beforeDestroy() {
    // this._close();
  },

  methods: {
    // s= 读取卡基本数据
    getCardInfo() {
      if (this.isConnect) {
        this.loading = true;
        // 读取卡数据
        action.readUserInfoAndreadData().then((res) => {
          if (res.success && res.code === '9000') {
            const { dataList } = res;

            if (Array.isArray(dataList)) {
            //   const myData = dataList.map(e => e.waybillNo);
              this.carTotal = dataList.length;

              this.getList(dataList, res);
            } else {
              console.log('数据不是一个数组');
            }
          } else {
            this.msgWarning(res.msg);
            this.loading = false;
          }
        });

        // action.getCardInfo(undefined, true).then((res) => {
        //   console.log(res);
        //   if (res.success) {
        //     if (res.code === '9000') {
        //       this.$set(this.queryParams, 'card16no', res.GetCardNo.data);
        //       this.getList();
        //     }
        //   } else {
        //     this.msgError(res.msg);
        //   }
        // });
      }
    },

    // 获取迁卡数据(参数waybillNos, 卡的订单号)
    getList(dataList, CarData) {
      // 测试数据
      const waybillNos = dataList.map(e => e.waybillNo);

      cpuCardListCardData({ waybillNos: waybillNos.join(',') }).then(res => {
        const { GetCardNo, dataList, userInfo, meter, userMark } = CarData;
        this.myData = res.data.map(e => {
          e.GetCardNo = GetCardNo;
          e.dataList = dataList;
          e.userInfo = userInfo;
          e.meter = meter;
          e.userMark = userMark;

          return e;
        });
        this.myDatafilter = this.myData;
        this.total = res.data.length;
        this.msgSuccess('读卡成功, 读取' + dataList.length + '条, 数据库存在 ' + this.total + '条');
        this.loading = false;
      });
    },

    // e=

    // s= 时间筛选
    handleQuery(value, type) {
      if (value) {
        if (type === 'loadTime') {
          this.queryParams.unloadTime = undefined;
        } else {
          this.queryParams.loadTime = undefined;
        }

        this.myDatafilter = this.myData.filter(e => {
          return this.bjDate(value, e[type]) === '0';
        });
      } else {
        this.myDatafilter = this.myData;
      }
    },

    bjDate(date_0, date_1) {
      const date = new Date(date_0);
      const date1 = new Date(date_1);
      if (date.getTime() - date1.getTime() < 0) {
        return '0'; // 第二个时间大
      } else {
        return '1'; // 第一个时间大
      }
    },
    // e=

    // s= 表格选中
    handleSelectionChange(selected) {
      this.myDatafilter.forEach(file => {
        // 当前展示的
        file.__isselected = false;

        selected.forEach(ee => {
          if (ee.waybillNo === file.waybillNo) {
            file.__isselected = true;
          }
        });
      });

      this.myData.forEach(my => {
        this.myDatafilter.forEach(file => {
          if (my.waybillNo === file.waybillNo) {
            my.__isselected = file.__isselected;
          }
        });
      });
    },

    handleCheckedCitiesChange(value) {
      const arr = [];
      this.myDatafilter.forEach(e => {
        if (e.__isselected) {
          arr.push(true);
        }
      });
      const checkedCount = arr.length;

      this.checkAll = checkedCount !== 0 && (checkedCount === this.myDatafilter.length);
      this.isIndeterminate = checkedCount > 0 && checkedCount < this.myDatafilter.length;
      console.log(this.isIndeterminate);
    },

    handleCheckAllChange(value) {
      this.myDatafilter.forEach(e => {
        this.$set(e, '__isselected', value);
      });

      this.isIndeterminate = false;
    },

    // 新旧数据同步
    handlerUpDate() {
      const selectArr = [];
      const noSelectArr = [];

      this.myData.forEach(e => {
        this.myDatafilter.forEach(ee => {
          if (ee.waybillNo === e.waybillNo) {
            this.$set(e, '__isselected', ee.__isselected);
          }
        });


        if (e.__isselected) {
          selectArr.push(e);
        } else {
          noSelectArr.push(e);
        }

        this.selectedData = selectArr;
      });
    },

    /* 数组对象去重 */
    _deduplication(arr = [], key) {
      var result = [];
      var obj = {};

      for (var i = 0; i < arr.length; i++) {
        if (!obj[arr[i][key]]) {
          result.push(arr[i]);
          obj[arr[i][key]] = true;
        }
      }

      return result;
    },
    // e==


    // s= 迁卡
    handlerqianka() {
      // 进一步提示
      const h = this.$createElement;
      this.$msgbox({
        title: '消息',
        message: h('p', null, [
          h('h3', null, '迁卡步骤: '),
          h('p', null, '①放置卡片  把卡片放置在读卡器上，点击下方“开始读卡”按钮。'),
          h('p', null, '②筛选及提取数据 对数据按照一定条件进行筛选，并勾选出需要迁移的“签卡”数据，点击“下一步，核对数据”进行核对数据，核对无误之后点击“下一步，提取数据”，提取数据过程中卡片不能离开读卡器，直至提示“提取成功”语音提示，否则为提取失败。'),
          h('p', null, '③迁移数据 从读卡器上移除已提取数据的“原始卡”，放置一张新卡用于储存提取的数据，之后点击“下一步，开始迁卡”，迁移数据过程中卡片不能离开读卡器，直至提示“迁卡成功”语音提示，否则为迁卡失败。')
        ]),
        showCancelButton: true,
        closeOnClickModal: false,
        confirmButtonText: '确定',
        cancelButtonText: '取消'

      }).then(action => {
        // instance.confirmButtonLoading = true;
        this.loading = true; // 遮罩层
        this.percentage1 = true; // 进度条
        // 迁卡读取 清空,回填
        setTimeout(() => {
        //   instance.confirmButtonLoading = false;
          //   this.percentage = 100;
          setTimeout(() => {
            this.loading = false;
            this.percentage1 = false;
            store.commit('icCard/SET_percentage', 0);
            // 成功 后
            this.cardinfoOpen = true;
          }, 300);
          // 抽取成功
        }, 3000);
      });
    },

    handlerRelocateCard() {
      this.loading = true;
      this.percentage2 = true;
      this.cardinfoOpen = false;

      // 迁卡读取 清空,回填
      setTimeout(() => {
        // this.percentage = 100;
        // 抽取成功
        this.msgSuccess('迁卡成功, 卡内现有 9 条记录');
        setTimeout(() => {
          this.percentage2 = false;
          store.commit('icCard/SET_percentage', 0);
          this.loading = false;
          // 抽取成功
        }, 300);
      }, 3000);
    },
    // e=



    // 连接本地WebSocket服务
    handlerCarConnect(isConnect) {
      if (isConnect) {
        this._close();
        this.msgSuccess('断开连接成功');
        this.isConnect = false;
      } else {
        CardReader.fn.connect(
          () => {
            this.msgSuccess('连接成功');
            this.isConnect = true;
          },
          () => {
            this.isConnect = false;
          }
        );
      }
    },



    // 迁卡
    handlerMakeUp() {
      // console.log(this.selectedData, '数据');
      if (!this.isConnect) {
        this.msgWarning('未连接本地服务');
        return;
      }
      // console.log(USERINFO);
      action.getCardInfo(undefined, false).then((res) => {
        // console.log(res, '先获取卡信息');

        // console.log(this.selectedData);
        if (res.success) {
          if (res.code === '9000' && this.selectedData[0]) {
            const user = this.selectedData[0];
            const cardData = {
              card16no: user.card16no,
              newCard16no: res.GetCardNo.data + '', // 获取当前卡的id
              cardBatchNo: user.cardBatchNo
            };

            // 用户数据
            const userInfo = {
              icType: 'r',
              issuing_name: user.orderClient || '-', // orderClient	下单客户
              issuing_pc: user.cardBatchNo || '-', // cardBatchNo	卡批次
              issuing_telno: user.sipperPhone || '-', // sipperPhone	货主手机号
              issuing_time: this.setTimestamp(user.loadingTime) || '-', // loadingTime	装货时间
              project_id: user.projectId || '-', // projectId	项目Id
              team_name: user.teamName || '-', // teamName	车队名称
              team_telno: user.dispatchNumber || '-', // dispatchNumber	调度者手机号
              user_name: user.driverName || '-', // driverName	司机名字
              user_telno: user.driverPhone || '-' // driverPhone	司机电话
            };

            // 数据
            const data = this.selectedData.map((e) => {
              return {
                driverPhone: e.driverPhone || '-', // driverPhone	司机电话
                fillTime: this.setTimestamp(e.receiveTime) || '-', // loadingTime	接单时间
                licenseNumber: e.licenseNumber || '-', // '鄂ALF106',
                orderId: e.mainOrderNumber || '-', // mainOrderNumber	货源编号
                projectName: e.projectId || '-', // projectId	项目Id
                serialNumber: e.shipmentMuckyardNo || '-', // shipmentMuckyardNo	渣土场编号
                signTime: this.setTimestamp(e.loadingTime) || '-', // signTime	装货时间
                waybillNo: e.waybillNo || '-' // waybillNo	运单号
              };
            });

            // console.log(userMark, userInfo, versionMark, data, cardData);

            // 提示, 需要白卡

            this.$confirm(
              '此操作将初始化本卡后,再写入数据, 是否继续?',
              '提示',
              {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
              }
            )
              .then(() => {
                this.xexiaoCheck(
                  userMark,
                  userInfo,
                  versionMark,
                  data,
                  cardData
                );
              })
              .catch(() => {});
          }
        } else {
          this.msgError(res.msg);
        }
      });
    },

    // 初始卡功能
    handlerCardInit() {
      if (!this.isConnect) {
        this.msgWarning('未连接本地服务');
        return;
      }
      // ??
      this.$confirm('此操作将格式化本卡, 恢复到出厂状态, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          action.cancellation().then((res) => {
            if (res.success) {
              console.log(res);
              this.msgSuccess(res.msg || '初始化成功');
            } else {
              this.msgError(res.msg);
            }
            // console.log(res);
          });
        })
        .catch(() => {});
    },

    // 读取卡用户
    handlerReadUserinfo() {
      if (!this.isConnect) {
        this.msgWarning('未连接本地服务');
        return;
      }
      action.readUserInfo().then((res) => {
        if (res.success) {
          if (res.code === '9000') {
            this.cardInfoData = res;
            this.cardinfoOpen = true;
            this.msgSuccess(res.msg);
          } else {
            this.msgWarning(res.msg);
          }
        } else {
          this.msgError(res.msg);
        }
      });
    },

    // 读卡
    handlerReadData() {
      if (!this.isConnect) {
        this.msgWarning('未连接本地服务');
        return;
      }
      // 读取卡数据
      action.readUserInfoAndreadData().then((res) => {
        if (res.success) {
          if (res.code === '9000') {
            this.cardInfoData = res;
            this.cardinfoOpen = true;
          } else {
            this.msgWarning(res.msg);
          }
        } else {
          this.msgError(res.msg);
        }
      });
    },

    // 写用户信息
    async handlerWriteUser() {
      const userInfo = {
        icType: 'r',
        //   issuing_name: user.orderClient || "-", // orderClient	下单客户
        issuing_pc: 1627559938998505 || '-', // cardBatchNo	卡批次
        issuing_telno: 15859109601 || '-', // sipperPhone	货主手机号
        issuing_time: 1627559820000, // loadingTime	装货时间
        project_id: 72276 || '-', // projectId	项目Id
        //   team_name:  "-", // teamName	车队名称
        team_telno: 15859102001 || '-', // dispatchNumber	调度者手机号
        //   user_name:  "-", // driverName	司机名字
        user_telno: 15859101001 || '-' // driverPhone	司机电话
      };

      const cancellation = await action.cancellation();
      if (!cancellation.success || cancellation.code !== '9000') {
        this.msgError(cancellation.msg || '核销失败');
        return;
      }
      console.log(userMark);
      action.issuingCard(userInfo, userMark).then((res) => {
        console.log(res);
      });
    },
    // 写运单信息
    async handlerData() {
      const data = {
        driverPhone: '15859101001' || '-', // driverPhone	司机电话
        fillTime: '1627559820000' || '-', // loadingTime	接单时间
        licenseNumber: '闽BQ7801' || '-', // '鄂ALF106',
        orderId: '2107291757184088' || '-', // mainOrderNumber	货源编号
        projectName: '72276' || '-', // projectId	项目Id
        serialNumber: '74' || '-', // shipmentMuckyardNo	渣土场编号
        signTime: '1627559820000' || '-', // signTime	装货时间
        waybillNo: '2107291957141395' || '-' // waybillNo	运单号
      };
      //   console.log(fn.setData(versionMark, data)); // 1010|2|2107291757184088;2107291957141395;72276;闽BQ7801;15859101001;1627559820000;1627559820000;74
      //   return;

      action.writeData(fn.setData(versionMark, data)).then((res) => {
        console.log(res);
      });
    },

    // 选择的数据
    onAllSeleced(lists) {
      const arr = [];
      lists.forEach((e) => {
        e.childs.forEach((ee) => {
          arr.push(ee);
        });
      });
      // 判断是不是同一个调度者
      const object = {};
      arr.forEach((e) => {
        const str = e['cardBatchNo'];
        const array = object[str];
        if (array) {
          array.push(e);
        } else {
          const suibian = [e];
          object[str] = suibian;
        }
      });
      if (Object.keys(object).length > 1) {
        if (this.multiple) {
          // this.multiple = false;
          this.msgWarning('只能选择同批次的进行写卡');
        }
        this.multiple = false;
      } else {
        // console.log(arr);
        this.selectedData = arr;
      }
    },

    // 关闭
    _close() {
      if (CardReader.socket) {
        CardReader.socket.onclose = function() {}; // disable onclose handler first
        CardReader.socket.close();
        CardReader.socket = null;
        this.isConnect = false;
      }
    },

    // 写回卡的操作
    async xexiaoCheck(
      userMark = userMark,
      userInfo,
      meter = versionMark,
      data,
      cardData
    ) {
      // 走发卡-写卡
      if (!userInfo) return;
      try {
        this.loading = true;

        const cancellation = await action.cancellation();
        if (!cancellation.success || cancellation.code !== '9000') {
          this.msgError(cancellation.msg || '清卡失败');
          return;
        }

        const res = await action.issuingCard(userInfo, userMark);

        if (!res.success) {
          this.loading = false;
          this.msgError(res.code ? res.msg : '写卡失败, 请不要移动IC卡!');
          return;
        }

        if (res.success && res.code !== '9000') {
          this.loading = false;
          this.msgError(res.msg);
          return;
        }

        // console.log(res, '发卡成功');
      } catch (error) {
        this.msgError('写卡失败, 请不要移动IC卡!');
        this.loading = false;
        return;
      }

      // 写卡
      // 定义 版本标识
      // const meter = this.meter ? this.meter.join('|') + '|' : versionMark;

      // 通过时间来
      const arr = [];
      data.forEach(async(e, index) => {
        this['time' + index] = setTimeout(() => {
          action.writeData(fn.setData(meter, e)).then((res) => {
            console.log(res);

            clearTimeout(this['time' + index]);
            if (res.success) {
              if (res.code === '9000') {
                arr.push(true);
                // 执行到最后一步走这里
              } else {
                arr.push(false);
                this.msgError(res.msg);
              }
            } else {
              arr.push(false);
              // this.msgError('写卡失败, 请不要移动IC卡!');
            }

            if (arr.length === data.length) {
              // console.log(arr, '写入结束');

              if (arr.every((e) => e)) {
                cardReplacement({
                  card16no: cardData.card16no,
                  newCard16no: cardData.newCard16no,
                  cardBatchNo: cardData.cardBatchNo
                })
                  .then((res) => {
                    this.loading = false;
                    this.msgSuccess(res.msg || '补卡成功');
                    this.getList();
                  })
                  .catch(() => {
                    this.loading = false;
                  });
              } else {
                this.loading = false;
                this.msgError('写入失败');
              }
            }
          });
        }, (index + 1) * 500);
      });
    },

    // 转时间戳
    setTimestamp(yyyyMMddHHmmss) {
      if (!yyyyMMddHHmmss) return '';
      let date = yyyyMMddHHmmss + '';
      if (date.indexOf('-') !== -1) {
        var data = new Date(yyyyMMddHHmmss);
        date = data.getTime();
      }
      return date + '';
    }
  }
};
</script>


<style scoped>
.progress-box{
    width: 50vw;
    position: fixed;
    top: 30%;
    left: 0;
    right: 0;
    z-index: 20212021;
    transform: translate(50%);
    padding: 50px;
}
</style>
