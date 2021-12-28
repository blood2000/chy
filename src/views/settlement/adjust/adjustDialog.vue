<template>
  <div v-loading="loading">
    <!-- <el-dialog v-loading="adjustLoading" class="i-adjust" :title="title" :visible="visible" width="1400px" :close-on-click-modal="false" append-to-body @close="cancel"> -->
    <el-drawer
      v-loading="adjustLoading"
      size="100%"
      title="核算"
      :visible.sync="visible"
      direction="rtl"
      append-to-body
      destroy-on-close
      :before-close="cancel"
      class="page-shipment-manage-dialog"
    >
      <div slot="title" class="m20 ly-flex-align-center ly-flex-pack-justify">
        <div>
          <span class="mr10">批量修改(元)： </span>
          <el-select
            v-model="selectedValue"
            size="small"
            placeholder="请选择"
            class="mr10"
            @change="handlerChangeSelectedValue"
          >
            <el-option-group
              v-for="group in openShowList"
              :key="group.label"
              :label="group.label"
            >
              <el-option
                v-for="(item, index) in group.options"
                :key="index"
                :label="item.cnName"
                :value="item.enName"
              />
            </el-option-group>
          </el-select>
          <el-input-number
            v-model="selectedNum"
            style="width: 200px"
            size="small"
            controls-position="right"
            :min="0"
            :precision="2"
            placeholder="请输入批量修改的值"
            @keyup.enter.native="handleSelectedNumChange"
          />
          <el-button
            size="small"
            class="m20"
            type="primary"
            :disabled="!modify"
            :loading="plLoading"
            @click="handleSelectedNumChange"
          >立即修改</el-button>
        </div>

        <div class="ishfeiwhiefw">
          <tablec-cascader
            v-model="tableColumnsConfig"
            :lcokey="api"
            @input="handlerInput"
          />
        </div>
      </div>

      <div class="cont-frame">
        <div class="tongji">
          <TotalBar :total-list="totalList" />

          <RefactorTable
            :key="rendkey"
            ref="refactorTable"
            ref-name="adjustTable"
            :loading="loading"
            :data="adjustlist"
            :summary="showSummary"
            :summary-method="getSummaries"
            :table-columns-config="tableColumnsConfig"
            :height="adjustTableHeight"
            highlight-current-row
            border
            is-show-expand
            :row-class-name="tableRowClassName"
            @row-click="showImg"
            @selection-change="handleSelectionChange"
          >
            <template #expand="{ row }">
              <el-descriptions
                class="margin-top"
                :column="3"
                size="mini"
                :title="'运输单号: ' + row.waybillNo"
                border
                style="width: calc(90vw-460px); margin-left: 110px"
              >
                <el-descriptions-item>
                  <template slot="label"> 司机姓名 </template>
                  {{ row.driverName }}
                </el-descriptions-item>
                <el-descriptions-item>
                  <template slot="label"> 司机电话 </template>
                  {{ row.driverPhone }}
                </el-descriptions-item>
                <el-descriptions-item>
                  <template slot="label"> 车牌号 </template>
                  {{ row.licenseNumber }}
                </el-descriptions-item>
                <el-descriptions-item>
                  <template slot="label"> 配载方式 </template>
                  {{ selectDictLabel(stowageStatusOP, row.stowageStatus) }}
                </el-descriptions-item>
                <el-descriptions-item>
                  <template slot="label"> 路耗(吨/方) </template>
                  <span v-if="row.stowageStatus !== '2'">{{
                    floor(row.loss - 0, 3)
                  }}</span>
                  <span v-else>{{ row.loss || 0 }}</span>
                </el-descriptions-item>
                <el-descriptions-item>
                  <template slot="label"> 路耗允许范围(kg/m³/%) </template>
                  <span>{{ _lossAllowScope(row.lossAllowScope) || "--" }}</span>
                </el-descriptions-item>
                <el-descriptions-item>
                  <template slot="label"> 货物单价(元) </template>
                  {{ floor(row.goodsPrice) }}
                </el-descriptions-item>
                <el-descriptions-item>
                  <template slot="label"> 运输单价(元) </template>
                  {{ floor(row.freightPrice) }}
                </el-descriptions-item>

                <el-descriptions-item>
                  <template slot="label"> 亏涨扣费(元) </template>
                  {{ floor(row.lossDeductionFee) }}
                </el-descriptions-item>
                <el-descriptions-item>
                  <template slot="label"> 抹零金额(元) </template>
                  {{ floor(row.m0Fee) }}
                </el-descriptions-item>
                <el-descriptions-item>
                  <template slot="label"> 司机应收运费(元) </template>
                  {{ floor(row.deliveryFeeDeserved) }}
                </el-descriptions-item>
                <el-descriptions-item>
                  <template slot="label"> 留存运费(元) </template>
                  {{ floor(row.taxPayment) }}
                </el-descriptions-item>
                <el-descriptions-item>
                  <template slot="label"> 服务费(元) </template>
                  {{ floor(row.serviceFee) }}
                </el-descriptions-item>
                <el-descriptions-item>
                  <template slot="label"> 司机实收金额(元) </template>
                  {{ floor(row.deliveryCashFee) }}
                </el-descriptions-item>
                <el-descriptions-item>
                  <template slot="label"> 货主实付金额(元) </template>
                  {{ floor(row.shipperRealPay) }}
                </el-descriptions-item>
              </el-descriptions>
            </template>

            <template #waybillNo="{ row }">
              <div>{{ row.waybillNo }}</div>
              <div>{{ row.driverName }}</div>
              <div>{{ row.driverPhone }}</div>
              <div>{{ row.licenseNumber }}</div>
            </template>

            <template #loadWeight="{ row }">
              <span v-if="row.isDregs === 1">{{
                floor(row.loadWeight, row.stowageStatus === "2" ? 0 : 3)
              }}</span>
              <div v-else>
                <el-input-number
                  v-if="row.stowageStatus !== '2'"
                  v-model="row.loadWeight"
                  :precision="3"
                  :controls="false"
                  placeholder="请输入装货数量"
                  style="width: 100%"
                  size="mini"
                  @change="handlerChangev(row)"
                  @keyup.enter.native="handlerChangev(row)"
                />
                <span v-else>{{
                  floor(row.loadWeight, row.stowageStatus === "2" ? 0 : 3)
                }}</span>
              </div>
            </template>

            <template #unloadWeight="{ row }">
              <span v-if="row.isDregs === 1">{{
                floor(row.unloadWeight, row.stowageStatus === "2" ? 0 : 3)
              }}</span>
              <div v-else>
                <el-input-number
                  v-if="row.stowageStatus !== '2'"
                  v-model="row.unloadWeight"
                  :precision="3"
                  :controls="false"
                  placeholder="请输入卸货数量"
                  style="width: 100%"
                  size="mini"
                  @change="handlerChangev(row)"
                  @keyup.enter.native="handlerChangev(row)"
                />
                <span v-else>{{
                  floor(row.unloadWeight, row.stowageStatus === "2" ? 0 : 3)
                }}</span>
              </div>
            </template>

            <template #stowageStatus="{ row }">
              <span>{{
                selectDictLabel(stowageStatusOP, row.stowageStatus)
              }}</span>
            </template>

            <template #loss="{ row }">
              <span v-if="row.stowageStatus !== '2'">{{
                floor(row.loss - 0, 3)
              }}</span>
              <span v-else>{{ row.loss || 0 }}</span>
            </template>

            <template #lossAllowScope="{ row }">
              <span>{{ _lossAllowScope(row.lossAllowScope) || "--" }}</span>
            </template>

            <template #goodsPrice="{ row }">
              <div>货物单价</div>
              <span>{{ floor(row.goodsPrice) }}</span>
              <div>运输单价</div>
              <span>{{ floor(row.freightPrice) }}</span>
            </template>

            <template #lossDeductionFee="{ row }">
              <span>{{ floor(row.lossDeductionFee) }}</span>
            </template>

            <template #m0Fee="{ row }">
              <span>{{ floor(row.m0Fee) }}</span>
            </template>

            <template #deliveryFeeDeserved="{ row }">
              <span>{{ floor(row.deliveryFeeDeserved) }}</span>
            </template>

            <template #header_subsidyProject>
              <span>补贴项目
                <el-button
                  type="text"
                  @click="isEdit2 = !isEdit2"
                ><i
                  class="el-icon-edit"
                /></el-button>
                <el-button
                  type="text"
                  @click="handlerClick"
                ><i
                  class="el-icon-plus"
                /></el-button>
              </span>
            </template>
            <template #header_deductionItem>
              <span>扣费项目
                <el-button
                  type="text"
                  @click="isEdit = !isEdit"
                ><i
                  class="el-icon-edit"
                /></el-button>
                <el-button
                  type="text"
                  @click="handlerdeduc"
                ><i
                  class="el-icon-plus"
                /></el-button>
              </span>
            </template>

            <!-- 具体补贴项目 -->
            <template #subsidyProject="{ row }">
              <span v-if="row.isDregs == 1"> -- </span>

              <el-form
                v-else
                :inline="true"
                label-position="right"
                size="mini"
                class="ly-flex"
                label-width="100px"
              >
                <div
                  v-for="(freight, index) in row.subsidiesFreightList"
                  :key="index"
                >
                  <!-- 渣土 其他不能修改 -->
                  <el-form-item :label="freight.cnName + '(元)'">
                    <span v-if="row.isDregs === 1">{{ freight.ruleValue }}</span>
                    <div v-else>
                      <span v-show="!isEdit2">{{ freight.ruleValue }}</span>
                      <el-input-number
                        v-show="isEdit2"
                        v-model="freight.ruleValue"
                        :controls="false"
                        :precision="2"
                        :min="0"
                        :disabled="handlerDisabled(freight)"
                        :placeholder="`${freight.cnName}`"
                        style="width: 100px"
                        @change="handlerChangev(row)"
                        @keyup.enter.native="handlerChangev(row)"
                      />
                    </div>
                  </el-form-item>
                </div>
              </el-form>
            </template>

            <!-- 具体扣费项目 -->
            <template #deductionItem="{ row }">
              <span v-if="row.isDregs === 1"> -- </span>
              <el-form
                v-else
                :inline="true"
                label-position="right"
                size="mini"
                class="ly-flex"
                label-width="100px"
              >
                <div
                  v-for="(freight, index) in row.deductionFreightList"
                  :key="index"
                >
                  <el-form-item :label="freight.cnName + '(元)'">
                    <div>
                      <span v-show="!isEdit">{{ freight.ruleValue }}</span>
                      <el-input-number
                        v-show="isEdit"
                        v-model="freight.ruleValue"
                        :controls="false"
                        :precision="2"
                        :min="0"
                        :disabled="handlerDisabled(freight)"
                        :placeholder="`${freight.cnName}`"
                        style="width: 100px"
                        @change="handlerChangev(row)"
                        @keyup.enter.native="handlerChangev(row)"
                      />
                    </div>
                  </el-form-item>
                </div>
              </el-form>
            </template>

            <template #taxPayment="{ row }">
              <span> {{ floor(row.taxPayment) }} </span>
            </template>

            <template #serviceFee="{ row }">
              <span> {{ floor(row.serviceFee) }} </span>
            </template>

            <template #deliveryCashFee="{ row }">
              <span>{{ floor(row.deliveryCashFee) }}</span>
            </template>

            <template #shipperRealPay="{ row }">
              <span> {{ floor(row.shipperRealPay) }} </span>
            </template>
          </RefactorTable>
        </div>


        <el-table
          v-if="false"
          ref="adjustTable"
          v-loading="loading"
          :height="adjustTableHeight"
          highlight-current-row
          :data="adjustlist"
          border
          :row-class-name="tableRowClassName"
          show-summary
          :summary-method="getSummaries"
          @row-click="showImg"
        >
          <el-table-column
            v-if="false"
            label="运输单号 / 司机姓名 / 司机电话 / 车牌号"
            width="138"
            show-overflow-tooltip
            align="left"
            prop="waybillNo"
          >
            <template slot-scope="scope">
              <div>{{ scope.row.waybillNo }}</div>
              <div>{{ scope.row.driverName }}</div>
              <div>{{ scope.row.driverPhone }}</div>
              <div>{{ scope.row.licenseNumber }}</div>
            </template>
          </el-table-column>
          <el-table-column label="装货数量" align="center" prop="loadWeight">
            <template slot-scope="scope">
              <!-- <span v-if="scope.row.isDregs === 1">{{ scope.row.loadWeight }}</span> -->
              <span v-if="scope.row.isDregs === 1">{{
                floor(
                  scope.row.loadWeight,
                  scope.row.stowageStatus === "2" ? 0 : 3
                )
              }}</span>
              <div v-else>
                <el-input-number
                  v-if="scope.row.stowageStatus !== '2'"
                  v-model="scope.row.loadWeight"
                  :precision="3"
                  :controls="false"
                  placeholder="请输入装货数量"
                  style="width: 100%"
                  size="mini"
                  @change="handlerChangev(scope.row)"
                  @keyup.enter.native="handlerChangev(scope.row)"
                />
                <!-- @keyup.native="handlerBlur($event,scope.row,false,'loadWeight')" -->
                <!-- <span v-else>{{ scope.row.loadWeight }}</span> -->
                <span v-else>{{
                  floor(
                    scope.row.loadWeight,
                    scope.row.stowageStatus === "2" ? 0 : 3
                  )
                }}</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="卸货数量" align="center" prop="unloadWeight">
            <template slot-scope="scope">
              <!-- <span v-if="scope.row.isDregs === 1">{{ scope.row.unloadWeight }}</span> -->
              <span v-if="scope.row.isDregs === 1">{{
                floor(
                  scope.row.unloadWeight,
                  scope.row.stowageStatus === "2" ? 0 : 3
                )
              }}</span>
              <div v-else>
                <el-input-number
                  v-if="scope.row.stowageStatus !== '2'"
                  v-model="scope.row.unloadWeight"
                  :precision="3"
                  :controls="false"
                  placeholder="请输入卸货数量"
                  style="width: 100%"
                  size="mini"
                  @change="handlerChangev(scope.row)"
                  @keyup.enter.native="handlerChangev(scope.row)"
                />
                <!-- @keyup.native="handlerBlur($event,scope.row,false,'unloadWeight')" -->
                <!-- <span v-else>{{ scope.row.unloadWeight }}</span> -->
                <span v-else>{{
                  floor(
                    scope.row.unloadWeight,
                    scope.row.stowageStatus === "2" ? 0 : 3
                  )
                }}</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column
            label="配载方式"
            width="50"
            align="center"
            prop="stowageStatus"
          >
            <template slot-scope="scope">
              <span>{{
                selectDictLabel(stowageStatusOP, scope.row.stowageStatus)
              }}</span>
            </template>
          </el-table-column>
          <el-table-column label="路耗(吨/方)" align="center" prop="loss">
            <template slot-scope="scope">
              <span v-if="scope.row.stowageStatus !== '2'">{{
                floor(scope.row.loss - 0, 3)
              }}</span>
              <span v-else>{{ scope.row.loss || 0 }}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="路耗允许范围(kg/m³/%)"
            align="center"
            prop="lossAllowScope"
          >
            <template slot-scope="scope">
              <span>{{
                _lossAllowScope(scope.row.lossAllowScope) || "--"
              }}</span>
            </template>
          </el-table-column>
          <el-table-column label="单价(元)" align="left" prop="goodsPrice">
            <template slot-scope="scope">
              <div>货物单价</div>
              <span>{{ floor(scope.row.goodsPrice) }}</span>
              <div>运输单价</div>
              <span>{{ floor(scope.row.freightPrice) }}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="亏涨扣费(元)"
            align="center"
            prop="lossDeductionFee"
          >
            <template slot-scope="scope">
              <span>{{ floor(scope.row.lossDeductionFee) }}</span>
            </template>
          </el-table-column>
          <el-table-column label="抹零金额(元)" align="center" prop="m0Fee">
            <template slot-scope="scope">
              <span>{{ floor(scope.row.m0Fee) }}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="司机应收运费(元)"
            align="center"
            prop="deliveryFeeDeserved"
          >
            <template slot-scope="scope">
              <span>{{ floor(scope.row.deliveryFeeDeserved) }}</span>
            </template>
          </el-table-column>
          <!-- 补贴项目 -->
          <el-table-column align="center" width="120" label="补贴项目">
            <template slot="header">
              <span>补贴项目
                <el-button
                  type="text"
                  @click="isEdit2 = !isEdit2"
                ><i
                  class="el-icon-edit"
                /></el-button>

                <el-button
                  type="text"
                  @click="handlerClick"
                ><i
                  class="el-icon-plus"
                /></el-button>

                <!-- 1: 是增 2: 是减
              <el-popover
                placement="right"
                width="400"
                trigger="click"
              >
                <PopoverCom v-if="popoverOpenCom" :list="felexes" />
                <el-button slot="reference" type="text" @click="handlerClick"><i class="el-icon-plus" /></el-button>
              </el-popover> -->
              </span>
            </template>
            <template slot-scope="scope">
              <span v-if="scope.row.isDregs == 1"> -- </span>

              <el-form
                v-else
                :inline="true"
                label-position="right"
                size="mini"
                class="ly-flex"
                label-width="100px"
              >
                <div
                  v-for="(freight, index) in scope.row.subsidiesFreightList"
                  :key="index"
                >
                  <!-- 渣土 其他不能修改 -->
                  <el-form-item :label="freight.cnName + '(元)'">
                    <span v-if="scope.row.isDregs === 1">{{
                      freight.ruleValue
                    }}</span>
                    <div v-else>
                      <span v-show="!isEdit2">{{ freight.ruleValue }}</span>
                      <el-input-number
                        v-show="isEdit2"
                        v-model="freight.ruleValue"
                        :controls="false"
                        :precision="2"
                        :min="0"
                        :disabled="handlerDisabled(freight)"
                        :placeholder="`${freight.cnName}`"
                        style="width: 100px"
                        @change="handlerChangev(scope.row)"
                        @keyup.enter.native="handlerChangev(scope.row)"
                      />
                      <!-- @keyup.native="handlerBlur($event,scope.row, freight)" -->
                    </div>
                  </el-form-item>
                </div>
              </el-form>
            </template>
          </el-table-column>
          <!-- 扣费项目 -->
          <el-table-column align="center" width="120" label="扣费项目">
            <template slot="header">
              <span>扣费项目
                <el-button
                  type="text"
                  @click="isEdit = !isEdit"
                ><i
                  class="el-icon-edit"
                /></el-button>
                <el-button
                  type="text"
                  @click="handlerdeduc"
                ><i
                  class="el-icon-plus"
                /></el-button>
              </span>
            </template>
            <template slot-scope="scope">
              <span v-if="scope.row.isDregs === 1"> -- </span>
              <el-form
                v-else
                :inline="true"
                label-position="right"
                size="mini"
                class="ly-flex"
                label-width="100px"
              >
                <div
                  v-for="(freight, index) in scope.row.deductionFreightList"
                  :key="index"
                >
                  <el-form-item :label="freight.cnName + '(元)'">
                    <div>
                      <span v-show="!isEdit">{{ freight.ruleValue }}</span>
                      <el-input-number
                        v-show="isEdit"
                        v-model="freight.ruleValue"
                        :controls="false"
                        :precision="2"
                        :min="0"
                        :disabled="handlerDisabled(freight)"
                        :placeholder="`${freight.cnName}`"
                        style="width: 100px"
                        @change="handlerChangev(scope.row)"
                        @keyup.enter.native="handlerChangev(scope.row)"
                      />
                      <!-- @keyup.native="handlerBlur($event,scope.row, freight)" -->
                    </div>
                  </el-form-item>
                </div>
              </el-form>
            </template>
          </el-table-column>

          <el-table-column
            label="留存运费(元)"
            align="center"
            prop="taxPayment"
          >
            <template slot-scope="scope">
              <span> {{ floor(scope.row.taxPayment) }} </span>
            </template>
          </el-table-column>
          <el-table-column label="服务费(元)" align="center" prop="serviceFee">
            <template slot-scope="scope">
              <span> {{ floor(scope.row.serviceFee) }} </span>
            </template>
          </el-table-column>
          <el-table-column
            label="司机实收金额(元)"
            align="center"
            prop="deliveryCashFee"
          >
            <template slot-scope="scope">
              <span>{{ floor(scope.row.deliveryCashFee) }}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="货主实付金额(元)"
            align="center"
            prop="shipperRealPay"
          >
            <template slot-scope="scope">
              <span> {{ floor(scope.row.shipperRealPay) }} </span>
            </template>
          </el-table-column>
        </el-table>
        <ImgShow :rowdata="rowData" />
      </div>

      <div class="drawer-footer">
        <el-button
          type="primary"
          :loading="plLoading || loading"
          @click="submitForm"
        >立即核算</el-button>
        <el-button @click="cancel">返回</el-button>
      </div>
    </el-drawer>
    <!-- </el-dialog> -->

    <el-dialog
      :title="'规则'"
      class="i-price"
      :visible.sync="popoverOpenCom"
      append-to-body
    >
      <div slot="title" class="ly-flex">
        <div class="b">规则</div>
        <div
          v-if="
            isDifferent && (!isDifferent.sublength || !isDifferent.dedlength)
          "
          style="flex: 1; margin: 0 50px"
        >
          <el-alert :title="warningtitle" type="warning" effect="dark" />
        </div>
      </div>
      <PopoverCom
        v-if="popoverOpenCom"
        :seleced-name="selecedName"
        :jian-data="jianData"
        :list="showSubList"
        @submitForm="handlerSubmit"
      />
    </el-dialog>
  </div>
</template>

<script>
import PopoverCom from './components/PopoverCom';
import ImgShow from './components/ImgShow';
import TotalBar from '@/components/Ddc/Tin/TotalBar';
// import chooseItemDialog from '@/views/enterprise/rules/chooseItemDialog';
import {
  adjustDetail,
  calculateFee,
  batchCalculate
} from '@/api/settlement/adjust';
import { batchCheck } from '@/api/settlement/toadjust';
import { getRuleItemList } from '@/api/enterprise/rules';
import { floor, objReduce } from '@/utils/ddc';

import { deepClone } from '@/utils/index';

import { getLocalStorage } from '@/utils/auth';



export default {
  name: 'AdjustDialog',
  components: { PopoverCom, ImgShow, TotalBar },
  props: {
    title: {
      type: String,
      default: ''
    },
    open: Boolean
    // disable: Boolean
  },
  data() {
    return {
      rendkey: Date.now(),
      windShow: false, // 规则不一样提示

      plLoading: false, // 批量
      selectedValue: '', // 下拉值
      selectedNum: undefined,
      showSubList: [],
      popoverOpenCom: false,
      mtype: '1',
      subsidiesClone: [],
      deductionClone: [],
      selecedName: [],
      jianData: [],
      // fixed: [], // 固定的规则
      // title12: '',
      // open12: false,
      // shipmentCode: '',

      //
      isPiliang: false,
      isEdit2: true,
      isEdit: true,
      deliveryCashFee: undefined,
      // 遮罩层
      loading: false,
      loading1: false,
      // 评价列表
      adjustlist: [],
      // 查询参数
      queryParams: {
        waybillCodeList: []
      },
      floor,
      errList: [],
      className: '',
      adjustLoading: false,
      changeFee: null,
      rowData: {},

      adjustTableHeight: 779, //

      selecedData: [], // 选中的数据
      hejiData: [],
      showSummary: true,

      // 配载方式 0->吨，1->方 2->车数配载
      stowageStatusOP: [
        { dictLabel: '吨', dictValue: '0' },
        { dictLabel: '方', dictValue: '1' },
        { dictLabel: '车', dictValue: '2' }
      ],

      tableColumnsConfig: [
        {
          prop: 'waybillNo',
          isShow: false,
          width: 150,
          tooltip: true,
          sortNum: 1,
          label: '运输单号 / 司机姓名 / 司机电话 / 车牌号'
        },
        {
          prop: 'loadWeight',
          isShow: true,
          width: 90,
          tooltip: false,
          sortNum: 2,
          label: '装货数量'
        },
        {
          prop: 'unloadWeight',
          isShow: true,
          width: 90,
          tooltip: false,
          sortNum: 3,
          label: '卸货数量'
        },
        {
          prop: 'stowageStatus',
          isShow: false,
          width: 50,
          tooltip: true,
          sortNum: 4,
          label: '配载方式'
        },
        {
          prop: 'loss',
          isShow: false,
          width: 120,
          tooltip: true,
          sortNum: 5,
          label: '路耗(吨/方)'
        },
        {
          prop: 'lossAllowScope',
          isShow: false,
          width: 110,
          tooltip: true,
          sortNum: 6,
          label: '路耗允许范围(kg/m³/%)'
        },
        {
          prop: 'goodsPrice',
          isShow: false,
          width: 110,
          tooltip: true,
          sortNum: 7,
          label: '单价(元)'
        },

        {
          prop: 'subsidyProject',
          isShow: true,
          width: 250,
          tooltip: true,
          sortNum: 8,
          label: '补贴项目'
        },
        {
          prop: 'deductionItem',
          isShow: true,
          width: 250,
          tooltip: true,
          sortNum: 9,
          label: '扣费项目'
        },

        {
          prop: 'lossDeductionFee',
          isShow: false,
          width: 110,
          tooltip: true,
          sortNum: 10,
          label: '亏涨扣费(元)'
        },
        {
          prop: 'm0Fee',
          isShow: false,
          width: 110,
          tooltip: true,
          sortNum: 11,
          label: '抹零金额(元)'
        },
        {
          prop: 'deliveryFeeDeserved',
          isShow: false,
          width: 110,
          tooltip: true,
          sortNum: 12,
          label: '司机应收运费(元)'
        },
        {
          prop: 'taxPayment',
          isShow: false,
          width: 110,
          tooltip: true,
          sortNum: 13,
          label: '留存运费(元)'
        },
        {
          prop: 'serviceFee',
          isShow: true,
          width: 80,
          tooltip: true,
          sortNum: 14,
          label: '服务费(元)'
        },
        {
          prop: 'deliveryCashFee',
          isShow: true,
          width: 80,
          tooltip: true,
          sortNum: 15,
          label: '司机实收金额(元)'
        },
        {
          prop: 'shipperRealPay',
          isShow: true,
          width: 80,
          tooltip: true,
          sortNum: 16,
          label: '货主实付金额(元)'
        }
      ] // 表单
    };
  },
  computed: {
    api() {
      return 'sfeowofwow';
    },

    visible: {
      get() {
        return this.open;
      },
      set(v) {
        this.$emit('update:open', v);
      }
    },

    openShowList() {
      const subList = [];
      const dedList = [];
      this.adjustlist.forEach((e) => {
        e.subsidiesFreightList &&
          e.subsidiesFreightList.forEach((ee) => {
            subList.push(ee);
          });
        e.deductionFreightList &&
          e.deductionFreightList.forEach((ee) => {
            dedList.push(ee);
          });
      });
      const arr = [
        {
          label: '补贴项目',
          options: objReduce(subList, 'enName')
        },
        {
          label: '扣费项目',
          options: objReduce(dedList, 'enName')
        }
      ];

      return arr;
    },

    modify() {
      return this.selectedValue && this.selectedNum > 0;
    },

    totalList() {
      const serviceFee = [];
      const deliveryCashFee = [];
      const shipperRealPay = [];

      if (this.selecedData.length > 0) {
        this.selecedData.forEach(ee => {
          serviceFee.push(ee.serviceFee - 0);
          deliveryCashFee.push(ee.deliveryCashFee - 0);
          shipperRealPay.push(ee.shipperRealPay - 0);
        });
      }

      return [
        {
          label: '服务费',
          value: this.floor(
            serviceFee.length > 0 ? serviceFee.reduce((p, c) => (p + c)) : 0
          ) + ' 元',
          key: 'serviceFee'
        },
        {
          label: '司机实收金额',
          value: this.floor(
            deliveryCashFee.length > 0 ? deliveryCashFee.reduce((p, c) => (p + c)) : 0
          ) + ' 元',
          key: 'deliveryCashFee'
        },
        {
          label: '货主实付金额',
          value: this.floor(
            shipperRealPay.length > 0 ? shipperRealPay.reduce((p, c) => (p + c)) : 0
          ) + ' 元',
          key: 'shipperRealPay'
        }
      ];
    },

    // 简单提示增减项不一样
    isDifferent() {
      const sublength = [];
      const dedlength = [];
      this.adjustlist.forEach((e) => {
        sublength.push(
          e.subsidiesFreightList ? e.subsidiesFreightList.length : 0
        );
        dedlength.push(
          e.deductionFreightList ? e.deductionFreightList.length : 0
        );
      });

      return {
        sublength: [...new Set(sublength)].length <= 1,
        dedlength: [...new Set(dedlength)].length <= 1
      };
    },
    // 警告提示语
    warningtitle() {
      const sa = this.isDifferent.sublength ? '' : '补贴项目规则数量不同。';
      const sb = this.isDifferent.dedlength ? '' : '扣费项目规则数量不同。';

      return sa + sb + '建议: 核算选择一样的规则再进行批量处理!'; // 批量处理。
    }
  },

  created() {
    if (getLocalStorage(this.api)) {
      this.tableHeaderConfig = getLocalStorage(this.api);
    }

    this.changeFee = this.newDebounceFun(this.setDeliveryCashFee, 1000);
  },

  methods: {
    handleSelectionChange(selecedData) {
      this.selecedData = selecedData;
      // console.log(this.$refs.refactorTable.$children[0]);
      // this.$nextTick(() => {
      //   const { summaryMethod, columns, selection } =
      //     this.$refs.refactorTable.$children[0];

      //   this.hejiData = summaryMethod({ columns, data: selection });
      // });
    },

    handlerDisabled(row) {
      let disable = false;
      if (row.ruleItemCode === '22' || row.ruleItemCode === '21') {
        disable = true;
      }
      return disable;
    },

    showImg(row) {
      this.rowData = row;
      // this.$refs.refactorTable.$children[0].toggleRowExpansion(row);
    },
    // 数字change事件
    handlerChangev(row) {
      const parame = {
        driverReductionFee: this._sum(row.deductionFreightList),
        m0DictValue: row.m0DictValue,
        freightPrice: row.freightPrice,
        ruleFormulaDictValue: row.ruleFormulaDictValue,
        shipperCode: row.shipperCode,
        stowageStatus: row.stowageStatus,
        driverAddFee: this._sum(row.subsidiesFreightList),
        loadWeight: row.loadWeight,
        unloadWeight: row.unloadWeight,
        waybillCode: row.waybillCode
        // serviceFee,
        // serviceTaxFee,
        // taxPayment
      };

      this.changeFee(parame, row);
    },

    // 单项修改
    async setDeliveryCashFee(parame, row) {
      this.loading1 = true;
      this.plLoading = true;
      try {
        var data = {};
        await calculateFee(parame).then((res) => {
          data = res.data;
          if (res.code === 501 && res.msg) {
            this.msgError(res.msg);
          }
        });
        this.loading1 = false;
        this.plLoading = false;
        // lossDeductionFee
        row.lossDeductionFee = data.lossDeductionFee;
        row.deliveryFeeDeserved = data.deliveryFeeDeserved;
        row.deliveryCashFee = data.driverRealFee; // ?
        row.serviceFee = data.serviceFee;
        row.serviceTaxFee = data.serviceTaxFee; // ?
        row.shipperCopeFee = data.shipperCopeFee;
        row.shipperRealPay = data.shipperRealPay;
        row.taxFreeFee = data.taxFreeFee; // ?
        row.taxPayment = data.taxPayment;
        row.m0Fee = data.m0Fee;
        row.loss = data.loss;
      } catch (error) {
        this.loading1 = false;
        this.plLoading = false;
      }
    },

    // 批量修改
    async handlerBatchCalculate() {
      // 需要值: selectedValue   selectedNum  this.adjustlist enName ruleValue
      this.plLoading = true;
      const req = this.adjustlist.map((e) => {
        return {
          m0DictValue: e.m0DictValue,
          freightPrice: e.freightPrice,
          ruleFormulaDictValue: e.ruleFormulaDictValue,
          shipperCode: e.shipperCode,
          stowageStatus: e.stowageStatus,
          loadWeight: e.loadWeight,
          unloadWeight: e.unloadWeight,
          waybillCode: e.waybillCode,
          driverAddFee: e.subsidiesFreightList
            ? this._sum(e.subsidiesFreightList)
            : 0,
          driverReductionFee: e.deductionFreightList
            ? this._sum(e.deductionFreightList)
            : 0
        };
      });
      try {
        const res = await batchCalculate(req);

        if (res.code === 501) {
          this.msgError(res.msg);
          this.plLoading = false;
          return;
        }

        res.data.forEach((ee) => {
          this.adjustlist.forEach((e) => {
            if (ee.waybillCode === e.waybillCode) {
              e.lossDeductionFee = ee.lossDeductionFee;
              e.deliveryFeeDeserved = ee.deliveryFeeDeserved;
              e.deliveryCashFee = ee.driverRealFee;
              e.serviceFee = ee.serviceFee;
              e.serviceTaxFee = ee.serviceTaxFee;
              e.shipperCopeFee = ee.shipperCopeFee;
              e.shipperRealPay = ee.shipperRealPay;
              e.taxFreeFee = ee.taxFreeFee;
              e.taxPayment = ee.taxPayment;
              e.m0Fee = ee.m0Fee;
              e.loss = ee.loss;
            }
          });
        });
        this.plLoading = false;
      } catch (error) {
        this.plLoading = false;
      }
    },

    /** 提交按钮 */
    async submitForm() {
      this.$confirm('确定要立即核算?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // const boList = this.adjustlist.map((e) => {
        const boList = this.selecedData.map((e) => {
          const aa1 = (e.deductionFreightList || []).map((e) => {
            return {
              ...e,
              $_disabled: undefined,
              ee: undefined,
              updateTime: undefined,
              updateCode: undefined,
              isDel: undefined,
              createCode: undefined,
              createTime: undefined
            };
          });
          const bb1 = (e.subsidiesFreightList || []).map((e) => {
            return {
              ...e,
              $_disabled: undefined,
              ee: undefined,
              updateTime: undefined,
              updateCode: undefined,
              isDel: undefined,
              createCode: undefined,
              createTime: undefined
            };
          });

          return {
            deduction: e.deduction,
            deliveryCashFee: e.deliveryCashFee,
            deliveryFeeDeserved: e.deliveryFeeDeserved,
            deliveryFeePractical: e.deliveryFeePractical,
            driverAddFee: e.driverAddFee,
            driverReductionFee: e.driverReductionFee,
            freightList: aa1.concat(bb1),
            freightPrice: e.freightPrice,
            goodsPrice: e.goodsPrice,
            loadWeight: e.loadWeight,
            lossDeductionFee: e.lossDeductionFee,
            m0Amount: e.m0Amount,
            m0Fee: e.m0Fee,
            otherCharges: e.otherCharges,
            otherSubsidies: e.otherSubsidies,
            serviceFee: e.serviceFee,
            serviceTaxFee: e.serviceTaxFee,
            taxPayment: e.taxPayment,
            shipperCopeFee: e.shipperCopeFee,
            shipperRealPay: e.shipperRealPay,
            unloadWeight: e.unloadWeight,
            waybillCode: e.waybillCode
          };
        });

        // console.log(boList);
        // return;
        this.adjustLoading = true;
        return batchCheck({ boList })
          .then((res) => {
            this.adjustLoading = false;
            if (res.data) {
              this.msgError(res.msg);
              const list = res.data.exceptionList;
              this.errList = list.map((item) => item.waybillCode);
            } else {
              this.msgSuccess('核算成功');
              this.visible = false;
              this.$emit('refresh');
            }
          })
          .catch(() => {
            this.adjustLoading = false;
          });
      });
    },
    tableRowClassName({ row, rowIndex }) {
      if (this.errList.length > 0) {
        if (this.errList.includes(row.waybillCode)) {
          return 'warning-row';
        }
      }
    },
    /** 查询核算列表 */
    getList() {
      this.loading = true;

      adjustDetail(this.queryParams).then((response) => {
        this.adjustlist = JSON.parse(JSON.stringify(response.data));

        this.adjustlist.sort((a, b) => {
          const a1 = a.subsidiesFreightList ? a.subsidiesFreightList.length : 0;
          const a2 = a.deductionFreightList ? a.deductionFreightList.length : 0;
          const b1 = b.subsidiesFreightList ? b.subsidiesFreightList.length : 0;
          const b2 = b.deductionFreightList ? b.deductionFreightList.length : 0;

          return b1 + b2 - (a1 + a2);
        });

        this.subsidiesClone = this.adjustlist[0].subsidiesFreightList || [];
        this.deductionClone = this.adjustlist[0].deductionFreightList || [];

        const felexes = [...this.subsidiesClone, ...this.deductionClone];

        let waybillCode = '';

        this.showSubList.forEach((e) => {
          felexes.forEach((ee) => {
            if (e.enName === ee.enName) {
              e.ee = ee;
              !waybillCode && (waybillCode = ee.waybillCode);
            }
          });
        });

        this.showSubList = this.showSubList.map((e) => {
          e.waybillCode = waybillCode;
          e.ruleValue = 0;
          if (e.ee) {
            e = e.ee;
            e.ee = null;
            e.$_disabled = true;
          }
          return e;
        });

        this.total = response.total;
        // 要求初始就要计算一次
        this.handlerBatchCalculate();
        // 单条数据，进行一次计算

        // 默认选中第一行
        this.$refs.refactorTable.$children[0].setCurrentRow(this.adjustlist[0]);
        this.$refs.refactorTable.$children[0].toggleAllSelection();
        this.showImg(this.adjustlist[0]);
        this.adjustTableHeight = 779;
        this.loading = false;
      });
    },

    async getRuleLists() {
      const que = {
        ruleType: 0
      };
      return getRuleItemList(que).then((response) => {
        this.showSubList = response.data.list.filter((e) => {
          return e.showType === 1;
        });
      });
    },

    /** 取消按钮 */
    cancel() {
      this.rowData = {};
      this.close();
    },
    // 关闭弹窗
    close() {
      this.$emit('update:open', false);
    },
    // 获取列表
    async setForm(data) {
      this.errList = [];
      this.selectedValue = '';
      this.selectedNum = 0;
      await this.getRuleLists();
      this.isEdit2 = true;
      this.isEdit = true;
      this.deliveryCashFee = undefined;
      this.queryParams.waybillCodeList = data;
      await this.getList();
    },

    // 处理增
    handlerClick() {
      const arr = this.adjustlist[0].subsidiesFreightList || [];
      const jaarr = this.adjustlist[0].deductionFreightList || [];

      // 过滤增
      const a1 = arr.filter((e) => {
        return !e.$_disabled;
      });
      // 过滤减(做禁止操作)
      this.jianData = jaarr.filter((e) => {
        return !e.$_disabled;
      });
      // 回填的数据
      this.selecedName = a1.map((e) => e.cnName);

      this.mtype = '1';
      this.popoverOpenCom = true;
    },

    // 处理减
    handlerdeduc() {
      // 同上
      const arr = this.adjustlist[0].deductionFreightList || [];
      const jaarr = this.adjustlist[0].subsidiesFreightList || [];

      const a1 = arr.filter((e) => {
        return !e.$_disabled;
      });
      this.jianData = jaarr.filter((e) => {
        return !e.$_disabled;
      });
      this.selecedName = a1.map((e) => e.cnName);
      this.mtype = '2';
      this.popoverOpenCom = true;
    },

    handlerSubmit(arr) {
      this.popoverOpenCom = false;

      // 如果是增
      if (this.mtype === '1') {
        this.adjustlist.forEach((e) => {
          const arrv = arr.map((e) => {
            e.type = this.mtype;
            return e;
          });

          e.subsidiesFreightList = deepClone(this.subsidiesClone.concat(arrv)).map(eee => {
            for (let i = 0; i < e.subsidiesFreightList.length; i++) {
              const sub = e.subsidiesFreightList[i];
              if (sub.enName === eee.enName) {
                eee.ruleValue = sub.ruleValue;
                break;
              }
            }
            return eee;
          });
        });
      } else {
        // 如果是减
        this.adjustlist.forEach((e) => {
          const arrv = arr.map((e) => {
            e.type = this.mtype;
            return e;
          });

          e.deductionFreightList = deepClone(this.deductionClone.concat(arrv)).map(eee => {
            for (let i = 0; i < e.deductionFreightList.length; i++) {
              const sub = e.deductionFreightList[i];
              if (sub.enName === eee.enName) {
                eee.ruleValue = sub.ruleValue;
                break;
              }
            }
            return eee;
          });
        });
      }

      this.handlerBatchCalculate();
    },

    /* 批量修改规定的值 */
    handleSelectedNumChange() {
      let isZa = false;
      this.selecedData.forEach((e) => {
      // this.adjustlist.forEach((e) => {
        e.deductionFreightList &&
          e.deductionFreightList.forEach((e) => {
            if (e.enName === this.selectedValue) {
              // 值要求不一样
              if (e.ruleValue !== this.selectedNum) {
                isZa = true;
                e.ruleValue = this.selectedNum;
              }
            }
          });

        e.subsidiesFreightList &&
          e.subsidiesFreightList.forEach((e) => {
            if (e.enName === this.selectedValue) {
              // 同上
              if (e.ruleValue !== this.selectedNum) {
                isZa = true;
                e.ruleValue = this.selectedNum;
              }
            }
          });
      });
      isZa && this.handlerBatchCalculate();
    },

    /* 计算价格 */
    _sum(arr = []) {
      let sum = 0;
      if (arr) {
        arr.forEach((e) => {
          sum += e.ruleValue - 0;
        });
      }
      return sum;
    },

    /* 处理路耗展示 */
    _lossAllowScope(value, bool) {
      if (value) {
        const arr = value.match(/\d+(\.\d+)?/g);

        arr[0] = arr[0] - 0 === 0 ? 0 : -arr[0];
        arr[1] = arr[1] - 0;

        return JSON.stringify(arr);
      }
    },

    // 防抖=需要带参数,避免和原方法冲突
    newDebounceFun(callback, time) {
      var timer;
      return function(...argument) {
        clearTimeout(timer);
        timer = setTimeout(function() {
          callback(...argument);
        }, time);
      };
    },
    // 展示合计
    getSummaries(param) {
      const { columns, data } = param;
      const sums = [];

      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = '合计';
          return;
        }

        const values = data.map((item) => {
          let va = NaN;
          if (
            column.property === 'taxPayment' ||
            column.property === 'serviceFee' ||
            column.property === 'deliveryCashFee' ||
            column.property === 'shipperRealPay'
          ) {
            va = Number(item[column.property]);
          }
          return va;
        });

        if (!values.every((value) => isNaN(value))) {
          sums[index] = values.reduce((prev, curr) => {
            const value = Number(curr);
            if (!isNaN(value)) {
              return prev + curr;
            } else {
              return prev;
            }
          }, 0);
          sums[index] = this.floor(sums[index]);

          sums[index] += ' 元';
        } else {
          sums[index] = '';
        }
      });

      return sums;
    },

    // 切换
    handlerChangeSelectedValue() {
      this.selectedNum = 0;
    },

    // 重置表头了
    handlerInput() {
      this.$refs.refactorTable.$children[0].doLayout();
    }
  }
};
</script>

<style lang="scss">
.el-table--scrollable-x .el-table__body-wrapper {
  z-index: 1;
}
</style>

<style scoped>

.mr3 {
  margin-right: 3%;
}
.width90 {
  width: 90%;
}
.width28 {
  width: 28%;
}
.el-form-item {
  margin-bottom: 0;
}
.el-table .el-input-number ::v-deep.el-input__inner {
  border: 0;
  background-color: #cceeff;
}
.ly-flex {
  flex-wrap: wrap;
}

::v-deep .warning-row {
  background: #fadbd9;
}
::v-deep .cell {
  padding: 0;
}

.drawer-footer {
  width: 100%;
  display: flex;
  padding: 20px 20px 0;
}
.cont-frame {
  display: flex;
}
.tongji{
  /* width: calc(100% - 450px); */
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 0 20px;

}

.ishfeiwhiefw {
  margin-right: 410px;
}
</style>
