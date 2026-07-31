export interface CommunityGridPostNode {
  id: string;
  handle: string;
  fields: {
    key: string;
    value: string | null;
    reference: {
      image?: {
        url: string;
        altText: string | null;
        width: number;
        height: number;
      };
    } | null;
  }[];
};
export interface CommunityGridStore {
  posts: CommunityGridPostNode[];
  setPosts:(newPosts:CommunityGridPostNode[])=>void;
};