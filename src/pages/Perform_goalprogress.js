
import React,{useState , useEffect} from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from 'axios';
import { BarChart, Bar, Rectangle, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import "../bars2.css";
import Layout from "../components/Layout";
import { Table, Button, message, Modal, Form, Input, DatePicker,Select,Space,Upload,Radio } from 'antd';


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


function AreaProgressChartdrywet({dataC , max}) {
    const data = dataC
    return (
      <div className="progress-bar">
        <div className="progress-bar-list">
          
            
              <div className="progress-bar-item">
                <div className="bar-item-info">
                  <div className="bar-item-info-name"></div>
                  <p className="bar-item-info-value">
                    
                  </p>
                </div>
                <div className="bar-item-full">
                  <div
                    className="bar-item-filled"
                    style={{
                      width: `${(dataC * 100)/(max)}%`,
                    }}
                  ></div>
                  
                </div>
                
                    <div className="bar-item-info">
                    <p className="bar-item-info-name">Current Score</p>
                    <p className="bar-item-info-value">
                        {dataC}
                    </p>
                </div>
                
              </div>
            
          
        </div>
      </div>
    );
  };

function Compare(){


    const [progress,setprogress] = useState(null);
    const [targetv,settarget] = useState(0);
  

    
    useEffect(()=>{
        
        const getprogress = async () => {

            console.log("progress data")
            const result = await axios.get("/exceldata/goalprogress");
            console.log(result)
            const roundedProgress = result.data.map(item => ({
                ...item,
                totalscore: Math.round(item.totalscore)
              }));
            setprogress(roundedProgress)
            console.log(progress)

            const target = await axios.get("/exceldata/targetget");
            settarget(target.data.target);

        }
        
        getprogress()
    },[])
  


    const columns = [
        {
            title: 'Name',
            dataIndex: 'Name',
            key: 'Name',
        },
        {
            title: 'Employee ID',
            dataIndex: '_id',
            key: '_id',
            
            
        },
        {
            title: `Progress`,
           
          
            key: 'totalscore',
            sorter: (a, b) => a.totalscore - b.totalscore, // Add sorter function for sorting
            render: (_, record) => (
                <AreaProgressChartdrywet dataC={record.totalscore} max={targetv} />
              ),
        }

    ];
    
    
    return(
        <Layout>

            <div style={{textAlign:"right",paddingRight:20,fontWeight:600,backgroundColor:"#fafafa"}}>Goal : {targetv}</div>
            <Table dataSource={progress} columns={columns} pagination={{ pageSize: 6 }}  />


        </Layout>
      
    )
   
}

export default Compare;