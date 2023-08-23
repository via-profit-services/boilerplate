declare module '*.svg' {
  const content: string | any;
  export default content;
}

declare module '*.jpg' {
  const content: string | any;
  export default content;
}

declare module '*.png' {
  const content: any;
  export default content;
}

declare module '*!raw' {
  const content: string | any;
  export default content;
}

declare module '*.json' {
  const content: Record<string, unknown>;
  export default content;
}

declare type Mutable<T> = {
  -readonly [P in keyof T]: T[P];
};
