<template>
	<el-dialog :title="title" :visible="visible" width="1000px" append-to-body @close="cancel">
		
	</el-dialog>
</template>

<script>
import { getDetail } from "@/api/waybill/manages";
export default {
	props: {
    title: String,
    open: Boolean,
		currentId: Number
  },
	data() {
		return {
			
		}
	},
	computed: {
    visible: {
      get() {
        return this.open;
      },
      set(v) {
        this.$emit("update:open", v);
      },
    },
  },
	watch: {
		open(val) {
			if(val) {
				this.getDetail();
			}
		}
	},
	create() {

	},
	methods: {
		// 获取详情
		getDetail() {
			getDetail(this.currentId).then(response => {
				this.form = response.data;
			});
		},
		// 取消按钮
    cancel() {
      this.close();
    },
		// 关闭弹窗
    close() {
      this.$emit("update:open", false);
    }
	}
}
</script>