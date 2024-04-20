import React, { useEffect } from "react";
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

/*
get the length of the current month
*/
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
**
**
main function
**
**
*/
const MedParameters = () => {
  const dispatch = useDispatch();

  // Selected Dates to display in the datepicker
  const [selectedDates, setSelectedDates] = useState([]);

  // Date object list
  const [dateObjectsList, setDateObjectsList] = useState([]);

  // Date object length as key to include in date-list component
  const [dateListKey, setDateListKey] = useState(dateObjectsList.length);

  // IDs of the saved dates
  const [savedDateIds, setSavedDatesIds] = useState([]);

  // If the existing dates have been checked or not
  const [checkedExistingDates, setCheckedExistingDates] = useState(false);

  // Default parameter values
  const [defaultParameterValues, setDefaultParameterValues] = useState(null);



  /* =============== Manage Dates ===================== */

  /*
  Manage selected and deselectd dates
  */
  const onChange = async (dates) => {
    console.log("@onChange @medParameters dates:", dates);

    const currentDateList = [];
    const previousDateList = dateList;
    const currentDateObjectList = dateObjectsList;
    const cleanedDateObjectList = [];

    var removedDate = null;
    var removedIsoDate = null;
    var removedDateObj = null;

    // To keep track of currently selected dates
    // currentDateList changes when the user select or deselect dates
    for (let date of dates) {
      currentDateList.push(date.toString());
    }

    // To keep track of the dates before current changes
    for (let pDate of previousDateList) {
      // Check if a previously selected date has be deselected
      if (!currentDateList.includes(pDate)) {
        removedDate = new Date(pDate);
        removedIsoDate = removedDate.toISOString();
      } else {
        // If none has been deselected set the
        // current list as selectedDates @date-picker
        setSelectedDates(dates);
      }
    }

    // Get the corresponding date-object of the deselected date
    for (let dateObj of currentDateObjectList) {
      if (dateObj.date == removedIsoDate) {
        removedDateObj = dateObj;
      }
    }

    // Check if the deselcted date is already saved
    if (removedDate != null && removedDateObj._id != -99) {

      // Check if the deselected date has scheduled appointments
      // Don't remove the date if there are scheduled dates
      if (removedDateObj.appointmentCount > 0) {
        const confirmation = window.confirm(
          `The date: ${removedDate} already has scheduled appointments\nDate cannot be reomved!`
        );
        if (confirmation) {
          var newDates = dates;
          newDates.push(removedDate);

          setSelectedDates(newDates); // Select the date
        } else {
          newDates = dates;
          newDates.push(removedDate);

          setSelectedDates(newDates); // Select the date
        }
        //
      } else {
        const confirmation = window.confirm(
          `The date: ${removedDate} is already saved\nAre you sure you want to remove the selected date?`
        );

        if (confirmation) { // Confirm to deselct the date
          setSelectedDates(dates); // Deselect the date

          // Delete the record
          try {
            const deleteResponse = await axios.post(
              "/api/medDoctor/medical-available-dates-delete-existing",
              { id: removedDateObj._id },
              {
                headers: {
                  Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
              }
            );

            if (deleteResponse.data.success) {
              toast.success(
                `Deleted the saved record for the date: ${removedDateObj.date}`
              );
            } else {
              toast.error(
                `Deleting the saved record for the date: ${removedDateObj.date} failed`
              );
            }


          } catch (error) {
            console.log(
              "Error occured when deleting the record for the date ID: ",
              removedDateObj._id
            );
            toast.error(
              "Error occured when deleting the record for the selected date"
            );
          }

          // Get the date object list without the deselected date's object
          for (let dateObj of currentDateObjectList) {
            if (dateObj.date == removedIsoDate) {
              continue;
            } else {
              cleanedDateObjectList.push(dateObj);
            }
          }

          console.log(
            "Cleaned Object List @onChange @medParameters: ",
            cleanedDateObjectList
          );

          // Set existing date list to not containt the deselected object
          //setCheckedExistingDates(cleanedDateObjectList);
          // Re-render the existing available dates to reflect changes
          getExistingAvailableDates();

        } else { // If reject deselecting date

          var newDates = dates;
          newDates.push(new Date(removedDate));

          setSelectedDates(newDates); // Re-select the deselected date

        }
      }
    } else { /* If the date is not saved */

      // Get the date object list without the deselected date's object
      for (let dateObj of currentDateObjectList) {
        if (dateObj.date == removedIsoDate) {
          continue;
        } else {
          cleanedDateObjectList.push(dateObj);
        }
      }

      // Deselect the date
      setSelectedDates(dates);
      // Set date objects to reflect the changes
      setDateObjectsList(cleanedDateObjectList);

      // Re-render the date-list component
      setDateListKey(cleanedDateObjectList.length);
    }

  };
 

  /*
  Store multiple dates selected as strings
  */
  const dateList = [];
  for (let date of selectedDates) {
    dateList.push(date.toString());
  }
  dateList.sort().reverse();


  /* 
  Data submission - update dates
  */
  const updateDates = async (dateList) => {
    try {
      dispatch(showLoading());
      let response_check_similar;
      let response_add_date;
      let response_update_similar;

      // Update only if the date objects list contain dates =>
      //      User has already saved dates Or User has selected new dates
      if (dateObjectsList.length > 0) {

        // Convert the dates to ISO dates
        for (let dateObj of dateObjectsList) {
          const isoDate = new Date(dateObj.date).toISOString();

          // Find if there is a saved record for the date
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

          // If there is a saved record for the corresponding date
          // only update it's fields
          if (response_check_similar.data.success) {
            toast.dismiss(response_check_similar.data.message);

            response_update_similar = await axios.post(
              "/api/medDoctor/medical-update-available-date",

              {
                id: response_check_similar.data.similarDate._id,
                appointmentCount:
                  response_check_similar.data.similarDate.appointmentCount,
                maxAppointmentCount: dateObj.maxAppointmentCount,
                status: response_check_similar.data.similarDate.status,
                startTime: dateObj.startTime,
                endTime: dateObj.endTime,
                avgSessionTime: response_check_similar.data.similarDate.avgSessionTime,
                nextAppointmentTime: response_check_similar.data.similarDate.nextAppointmentTime,
                nextAppointmentNo: response_check_similar.data.similarDate.nextAppointmentNo,
                version: response_check_similar.data.similarDate.version,
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

          // If the date is not already saved, create a new record
          response_add_date = await axios.post(
            "/api/medDoctor/medical-new-available-date",
            {
              date: isoDate,
              appointmentCount: dateObj.appointmentCount,
              maxAppointmentCount: dateObj.maxAppointmentCount,
              startTime: dateObj.startTime,
              endTime: dateObj.endTime,
              avgSessionTime: dateObj.avgSessionTime,
            },
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
            }
          );
          
          // review this section again =>
          if (!response_add_date.data.success) {
            throw new Error(response_add_date.data.message);
          }
          // <=

        }
      } else {
        toast.error("No dates are selected");
      }

      dispatch(hideLoading());


      if (response_add_date.data.success) {
        toast.success(response_add_date.data.message);
      } else {
        toast.error(response_add_date.data.message);
      }

      // Re-render the saved date record to reflect he changes made
      getExistingAvailableDates();

    } catch (error) {
      dispatch(hideLoading());
      console.log("Error occured when updating dates @updateDates() @MedParameters() => ", error);
    }
  };



  /* =============== Manage Parameters ===================== */


  /*
  Set current parameter values as default inputs
  */
  useEffect(() => {
    const getDefaultValues = async () => {
      try {
        const existingRecord = await axios.post(
          "/api/medDoctor/medical-parameters-find-existing",
          {},
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        if (existingRecord.data.success) {
          setDefaultParameterValues(existingRecord.data.fetched);
        }
      } catch (error) {
        console.log(
          "Error occured when getting default parameter values: ",
          error
        );
      }
    };

    // call the method and store the current values
    getDefaultValues();
  }, []);


  /* 
  Data submission - parameters
  */
  const saveParameters = async (values) => {
    try {
      dispatch(showLoading());

      // Check if a record already exists
      const existingRecord = await axios.post(
        "/api/medDoctor/medical-parameters-find-existing",
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      console.log("Read parameter record ", existingRecord.data);

      // If a record already exists, only update the fields
      if (existingRecord.data.success) {
        const updateExisting = await axios.post(
          "/api/medDoctor/medical-parameters-update-existing",
          {
            id: existingRecord.data.fetched._id,
            maxAppointments: values.max_appointments,
            avgSessionTime: values.average_session_time,
            startTime: values.appointments_start_time,
            endTime: values.appointments_end_time,
            updatedAt: new Date(),
          },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        if (updateExisting.data.success) {
          toast.success(updateExisting.data.message);
        } else {
          toast.error(updateExisting.data.message);
        }
        dispatch(hideLoading());
      } else {
        // If there is not an exisitng record, create a new record
        const newRecord = await axios.post(
          "/api/medDoctor/medical-parameters-insert-new",
          {
            maxAppointments: values.max_appointments,
            avgSessionTime: values.average_session_time,
            startTime: values.appointments_start_time,
            endTime: values.appointments_end_time,
          },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        if (newRecord.data.success) {
          toast.success(newRecord.data.message);
        } else {
          toast.error(newRecord.data.message);
        }
        dispatch(hideLoading());
      }
    } catch (error) {
      dispatch(hideLoading());
      toast.error("Error occured when saving parameters");
      console.log(error);
    }
  };

  /* =============== Manage Dates - Date List ===================== */

  /*
  Read the existing available dates from the DB
  */
  const getExistingAvailableDates = async () => {
    
    const existingAvailableDates = await axios.post(
      "/api/medDoctor/medical-available-dates-read-existing",
      {},
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );

    // 
    if (existingAvailableDates.data.success) {
      const existingAvailableDateObjectList =
        existingAvailableDates.data.fetched;

      console.log(
        "@getExistingAvailableDates @medParamters Fetched data: ",
        existingAvailableDateObjectList
      );

      // Sort the date Objects list

      // Update the date objects list
      setDateObjectsList(existingAvailableDateObjectList);

      // To indicate if the date checking has already done
      setCheckedExistingDates(true);

      const existingAvailableDatesList = [];
      const savedDateIdsList = [];

      // Retrieve dates from the date fetched date object list
      for (let d of existingAvailableDateObjectList) {
        existingAvailableDatesList.push(new Date(d.date));
        savedDateIdsList.push(d._id); // Add saved dates' IDs to a list
      }

      // Update selected dates to reflect the retrieved saved dates
      setSelectedDates(existingAvailableDatesList);
      // Update the IDs of the already saved dates
      setSavedDatesIds(savedDateIdsList);

      console.log(
        "@existingAvailableDates @medParameters Date List for selectedDate: ",
        existingAvailableDatesList
      );
      console.log(
        "@existingAvailableDates @medParameters date Objects List: ",
        dateObjectsList
      );

      // => Should I re-render the date-list component here? <=
      // setDateListKey(dateObjectsList.length);
    }
  };

  useEffect(() => {
    // Call the method
    getExistingAvailableDates();
  }, []);

  /*
  Set dateObjects on date selection
  */
  const setDateObjects = () => {
    var matchDate;
    var matchDateObj;
    var isSaved;
    var dateObj;
    var newDateObjectList = dateObjectsList;

    //getExistingAvailableDates();
    console.log(
      "@setDateObjects @medParameters Date objects list: ",
      dateObjectsList
    );
    
    // Iterate through the selected dates
    for (let d of dateList) {
      isSaved = false;

      matchDate = new Date(d).toISOString();

      // Check if the dates objects are already saved or not
      for (let dObj of dateObjectsList) {
        matchDateObj = dObj.date;

        if (matchDate === matchDateObj && matchDateObj._id != -99) {
          isSaved = true;
        }
      }

      // If a selected date is not saved, create a new date object for it
      if (!isSaved) {
        dateObj = {
          _id: -99, // To identify as a unsaved date
          date: matchDate,
          appointmentCount: 0,
          maxAppointmentCount: defaultParameterValues.maxAppointments,
          startTime: defaultParameterValues.startTime,
          endTime: defaultParameterValues.endTime,
          avgSessionTime: defaultParameterValues.avgSessionTime,
        };

        console.log(
          `@seDateObjects @medParameters dateObject: ${dateObj.date} with id: ${dateObj._id} added`
        );

        // Add the unsaved date to the current date object list
        newDateObjectList.push(dateObj);
      }
    }

    // Sort the date object list in ascending order
    newDateObjectList.sort(function (a, b) {
      return (
        Number(a.date.split("T")[0].split("-")[2]) -
        Number(b.date.split("T")[0].split("-")[2])
      );
    });

    // Update the date object list to reflect the newly created
    // unsaved date objects
    setDateObjectsList(newDateObjectList);

    // Re-render the date-list component
    setDateListKey(dateObjectsList.length);
  };

  useEffect(() => {
    setDateObjects();
  }, [updateDates]);

  return (
    <Layout>
      
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
              <div className="date-list" key={dateListKey}>
                <ul>
                  {dateObjectsList.map((dateObject) => {
                    const date = new Date(dateObject.date);
                    const dateString = date.toDateString().split("00")[0];
                    const dateToId =
                      dateString.split(" ")[1] + dateString.split(" ")[2];

                    const handleMaxAppointmentCountValueChange = (value) => {
                      console.log(
                        `Max App. value for: ${dateObject.date}`,
                        value
                      );
                      var singleDateElement = document.getElementById(dateObject.date);
                      singleDateElement.style.backgroundColor = '#dfdfdf';
                    };

                    const handleStartTimeValueChange = (value) => {
                      console.log(
                        `StartTime value for: ${dateObject.date}`,
                        value
                      );
                      dateObject.startTime = value;
                      var singleDateElement = document.getElementById(dateObject.date);
                      singleDateElement.style.backgroundColor = '#dfdfdf';
                    };

                    const handleEndTimeValueChange = (value) => {
                      console.log(
                        `EndTime value for: ${dateObject.date}`,
                        value
                      );
                      dateObject.endTime = value;
                      var singleDateElement = document.getElementById(dateObject.date);
                      singleDateElement.style.backgroundColor = '#dfdfdf';
                    };

                    return (
                      <div className="single-date" id={dateObject.date}>
                        <Form>
                          <div className="single-date-content">
                          <Form.Item label="Date" name={`date_${dateToId}`} className="single-date-date">

                            <Input
                              type="text"
                              disabled
                              variant="borderless"
                              placeholder={dateString}
                              name={`available_date_${dateToId}`}
                              value={dateObject.date}
                              
                            />
                          </Form.Item>
                          <hr></hr>
                          <div className="single-date-content-inputs">
                          <Form.Item
                            label="Scheduled"
                            name={`scheduled_${dateToId}`}
                          >
                            <Input
                              type="number"
                              disabled
                              variant="borderless"
                              defaultValue={dateObject.appointmentCount}
                              name={`sheduled_${dateToId}`}
                              value={dateObject.appointmentCount}
                              
                            />
                          </Form.Item>

                          <Form.Item
                          
                            label="Maximum"
                            name={`maximum_${dateToId}`}
                          >
                            {/*
                            (e) => handleMaxAppointmentCountValueChange(e.target.value) creates 
                            an arrow function that takes the event (e) as an argument and calls 
                            handleMaxAppointmentCountValueChange with e.target.value.

                            e.target.value represents the current value of the input element.
                            */}

                            <Input
                              id={`max_input_${dateToId}`}
                              style={{
                                width: 20,
                              }}
                              value={dateObject.maxAppointmentCount}
                              defaultValue={dateObject.maxAppointmentCount}
                              
                              onChange={(e) =>
                                {handleMaxAppointmentCountValueChange(
                                  e.target.value
                                );
                                }
                              }
                            />
                          </Form.Item>

                          <Form.Item
                            label="Start Time"
                            name={`startTime_${dateToId}`}
                          >
                            <Input
                              id={`startTime_input_${dateToId}`}
                              style={{
                                width: 20,
                              }}
                              value={dateObject.startTime}
                              defaultValue={dateObject.startTime}
                              onChange={(e) =>
                                handleStartTimeValueChange(
                                  e.target.value
                                )
                              }
                            />
                          </Form.Item>


                          <Form.Item
                            label="Finish Time"
                            name={`finishTime_${dateToId}`}
                          >
                            <Input
                              id={`finishTime_input_${dateToId}`}
                              style={{
                                width: 20,
                              }}
                              value={dateObject.endTime}
                              defaultValue={dateObject.endTime}
                              onChange={(e) =>
                                handleEndTimeValueChange(
                                  e.target.value
                                )
                              }
                            />
                          </Form.Item>
                              </div>
                          </div>
                        </Form>
                      </div>
                    );
                  })}
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

        {/* ===================== Manage Parameters Tab =================== */}

        <Tabs.TabPane tab="Manage Parameters" key={1}>
          <div className="doc-manage-parameters-container-main">
            <div className="doc-manage-parameters-container-secondary">
          <Form onFinish={saveParameters}>
            <div className="doc-manage-parameters-inputs">
            <Form.Item label="Maximum appointments" name="max_appointments">
              <Input
                type="Number"
                required={defaultParameterValues != null ? false : true}
                defaultValue={
                  defaultParameterValues != null
                    ? defaultParameterValues.maxAppointments
                    : null
                }
                placeholder={
                  defaultParameterValues != null ? null : "Enter value"
                }
                value={
                  defaultParameterValues != null
                    ? defaultParameterValues.maxAppointments
                    : null
                }
                name="max_appointments"
              />
            </Form.Item>

            <Form.Item
              label="Average session time (Min)"
              name="average_session_time"
            >
              <Input
                type="Number"
                required={defaultParameterValues != null ? false : true}
                defaultValue={
                  defaultParameterValues != null
                    ? defaultParameterValues.avgSessionTime
                    : null
                }
                placeholder={
                  defaultParameterValues != null ? null : "Enter value"
                }
                value={
                  defaultParameterValues != null
                    ? defaultParameterValues.avgSessionTime
                    : null
                }
                name="average_session_time"
              />
            </Form.Item>

            <Form.Item
              label="Appointments start time"
              name="appointments_start_time"
            >
              <Input
                type="Time"
                required={defaultParameterValues != null ? false : true}
                defaultValue={
                  defaultParameterValues != null
                    ? defaultParameterValues.startTime
                    : null
                }
                value={
                  defaultParameterValues != null
                    ? defaultParameterValues.startTime
                    : null
                }
                name="appointments_start_time"
              />
            </Form.Item>

            <Form.Item
              label="Appointments end time"
              name="appointments_end_time"
            >
              <Input
                type="Time"
                required={defaultParameterValues != null ? false : true}
                defaultValue={
                  defaultParameterValues != null
                    ? defaultParameterValues.endTime
                    : null
                }
                value={
                  defaultParameterValues != null
                    ? defaultParameterValues.endTime
                    : null
                }
                name="appointments_end_time"
              />
            </Form.Item>
                </div>
            <div className="doc-manage-parameters-save-button-container">
              <Button className="doc-manage-parameters-save-button" htmlType="submit">
                SAVE
              </Button>
            </div>
          </Form>
          </div>
          
          </div>
        </Tabs.TabPane>
      </Tabs>
    </Layout>
  );
};

export default MedParameters;
