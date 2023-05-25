import { ANALYTICS_URL } from "./url";
import { OPENID_URL } from "./url";

export function report(event: string, data: Record<string, any>) {
  data['event_name'] = event;
  wx.request({
    url: `${ANALYTICS_URL}`,
    data: data,
    method: 'POST',
    header: {
      "ngrok-skip-browser-warning": "true"
    },
    success() {
      console.log("Reported event:", event);
    },
    fail(e) {
      console.log("Failed to report:", e);
    }
  });
}

export function getOpenId(code: string) {
  return new Promise(
    (resolve, reject) =>
      wx.request({
        url: `${OPENID_URL}?js_code=${code}`,
        method: "GET",
        timeout: 10000,
        header: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "ngrok-skip-browser-warning": "true"
        },
        success(e) {
          resolve((e.data as Record<string, any>).openid);
        },
        fail(e) {
          reject(e);
        }
      })
  );
}