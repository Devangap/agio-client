import React from "react";
import Layout from "../components/Layout";
import { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "../MedDatePicker.css";
import { useDispatch } from "react-redux";
import { showLoading, hideLoading } from "../redux/empalerts";
import { toast } from "react-hot-toast";
import axios from "axios";
import { Button, Form, Input, Tabs } from "antd";

/* get the length of the current month */
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
    // February
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
**
**
main function
**
**
*/
const MedParameters = () => {
  const dispatch = useDispatch();

  // date picker essentials
  const [selectedDates, setSelectedDates] = useState([]);
  const onChange = (dates) => {
    setSelectedDates(dates);
  };
  const dateList = [];
  for (let date of selectedDates) {
    dateList.push(date.toString());
  }

  console.log(dateList);

  /* 
  Data submission - update dates
  */
  const updateDates = async (dateList) => {
    try {
      dispatch(showLoading());
      let response_check_similar;
      let response_add_appointment;
      let response_update_similar;

      // insert only if there are data in the date list
      if (dateList.length > 0) {
        for (let localDate of dateList) {
          // convert the dates to ISO dates
          const isoDate = new Date(localDate).toISOString();

          // find if there is a similar date
          response_check_similar = await axios.post(
            "/api/medDoctor/medical-similar-available-date",
            {
              date: isoDate,
            },
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
            }
          );
          console.log("Check_similar: ", response_check_similar);

          // if there is a similar date, only update it's fields
          if (response_check_similar.data.success) {
            toast.dismiss(response_check_similar.data.message);

            response_update_similar = await axios.post(
              "/api/medDoctor/medical-update-available-date",

              {
                id: response_check_similar.data.similarDate._id,
                appointmentCount:
                  response_check_similar.data.similarDate.appointmentCount,
                maxAppointmentCount: 30,
                status: response_check_similar.data.similarDate.status,
                updatedAt: new Date(),
              },
              {
                headers: {
                  Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
              }
            );
            console.log("Available date", response_update_similar);

            continue;
          }
          // insert the document
          response_add_appointment = await axios.post(
            "/api/medDoctor/medical-new-available-date",
            {
              date: isoDate,
              appointmentCount: 0,
              maxAppointmentCount: 20,
            },
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
            }
          );

          if (!response_add_appointment.data.success) {
            throw new Error(response_add_appointment.data.message);
          }
        }
      } else {
        toast.error("No dates are selected");
      }
      dispatch(hideLoading());
      if (response_add_appointment.data.success) {
        toast.success(response_add_appointment.data.message);
      } else {
        toast.error(response_add_appointment.data.message);
      }
    } catch (error) {
      dispatch(hideLoading());
      toast.error("Something went wrong while updating dates");
    }
  };

  /* 
  Data submission - parameters
  */
  const saveParameters = async (params) => {
    //
  }


  return (
    <Layout>
      <h1 className="page-title">Parameters</h1>
      <Tabs>
        <Tabs.TabPane tab="Manage Dates" key={0}>
          <div className="doc-date-picker-container">
            <div className="doc-date-picker">
              <DatePicker
                selectedDates={selectedDates}
                selectsMultiple
                onChange={(dates) => onChange(dates)}
                excludeDates={[
                  new Object({
                    date: new Date(),
                    message: "unavailable",
                  }),
                ]}
                shouldCloseOnSelect={false}
                disabledKeyboardNavigation
                inline
                placeholderText="Select a date"
                minDate={new Date()}
              />
            </div>
            <div className="date-list-container">
              <div className="date-list">
                <ul>
                  {dateList.map((date, index) => (
                    <div className="single-date">
                      <Form>
                        <Form.Item label="Date" name="date">
                          <Input
                            type="text"
                            disabled
                            placeholder={date.toString().split("00")[0]}
                            name={`available-date-${index}`}
                            value={date.toString().split("00")[0]}
                          />
                        </Form.Item>
                      </Form>
                    </div>
                  ))}
                </ul>
              </div>
              <Button
                className="update-dates"
                onClick={() => updateDates(dateList)}
              >
                UPDATE
              </Button>
            </div>
          </div>
        </Tabs.TabPane>

        <Tabs.TabPane tab="Manage Parameters" key={1}>
          <Form onFinish={saveParameters}>
            <Form.Item
              label="Maximum appointments"
              name="max-appointments"
            >
              <Input
                type="Number"
                placeholder={20}
                name="max-appointments"
              />
            </Form.Item>

            <Form.Item
              label="Average session time (Min)"
              name="average-session-time"
            >
              <Input
                type="Number"
                placeholder={10}
                name="average-session-time"
              />
            </Form.Item>

            <Form.Item
              label="Appointments start time"
              name="appointments-start-time"
            >
              <Input
                type="Time"
                placeholder="08:00:00"
                name="appointments-start-time"
              />
            </Form.Item>

            <Form.Item
              label="Appointments end time"
              name="appointments-end-time"
            >
              <Input
                type="Time"
                placeholder="08:00:00"
                name="appointments-end-time"
              />
            </Form.Item>

            <div className="d-flex justify-content-end">
          <Button className="primary-button" htmlType="submit">
            SAVE
          </Button>
        </div>

          </Form>
        </Tabs.TabPane>
      </Tabs>
    </Layout>
  );
};

export default MedParameters;
