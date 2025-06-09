import { Col, Row } from "react-bootstrap";

const WeatherCard = (props) => {
  const setWeatherIcon = (description) => {
    switch (true) {
      case description.includes("clear"):
        return "./src/images/sun.png";
      case description.includes("few clouds"):
        return "./src/images/cloudy.png";
      case description.includes("scattered clouds") || description.includes("broken clouds") || description.includes("overcast"):
        return "./src/images/clouds.png";
      case description.includes("rain"):
        return "./src/images/rain.png";
      case description.includes("thunderstorm"):
        return "./src/images/thunder.png";
      case description.includes("snow") || description.includes("mist"):
        return "./src/images/snow.png";
      default:
        return null;
    }
  };

  return (
    <Col md={`${!props.compact ? 4 : 0}`} className={`rounded-4 p-3 ${!props.compact && "bg-card"}`}>
      {!props.compact ? <h1 className="mb-5">{props.weather + ", " + props.country}</h1> : <h1 className="mb-5 fs-6">{props.weather}</h1>}
      <img className="mb-5" src={setWeatherIcon(props.description)} alt="weather icon" width={`${!props.compact ? 200 : 50}`} />
      {props.celsius && <p className={`mb-0 fw-bold ${!props.compact ? " font-size-celsius" : "fs-6"} `}>{props.celsius + "°"}</p>}
      {!props.compact && <p>{props.description}</p>}
    </Col>
  );
};

export default WeatherCard;
