export interface FilterProductStore{
  filters:string[],
  addFilter:(filter:string)=>void
  removeFilter:(filter:string)=>void
}