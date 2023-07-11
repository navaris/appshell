export type Resource<TResource = unknown> = {
  read(): TResource | Error | undefined;
};
