import React,{useState , useEffect} from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from 'axios';
import Layout from "../components/Layout"
import "../Rank.css";
import { Provider } from 'react-redux';
import store from '../redux/store';
import { Card , Col, Row } from "antd";

function Rank(){

    const [combinedrecords, setCombinedRecords] = useState([]);
    //const [rewards,setrewards] = useState([]);
    

    useEffect(() => {
        const fetchData = async () => {

            
            try {
                const token = localStorage.getItem("token");
                console.log("Token:", token);
                
                
                const result = await axios.get("/exceldata/rank5", {
                    headers:{
                        Authorization: `Bearer ${token}`
                    }
                });

                const recordsdata = result.data;
                //setCombinedRecords(result.data);
                //console.log(combinedrecords);
                console.log(recordsdata);
                console.log(combinedrecords)
           

            
                const reward = await axios.get("/exceldata/empwithreward");
                console.log(reward.data.rewards)
                //setrewards(reward.data.rewards);
                console.log("fdfdfdfdfdf")
                //console.log(rewards[0].Name)
                const rewardsdata = reward.data.rewards

                const combinedata = recordsdata.map(record => {
                    const matchingReward = rewardsdata.find(reward => reward.empid === record.empid)
                    return{...record,reward:matchingReward}
                });
                setCombinedRecords(combinedata)
                


            }catch(err){
                console.log("err fetching rewards")
            }

            console.log("qqqqqqq")
        console.log(combinedrecords)
    
        console.log("qqqqqqq")
        };
        
        fetchData();
        
    }, []);

   
    let i = 0;

    return(
       
        <Layout>
            <div>Top Performencers</div>
        <Card  style={{ height: '500px', overflowY: 'auto' }}>

            {combinedrecords.map((record, index) => (
           
                <Card style={{
                    marginBottom: 16,
                  }}type="inner" title={`Rank ${++i}`} extra={<a href={`/viewemp/${record._id}`}>More</a>}>
                <div >{record.Name}</div>
                <div style={{display: "flex", marginTop : 5}}>
                    <div style={{flex:1 , textAlign:"left"}}>Score</div>
                    <div style={{flex:1 , textAlign:"right"}}>{Math.round(record.totalscore)}</div>
                   
                    
                </div>
                
                {record.reward && <div style={{display:"flex"}}><div style={{flex:1 , textAlign:"left"}}>Reward</div><div>{record.reward.Name}</div></div>} {/* Conditional rendering */}   
                
             </Card>
            ))}
            
            
        </Card>
        </Layout>
        
    )
}
export default Rank;