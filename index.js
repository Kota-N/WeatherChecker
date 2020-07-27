require('dotenv').config();
const https = require('https');
const express = require('express');
const app = express();

app.use(express.static('public'));
app.set('view engine', 'ejs');
app.set('views', 'public/views');
app.use(express.urlencoded({ extended: false }));

app.get('/', (req, res) => {
  res.render('index', {
    country: '',
    city: '',
    weather: '',
    temp: '',
    feels_like: '',
  });
});

app.post('/', (req, res) => {
  const letterNumber = /^[0-9A-Za-z\s\-]+$/;
  const inputValue = req.body.cityName.trim();

  if (inputValue.match(letterNumber)) {
    let url =
      'https://api.openweathermap.org/data/2.5/weather?units=metric&q=' +
      inputValue +
      '&appid=' +
      process.env.ID_STRING;

    https.get(url, response => {
      response.on('data', async data => {
        const weatherData = await JSON.parse(data);
        if (weatherData.cod !== '404') {
          const country = weatherData.sys.country;
          const city = weatherData.name;
          const weather = weatherData.weather[0].description;
          const temp = Math.round(weatherData.main.temp * 10) / 10;
          const feelsLike = Math.round(weatherData.main.feels_like * 10) / 10;
          const tempF =
            Math.round((weatherData.main.temp * 1.8 + 32) * 10) / 10;
          const feelsLikeF =
            Math.round((weatherData.main.feels_like * 1.8 + 32) * 10) / 10;
          const iconId = weatherData.weather[0].icon;
          const icon =
            '<img src=http://openweathermap.org/img/wn/' + iconId + '@2x.png>';
          return res.render('result', {
            country: country,
            city: city,
            weather: weather,
            temp: temp.toFixed(1),
            feels_like: feelsLike.toFixed(1),
            tempF: tempF.toFixed(1),
            feels_likeF: feelsLikeF.toFixed(1),
            icon: icon,
          });
        } else {
          return res.redirect('/');
        }
      });
    });
  } else {
    return res.redirect('/');
  }
});

app.listen(process.env.PORT, () => {
  console.log('Server is running on port ' + process.env.PORT);
});
