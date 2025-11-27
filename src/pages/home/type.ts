export interface IPanels {
  title: string;
  value: number;
  unit: string;
  unitColor: string;
  subTitle: string;
  subValue: number;
  subUnit: string;
}
export interface ITipCard {
  title: string;
  tip: string;
  tipData: ITipDataItem[];
}
export interface ITipDataItem {
  label: string;
  value: number;
}
