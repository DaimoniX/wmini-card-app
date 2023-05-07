export function selectAsync(selector: string, fields: WechatMiniprogram.Fields) {
  return new Promise<Array<any>>((resolve) => {
    const query = wx.createSelectorQuery();
    query.select(selector)
      .fields(fields)
      .exec((res) => {
        resolve(res);
      });
  });
}

export function selectAllAsync(selector: string, fields: WechatMiniprogram.Fields) {
  return new Promise<Array<any>>((resolve) => {
    const query = wx.createSelectorQuery();
    query.selectAll(selector)
      .fields(fields)
      .exec((res) => {
        resolve(res);
      });
  });
}

export function canvasToTempFilePathAsync(canvas: WechatMiniprogram.Canvas, destWidth: number, destHeigt: number) {
  return new Promise<string>((resolve, reject) => {
    wx.canvasToTempFilePath({
      canvas: canvas,
      destWidth: destWidth,
      destHeight: destHeigt,
      success(res) {
        resolve(res.tempFilePath);
      },
      fail(e) {
        reject(e);
      }
    })
  })
  
}