declare interface ReduxStore {
  readonly server: {
    readonly graphqlEndpoint: string | null;
    readonly subscriptionEndpoint: string | null;
  };
  readonly ui: {
    readonly theme: 'standardLight' | 'standardDark';
    readonly fontSize: 'small' | 'normal' | 'medium' | 'large';
    readonly locale: 'ru-RU';
    readonly device: 'desktop' | 'tablet' | 'mobile';
  };
}
