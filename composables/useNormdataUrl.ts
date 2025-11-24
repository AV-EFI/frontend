export function useNormdataUrl() {
  function getNormdataUrl(category: string, id: string): string {
    if (category === 'avefi:GNDResource') {
      return `https://explore.gnd.network/gnd/${id}`
    } else if (category === 'avefi:VIAFResource') {
      return `https://viaf.org/viaf/${id}`
    } else if (category === 'avefi:WikidataResource') {
      return `https://www.wikidata.org/wiki/${id}`
    } else if (category === 'avefi:FilmportalResource') {
      return `https://www.filmportal.de/${id}`
    } else if (category === 'avefi:DOIResource') {
      return `https://doi.org/${id}`
    } else if (category === 'avefi:EIDRResource') {
      return `https://ui.eidr.org/view/content?id=${id}`
    } else if (category === 'avefi:TGNResource') {
      return `http://vocab.getty.edu/page/tgn/${id}`
    }
    
    // Fallback: return the ID as-is (might be a full URL already)
    return id
  }

  return {
    getNormdataUrl
  }
}
