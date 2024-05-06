
import React,{useState , useEffect} from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from 'axios';
import { BarChart, Bar, Rectangle, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Sector } from 'recharts';
import {Select , Button,Radio,message} from 'antd';
import { Provider } from 'react-redux';
import store from '../redux/store';
import Layout from "../components/Layout";



function Barchart({data}){
  return(
    <ResponsiveContainer width="100%" height={400}>
      <BarChart
        data={data}
        margin={{ top: 5, right: 5, left: 5, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        
        <Bar radius={[5,5,0,0]} dataKey="value" fill="#8884d8" shape={Rectangle} activeBar={<Rectangle fill="#aba9d3" stroke="#aba9d3" />} />
      </BarChart>
    </ResponsiveContainer>
  );
}

function Perform_viewempAdmin(){

    const {id} = useParams()
    const [ChartData,setChartData] = useState(null);
    const [name, setName] = useState("");
    const [formdata, setFormData] = useState({
      time: ''
  });
  const navigate = useNavigate();
    

    useEffect(()=>{
        axios.post("/exceldata/agg/"+id,{time:formdata.time})
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
            
    })
        .catch(err => console.log(err));

    },[formdata.time])

    if (!ChartData) {
      return <div>Loading...</div>;
  }

    const firstchart = ChartData.filter(item => item.name === "Grade A" || item.name === "Grade B" || item.name === "Grade C" || item.name === "Grade F")
    const secondchart = ChartData.filter(item => item.name === "Yield Dry" || item.name === "Yield Wet");
    
    const download = async () => {
        try{
  
          const response = await axios.post("/exceldata/generate_perpdf/"+id,{time:formdata.time},{
            responseType:'blob',
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

    


    return(
      
        <Layout>
      <div>
          <div style={{display: "flex", justifyContent: "center", marginTop:"0px" , marginLeft:"0px", marginRight:"0px",paddingLeft:20,paddingBottom:"10px",paddingTop:"10px",textAlign:"center",backgroundColor:'#fafaf0',borderRadius:20,flexDirection:"column"}}>
            <div style={{fontSize:"20px"}}>{name}</div>
            <div style={{display:"flex",justifyContent:"space-around",marginBottom:"10px",marginTop:"10px"}}>



          <Radio.Group value={formdata} onChange={(e)=>{
                        console.log("lllll")
                        console.log(e.target.value);
                        console.log("llllll")
                        setFormData({...formdata, time: e.target.value})
                    }}
                    style={{ display: 'block' }}>
            <Radio.Button style={{ backgroundColor:'#ffc658',color:'#000000',fontWeight:'bold'}} value="week">Week</Radio.Button>
            <Radio.Button style={{ backgroundColor: '#ffc658',color:'#000000',fontWeight:'bold' }} value="month">Month</Radio.Button>
            <Radio.Button style={{ backgroundColor: '#ffc658',color:'#000000',fontWeight:'bold' }} value="year">Year</Radio.Button>
          </Radio.Group>
        
          <Button  onClick={download}>Download</Button>

          </div>
            
          </div>
         

          

          
          <div style={{marginBottom:"40px"}}>

          

          </div>
      
        <div style={{ display: "flex", justifyContent: "space-between"}}>
          <div style={{ flex:1}}>
            <div style={{textAlign:"center",fontSize:20,fontWeight:"500",marginBottom:"10px"}}>Cuts Grade metrics</div>
            <Barchart data={firstchart}></Barchart>
          </div>
          <div style={{ flex:1}}>
            <div style={{textAlign:"center",fontSize:20,fontWeight:"500",marginBottom:"10px"}}>Yield metrics</div>
            <Barchart data={secondchart}></Barchart>
          </div>
          
        </div>

      
      </div>
      </Layout>
      
    )
   
}

export default Perform_viewempAdmin;