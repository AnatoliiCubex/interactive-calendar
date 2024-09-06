import { AppMode } from "~/basics/types/example.type";

export function getLinkTo(to: string, mode?: string) {
  return `/${mode ?? "dev"}${to}`;
}

export function getPathWithoutMode(path: string) {
  return path.replace(/\/(dev|prod|content)\//, "");
}

export function getAppModeFromPath(path: string): AppMode {
  const match = path.match(/dev|prod|content/);
  return match ? (match[0] as AppMode) : AppMode.DEV;
}
