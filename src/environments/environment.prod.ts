// export const Environment = {
//   BASE_URL: "http://10.153.3.22:8441/",
//   USER : 'user',
//   PASSWORD : 'password',
//   TOKEN : 'token'

// }
export const environment = {
  BASE_URL: window["env"]["api"],
  USER : 'user',
  PASSWORD : 'password',
  TOKEN : 'token',
  production:true,
  SECRETKEY:'1e500ac261ba47ab727d4a6cb882d3ec'

}