const http = require('http')
const fs = require('fs')
const requests = require('requests')

const homeFile = fs.readFileSync('index.html', 'utf-8')

const fahrenheitToCelsius = (fahrenheit) => Math.round(fahrenheit - 273.15)

const replacecVal = (tempVal, orgVal) => {
  let newVal = tempVal.replace(
    '{%temp%}',
    fahrenheitToCelsius(orgVal.main.temp)
  )
  newVal = newVal.replace('{%location%}', orgVal.name)
  newVal = newVal.replace('{%country%}', orgVal.sys.country)

  return newVal
}

const server = http.createServer((req, res) => {
  if (req.url == '/') {
    requests(
      'https://api.openweathermap.org/data/2.5/weather?lat=24.86&lon=66.99&appid=685ed2cfc02041a852c3e285ba16431e'
    )
      .on('data', function (chunk) {
        const objData = JSON.parse(chunk)
        const arrData = [objData]
        // console.log(arrData)

        const realTimeData = arrData
          .map((item) => replacecVal(homeFile, item))
          .join('')
        res.write(realTimeData)
      })
      .on('end', function (err) {
        if (err) return console.log('connection closed due to errors', err)
        res.end()
        console.log('end')
      })
  }
})

server.listen(8000, '127.0.0.1')
