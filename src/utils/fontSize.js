// 采用rem为单位，根据屏幕的宽度调整html的font-size，获取屏幕宽度并计算比例：
export function setfontSize(res) {
  const clientWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
  if (!clientWidth) return;
  // let size = clientWidth;
  // if (clientWidth < 1920) size = 1920;
  // if (clientWidth > 3200) size = 3200;
  const fontSize = clientWidth / 3200; // 该数值为屏幕宽度
  return res * fontSize;
}
