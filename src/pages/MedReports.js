import axios from "axios";
import Layout from "../components/Layout";
import React, { useEffect, useState, useRef } from "react";
import { Button, DatePicker, Flex } from "antd";
import dayjs from "dayjs";
import toast from "react-hot-toast";
import {
  BarChart,
  Bar,
  Rectangle,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts";

import "../MedDatePicker.css";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { userSlice } from "../redux/userSlice";
const reportHeaderImage = require("../Images/reportHeader1.png");





// Calculate the length of a month
function monthLength(month, year) {
  const thirtyOneDayMonths = [0, 2, 4, 6, 7, 9, 11];
  const thirtyDayMonths = [3, 5, 8, 10];

  let length = 31; // Default to 31 days

  if (thirtyOneDayMonths.includes(month)) {
    length = 31;
  } else if (thirtyDayMonths.includes(month)) {
    length = 30;
  } else if (month === 1) {
    // Check if a leap year or not
    // Assign the no. of dates for the month february based on that
    if ((year % 4 === 0 && year % 100 !== 0) || year % 400 === 0) {
      length = 29; // Leap year
    } else {
      length = 28; // Non-leap year
    }
  }
  return length;
}

// Range picker essentials
const { RangePicker } = DatePicker;

const disabledDate = (current) => {
  // Can not select days before today and today
  return current > dayjs().endOf("day");
};


// SSE Connection
const eventSource = new EventSource('http://localhost:5001')

function updateMessage (message) {
    console.log('Message Received: ', message);
}

eventSource.onmessage = function (event) {
    updateMessage(event.data);
}

eventSource.onerror = function () {
    updateMessage('Server closed connection');
    eventSource.close();
}




// END SSE connection


const generateMonthlyReport = () => {
const lastDate = new Date(new Date().setDate(new Date().getDate()-1));
const firstDate = new Date(lastDate.getFullYear(), 0, 1);
}


/*
*
*
Main
*
*
*/
const MedReports = () => {
  /* ============= State variables ============== */

  // Selected date range in range-picker
  const [selectedRange, setSelectedRange] = useState(null);

  // Log if the date range changed
  const [rangeChange, setRangeChange] = useState(false);

  // Selected min date
  const [minDate, setMinDate] = useState(null);

  // Selected max date
  const [maxDate, setMaxDate] = useState(null);

  // Available date objects for the selected range
  const [selectedRangeAvailableDates, setSelectedRangeAvailableDates] =
    useState(null);

  // Appointment objects for the selected range
  const [selectedRangeAppointments, setSelectedRangeAppointments] =
    useState(null);

  // Selected month objects
  const [monthObjects, setMonthObjects] = useState(null);

  // Summary data
  const [summary, setSummary] = useState(null);

  // Available date chart data
  const [availableDatesChartData, setAvailableDatesChartData] = useState([]);

  // Ref for sections 0 to 3
  const section0To3Ref = useRef(null);

  // Ref for the section 4
  const section4Ref = useRef(null);

  // Ref for the section 5
  const section5Ref = useRef(null);

  /* ============= Functions ============== */

  /*
  Set selected date range
  */
  const handleDateRangeChange = (dates) => {
    // dates is an array of moment objects representing the start and end dates
    setSelectedRange(dates);
  };

  /*
  Get available dates for the selected range
  */
  const getSelectedRangeAvailableDates = async () => {
    try {
      const response = await axios.post(
        "/api/medDoctor/medical-reports-read-all-available-dates-specific-period",
        {
          startDate: minDate,
          endDate: maxDate,
        },
        {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        }
      );

      // Log the response
      console.log(
        `@getSelectedRangeAvailableDates() @MedReports() Response => ${response.data.message}`
      );

      if (response.data.success) {
        setSelectedRangeAvailableDates(response.data.fetched);
      }
    } catch (error) {
      console.log(
        "Error occured when retrieving the available date records for a specific period @getSelectedRangeAvailableDates() @MedReports() => ",
        error
      );
    }
  };

  /*
  Get appointments for the selected range
  */
  const getSelectedRangeAppointments = async () => {
    try {
      const response = await axios.post(
        "/api/medDoctor/medical-reports-read-all-appointments-specific-period",
        {
          startDate: minDate,
          endDate: maxDate,
        },
        {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        }
      );

      // Log the response
      console.log(
        `@getSelectedRangeAppointments() @MedReports() Response => ${response.data.message}`
      );

      if (response.data.success) {
        setSelectedRangeAppointments(response.data.fetched);
      }
    } catch (error) {
      console.log(
        "Error occured when retrieving the appointment records for a specific period @getSelectedRangeAppointments() @MedReports() => ",
        error
      );
    }
  };

  /*
  Arrange details by the month
  */
  const arrangeDetailsByMonth = () => {
    const monthList = [];

    var month;
    var monthName;
    // Get the numbers of selected months
    for (
      var m = Number(selectedRange[0].$M);
      m <= Number(selectedRange[1].$M);
      m++
    ) {
      // Get the name of the month
      switch (m) {
        case 0:
          monthName = "January";
          break;
        case 1:
          monthName = "February";
          break;
        case 2:
          monthName = "March";
          break;
        case 3:
          monthName = "April";
          break;
        case 4:
          monthName = "May";
          break;
        case 5:
          monthName = "June";
          break;
        case 6:
          monthName = "July";
          break;
        case 7:
          monthName = "August";
          break;
        case 8:
          monthName = "September";
          break;
        case 9:
          monthName = "October";
          break;
        case 10:
          monthName = "November";
          break;
        case 11:
          monthName = "December";
          break;
      }

      // Create month object
      month = {
        monthIsoNumber: m,
        monthNumber: m + 1,
        monthName: monthName,
        availableDateCount: 0,
        availableDates: [],
        availableDatesDateOnly: [],
        appointmentCount: 0,
        appointments: [],
        totalMaxAppointments: 0,
        availableDateChange: 0.0,
        completedAppointmentCount: 0,
        missedAppointmentCount: 0,
      };

      // Add the object to the list
      monthList.push(month);
    }

    // Add the available dates & appointments to the corresponding month
    for (var mObj of monthList) {
      var dateCount = 0;
      var appointmentCount = 0;
      var missedAppointmentCount = 0;
      var completedAppointmentCount = 0;

      // Set the available date details to the month objects
      for (var dObj of selectedRangeAvailableDates) {
        if (
          Number(new Date(dObj.date).toLocaleDateString().split("/")[1]) ==
            mObj.monthNumber &&
          !mObj.availableDatesDateOnly.includes(
            new Date(dObj.date).toString().split(" ")[2]
          )
        ) {
          mObj.availableDates.push(dObj);
          mObj.availableDatesDateOnly.push(
            new Date(dObj.date).toString().split(" ")[2]
          );
          dateCount++;
        }
      }

      // Set the appointment details to the month objects
      for (var aObj of selectedRangeAppointments) {
        if (
          Number(
            new Date(aObj.appointmentDate).toLocaleDateString().split("/")[1]
          ) == mObj.monthNumber
        ) {
          mObj.appointments.push(aObj);

          appointmentCount++;
        }
      }

      // Set the appointment completion status
      for (var aObj of mObj.appointments) {
        if (aObj.status === "completed") {
            completedAppointmentCount++;
        } else if (aObj.status === "missed") {
            missedAppointmentCount++;
        }
      }

      mObj.availableDatesDateOnly.sort();
      mObj.availableDateCount = dateCount;
      mObj.appointmentCount = appointmentCount;
      mObj.completedAppointmentCount = completedAppointmentCount;
      mObj.missedAppointmentCount = missedAppointmentCount;
    }

    // Get the available date change
    var previousObjectAvailableDateCount = 0;
    var currentObjectAvailableDateCount = 0;
    for (var mObj of monthList) {
      var maxAppointments = 0;
      previousObjectAvailableDateCount = currentObjectAvailableDateCount;
      currentObjectAvailableDateCount = mObj.availableDateCount;
      for (var dObj of mObj.availableDates) {
        maxAppointments += dObj.maxAppointmentCount;
      }

      if (monthList.indexOf(mObj) === 0) {
        mObj.availableDateChange = (0.0).toFixed(2);
      } else {
        if (previousObjectAvailableDateCount !== 0) {
          mObj.availableDateChange =
            ((currentObjectAvailableDateCount -
              previousObjectAvailableDateCount) /
              previousObjectAvailableDateCount) *
            100;
          mObj.availableDateChange = mObj.availableDateChange.toFixed(2);
        } else {
          mObj.availableDateChange =
            ((currentObjectAvailableDateCount -
              previousObjectAvailableDateCount) /
              1) *
            100;
          mObj.availableDateChange = mObj.availableDateChange.toFixed(2);
        }
      }

      mObj.totalMaxAppointments = maxAppointments;
    }

    setMonthObjects(monthList);
  };

  /*
  set the summary
  */
  const getSummary = () => {
    var startingMonth;
    var endingMonth;
    var totalAvailableDates = 0;
    var totalAppointments = 0;
    var totalAppointmentsPercentage = 0.0;
    var totalAvailabledAppointments = 0;
    var completedAppointmentCount = 0;
    var missedAppointmentCount = 0;

    startingMonth = monthObjects[0].monthName;
    endingMonth = monthObjects[monthObjects.length - 1].monthName;

    for (var m of monthObjects) {
      totalAvailableDates += m.availableDateCount;
      totalAppointments += m.appointmentCount;
      totalAvailabledAppointments += m.totalMaxAppointments;
      completedAppointmentCount += m.completedAppointmentCount;
      missedAppointmentCount += m.missedAppointmentCount;
    }

    totalAppointmentsPercentage = (
      totalAppointments / totalAvailabledAppointments
    ).toFixed(3);

    const s = {
      startingMonth: startingMonth,
      endingMonth: endingMonth,
      totalAvailableDates: totalAvailableDates,
      totalAppointments: totalAppointments,
      totalAppointmentsPercentage: totalAppointmentsPercentage,
      totalAvailabledAppointments: totalAvailabledAppointments,
      totalCompletedAppointments: completedAppointmentCount,
      totalMissedAppointments: missedAppointmentCount,
    };

    setSummary(s);
  };

  /*
  Generate the pdf
  */
  const handleGeneratePdf = async () => {
    const data1 = section0To3Ref.current;
    const data2 = section4Ref.current;
    const data3 = section5Ref.current;

    try {
      const canvas1 = await html2canvas(data1);
      const canvas2 = await html2canvas(data2);
      const canvas3 = await html2canvas(data3);

      const imgData1 = canvas1.toDataURL("image/png");
      const imgData2 = canvas2.toDataURL("image/png");
      const imgData3 = canvas3.toDataURL("image/png");

      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "px",
        format: "a4",
      });

      const width = pdf.internal.pageSize.getWidth();
      const height1 = (canvas1.height * width) / canvas1.width;
      const height2 = (canvas2.height * width) / canvas2.width;
      const height3 = (canvas3.height * width) / canvas3.width;

      pdf.addImage(imgData1, "PNG", 0, 0, width, height1);
      pdf.addPage("a4", "portrait");
      pdf.addImage(imgData2, "PNG", 0, 0, width, height2);
      pdf.addPage("a4", "portrait");
      pdf.addImage(imgData3, "PNG", 0, 0, width, height3);
      pdf.save("Report.pdf");
    } catch (error) {
      console.log(
        "Error occured when generating the pdf @handleGeneratePdf() @MedReports() => ",
        error
      );
    }
  };

  /* ============= useEffects ============== */

  // Log the selectedRange => onChange:: const: selectedRange
  useEffect(() => {
    console.log("@const: selectedRange => ", selectedRange);
  }, [selectedRange]);

  // Set the const: minDate and const:maxDate => onChange:: const: selectedRange
  useEffect(() => {
    if (selectedRange !== null) {
      setMinDate(
        new Date(
          selectedRange[0].$y + "-" + (selectedRange[0].$M + 1) + "-" + 1
        ).toISOString()
      );
      setMaxDate(
        new Date(
          selectedRange[1].$y +
            "-" +
            (selectedRange[1].$M + 1) +
            "-" +
            monthLength(selectedRange[1].$M, selectedRange[1].$y)
        ).toISOString()
      );

      setRangeChange(!rangeChange);
    }
  }, [selectedRange]);

  // Log the minDate & maxDate => onChange:: const: maxDate
  useEffect(() => {
    console.log("@const: minDate => ", minDate);
    console.log("@const: maxDate => ", maxDate);
  }, [rangeChange]);

  // getSelectedRangeAvailableDates() => onChange:: const: maxDate
  useEffect(() => {
    if (maxDate !== null) {
      getSelectedRangeAvailableDates();
    }
  }, [rangeChange]);

  // Log the selectedRangeAvailableDates => onChange:: const: selectedRangeAvailableDates
  useEffect(() => {
    console.log(
      "@const: selectedRangeAvailableDates => ",
      selectedRangeAvailableDates
    );
  }, [selectedRangeAvailableDates]);

  // getSelectedRangeAppointments() => onChange:: const: maxDate
  useEffect(() => {
    if (maxDate !== null) {
      getSelectedRangeAppointments();
    }
  }, [maxDate]);

  // Log the selectedRangeAppointments => onChange:: const: selectedRangeAppointments
  useEffect(() => {
    console.log(
      "@const: selectedRangeAppointments => ",
      selectedRangeAppointments
    );
  }, [selectedRangeAppointments]);

  // arrangeDetailsByMonth() => onChange:: const: selectedRangeAppointments
  useEffect(() => {
    if (
      selectedRangeAvailableDates !== null &&
      selectedRangeAppointments !== null
    ) {
      arrangeDetailsByMonth();
    }
  }, [selectedRangeAvailableDates, selectedRangeAppointments]);

  // Log the monthObjects => onChange:: const: monthObjects
  useEffect(() => {
    console.log("@const: monthObjects => ", monthObjects);
  }, [monthObjects]);

  // getSummary() => onChange:: const: monthObjects
  useEffect(() => {
    if (monthObjects !== null) {
      getSummary();
    }
  }, [monthObjects]);

  return (
    <Layout>
      <div className="doc-reports-main">
        <div className="doc-reports-secondary-1" style={{paddingLeft: 20, paddingRight: 20, paddingTop: 20}}>
          <div className="doc-reports-secondary-1-label">
            Select time period&nbsp;:&nbsp;
          </div>
          <div className="doc-reports-secondary-1-rangePicker">
            <RangePicker
              picker="month"
              allowClear
              style={{ width: 275 }}
              disabledDate={disabledDate}
              onChange={handleDateRangeChange}
            />
          </div>

          <div>
            <Button
              className="doc-reports-secondary-1-download-button"
              onClick={handleGeneratePdf}
            >
              Download
            </Button>
          </div>
        </div>

        <div
          className="doc-reports-secondary-2"
          key={monthObjects !== null ? monthObjects.length : 0}

        >
            <div ref={section0To3Ref} style={{paddingLeft: 20, paddingRight: 20, paddingTop: 20}}>
          <div className="doc-reports-secondary-2-title">
          <img src={reportHeaderImage} alt="document header" style={{width: 700}}/>
          </div>
          
          <div className="doc-reports-secondary-2-section-1">
            <legend className="doc-reports-secondary-2-section-title">
              Summary
            </legend>
            <div className="doc-reports-secondary-2-section-1-info">
              <div className="doc-reports-secondary-2-section-1-info-box">
                <p className="doc-reports-secondary-2-section-1-info-box-title">
                  Time period
                </p>
                <p>&nbsp;:&nbsp;</p>
                <p>
                  {summary !== null
                    ? "From " +
                      summary.startingMonth +
                      " To " +
                      summary.endingMonth
                    : null}
                </p>
              </div>

              <div className="doc-reports-secondary-2-section-1-info-box">
                <p className="doc-reports-secondary-2-section-1-info-box-title">
                  Total available dates
                </p>
                <p>&nbsp;:&nbsp;</p>
                <p>{summary !== null ? summary.totalAvailableDates : null}</p>
              </div>

              <div className="doc-reports-secondary-2-section-1-info-box">
                <p className="doc-reports-secondary-2-section-1-info-box-title">
                  Total availabled appointments
                </p>
                <p>&nbsp;:&nbsp;</p>
                <p>
                  {summary !== null
                    ? summary.totalAvailabledAppointments
                    : null}
                </p>
              </div>

              <div className="doc-reports-secondary-2-section-1-info-box">
                <p className="doc-reports-secondary-2-section-1-info-box-title">
                  Total scheduled appointments
                </p>
                <p>&nbsp;:&nbsp;</p>
                <p>{summary !== null ? summary.totalAppointments : null}</p>
                <div className="doc-reports-secondary-2-section-1-info-box-inside-box">
                  <p style={{ color: "#818181" }}>Percentage</p>
                  <p>&nbsp;:&nbsp;</p>
                  <p>
                    {summary !== null
                      ? summary.totalAppointmentsPercentage + "%"
                      : null}
                  </p>
                </div>
              </div>

              <div className="doc-reports-secondary-2-section-1-info-box">
                <p className="doc-reports-secondary-2-section-1-info-box-title">
                  Total completed appointments
                </p>
                <p>&nbsp;:&nbsp;</p>
                <p>
                  {summary !== null
                    ? summary.totalCompletedAppointments
                    : null}
                </p>
              </div>

              <div className="doc-reports-secondary-2-section-1-info-box">
                <p className="doc-reports-secondary-2-section-1-info-box-title">
                  Total incompleted appointments
                </p>
                <p>&nbsp;:&nbsp;</p>
                <p>
                  {summary !== null
                    ? summary.totalMissedAppointments
                    : null}
                </p>
              </div>

            </div>
          </div>

          <hr></hr>

          <div className="doc-reports-secondary-2-section-2">
            <div className="doc-reports-secondary-2-section-title">
              <p>Available Dates</p>
            </div>

            <div className="doc-reports-secondary-2-section-2-data">
              <div className="doc-reports-secondary-2-section-2-data-chart">
                <LineChart
                  width={500}
                  height={300}
                  data={monthObjects}
                  margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="monthName" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  {/*<Bar dataKey="availableDateCount" fill="#8884d8" activeBar={<Rectangle fill="pink" stroke="blue" />} />*/}
                  <Line
                    type="monotone"
                    dataKey="availableDateCount"
                    stroke="#FFC15E"
                    activeDot={{ r: 8 }}
                  />
                </LineChart>
              </div>

              <div className="doc-reports-secondary-2-section-2-data-summary">
                <table style={{border: "1px solid #dfdfdf", borderCollapse: "collapse"}}>
                  <tr>
                    <th style={{border: "1px solid #dfdfdf", borderCollapse: "collapse", backgroundColor: "#eeeeee", textAlign: "center", fontWeight: 500, height: 40, width: 84}}>Month</th>
                    <th style={{border: "1px solid #dfdfdf", borderCollapse: "collapse", backgroundColor: "#eeeeee", textAlign: "center", fontWeight: 500, height: 40, width: 84}}>Dates</th>
                    <th style={{border: "1px solid #dfdfdf", borderCollapse: "collapse", backgroundColor: "#eeeeee", textAlign: "center", fontWeight: 500, height: 40, width: 84}}>Change %</th>
                  </tr>

                  {monthObjects?.map((month, index) => (
                    <tr>
                      <td style={{border: "1px solid #dfdfdf", borderCollapse: "collapse", width: 84}}>{month.monthName}</td>
                      <td style={{border: "1px solid #dfdfdf", borderCollapse: "collapse", width: 84}}>
                        {month.availableDatesDateOnly?.map(
                          (date) => `${date},`
                        )}
                      </td >
                      <td style={{border: "1px solid #dfdfdf", borderCollapse: "collapse", width: 84}}>{`${month.availableDateChange}%`}</td>
                    </tr>
                  ))}
                </table>
              </div>
            </div>
          </div>

          <hr></hr>

          <div className="doc-reports-secondary-2-section-3">
            <div className="doc-reports-secondary-2-section-title">
              <p>Scheduled Appointments</p>
            </div>

            <div className="doc-reports-secondary-2-section-3-data">
              <div className="doc-reports-secondary-2-section-3-data-chart">
                <LineChart
                  width={500}
                  height={300}
                  data={monthObjects}
                  margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="monthName" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="appointmentCount"
                    stroke="#FFC15E"
                    activeDot={{ r: 8 }}
                  />
                </LineChart>
              </div>

              <div className="doc-reports-secondary-2-section-3-data-summary">
                <table style={{border: "1px solid #dfdfdf", borderCollapse: "collapse"}}>
                  <tr>
                    <th style={{border: "1px solid #dfdfdf", borderCollapse: "collapse", backgroundColor: "#eeeeee", textAlign: "center", fontWeight: 500, height: 40, width: 84}}>Month</th>
                    <th style={{border: "1px solid #dfdfdf", borderCollapse: "collapse", backgroundColor: "#eeeeee", textAlign: "center", fontWeight: 500, height: 40, width: 84}}>Scheduled</th>
                    <th style={{border: "1px solid #dfdfdf", borderCollapse: "collapse", backgroundColor: "#eeeeee", textAlign: "center", fontWeight: 500, height: 40, width: 84}}>Availabled</th>
                    <th style={{border: "1px solid #dfdfdf", borderCollapse: "collapse", backgroundColor: "#eeeeee", textAlign: "center", fontWeight: 500, height: 40, width: 84}}>Percentage</th>
                  </tr>

                  {monthObjects?.map((month, index) => (
                    <tr>
                      <td style={{border: "1px solid #dfdfdf", borderCollapse: "collapse", width: 84}}>{month.monthName}</td>
                      <td style={{border: "1px solid #dfdfdf", borderCollapse: "collapse", width: 84}}>{month.appointmentCount}</td>
                      <td style={{border: "1px solid #dfdfdf", borderCollapse: "collapse", width: 84}}>{month.totalMaxAppointments}</td>
                      <td style={{border: "1px solid #dfdfdf", borderCollapse: "collapse", width: 84}}>{`${(month.appointmentCount/month.totalMaxAppointments).toFixed(2)}%`}</td>
                    </tr>
                  ))}
                </table>
              </div>
            </div>
          </div>
        </div>
          <div className="doc-reports-secondary-2-section-4" ref={section4Ref} style={{paddingLeft: 20, paddingRight: 20, paddingTop: 20}}>
            <div className="doc-reports-secondary-2-section-title">
              <p>Monthwise</p>
              <div
                style={{
                  display: "flex",
                  fontSize: 15,
                  fontWeight: 400,
                  color: "black",
                  marginLeft: 20,
                }}
              >
                <div
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    marginRight: 30,
                  }}
                >
                  <p>Availabled</p>
                  <div
                    style={{
                      width: 10,
                      height: 10,
                      backgroundColor: "#FFC15E",
                      marginLeft: 10,
                    }}
                  ></div>
                </div>
                <div style={{ display: "flex", flexDirection: "row" }}>
                  <p>Scheduled</p>
                  <div
                    style={{
                      width: 10,
                      height: 10,
                      backgroundColor: "black",
                      marginLeft: 10,
                    }}
                  ></div>
                </div>
              </div>
            </div>
            <div className="doc-reports-secondary-2-section-4-data">
              <div className="doc-reports-secondary-2-section-4-data-container">
                {monthObjects?.map((month, index) => (
                  <div
                    className="doc-reports-secondary-2-section-4-data-container-chart"
                    key={index}
                  >
                    <div className="doc-reports-secondary-2-section-4-data-container-chart-title">
                      {month.monthName}
                    </div>{" "}
                    <BarChart
                      className="doc-reports-secondary-2-section-4-data-container-chart-chart"
                      width={300}
                      height={200}
                      data={month.availableDates}
                      margin={{
                        top: 5,
                        right: 30,
                        left: 20,
                        bottom: 5,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis
                        dataKey="date"
                        tickFormatter={(value, index) =>
                          new Date(value).toString().split(" ")[2]
                        }
                      />
                      <YAxis />
                      <Tooltip />

                      <Bar
                        dataKey="appointmentCount"
                        stackId="a"
                        fill="#FFC15E"
                      />
                      <Bar
                        dataKey="maxAppointmentCount"
                        stackId="a"
                        fill="#000000"
                      />
                    </BarChart>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <hr></hr>

          <div className="doc-reports-secondary-2-section-5" ref={section5Ref} style={{paddingLeft: 20, paddingRight: 20, paddingTop: 20}}>
            <div className="doc-reports-secondary-2-section-title">
              <p>Appointment Completion</p>
            </div>
            <div className="doc-reports-secondary-2-section-5-data">
                <div className="doc-reports-secondary-2-section-5-data-chart">
                <LineChart
                  width={500}
                  height={300}
                  data={monthObjects}
                  margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="monthName" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="completedAppointmentCount"
                    stroke="#FFC15E"
                    activeDot={{ r: 8 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="missedAppointmentCount"
                    stroke="#000000"
                    activeDot={{ r: 8 }}
                  />
                </LineChart>
                </div>

                <div className="doc-reports-secondary-2-section-5-data-summary">
                <table style={{border: "1px solid #dfdfdf", borderCollapse: "collapse"}}>
                  <tr>
                    <th style={{border: "1px solid #dfdfdf", borderCollapse: "collapse", backgroundColor: "#eeeeee", textAlign: "center", fontWeight: 500, height: 40, width: 84}}>Month</th>
                    <th style={{border: "1px solid #dfdfdf", borderCollapse: "collapse", backgroundColor: "#eeeeee", textAlign: "center", fontWeight: 500, height: 40, width: 84}}>Completed</th>
                    <th style={{border: "1px solid #dfdfdf", borderCollapse: "collapse", backgroundColor: "#eeeeee", textAlign: "center", fontWeight: 500, height: 40, width: 84}}>Incompleted</th>
                    <th style={{border: "1px solid #dfdfdf", borderCollapse: "collapse", backgroundColor: "#eeeeee", textAlign: "center", fontWeight: 500, height: 40, width: 84}}>Completed %</th>
                  </tr>

                  {monthObjects?.map((month, index) => (
                    <tr>
                      <td style={{border: "1px solid #dfdfdf", borderCollapse: "collapse", width: 84}}>{month.monthName}</td>
                      <td style={{border: "1px solid #dfdfdf", borderCollapse: "collapse", width: 84}}>{month.completedAppointmentCount}</td>
                      <td style={{border: "1px solid #dfdfdf", borderCollapse: "collapse", width: 84}}>{month.missedAppointmentCount}</td>
                      <td style={{border: "1px solid #dfdfdf", borderCollapse: "collapse", width: 84}}>{`${month.appointmentCount !== 0 ? ((month.completedAppointmentCount)* 100)/(month.appointmentCount) : 0}%`}</td>
                    </tr>
                  ))}
                </table>
                </div>

            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default MedReports;
