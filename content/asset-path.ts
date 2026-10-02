const basePath = process.env.NEXT_PUBLIC_BASE_PATH?.trim().replace(/^\/+|\/+$/g, "") ?? "";
export const siteBasePath = basePath ? `/${basePath}` : "";

export function publicAssetPath(path: string): string {
  return `${siteBasePath}${path}`;
}
