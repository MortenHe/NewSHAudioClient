export const environment = {
  production: false,
  serverUrl: 'http://localhost:9090',
  //serverUrl: 'http://132.230.25.79',
  wssUrl: 'ws://localhost:9090',
  //wssUrl: 'ws://132.230.25.79:9090',
  modes: [{
    id: 'sh',
    label: 'SH',
    active: true
  },
  {
    id: 'mh',
    label: 'MH',
    active: true
  },
  {
    id: 'kids',
    label: 'Kids',
    active: true
  }]
};