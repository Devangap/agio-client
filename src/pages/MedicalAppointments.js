import React, { useEffect, useState } from "react";
import Layout from "../components/Layout";
import { Form, Input, Button, Descriptions } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { showLoading, hideLoading } from "../redux/empalerts";
import { toast } from "react-hot-toast";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "../MedDatePicker.css";

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

/*function getUnavailableDates(aDates) {
  const length = currentMonthLength();
  const uDates = [];

  for (let i = 1; i <= length; i++) {
    if (!aDates.includes(i)) {
      uDates.push(new Date(new Date().getFullYear(), new Date().getMonth(), i));
    }
  }

  return uDates;
}*/

const aDates = [21, 22, 25, 28];
const uDates = [];//getUnavailableDates(aDates);



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

  // Available dates objects
  const [availableDateObjects, setAvailableDateObjects] = useState(null);

  // Available dates
  const [availableDates, setAvailableDates] = useState([]);

  // Unavailable dates
  const [unavailableDates, setUnavailbleDates] = useState([]);

  // Existing appointment
  const [existingAppointment, setExistingAppointment] = useState(null);

  //Upcomming appointment items to display in <Description/> componenet
  const [upcommingAppointmentItems, setUpcommingAppointmentItems] = useState([
    {
      key: '1',
      label: 'Date',
      children: '',
    },
    {
      key: '2',
      label: 'Time',
      children: '',
    },
    {
      key: '3',
      label: 'Queue No',
      children: '',
    },
    {
      key: '4',
      label: 'Status',
      children: '',
    },
    {
      key: '5',
      label: 'Reminder Status',
      children: '',
    },
    {
      key: '6',
      label: 'Booked On',
      children: '',
    },
    ])

  /* ============= Functions ============== */

  /*
  Get the user
  */
  const getUser = async () => {
    dispatch(showLoading());

    try {
      const response = await axios.post('/api/employee/get-employee-info-by-id', {} , {
          headers: {
              Authorization: 'Bearer ' + localStorage.getItem('token')
          },
      });

      if (response.data.success) {
        setUserId(response.data.data._id);
      }
      dispatch(hideLoading());

      console.log("@getUser() @MedAppointments User info => ", response.data);
    } catch (error) {
      dispatch(hideLoading());
      console.log("Error occured when retrieving user info @getUser() @MedAppointments => ", error);
    }

  }


  /*
  Read existing appointment
  */
  const retrieveExisitngAppointment = async () => {
    try {
      dispatch(showLoading());
      
      //console.log(user);
      const response = await axios.post(
        "/api/medEmployee/medical-appointment-read-one-specific",
      {id: userId},
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
      } else {
        setExistingAppointment(null);
      }

      // Log the status message
      console.log(`@retrieveExistingAppointment() @MedicalAppointments() => ${response.data.message}`);

    } catch (error) {
      dispatch(hideLoading());

      console.log("Error occured when retrieving existing appointment @retrieveExistingAppointment() @MedicalAppointments() => ", error);
      toast.error("Error occured when retrieving existing appointment");
    }
  }


  /*
  Set existing appointment details for the <Description/> component
  */
  const setExistingAppointmentToDisplay = () => {
    var newUpcommingAppointmentItems = [
      {
        key: '1',
        label: 'Date',
        children: `${existingAppointment.appointmentDate.split("T")[0]}`,
      },
      {
        key: '2',
        label: 'Time',
        children: `${existingAppointment.appointmentTime}`,
      },
      {
        key: '3',
        label: 'Queue No',
        children: `${existingAppointment.appointmentNo}`,
      },
      {
        key: '4',
        label: 'Status',
        children: `${existingAppointment.status}`,
      },
      {
        key: '5',
        label: 'Reminder Status',
        children: `${existingAppointment.isReminderSet ? "Reminder is set" : "Reminder is not set"}`,
      },
      {
        key: '6',
        label: 'Booked On',
        children: `${existingAppointment.updatedAt.split("T")[0]}`,
      },
     ];

     setUpcommingAppointmentItems(newUpcommingAppointmentItems);
  }


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
      )

      // Set available date objects
      if (response.data.success) {
        setAvailableDateObjects(response.data.fetched);
      }

      dispatch(hideLoading());
      
    } catch (error) {
      dispatch(hideLoading());

      console.log("Error occured when retrieving available dates @getAvailableDates() @MedicalAppointments() => ", error);
      toast.error("Error occured when retrieving available dates");
    }
  }


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
  }


  /*
  Set up unavailable date list
  */
  const getUnavailableDates = () => {
    const length = currentMonthLength();
    const aDates = availableDates;
    const uDates = [];

    for (let i = 1; i <= length; i++) {
      if (!aDates.includes(i)) {
        uDates.push(new Date(new Date().getFullYear(), new Date().getMonth(), i));
      }
    }

    setUnavailbleDates(uDates);
  }


  /*
  Handle changes of the selected dates
  */
  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  
  /*
  Create new appointment
  */
  const onFinish = async (values) => {
    try {
      dispatch(showLoading());

      const response = await axios.post(
        "/api/medEmployee/medical-appointment-create-new",
        {
          ...values,
          id: userId,
          appointmentDate: selectedDate.toISOString().split("T")[0],
          appointmentTime: time,
          appointmentNo: no,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      dispatch(hideLoading());
      if (response.data.success) {
        toast.success(response.data.message);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      dispatch(hideLoading());
      toast.error("Something went wrong");
      console.error(error);
    }
  };

  // Temporary parameters
  const time = new Date().toTimeString().split(" ")[0];
  const no = 14;



  /* ============= Function useEffects ============== */

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
    console.log("@retrieveExistingAppointment() @MedicalAppointments() ExistingAppointment =>", existingAppointment);
  }, [existingAppointment]); 

  // setExistingAppointmentToDisplay()
  useEffect(() => {
    if (existingAppointment !== null) {
    setExistingAppointmentToDisplay();
    }
  }, [existingAppointment]);

  // getAvailableDateObjects()
  useEffect(() => {
    getAvailableDateObjects();
  }, [])

  // Log available date objects
  useEffect(() => {
    console.log("@getAvailableDateObjects() @MedicalAppointments() Available date objects =>", availableDateObjects);
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




  return (
    <Layout>
      <div className="emp-appointment-container-main">
      <div className="emp-appointment-container-secondary-1">
        <div>
        <h4>New Appointment</h4>
        <div className="date-picker-and-selector">
          <div className="date-picker" key={unavailableDates !== null ? unavailableDates.length : "dp0"}>
            <DatePicker
              selected={selectedDate}
              onChange={handleDateChange}
              excludeDates={unavailableDates}
              placeholderText="Select a date"
              minDate={new Date()}
              maxDate={new Date(new Date().getFullYear(), new Date().getMonth(), currentMonthLength())}
              inline
            />
          </div>

          <div className="date-selector">
            <h5>Available Session</h5>
            <div className="date-selector-info">
              <p>Date: {selectedDate.toDateString()}</p>
              <p>Time: {time}</p>
              <p>No: {no}</p>

              <Form className="new-appointment-form" onFinish={onFinish}>
                <Form.Item name="appointmentDate" hidden>
                  <Input value={selectedDate.toISOString().split("T")[0]} />
                </Form.Item>
                <Form.Item name="appointmentTime" hidden>
                  <Input value={time} />
                </Form.Item>
                <Form.Item name="appointmentNo" hidden>
                  <Input value={no} />
                </Form.Item>
                <Button className="emp-schedule-button" htmlType="submit" disabled={existingAppointment !== null ? true : false}>
                  SCHEDULE
                </Button>
              </Form>
            </div>
          </div>
        </div>
        </div>
      </div>
      
      <div className="emp-appointment-container-secondary-2" key={existingAppointment !== null ? existingAppointment.length : "eacs2"}>
        <Descriptions title="Upcomming Appointment" layout="horizontal" column={1} bordered={true} size="small" items={upcommingAppointmentItems}/>
        <div className="emp-appointment-upcomming-button-container-main">
        <div className="emp-appointment-upcomming-button-container-secondary">
          <Button className="emp-reschedule-button" htmlType="submit" disabled={existingAppointment !== null ? false : true}>
            RE-SCHEDULE
          </Button>

          <Button className="emp-cancel-button" htmlType="submit" disabled={existingAppointment !== null ? false : true}>
          CANCEL
          </Button>
          </div>
        </div>
      </div>
      </div>
    </Layout>
  );
};

export default MedicalAppointments;
