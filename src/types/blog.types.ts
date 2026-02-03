export interface Blog{
  id: number;
  title: string;
  author_id: number;
  content: string;
  image_url: string;
}

export interface BlogPayload{
  title: string;
  authorId: number;
  content: string;
}

export interface AllBlogs {
  blogs: Blog[];
  pagination: {
    totalCount: number;
    currentPage: number;
    totalPages: number;
  }
}
