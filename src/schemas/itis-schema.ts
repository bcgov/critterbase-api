/**
 * ITIS hierarchy response returns TSN as a string.
 * Default type param to cast TSN to a number if needed. Defaults to string.
 *
 */
export interface IItisHierarchy<TsnType extends string | number = string> {
  author: string | null;
  class: string;
  parentName: string;
  parentTsn: string;
  rankName: string;
  taxonName: string;
  tsn: TsnType;
}

export interface IItisGetFullHierarchyResponse<
  TsnType extends string | number = string,
> {
  author: string;
  class: string;
  hierarchyList: IItisHierarchy<TsnType>[];
  rankName: string;
  sciName: string;
  tsn: string;
}

export interface IItisTsnStub {
  tsn: string;
}

export interface IItisSolrStub<TsnType extends string | number = string> {
  response: {
    numFound: number;
    docs: { tsn: TsnType; nameWOInd: string; hierarchyTSN: string[] }[];
  };
}

export interface IItisProperties {
  itis_tsn: number;
  itis_scientific_name: string;
}