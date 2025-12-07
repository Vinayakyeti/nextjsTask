export function sanitizeHtml(input: string): string {
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

export function sanitizeInput(input: string): string {
  return input.trim().replace(/[\s]+/g, ' ');
}

export function filterSensitiveFields<T extends Record<string, any>>(
  obj: T,
  fieldsToKeep: (keyof T)[]
): Partial<T> {
  return Object.keys(obj).reduce((acc, key) => {
    if (fieldsToKeep.includes(key as keyof T)) {
      acc[key as keyof T] = obj[key];
    }
    return acc;
  }, {} as Partial<T>);
}

export function isValidObjectId(id: string): boolean {
  return /^[0-9a-fA-F]{24}$/.test(id);
}
