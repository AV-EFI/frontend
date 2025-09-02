// stores/fieldOrder.ts
import { defineStore } from 'pinia';
import { UI_FIELD_ORDER } from '../config/field-order';
import type { ViewKind, EntityKind, FieldOrderConfig, UIOrderConfig } from '../config/field-order';
import { getByPath } from '../utils/pathAccess';

function removeHidden(data: Record<string, any>, hidden: string[] = []) {
    if (!hidden?.length) return data;
    const result: Record<string, any> = {};
    for (const key in data) {
        if (!hidden.includes(key)) result[key] = data[key];
    }
    return result;
}

function applyAliasesDeep(data: Record<string, any>, aliases: Record<string, string[]> = {}) {
    const result: Record<string, any> = { ...data };
    for (const alias in aliases) {
        for (const path of aliases[alias]) {
            const value = getByPath(data, path);
            if (value !== undefined) {
                result[alias] = value;
                break;
            }
        }
    }
    return result;
}

function pinAdjust(order: string[], cfg: FieldOrderConfig): string[] {
    let result = [...order];
    if (cfg.pin?.before) {
        for (const key in cfg.pin.before) {
            const pins = cfg.pin.before[key];
            for (const pin of pins) {
                const idx = result.indexOf(key);
                if (idx > -1 && !result.includes(pin)) {
                    result.splice(idx, 0, pin);
                }
            }
        }
    }
    if (cfg.pin?.after) {
        for (const key in cfg.pin.after) {
            const pins = cfg.pin.after[key];
            for (const pin of pins) {
                const idx = result.indexOf(key);
                if (idx > -1 && !result.includes(pin)) {
                    result.splice(idx + 1, 0, pin);
                }
            }
        }
    }
    return result;
}

function sortEntries(entries: Record<string, any>, view: ViewKind, entity: EntityKind, config?: UIOrderConfig): Array<[string, any]> {
    const cfg = config ? config[view][entity] : UI_FIELD_ORDER[view][entity];
    let data = { ...entries };
    if (cfg.aliases) data = applyAliasesDeep(data, cfg.aliases);
    if (cfg.hidden) data = removeHidden(data, cfg.hidden);
    let order = pinAdjust(cfg.order, cfg);
    const known = order.filter(key => key in data);
    const unknown = Object.keys(data).filter(key => !order.includes(key)).sort();
    const sortedKeys = [...known, ...unknown];
    return sortedKeys.map(key => [key, data[key]]);
}

export const useFieldOrderStore = defineStore('fieldOrder', {
    state: () => ({
        config: UI_FIELD_ORDER as UIOrderConfig
    }),
    actions: {
        mergeBackendOrder(override: UIOrderConfig) {
            // Deep merge override into config
            this.config = { ...this.config, ...override };
        }
    },
    getters: {
        getConfig: (state) => (view: ViewKind, entity: EntityKind): FieldOrderConfig => {
            return state.config[view][entity];
        },
        sortEntries: (state) => (entries: Record<string, any>, view: ViewKind, entity: EntityKind): Array<[string, any]> => {
            return sortEntries(entries, view, entity, state.config);
        }
    }
});

// Beispiel (WorkVariantDetail.vue)
// const fo = useFieldOrderStore();
// const entries = computed(() => fo.sortEntries(props.workVariant, 'detail', 'workVariant'));

// Bonus utils
export function formatDuration(val: number | string): string {
    let sec = typeof val === 'string' ? parseInt(val, 10) : val;
    if (isNaN(sec) || sec < 0) return '';
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
}

export function formatExtent(value: any, unit?: string): string {
    if (value == null) return '';
    return unit ? `${value} ${unit}` : `${value}`;
}

export function formatArray(arr: any[]): string {
    if (!Array.isArray(arr)) return '';
    if (arr.length === 0) return '';
    if (arr.every(x => typeof x !== 'object')) return arr.join(', ');
    return '';
}
