import { getGlobalData } from "../app";
import { ANALYTICS_URL, OPENID_URL, APP_ID, ACCESS_TOKEN } from "./config";

export function report(event: string, data: Record<string, any>) {
  data['eventName'] = event;
  data['appId'] = APP_ID;
  data['accessToken'] = ACCESS_TOKEN;
  data['openId'] = getGlobalData().openId;
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
        data: {
          appId: APP_ID,
          accessToken: ACCESS_TOKEN
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