import { getGlobalData } from "../app";
import { ANALYTICS_URL, OPENID_URL, APP_ID, ACCESS_TOKEN, FRAMES_URL, BASE_URL } from "./config";

function buildImageUrl(img: string) {
  if(img.startsWith("http"))
    return img;
  return `${BASE_URL}/${img}`;
}

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
  return new Promise<String>(
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

export function getFrames() {
  return new Promise<Array<string>>(
    (resolve, reject) =>
      wx.request({
        url: `${FRAMES_URL}`,
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
          const frames = (e.data as any).frames;
          const result = Array<string>();
          for(const frame of frames)
            result.push(buildImageUrl(frame.img));
          resolve(result);
        },
        fail(e) {
          reject(e);
        }
      })
  );
}