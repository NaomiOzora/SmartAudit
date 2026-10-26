declare module "pngjs" {
  export class PNG {
    static sync: {
      read(buffer: Buffer): {
        width: number;
        height: number;
        data: Buffer | Uint8Array;
      };
    };
    width: number;
    height: number;
    data: Buffer | Uint8Array;
  }
}
