export interface ApiResponse < T = any > {
  success: string;
  message: string;
  data: T;
}
