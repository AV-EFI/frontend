import { safeHref } from '~/utils/safeUrl';

export function useNormdataUrl() {
  function getNormdataUrl(category: string, id: string): string {

    if (category === 'avefi:GNDResource') {
      return `https://explore.gnd.network/gnd/${id}`;
    } else if (category === 'avefi:VIAFResource') {
      return `https://viaf.org/viaf/${id}`;
    } else if (category === 'avefi:WikidataResource') {
      return `https://www.wikidata.org/wiki/${id}`;
    } else if (category === 'avefi:FilmportalResource') {
      return `https://www.filmportal.de/${id}`;
    } else if (category === 'avefi:DOIResource') {
      return `https://doi.org/${id}`;
    } else if (category === 'avefi:EIDRResource') {
      return `https://ui.eidr.org/view/content?id=${id}`;
    } else if (category === 'avefi:TGNResource') {
      return `http://vocab.getty.edu/page/tgn/${id}`;
    } else if (category === 'avefi:ISNIResource') {
      return `https://isni.org/isni/${id}`;
    } else if (category === 'avefi:AVefiResource') {
      return `https://hdl.handle.net/${id}`;
    } else if (category === 'avefi:URL') {
      if (/^https?:\/\//i.test(id)) return id;
      return `https://www.av-efi.net/res/21.11155/${id}`;
    }
    
    // Fallback: the ID may already be a full URL; anything with an unsafe scheme is dropped
    return safeHref(id) ?? '';
  }

  return {
    getNormdataUrl
  };
}
