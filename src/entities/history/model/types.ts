export type HistoryType = {
  id: number;
  version: number;
  content: string;
  comment: string;
  created_at: string;
  profile?: {
    nick: string;
  };
};
