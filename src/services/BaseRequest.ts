export type BaseGetRequest = {
  isSort: boolean,
  isDescending: boolean,
  isPaging: boolean,
  pageNumber: number,
  pageLimitItem: number,
  orderBy: string,
}