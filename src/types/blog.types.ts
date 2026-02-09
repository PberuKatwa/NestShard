import { ApiResponse } from "./api.types";

export interface Blog{
  id: number;
  title: string;
  author_id: number;
  content: string;
  image_url: string;
}

export interface BlogPayload{
  id?:number|null;
  title: string;
  authorId?: number|null;
  content: string;
  fileId: number;
}

export interface CreateBlogPayload extends BlogPayload{
  title: string;
  content: string;
  fileId: number;
}

export inte

export interface AllBlogs {
  blogs: Blog[];
  pagination: {
    totalCount: number;
    currentPage: number;
    totalPages: number;
  }
}

export interface AllBlogsApiResponse extends ApiResponse<AllBlogs> { };
export interface SingleBlogApiResponse extends ApiResponse<Blog> { };
