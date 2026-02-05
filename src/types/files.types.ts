export interface File {
  id: number;
  userId: number;
  fileName: string;
  fileUrl: string;
  fileSize: number; // in bytes
  mimeType: string;
  status: 'active' | 'deleted';
  createdAt: Date;
  updated_at: Date;
}
