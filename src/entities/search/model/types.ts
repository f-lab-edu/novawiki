export type SearchGroup<T> = {
  docs: T[];
  total: number;
};

export type SearchResponse<T> = {
  title: SearchGroup<T>;
  content: SearchGroup<T>;
};
