import { useEffect, useState } from "react";
import "./Dashboard.scss";

export default function Dashboard() {
  const WS_BASE_URL = "wss://city-ws.herokuapp.com/";
  const [aqmData, setAqmData] = useState([]);
  const [cities, setCities] = useState({});
  //   const [aqiData, setAqiData] = useState([]);

  useEffect(() => {
    const socket = new WebSocket(WS_BASE_URL);
    socket.onopen = () => {
      console.log("connected");
    };
    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setAqmData(data);
      data.forEach((item) => {
        cities[item.city] = item.aqi;
      });
    };
    return () => socket.close();
  }, []);

  const renderTable = () => {
    return Object.keys(cities).map((item) => {
      return (
        <tr key={item}>
          <td>{item}</td>
          <td>{cities[item]}</td>
          <td>78</td>
        </tr>
      );
    });
  };

  return (
    <div className="dashboard">
      <table id="aqm-table">
        <tbody>
          <tr>
            <th>City</th>
            <th>AQI</th>
            <th>Last Updated</th>
          </tr>
          {renderTable()}
        </tbody>
      </table>
    </div>
  );
}
