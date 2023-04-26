declare module '*.svg' {
  const content: string;
  export default content;
}

declare module '*.jpg' {
  const content: string;
  export default content;
}

declare module '*.png' {
  const content: string;
  export default content;
}

declare module '*md' {
  const content: string;
  export default content;
}

declare module '*.json' {
  const value: any;
  export default value;
}

declare type Mutable<T> = { -readonly [P in keyof T]: T[P] };

declare interface AppConfigProduction {
  graphqlEndpoint: string;
  subscriptionEndpoint: string;
  serverHostname: string;
  serverPort: number;
}

declare interface PreloadedStates {
  REDUX: Partial<ReduxStore>;
  RELAY: Record<string, any>;
}
