<template>
  <div>
      <el-form :ref="`formData`" :model="formData" :rules="rules" :size="formConfig.size" :label-width="formConfig.labelWidth" :label-position="formConfig.labelPosition">
                <el-form-item label="运输单价" prop="shipmentPrice">
                    <el-input-number v-model="formData.shipmentPrice" placeholder="运输单价" step-strictly controls-position=right :style="{width: '50%'}"></el-input-number> <span>车/吨(不含税)</span>
                </el-form-item>

                <el-form-item label="货物单价" prop="goodsPrice">
                    <el-input-number v-model="formData.goodsPrice" placeholder="货物单价" step-strictly controls-position=right :style="{width: '50%'}"></el-input-number> <span>元/吨</span>
                </el-form-item>

                <el-form-item label="车型" prop="vehicleType">
                    <el-select v-model="formData.vehicleType" placeholder="选择车型" clearable :style="{width: '100%'}">
                        <el-option label="车型1" :value="1"></el-option>
                        <el-option label="车型2" :value="2"></el-option>
                    </el-select>
                </el-form-item>

                <el-form-item label="车长" prop="vehicleLength">
                    <el-select v-model="formData.vehicleLength" placeholder="选择车长" clearable :style="{width: '100%'}">
                        <el-option label="车长1" :value="1"></el-option>
                        <el-option label="车长2" :value="2"></el-option>
                    </el-select>
                </el-form-item>

                <!-- 规则 -->
                <el-form-item label="核算规则" prop="ruleItemId">
                        <el-select v-model="formData.ruleItemId" placeholder="煤炭专用规则" clearable :style="{width: '100%'}">
                            <el-option label="煤炭专用规则" :value="1"></el-option>
                            <el-option label="规则2" :value="2"></el-option>
                        </el-select>
                </el-form-item>

                <el-form-item label="过路费补贴(ETC)" prop="roadSubsidies">
                        <span class="pl-5 pr-5">+</span>
                        <el-input-number v-model="formData.roadSubsidies" placeholder="请输入过路费补贴金额" step-strictly controls-position=right :style="{width: '120px'}"></el-input-number>
                        <span class="pl-5 pr-5">元</span>
                </el-form-item>
                <el-form-item label="装车费补贴" prop="loadCartSubsidies">
                        <span class="pl-5 pr-5">+</span>
                        <el-input-number v-model="formData.loadCartSubsidies" placeholder="请输入装车费补贴金额" step-strictly controls-position=right :style="{width: '120px'}"></el-input-number>
                        <span class="pl-5 pr-5">元</span>
                </el-form-item>
                <el-form-item label="卸车费补贴" prop="unloadCartSubsidies">
                        <span class="pl-5 pr-5">+</span>
                        <el-input-number v-model="formData.unloadCartSubsidies" placeholder="请输入卸车费补贴金额" step-strictly controls-position=right :style="{width: '120px'}"></el-input-number>
                        <span class="pl-5 pr-5">元</span>
                </el-form-item>

      </el-form>
  </div>
</template>

<script>
export default {
        props:{
            formConfig:{
                type: Object,
                default:()=>{
                    return {
                        "size": 'medium',
                        "labelWidth":'110px',
                        "labelPosition":'left'
                    }
                }
            },
        },

        data(){
            return {
                formData:{
                    shipmentPrice: 0,
                    goodsPrice: 0,
                    vehicleType: 1,
                    vehicleLength: 1,
                    ruleItemId: 1,
                    roadSubsidies: 0,
                    loadCartSubsidies: 0,
                    unloadCartSubsidies: 0,
                },
                rules:{
                    // goodsUnit: [{ required: true,  message: '请选择货物计量单位',  trigger: 'change' }],
                   
                }
            }
        },

        methods:{
            _submitForm() {
                return new Promise((resolve, reject)=>{
                    console.log(this.$refs['formData']);
                    
                    this.$refs['formData'].validate((valid) => {
                        if (valid) {
                            resolve(this.formData)
                        } else {
                            return false;
                        }
                    });
                })
            },
        }
}
</script>

