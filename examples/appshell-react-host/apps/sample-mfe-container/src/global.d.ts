declare module '*.svg' {
  const content: string;
  export default content;
}

interface Window {
  __appshell_env__ContainerModule?: Record<string, string, string | number | undefined>;
}
