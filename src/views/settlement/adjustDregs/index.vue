
<template>
  <div>

    <div class="g-radio-group ly-flex-pack-justify">
      <el-radio-group v-model="activeName" size="small">
        <el-radio-button label="4">已复核</el-radio-button>
        <el-radio-button label="5">已核验</el-radio-button>
        <el-radio-button v-hasPermi="['transportation:batch:list']" label="7">已打款</el-radio-button>
      </el-radio-group>
    </div>

    <!-- 已核验 -->
    <Verification v-show="activeName == '5'" />

    <PaiMoney v-show="activeName == '7'" />

    <AccountingPage v-show="activeName == '4'" />

  </div>
</template>

<script>
// ----------
// 已核验的页面
import Verification from './VerificationPage';

// 已打款的页面
import PaiMoney from './PaiMoney';

// 已核算页面
import AccountingPage from './AccountingPage';
export default {
  'name': 'AdjustDregs',
  components: { Verification, PaiMoney, AccountingPage },
  data() {
    return {
      activeName: '4'
    };
  }
};
</script>
