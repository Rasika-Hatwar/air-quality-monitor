import { useEffect, useState } from "react";
import { LineChart, XAxis, YAxis, Line, BarChart, Bar } from "recharts";
import moment from "moment";
import { getBadge } from "../../data/utils";
import "./Dashboard.scss";

export default function Dashboard() {
  const WS_BASE_URL = "wss://city-ws.herokuapp.com/";
  const [aqiData] = useState({});
  const [compareData, setCompareData] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [showDashboard, setShowDashboard] = useState(false);

  useEffect(() => {
    const socket = new WebSocket(WS_BASE_URL);
    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setCompareData(data);
      data.forEach((item) => {
        aqiData[item.city] = item.aqi;
        if (item.city === "Pune") {
          setChartData((currentData) => [
            ...currentData,
            {
              currentTime: moment(Date.now()).format("hh:mm:ss a"),
              aqi: item.aqi,
            },
          ]);
        }
      });
      setShowDashboard(true);
    };
    return () => {
      socket.close();
    };
  }, []);

  const renderTable = () => {
    return Object.keys(aqiData).map((item) => {
      let aqi = aqiData[item].toFixed(2);
      return (
        <tr key={item}>
          <td>{item}</td>
          <td className={getBadge(aqi)}>{aqi}</td>
          <td>{moment(Date.now()).format("hh:mm:ss a")}</td>
        </tr>
      );
    });
  };

  return (
    <>
      {showDashboard && (
        <div className="dashboard">
          <div className="top-section">
            <div>
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

            <div>
              <LineChart width={700} height={400} data={chartData}>
                <XAxis
                  dataKey={"currentTime"}
                  label={{
                    value: "Pune City - Live AQI",
                    position: "top",
                    offset: 200,
                  }}
                  stroke="black"
                />
                <YAxis stroke="black" domain={[200, 230]} />
                <Line dataKey="aqi" stroke="white" />
              </LineChart>
            </div>
          </div>
          <div className="bottom-section">
            <div>
              <BarChart width={1000} height={300} data={compareData}>
                <XAxis dataKey="city" />
                <YAxis dataKey="aqi" />
                <Bar dataKey="aqi" fill="white" />
              </BarChart>
            </div>
          </div>
        </div>
      )}
      {!showDashboard && <h1>Clear Skies... Better Lives... </h1>}
    </>
  );
}
