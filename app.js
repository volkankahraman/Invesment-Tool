const rp = require('request-promise');
var CronJob = require('cron').CronJob;

const api = 'b4fee630-2e72-4a90-9ff0-cf91d392c6f6';

var TronTry;


const requestOptions = {
  method: 'GET',
  uri: 'https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest',
  qs: {
    'start': '11',
    'limit': '1',
    'convert': 'TRY'
  },
  headers: {
    'X-CMC_PRO_API_KEY': api
  },
  json: true,
  gzip: true
};

rp(requestOptions).then(response => {
    TronTry = response.data[0].quote.TRY.price;
    console.log("Yatırım Değeri 1256 Tron Tl Karşılığı : "+ 1256* TronTry.toFixed(2)+' Tldir');

}).catch((err) => {
  console.log('API call error:', err.message);
});


new CronJob('5 * * * * *', function() {
  console.log('You will see this message every second');
}, null, true, 'America/Los_Angeles');