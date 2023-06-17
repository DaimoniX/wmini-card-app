const ENABLED = true;

function normalize(content: any) {
  if(!content)
    return "";
  if(typeof content === "string")
    return content;
  return JSON.stringify(content);
}

export function error(title: string, content?: any) {
  ENABLED && wx.showModal({ title, content: normalize(content), showCancel: false, confirmText: "Ok" });
}