import React, { useEffect, useState } from "react";
import Layout from "../components/Layout";
import { Button, Descriptions, Modal, Tabs, message, List, Input, Form, ConfigProvider } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { showLoading, hideLoading } from "../redux/empalerts";
import { toast } from "react-hot-toast";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "../MedDatePicker.css";
import Swal from "sweetalert2";
import { SearchOutlined } from '@ant-design/icons';

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

/*
*
*
Main
*
*
*/
const MedicalAppointments = () => {
  const dispatch = useDispatch();

  //const { user } = useSelector((state) => state.user);

  const navigate = useNavigate();

  /* ============= States ============== */
  // Set the userId
  const [userId, setUserId] = useState(null);

  // Selected date
  const [selectedDate, setSelectedDate] = useState(new Date());

  // Selected date object
  const [selectedDateObject, setSelectedDateObject] = useState(null);

  // Available dates objects
  const [availableDateObjects, setAvailableDateObjects] = useState(null);

  // Available dates
  const [availableDates, setAvailableDates] = useState([]);

  // Unavailable dates
  const [unavailableDates, setUnavailbleDates] = useState([]);

  // Existing appointment
  const [existingAppointment, setExistingAppointment] = useState(null);

  // Existing appointment date object
  const [existingAppointmentDateObject, setExistingAppointmentDateObject] =
    useState(null);

  // Upcomming appointment items to display in <Description/> componenet
  const [upcommingAppointmentItems, setUpcommingAppointmentItems] = useState([
    {
      key: "1",
      label: "Date",
      children: "",
    },
    {
      key: "2",
      label: "Time",
      children: "",
    },
    {
      key: "3",
      label: "Queue No",
      children: "",
    },
    {
      key: "4",
      label: "Status",
      children: "",
    },
    {
      key: "5",
      label: "Reminder Status",
      children: "",
    },
    {
      key: "6",
      label: "Booked On",
      children: "",
    },
  ]);

  // ******** History tab ******** //

  // History list
  const [historyList, setHistoryList] = useState(null);

  // *** For the reschecule pop window ***
  const [open, setOpen] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [modalText, setModalText] = useState("Content of the modal");

  /* ============= Functions ============== */

  // ******** Appointments tab ******** //

  /*
  Get the user
  */
  const getUser = async () => {
    dispatch(showLoading());

    try {
      const response = await axios.post(
        "/api/employee/get-employee-info-by-id",
        {},
        {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        }
      );

      if (response.data.success) {
        setUserId(response.data.data.userid);
      }
      dispatch(hideLoading());

      console.log("@getUser() @MedAppointments User info => ", response.data);
    } catch (error) {
      dispatch(hideLoading());
      console.log(
        "Error occured when retrieving user info @getUser() @MedAppointments => ",
        error
      );
    }
  };

  /*
  Read existing appointment
  */
  const retrieveExisitngAppointment = async () => {
    try {
      dispatch(showLoading());

      //console.log(user);
      const response = await axios.post(
        "/api/medEmployee/medical-appointment-read-one-specific",
        { id: userId },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      dispatch(hideLoading());

      // Update the state of the existingAppointment
      // if there is an existing appointment
      if (response.data.success) {
        setExistingAppointment(response.data.fetched);

        const dateObjResponse = await axios.post(
          "/api/medEmployee/medical-available-date-read-one-specific",
          { date: response.data.fetched.appointmentDate },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        if (dateObjResponse.data.success) {
          setExistingAppointmentDateObject(dateObjResponse.data.fetched);
        }
      } else {
        setExistingAppointmentDateObject(null);
        setExistingAppointment(null);
      }

      // Log the status message
      console.log(
        `@retrieveExistingAppointment() @MedicalAppointments() Response => ${response.data.message}`
      );
    } catch (error) {
      dispatch(hideLoading());

      console.log(
        "Error occured when retrieving existing appointment @retrieveExistingAppointment() @MedicalAppointments() => ",
        error
      );
      toast.error("Error occured when retrieving existing appointment");
    }
  };

  /*
  Set existing appointment details for the <Description/> component
  */
  const setExistingAppointmentToDisplay = () => {
    var newUpcommingAppointmentItems = [
      {
        key: "1",
        label: "Date",
        children: `${
          new Date(existingAppointment.appointmentDate)
            .toLocaleDateString()
            .split("T")[0]
        }`,
      },
      {
        key: "2",
        label: "Time",
        children: `${existingAppointment.appointmentTime}`,
      },
      {
        key: "3",
        label: "Queue No",
        children: `${existingAppointment.appointmentNo}`,
      },
      {
        key: "4",
        label: "Status",
        children: `${existingAppointment.status}`,
      },
      {
        key: "5",
        label: "Reminder Status",
        children: `${
          existingAppointment.isReminderSet
            ? "Reminder is set"
            : "Reminder is not set"
        }`,
      },
      {
        key: "6",
        label: "Booked On",
        children: `${existingAppointment.updatedAt.split("T")[0]}`,
      },
    ];

    setUpcommingAppointmentItems(newUpcommingAppointmentItems);
  };

  /*
  Get available date objects from the DB
  */
  const getAvailableDateObjects = async () => {
    try {
      dispatch(showLoading());

      const response = await axios.post(
        "/api/medEmployee/medical-available-date-read-all-existing",
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      // Set available date objects
      if (response.data.success) {
        setAvailableDateObjects(response.data.fetched);
      }

      dispatch(hideLoading());
    } catch (error) {
      dispatch(hideLoading());

      console.log(
        "Error occured when retrieving available dates @getAvailableDates() @MedicalAppointments() => ",
        error
      );
      toast.error("Error occured when retrieving available dates");
    }
  };

  /*
  Set up available date list
  */
  const getAvailableDates = () => {
    var dateObjList = availableDateObjects;
    var dateList = [];
    var date;

    for (var dObj of dateObjList) {
      date = dObj.date;
      date = new Date(date).toString().split(" ")[2];
      dateList.push(Number(date));
    }

    setAvailableDates(dateList);
  };

  /*
  Set up unavailable date list
  */
  const getUnavailableDates = () => {
    const length = currentMonthLength();
    const aDates = availableDates;
    const uDates = [];

    for (let i = 1; i <= length; i++) {
      if (!aDates.includes(i)) {
        uDates.push(
          new Date(new Date().getFullYear(), new Date().getMonth(), i)
        );
      }
    }

    setUnavailbleDates(uDates);
  };

  /*
  Handle changes of the selected dates
  */
  const handleDateChange = (date) => {
    setSelectedDate(date);
    console.log(date);

    var matchObjDate;
    var matchDate;
    if (availableDateObjects !== null) {
      for (var dObj of availableDateObjects) {
        matchObjDate = new Date(dObj.date);
        matchObjDate = matchObjDate.toDateString();

        matchDate = date.toDateString();

        if (matchObjDate === matchDate) {
          setSelectedDateObject(dObj);
        }
      }
    }
  };

  /*
  Schedule new appointment
  */
  // *** For the reschecule pop window ***
  const handleSchedulePopup = async () => {
    const res = await handleSchedule();

    if (res.success) {
      Swal.fire({
        title: "Success!",
        text: "Your appointment has been successfully scheduled.",
        icon: "success",
      });
    } else {
      Swal.fire({
        title: "Failed!",
        text: "Something went wrong.",
        icon: "error",
      });
    }
  };

  // For confirming the reschedulling
  const handleSchedule = async () => {
    try {
      var res;
      //dispatch(showLoading());

      // ======= Create new appointment =======
      const response = await axios.post(
        "/api/medEmployee/medical-appointment-create-new",
        {
          id: userId,
          appointmentDate: selectedDateObject.date,
          appointmentTime: selectedDateObject.nextAppointmentTime,
          appointmentNo: selectedDateObject.nextAppointmentNo,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      //dispatch(hideLoading());
      if (response.data.success) {
        res = {
          success: true,
          message: response.data.message,
        };
      } else {
        res = {
          success: false,
          message: response.data.message,
        };
      }

      // Log the response
      console.log(
        `@handleSchedule() @medicalAppointments() Response => ${response.data.message}`
      );

      // ======= Update available date details =======

      // Varaiables
      // For appointmentCount
      const varAppointmentCount = selectedDateObject.appointmentCount + 1;

      // For appointmentIds
      const varAppointmentIds = [];
      for (let appId of selectedDateObject.appointmentIds) {
        varAppointmentIds.push(appId);
      }
      varAppointmentIds.push(response.data.objectId.toString());

      // For status
      const varStatus =
        selectedDateObject.appointmentCount + 1 >=
        selectedDateObject.maxAppointmentCount
          ? "unavailable"
          : "available";

      // For nextAppointmentTime
      var nextAppTimeHour = Number(
        selectedDateObject.nextAppointmentTime.split(":")[0]
      );
      var nextAppTimeMinute = Number(
        selectedDateObject.nextAppointmentTime.split(":")[1]
      );
      nextAppTimeMinute =
        nextAppTimeMinute + Number(selectedDateObject.avgSessionTime);
      if (nextAppTimeMinute == 60) {
        nextAppTimeHour = nextAppTimeHour + 1;
        nextAppTimeMinute = 0;
      }
      if (nextAppTimeHour < 10) {
        nextAppTimeHour = "0" + nextAppTimeHour.toString();
      } else {
        nextAppTimeHour = nextAppTimeHour.toString();
      }
      if (nextAppTimeMinute < 10) {
        nextAppTimeMinute = "0" + nextAppTimeMinute.toString();
      } else {
        nextAppTimeMinute = nextAppTimeMinute.toString();
      }
      const varNextAppointmentTime = nextAppTimeHour + ":" + nextAppTimeMinute;

      // For nextAppointmentNo
      const varNextAppointmentNo = selectedDateObject.nextAppointmentNo + 1;

      // For version
      const varVersion = selectedDateObject.version + 1;

      const dateResponse = await axios.post(
        "/api/medEmployee//medical-available-date-update",
        {
          id: selectedDateObject._id,
          appointmentCount: varAppointmentCount,
          appointmentIds: varAppointmentIds,
          status: varStatus,
          nextAppointmentTime: varNextAppointmentTime,
          nextAppointmentNo: varNextAppointmentNo,
          version: varVersion,
          updatedAt: new Date(),
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      // Log the response
      console.log(
        `@handleSchedule() @medicalAppointments() Response => ${dateResponse.data.message}`
      );

      // Retrieve the newly set appointment and re-render to display
      retrieveExisitngAppointment();

      // Retrieve the available date objects to reflect changes
      getAvailableDateObjects();

      // Reset the selected date
      setSelectedDate(new Date());

      // Reset the selected date object
      setSelectedDateObject(null);

      // Return the response
      return res;
    } catch (error) {
      //dispatch(hideLoading());

      console.log(
        "Error occured when scheduling the appointment @handleSchedule() @MedicalAppointments() => ",
        error
      );
      return (res = {
        success: false,
        message: "Error occured when scheduling the appointment",
      });
    }
  };

  /*
  Re-schedule the appointment
  */
  // *** For the reschecule pop window ***
  const handleReschedulePopup = () => {
    Swal.fire({
      title: "Do you want to reschedule the appointment?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      cancelButtonText: "No",
      confirmButtonText: "Yes, reschedule!",
    }).then((result) => {
      if (result.isConfirmed) {
        showPopupModalForReschedule();
      }
    });
  };

  // For showing the reschedulign model
  const showPopupModalForReschedule = () => {
    setOpen(true);
  };

  // For cancelling the rescheduling model
  const handlePopupCancelForReschedule = () => {
    console.log("Clicked cancel button");
    setSelectedDateObject(null);
    setSelectedDate(new Date());
    setOpen(false);
  };

  // For confirming the rescheduling
  const handleReschedule = () => {
    try {
      //dispatch(showLoading());
      handleCancel();
      handleSchedule();
      //dispatch(hideLoading());

      handlePopupCancelForReschedule();

      Swal.fire({
        title: "Rescheduled!",
        text: "Your appointment has been successfully rescheduled.",
        icon: "success",
      });
    } catch (error) {
      //dispatch(hideLoading());

      console.log(
        "Error occured when re-scheduling the appointment @handleReschedule() @MedicalAppointments() => ",
        error
      );
      //toast.error("Error occured when re-scheduling the appointment");
    }
  };

  /*
  Cancel the appointment
  */
  // *** For the cancel pop window ***
  const handleCancelPopup = () => {
    Swal.fire({
      title: "Do you want to cancel the appointment?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      cancelButtonText: "No",
      confirmButtonText: "Yes, cancel!",
    }).then((result) => {
      if (result.isConfirmed) {
        handleCancel();
        Swal.fire({
          title: "Cancelled!",
          text: "Your appointment has been cancelled.",
          icon: "success",
        });
      }
    });
  };

  // For confirming the cancellation
  const handleCancel = async () => {
    try {
      //dispatch(showLoading());

      const response = await axios.post(
        "/api/medEmployee/medical-appointment-delete-one-specific",
        { recordId: existingAppointment._id },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      // Log the response
      console.log(
        `@handleCancel() @medicalAppointments() Response => ${response.data.message}`
      );

      // Remove the previous appointment details from the available date

      // Varaiables
      // For appointmentCount
      const varAppointmentCount =
        existingAppointmentDateObject.appointmentCount - 1;

      // For appointmentIds
      const varAppointmentIds = [];
      for (let appId of existingAppointmentDateObject.appointmentIds) {
        if (appId !== existingAppointment._id) {
          varAppointmentIds.push(appId);
        }
      }

      // For status
      const varStatus =
        existingAppointmentDateObject.appointmentCount - 1 >=
        existingAppointmentDateObject.maxAppointmentCount
          ? "unavailable"
          : "available";

      // For nextAppointmentTime
      const varNextAppointmentTime =
        existingAppointmentDateObject.nextAppointmentTime;

      // For nextAppointmentNo
      const varNextAppointmentNo =
        existingAppointmentDateObject.nextAppointmentNo;

      // For version
      const varVersion = existingAppointmentDateObject.version + 1;

      const dateResponse = await axios.post(
        "/api/medEmployee/medical-available-date-update",
        {
          id: existingAppointmentDateObject._id,
          appointmentCount: varAppointmentCount,
          appointmentIds: varAppointmentIds,
          status: varStatus,
          nextAppointmentTime: varNextAppointmentTime,
          nextAppointmentNo: varNextAppointmentNo,
          version: varVersion,
          updatedAt: new Date(),
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      // Get available date objects to reflect changes
      getAvailableDateObjects();

      // Set existing appointment record to reflect changes
      retrieveExisitngAppointment();
      setExistingAppointmentToDisplay();

      //dispatch(hideLoading());
      // Log the response
      console.log(
        `@handleCancel() @medicalAppointments() Response => ${dateResponse.data.message}`
      );
    } catch (error) {
      //dispatch(hideLoading());

      console.log(
        "Error occured when cancelling the appointment @handleCancel() @MedicalAppointments() => ",
        error
      );
      toast.error("Error occured when cancelling the appointment");
    }
  };

  // ******** History tab ******** //

  const retrieveHistory = async () => {
    try {
      const response = await axios.post(
        "/api/medEmployee/medical-appointment-read-all-specific",
        { id: userId },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response.data.success) {
        setHistoryList(response.data.fetched);
      } else {
        setHistoryList([]);
      }

      // Log the response
      console.log(
        `@retrieveHistory() @medicalAppointments() Response => ${response.data.message}`
      );
    } catch (error) {
      console.log(
        "Error occured when retrieving the appointment history @retrieveHistory() @MedicalAppointments() => ",
        error
      );
    }
  };

  /* ============= Function useEffects ============== */

  // ******** Appointment tab ******** //

  // getUser()
  useEffect(() => {
    getUser();
    console.log("userID: ", userId);
  }, []);

  // retrieveExistingAppointment()
  useEffect(() => {
    if (userId !== null) {
      retrieveExisitngAppointment();
    }
  }, [userId]);

  // Log the existingAppointment
  useEffect(() => {
    console.log(
      "@retrieveExistingAppointment() @MedicalAppointments() ExistingAppointment =>",
      existingAppointment
    );
  }, [existingAppointment]);

  // setExistingAppointmentToDisplay()
  useEffect(() => {
    if (existingAppointment !== null) {
      setExistingAppointmentToDisplay();
    } else {
      setUpcommingAppointmentItems([
        {
          key: "1",
          label: "Date",
          children: "",
        },
        {
          key: "2",
          label: "Time",
          children: "",
        },
        {
          key: "3",
          label: "Queue No",
          children: "",
        },
        {
          key: "4",
          label: "Status",
          children: "",
        },
        {
          key: "5",
          label: "Reminder Status",
          children: "",
        },
        {
          key: "6",
          label: "Booked On",
          children: "",
        },
      ]);
    }
  }, [existingAppointment]);

  // getAvailableDateObjects()
  useEffect(() => {
    getAvailableDateObjects();
  }, []);

  // Log available date objects
  useEffect(() => {
    console.log(
      "@getAvailableDateObjects() @MedicalAppointments() Available date objects =>",
      availableDateObjects
    );
  }, [availableDateObjects]);

  // getAvailableDates()
  useEffect(() => {
    if (availableDateObjects !== null) {
      getAvailableDates();
    }
  }, [availableDateObjects]);

  // getUnavailableDates()
  useEffect(() => {
    if (availableDates !== null) {
      getUnavailableDates();
    }
  }, [availableDates]);

  // Reload upcomming appointment componenet after scheduling an appointment

  useEffect(() => {
    console.log("Date object: ", selectedDateObject);
  }, [selectedDateObject]);

  // ******** History tab ******** //

  // retrieveHistory()
  useEffect(() => {
    retrieveHistory();
  }, [userId]);




  // ****** Search bar ********** //
  const [form] = Form.useForm();
  const [searchTerm, setSearchTerm] = useState('');

  // Regular expressions for YYYY, YYYY/MM, and YYYY/MM/DD formats
  const yearRegex = /^\d{4}$/;
  const yearMonthRegex = /^\d{4}\/(0?[1-9]|1[0-2])$/;
  const yearMonthDayRegex = /^\d{4}\/(0?[1-9]|1[0-2])\/(0?[1-9]|[12][0-9]|3[01])$/;


  // Ensure the input matches the desired formats
  const handleSearchInputChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    console.log(`@handleSearchInputChange() value => ${value}`);

    // if (value && !yearRegex.test(value) && !monthYearRegex.test(value) && !dateRegex.test(value))
    if (value && !yearRegex.test(value) && !yearMonthRegex.test(value) && !yearMonthDayRegex.test(value)) {
      form.setFields([
        {
          name: 'searchTerm',
          errors: ['Please enter a valid date format (e.g., YYYY, YYYY/MM, or YYYY/MM/DD)'],
        },
      ]);
    } else {
      form.setFields([
        {
          name: 'searchTerm',
          errors: [],
        },
      ]);
    }
  };
  
  // Filter the histroy list
  const filteredHistoryList = historyList != null ? historyList.filter((item) => 
    new Date(item.appointmentDate).toLocaleString("en-ZA").includes(searchTerm)
  ) : [];


  useEffect(() => {
    console.log("filterdHistoryList: ", filteredHistoryList);
  }, [searchTerm]);

  return (
    <Layout>
      <Tabs className="emp-tab">
        {/* 
      *
      *
      Appointments
      * 
      * 
      */}

        <Tabs.TabPane tab="Appointments" key={0}>
          <>
            <Modal
              title="Pick a new Date"
              open={open}
              okText={"Reschedule"}
              onOk={handleReschedule}
              confirmLoading={confirmLoading}
              onCancel={handlePopupCancelForReschedule}
            >
              <div className="emp-appointment-container-secondary-1">
                <div>
                  <div
                    className="date-picker-and-selector"
                    key={
                      unavailableDates !== null
                        ? unavailableDates.length
                        : "dps0"
                    }
                  >
                    <div className="date-picker">
                      <DatePicker
                        selected={selectedDate}
                        onChange={handleDateChange}
                        excludeDates={unavailableDates}
                        placeholderText="Select a date"
                        minDate={new Date()}
                        maxDate={
                          new Date(
                            new Date().getFullYear(),
                            new Date().getMonth(),
                            currentMonthLength()
                          )
                        }
                        inline
                      />
                    </div>

                    <div className="date-selector">
                      <h5>Available Session</h5>
                      <div className="date-selector-info">
                        <p>
                          Date:{" "}
                          {selectedDateObject !== null
                            ? new Date(
                                selectedDateObject.date
                              ).toLocaleDateString()
                            : null}
                        </p>
                        <p>Time: {selectedDateObject?.nextAppointmentTime}</p>
                        <p>No: {selectedDateObject?.nextAppointmentNo}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Modal>
          </>

          <div className="emp-appointment-container-main">
            <div className="emp-appointment-container-secondary-1">
              <div>
                <p className="emp-appointment-container-secondary-1-title">New Appointment</p>
                <div
                  className="date-picker-and-selector"
                  key={
                    unavailableDates !== null ? unavailableDates.length : "dps0"
                  }
                >
                  <div className="date-picker">
                    <DatePicker
                      selected={selectedDate}
                      onChange={handleDateChange}
                      excludeDates={unavailableDates}
                      placeholderText="Select a date"
                      minDate={new Date()}
                      maxDate={
                        new Date(
                          new Date().getFullYear(),
                          new Date().getMonth(),
                          currentMonthLength()
                        )
                      }
                      inline
                    />
                  </div>

                  <div className="date-selector">
                    <p className="date-selector-title">Available Session</p>
                    <div className="date-selector-info">
                    <div className="date-selector-info-row">
                      <p className="date-selector-info-label">Date</p>
                      <p>&nbsp;:&nbsp;</p>
                        {" "}
                        {selectedDateObject !== null
                          ? new Date(
                              selectedDateObject.date
                            ).toLocaleDateString()
                          : null}
                      </div>

                      <div className="date-selector-info-row">
                        <p className="date-selector-info-label">Time</p>
                        <p>&nbsp;:&nbsp;</p>
                        {selectedDateObject?.nextAppointmentTime}
                      </div>

                      <div className="date-selector-info-row">
                        <p className="date-selector-info-label">Number</p>
                        <p>&nbsp;:&nbsp;</p>
                        {selectedDateObject?.nextAppointmentNo}
                      </div>

                      <Button
                        className="emp-schedule-button"
                        onClick={handleSchedulePopup}
                        disabled={existingAppointment !== null ? true : false}
                      >
                        SCHEDULE
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div class="vl"></div>

            <div
              className="emp-appointment-container-secondary-2"
              key={
                existingAppointment !== null
                  ? existingAppointment.length
                  : "eacs2"
              }
            >
              <Descriptions
                title="Upcomming Appointment"
                layout="horizontal"
                column={1}
                bordered={true}
                size="small"
                items={upcommingAppointmentItems}
              />
              <div className="emp-appointment-upcomming-button-container-main">
                <div className="emp-appointment-upcomming-button-container-secondary">
                  <Button
                    className="emp-reschedule-button"
                    disabled={existingAppointment !== null ? false : true}
                    onClick={handleReschedulePopup}
                  >
                    RE-SCHEDULE
                  </Button>

                  <Button
                    className="emp-cancel-button"
                    disabled={existingAppointment !== null ? false : true}
                    onClick={handleCancelPopup}
                  >
                    CANCEL
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </Tabs.TabPane>

        {/* 
      *
      *
      Appointment History
      * 
      * 
      */}
        <Tabs.TabPane tab="History" key={1} className="emp-history-tabpane">
        <Form form={form} layout="inline" style={{marginLeft: 10}}>
          <Form.Item
            name="searchTerm"
            validateStatus={form.getFieldError('searchTerm') ? 'error' : ''}
            help={form.getFieldError('searchTerm') ? form.getFieldError('searchTerm')[0] : ''}
          >
            <div className="search-input">
            <p className="search-input-text"><SearchOutlined /></p>
            <Input
              placeholder="Search by date (e.g., YYYY, YYYY/MM, or YYYY/MM/DD)"
              value={searchTerm}
              onChange={handleSearchInputChange}
              variant="filled"
              width={50}
              style={{backgroundColor: "#eeeeee", color: "black"}}
            />
            </div>
          </Form.Item>
          
        </Form>
          <div className="emp-history-list">
            <List
              key={filteredHistoryList !== null ? filteredHistoryList.length : "hl0"}
              size="large"
              dataSource={filteredHistoryList !== null ? filteredHistoryList : []}
              renderItem={(item) => (
                <List.Item>
                  <List.Item.Meta
                    title={`Date: ${new Date(
                      item.appointmentDate
                    ).toLocaleDateString()}`}
                    //description = {`Status:  Appointment No:  Appointmet Time:  Booked On: `}
                    description={
                      <Descriptions
                        layout="horizontal"
                        column={4}
                        bordered={false}
                        size="small"
                        items={[
                          {
                            key: "1",
                            label: "Appointment Time",
                            children: `${item.appointmentTime}`,
                          },
                          {
                            key: "2",
                            label: "Appointment No",
                            children: `${item.appointmentNo}`,
                          },
                          {
                            key: "3",
                            label: "Status",
                            children: `${item.status}`,
                          },
                          {
                            key: "4",
                            label: "Booked On",
                            children: `${new Date(
                              item.updatedAt
                            ).toLocaleDateString()}`,
                          },
                        ]}
                      />
                    }
                  />
                </List.Item>
              )}
            />
          </div>
        </Tabs.TabPane>
      </Tabs>
    </Layout>
  );
};

export default MedicalAppointments;
