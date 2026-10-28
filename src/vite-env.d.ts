/// <reference types="vite/client" />

declare module '*.css' {
  const content: string;
  export default content;
}

declare module '*.mp4' {
  const src: string;
  export default src;
}
