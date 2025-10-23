// types/import-meta-glob.d.ts
declare interface ImportMeta {
  glob<T = unknown>(
    pattern: string | string[],
    options?:
      | { as?: string; eager?: false; import?: string }
      | { as?: string; eager: true; import?: string }
  ): Record<string, T>;
}
