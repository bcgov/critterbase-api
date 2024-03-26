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
