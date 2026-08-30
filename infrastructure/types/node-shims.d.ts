declare const process: {
  env: Record<string, string | undefined>;
};

declare interface ImportMeta {
  readonly dirname: string;
}

declare module 'node:fs' {
  const fs: any;
  export = fs;
}

declare module 'node:path' {
  const path: any;
  export = path;
}
