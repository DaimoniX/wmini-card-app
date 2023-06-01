export interface RequestParams {
  url: string
  data?: string | object | ArrayBuffer
  enableHttpDNS?: boolean
  enableQuic?: boolean
  forceCellularNetwork?: boolean
  header?: Record<string, any>
  httpDNSServiceId?: string
  method?:
  | 'OPTIONS'
  | 'GET'
  | 'HEAD'
  | 'POST'
  | 'PUT'
  | 'DELETE'
  | 'TRACE'
  | 'CONNECT'
  responseType?: 'text' | 'arraybuffer'
  timeout?: number
}

export default function request(params: RequestParams) {
  params.header = params.header ?? {};
  params.header['Content-Type'] = params.header['Content-Type'] ?? "application/json"; 
  params.header["ngrok-skip-browser-warning"] = "true";
  return new Promise<WechatMiniprogram.RequestSuccessCallbackResult<Record<string, any>>>((resolve, reject) => {
    wx.request({
      ...params, success(e) {
        if (e.statusCode > 199 && e.statusCode < 300)
          resolve(e as WechatMiniprogram.RequestSuccessCallbackResult<Record<string, any>>);
        else
          reject(e);
      }, fail(e) {
        reject(e);
      }
    });
  });
}