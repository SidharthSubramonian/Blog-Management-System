
export interface User {
  id: string;
  name: string;
  email: string;
  image?: string;
  bio?: string;
  createdAt: Date;
}

export interface Blog {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  slug: string;
  coverImage?: string;
  publishedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
  authorId: string;
  author: User;
  tags: string[];
  commentCount: number;
  viewCount: number;
  featured: boolean;
  isOriginal: boolean;
  isPending: boolean;
}

export interface Comment {
  id: string;
  content: string;
  blogId: string;
  authorId: string;
  author: User;
  createdAt: Date;
  updatedAt: Date;
}

export interface Tag {
  id: string;
  name: string;
  slug: string;
  blogCount: number;
}

export interface BlogStats {
  totalBlogs: number;
  totalViews: number;
  totalComments: number;
  publishedBlogs: number;
  draftBlogs: number;
  pendingBlogs: number;
}
