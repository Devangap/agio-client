import React from "react";
import { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "../MedDatePicker.css";
import { Button, Form, Input, Item } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { showLoading, hideLoading } from "../redux/empalerts";
import { toast } from "react-hot-toast";
import axios from "axios";

/* get the length of the current month */
function currentMonthLength() {
  const thirtyOneDayMonths = [0, 2, 4, 6, 7, 9, 11];
  const thirtyDayMonths = [3, 5, 8, 10];

  let length = -1;
  const currentMonth = new Date().getMonth();

  if (thirtyOneDayMonths.indexOf(currentMonth) != -1) {
    length = 31;
  } else if (thirtyDayMonths.indexOf(currentMonth) != -1) {
    length = 30;
  } else if (new Date.getFullYear() / 4 == 0) {
    length = 29;
  } else {
    length = 28;
  }

  return length;
}

/* get unavailable dates */
function getUnavailableDates(aDates) {
  let i = 0;
  let length = currentMonthLength();

  const uDates = new Array();
  for (i = 1; i <= length; i++) {
    if (aDates.indexOf(i) == -1) {
      uDates.push(i);
    }
  }

  return uDates;
}

// available dates
const aDates = [21, 22, 25, 28];
const uDates = getUnavailableDates(aDates);

//const uDatesList = [new Date(), new Date(new Date().getFullYear(), new Date().getMonth(), 19)];
//const uDatesList = uDates.map((date) => new Date(new Date().getFullYear(), new Date().getMonth(), date));
/* set unavailable dates */
const uDatesList = uDates.map(
  (date) =>
    new Object({
      date: new Date(new Date().getFullYear(), new Date().getMonth(), date),
      message: "unavailable",
    })
);

// date picker main
const MedDatePicker = () => {
  //temporary variables
  const time = new Date().toTimeString().split(" ")[0];
  const no = 14;

  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.user);
  const navigate = useNavigate();

  const [selectedDate, setSelectedDate] = useState(new Date());
  const handleDateChange = (date) => {
    setSelectedDate(date);
    console.log(date);
  };

  // data submission
  const onFinish = async (values) => {
    try {
      dispatch(showLoading());
      const response = await axios.post(
        "/api/user/medical-appointments",
        {
          ...values,
          userId: user._id,
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
    }
  };

  return (
    <div className="select-date">
      <h4>New Appointment</h4>
      <div className="date-picker-and-selector">
        <div className="date-picker">
          <DatePicker
            selected={selectedDate} //selectedDate
            onChange={(date) => handleDateChange(date)} //setSelectedDate(date)
            excludeDates={uDatesList}
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
              {selectedDate.toDateString() != new Date().toDateString()
                ? selectedDate.toDateString()
                : "pick a date"}
            </p>
            <p>Time: {time}</p>
            <p>No: {no}</p>

            <Form className="new-appointment-form" onFinish={onFinish}>
              <Form.Item hidden label="Date" name="appointmentDate">
                <Input
                  placeholder="Date"
                  type="date"
                  value={selectedDate.toDateString()}
                />
              </Form.Item>

              <Form.Item hidden label="Time" name="appointmentTime">
                <Input placeholder="Time" type="time" value={time} />
              </Form.Item>

              <Form.Item hidden label="Number" name="appointmentNo">
                <Input placeholder="Number" type="number" value={no} />
              </Form.Item>
              <Button className="schedule-button" htmlType="submit">
                SCHEDULE
              </Button>
            </Form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MedDatePicker;
