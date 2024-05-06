import axios from "axios";
import Layout from "../components/Layout";
import React, { useEffect, useState, useRef } from "react";
import { List, Card, Table, Space, Button } from "antd";
import "../MedDatePicker.css";
import { CheckCircleTwoTone, CloseCircleTwoTone } from "@ant-design/icons";
import Swal from "sweetalert2";
import toast from "react-hot-toast";

// Calculate the length of the current month
function currentMonthLength() {
  const thirtyOneDayMonths = [0, 2, 4, 6, 7, 9, 11];
  const thirtyDayMonths = [3, 5, 8, 10];

  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();

  let length = 31; // Default to 31 days

  if (thirtyOneDayMonths.includes(currentMonth)) {
    length = 31;
  } else if (thirtyDayMonths.includes(currentMonth)) {
    length = 30;
  } else if (currentMonth === 1) {
    // Check if a leap year or not
    // Assign the no. of dates for the month february based on that
    if (
      (currentYear % 4 === 0 && currentYear % 100 !== 0) ||
      currentYear % 400 === 0
    ) {
      length = 29; // Leap year
    } else {
      length = 28; // Non-leap year
    }
  }
  return length;
}

const MedOverview = () => {
  // Columns of the scheduled appointment table
  const columns = [
    {
      title: "No",
      dataIndex: "appointmentNo",
      key: "appointmentNo",
      width: 50,
    },
    {
      title: "Name",
      dataIndex: "employeeName",
      key: "employeeName",
      width: 100,
    },
    {
      title: "Time",
      dataIndex: "appointmentTime",
      key: "appointmentTime",
      width: 60,
    },
    {
      title: "Action",
      key: "action",
      width: 100,
      render: (_, record) => (
        <div>
          <Button
            style={{
              marginBottom: 5,
              width: 100,
              height: 40,
              borderColor:
                record.appointmentStatus === "completed" ? "#52c41a" : null,
            }}
            onClick={() => {
              if (record.appointmentStatus === "pending") {
                updateCompletionStatusOfAppointment(
                  record.key,
                  "completed",
                  record.employeeName
                );
                setTableKey(!tableKey);
              } else if (record.appointmentStatus === "missed") {
                Swal.fire({
                  title: `Appointment is already marked as absent`,
                  text: "Are you sure you want to change the status?",
                  icon: "warning",
                  showCancelButton: true,
                  confirmButtonColor: "#3085d6",
                  cancelButtonColor: "#d33",
                  confirmButtonText: "Yes, change it!",
                }).then((result) => {
                  if (result.isConfirmed) {
                    updateCompletionStatusOfAppointment(
                      record.key,
                      "completed",
                      record.employeeName
                    );
                    setTableKey(!tableKey);
                  }
                });
              }
            }}
            onMouseEnter={(e) => {
              record.appointmentStatus === "completed"
                ? (e.target.style.color = "#52c41a")
                : (e.target.style.color = "null");
            }}
            onMouseLeave={(e) => {
              e.target.style.color = null;
            }}
          >
            <span>
              Complete
              {record.appointmentStatus == "completed" ? (
                <CheckCircleTwoTone
                  style={{ marginLeft: 5 }}
                  twoToneColor="#52c41a"
                />
              ) : null}
            </span>
          </Button>
          <br></br>
          <Button
            style={{
              width: 100,
              height: 40,
              borderColor:
                record.appointmentStatus === "missed" ? "#eb2f96" : null,
            }}
            onClick={() => {
              if (record.appointmentStatus === "pending") {
                updateCompletionStatusOfAppointment(
                  record.key,
                  "missed",
                  record.employeeName
                );
                setTableKey(!tableKey);
              } else if (record.appointmentStatus === "completed") {
                Swal.fire({
                  title: `Appointment is already marked as completed`,
                  text: "Are you sure you want to change the status?",
                  icon: "warning",
                  showCancelButton: true,
                  confirmButtonColor: "#3085d6",
                  cancelButtonColor: "#d33",
                  confirmButtonText: "Yes, change it!",
                }).then((result) => {
                  if (result.isConfirmed) {
                    updateCompletionStatusOfAppointment(
                      record.key,
                      "missed",
                      record.employeeName
                    );
                    setTableKey(!tableKey);
                  }
                });
              }
            }}
            onMouseEnter={(e) => {
              record.appointmentStatus === "missed"
                ? (e.target.style.color = "#eb2f96")
                : (e.target.style.color = null);
            }}
            onMouseLeave={(e) => {
              e.target.style.color = null;
            }}
          >
            <span>
              Absent
              {record.appointmentStatus == "missed" ? (
                <CloseCircleTwoTone
                  style={{ marginLeft: 5 }}
                  twoToneColor="#eb2f96"
                />
              ) : null}
            </span>
          </Button>
        </div>
      ),
    },
  ];

  /* ============= States ============== */

  // Available dates for the current month
  const [
    availableDateObjectsOfCurrentMonth,
    setAvailableDateObjectsOfCurrentMonth,
  ] = useState(null);

  // Date list to display
  const [availableDateDetailsToDisplay, setAvailableDateDetialsToDisplay] =
    useState(null);

  // Selected date to display scheduled list
  const [dateKey, setDateKey] = useState(null);
  const [selectedDateObject, setSelectedDateObject] = useState(null);

  // Scheduled appointments for the selected date
  const [appointmentObjectList, setAppointmentObjectList] = useState(null);

  // Employee info for the retrieved appointment objecs
  const [employeeList, setEmployeeList] = useState(null);

  // Data of the scheduled appointment list
  const [scheduledListForSpecificDay, setScheduledListForSpecificDay] =
    useState([]);

  // Scheduled list table key
  const [tableKey, setTableKey] = useState(false);

  // Date card list key
  const [renderCount, setRenderCount] = useState(0);
  const [animatedValue, setAnimatedValue] = useState(null);

  // To check the change of availableDateDetailsToDisplay
  const previousAvailableDateDetailsToDisplay = useRef([]);

  /* ============= Functions ============== */

  /*
  Read all the availble dates for the current month
  */
  const retrieveAvailableDateObjectsForCurrentMonth = async () => {
    try {
      // Calculate the start date and the end date of the current month
      const startDate = new Date(
        new Date().getFullYear() +
          "-" +
          (new Date().getMonth() + 1) +
          "-" +
          "01"
      ).toISOString();
      const endDate = new Date(
        new Date().getFullYear() +
          "-" +
          (new Date().getMonth() + 1) +
          "-" +
          currentMonthLength()
      ).toISOString();

      //console.log("start: ", startDate);
      //console.log("end: ", endDate);

      // Retrive the documents corresponding to the given
      // time period
      const response = await axios.post(
        "/api/medDoctor/medical-overview-read-all-available-dates-specific-month",
        {
          startDate: startDate,
          endDate: endDate,
        },
        {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        }
      );

      // Log the response
      console.log(
        `@retrieveAvailableDateObjectsForCurrentMonth() @MedOverview() Response => ${response.data.message}`
      );

      // Update the state of the const availableDateObjectsOfCurrentMonth
      if (response.data.success) {
        // Sort the list in ascending order
        var orderedDateObjects = response.data.fetched;
        orderedDateObjects.sort(function (a, b) {
          return (
            Number(a.date.toString().split("T")[0].split("-")[2]) -
            Number(b.date.toString().split("T")[0].split("-")[2])
          );
        });

        setAvailableDateObjectsOfCurrentMonth(orderedDateObjects);
      }
    } catch (error) {
      console.log(
        "Error occured when retrieving available date objects for the current month @retrieveAvailableDateObjectsForCurrentMonth() @MedOverview() => ",
        error
      );
    }
  };

  /*
  Set available date details to display
  */
  const getAvailableDateDetialsToDisplay = () => {
    setAnimatedValue(availableDateDetailsToDisplay);
    const data = [];
    var date;
    var day;
    var key;
    var suffix;

    // Get the date with the suffix and day
    for (let dObj of availableDateObjectsOfCurrentMonth) {
      date = new Date(dObj.date).toDateString().split(" ")[2];
      day = new Date(dObj.date).toDateString().split(" ")[0];
      key = Number(date);

      // Set the suffix
      switch (Number(date) % 10) {
        case 1:
          suffix = "\u02E2\u1D57";
          break;
        case 2:
          suffix = "\u207F\u1D48";
          break;
        case 3:
          suffix = "\u02B3\u1D48";
          break;
        default:
          suffix = "\u1D57\u02B0";
      }

      // Set the day
      switch (day) {
        case "Mon":
          day = "Monday";
          break;
        case "Tue":
          day = "Tuesday";
          break;
        case "Wed":
          day = "Wednesday";
          break;
        case "Thu":
          day = "Thursday";
          break;
        case "Fri":
          day = "Friday";
          break;
        case "Sat":
          day = "Saturday";
          break;
        case "Sun":
          day = "Sunday";
          break;
      }

      date = {
        key: key,
        date: date + suffix,
        day: day,
        content: dObj.appointmentCount,
      };

      data.push(date);
    }
    setAvailableDateDetialsToDisplay(data);
  };

  /*
  Get the available date object corresponding to the clicked date
  */
  const getSelectedDate = (key) => {
    var date;
    for (let dObj of availableDateObjectsOfCurrentMonth) {
      date = Number(new Date(dObj.date).toDateString().split(" ")[2]);

      if (date === key) {
        setSelectedDateObject(dObj);
      }
    }
  };

  /*
  Get the scheduled appointment list corresponding to the selected date
  */
  const getAppointmentObjectList = async () => {
    try {
      // Appointment Ids
      const appointmentIdList =
        selectedDateObject.appointmentIds !== null
          ? selectedDateObject.appointmentIds
          : [];

      const response = await axios.post(
        "/api/medDoctor/medical-overview-read-all-appointments-specific",
        {
          appointmentIds: appointmentIdList,
        },
        {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        }
      );

      // Log the response
      console.log(
        `@getAppointmentObjectList() @MedOverview() Response => ${response.data.message}`
      );

      if (response.data.success) {
        setAppointmentObjectList(response.data.fetched);
      } else {
        setAppointmentObjectList([]);
      }
    } catch (error) {
      console.log(
        "Error occured when retrieving the appointment records for a selected date @getAppointmentObjectList() @MedOverview() => ",
        error
      );
    }
  };

  /*
  Get the employees info for retrieved appointments
  */
  const getEmployeeInfoForAppointments = async () => {
    try {
      const employeeIds = [];

      if (appointmentObjectList !== null && appointmentObjectList.length > 0) {
        // Get the employee Ids from the appointment objects
        for (var aObj of appointmentObjectList) {
          employeeIds.push(aObj.userId);
        }

        const response = await axios.post(
          "/api/medDoctor/medical-overview-read-all-employees-specific",
          {
            employeeIds: employeeIds,
          },
          {
            headers: {
              Authorization: "Bearer " + localStorage.getItem("token"),
            },
          }
        );

        // Log the response
        console.log(
          `@getEmployeeInfoForAppointments() @MedOverview() Response => ${response.data.message}`
        );

        if (response.data.success) {
          setEmployeeList(response.data.fetched);
        }
      } else {
        setEmployeeList([]);
      }
    } catch (error) {
      console.log(
        "Error occured when retrieving the employee info corresponding to the appointments @getEmployeeInfoForAppointments() @MedOverview() => ",
        error
      );
    }
  };

  /*
  Create the appointment detail objects by combining employee info
  */
  const createAppointmentObjectsToDisplay = () => {
    const appointmentList = [];
    var appointmentObj;
    var empId;
    var empName;

    if (appointmentObjectList !== null && appointmentObjectList.length > 0) {
      for (var aObj of appointmentObjectList) {
        // Get the corresponding employee details for the appointment
        for (var eObj of employeeList) {
          if (eObj._id === aObj.userId) {
            empId = eObj._id;
            empName = eObj.fname;
            break;
          }
        }

        appointmentObj = {
          key: aObj._id, // key => appointment id
          employeeId: empId,
          appointmentNo: aObj.appointmentNo,
          employeeName: empName,
          appointmentTime: aObj.appointmentTime,
          appointmentStatus: aObj.status,
          bookedDate: aObj.updatedAt,
        };

        appointmentList.push(appointmentObj);
      }
    }
    setScheduledListForSpecificDay(appointmentList);
  };

  /*
  Update completion status of an appointment
  */
  const updateCompletionStatusOfAppointment = async (id, status, name) => {
    try {
      const response = await axios.post(
        "/api/medDoctor/medical-overview-update-one-appointment-status",
        {
          recordId: id,
          status: status,
          updatedAt: new Date(),
        },
        {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        }
      );

      // Log the response
      console.log(
        `@updateCompletionStatusOfAppointment() @MedOverview() Response => ${response.data.message}`
      );
      getAppointmentObjectList();

      toast.success(`Updated the status for ${name}`, {
        position: "top-right",
      });
    } catch (error) {
      console.log(
        "Error occured when updating the completion status for an appointment @updateCompletionStatusOfAppointment() @MedReports() => ",
        error
      );
    }
  };

  /* ============= useEffects ============== */

  // retrieveAvailableDateObjectsForCurrentMonth() => onChange:: initial render
  useEffect(() => {
    retrieveAvailableDateObjectsForCurrentMonth();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      retrieveAvailableDateObjectsForCurrentMonth();

      //getSelectedDate(dateKey);
      //getAppointmentObjectList();
      //setTableKey(!tableKey);
      setRenderCount((prevCount) => prevCount + 1);
    }, 10000);

    // Cleanup function to clear the interval when component unmounts or rerenders
    return () => clearInterval(interval);
  }, []);

  // Log the availableDateObjectsOfCurrentMonth => onChange:: const: availableDateObjectsOfCurrentMonth
  useEffect(() => {
    console.log(
      "@const: availableDateObjectsOfCurrentMonth => ",
      availableDateObjectsOfCurrentMonth
    );
  }, [availableDateObjectsOfCurrentMonth]);

  // getAvailableDateDetialsToDisplay() => onChange:: const: availableDateObjectsOfCurrentMonth
  useEffect(() => {
    if (availableDateObjectsOfCurrentMonth !== null) {
      getAvailableDateDetialsToDisplay();
    }
  }, [availableDateObjectsOfCurrentMonth]);

  // Log the selectedDateObject => onChange:: const: selectedDateObject
  useEffect(() => {
    console.log("@const: selectedDateObject => ", selectedDateObject);
  }, [selectedDateObject]);

  // getAppointmentObjectList() => onChange:: const: selectedDateObject
  useEffect(() => {
    getAppointmentObjectList();
  }, [selectedDateObject, availableDateObjectsOfCurrentMonth]);

  // Log the appointmentObjectList => onChange:: const: appointmentObjectList
  useEffect(() => {
    console.log("@const: appointmentObjectList => ", appointmentObjectList);
  }, [appointmentObjectList]);

  // getEmployeeInfoForAppointments() => onChange:: const: appointmentObjectList
  useEffect(() => {
    if (appointmentObjectList !== null) {
      getEmployeeInfoForAppointments();
    }
  }, [appointmentObjectList]);

  // Log the employeeList => onChange:: const: employeeList
  useEffect(() => {
    console.log("@const: employeeList => ", employeeList);
  }, [employeeList]);

  // createAppointmentObjectsToDisplay() => onChange:: const: employeeList
  useEffect(() => {
    if (employeeList !== null) {
      createAppointmentObjectsToDisplay();
    }
  }, [employeeList]);

  return (
    <Layout>
      <div className="doc-overview-main">
        <div className="doc-overview-secondary-1">
          <div className="doc-overview-secondary-1-title">
            <div className="doc-overview-secondary-1-title-1">
              Scheduled Appointments&nbsp;:&nbsp;
            </div>
            <div className="doc-overview-secondary-1-title-2">
              {new Date().toLocaleString("default", { month: "long" })}
            </div>
          </div>
          <div
            className="doc-overview-date-scheduled-count-list"
            key={renderCount}
          >
            <List
              style={{ width: 460 }}
              grid={{
                gutter: 16,
                column: 3,
              }}
              dataSource={
                availableDateDetailsToDisplay !== null
                  ? availableDateDetailsToDisplay
                  : []
              }
              renderItem={(item) => (
                <List.Item>
                  <Card
                    bordered={true}
                    key={item.key}
                    onClick={() => {
                      getSelectedDate(item.key);
                    }}
                    hoverable
                  >
                    <div className="doc-overview-date-scheduled-count-list-card-content-outer">
                      <div className="doc-overview-date-scheduled-count-list-card-content-inner-1">
                        <div>{item.date}</div>
                        <div>{item.day}</div>
                      </div>

                      <div
                        className={`doc-overview-date-scheduled-count-list-card-content-inner-2 ${
                          animatedValue?.find((val) => val.key === item.key)
                            .content !== item.content
                            ? "value-animation"
                            : ""
                        }`}
                      >
                        {item.content}
                      </div>
                    </div>
                  </Card>
                </List.Item>
              )}
            />
          </div>
        </div>

        <div className="doc-overview-secondary-2">
          <Table
            columns={columns}
            dataSource={scheduledListForSpecificDay}
            scroll={{ y: 360 }}
            pagination={false}
            style={{ width: 550 }}
            bordered={true}
            key={tableKey}
          />
        </div>
      </div>
    </Layout>
  );
};

export default MedOverview;
