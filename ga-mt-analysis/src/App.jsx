import { useState, useEffect } from "react";
import "./App.css";
// import data from "../../json_data_12_01_2021.json";
import data from "../../Montague-Statistics-1-26-2023.json";

function App() {
  const [count, setCount] = useState(0);
  const [countDay, setCountDay] = useState([]);
  const [listItem, setListItem] = useState([]);
  const [dateSelected, setDateSelected] = useState("2022-01-01");
  const [dateSelectedTo, setDateSelectedTo] = useState(null);
  // const [dateSelected, setDateSelected] = useState(
  //   `${new Date().getFullYear()}-0${
  //     new Date().getMonth() + 1
  //   }-${new Date().getDate()}`
  // );

  function sameDay(d1, d2) {
    return (
      d1.getFullYear() === d2.getFullYear() &&
      d1.getMonth() === d2.getMonth() &&
      d1.getUTCDate() === d2.getDate()
    );
  }

  function getMonthDayYear(date) {
    return `${new Date(date).getMonth() + 1}/${new Date(
      date
    ).getDate()}/${new Date(date).getFullYear()}`;
  }

  let webBrowser = data.filter(
    (item) =>
      item.widget != null &&
      item.widget.component === "Web browser" &&
      new Date(item.timestamp) > new Date(dateSelected) &&
      (dateSelectedTo == null
        ? new Date()
        : new Date(dateSelectedTo) > new Date(item.timestamp) ||
          sameDay(
            dateSelectedTo == null ? new Date() : new Date(dateSelectedTo),
            new Date(item.timestamp)
          ))
  );

  let codice = data.filter((item) => item.hasOwnProperty("code"));
  let codiceSummary = {};
  let codiceDate = {};
  codice.map((item) => {
    codiceSummary[item.code] = (codiceSummary[item.code] || 0) + 1;
    codiceDate[getMonthDayYear(item.timestamp)] =
      (codiceDate[getMonthDayYear(item.timestamp)] || 0) + 1;
  });
  console.log("code", codice.length, codiceSummary, codiceDate);
  const dataItem = () => {
    let countPages = {};
    let countPagesDate = {};
    let countDay = {};
    let result = [];
    webBrowser.map((item) => {
      let name = item.widget.name;
      // created a object with pages name and count, ex {"Entertainment": 12 }
      countPages[name] = (countPages[name] || 0) + 1;
      // created a object with pages name and date, ex {"Entertainment": "Thu Dec 14 2021" }
      countPagesDate[name] =
        new Date(countPagesDate[name]) <= new Date(item.timestamp)
          ? countPagesDate[name]
          : new Date(item.timestamp);

      // created a object with dates and count, ex {"01-01-2021": 10 }
      console.log("date1", getMonthDayYear(item.timestamp));
      countDay[getMonthDayYear(item.timestamp)] =
        (countDay[getMonthDayYear(item.timestamp)] || 0) + 1;
    });

    for (let nc in countPages) {
      for (let dc in countPagesDate) {
        if (nc === dc) {
          result.push({
            name: nc,
            count: countPages[nc],
            from: countPagesDate[dc],
          });
        }
      }
    }
    setCount(webBrowser.length);
    console.log("mc", countDay);
    setListItem(result);
    setCountDay(countDay);
  };

  function handleDateSelected(e) {
    e.preventDefault();
    setDateSelected(e.target.value);
    console.log("date", e.target.value);
  }
  function handleDateSelectedTo(e) {
    e.preventDefault();
    setDateSelectedTo(e.target.value);
    console.log("date to", e.target.value);
  }

  useEffect(() => {
    dataItem();
    setCount(webBrowser.length);
    console.log("dateSelected", dateSelected, dateSelectedTo);
  }, [dateSelected, dateSelectedTo]);

  return (
    <div className="container">
      <div className="menu">
        <h1>MT Database</h1>
        <div className="menu-2">
          <p>Events: {count}</p>
          <p>
            Select date from:{" "}
            <input
              type="date"
              id="event-calendar"
              name="event-start"
              value={dateSelected}
              min="2021-01-01"
              onChange={handleDateSelected}
            />
          </p>
          <p>
            Select date to:{" "}
            <input
              type="date"
              id="event-calendar-to"
              name="event-end"
              value={
                dateSelectedTo == null
                  ? new Date().toDateString()
                  : dateSelectedTo
              }
              min="2021-01-01"
              onChange={handleDateSelectedTo}
            />
          </p>
        </div>
      </div>
      <div className="box">
        <div className="box1">
          <table>
            <thead>
              <tr>
                <th>Web Browsers</th>
                <th># Events</th>
                <th>Dates from</th>
              </tr>
            </thead>

            <tbody>
              {listItem.map((item, index) => (
                <tr key={index}>
                  <td>{item.name}</td>
                  <td>{item.count}</td>
                  <td>{item.from.toDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="box2">
          <table>
            <thead>
              <tr>
                <th>Dates</th>
                <th># Events</th>
              </tr>
            </thead>
            <tbody>
              {Object.keys(countDay).map((key, index) => (
                <tr key={index}>
                  <td>{key}</td>
                  <td>{countDay[key]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {/* <pre>{JSON.stringify(data[0], null, 2)}</pre> */}
      </div>
    </div>
  );
}

export default App;
