export abstract class ShareResponseDto{
    public version: string = 'v1';
    public status: number;
    public message: string;
    public data?: Object;
    public exception?: string;
    public page?: number;
    public pageSize?: number;
    public sortBy?: string;
    public sortValue?: string;
    public searchBy?: Object;
}