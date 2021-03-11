<template>
    <div class="app-container">
        
        <!-- 转货信息 -->

            
        <el-form ref="elForm" :model="formData" :rules="rules" size="medium" label-width="110px" :label-position="'left'">
            <div class="content">
                 <div class="header mb8">代发货主信息</div>

                 <el-row :gutter="15">
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
                </el-row>
                
            </div>
             <el-divider></el-divider>

             <div class="content">
                <div class="header mb8">2</div>
               
               <el-form-item label="选择所属项目" prop="field122">
                    <el-select v-model="formData.field122" placeholder="无归属项目" clearable :style="{width: '100%'}">
                    <el-option v-for="(item, index) in field122Options" :key="index" :label="item.label"
                        :value="item.value" :disabled="item.disabled"></el-option>
                    </el-select>
                </el-form-item>

               <el-form-item label="选择货物类型" prop="field122">
                    <el-select v-model="formData.tin2" placeholder="煤炭及其制品" clearable :style="{width: '100%'}">
                    <!-- <el-option v-for="(item, index) in field122Options" :key="index" :label="item.label"
                        :value="item.value" :disabled="item.disabled"></el-option> -->
                        <el-option label="渣土" :value="1"></el-option>
                        <el-option label="其他" :value="2"></el-option>
                    </el-select>
                </el-form-item>

               <el-form-item label="货物类型(小)" prop="field125">
                    <el-checkbox-group v-model="formData.field125" size="medium" v-if="formData.tin2 == 1">
                        <el-checkbox v-for="(item, index) in field125Options" :key="index" :label="item.value"
                            :disabled="item.disabled">{{item.label}}</el-checkbox>
                    </el-checkbox-group>

                    <el-radio-group v-model="formData.field126" size="medium" v-else>
                        <el-radio v-for="(item, index) in field126Options" :key="index" :label="item.value"
                            :disabled="item.disabled">{{item.label}}</el-radio>
                    </el-radio-group>
                </el-form-item>

                <el-form-item label="发布为" prop="field126">
                    <el-radio-group v-model="formData.tin1" size="medium">
                        <el-radio :label="1">公开货源(所有人可接)</el-radio>
                        <el-radio :label="0">非公开货源</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="指定接单人(调度者3人,司机1人)" prop="field126" v-if="formData.tin1 == 0">
                    <el-select v-model="formData.field122" placeholder="选择接单人" clearable :style="{width: '100%'}">
                        <el-option v-for="(item, index) in field122Options" :key="index" :label="item.label"
                            :value="item.value" :disabled="item.disabled"></el-option>
                        </el-select>
                </el-form-item>
                <el-form-item label="货集码" prop="field126" v-if="formData.tin1 == 0">
                    <el-select v-model="formData.field122" placeholder="选择货集码" clearable :style="{width: '100%'}">
                        <el-option v-for="(item, index) in field122Options" :key="index" :label="item.label"
                            :value="item.value" :disabled="item.disabled"></el-option>
                    </el-select>
                </el-form-item>

                <el-form-item label="备注信息">
                    <el-input v-model="formData.field154" type="textarea" placeholder="请输入任何您想说的话..."
                        :autosize="{minRows: 4, maxRows: 4}" :style="{width: '100%'}"></el-input>
                </el-form-item>

            </div>
             <el-divider></el-divider>

             <div class="content">   
               <div class="header mb8">装货类型</div>
                <el-form-item label="装货类型" prop="field122">
                    <el-radio-group v-model="formData.tin6" size="medium">
                        <el-radio :label="0">一装一卸</el-radio>
                        
                        <el-radio :label="1">多装一卸</el-radio>

                        <el-radio :label="2">一装多卸</el-radio>
                    </el-radio-group>
                </el-form-item>

                <el-form-item label="允许自装" prop="field122">
                    <el-checkbox v-model="formData.tin7"></el-checkbox>
                </el-form-item>
             </div>
             <el-divider></el-divider>


            <div class="content">   
               <div class="header mb8">货源发布</div>

                

               <el-form-item label="装货省" prop="field102">
                    <div class="flex">
                        <el-select v-model="formData.field102" placeholder="请选择装货省" clearable :style="{width: '25%'}">
                            <el-option v-for="(item, index) in field102Options" :key="index" :label="item.label"
                                :value="item.value" :disabled="item.disabled"></el-option>
                        </el-select>

                        <span class="pl-5 pr-5">市: </span>
                        <el-select v-model="formData.field102" placeholder="请选择装货省" clearable :style="{width: '25%'}">
                            <el-option v-for="(item, index) in field102Options" :key="index" :label="item.label"
                                :value="item.value" :disabled="item.disabled"></el-option>
                        </el-select>

                        <span class="pl-5 pr-5">县/区: </span>
                        <el-select v-model="formData.field102" placeholder="请选择装货省" clearable :style="{width: '25%'}">
                            <el-option v-for="(item, index) in field102Options" :key="index" :label="item.label"
                                :value="item.value" :disabled="item.disabled"></el-option>
                        </el-select>
                        <el-button class="fahuoBtn" type="primary" @click="onSubmit">常用地址</el-button>
                    </div>
                </el-form-item>


                <el-form-item label="详细地址" prop="field112">
                    <el-input v-model="formData.field112" placeholder="请输入具体地址" clearable :style="{width: '100%'}"></el-input>
                </el-form-item>

                <el-form-item label="地址别名" prop="field112">
                    <el-input v-model="formData.field112" clearable placeholder="优先展示, 最多输入10个字" :style="{width: '100%'}"></el-input>
                </el-form-item>


                 <el-row :gutter="15">
                    <el-col :span="12">
                        <el-form-item label="联系人" prop="field113">
                            <el-input v-model="formData.field113" placeholder="请输入联系人" clearable :style="{width: '100%'}">
                            </el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="联系电话" prop="field114">
                            <el-input v-model="formData.field114" placeholder="请输入联系电话" clearable :style="{width: '100%'}">
                            </el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
            </div>

            <el-divider></el-divider>
            
            <div class="content">   
               <div class="header mb8">卸货信息</div>
               <el-form-item label="卸货省" prop="field102">
                    <div class="flex">
                        <el-select v-model="formData.field102" placeholder="请选择装货省" clearable :style="{width: '25%'}">
                            <el-option v-for="(item, index) in field102Options" :key="index" :label="item.label"
                                :value="item.value" :disabled="item.disabled"></el-option>
                        </el-select>

                        <span class="pl-5 pr-5">市: </span>
                        <el-select v-model="formData.field102" placeholder="请选择装货省" clearable :style="{width: '25%'}">
                            <el-option v-for="(item, index) in field102Options" :key="index" :label="item.label"
                                :value="item.value" :disabled="item.disabled"></el-option>
                        </el-select>

                        <span class="pl-5 pr-5">县/区: </span>
                        <el-select v-model="formData.field102" placeholder="请选择装货省" clearable :style="{width: '25%'}">
                            <el-option v-for="(item, index) in field102Options" :key="index" :label="item.label"
                                :value="item.value" :disabled="item.disabled"></el-option>
                        </el-select>
                        <el-button class="fahuoBtn" type="primary" @click="onSubmit">选择常用收货地址</el-button>
                    </div>
                </el-form-item>


                <el-form-item label="详细地址" prop="field112">
                    <el-input v-model="formData.field112" clearable placeholder="请输入具体地址" :style="{width: '100%'}"></el-input>
                </el-form-item>

                <el-form-item label="地址别名" prop="field112">
                    <el-input v-model="formData.field112" clearable placeholder="优先展示, 最多输入10个字" :style="{width: '100%'}"></el-input>
                </el-form-item>

                 <el-row :gutter="15">
                    <el-col :span="12">
                        <el-form-item label="联系人" prop="field113">
                            <el-input v-model="formData.field113" placeholder="请输入联系人" clearable :style="{width: '100%'}">
                            </el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="联系电话" prop="field114">
                            <el-input v-model="formData.field114" placeholder="请输入联系电话" clearable :style="{width: '100%'}">
                            </el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
            </div>

            <el-divider></el-divider>

            <div class="content">
                <div class="header mb8">货物</div>

                <el-form-item label="货物计量单位" prop="field122">
                    <el-select v-model="formData.tin3" placeholder="请选择货物计量单位" clearable :style="{width: '100%'}">
                    <!-- <el-option v-for="(item, index) in field122Options" :key="index" :label="item.label"
                        :value="item.value" :disabled="item.disabled"></el-option> -->
                        <el-option label="吨" :value="1"></el-option>
                        <el-option label="千克" :value="2"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="货物总量" prop="field122">
                    <el-radio-group v-model="formData.tin5" size="medium">
                        <el-radio :label="0">不限(长期货源)</el-radio>
                        
                        <el-radio :label="1">
                            共 <el-input-number v-model="formData.field116" placeholder="请输入重量(吨)" step-strictly controls-position=right :style="{width: '120px'}">
                            </el-input-number>  {{formData.tin3 == 1?'吨': '千克'}}
                        </el-radio>
                    </el-radio-group>
                </el-form-item>

                <el-form-item label="最高配载(吨/方)" prop="field121">
                    <el-input-number v-model="formData.field121" placeholder="请输入最高配载(吨/方)" step-strictly controls-position=right :style="{width: '50%'}"></el-input-number>
                </el-form-item>

                <el-form-item label="运输单价" prop="field119">
                    <el-input-number v-model="formData.field119" placeholder="运输单价" step-strictly controls-position=right :style="{width: '50%'}"></el-input-number> <span>元/吨(不含税)</span>
                </el-form-item>

                <el-form-item label="货物单价" prop="field119">
                    <el-input-number v-model="formData.field119" placeholder="货物单价" step-strictly controls-position=right :style="{width: '50%'}"></el-input-number> <span>元/吨</span>
                </el-form-item>

                <el-form-item label="车型车长限制">
                    <el-button @click="onSubmit">选择车型</el-button>
                    <el-button @click="onSubmit">选择用车类型</el-button>
                    <el-button @click="onSubmit">选择车长</el-button>
                    <el-button type="primary" @click="onSubmit">清除已选</el-button>
                </el-form-item>

                <el-form-item label="已选车型" prop="field154">
                    <el-input v-model="formData.field154" type="textarea" placeholder="无则 不限车型, 不限车长"
                    :autosize="{minRows: 4, maxRows: 4}" :style="{width: '100%'}" disabled></el-input>
                </el-form-item>
            </div>
            

            <div class="content">
                <div class="header mb8">核算:</div>

                <el-form-item label="核算规则" prop="field122">
                    <el-select v-model="formData.tin4" placeholder="煤炭专用规则" clearable :style="{width: '100%'}">
                    <!-- <el-option v-for="(item, index) in field122Options" :key="index" :label="item.label"
                        :value="item.value" :disabled="item.disabled"></el-option> -->
                        <el-option label="煤炭专用规则" :value="1"></el-option>
                        <el-option label="规则2" :value="2"></el-option>
                    </el-select>
                </el-form-item>


                <el-form-item label="免赔偿路耗规范(定额)" prop="field122">
                    <div style="display: flex;
      justify-content: flex-start;
      align-items: center;">
                        <span>-</span>
                        <el-input-number v-model="formData.field116" placeholder="请输入重量(吨)" step-strictly controls-position=right :style="{width: '120px'}"></el-input-number>
                        <span>吨</span>
                        <span>-</span>
                        <span>+</span>
                        <el-input-number v-model="formData.field118" placeholder="请输入体积(方)" step-strictly controls-position=right :style="{width: '120px'}"></el-input-number>
                        <span>吨</span>
                    </div>
                </el-form-item>

                <el-form-item label="过路费补贴(ETC)" prop="field122">
                        <span>+</span>
                        <el-input-number v-model="formData.field118" placeholder="请输入体积(方)" step-strictly controls-position=right :style="{width: '120px'}"></el-input-number>
                        <span>元</span>
                </el-form-item>
                <el-form-item label="装车费补贴" prop="field122">
                        <span>+</span>
                        <el-input-number v-model="formData.field118" placeholder="请输入体积(方)" step-strictly controls-position=right :style="{width: '120px'}"></el-input-number>
                        <span>元</span>
                </el-form-item>
                <el-form-item label="卸车费补贴" prop="field122">
                        <span>+</span>
                        <el-input-number v-model="formData.field118" placeholder="请输入体积(方)" step-strictly controls-position=right :style="{width: '120px'}"></el-input-number>
                        <span>元</span>
                </el-form-item>

            </div>
            <div class="content">
                <div class="header mb8">预估运费</div>

                <div>
                    <span>预估运费(不含税):</span> <span>￥</span><span>8566.00</span>
                </div>
                <div>
                    <span>(含税):</span> <span>￥</span><span>8566.00</span>
                </div>
            </div>


            <div class="content" v-if="false">
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

            </div>

            <el-divider v-if="false"></el-divider>
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
                
            </div>



            <el-form-item>
                <el-button type="primary" @click="onSubmit">立即创建</el-button>
                <el-button>取消</el-button>
            </el-form-item>
        </el-form>


        <!-- 添加或修改【请填写功能名称】对话框 -->
        <el-dialog :title="title" :visible.sync="open" width="75%" append-to-body>
        
            <div>
                <open-dialog></open-dialog>
            </div>
        
        </el-dialog>
    </div>
</template>

<script>
import OpenDialog from './OpenDialog'
export default {
    components:{
        OpenDialog
    },
    data() {
      return {
        formData: {
            field101: 1,
            field102: undefined,
            field105: undefined,
            field106: undefined,
            field107: undefined,
            field109: undefined,
            field110: undefined,
            field112: undefined,
            field113: undefined,
            field114: undefined,
            field116: 0,
            field118: 0,
            field119: undefined,
            field120: 0,
            field121: 40,
            field122: undefined,
            field124: [],
            field125: [],
            field126: 2,
            field127: 1,
            field128: undefined,
            field129: undefined,
            field132: undefined,
            field133: 1,
            field134: undefined,
            field137: 1,
            field138: undefined,
            field140: 0,
            field141: undefined,
            field142: 2,
            field143: 0,
            field144: 1,
            field145: 1,
            field146: undefined,
            field148: 0,
            field149: 1,
            field150: 1,
            field151: 1,
            field152: 1,
            field154: undefined,
            field155: undefined,

            tin1: 1,
            tin2: 1,
            tin3: 1,
            tin4: 1,
            tin5: 0,
            tin6: 1,
            tin7: false,

            // classList:[], // 货源码列表
            // code:'',
            // id:'',
            // isClass: 0,     //	*是否加入货源码 0否 1是
            // isPublic: 0,    //	是否公开货源 0.非公开 1.公开
            // isSpecified: 0, //	是否指定接单人 0否 1是
            // mainOrderNumber:'', // 货源单号
            // orderFreightBoList:[],	// 运费规则列表
            // orderFreightDetailVOList:[], //	运费规则列表
            // orderGoodsList:[], //	货源商品列表
            // orderGoodsUpdateBoList:[], // 	货源商品列表
            // orderSpecifiedList:[], //	指定接单人列表
            // orderUpdateBoList:[], //	运费规则列表
            // projectCode:'', //	项目编码
            // pubilshCode:'', //	发布人Code
            // remark: '' // 备注

            // "classList": [
            //     {
            //         "classCode": "",
            //         "code": ""
            //     }
            // ],
            // "code": "",
            // "id": "",
            // "isClass": 0, // 是否加入货源码 0否 1是
            // "isPublic": 0, // 是否公开货源 0.非公开 1.公开
            // "isSpecified": true,
            // "mainOrderNumber": "",
            // "orderFreightBoList": [
            //     {
            //         "id": 0,
            //         "ruleItemId": 0,
            //         "ruleItemValue": ""
            //     }
            // ],
            // "orderFreightDetailVOList": [
            //     {
            //         "id": 0,
            //         "orderCode": 0,
            //         "ruleItemId": 0,
            //         "ruleItemValue": ""
            //     }
            // ],
            // "orderGoodsList": [ // 货源商品列表
            //     {
            //         "addressList": [
            //             {
            //                 "adcode": "",
            //                 "addressAlias": "",
            //                 "addressType": 0,
            //                 "city": "",
            //                 "citycode": "",
            //                 "code": "",
            //                 "contact": "",
            //                 "contactPhone": "",
            //                 "country": "",
            //                 "detail": "",
            //                 "district": "",
            //                 "id": 0,
            //                 "level": "",
            //                 "location": 0,
            //                 "province": "",
            //                 "street": ""
            //             }
            //         ],
            //         "code": "",
            //         "endLimitWastage": 0,
            //         "goodsBigType": "",
            //         "goodsType": "",
            //         "goodsUnit": "",
            //         "limitWastage": "",
            //         "loadCartSubsidies": 0,
            //         "orderAddressUpdateBoList": [
            //             {
            //                 "adcode": "",
            //                 "addressAlias": "",
            //                 "addressType": 0,
            //                 "city": "",
            //                 "citycode": "",
            //                 "code": "",
            //                 "contact": "",
            //                 "contactPhone": "",
            //                 "country": "",
            //                 "detail": "",
            //                 "district": "",
            //                 "id": 0,
            //                 "level": "",
            //                 "location": 0,
            //                 "province": "",
            //                 "street": ""
            //             }
            //         ],
            //         "orderCode": "",
            //         "perWeight": 0,
            //         "priceWastage": 0,
            //         "roadSubsidies": 0,
            //         "shipmentPrice": 0,
            //         "startLimitWastage": 0,
            //         "unloadCartSubsidies": 0,
            //         "vehicleLength": "",
            //         "vehicleType": "",
            //         "weight": 0
            //     }
            // ],
            // "orderGoodsUpdateBoList": [
            //     {
            //         "addressList": [
            //             {
            //                 "adcode": "",
            //                 "addressAlias": "",
            //                 "addressType": 0,
            //                 "city": "",
            //                 "citycode": "",
            //                 "code": "",
            //                 "contact": "",
            //                 "contactPhone": "",
            //                 "country": "",
            //                 "detail": "",
            //                 "district": "",
            //                 "id": 0,
            //                 "level": "",
            //                 "location": 0,
            //                 "province": "",
            //                 "street": ""
            //             }
            //         ],
            //         "code": "",
            //         "endLimitWastage": 0,
            //         "goodsBigType": "",
            //         "goodsType": "",
            //         "goodsUnit": "",
            //         "limitWastage": "",
            //         "loadCartSubsidies": 0,
            //         "orderAddressUpdateBoList": [
            //             {
            //                 "adcode": "",
            //                 "addressAlias": "",
            //                 "addressType": 0,
            //                 "city": "",
            //                 "citycode": "",
            //                 "code": "",
            //                 "contact": "",
            //                 "contactPhone": "",
            //                 "country": "",
            //                 "detail": "",
            //                 "district": "",
            //                 "id": 0,
            //                 "level": "",
            //                 "location": 0,
            //                 "province": "",
            //                 "street": ""
            //             }
            //         ],
            //         "orderCode": "",
            //         "perWeight": 0,
            //         "priceWastage": 0,
            //         "roadSubsidies": 0,
            //         "shipmentPrice": 0,
            //         "startLimitWastage": 0,
            //         "unloadCartSubsidies": 0,
            //         "vehicleLength": "",
            //         "vehicleType": "",
            //         "weight": 0
            //     }
            // ],
            // "orderSpecifiedList": [
            //     {
            //         "code": "",
            //         "driverInfoCode": "",
            //         "teamInfoCode": "",
            //         "userType": 0
            //     }
            // ],
            // "orderUpdateBoList": [
            //     {
            //         "id": 0,
            //         "ruleItemId": 0,
            //         "ruleItemValue": ""
            //     }
            // ],
            // "projectCode": "",
            // "pubilshCode": "",
            // "remark": ""

            
        },
        rules: {
            field101: [],
            field102: [{
            required: true,
            message: '请选择装货省',
            trigger: 'change'
            }],
            field105: [],
            field106: [{
            required: true,
            message: '请输入装货人',
            trigger: 'blur'
            }],
            field107: [{
            required: true,
            message: '请输入装货电话',
            trigger: 'blur'
            }],
            field109: [{
            required: true,
            message: '请输入装货时间',
            trigger: 'blur'
            }],
            field110: [{
            required: true,
            message: '----请选择----',
            trigger: 'change'
            }],
            field112: [],
            field113: [{
            required: true,
            message: '请输入收货人',
            trigger: 'blur'
            }],
            field114: [{
            required: true,
            message: '请输入收货电话',
            trigger: 'blur'
            }],
            field116: [],
            field118: [],
            field119: [{
            required: true,
            message: '货物单价',
            trigger: 'blur'
            }],
            field120: [],
            field121: [],
            field122: [{
            required: true,
            message: '请选择业务类型',
            trigger: 'change'
            }],
            field124: [{
            required: true,
            type: 'array',
            message: '请至少选择一个field124',
            trigger: 'change'
            }],
            field125: [{
            required: true,
            type: 'array',
            message: '请至少选择一个field125',
            trigger: 'change'
            }],
            field126: [],
            field127: [],
            field128: [{
            required: true,
            message: '请输入运费单价(元)',
            trigger: 'blur'
            }],
            field129: [],
            field132: [{
            required: true,
            message: '合理路耗不能为空',
            trigger: 'change'
            }],
            field133: [],
            field134: [],
            field137: [],
            field138: [],
            field140: [],
            field141: [],
            field142: [],
            field143: [{
            required: true,
            message: '请输入车',
            trigger: 'blur'
            }],
            field144: [],
            field145: [],
            field146: [],
            field148: [],
            field149: [],
            field150: [],
            field151: [],
            field152: [],
            field154: [],
            field155: [],
        },
        field101Options: [{
            "label": "否",
            "value": 1
            }, {
            "label": "是",
            "value": 2
            }],
            field102Options: [{
            "label": "选项一",
            "value": 1
            }, {
            "label": "选项二",
            "value": 2
            }],
            field110Options: [{
            "label": "选项一",
            "value": 1
            }, {
            "label": "选项二",
            "value": 2
            }],
            field122Options: [{
            "label": "选项一",
            "value": 1
            }, {
            "label": "选项二",
            "value": 2
            }],
            field124Options: [{
            "label": "上级部级标准",
            "value": 1
            }],
            field125Options: [{
            "label": "其他",
            "value": 1
            }, {
            "label": "商品汽车",
            "value": 2
            }, {
            "label": "冷藏冷冻货物",
            "value": 3
            }, {
            "label": "鲜活农产品",
            "value": 4
            }, {
            "label": "轻工医药产品",
            "value": 5
            }, {
            "label": "有色金属",
            "value": 6
            }],
            field126Options: [{
            "label": "吨(方)配载",
            "value": 1
            }, {
            "label": "车数配载",
            "value": 2
            }],
            field127Options: [{
            "label": "元/吨 (方)",
            "value": 1
            }, {
            "label": "元/车",
            "value": 2
            }, {
            "label": "元/ (吨*公里)",
            "value": 3
            }],
            field132Options: [{
            "label": "关闭",
            "value": 1
            }, {
            "label": "定额(kg/车)",
            "value": 2
            }, {
            "label": "定率(% /车)",
            "value": 3
            }],
            field133Options: [{
            "label": "否",
            "value": 1
            }, {
            "label": "是",
            "value": 2
            }],
            field137Options: [{
            "label": "否",
            "value": 1
            }, {
            "label": "是",
            "value": 2
            }],
            field142Options: [{
            "label": "否",
            "value": 1
            }, {
            "label": "是",
            "value": 2
            }],
            field144Options: [{
            "label": "否",
            "value": 1
            }, {
            "label": "是",
            "value": 2
            }],
            field145Options: [{
            "label": "汽运一票制",
            "value": 1
            }, {
            "label": "对付",
            "value": 2
            }, {
            "label": "代收代付",
            "value": 3
            }],
            field146Options: [{
            "label": "选项一",
            "value": 1
            }, {
            "label": "选项二",
            "value": 2
            }],
            field149Options: [{
            "label": "24小时",
            "value": 1
            }, {
            "label": "选项二",
            "value": 2
            }],
            field150Options: [{
            "label": "否",
            "value": 1
            }, {
            "label": "是",
            "value": 2
            }],
            field151Options: [{
            "label": "APP",
            "value": 1
            }, {
            "label": "选项二",
            "value": 2
            }],
            field152Options: [{
            "label": "否",
            "value": 1
            }, {
            "label": "是",
            "value": 2
        }],

        // 是否显示弹出层
        open: false,
        // 弹框title
        title:''
      }
    },
    methods: {
      onSubmit() {
          this.open = true
        console.log('submit!');
      }
    }
}
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
.flex{
    display: flex;
    justify-content: space-between;
    position: relative;
    .fahuoBtn{
        position: absolute;
        right: -15px;
        top: 0;
        transform: translateX(100%);
    }
}

.vih{
    line-height: 36px;
}

</style>