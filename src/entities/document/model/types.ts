export type DocumentType = {
  id: number;
  title: string;
  content: string;
  isBlock: boolean;
  isDisplay: boolean;
  updated_at: string;
  created_at: string;
  version: number;
  view: number;
  star: number;
  profile?: {
    nick: string;
  };
  document?: {
    title: string;
  };
};
