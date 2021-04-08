import { getToken } from '@/utils/auth';

export const authorization = 'Bearer ' + getToken();
export const produceCode = '776ca8e240574192b6e0f69b417163df';// 产品编码
export const appCode = '3f78fbfc13b14fa4b3d78665124ef4bb';// 应用编码
export const appVersion = '2.0';// 应用版本
export const terminalType = 'web';// 终端类别（0其它 1:app 2:web 3:微信小程序）
export const terminalDeviceBrand = '1';// 手机厂商-app
export const terminalSystemModel = '2';// 手机型号-app
export const terminalSystemVersion = '3';// 系统版本号-app
export const terminalIMEI = '4';// MEI（国际移动设备识别码）-app
