import { ApiResponse } from "./api.types";

export interface Blog{
  id: number;
  title: string;
}

export interface FullBlog extends Blog{
  author_id: number;
  content: string;
  file_id: number | null;
  file_url: string | null;
  signed_url: string | null;
}

export interface BlogPayload{
  title: string;
  content: string;
  fileId: number;
}

export interface CreateBlogPayload extends BlogPayload{
  authorId: number;
}

export interface UpdateBlogPayload extends BlogPayload{
  id: number;
}

export interface AllBlogs {
  blogs: FullBlog[];
  pagination: {
    totalCount: number;
    currentPage: number;
    totalPages: number;
  }
}

export interface AllBlogsApiResponse extends ApiResponse<AllBlogs> { };
export interface SingleBlogApiResponse extends ApiResponse<FullBlog> { };
