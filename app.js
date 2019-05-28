var rp = require('request-promise');
var express = require('express');
const nodeMailer = require('nodemailer');

var app = express();

var port = process.env.PORT || 8000;
app.listen(port, () => console.log(`Sunucu ${port} portunda çalışıyor!`))


const api = process.env.API;

let transporter = nodeMailer.createTransport({
  host: 'smtp.zoho.com',
  port: 465,
  secure: true, //true for 465 port, false for other ports
  auth: {
    user: process.env.EMAIL, // Mail adresi
    pass: process.env.PASSWORD
  }

});


var TronTry;

function GetDateInFormat(date) {
  return date.getDate() + "-" + (date.getMonth() + 1) + "-" + date.getFullYear() + " " + (date.getHours() < 10 ? '0' : '') + date.getHours() + ":" + (date.getMinutes() < 10 ? '0' : '') + date.getMinutes() + ":" + (date.getSeconds() < 10 ? '0' : '') + date.getSeconds();
}

function sendEmail(txtResponse) {
  let mailOptions = {
    from: 'Invesment Tool <khrmnvolkan@zoho.com>', // sender address
    to: 'khrmnvolkan@gmail.com', // list of receivers
    subject: 'Yatırım Değeri ' + GetDateInFormat(new Date()), // Subject line
    html: txtResponse // html body
  };
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
      res.send(500);
    } else {
      console.log("email gönderildi");
      console.log(info);
      res.status(200).send({
        success: true
      });
    }

  });

}


const requestOptions = {
  method: 'GET',
  uri: 'https://pro-api.coinmarketcap.com/v1/cryptocurrency/quotes/latest',
  qs: {
    'id': '1958',
    'convert': 'TRY'
  },
  headers: {
    'X-CMC_PRO_API_KEY': api
  },
  json: true,
  gzip: true
};
rp(requestOptions).then(response => {
  TronTry = Object.values(response.data)[0].quote.TRY.price * 1256;
  var txtResponse = "<h1>1256 Tron Tl Karşılığı :  " + TronTry.toFixed(2) + ' Tldir</h1>';


  app.get('/', function (req, res) {
    sendEmail(txtResponse);
    res.writeHead(200, {
      "Content-Type": "text/html; charset=utf-8"
    });
    console.log(txtResponse);
    res.write(txtResponse, 'utf8');
    res.end();
  });

}).catch((err) => {
  console.log('API call error:', err.message);
});