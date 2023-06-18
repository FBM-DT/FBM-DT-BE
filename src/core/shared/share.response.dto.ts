export class ShareResponseDto {
  public version?: string;
  public status?: number;
  public message?: string;
  public data?: Object;
  public exception?: string;
  public page?: number;
  public pageSize?: number;
  public sortBy?: string;
  public sortValue?: string;
  public searchBy?: Object;
}