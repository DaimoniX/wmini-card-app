const cache : FrameCache = {};

export type FrameCache = Record<string, string>;

export function addToCache(serverUrl : string, localUrl : string) {
  cache[serverUrl] = localUrl;
}

export function getFromCache(serverUrl: string) : string | undefined {
  return cache[serverUrl];
}