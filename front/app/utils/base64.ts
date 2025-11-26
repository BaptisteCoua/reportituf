import { Buffer } from "buffer";

function b64encode(str: string) {
  return Buffer.from(str, "utf8").toString("base64");
}

function b64decode(str: string) {
  return Buffer.from(str, "base64").toString("utf8");
}
export { b64encode, b64decode };
