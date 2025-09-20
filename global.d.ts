export {};

declare global {
  interface Window {
    electron?: {
      platform: NodeJS.Platform;
      versions: NodeJS.ProcessVersions;
    };
  }
}
