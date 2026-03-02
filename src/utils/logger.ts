export function logger(...args: any[]) {
  if (import.meta.env.PROD) return;

  console.log(...args);
}
