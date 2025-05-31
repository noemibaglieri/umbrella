import { useEffect, useState } from "react";
import { Col, Container, Form, Row } from "react-bootstrap";

const Home = () => {
  const [query, setQuery] = useState("");
  const [lat, setLat] = useState("");
  const [lon, setLon] = useState("");

  // needed to getWeather
  const weatherKey = "9de6e6099eefb54cafae8b61e9396a55";
  const proxy = "https://cors-anywhere.herokuapp.com/";

  const getLatAndLon = async () => {
    try {
      let response = await fetch(`https://cors-anywhere.herokuapp.com/http://api.openweathermap.org/geo/1.0/direct?q=${query}&limit=1&appid=${weatherKey}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (response.ok) {
        const geoApi = await response.json();
        const lat = geoApi[0]?.lat;
        const lon = geoApi[0]?.lon;

        setLat(lat);
        setLon(lon);
      }

      console.log(lat, lon);
      const url = `https://cors-anywhere.herokuapp.com/https://api.openweathermap.org/data/2.5/weather?${lat}&${lon}&appid=${weatherKey}`;

      console.log(url + weatherKey);
      let response2 = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      console.log(response2);
    } catch (error) {
      console.log(error);
    }
  };

  /* const getWeather = async () => {
    try {
      let response = await fetch(proxy + url + weatherKey, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (response.ok) {
        let getWeather = await response.json();
        setWeather(getWeather);
      } else {
        throw new Error("E invece no");
      }
    } catch (error) {
      console.log(error);
    }
  }; */

  useEffect(() => {
    getLatAndLon();
    //getWeather();
  }, [query]);

  return (
    <>
      <Container className="bg-body-tertiary rounded-4 p-5">
        <Row className="justify-content-center mt-5">
          <Col md={6}>
            <h1>Do you need an umbrella?</h1>
            <Form.Control type="text" placeholder="Find out by typing a city" value={query} onChange={(e) => setQuery(e.target.value.toLowerCase())} />
          </Col>
        </Row>
        <Row className="justify-content-center mt-5">
          <Col md={6}>
            <h1></h1>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default Home;
