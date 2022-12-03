export interface HttpResponse {
  statusCode: number;
  body;
}

export interface HttpRequest {
  body?;
  headers?: any;
  params?: any;
  accountId?: string;
}
