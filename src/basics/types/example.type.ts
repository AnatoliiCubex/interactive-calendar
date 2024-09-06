export type Item = { name: string; price: number };

export enum AppMode {
  DEV = "dev",
  PROD = "prod",
  CONTENT = "content",
}

export type SetState<T> = React.Dispatch<React.SetStateAction<T>>;
