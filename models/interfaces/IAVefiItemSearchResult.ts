export interface IAVefiItemSearchResult {
    handle: string;
    category: string;
    has_title: string;

    //Produktionsjahr
    //from workvariant has_record.has_date
    has_date: string;

    //calc from has_date string for faceting
    has_date_min: number;
    has_date_max: number;

    //form workvariant has_record.has_event.has_activity.has_agent.has_name + DirectingActivity
    has_director: string[];

    //form workvariant has_record.has_event.has_activity.has_agent.has_name + ProducingActivity
    has_producer: string[];

    //skip manifestation?
    //constructed from item -> manifestation -> workvariant
    is_item_of_workvariant_id: string;

    //facets
    //Schlagwörter
    //has_record.has_subject.category
    has_subject: string[];

    //Herausgebende Institution / Herausgeber
    //from workvariant --> has_record.described_by.has_issuer_name
    has_issuer_name: string;

    //Produktionsort
    //from workvariant --> has_record.has_event.located_in.has_name
    located_in: string[];

    //Materialart
    //has_record.has_format.category
    has_format_category: string;

    //Manifestationstyp
    
    //Materialformat (z.B. 35mm)
    //has_record.has_format.type
    has_format_type: string;

    //Länge in Metern/Dauer in Minuten    
    //has_record.has_duration.has_value
    has_duration: string;

    //Sprachangaben
    //has_record.in_language.code
    in_language: string[];

    //Ton
    //has_record.has_sound_type
    has_sound_type: string;

}