import React,{useEffect} from 'react'
import axios from "axios"
import Layout from '../components/Layout';
import '../ACal.css'



function AnnCalItems(props) {
    const type=props.type;
    var date=props.date;
    var initialDate=date;
    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
    var date=date.getDate()+" "+months[date.getMonth()]+" "+date.getFullYear()

    const [tName,settName]=React.useState(""); // teacher 
    const [bName,setbName]=React.useState(""); // batch

    const [fromDay,setfromDay]=React.useState(""); // from day
    const [toDay,settoDay]=React.useState(""); // to day

    const [year,setYear]=React.useState(""); // year
    const [month,setMonth]=React.useState(""); // month

    const [yearData,setYearData]=React.useState([]) // get year data
    const [monthData,setMonthData]=React.useState([]) // get month data
    const [dayData,setDayData]=React.useState([]) // get day data

    const [search,setSearch]=React.useState("");
    var [edit,setEdit]=React.useState(false);

    
    const submit=(e)=>{
        if(type==="Day")
        {
            var submitItems={
                tName,bName,fromDay,toDay,date
            }
            if(fromDay==="" || toDay===""){
                var submitItems={
                    tName,bName,fromDay:"Monday",toDay:"Saturday",date
                }
    
            }
            

            console.log(submitItems);
            dayData.push(submitItems); // push data to display in  tasks
            // call
            axios.post('/api/employee/Day',submitItems)
            .then(response=>{
                console.log(response.data);
            })
            .catch(err=>{console.log(err.message);})


            settName("");
            setbName("");
            setfromDay("");
            settoDay("");
        }
        else if(type==="Year")
        {
            var submitItems={
                tName,bName,year,date
            }
            yearData.push(submitItems); // push data to display in  tasks
            console.log(submitItems);
            axios.post('/api/employee/Year',submitItems)
            .then(response=>{
                console.log(response.data);
            })
            .catch(err=>{console.log(err.message);})

            settName("");
            setbName("");
            setYear("");
        }  
        else{
            var newMonth=months[parseInt(month.slice(-2))-1]+" "+month.slice(0,4);
            console.log(newMonth);
            var submitItems={
                tName,bName,month:newMonth,date
            }
        
            console.log(submitItems);
            monthData.push(submitItems); // push data to display in  tasks

            axios.post('/api/employee/Month',submitItems)
            .then(response=>{
                console.log(response.data);
            })
            .catch(err=>{console.log(err.message);})

            settName("");
            setbName("");
            setMonth("");


        }
        alert("Successfully Submitted");
        e.preventDefault();
    }


    
    
    






  return (
    

<div className="row">
            <div className="firstRow">
                <h3>Tasks</h3>
                <div className="searchBox">
                <input class="form-control me-2" type="search" placeholder="Search Teacher" aria-label="Search" name="search" value={search}  autoComplete="off" ></input>
                </div>
                {type==="Year"?(
                    <ul>
                        {yearData.filter((value)=>{
                            if(search===""){
                                return value
                            }
                            else if(value.tName.toLowerCase().includes(search.toLowerCase())){
                                return value
                            }

                        }).map((value,index)=>{
                            return (
                            <li>{value.tName} ({value.bName}) {value.year} <br /> 

                            <i class="fas fa-pen-square"  type="year" operation="update" tName={value.tName} bName={value.bName} year={value.year} ></i>
                            <i class="fas fa-trash-alt"  type="year" operation="delete" tName={value.tName} bName={value.bName} year={value.year} ></i>

                            <small className="yearDate">{value.date}</small></li>
                            )
                        })}
                        
                
                    </ul>
                
                ):type==="Month"?(
                <ul>
                    {monthData.filter((value)=>{
                        if(search===""){
                            return value
                        }
                        else if(value.tName.toLowerCase().includes(search.toLowerCase())){
                            return value;
                        }
                    }).map((value,index)=>{
                        return (
                            <li>{value.tName} ({value.bName}) {value.month} <br /> 
                            <i class="fas fa-pen-square" operation="update" type="month" tName={value.tName} bName={value.bName} month={value.month} ></i>
                            <i class="fas fa-trash-alt" operation="delete" type="month" tName={value.tName} bName={value.bName} month={value.month} ></i>

                            <small className="yearDate">{value.date}</small></li>
                            )
                        })}
                </ul>
                ):(
                <ul>
                    {dayData.filter((value)=>{
                        if(search===""){
                            return value
                        }
                        else if(value.tName.toLowerCase().includes(search.toLowerCase())){
                            return value;
                        }
                    }).map((value,index)=>{
                        return (
                            <li>{value.tName} ({value.bName}) ({value.fromDay}-{value.toDay}) <br /> 
                            <i class="fas fa-pen-square"  operation="update" type="day" tName={value.tName} bName={value.bName} fromDay={value.fromDay} 
                            toDay={value.toDay} ></i>
                            <i class="fas fa-trash-alt"  operation="delete" type="day" tName={value.tName} bName={value.bName} fromDay={value.fromDay} 
                            toDay={value.toDay} ></i>
                             <small className="yearDate">{value.date}</small></li>
                            )
                        })}

                    
                    
                </ul>
                )}
            </div>

            <div className="secondRow">
                <form>
                    <h3>SCHEDULE</h3>
                    <input type="text" className="form-control mb-3 mt-3" required="true" name="tName" placeholder="Teacher Name" value={tName}   ></input>

                    <input type="text" className="form-control mb-3 mt-3" required="true" name="bName" placeholder="Batch Name" value={bName}  ></input>

                    {type==="Day"?(
                    <div className="time">
                        <label className="form-label">From</label>
                        <input type="time" className="form-control"  name="fromDay" value={fromDay}  ></input>

                        <label className="form-label">To</label>
                        <input type="time" className="form-control"  name="toDay" value={toDay}   ></input>
                    </div>
                    ):type==="Month"?(

                    <div className="time">
                        <label className="form-label">MONTH</label>
                        <input type="month" className="form-control" required name="month" value={month} ></input>


                    </div>

                    ):(
                    <div className="time">
                        <label className="form-label">Year</label>
                        <input type="year" className="form-control" required name="year" value={year}  ></input>

                    </div>

                    )}
                    <button className="btn btn-primary" onClick={submit}>SUBMIT</button>
                </form>
            </div>
        </div>

    

    
  )
  
}

export default AnnCalItems