export const environment = {
  envName: 'SH Musik Player',
  production: true,
  serverUrl: 'http://192.168.0.224/php',
  wssUrl: 'ws://192.168.0.224:9090',
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
  },
  {
    id: 'new',
    label: 'New',
    active: true
  },
  {
    id: 'xmas',
    label: 'X-Mas',
    active: false
  }]
};
