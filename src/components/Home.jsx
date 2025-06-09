import { useEffect, useState } from "react";
import { Button, Col, Container, Form, Row } from "react-bootstrap";
import WeatherCard from "./WeatherCard";

const Home = () => {
  const [query, setQuery] = useState("");
  const [weather, setWeather] = useState("");
  const [celsius, setCelsius] = useState("");
  const [description, setDescription] = useState("");
  const [maxTemp, setMaxTemp] = useState("");
  const [minTemp, setMinTemp] = useState("");
  const [humidity, setHumidity] = useState("");
  const [forecast, setForecast] = useState("");
  const [forecastDays, setForecastDays] = useState([]);

  const weatherKey = "9de6e6099eefb54cafae8b61e9396a55";
  const proxy = "https://cors-anywhere.herokuapp.com/";

  const convertFromKelvin = (temp) => {
    return Math.round(temp - 273.15);
  };

  const getLatAndLon = async () => {
    try {
      let response = await fetch(`${proxy}http://api.openweathermap.org/geo/1.0/direct?q=${query}&limit=1&appid=${weatherKey}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (response.ok) {
        const result = await response.json();
        const lat = result[0].lat;
        const lon = result[0].lon;
        let response2 = await fetch(`${proxy}https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${weatherKey}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (response2.ok) {
          const weatherApi = await response2.json();
          setWeather(weatherApi);

          const convertFromKelvin = 273.15;

          const temp = weatherApi.main.temp;
          const celsius = temp - convertFromKelvin;
          setCelsius(Math.round(celsius));

          const tempMax = weatherApi.main.temp_max;
          const tempMin = weatherApi.main.temp_min;
          const convertedMax = tempMax - convertFromKelvin;
          const convertedMin = tempMin - convertFromKelvin;
          setMaxTemp(Math.round(convertedMax));
          setMinTemp(Math.round(convertedMin));

          const humidity = weatherApi.main.humidity;
          setHumidity(humidity);

          const weatherDesc = weatherApi.weather[0].description;
          setDescription(weatherDesc);

          let response3 = await fetch(`${proxy}https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${weatherKey}`);
          if (response3.ok) {
            const forecastApi = await response3.json();
            setForecast(forecastApi);
          }
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  const changeBgColor = () => {
    switch (true) {
      case description.includes("clear"):
        return "bg-sunny";
      case description.includes("few clouds"):
        return "bg-few-clouds";
      case description.includes("scattered clouds") || description.includes("broken clouds"):
        return "bg-cloudy";
      case description.includes("rain") || description.includes("overcast"):
        return "bg-rainy";
      case description.includes("thunderstorm"):
        return "bg-thunderstorm";
      case description.includes("snow") || description.includes("mist"):
        return "bg-snow";
      default:
        return "bg-default";
    }
  };

  const setWeatherDate = () => {
    const items = [];
    if (!forecast.list) return;
    for (let i = 0; i < forecast.list.length; i++) {
      const item = forecast.list[i];
      const date = new Date(item.dt_txt);
      const day = date.getDate();
      const a = new Date();
      const today = a.getDate();

      if (
        !items
          .map((currentItem) => {
            const currentItemDate = new Date(currentItem.dt_txt);
            const currentItemDay = currentItemDate.getDate();
            return currentItemDay;
          })
          .find((currentDay) => currentDay === day) &&
        day != today
      ) {
        items.push(item);
      }
    }

    setForecastDays(items);
  };

  const parseDate = (inputDate) => {
    const date = new Date(inputDate);

    const month = date.toLocaleString("en-GB", { month: "short" });
    const day = date.getDate();

    return `${month}, ${day}`;
  };

  useEffect(() => {
    setWeatherDate();
  }, [forecast]);

  return (
    <>
      <Container fluid className={`p-5 text-center text-white ${changeBgColor()}`} style={{ height: "100vh" }}>
        <Row className="justify-content-center">
          <Col md={6} className="mb-3">
            <h1 className="display-2 fw-semibold mb-4">Do you need an umbrella?</h1>
            <Container className="d-flex justify-content-center gap-3">
              <Form.Control className="w-50" type="text" placeholder="Find out by typing a city" onChange={(e) => setQuery(e.target.value.toLowerCase())} />
              <Button type="button" variant="outline-light" className="bg-card bg-border bg-button" onClick={() => getLatAndLon()}>
                Find out
              </Button>
            </Container>
          </Col>
        </Row>

        {weather && (
          <>
            {/* Today's weather */}
            <Row className="justify-content-center mt-3 text-white mb-3">
              <WeatherCard weather={weather.name} country={weather.sys.country} celsius={celsius} description={description} />
            </Row>

            {/* do you need an umbrella? */}
            <Row className="justify-content-center mt-3 text-white mb-3">
              <Col md={4} className="bg-card rounded-4 p-3">
                {description &&
                  (description.includes("rain") || description.includes("drizzle") ? (
                    <span className="mb-0">
                      <img className="me-3" src="./src/images/umbrelling.png" alt="umbrella" width={50} />
                      Take this, you'll need it.
                    </span>
                  ) : description.includes("overcast") ? (
                    <span className="mb-0">
                      <img className="me-3" src="./src/images/umbrelling.png" alt="umbrella" width={50} />
                      I'd bring one if I were you. Just to be sure.
                    </span>
                  ) : (
                    <span className="mb-0">
                      <img className="me-3" src="./src/images/umbrellant.png" alt="umbrella" width={50} />
                      No umbrella needed! It's all sunshine and vibes.
                    </span>
                  ))}
              </Col>
            </Row>

            {/* more info about today's weather */}
            <Row className="justify-content-center">
              <Col md={4} className="p-3 bg-card rounded-4 justify-content-center">
                <Row md={3}>
                  <Col>
                    <span>
                      <img src="./src/images/hot.png" alt="high-temp" width={20} />
                    </span>
                    <span className="text-uppercase font-size-desc">max temp</span>
                    <p className="mb-0 font-size-bigger">{maxTemp}°</p>
                  </Col>
                  <Col>
                    <span>
                      <img src="./src/images/cold.png" alt="low-temp" width={20} />
                    </span>
                    <span className="text-uppercase  font-size-desc">min temp</span>
                    <p className="mb-0 font-size-bigger">{minTemp}°</p>
                  </Col>
                  <Col>
                    <span>
                      <img src="./src/images/humidity.png" alt="humidity" width={20} />
                    </span>
                    <span className="text-uppercase  font-size-desc">humidity </span>
                    <p className="mb-0 font-size-bigger">{humidity}%</p>
                  </Col>
                </Row>
              </Col>
            </Row>

            {/* forecast weather */}
            <Row className="justify-content-center mt-3">
              <Col md={4} className="p-3 bg-card rounded-4 justify-content-center">
                <Row md={5}>
                  {forecast && (
                    <>
                      {forecastDays.map((day) => {
                        return (
                          <WeatherCard
                            compact={true}
                            weather={parseDate(day.dt_txt)}
                            description={day.weather[0].description}
                            celsius={convertFromKelvin(day.main.temp)}
                          />
                        );
                      })}
                    </>
                  )}
                </Row>
              </Col>
            </Row>
          </>
        )}
      </Container>
    </>
  );
};

export default Home;
