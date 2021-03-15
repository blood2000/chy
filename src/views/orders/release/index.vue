<template>
  <div class="app-container">
    <!-- 转货信息 -->

    <el-form
      ref="elForm"
      :model="formData"
      :rules="rules"
      size="medium"
      label-width="110px"
      :label-position="'left'"
    >
      <div class="content">
        <div class="header mb8">代发货主信息</div>

        <el-form-item label="代发货主" prop="tin1">
          <el-select
            v-model="formData.tin1"
            placeholder="请输入代发货主"
            :style="{ width: '100%' }"
            filterable
          >
            <el-option
              v-for="(item, index1) in [{ adminName: '', code: '123456' }]"
              :key="index1"
              :label="item.adminName"
              :value="item.code"
            />
          </el-select>
        </el-form-item>
      </div>
      <el-divider />

      <div class="content">
        <div class="header mb8">货物类型</div>

        <el-form-item label="选择所属项目" prop="tin3">
          <el-select
            v-model="formData.tin3"
            placeholder="无归属项目"
            clearable
            :style="{ width: '100%' }"
          >
            <el-option
              v-for="item in [
                {
                  label: '项目1',
                  value: '68655588',
                },
                {
                  label: '项目2',
                  value: '6865550088',
                },
              ]"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="选择货物类型" prop="tin2">
          <el-radio-group v-model="formData.tin2" size="medium">
            <el-radio
              v-for="item in goodsBigTypeOptions"
              :key="item.value"
              :label="item.value"
            >{{ item.label }}</el-radio>
          </el-radio-group>
        </el-form-item>

        <!-- 先隐藏, 选择后显示 -->
        <template v-if="formData.tin2">
          <!-- isMultiGoods true->多商品 ; false->单商品 -->
          <el-form-item v-if="isMultiGoods" label="货物类型(小)" prop="tin2_1">
            <el-checkbox-group
              v-model="formData.tin2_1"
              size="medium"
              @change="handletin2_1"
            >
              <el-checkbox
                v-for="dict in tin2_1Option"
                :key="dict.dictValue"
                :label="dict.dictValue"
              >{{ dict.dictLabel }}</el-checkbox>
            </el-checkbox-group>
          </el-form-item>
          <el-form-item v-else label="货物类型(小)" prop="tin2_2">
            <el-radio-group v-model="formData.tin2_2" size="medium">
              <el-radio
                v-for="dict in [
                  { dictValue: 'shagiooe', dictLabel: '水' },
                  { dictValue: 'shagiwwee', dictLabel: '火' },
                ]"
                :key="dict.dictValue"
                :label="dict.dictValue"
              >{{ dict.dictLabel }}</el-radio>
            </el-radio-group>
          </el-form-item>
        </template>

        <el-form-item label="发布为" prop="tin4">
          <el-radio-group v-model="formData.tin4" size="medium">
            <el-radio
              v-for="dict in [
                { dictValue: true, dictLabel: '公开货源(所有人可接)' },
                { dictValue: false, dictLabel: '非公开货源' },
              ]"
              :key="dict.dictValue"
              :label="dict.dictValue"
            >{{ dict.dictLabel }}</el-radio>
          </el-radio-group>
        </el-form-item>

        <template v-if="!formData.tin4">
          <el-form-item label="指定接单人" prop="tin5">
            <el-radio-group v-model="formData.tin5" size="medium">
              <el-radio
                v-for="dict in [
                  { dictValue: true, dictLabel: '是' },
                  { dictValue: false, dictLabel: '否' },
                ]"
                :key="dict.dictValue"
                :label="dict.dictValue"
              >{{ dict.dictLabel }}</el-radio>
            </el-radio-group>
          </el-form-item>

          <template v-if="formData.tin5">
            <div style="display: flex">
              <el-form-item
                label="指定接单人(调度者3人,司机1人)"
                prop="tin5_1"
                label-width="300px"
              >
                <el-select
                  v-model="formData.tin5_1"
                  placeholder="调度者"
                  multiple
                  collapse-tags
                  clearable
                  :style="{ width: '100%' }"
                >
                  <el-option
                    v-for="dict in [
                      { dictValue: '11111', dictLabel: '调度者1' },
                      { dictValue: '22222', dictLabel: '调度者2' },
                    ]"
                    :key="dict.dictValue"
                    :label="dict.dictLabel"
                    :value="dict.dictValue"
                  />
                </el-select>
              </el-form-item>
              <el-form-item prop="tin5_2" label-width="10px">
                <el-select
                  v-model="formData.tin5_2"
                  placeholder="司机"
                  clearable
                  multiple
                  collapse-tags
                  :style="{ width: '100%' }"
                >
                  <el-option
                    v-for="dict in [
                      { dictValue: '10000', dictLabel: '司机1' },
                      { dictValue: '20000', dictLabel: '司机2' },
                    ]"
                    :key="dict.dictValue"
                    :label="dict.dictLabel"
                    :value="dict.dictValue"
                  />
                </el-select>
              </el-form-item>
            </div>
          </template>

          <el-form-item label="货集码" prop="tin6" label-width="300px">
            <el-select
              v-model="formData.tin6"
              placeholder="选择货集码"
              clearable
              :style="{ width: '100%' }"
            >
              <el-option
                v-for="dict in [
                  { dictValue: '108888000', dictLabel: '集码1' },
                  { dictValue: '200888800', dictLabel: '集码2' },
                ]"
                :key="dict.dictValue"
                :label="dict.dictLabel"
                :value="dict.dictValue"
              />
            </el-select>
          </el-form-item>
        </template>

        <el-form-item label="备注信息" prop="remark">
          <el-input
            v-model="formData.remark"
            type="textarea"
            placeholder="请输入任何您想说的话..."
            :autosize="{ minRows: 4, maxRows: 4 }"
            :style="{ width: '100%' }"
          />
        </el-form-item>
      </div>
      <el-divider />

      <!-- 如果是单商品着没有下面的 -->
      <!-- isMultiGoods true->多商品 ; false->单商品 -->

      <template v-if="isMultiGoods">
        <div class="content">
          <div class="header mb8">装货类型</div>
          <el-form-item label="装货类型" prop="tin7">
            <el-radio-group v-model="formData.tin7" size="medium">
              <el-radio
                v-for="dict in [
                  { dictValue: '1', dictLabel: '一装一卸' },
                  { dictValue: '2', dictLabel: '多装一卸' },
                  { dictValue: '3', dictLabel: '一装多卸' },
                  { dictValue: '4', dictLabel: '多装多卸' },
                ]"
                :key="dict.dictValue"
                :label="dict.dictValue"
              >{{ dict.dictLabel }}</el-radio>
            </el-radio-group>
          </el-form-item>

          <el-form-item label="允许自装" prop="tin8">
            <el-checkbox v-model="formData.tin8">允许自装</el-checkbox>
          </el-form-item>
        </div>

        <el-divider />
      </template>
    </el-form>

    <!-- s封装成组件 -->
    <!--
      1: 多商品对应多地址/单商品就一个地址
      2: 多装和多卸 各自可有多地址
     -->

    <div class="content">
      <div class="header mb8">货源地址</div>
      <!-- isMultiGoods true->多商品 ; false->单商品 -->
      <!-- address-type : 1=>货源地址; 2=>卸货地址 -->
      <!-- show-btn : true=>可多选; false=>隐藏按钮不能多选 -->
      <add-address
        ref="address1"
        :address-type="1"
        :show-btn="formData.tin7 === '2' || formData.tin7 === '4'"
        :is-big-odd="isMultiGoods"
      />
    </div>

    <el-divider />

    <div class="content">
      <div class="header mb8">卸货地址</div>
      <!-- isMultiGoods true->多商品 ; false->单商品 -->
      <!-- address-type : 1=>货源地址; 2=>卸货地址 -->
      <!-- show-btn : true=>可多选; false=>隐藏按钮不能多选 -->
      <add-address
        ref="address2"
        :address-type="2"
        :show-btn="formData.tin7 === '3' || formData.tin7 === '4'"
        :is-big-odd="isMultiGoods"
      />
    </div>

    <el-divider />

    <!--
      多商品对应多个计算规则 orderGoodsList数组 会有多个
      单个商品就一个计算规则
     -->
    <!-- isMultiGoods true->多商品 ; false->单商品 -->
    <template v-if="!isMultiGoods">
      <div class="content">
        <div class="header mb8">货物</div>

        <GoodsAccounting ref="goodsAccounting" />
      </div>

      <div class="content">
        <div class="header mb8">核算:</div>

        <AccounTing ref="accounTing" />
      </div>

      <!-- s封装成组件 -->

      <div class="content">
        <div class="header mb8">预估运费</div>

        <div>
          <span>预估运费(不含税):</span> <span>￥</span><span>8566.00</span>
        </div>
        <div><span>(含税):</span> <span>￥</span><span>8566.00</span></div>
      </div>
    </template>

    <template v-else>
      <div class="content">
        <div class="header mb8">货物/核算</div>

        <!-- tin2_1 是选中的多个商品 至少选中一个
            1. 监听选择事件 创建一个新的数组
        -->
        <el-tabs v-model="tin2_1tabs_activeName">
          <el-tab-pane
            v-for="item in tin2_1tabs"
            :key="item.value"
            :label="item.label"
            :name="item.value"
          >
            <!-- v-model="item.data" 如果自接传在去修改会警告, 倒不如处理完返回再赋值 -->
            <MultiData :ref="item.value" />
          </el-tab-pane>
        </el-tabs>
      </div>
    </template>

    <!-- <div class="content" v-if="false">
                <div class="header mb8">货物、路线信息:</div>

                <el-row :gutter="15">
                    <el-col :span="12">
                        <el-form-item label="重量(吨)" prop="field116">
                            <el-input-number v-model="formData.field116" placeholder="请输入重量(吨)" step-strictly controls-position=right :style="{width: '100%'}">
                            </el-input-number>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="体积(方)" prop="field118">
                            <el-input-number v-model="formData.field118" placeholder="请输入体积(方)" step-strictly controls-position=right :style="{width: '100%'}">
                            </el-input-number>
                        </el-form-item>
                    </el-col>
                </el-row>

                <el-row :gutter="15">
                    <el-col :span="12">
                        <el-form-item label="货物单价" prop="field119">
                            <el-input-number v-model="formData.field119" placeholder="货物单价" step-strictly controls-position=right :style="{width: '100%'}"></el-input-number>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="公里数" prop="field120">
                            <el-input-number v-model="formData.field120" placeholder="请输入公里数" step-strictly controls-position=right :style="{width: '100%'}"></el-input-number>
                        </el-form-item>
                    </el-col>
                </el-row>

                <el-row :gutter="15">
                    <el-col :span="12">
                        <el-form-item label="最高配载(吨/方)" prop="field121">
                            <el-input-number v-model="formData.field121" placeholder="请输入最高配载(吨/方)" step-strictly controls-position=right :style="{width: '100%'}">
                            </el-input-number>
                        </el-form-item>
                    </el-col>

                </el-row>
                <el-row :gutter="15">
                    <el-col :span="12">
                        <el-form-item label="业务类型" prop="field122">
                            <el-select v-model="formData.field122" placeholder="请选择业务类型" clearable :style="{width: '100%'}">
                            <el-option v-for="(item, index) in field122Options" :key="index" :label="item.label"
                                :value="item.value" :disabled="item.disabled"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>

                <el-form-item label="货物类型(大)" prop="field124">
                    <el-checkbox-group v-model="formData.field124" size="medium">
                    <el-checkbox v-for="(item, index) in field124Options" :key="index" :label="item.value"
                        :disabled="item.disabled">{{item.label}}</el-checkbox>
                    </el-checkbox-group>
                </el-form-item>

                <el-form-item label="货物类型(小)" prop="field125">
                    <el-checkbox-group v-model="formData.field125" size="medium">
                    <el-checkbox v-for="(item, index) in field125Options" :key="index" :label="item.value"
                        :disabled="item.disabled">{{item.label}}</el-checkbox>
                    </el-checkbox-group>
                </el-form-item>

                 <el-form-item label="配载方式" prop="field126">
                    <el-radio-group v-model="formData.field126" size="medium">
                    <el-radio v-for="(item, index) in field126Options" :key="index" :label="item.value"
                        :disabled="item.disabled">{{item.label}}</el-radio>
                    </el-radio-group>
                </el-form-item>

                <el-form-item label="货物运费" prop="field127">
                    <el-radio-group v-model="formData.field127" size="medium">
                    <el-radio v-for="(item, index) in field127Options" :key="index" :label="item.value"
                        :disabled="item.disabled">{{item.label}}</el-radio>
                    </el-radio-group>
                </el-form-item>

                <el-row :gutter="15">
                    <el-col :span="12">
                        <el-form-item label="运费单价(元)" prop="field128">
                            <el-input-number v-model="formData.field128" placeholder="请输入运费单价(元)" controls-position=right :style="{width: '100%'}">
                            </el-input-number>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="应付 (元)" prop="field129">
                            <el-input-number v-model="formData.field129" placeholder="请输入应付 (元)" controls-position=right :style="{width: '100%'}">
                            </el-input-number>
                        </el-form-item>
                    </el-col>
                </el-row>

                <el-form-item label="合理路耗" prop="field132">

                    <el-col :span="13">
                        <el-radio-group v-model="formData.field132" size="medium">
                        <el-radio v-for="(item, index) in field132Options" :key="index" :label="item.value"
                            :disabled="item.disabled">{{item.label}}</el-radio>
                        </el-radio-group>
                    </el-col>
                    <el-col :span="11">
                        <span class="pl-5 pr-5">-</span>
                        <el-input-number v-model="formData.field129" placeholder="" controls-position=right :style="{width: '30%'}"></el-input-number>
                        <span class="pl-5 pr-5">至</span>
                        <el-input-number v-model="formData.field129" placeholder="" controls-position=right :style="{width: '30%'}"></el-input-number>
                    </el-col>


                </el-form-item>

                <el-form-item label="是否特定货源" prop="field133">
                    <el-radio-group v-model="formData.field133" size="medium">
                    <el-radio v-for="(item, index) in field133Options" :key="index" :label="item.value"
                        :disabled="item.disabled">{{item.label}}</el-radio>
                    </el-radio-group>
                </el-form-item>

                 <el-form-item label="运输要求" prop="field134">
                    <el-input v-model="formData.field134" placeholder="请输入运输要求" clearable :style="{width: '100%'}">
                    </el-input>
                </el-form-item>

            </div> -->

    <!-- <el-divider v-if="false"></el-divider>
            <div class="content" v-if="false">
                 <div class="header mb8">报价信息</div>
                 <el-row :gutter="15">
                    <el-col :span="12">
                        <el-form-item label="是否允许报价" prop="field137">
                            <el-radio-group v-model="formData.field137" size="medium">
                            <el-radio v-for="(item, index) in field137Options" :key="index" :label="item.value"
                                :disabled="item.disabled">{{item.label}}</el-radio>
                            </el-radio-group>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="最高价(元/吨(方))" prop="field138" label-width="120px">
                            <el-input-number v-model="formData.field138" placeholder="请输入最高价(元/吨(方))" controls-position=right :style="{width: '100%'}">
                            </el-input-number>
                        </el-form-item>
                    </el-col>
                </el-row>

            </div>

            <el-divider v-if="false"></el-divider>
            <div class="content" v-if="false">
                 <div class="header mb8">费用信息</div>
                 <el-form-item label="信息费(元)" prop="field140">
                    <el-input-number v-model="formData.field140" placeholder="请输入信息费(元)" controls-position=right >
                    </el-input-number>
                </el-form-item>
            </div>

            <el-divider v-if="false"></el-divider>

            <div class="content" v-if="false">
                 <div class="header mb8">其他信息</div>

                 <el-row :gutter="15">
                    <el-col :span="10">
                        <el-form-item label="是否拆单" prop="field142">
                            <el-radio-group v-model="formData.field142" size="medium">
                            <el-radio v-for="(item, index) in field142Options" :key="index" :label="item.value"
                                :disabled="item.disabled">{{item.label}}</el-radio>
                            </el-radio-group>
                        </el-form-item>
                    </el-col>
                    <el-col :span="14">
                        <div class="flex">
                            <el-form-item prop="field143">
                                <el-input-number v-model="formData.field143" placeholder="请输入车" controls-position=right :style="{width: '100%'}">
                                </el-input-number>
                            </el-form-item>
                            <span class="vih">车</span>
                        </div>
                    </el-col>
                </el-row>

                <el-form-item label="是否投保" prop="field144">
                    <el-radio-group v-model="formData.field144" size="medium">
                    <el-radio v-for="(item, index) in field144Options" :key="index" :label="item.value"
                        :disabled="item.disabled">{{item.label}}</el-radio>
                    </el-radio-group>
                </el-form-item>

                <el-form-item label="发运方式" prop="field145">
                    <el-radio-group v-model="formData.field145" size="medium">
                    <el-radio v-for="(item, index) in field145Options" :key="index" :label="item.value"
                        :disabled="item.disabled">{{item.label}}</el-radio>
                    </el-radio-group>
                </el-form-item>

                <el-row :gutter="15">
                    <el-col :span="12">
                        <el-form-item label="上游客户" prop="field146">
                            <el-select v-model="formData.field146" placeholder="请输入上游客户" clearable :style="{width: '100%'}">
                            <el-option v-for="(item, index) in field146Options" :key="index" :label="item.label"
                                :value="item.value" :disabled="item.disabled"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="应收(元)" prop="field148">
                            <el-input-number v-model="formData.field148" placeholder="请输入应收(元)" controls-position=right>
                            </el-input-number>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="15">
                    <el-col :span="12">
                        <el-form-item label="货源有效时间" prop="field149">
                            <el-select v-model="formData.field149" placeholder="请输入货源有效时间" clearable :style="{width: '100%'}">
                            <el-option v-for="(item, index) in field149Options" :key="index" :label="item.label"
                                :value="item.value" :disabled="item.disabled"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="设为常发货源" prop="field150">
                            <el-radio-group v-model="formData.field150" size="medium">
                            <el-radio v-for="(item, index) in field150Options" :key="index" :label="item.value"
                                :disabled="item.disabled">{{item.label}}</el-radio>
                            </el-radio-group>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="15">
                    <el-col :span="12">
                        <el-form-item label="发送方式" prop="field151">
                            <el-select v-model="formData.field151" placeholder="请输入发送方式" clearable :style="{width: '100%'}">
                            <el-option v-for="(item, index) in field151Options" :key="index" :label="item.label"
                                :value="item.value" :disabled="item.disabled"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="是否隐藏" prop="field152">
                            <el-radio-group v-model="formData.field152" size="medium">
                            <el-radio v-for="(item, index) in field152Options" :key="index" :label="item.value"
                                :disabled="item.disabled">{{item.label}}</el-radio>
                            </el-radio-group>
                        </el-form-item>
                    </el-col>
                </el-row>

                <el-form-item>
                    <el-button type="primary" @click="onSubmit">选择车型</el-button>
                    <el-button type="primary" @click="onSubmit">选择用车类型</el-button>
                    <el-button type="primary" @click="onSubmit">选择车长</el-button>
                    <el-button type="primary" @click="onSubmit">清除已选</el-button>
                </el-form-item>

                <el-form-item label="已选车型" prop="field154">
                    <el-input v-model="formData.field154" type="textarea" placeholder="请输入已选车型"
                    :autosize="{minRows: 4, maxRows: 4}" :style="{width: '100%'}"></el-input>
                </el-form-item>

                <el-form-item>
                    <el-button type="primary" @click="onSubmit">选择承运</el-button>
                    <el-button type="primary" @click="onSubmit">清除已选</el-button>
                </el-form-item>

                <el-form-item label="已选承运" prop="field155">
                    <el-input v-model="formData.field155" type="textarea" placeholder="请输入已选承运"
                    :autosize="{minRows: 4, maxRows: 4}" :style="{width: '100%'}"></el-input>
                </el-form-item>

            </div> -->

    <div>
      <el-button type="primary" @click="onSubmit('elForm')">立即发布</el-button>
      <el-button>取消</el-button>
    </div>

    <!-- 添加或修改【请填写功能名称】对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="75%" append-to-body>
      <div>
        <open-dialog />
      </div>
    </el-dialog>
  </div>
</template>

<script>
import OpenDialog from './OpenDialog';

import AddAddress from './component/AddAddress';
import GoodsAccounting from './component/GoodsAccounting';
import AccounTing from './component/AccounTing';
import MultiData from './component/MultiData';

import { listShipment } from '@/api/assets/shipment.js';

import { orderPubilsh } from '@/api/order/release';

export default {
  components: {
    OpenDialog,
    AddAddress,
    GoodsAccounting,
    AccounTing,
    MultiData
  },
  data() {
    return {
      // 多商品对应各自的规格
      tin2_1tabs: [],
      tin2_1tabs_activeName: '0',
      formData: {
        tin1: '', // 发布人Code
        tin2: undefined, // 选择货物类型大类(必填)
        tin2_1: [], // 多商品-小类(必填)
        tin2_2: undefined, // 单商品 - 小类(必填)
        tin3: undefined, // 项目编码
        tin4: true, // 是否公开货源 0.非公开 1.公开 / false=>非公开
        tin5: false, // 是否指定接单人 0否 1是 / false=>否
        tin5_1: [], // 调度者 多个
        tin5_2: [], // 司机 多个
        tin6: undefined, // 货集码
        tin7: '1', // 装卸类型 1.一装一卸 2.多装一卸 3.一装多卸 4.多装多卸
        tin8: false // 允许自装 true=>是; false=> 否

        /*
        classList: [{ classCode: '1' }],
        isClass: undefined, // 是否加入货源码 0否 1是
        isPublic: undefined, // 是否公开货源 0.非公开 1.公开
        isSpecified: undefined, // 是否指定接单人 0否 1是
        loadType: undefined, // 装卸类型 1.一装一卸 2.多装一卸 3.一装多卸 4.多装多卸
        orderFreightBoList: undefined,
        orderGoodsList: undefined,
        orderSpecifiedList: undefined,
        projectCode: undefined, // 项目编码
        pubilshCode: undefined, // 发布人Code
        remark: '', // 备注
        */
        // goodsBigType: undefined,
        // goodsType1: [],
        // goodsType2: undefined,
        // isOneselfUnload: false, // 无这个字段 允许自装
      },
      rules: {
        tin2: [
          { required: true, message: '请选择货物类型', trigger: 'change' }
        ],
        tin2_1: [
          { required: true, message: '请选择货物类型(小)', trigger: 'change' }
        ],
        tin2_2: [
          { required: true, message: '请选择货物类型(小)', trigger: 'change' }
        ]
      },

      // 字典类型
      goodsBigTypeOptions: [
        { label: '水泥', isdd: false, value: 'hhhh' }, // true 是多选
        { label: '煤', isdd: true, value: 'hhhh3' }
      ],

      // 小类多商品
      tin2_1Option: [
        { dictValue: 'shagie', dictLabel: '煤炭' },
        { dictValue: 'shagiwwee', dictLabel: '煤球' }
      ],

      formDataList: {
        shipmentList: []
      },

      // 选中的名
      activeName: 'first',

      // 是否显示弹出层
      open: false,
      // 弹框title
      title: ''
    };
  },

  computed: {
    // 判断子类为多选还是单选
    isMultiGoods() {
      console.log(this.formData.tin2);
      let bool = false;
      this.goodsBigTypeOptions.forEach((e) => {
        if (e.value === this.formData.tin2) {
          bool = e.isdd;
        }
      });
      return bool;
    },
    isBigOdd() {
      return this.formData.goodsBigType === 1;
    }
  },

  async created() {
    listShipment()
      .then((res) => {
        this.formDataList.shipmentList = res.rows;
      })
      .catch(() => {
        this.formDataList.shipmentList = [
          {
            id: 9,
            code: 'c0e8fdb5e44942d3a10907dc97768847',
            adminName: 'lin',
            adminCode: 'c0e8fdb5e44942d3a10907dc97768847',
            shipperType: 0,
            identificationNumber: '350103199708244939',
            authStatus: 0,
            isFreezone: 0,
            createTime: '2021-03-13T11:49:44.254+08:00',
            isAccount: 1,
            accountType: '1',
            isWipe: 1,
            wipeType: 'cent',
            isMonthly: 1,
            isPrepaid: 1,
            isConsumption: 1,
            consumptionUnit: 'quota',
            consumptionMin: '10',
            consumptionMax: '100',
            dispatchPoints: '1',
            creditAmount: 3000,
            identificationBeginTime: '2021-03-08',
            identificationEndTime: '2021-03-25',
            identificationEffective: 0,
            ticketType: 'one',
            serviceRatio: '11',
            telphone: '18859464414',
            supplyIsAuth: 1
          }
        ];
      });

    this.getDicts('coalType').then((response) => {
      this.formDataList.coalType = response.data;
    });
  },

  methods: {
    async onSubmit(form) {
      this.$refs[form].validate(async(valid) => {
        if (valid) {
          /*
          {
            "classList": [
              {
                "classCode": "1"
              }
            ],
            "isClass": true,
            "isPublic": true,
            "isSpecified": true,
            "loadType": 0,
            "orderFreightBoList": [
              {
                "ruleItemId": 0,
                "ruleItemValue": "1",
                "type": 0
              }
            ],
            "orderGoodsList": [
              {
                "addressList": [
                  {
                    "adcode": "1",
                    "addressAlias": "1",
                    "addressType": 0,
                    "city": "1",
                    "citycode": "1",
                    "contact": "1",
                    "contactPhone": "1",
                    "country": "1",
                    "detail": "1",
                    "district": "1",
                    "level": "1",
                    "location": [1,2],
                    "province": "1",
                    "street": "1"
                  }
                ],
                "endLimitWastage": 0,
                "goodsBigType": "1",
                "goodsType": "1",
                "goodsUnit": "1",
                "isModifyFinish": true,
                "isOneselfLoad": true,
                "isOneselfUnload": true,
                "limitWastage": "1",
                "perWeight": 0,
                "priceWastage": 0,
                "shipmentPrice": 0,
                "startLimitWastage": 0,
                "vehicleLength": "1",
                "vehicleType": "1",
                "weight": 0
              }
            ],
            "orderSpecifiedList": [
              {
                "driverInfoCode": "1",
                "teamInfoCode": "1",
                "userType": 0
              }
            ],
            "projectCode": "1",
            "pubilshCode": "1", // 发布人Code
            "remark": "1"
          }
          */

          const address1 =
            (this.$refs.address1 &&
              (await this.$refs.address1._submitForm())) ||
            [];
          const address2 =
            (this.$refs.address2 &&
              (await this.$refs.address2._submitForm())) ||
            [];

          let goodsAccounting;
          let accounTing;
          let arrs;

          let orderFreightBoList = [];
          let orderGoodsList = [];
          let orderSpecifiedList = [];

          const driverInfoCode = this.formData.tin5_2.map((driverInfoCode) => {
            return {
              driverInfoCode,
              teamInfoCode: '',
              userType: 2
            };
          });
          const teamInfoCode = this.formData.tin5_1.map((teamInfoCode) => {
            return {
              driverInfoCode: '',
              teamInfoCode,
              userType: 1
            };
          });
          orderSpecifiedList = driverInfoCode.concat(teamInfoCode);

          console.log(orderSpecifiedList);

          // <!-- isMultiGoods true->多商品 ; false->单商品 -->
          if (this.isMultiGoods) {
            const promisArr = this.formData.tin2_1.map(async(e) => {
              return {
                ...((this.$refs[e][0] &&
                  (await this.$refs[e][0]._submitForm())) ||
                  {}),
                goodsTypeName: e
              };
            });
            arrs = await Promise.all(promisArr);

            // 多商品核算规则多个
            orderFreightBoList = arrs.map((accounTing) => {
              return {
                ruleItemId: accounTing.ruleItemId,
                ruleItemValue: '', // ??
                type: '' // ??
              };
            });

            orderGoodsList = arrs.map((e) => {
              return {
                addressList: [...address1, ...address2],
                endLimitWastage: 0, // 免赔偿路耗规范结束 多商品无此选项??
                goodsBigType: this.formData.tin2,
                goodsType: this.formData.tin2_1,
                goodsUnit: '1', // 多商品没有 计量单位
                isModifyFinish: true, // 平台是否完成调价?? 啥东西
                isOneselfLoad: false, // 是否允许自装 0否 1是 (多装模式)?? 啥东西
                isOneselfUnload: this.formData.tin8,
                limitWastage: '1', // 限制损耗?? 啥东西
                perWeight: 0, // 最高配载 多商品无此选项??
                priceWastage: 0, // 路耗超出范围 赔偿单价 （元/吨）?? 啥东西
                shipmentPrice: e.shipmentPrice,
                startLimitWastage: 0, // 免赔偿路耗规范开始 多商品无此选项??
                vehicleLength: e.vehicleLength,
                vehicleType: e.vehicleType,
                weight: 0 // 货物重量 多商品无此选项??
              };
            });
          } else {
            goodsAccounting =
              (this.$refs.goodsAccounting &&
                (await this.$refs.goodsAccounting._submitForm())) ||
              {};
            accounTing =
              (this.$refs.accounTing &&
                (await this.$refs.accounTing._submitForm())) ||
              {};

            // 单商品核算规格
            orderFreightBoList = [
              {
                ruleItemId: accounTing.ruleItemId,
                ruleItemValue: '', // ??
                type: '' // ??
              }
            ];
            // 单商品信息
            orderGoodsList = [
              {
                addressList: [...address1, ...address2],
                endLimitWastage: accounTing.endLimitWastage,
                goodsBigType: this.formData.tin2,
                goodsType: this.formData.tin2_2,
                goodsUnit: goodsAccounting.goodsUnit,
                isModifyFinish: true, // 平台是否完成调价?? 啥东西
                isOneselfLoad: false, // 是否允许自装 0否 1是 (多装模式)?? 啥东西
                isOneselfUnload: false, // 是否允许自卸 0否 1是 (多卸模式)
                limitWastage: '1', // 限制损耗?? 啥东西
                perWeight: goodsAccounting.perWeight,
                priceWastage: 0, // 路耗超出范围 赔偿单价 （元/吨）?? 啥东西
                shipmentPrice: goodsAccounting.shipmentPrice,
                startLimitWastage: accounTing.startLimitWastage,
                vehicleLength: goodsAccounting.vehicleLength,
                vehicleType: goodsAccounting.vehicleType,
                weight: goodsAccounting.weight
              }
            ];
          }

          console.log('goodsAccounting', goodsAccounting);
          console.log('accounTing', accounTing);
          console.log('arrs', arrs);
          console.log('address1', address1);
          console.log('address2', address2);

          const data = {
            classList: [
              {
                classCode: '1'
              }
            ],
            isClass: true,
            // 上面2个暂时没有
            isPublic: this.formData.tin4,
            isSpecified: this.formData.tin5,
            loadType: this.formData.tin7, // loadType	装卸类型 1.一装一卸 2.多装一卸 3.一装多卸 4.多装多卸
            orderFreightBoList,
            orderGoodsList,
            orderSpecifiedList,
            projectCode: this.formData.tin3, // 项目编码
            pubilshCode: this.formData.tin1,
            remark: this.formData.remark
          };

          orderPubilsh(data).then((response) => {
            console.log(response);
            this.msgSuccess('新增成功');
          });
        } else {
          return false;
        }
      });
    },

    // 监听小类多商品
    handletin2_1() {
      this.tin2_1tabs = this.formData.tin2_1.map((e) => {
        let obj = null;
        this.tin2_1Option.forEach((obje) => {
          if (obje.dictValue === e) {
            obj = obje;
          }
        });
        return {
          label: obj.dictLabel,
          value: obj.dictValue,
          data: {}
        };
      });

      // 初始赋值
      if (this.tin2_1tabs_activeName === '0') {
        this.tin2_1tabs_activeName = this.tin2_1tabs[0].value;
      }
    }
  }
};
</script>
<style lang="scss" scoped>
.app-container {
  overflow-y: auto;
  height: calc(100vh - 145px);
}
.header {
  padding-bottom: 10px;
  position: relative;
  font-weight: 700;
  &::before {
    content: "";
    position: absolute;
    width: 3px;
    height: 20px;
    left: -15px;
    top: 1px;
    background-color: #1890ff;
  }
}
.content {
  width: 50%;
}

.vih {
  line-height: 36px;
}
</style>
