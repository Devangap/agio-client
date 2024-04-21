import React, { useEffect,useState } from 'react';

import Layout from "../components/Layout";
import axios from 'axios';
import toast from 'react-hot-toast';



import { Table, Button, message, Modal, Form, Input, DatePicker,Select,Space,Upload,Radio } from 'antd';


function Reward () {
    const [formdata,setFormData] = useState({
        RewardID:'',
        RewardName:'',
        empID:''

    })
    const data = [];
    const [rewards,setrewards]=useState([]);
    const [value4, setValue4] = useState('Apple');
    const [ismodelvisible,setismodelvisible] = useState(false)
    const [Rbutton1,setRbutton1] = useState(false);
    const [Rbutton2,setRbutton2] = useState(false);
    const [Rbutton3,setRbutton3] = useState(false);
    
    const [inputValues1, setInputValues1] = useState({
        Reward1ID:"",
        Reward1Name:"",
        empid1:""
    });
    const [inputValues2, setInputValues2] = useState({
        
        Reward2ID:"",
        Reward2Name:"",
        empid2:""
    });
    const [inputValues3, setInputValues3] = useState({
        Reward3ID:"",
        Reward3Name:"",
        empid3:""
    });
    const [specialreward,setspecialreward] = useState({
        RewardID:"",
        RewardName:"",
        empid:""
        
});

    useEffect(()=>{
        
        const getrewards = async () =>{

            const resrewards =  await axios.get("/exceldata/empwithreward")
            console.log("ppppppppppp")
            console.log(resrewards)
            console.log("ppppppppppp")
            console.log("length",resrewards.data.rewards.length)
            if(resrewards.data.rewards.length < 1){
                console.log("Rewards empty")
                toast.error("Rewards Empty")
            }else{

                setrewards(resrewards.data.rewards)
                console.log("log")
                console.log(resrewards.data.rewards)
                const newInputValues = ["", "", ""];
    
                resrewards.data.rewards.forEach(reward =>{
                if(reward.RewardID == "R001"){
                    setInputValues1({...inputValues1,Reward1ID:reward.RewardID,Reward1Name:reward.Name,empid1:reward.empid})
                }else if(reward.RewardID == "R002"){
                    setInputValues2({...inputValues2,Reward2ID:reward.RewardID,Reward2Name:reward.Name,empid2:reward.empid})
                }else if(reward.RewardID == "R003"){
                    setInputValues3({...inputValues3,Reward3ID:reward.RewardID,Reward3Name:reward.Name,empid3:reward.empid})
                }

               

            })
    
            
                console.log("kkkkl")
                console.log(resrewards.data.rewards[0].RewardID)
            }
                

                
            
          
            
        }
        getrewards()
        console.log("ll")
        
        console.log("hhhhh")
    },[])
    console.log("oo")
    
    console.log("aa")
    
    /*const handleInputChange = (index, value) => {
        const newInputValues = [...inputValues];
        newInputValues[index] = value;
        setInputValues(newInputValues);
    };*/

    const submit = async (place, reward) => {
        console.log(`Submitting reward for place ${place}: ${reward}`);
        let RID;

        if(place == 1){
            RID = "R001";
        }else if(place == 2){
            RID = "R002";
        }else if(place == 3){
            RID = "R003"
        }
        console.log("qqqqqqqqq")
        console.log(RID)
        console.log("qqqqqqqqq")
        await axios.post("/exceldata/createRewards",{RewardName:formdata.RewardName,RewardID:formdata.RewardID})
        window.location.reload()

        

    };

    const senddata = async ()=>{
        console.log("seeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee")
        console.log(formdata.empID)
        setTimeout(async () => {
            try {
                const response = await axios.post("/exceldata/specialrewards", {
                    RewardName: formdata.RewardName,
                    RewardID: formdata.RewardID,
                    empid: formdata.empID
                });
                window.location.reload()
                console.log("Response:", response);
            } catch (err) {
                console.log(err);
            }
        }, 0);
    }

    const deleter = async (index) => {
        
        const validrewardids = ["R001","R002","R003"];

        console.log(index)
        let a = validrewardids.includes(index);
        console.log(a)

        if(a){
            await axios.post("/exceldata/deleteReward",{RewardID:index})
            //window.location.reload()
        }else{
            console.log("Invalid ID")
        }

        
       

    }

    const handleClick = async(RecordID)=>{

        const validrewardids = ["R001","R002","R003"];

        console.log(RecordID)
        
        console.log(RecordID)

        try{
            await axios.delete(`/exceldata/deleteReward/${RecordID}`);
           // window.location.reload()
           message.success("Reward delete sucessfull")
            setrewards(prev => prev.filter(item => item._id != RecordID ))
        }catch(err){
            message.err("Rewrd delete unsucessfull")
            console.log("err",err)
        }
    }   
    const columns = [
        {
            title : "Employee ID",
            dataIndex:"empid",
            key:"empid",
        },
        {
            title : "Reward",
            dataIndex:"Name",
            key:"Name",
            align:"right"
        },
        {
            title : "Delete",
            align:"right",
            render: (_, record) => (
                <>
                    {console.log("gffffffffffffffffffffffff")}
                    {console.log(`${record._id}`)}
                    {console.log("fffffffffffffffdddddddddddddd")}
                    <Button danger onClick={() => handleClick(record._id)}>Delete</Button>
                </>
            ),
        }
    ];

    const radiovisiblity = async()=>{
        console.log("inside radiovisibility")
        console.log(inputValues1.Reward1ID)
        console.log(inputValues2.Reward2ID)

        console.log(inputValues3.Reward3ID)

        if(inputValues1.Reward1ID == "R001"){
            setRbutton1(true)
        }
        if(inputValues2.Reward2ID == "R002"){
            setRbutton2(true)
        }
        if(inputValues3.Reward3ID == "R003"){
            setRbutton3(true)
        }

        }

        const handleAddRewardClick = () => {
        
            radiovisiblity(); // Call radiovisiblity
            showModal(); // Call showModal
           
        };

    

    const optionsWithDisabled = [
        {
          label: '1st',
          value: 'R001',
          disabled:Rbutton1
        },
        {
          label: '2nd',
          value: 'R002',
          disabled: Rbutton2
        },
        {
          label: '3rd',
          value: 'R003',
          disabled: Rbutton3,
        },
        {
            label:"Special",
            value:"special",

        }
      ];

    const showModal = async(record) =>{

        /*if(inputValues1.Reward1ID == "R001" && inputValues2.Reward2ID == "R002" && inputValues3.Reward3ID == "R003"){
            //setismodelvisible(false)
        }else{
            setismodelvisible(true)
        }*/
        setismodelvisible(true)
        
    }

    /* <Space style={{paddingTop:30,flex:0.25}}>    
            <Button danger onClick={() => deleter(`${index}`)}>Delete</Button>
        </Space>
    */

    let i = 0;
    console.log("kkkklkoiiihhbhjbg h")
   
    return(
        <Layout>
                <div style={{display:"flex", justifyContent:"flex-end"}}>
                    <Button type='primary' onClick={handleAddRewardClick}>ADD REWARD</Button>
                </div>
                <div>
                <Table dataSource={rewards} columns={columns}></Table>
                </div>
                <Modal title="Rewards" open={ismodelvisible} onCancel={() => setismodelvisible(false) } footer={null}>
                    <Form layout='vertical' onFinish={(values) =>{
                        console.log("ggggggggggg")
                        console.log(formdata.RewardID)
                        console.log("ggggggggggg")
                        if(formdata.RewardID === "special"){
                            senddata();
                        }else{
                            submit()
                        }
                    }} >
                        <Form.Item>
                            <Input type='text' placeholder='Reward' value={formdata.RewardName}onChange={(e)=>{
                                console.log(e.target.value)
                                    setFormData({...formdata, RewardName: e.target.value})
                                }}></Input>
                        </Form.Item>
                        <Form.Item label="place">
                        <Radio.Group
                                options={optionsWithDisabled}
                                //onChange={onChange4}
                                value={formdata}  onChange={(e)=>{
                                    console.log("lllll")
                                    console.log(e.target.value);
                                    console.log("llllll")
                                    setFormData({...formdata, RewardID: e.target.value})
                                }}
                                optionType="button"
                                buttonStyle="solid"
                            />
                        </Form.Item>
                        {formdata.RewardID === "special" && (
            <Form.Item label="Employee ID">
                <Input type='text' placeholder='Employee ID' value={formdata.empID} onChange={(e) => setFormData({...formdata, empID: e.target.value})} />
            </Form.Item>

            
        )}
                        <Space>
                    <Button type="primary" htmlType="submit">Submit</Button>
                    </Space>
                    </Form>
                </Modal>
  {console.log("inputValues1:", inputValues1)}
  {console.log("inputValues2:", inputValues2)}
  {console.log("inputValues3:", inputValues3)}
  {console.log("specialReward:",specialreward)}
  {console.log("R1:",Rbutton1)}
  {console.log("R2:",Rbutton2)}
  {console.log("R3:",Rbutton3)}
  {console.log("form data empNO:",formdata.empID)}
  
  </Layout>
    )
};
export default Reward;