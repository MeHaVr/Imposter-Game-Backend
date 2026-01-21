export type WordsType = {
  word: string;
  tips: string[];
};
export type WordSetDetail = {
  id: string;
  title: string;
  desc: string;
  words: { word: string; tips: string[] }[];
  createdAt: string;
  updatedAt: string;
};
