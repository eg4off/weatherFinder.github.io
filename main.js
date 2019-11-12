        // По положению геолокации
          
        function getWheater(){
                if(navigator.geolocation){
                    navigator.geolocation.getCurrentPosition(function (position){
                        //  console.log(position.coords.latitude, position.coords.longitude);
                        recieveData(position.coords.latitude, position.coords.longitude);
                    })
                }else{
                    alert("Can't find your location")
                }
            }; 

            function recieveData(lat, long) {
                fetch('https://api.openweathermap.org/data/2.5/weather?lat=' + lat + '&lon='+ long +'&appid=b39bc41d2ebb7cdb7c7432343a8a764a')
                .then(function (response) {
                return response.json(); //специфика api - так получаються данніе из json
                })
                .then(function (response) {
                console.log(response)
                    document.getElementById('location').innerHTML = response.name;
                    document.getElementById('current-humidity').innerHTML = response.main.humidity + " g/m3";
                    document.getElementById('current-pressure').innerHTML = response.main.pressure + " mmHg Art.";
                    document.getElementById('current-temperature').innerHTML = response.main.temp + " K";
                    document.getElementById('current-wind-speed').innerHTML = response.wind.speed + " m/s";
                    document.getElementById('current-icon').innerHTML = response.weather[0].icon
                    document.getElementById('weather-summary').innerHTML = response.weather[0].main + ": "+response.weather[0].description;
                // return response;
                })
            };

            //Блок с вводом названия города

            var inputCity = document.getElementById('city');
            var inputedLocation = document.getElementById('inputed-location');
            // console.log(inputCity.value)
            var findButton = document.getElementById('findButton');

            findButton.disabled = false;

            function setButtonStatus() {
            findButton.disabled = !inputCity.value;
            };

            function receiveDataByCityName() {
                fetch('https://api.openweathermap.org/data/2.5/weather?q=' + inputCity.value +'&appid=b39bc41d2ebb7cdb7c7432343a8a764a')
                .then(function (response) {
                return response.json();
                })
                .then(function (response) {
                console.log(response)
                    document.getElementById('inputed-location').innerHTML = response.name;
                    document.getElementById('input-humidity').innerHTML = response.main.humidity + " g/m3";
                    document.getElementById('input-pressure').innerHTML = response.main.pressure + " mmHg Art.";
                    document.getElementById('input-temperature').innerHTML = response.main.temp + " K";
                    document.getElementById('input-wind-speed').innerHTML = response.wind.speed + " m/s";
                    document.getElementById('input-icon').innerHTML = response.weather[0].icon
                    document.getElementById('input-weather-summary').innerHTML = response.weather[0].main + ": "+response.weather[0].description;
                // return response;
                })
            };

            function validateInput(){
                if(inputCity.value ==="" || inputCity.value.length < 2 ){
                    alert("The city name must have 2 or more characters!")
                };
            };

            // function validateCity(){
            //     if(inputedLocation.value === undefined){
            //         alert("Input correct city name!")
            //     }
            // };

            // setTimeout(validateCity, 5000);

            findButton.addEventListener('click', validateInput);

            // function clearInput(){
            //     if(inputedLocation.value){
            //         inputCity.value = '';
            //     }
            // }
            // clearInput()

            inputCity.addEventListener('input', setButtonStatus);
            findButton.addEventListener('click', receiveDataByCityName);

//ПО голосовому вводу

/*
в случае если ваш браузер не поддерживает это API (SpeechRecognition), то мы можем
принудительно записать свойство SpeechRecognition в объект window , где спросим если оно есть записывай его, если нет
то используй webkitSpeechRecognition
*/
window.SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

// создаем экземпляр класса и записываем в переменную, чтобы изучить дальше
var recognition = new SpeechRecognition();
// свойство interimResults позволяем видеть промежуточные результаты поиска
recognition.interimResults = true;
// настраиваем язык распознавания (обратите внимание на формат)
recognition.lang = 'en-US';

// создаем элемент параграф, чтобы записывать в него результаты поиска
// var p = document.createElement('p');
// добираемся к DOM элементу
var words = document.querySelector('.words');
// помещаем параграф в родительский элемент
// words.appendChild(p);

var voiceValue = document.getElementById('voiceValue');
// вместе с началом работы микрофона, у нас вызывается событие result
recognition.addEventListener('result', function (event) {
  // здесь мы добираемся до нужного текста, который распознан и записываем в параграф
  voiceValue.textContent = Array
    .from(event.results)
    .map(function (results) {
      return results[0];
    })
    .map(function (results) {
      return results.transcript;
    })
    .join('');

  // специальное свойство isFinal станет true как только сделаем паузу на мгновение
  if(event.results[0].isFinal) {
    // в этом случае у нас каждое произнесенное слово будет начинаться с новой строки
    // для этого создаем новый параграф
    var p = document.createElement('p');
    // и записываем в родительский элемент
    words.appendChild(p);
  }
receiveDataByVoice();
});

// событие end вызывается как только замолкаем, но чтобы микрофон продолжал работать и
// не выключился, мы каждый раз запускаем его заново (recognition.start)
// recognition.addEventListener('end', recognition.start);
// как только загружается страница, мы запрашиваем доступ к микрофону и он слушает нашу речь
recognition.start();

function receiveDataByVoice() {
    fetch('https://api.openweathermap.org/data/2.5/weather?q=' + voiceValue.textContent +'&appid=b39bc41d2ebb7cdb7c7432343a8a764a')
    .then(function (response) {
    return response.json();
    })
    .then(function (response) {
    console.log(response)
        document.getElementById('voice-location').innerHTML = response.name;
        document.getElementById('voice-humidity').innerHTML = response.main.humidity + " g/m3";
        document.getElementById('voice-pressure').innerHTML = response.main.pressure + " mmHg Art.";
        document.getElementById('voice-temperature').innerHTML = response.main.temp + " K";
        document.getElementById('voice-wind-speed').innerHTML = response.wind.speed + " m/s";
        document.getElementById('voice-icon').innerHTML = '<img src="https://openweathermap.org/img/wn/' + response.weather[0].icon + '@2x.png>';
        document.getElementById('voice-weather-summary').innerHTML = response.weather[0].main + ": "+response.weather[0].description;
    // return response;
    })
};
