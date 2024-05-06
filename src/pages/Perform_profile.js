
import React,{useState , useEffect} from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from 'axios';
import { BarChart, Bar, Rectangle, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import "../bars2.css";
import Layout from "../components/Layout"
import { Button, Divider, Flex, Radio,message } from 'antd';


function AreaProgressChartdrywet({dataC , max ,targetstate}) {
    const data = dataC
    return (
      <div className="progress-bar">
        <div className="progress-bar-info">
          
        </div>
        <div className="progress-bar-list">
          
            
              <div className="progress-bar-item">
                <div className="bar-item-info">
                  <p className="bar-item-info-name">Score</p>
                  <p className="bar-item-info-value">
                    {max}
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



function Barchart({data}){
  return(
    <ResponsiveContainer width={650} height={450}>
      <BarChart
        data={data}
        margin={{ top: 5, right: 5, left: 5, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        
        <Bar dataKey="value" fill="#8884d8" activeBar={<Rectangle fill="#8884d8" stroke="8884d8" />} />
      </BarChart>
    </ResponsiveContainer>
  );
}

function Profile(){

    const {id} = useParams()
    const [ChartData,setChartData] = useState(null);
    const [name, setName] = useState("");
    const [formdata, setFormData] = useState({
        time: ''
    });
    const [targetVal,setTarget] = useState("");
    const [targetcurrent,setTargetcurrentscore] = useState("");
    const [targetstate,settargetstate] = useState("");
    

    useEffect(()=>{
        axios.post("/exceldata/agg/",{time:formdata.time},{
          headers: {
            Authorization :`Bearer ${localStorage.getItem("token")}`,
          }
        })
        .then(res => {console.log(res);
            const data = [
                {name: "Name",value:res.data[0].Name},
                {name: "empNo",value:res.data[0].empNo},
                {name: "Grade A", value: res.data[0].totalGrade_A_Cuts},
                {name: "Grade B", value: res.data[0].totalGrade_B_Cuts},
                {name: "Grade C", value: res.data[0].totalGrade_C_Cuts},
                {name: "Grade F", value: res.data[0].totalGrade_F_Cuts},
                {name: "Yield Dry", value: res.data[0].totalYieldDry},
                {name: "Yield Wet", value: res.data[0].totalYieldCutsWet
              }
            ];
            setChartData(data);
            setName(res.data[0].Name)
            console.log(data)
            
    })
        .catch(err => console.log(err));

        axios.get("/exceldata/gettargetempid",{
          headers: {
            Authorization :`Bearer ${localStorage.getItem("token")}`,
          }
        })
        .then(res => {console.log(res);
            if(res.data){
                setTarget(res.data.target);
                settargetstate("Goal");
            }else{
                setTarget(0);
                settargetstate("NO Goals");
            }
        
        });


        axios.get("/exceldata/targetcurrentscore",{
            headers: {
              Authorization :`Bearer ${localStorage.getItem("token")}`,
            }
          })
          .then(res => {console.log(res);
            if (res.data.length > 0){
                setTargetcurrentscore(Math.round(res.data[0].averageScore));
            }else{
                setTargetcurrentscore(0);
            }
          
          }).catch(err => {
            console.log(err);
          });

    },[formdata.time])


    const download = async () => {
      try{

        const response = await axios.post("/exceldata/generate_perpdf",{time:formdata.time},{
          headers: {
            Authorization :`Bearer ${localStorage.getItem("token")}`,
          },responseType:'blob',
        });

        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download','Performance_Report.pdf');
        document.body.appendChild(link);
        link.click();
       
      }catch(error){
        console.error('Error downloading PDF:',error);
        message.error('Failed to download PDF');
      }

      

    }

    console.log(targetVal);
    if (!ChartData) {
      return <div>Loading...</div>;
  }

    const firstchart = ChartData.filter(item => item.name === "Grade A" || item.name === "Grade B" || item.name === "Grade C" || item.name === "Grade F")
    const secondchart = ChartData.filter(item => item.name === "Yield Dry" || item.name === "Yield Wet");
    
    return(
      <Layout>
      <div>
          <div style={{display: "flex", justifyContent: "space-between", marginTop:"0px" , marginLeft:"0px", marginRight:"0px",marginBottom:"0px",backgroundColor:"#fafaf0",paddingLeft:20,paddingBottom:10,borderRadius:20}}>
            <div style={{ flex:1 , marginTop:20}}> 
            <div style={{fontSize:"22px"}}>{name}</div>

            <Radio.Group value={formdata} onChange={(e)=>{
                        console.log("lllll")
                        console.log(e.target.value);
                        console.log("llllll")
                        setFormData({...formdata, time: e.target.value})
                    }}
                    style={{ display: 'block' }}>
            <Radio.Button style={{ backgroundColor: '#ffc658',color:'#000000',fontWeight:'bold'}}  value="week">Week</Radio.Button>
            <Radio.Button style={{ backgroundColor: '#ffc658',color:'#000000',fontWeight:'bold'}} value="month">Month</Radio.Button>
            <Radio.Button style={{ backgroundColor: '#ffc658',color:'#000000',fontWeight:'bold'}} value="year">Year</Radio.Button>
          </Radio.Group>
          <div style={{marginTop:10}}>
              <Button onClick={download}>Download</Button>
             </div>
             </div>
             
            <div style={{ flex:0.6,marginTop:0}}>
            <AreaProgressChartdrywet dataC={targetcurrent} max={targetVal} targetstate = {targetstate}/>
            </div>
            
          </div>
          <div style={{ marginTop:"20px" , marginLeft:"20px", marginRight:"20px"}}> 

        
            
        </div>
          
      
        <div style={{ display: "flex", justifyContent: "space-between",paddingTop:40}}>
        
          <div style={{ flex:1}}>
            <div style={{textAlign:"center"}}> Cut Grades Metarics</div>
            <Barchart data={firstchart}></Barchart>
          </div>
          <div style={{ flex:1}}>
          <div style={{textAlign:"center"}}> Yield Metarics</div>
            <Barchart data={secondchart}></Barchart>
          </div>
          
        </div>
      </div>
      </Layout>
    )
   
}

export default Profile;