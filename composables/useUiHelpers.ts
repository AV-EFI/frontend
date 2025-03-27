import type { Activity, AVefiResource, Event, Manifestation, MovingImageRecord, MovingImageRecordContainer, ProductionEvent, WorkVariant } from "../models/interfaces/av_efi_schema";

/**
 * mainly used by search
 */
/**
 * Get the title of the work from the work variant
 * @param item
 * @returns
 * @category Composable/useUiHelpers
 * @example
 * ```ts
 * const title = getWorkTitleFromWorkVariant(item);
 * ```
 * @see getWorkTitleFromWorkVariant
 */
export function getProductionYearFromWorkVariation (item:MovingImageRecordContainer, activityName:String = "avefi:ProducingActivity") {
    try {
        const productionEventList:ProductionEvent[]|undefined = item.has_record?.has_event?.filter((i:Event) => {return i?.category == "avefi:ProductionEvent" || "avefi:PublictationEvent";});
        if(productionEventList) {
            const directingActivities:string[]|undefined = [];
            
            productionEventList?.forEach((pe:ProductionEvent) => {
                if(pe?.has_date) {
                    directingActivities.push(pe?.has_date);
                }
            });

            return directingActivities.join(', ');            
        }
    }
    catch(ex) {
        console.error(ex);
    }
    return null;
}

/**
 * Get the title of the work from the work variant
 * @param item
 * @returns
 * @category Composable/useUiHelpers
 * @example
 * ```ts
 * const title = getWorkTitleFromWorkVariant(item);
 * ```
 * @see getWorkTitleFromWorkVariant
 */
export function getProductionCountryFromWorkVariation (item:MovingImageRecordContainer, activityName:String = "avefi:ProducingActivity") {
    try {
        const productionEventList:ProductionEvent[]|undefined = item.has_record?.has_event?.filter((i:Event) => {return i?.category == "avefi:ProductionEvent" || "avefi:PublictationEvent";});
        if(productionEventList) {
            const directingActivities:string[]|undefined = [];
            
            productionEventList?.forEach((pe:ProductionEvent) => {
                if(pe?.located_in) {
                    pe.located_in.forEach((i) => {
                        directingActivities.push(i?.has_name);
                    });
                }
            });

            return directingActivities.join(', ');            
        }
    }
    catch(ex) {
        console.error(ex);
    }
    return null;
}

/**
 * Get the title of the work from the work variant
 * @param item
 * @returns the title of the work
 * @category Composable/useUiHelpers
 * @example
 * ```ts
 * const title = getWorkTitleFromWorkVariant(item);
 * ```
 * @see getWorkTitleFromWorkVariant
 */
export function getAgentNameFromWorkVariation(item:MovingImageRecordContainer, activityName:String) {
    try {
        const productionEvent:Event[]|undefined = item.has_record?.has_event?.filter((i:Event) => {return i?.category == "avefi:ProductionEvent";});
        if(productionEvent) {
            const activities:Activity[]|undefined = [];
            
            productionEvent?.forEach((pe:ProductionEvent) => {
                if(pe?.has_activity) {
                    activities.push(pe?.has_activity?.filter((i) => i.category == activityName));
                }
            });
            
            if(activities) {
                const agentList: String[] = [];
                activities.forEach((i) => {
                    i[0]?.has_agent?.forEach((ag) => {
                        agentList.push(ag?.has_name);}
                    );
                });
                return agentList?.join('; ');
            }
        }
    }
    catch(ex) {
        console.error(ex);
    }
    return null;
}

/**
 * mainly used by disambiguation
 */

export function disam_getCastMembers(item:MovingImageRecordContainer, activityName:String) {
    try {
        const productionEvent:Event[]|undefined = item.has_record?.has_event?.filter((i:Event) => {return i?.category == "avefi:ProductionEvent";});
        if(productionEvent) {
            const activities:Activity[]|undefined = [];
            
            productionEvent?.forEach((pe:ProductionEvent) => {
                if(pe?.has_activity) {
                    activities.push(pe?.has_activity?.filter((i) => i.category == activityName));
                }
            });
            
            console.log(activities);

            if(activities) {
                const agentList: String[] = [];
                activities.forEach((i) => {
                    i[0]?.has_agent?.forEach((ag) => {
                        agentList.push(ag);}
                    );
                });
                return agentList;
            }
        }
    }
    catch(ex) {
        console.error(ex);
    }
    return null;
}