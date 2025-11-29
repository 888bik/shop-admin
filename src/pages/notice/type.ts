export interface INoticeItem {
  id: number;
  title: string;
  content: string;
  order: number;
  createTime: string;
  updateTime: string;
}
export interface INoticeData {
  list: INoticeItem[];
  totalCount: number;
}

export interface RuleFormNotice {
  title: string;
  content: string;
}
