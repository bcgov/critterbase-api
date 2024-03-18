import { measurement_unit } from "@prisma/client"

interface ITaxonMeasurementQualitative {
  itis_tsn: number
  measurement_name: string
  measurement_desc?: string
  options: ITaxonMeasurementQualitativeOption[]
}

interface ITaxonMeasurementQualitativeOption {
  option_label: string
  option_value?: number
  option_desc?: string
}

interface ITaxonMeasurementQuantitative {
  taxon_measurement_id?: string
  itis_tsn: number
  measurement_name: string
  measurement_desc?: string | null
  min_value: number | null
  max_value: number | null
  unit: measurement_unit | null
}

const taxonFurColor: ITaxonMeasurementQualitativeOption[] = [
  {
    option_label: "black",
  },
  {
    option_label: "brown",
  },
  {
    option_label: "grey",
  },
  {
    option_label: "white",
  },
  {
    option_label: "orange",
  },
]

const taxonMeasurementQualitativeData: ITaxonMeasurementQualitative[] = [
  {
    itis_tsn: 179913,
    measurement_name: "fur colour (primary)",
    options: taxonFurColor,
  },
  {
    itis_tsn: 179913,
    measurement_name: "fur colour (secondary)",
    options: taxonFurColor,
  },
  {
    itis_tsn: 174371,
    measurement_name: "life stage",
    options: [
      {
        option_label: "nestling",
      },
      {
        option_label: "fledgling",
      },
      {
        option_label: "hatch year (HY)",
      },
      {
        option_label: "after hatch year (AHY)",
      },
    ],
  },
  {
    itis_tsn: 180692,
    measurement_name: "antler configuration",
    options: [
      {
        option_label: "less than 3 points",
      },
      {
        option_label: "more than 3 points",
      },
    ],
  },
  {
    itis_tsn: 202423,
    measurement_name: "sex",
    options: [
      {
        option_label: "male",
      },
      {
        option_label: "female",
      },
    ],
  },
]

const taxonMeasurementQuantitativeData: ITaxonMeasurementQuantitative[] = [
  {
    itis_tsn: 331030,
    measurement_name: "skull length",
    min_value: 0,
    max_value: 10000,
    unit: measurement_unit.centimeter,
  },
  {
    itis_tsn: 331030,
    measurement_name: "skull width",
    min_value: 0,
    max_value: 10000,
    unit: measurement_unit.centimeter,
  },
  {
    itis_tsn: 914181,
    measurement_name: "neck girth",
    min_value: 0,
    max_value: 10000,
    unit: measurement_unit.centimeter,
  },
  {
    itis_tsn: 914181,
    measurement_name: "neck length",
    min_value: 0,
    max_value: 10000,
    unit: measurement_unit.centimeter,
  },
  {
    itis_tsn: 180135,
    measurement_name: "nest height",
    min_value: 0,
    max_value: 10000,
    unit: measurement_unit.centimeter,
  },
  {
    itis_tsn: 173747,
    measurement_name: "snout-vent length",
    min_value: 0,
    max_value: 10000,
    unit: measurement_unit.millimeter,
  },
  {
    itis_tsn: 173747,
    measurement_name: "body length",
    min_value: 0,
    max_value: 10000,
    unit: measurement_unit.millimeter,
  },
  {
    itis_tsn: 173747,
    measurement_name: "body mass",
    min_value: 0,
    max_value: 10000,
    unit: measurement_unit.gram,
  },
  {
    itis_tsn: 202422,
    measurement_name: "Diameter at breast height (DBH)",
    min_value: 0,
    max_value: 10000,
    unit: measurement_unit.centimeter,
  },
  {
    itis_tsn: 179913,
    measurement_name: "baculum length",
    min_value: 0,
    max_value: 10000,
    unit: measurement_unit.centimeter,
    measurement_desc:
      "The length of the baculum bone, measured from start to end.",
  },
  {
    itis_tsn: 179913,
    measurement_name: "chest girth",
    min_value: 0,
    max_value: 10000,
    unit: measurement_unit.centimeter,
    measurement_desc:
      "The circumference of the chest, measured at the largest point.",
  },
  {
    itis_tsn: 179913,
    measurement_name: "abdomen girth",
    min_value: 0,
    max_value: 10000,
    unit: measurement_unit.centimeter,
    measurement_desc:
      "The circumference of the abdomen, measured at the largest point.",
  },
  {
    itis_tsn: 179913,
    measurement_name: "canine length",
    min_value: 0,
    max_value: 10000,
    unit: measurement_unit.centimeter,
  },
  {
    itis_tsn: 179913,
    measurement_name: "canine width",
    min_value: 0,
    max_value: 10000,
    unit: measurement_unit.centimeter,
  },
  {
    itis_tsn: 179913,
    measurement_name: "ear length",
    min_value: 0,
    max_value: 10000,
    unit: measurement_unit.centimeter,
  },
  {
    itis_tsn: 179913,
    measurement_name: "forearm length",
    min_value: 0,
    max_value: 10000,
    unit: measurement_unit.centimeter,
  },
  {
    itis_tsn: 179913,
    measurement_name: "hind leg length",
    min_value: 0,
    max_value: 10000,
    unit: measurement_unit.centimeter,
  },
  {
    itis_tsn: 179913,
    measurement_name: "foot length",
    min_value: 0,
    max_value: 10000,
    unit: measurement_unit.centimeter,
  },
  {
    itis_tsn: 179913,
    measurement_name: "paw length",
    min_value: 0,
    max_value: 10000,
    unit: measurement_unit.centimeter,
  },
  {
    itis_tsn: 179913,
    measurement_name: "paw width",
    min_value: 0,
    max_value: 10000,
    unit: measurement_unit.centimeter,
  },
  {
    itis_tsn: 179913,
    measurement_name: "foot width",
    min_value: 0,
    max_value: 10000,
    unit: measurement_unit.centimeter,
  },
  {
    itis_tsn: 179913,
    measurement_name: "hallux length",
    min_value: 0,
    max_value: 10000,
    unit: measurement_unit.centimeter,
    measurement_desc:
      "The length of the hallux, or big toe, measured from start to end.",
  },
  {
    itis_tsn: 179913,
    measurement_name: "nipple length",
    min_value: 0,
    max_value: 10000,
    unit: measurement_unit.centimeter,
  },
  {
    itis_tsn: 179913,
    measurement_name: "shoulder height",
    min_value: 0,
    max_value: 10000,
    unit: measurement_unit.centimeter,
  },
  {
    itis_tsn: 179913,
    measurement_name: "shoulder width",
    min_value: 0,
    max_value: 10000,
    unit: measurement_unit.centimeter,
  },
  {
    itis_tsn: 179913,
    measurement_name: "body length",
    min_value: 0,
    max_value: 10000,
    unit: measurement_unit.centimeter,
  },
  {
    itis_tsn: 179913,
    measurement_name: "body mass",
    min_value: 0,
    max_value: 10000,
    unit: measurement_unit.kilogram,
  },
  {
    itis_tsn: 174371,
    measurement_name: "cere depth",
    min_value: 0,
    max_value: 10000,
    unit: measurement_unit.centimeter,
  },
  {
    itis_tsn: 174371,
    measurement_name: "culmen length",
    min_value: 0,
    max_value: 10000,
    unit: measurement_unit.centimeter,
  },
  {
    itis_tsn: 174371,
    measurement_name: "culmen width",
    min_value: 0,
    max_value: 10000,
    unit: measurement_unit.centimeter,
  },
  {
    itis_tsn: 174371,
    measurement_name: "nest diameter (inner)",
    min_value: 0,
    max_value: 10000,
    unit: measurement_unit.centimeter,
  },
  {
    itis_tsn: 174371,
    measurement_name: "nest diameter (outer)",
    min_value: 0,
    max_value: 10000,
    unit: measurement_unit.centimeter,
  },
  {
    itis_tsn: 174371,
    measurement_name: "cavity opening diameter",
    min_value: 0,
    max_value: 10000,
    unit: measurement_unit.centimeter,
  },
  {
    itis_tsn: 174371,
    measurement_name: "nest height",
    min_value: 0,
    max_value: 10000,
    unit: measurement_unit.centimeter,
  },
  {
    itis_tsn: 174371,
    measurement_name: "body mass",
    min_value: 0,
    max_value: 10000,
    unit: measurement_unit.gram,
  },
  {
    itis_tsn: 174371,
    measurement_name: "tarsus length",
    min_value: 0,
    max_value: 10000,
    unit: measurement_unit.millimeter,
  },
  {
    itis_tsn: 174371,
    measurement_name: "tarsus width",
    min_value: 0,
    max_value: 10000,
    unit: measurement_unit.millimeter,
  },
  {
    itis_tsn: 174371,
    measurement_name: "wing chord",
    min_value: 0,
    max_value: 10000,
    unit: measurement_unit.millimeter,
  },
  {
    itis_tsn: 180692,
    measurement_name: "antler point count",
    min_value: 0,
    max_value: 10000,
    unit: null,
  },
  {
    itis_tsn: 202423,
    measurement_name: "age",
    min_value: 0,
    max_value: 10000,
    unit: null,
    measurement_desc: "The number of years that the animal has been alive for",
  },
  {
    itis_tsn: 202423,
    measurement_name: "offspring count",
    min_value: 0,
    max_value: 10000,
    unit: null,
  },
  {
    itis_tsn: 202423,
    measurement_name: "tail length",
    min_value: 0,
    max_value: 10000,
    unit: measurement_unit.centimeter,
  },
]

export { taxonMeasurementQualitativeData, taxonMeasurementQuantitativeData }
