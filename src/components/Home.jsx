import { useState } from "react";
import { Button, Col, Container, Form, Row } from "react-bootstrap";

const Home = () => {
  const [query, setQuery] = useState("");
  const [weather, setWeather] = useState("");
  const [celsius, setCelsius] = useState("");
  const [icon, setIcon] = useState("");
  const [description, setDescription] = useState("");
  const [maxTemp, setMaxTemp] = useState("");
  const [minTemp, setMinTemp] = useState("");
  const [himidity, setHumidity] = useState("");

  const weatherKey = "9de6e6099eefb54cafae8b61e9396a55";
  const proxy = "https://cors-anywhere.herokuapp.com/";

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
        const lat = result[0]?.lat;
        const lon = result[0]?.lon;
        let response2 = await fetch(`${proxy}https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${weatherKey}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (response2.ok) {
          const weatherApi = await response2.json();
          setWeather(weatherApi);
          console.log(weatherApi);

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

          const iconId = weatherApi.weather[0].icon;
          const weatherImage = `https://openweathermap.org/img/w/${iconId}.png`;
          setIcon(weatherImage);

          const weatherDesc = weatherApi.weather[0].description;
          setDescription(weatherDesc);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <Container className="bg-body-tertiary rounded-4 p-5 text-center">
        <Row className="justify-content-center mt-5">
          <Col md={6}>
            <h1>Do you need an umbrella?</h1>
            <Container className="d-flex justify-content-center gap-3">
              <Form.Control className="w-50" type="text" placeholder="Find out by typing a city" onChange={(e) => setQuery(e.target.value.toLowerCase())} />
              <Button type="button" variant="success" onClick={() => getLatAndLon()}>
                Go!
              </Button>
            </Container>
          </Col>
        </Row>
        <Row className="justify-content-center mt-5">
          <Col md={6}>
            <h1>{weather.name}</h1>
            {icon && <img src={icon} alt="weather icon" width={100} />}
            {celsius && <p className="display-6">{celsius + "°"}</p>}
            <p>{description}</p>
            {description &&
              (description.includes("rain") || description.includes("drizzle") ? (
                <p>ombrello needed bro</p>
              ) : (
                <p>e anche oggi niente ombrello che culo fra oh</p>
              ))}
          </Col>
        </Row>
        <Row className="justify-content-center">
          <Col md={2} className="p-2 bg-success rounded-5 justify-content-center">
            <span>{maxTemp} - </span>
            <span>{minTemp} - </span>
            <span>{himidity}</span>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default Home;
