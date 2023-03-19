// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type ShareScope<TComponent = any> = Record<
  string,
  Record<string, { loaded?: 1; get: () => Promise<TComponent>; from: string; eager: boolean }>
>;

export interface ModuleContainer<TComponent> {
  init(shareScope: ShareScope<TComponent>): Promise<void>;
  get(module: string): Promise<() => Record<string, TComponent>>;
}
