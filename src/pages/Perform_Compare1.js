
import React,{useState , useEffect} from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from 'axios';
import { BarChart, Bar, Rectangle, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import "../bars.css";
import "../mainbar.css";
import { Provider } from 'react-redux';
import store from '../redux/store';
import Layout from "../components/Layout";
import { Button, Divider, Flex, Radio } from 'antd';

function AreaProgressChart({dataC,maxval}) {
  const data = dataC
  
  console.log("emp1:");
  console.log(maxval)
  return (
    <div className="progress-bar">
      <div className="progress-bar-info">
        <h4 className="progress-bar-title">Cut Grades</h4>
      </div>
      <div className="progress-bar-list">
        {data?.map((progressbar) => {
          return (
            <div className="progress-bar-item" key={progressbar.id}>
              <div className="bar-item-info">
                <p className="bar-item-info-name">{progressbar.name}</p>
                <p className="bar-item-info-value">
                  {progressbar.value}
                </p>
              </div>
              <div className="bar-item-full">
                <div
                  className="bar-item-filled"
                  style={{
                    width: `${(progressbar.value * 100)/(maxval+2)}%`,
                  }}
                ></div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};


function AreaProgressChartdrywet({dataC , maxval}) {
  const data = dataC
  return (
    <div className="progress-bar">
      <div className="progress-bar-info">
        <h4 className="progress-bar-title"> Yield metrics</h4>
      </div>
      <div className="progress-bar-list">
        {data?.map((progressbar) => {
          return (
            <div className="progress-bar-item" key={progressbar.id}>
              <div className="bar-item-info">
                <p className="bar-item-info-name" >{progressbar.name}</p>
                <p className="bar-item-info-value">
                  {progressbar.value}
                </p>
              </div>
              <div className="bar-item-full">
                <div
                  className="bar-item-filled"
                  style={{
                    width: `${(progressbar.value * 100)/(maxval+2)}%`,
                  }}
                ></div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

function CompareChart({dataC}){
    
  return (
    <div style={{ transform: "scaleX(-1)" }}>
      <ResponsiveContainer width={600} height={300}>
        <BarChart
          data={dataC}
          layout="vertical"
          margin={{
            top: 5,
            right: 20,
            left: 20,
            bottom: 5,
          }}
          style={{ boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)" }}
        >
          
          <XAxis type="number" display = "none" /> {/* Use type="number" for vertical orientation */}
          <YAxis dataKey="name" type="category" display = "none"/> {/* Use type="category" for vertical orientation */}
          
          
          <Bar dataKey="Emp1" fill="#8884d8" >
            
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
      
}

function CompareChart2({ dataC }) {

  const reversedData = dataC;

  // Find the maximum value in the dataset
  const maxDataValue = Math.max(...reversedData.map(entry => entry.Emp2));

  return (
    <div>
      <ResponsiveContainer width={600} height={300}>
        <BarChart
          data={reversedData}
          layout="vertical"
          margin={{
            top: 5,
            right: 20,
            left: 20,
            bottom: 5,
          }}
          style={{ boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)" }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis type="number" domain={[0,maxDataValue]} />
          <YAxis dataKey="name" type="category" />
          <Tooltip />
          <Legend />
          <Bar dataKey="Emp2" fill="#8884d8" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );

}

function Compare(){

    const {id} = useParams()
    console.log(id)
    const [formdata, setFormData] = useState({
        time: ''
    });
    console.log("time")
    console.log(formdata.time);
    const [Employee1,setEmployee1] = useState(null);
    const [Employee1Name,setEmployee1Name] = useState(null);

    const [Employee2,setEmployee2] = useState(null);
    const [Employee2Name,setEmployee2Name] = useState(null);
    
  

    
    useEffect(()=>{
      
        axios.post("/exceldata/agg/"+id,{time:formdata.time})
        .then(res => {console.log(res);
          if(res.data.length > 0){
            const data = [
              {name: "empNo",value:res.data[0].empNo},
              {name: "Grade A", value: res.data[0].totalGrade_A_Cuts},
              {name: "Grade B", value: res.data[0].totalGrade_B_Cuts},
              {name: "Grade C", value: res.data[0].totalGrade_C_Cuts},
              {name: "Grade F", value: res.data[0].totalGrade_F_Cuts},
              {name: "Yield Dry", value: res.data[0].totalYieldDry},
              {name: "Yield Wet", value: res.data[0].totalYieldCutsWet}
            ];
            setEmployee1(data);
            setEmployee1Name(res.data[0].Name);
          }else{
            const data = [
              { name: "Grade A", value: 0 },
              { name: "Grade B", value: 0 },
              { name: "Grade C", value: 0 },
              { name: "Grade F", value: 0 },
              { name: "Yield Dry", value: 0 },
              { name: "Yield Wet", value: 0 },
            ];
            setEmployee1(data)
          }
    })
        .catch(err => console.log(err));
        
        axios.post("/exceldata/agg/",{time:formdata.time},{
          headers: {
            Authorization :`Bearer ${localStorage.getItem("token")}`,
          }
        })
        .then(res => {console.log(res);
          if(res.data.length > 0){

          
            const data = [
              {name: "Grade A", value: res.data[0].totalGrade_A_Cuts},
              {name: "Grade B", value: res.data[0].totalGrade_B_Cuts},
              {name: "Grade C", value: res.data[0].totalGrade_C_Cuts},
              {name: "Grade F", value: res.data[0].totalGrade_F_Cuts},
              {name: "Yield Dry", value: res.data[0].totalYieldDry},
              {name: "Yield Wet", value: res.data[0].totalYieldCutsWet}
            ];
            setEmployee2(data);
            setEmployee2Name(res.data[0].Name);
          }else{
            const data = [
              { name: "Grade A", value: 0 },
              { name: "Grade B", value: 0 },
              { name: "Grade C", value: 0 },
              { name: "Grade F", value: 0 },
              { name: "Yield Dry", value: 0 },
              { name: "Yield Wet", value: 0 },
            ];
            setEmployee2(data);
          }
            
    })
        .catch(err => console.log(err));

    },[formdata.time])
  

    if (!Employee1 || !Employee2) {
      return <div>Loading...</div>;
  }
    
    const charcdatacutsemp1 = [
        {name : 'Grade A', value:Employee1.find(item => item.name === "Grade A").value || 0},
        {name : 'Grade B', value:Employee1.find(item => item.name === "Grade B").value || 0 },
        {name : 'Grade C', value:Employee1.find(item => item.name === "Grade C").value || 0},
        {name : 'Grade F', value:Employee1.find(item => item.name === "Grade F").value || 0},
       
    ];
    // Extracting an array of values from charcdatacutsemp1
    const valuesEmp1 = charcdatacutsemp1.map(entry => entry.value);

    // Finding the maximum value
    const maxEmp1Value = Math.max(...valuesEmp1);

    console.log("Maximum value for Employee 1:", maxEmp1Value);

    const charcdatacutsemp2 = [
      {name : 'Grade A', value:Employee2.find(item => item.name === "Grade A").value ||0 },
      {name : 'Grade B',value:Employee2.find(item => item.name === "Grade B").value || 0 },
      {name : 'Grade C',value:Employee2.find(item => item.name === "Grade C").value || 0},
      {name : 'Grade F',value:Employee2.find(item => item.name === "Grade F").value || 0},
      
  ];

  // Extracting an array of values from charcdatacutsemp1
  const valuesEmp2 = charcdatacutsemp2.map(entry => entry.value);

  // Finding the maximum value
  const maxEmp2Value = Math.max(...valuesEmp2);

  const max = Math.max(maxEmp1Value,maxEmp2Value);

  console.log("Maximum value for Employee 2:", maxEmp2Value);
    const drywetemp1 = [
      {name : 'Yield Dry', value:(Employee1.find(item => item.name === "Yield Dry") || {value: 0}).value},
      {name : 'Yield Wet', value:(Employee1.find(item => item.name === "Yield Wet") || {value: 0}).value}
        
    ];

      const yvaluesEmp1 = drywetemp1.map(entry => entry.value);

  // Finding the maximum value
      const ymaxEmp1Value = Math.max(...yvaluesEmp1);



      

      const drywetemp2 = [
      {name : 'Yield Dry', value:(Employee2.find(item => item.name === "Yield Dry") || {value: 0}).value},
      {name : 'Yield Wet', value:(Employee2.find(item => item.name === "Yield Wet") || {value: 0}).value}
        
    ];

    const yvaluesEmp2 = drywetemp2.map(entry => entry.value);

  // Finding the maximum value
      const ymaxEmp2Value = Math.max(...yvaluesEmp2);
      const ymax = Math.max(ymaxEmp1Value,ymaxEmp2Value);
      console.log("Maximum value for yield:", ymax);
    

    return(
      
        <Layout >
        <div style={{display:"flex",justifyContent:"space-around",backgroundColor:'#e3e1e1',height:"50px",alignItems:"center",marginBottom:"20px"}}>
        <div style={{textAlign:"center",fontSize:20,backgroundColor:'#e3e1e1',borderTopRightRadius:5,width:"300px"}}>
          <div >{Employee1Name}</div>
          </div>          <div>
            <Radio.Group value={formdata} onChange={(e)=>{
                        console.log("lllll")
                        console.log(e.target.value);
                        console.log("llllll")
                        setFormData({...formdata, time: e.target.value})
                    }}
                    style={{ display: 'block' }}>
            <Radio.Button  value="week">Week</Radio.Button>
            <Radio.Button value="month">Month</Radio.Button>
            <Radio.Button value="year">Year</Radio.Button>
          </Radio.Group>
          </div>
          <div style={{textAlign:"center",fontSize:20,backgroundColor:'#e3e1e1',borderTopRightRadius:5,width:"300px"}}>
          <div >{Employee2Name}</div>
          </div>
          </div>

      <div style={{ display: "flex", justifyContent: "space-between" , height: '80%', overflowY: 'auto'}}>
        <div style={{ flex:1}}>
          
        <div style={{boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.1)'}}><AreaProgressChart dataC={charcdatacutsemp1} maxval={max}/>
        <AreaProgressChartdrywet dataC={drywetemp1} maxval={ymax}/>
        </div>
        </div>
        <div style={{marginTop:"20px" , marginLeft:"0px", marginRight:"0px", width:"100px"}}> 
        
            
        </div>
        <div style={{ flex:1}}>
        <div style={{boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.1)'}}>
          <AreaProgressChart dataC={charcdatacutsemp2} maxval={max}/>
          <AreaProgressChartdrywet dataC={drywetemp2} maxval={ymax}/>
        </div>  
        </div>
        
      </div>
      </Layout>
      
    )
   
}

export default Compare;