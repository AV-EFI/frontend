declare module 'vue-matomo' {
  const plugin: unknown;
  export default plugin;
}

declare module 'vue-instantsearch/vue3/es' {
  const plugin: unknown;
  export default plugin;
}

declare module 'highlight.js/lib/core' {
  type HighlightLanguage = (...args: unknown[]) => unknown;
  const hljs: {
    registerLanguage: (name: string, language: HighlightLanguage) => void;
    highlight: (...args: unknown[]) => unknown;
    highlightAuto: (...args: unknown[]) => unknown;
  };
  export default hljs;
}

declare module 'highlight.js/lib/languages/xml' {
  const language: (...args: unknown[]) => unknown;
  export default language;
}

declare module 'highlight.js/lib/languages/json' {
  const language: (...args: unknown[]) => unknown;
  export default language;
}

declare module 'highlight.js/lib/languages/plaintext' {
  const language: (...args: unknown[]) => unknown;
  export default language;
}

declare module 'tinycolor2' {
  type Rgb = { r: number; g: number; b: number; a: number };
  function tinycolor(color: string): {
    toRgb: () => Rgb;
  };
  export default tinycolor;
}
