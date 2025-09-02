// Deep-Path Resolver utils/pathAccess.ts
export function getByPath(obj: any, path: string): any {
    if (!obj || typeof path !== 'string') return undefined;
    const parts = path.split('.');
    let current = obj;
    for (let part of parts) {
        if (part.endsWith('[]')) {
            const arrKey = part.slice(0, -2);
            current = current?.[arrKey];
            if (!Array.isArray(current)) return undefined;
            // If next part is also array, flatten recursively
            const restPath = parts.slice(parts.indexOf(part) + 1).join('.');
            return current.map(item => getByPath(item, restPath)).flat();
        } else {
            current = current?.[part];
        }
        if (current === undefined) return undefined;
    }
    return current;
}

export function setIfMissing(target: any, key: string, value: any) {
    if (value !== undefined && !(key in target)) {
        target[key] = value;
    }
}
