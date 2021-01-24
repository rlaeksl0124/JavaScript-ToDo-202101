const weather = document.querySelector(".js-weather");

const API_KEY = "df7bd1826fe6d33af6a58d529d7ebebc"; // https://openweathermap.org/ 날씨 사이트의 내 API 키값 (다른서버로부터 데이터를 가져올수있는 수단)
const COORDS = 'coords';

function getWeather(lat, lng){ // 실시간 업데이트 날씨 가져오기
    fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&appid=${API_KEY}&units=metric`// 위상단의 홈페이지 API 탭에 By geographic coordinates 부분 복사
    ).then(function(response){ // fetch의 데이터를 불러올때까지 기다렸다가 then 이후의 함수를 처리
        return response.json();
    }).then(function(json){
        const temperature = json.main.temp;
        const plase = json.name;
        weather.innerText = `${temperature}°C in ${plase}`;
    }); 
}

function saveCoords(coordsObj){
    localStorage.setItem(COORDS, JSON.stringify(coordsObj));
}

function handleGeoSucces(position){ // 내 좌표를 가져오는데 성공했을경우
    const latitude = position.coords.latitude; // console.log(position) 출력했을때 coords 안의 위도정보
    const longitude = position.coords.longitude; //console.log(position) 출력했을때 coords 안의 경도정보
    const coordsObj = {
        latitude, //latitude : latitude, 같은이름이여서 대신 앞에처럼 작성할수있음
        longitude //longitude : longitude
    };
    saveCoords(coordsObj);
    getWeather(latitude, longitude);
}

function handleGerError(){ // 좌표를 가져오는데 실패했을경우
    console.log("cant access geo location");
}


function askForCoords(){ // 나의 위치정보 좌표 가져오기 ,첫번째인자는 좌표가져왔을때 성공할때, 두번째는 좌표가져오기 실패했을때
    navigator.geolocation.getCurrentPosition(handleGeoSucces,handleGerError); 
}

function loadCoords(){
    const loadedCoords = localStorage.getItem(COORDS); //불러오기
    if(loadedCoords === null){ // 위도 경도를 불러왔을때 로컬스토리지에 불러올값이없으면 위치정보 물어봄
        askForCoords();
    } else { // 위도 경도를 불러왔을때 로컬스토리지에 저장된값이있으면 날씨정보를 가져옴
        const parsedCoords = JSON.parse(loadedCoords);
        getWeather(parsedCoords.latitude, parsedCoords.longitude);
    }
}

function init(){
    loadCoords();
}

init();