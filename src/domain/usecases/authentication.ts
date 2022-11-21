export interface Authentication {
  auth(emaiL: string, password: string): Promise<string>;
}
