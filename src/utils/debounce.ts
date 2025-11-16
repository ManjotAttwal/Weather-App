export function debounce<T extends (...args: any[]) => void>(fn: T, wait = 400) {
  let handle: NodeJS.Timeout | null = null;
  return (...args: Parameters<T>) => {
    if (handle) clearTimeout(handle);
    handle = setTimeout(() => fn(...args), wait);
  };
}
