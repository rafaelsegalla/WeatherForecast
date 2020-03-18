const urlListCity = "http://servicos.cptec.inpe.br/XML/listaCidades";
const templateUrlWeather = "http://servicos.cptec.inpe.br/XML/cidade/{codigo_cidade}/previsao.xml";
const weatherConditions = {
    "ec": "Encoberto com Chuvas Isoladas",
    "ci": "Chuvas Isoladas",
    "c"	: "Chuva",
    "in": "Instável",
    "pp": "Poss. de Pancadas de Chuva",
    "cm": "Chuva pela Manhã",
    "cn": "Chuva a Noite",
    "pt": "Pancadas de Chuva a Tarde",
    "pm": "Pancadas de Chuva pela Manhã",
    "np": "Nublado e Pancadas de Chuva",
    "pc": "Pancadas de Chuva",
    "pn": "Parcialmente Nublado",
    "cv": "Chuvisco",
    "ch": "Chuvoso",
    "t": "Tempestade",
    "ps": "Predomínio de Sol",
    "e": "Encoberto",
    "n": "Nublado",
    "cl": "Céu Claro",
    "nv": "Nevoeiro",
    "g": "Geada",
    "ne": "Neve",
    "nd": "Não Definido",
    "pnt": "Pancadas de Chuva a Noite",
    "psc": "Possibilidade de Chuva",
    "pcm": "Possibilidade de Chuva pela Manhã",
    "pct": "Possibilidade de Chuva a Tarde",
    "pcn": "Possibilidade de Chuva a Noite",
    "npt": "Nublado com Pancadas a Tarde",
    "npn": "Nublado com Pancadas a Noite",
    "ncn": "Nublado com Poss. de Chuva a Noite",
    "nct": "Nublado com Poss. de Chuva a Tarde",
    "ncm": "Nubl. c/ Poss. de Chuva pela Manhã",
    "npm": "Nublado com Pancadas pela Manhã",
    "npp": "Nublado com Possibilidade de Chuva",
    "vn": "Variação de Nebulosidade",
    "ct": "Chuva a Tarde",
    "ppn": "Poss. de Panc. de Chuva a Noite",
    "ppt": "Poss. de Panc. de Chuva a Tarde",
    "ppm": "Poss. de Panc. de Chuva pela Manhã"
};

const cityParameters = {
    "method": "GET",
    "url": urlListCity,
    "callback": buildCitySelect
};

ajax(cityParameters);

function ajax({method, url, callback = function e () {}}) {
    let xhttp = new XMLHttpRequest();
    xhttp.open(method, url, true);
    xhttp.send();
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4) {
            callback(xhttp.responseXML);
        }
    }
}

function buildCitySelect(xml, selectId = "selectCity") {
    let arrayCity = xml.getElementsByTagName("cidade");

    for(city in arrayCity) {
        if(typeof arrayCity[city] == 'object') {
            
            //get city attributes
            let cityId = arrayCity[city].getElementsByTagName("id")[0].childNodes[0].nodeValue;
            let cityUf = arrayCity[city].getElementsByTagName("uf")[0].childNodes[0].nodeValue;
            let cityName = arrayCity[city].getElementsByTagName("nome")[0].childNodes[0].nodeValue;
            
            //create new option with city values
            let option = document.createElement("option");
            let textOption = document.createTextNode(cityUf + " - " + cityName);
            option.setAttribute("value", cityId);
            option.appendChild(textOption);
            
            //adds the option for select
            let select = document.getElementById(selectId);
            select.appendChild(option);

        }
    }
}

function searchWeatherForecast(elementId) {
    let cityId = parseInt(document.getElementById(elementId).value);
    if(cityId > 0) {
        let url = templateUrlWeather.replace("{codigo_cidade}", cityId);
        let weatherParametes = {
            "method": "GET",
            "url": url,
            "callback": buildWeatherForecastTable
        }

        ajax(weatherParametes);
    }
}

function buildWeatherForecastTable(xml, tableSelector = "#tableWeatherForecast > tbody") {
    let arrayForecast = xml.getElementsByTagName("previsao");

    //clear table data
    let table = document.querySelector(tableSelector);
    table.innerHTML = "";

    for(forecast in arrayForecast) {
        if(typeof arrayForecast[forecast] == 'object') {

            //get forecast attributes
            let date = arrayForecast[forecast].getElementsByTagName("dia")[0].childNodes[0].nodeValue;
            date = formatDate(date);
            let weather = arrayForecast[forecast].getElementsByTagName("tempo")[0].childNodes[0].nodeValue;
            weather = weatherConditions[weather];
            let max = arrayForecast[forecast].getElementsByTagName("maxima")[0].childNodes[0].nodeValue;
            let min = arrayForecast[forecast].getElementsByTagName("minima")[0].childNodes[0].nodeValue;
            let iuv = arrayForecast[forecast].getElementsByTagName("iuv")[0].childNodes[0].nodeValue;

            //create new tr and td's
            let tr = document.createElement("tr");
            let tdDate = document.createElement("td");
            let tdWeather = document.createElement("td");
            let tdMax = document.createElement("td");
            let tdMin = document.createElement("td");
            let tdIuv = document.createElement("td");

            //creates nodetext for each attribute 
            let dateText = document.createTextNode(date);
            let weatherText = document.createTextNode(weather);
            let maxText = document.createTextNode(max + "°C");
            let minText = document.createTextNode(min + "°C");
            let iuvText = document.createTextNode(iuv);
            
            //add text to your corresponding td
            tdDate.appendChild(dateText);
            tdWeather.appendChild(weatherText);
            tdMax.appendChild(maxText);
            tdMin.appendChild(minText);
            tdIuv.appendChild(iuvText);

            //add td's to tr
            tr.appendChild(tdDate);
            tr.appendChild(tdWeather);
            tr.appendChild(tdMax);
            tr.appendChild(tdMin);
            tr.appendChild(tdIuv);

            //adds the tr to table
            table.appendChild(tr);
        }
    }
}

function formatDate(date) {
    let dateArray = date.split("-");
    return dateArray[2] + "/" +  dateArray[1] + "/" + dateArray[0];
}