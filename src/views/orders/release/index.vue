<template>
  <div class="app-container">

    <!-- 转货信息 -->


    <el-form ref="elForm" :model="formData" :rules="rules" size="medium" label-width="110px" :label-position="'left'">
      <div class="content">
        <div class="header mb8">代发货主信息</div>

        <!-- <el-row :gutter="15" >
                    <el-col :span="12">
                        <el-form-item label="代发货主" prop="field141">
                            <el-input v-model="formData.field141" placeholder="请输入代发货主" clearable :style="{width: '100%'}">
                            </el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-button @click="onSubmit">选择货主</el-button>
                        <el-button>清除已选货主</el-button>
                    </el-col>
                </el-row> -->

        <el-form-item label="代发货主" prop="pubilshCode">
          <el-select v-model="formData.pubilshCode" placeholder="请输入代发货主" :style="{width: '100%'}" filterable>
            <el-option :label="'小明'" :value="1">
              <span style="float: left">小明</span>
              <span style="float: right; color: #8492a6; font-size: 13px">18888888888</span>
            </el-option>
            <el-option :label="'小红'" :value="2">
              <span style="float: left">小红</span>
              <span style="float: right; color: #8492a6; font-size: 13px">18888888888</span>
            </el-option>
          </el-select>
        </el-form-item>


      </div>
      <el-divider />

      <div class="content">
        <div class="header mb8">货物类型</div>

        <el-form-item label="选择所属项目" prop="projectCode">
          <el-select v-model="formData.projectCode" placeholder="无归属项目" clearable :style="{width: '100%'}">
            <el-option label="项目1" :value="1" />
            <el-option label="项目2" :value="2" />
          </el-select>
        </el-form-item>

        <el-form-item label="选择货物类型" prop="goodsBigType">
          <el-select v-model="formData.goodsBigType" placeholder="选择货物类型" clearable :style="{width: '100%'}">
            <el-option label="大类型1" :value="1" />
            <el-option label="大类型2" :value="2" />
          </el-select>
        </el-form-item>

        <template v-if="formData.goodsBigType">
          <el-form-item v-if="isBigOdd" label="货物类型(小)" prop="goodsType1">
            <el-checkbox-group v-model="formData.goodsType1" size="medium">
              <el-checkbox :label="1">煤矿</el-checkbox>
              <el-checkbox :label="2">沙土</el-checkbox>
            </el-checkbox-group>
          </el-form-item>
          <el-form-item v-else label="货物类型(小)" prop="goodsType2">
            <el-radio-group v-model="formData.goodsType2" size="medium">
              <el-radio :label="1">商品1</el-radio>
              <el-radio :label="2">商品2</el-radio>
            </el-radio-group>
          </el-form-item>
        </template>

        <el-form-item label="发布为" prop="isPublic">
          <el-radio-group v-model="formData.isPublic" size="medium">
            <el-radio :label="1">公开货源(所有人可接)</el-radio>
            <el-radio :label="0">非公开货源</el-radio>
          </el-radio-group>
        </el-form-item>

        <template v-if="formData.isPublic === 0">
          <el-form-item label="指定接单人" prop="isSpecified">
            <el-radio-group v-model="formData.isSpecified" size="medium">
              <el-radio :label="1">是</el-radio>
              <el-radio :label="0">否</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item v-if="formData.isSpecified === 1" label="指定接单人(调度者3人,司机1人)" prop="select_arr_4" label-width="300px">
            <!-- 这个要做成什么?? -->
            <el-select v-model="formData.select_arr_4" placeholder="选择接单人" multiple clearable :style="{width: '100%'}">
              <el-option label="接单1" :value="1" />
              <el-option label="接单2" :value="2" />
            </el-select>
          </el-form-item>
          <el-form-item label="货集码" prop="tinkaikin1111111111" label-width="300px">
            <el-select v-model="formData.tinkaikin1111111111" placeholder="选择货集码" clearable :style="{width: '100%'}">
              <el-option label="接单1" :value="1" />
              <el-option label="接单2" :value="2" />
            </el-select>
          </el-form-item>
        </template>

        <el-form-item label="备注信息" prop="remark">
          <el-input
            v-model="formData.remark"
            type="textarea"
            placeholder="请输入任何您想说的话..."
            :autosize="{minRows: 4, maxRows: 4}"
            :style="{width: '100%'}"
          />
        </el-form-item>

      </div>
      <el-divider />


      <template v-if="isBigOdd">
        <div class="content">
          <div class="header mb8">装货类型</div>
          <el-form-item label="装货类型" prop="loadType">
            <el-radio-group v-model="formData.loadType" size="medium">
              <el-radio :label="0">一装一卸</el-radio>

              <el-radio :label="1">多装一卸</el-radio>

              <el-radio :label="2">一装多卸</el-radio>
            </el-radio-group>
          </el-form-item>

          <el-form-item label="允许自装" prop="tinkaikin2222222">
            <el-checkbox v-model="formData.tinkaikin2222222">允许自装</el-checkbox>
          </el-form-item>
        </div>
        <el-divider />
      </template>

    </el-form>


    <!-- s封装成组件 -->
    <div class="content">
      <div class="header mb8">货源发布</div>
      <add-address ref="address1" :address-type="1" :show-btn="formData.loadType === 1" :is-big-odd="isBigOdd" />
    </div>

    <el-divider />

    <div class="content">
      <div class="header mb8">卸货信息</div>
      <add-address ref="address2" :address-type="2" :show-btn="formData.loadType === 2" :is-big-odd="isBigOdd" />
    </div>


    <el-divider />

    <template v-if="!isBigOdd">
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
        <div>
          <span>(含税):</span> <span>￥</span><span>8566.00</span>
        </div>
      </div>
    </template>
    <template v-else>
      <div class="content">
        <div class="header mb8">货物/核算</div>

        <el-tabs v-model="activeName">
          <el-tab-pane v-for="item in formData.goodsType1" :key="item" label="用户管理" name="first">
            <MultiData ref="first" />
          </el-tab-pane>
          <el-tab-pane label="配置管理" name="second">
            <MultiData ref="second" />
          </el-tab-pane>
          <el-tab-pane label="角色管理" name="third">
            <MultiData ref="third" />
          </el-tab-pane>
          <el-tab-pane label="定时任务补偿" name="fourth">
            <MultiData ref="fourth" />
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
      <el-button type="primary" @click="onSubmit">立即创建</el-button>
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
      formData: {
        pubilshCode: 1,
        projectCode: undefined,
        goodsBigType: undefined,
        goodsType1: [],
        goodsType2: undefined,
        isPublic: 1,
        isSpecified: 1,
        tinkaikin1111111111: undefined, // 无这个字段
        remark: '',
        loadType: 1,
        tinkaikin2222222: false // 无这个字段 允许自装
      },
      rules: {
        goodsBigType: [{ required: true, message: '请选择货物计量单位', trigger: 'change' }],
        goodsType1: [{ required: true, message: '请选择货物计量单位', trigger: 'change' }],
        goodsType2: [{ required: true, message: '请选择货物计量单位', trigger: 'change' }]
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
    isBigOdd() {
      return this.formData.goodsBigType === 1;
    }
  },

  methods: {
    onSubmit() {
      this.$refs.address1 && this.$refs.address1._submitForm().then(res => {
        console.log(res);
      });
      this.$refs.address2 && this.$refs.address2._submitForm().then(res => {
        console.log(res);
      });
      this.$refs.goodsAccounting && this.$refs.goodsAccounting._submitForm().then(res => {
        console.log(res);
      });
      this.$refs.accounTing && this.$refs.accounTing._submitForm().then(res => {
        console.log(res);
      });


      this.$refs[this.activeName]._submitForm().then(res => {
        console.log(res);
      });
    }
  }
};
</script>
<style lang="scss" scoped>
.app-container{
    overflow-y: auto;
  height: calc(100vh - 145px);
}
.header{
    padding-bottom: 10px;
    position: relative;
    font-weight: 700;
    &::before{
        content: '';
        position: absolute;
        width: 3px;
        height: 20px;
        left: -15px;
        top: 1px;
        background-color: #1890ff;
    }
}
.content{
    width: 50%;
}


.vih{
    line-height: 36px;
}

</style>
