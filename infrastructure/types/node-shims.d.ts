declare const process: {
  env: Record<string, string | undefined>;
};

declare interface ImportMeta {
  readonly dirname: string;
}

declare module 'node:fs' {
  export function existsSync(path: string): boolean;
}

declare module 'node:path' {
  export function resolve(...paths: string[]): string;
}
