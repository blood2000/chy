import request from '@/utils/request';

// 查询发票列表
export const billListApi = '/transportation/invoiceApply/listInvoiceApply';
export function billList(data) {
  return request({
    url: '/transportation/invoiceApply/listInvoiceApply',
    method: 'post',
    data: data
  });
}

// 审核发票申请
export function passCheck(data) {
  return request({
    url: '/transportation/invoiceApply/passCheck',
    method: 'post',
    data: data
  });
}

// 发票结算单详情
export function getDetail(invoiceApplyCode) {
  return request({
    url: '/transportation/invoiceApply/detail/' + invoiceApplyCode,
    method: 'post'
  });
}

// 查看这张发票下的所有运单
export function getInvoiceWaybill(invoiceCode) {
  return request({
    url: '/transportation/invoice/getWayBillByInvoice/' + invoiceCode,
    method: 'post'
  });
}

// 查看这张申请记录的所有运单
export function getApplyWaybill(applyCode) {
  return request({
    url: '/transportation/invoiceApply/getWayBillByApply/' + applyCode,
    method: 'post'
  });
}

// 开票
export function openInvoice(data) {
  return request({
    url: '/transportation/invoiceApply/openInvoice',
    method: 'post',
    data: data
  });
}

// 驳回批量开票(渣土)
export function refuseBilling(data) {
  return request({
    url: '/transportation/batch/refuseBilling',
    method: 'post',
    data: data
  });
}

// 确定批量打款(渣土) (状态是3)
export function passPayment(data) {
  return request({
    url: '/transportation/batch/passPayment',
    method: 'post',
    data: data
  });
}


