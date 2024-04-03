// export const Environment = {
//   BASE_URL: "http://10.153.3.22:8441/",
//   USER : 'user',
//   PASSWORD : 'password',
//   TOKEN : 'token'

// }
export const Environment = {
  BASE_URL: window["env"]["api"],
  USER : 'user',
  PASSWORD : 'password',
  TOKEN : 'token'

}