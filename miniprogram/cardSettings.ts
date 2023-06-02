export type CardSettings = {
  bgColor: string,
  bgImage: string
};

export function CreateSettings() : CardSettings {
  return { bgColor: "rgb(120, 120, 180)", bgImage: "" };
}