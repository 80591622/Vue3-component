import { Plugin } from 'vue';
export type SFCWithInstall<T> = T & Plugin;
export function withInstall<T>(comp: T) {
  (comp as SFCWithInstall<T>).install = (app: any) => {
    const { name } = comp as unknown as { name: string };
    app.component(name, comp);
  };
  return comp as SFCWithInstall<T>;
}


