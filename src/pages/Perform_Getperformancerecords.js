import React, {useEffect,useState} from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import Layout from "../components/Layout"
import { Table, Button, message, Modal, Form, Input, DatePicker,Select,Space,Upload,Radio } from 'antd';

import { Provider } from 'react-redux';
import store from '../redux/store';
import toast from 'react-hot-toast';

function Getperformancerecords(){

    const [formdata, setFormData] = useState({
        inputValue: '',
        time: ''
    });
    const [target,settarget] = useState()

    const [performanceRecords,setPerformanceRecords] = useState([]);
    const [currentRecord,setcurrentRecord] = useState(null);
    const [isModalVisible,setIsModalVisible] = useState(false);
    const [isModalVisible2,setIsModalVisible2] = useState(false);
    const [isModalVisible3,setIsModalVisible3] = useState(false);
    const navigate = useNavigate();

    const sendData = async (e) =>{
        
        console.log("senddata")
        try {
            const response = await axios.post('/exceldata/weekly',{inputValue: formdata.inputValue,time:formdata.time} );
            console.log(response);
            console.log("lllllljgfff")
            if(response.data.success){
            setPerformanceRecords(response.data.record);
            }else{
                toast.success("Invalid ID");
                setPerformanceRecords(null)
            }
        }catch(error){
            console.error('Error',error);
        }

        console.log("Emp NO",formdata.inputValue);
        console.log("period:",formdata.time);
    };
    const handleUpdate = async(values) =>{
        const id = currentRecord._id;
        try{
            const response = await axios.put("/exceldata//update/"+id, values);
            if (response.data.success) {
                message.success('Announcement updated successfully');
                setIsModalVisible(false);
                
                
            } else {
                message.error(response.data.message);
            }
        } catch (error) {
            message.error('Failed to update announcement');
        }   
    }
    const handleClick = async (id) =>{
        try{
            await axios.delete(`/exceldata/delete/${id}`);
            message.success("Record deleted sucessfuly");
            setPerformanceRecords(prev => prev.filter(item => item._id !== id))
            
            

        }catch (error) {
            message.error("Record delete unsucessful");
            console.error('Error deleting record:', error);
        }
    }

    const columns = [
        {
            title: 'Employee ID',
            dataIndex: 'empid',
            key: 'empid',
        },
        {
            title: 'Record ID',
            dataIndex: '_id',
            key: '_id',
            
        },
        {
            title: 'Date',
            dataIndex: 'date',
            key: 'date',
            

        },

        {
            title: 'Action',
            key: 'action',
            render: (_, record) => (
                <>
                    <Button type="primary" className="update" onClick={() => navigate(`/update/${record._id}`)}>Update</Button>
                    <Button danger onClick={() => handleClick(record._id)}>Delete</Button>
                </>
            ),
        },
    ];

    const reloadPage = () => {
        message.success("Records Inserted");
        
    };
    
    const showModal = async(record) => {
        try {

            
            console.log("showmodel");
           
            const t = await axios.get("/exceldata/targetget");
            console.log(t)
            if(t.data){
                settarget(t.data.target)
                console.log("aaaaaaaaaa")
                console.log(t.data)
                console.log(t.data.target)
                console.log("aaaaaaaaaa")
                setIsModalVisible2(true)
            }else{
                setIsModalVisible3(true)
            }
        } catch (error) {
            message.error("no target");
            console.error(error);
        }
        setcurrentRecord(record);
        setIsModalVisible(true);
    };
    console.log("hullllll");
    console.log(performanceRecords);

    const handleClickt = async () =>{
        try{
            await axios.delete('/exceldata/deletetarget');
            message.success("Target deleted sucessfuly");
            window.location.reload();
            
            

        }catch (error) {
            console.error('Error deleting record:', error);
        }
    }

    const handleSubmitt = async () => {

        
        try {
            const formDatat = {
                target
            };

            
            console.log(formDatat);
            
            await axios.post("/exceldata/settarget",formDatat);
            message.success("Form data submitted successfully!");
            navigate("/view"); // Redirect to homepage or any other route
        } catch (error) {
            message.error("Failed to submit form data!");
            console.error(error);
        }
        
        console.log(performanceRecords.fullname)

    };

    return (
        
        
        <Layout>
            <div className="container">
            
           
        <div style={{display:"flex"}}>

            <div style={{flex:1}}>
            <Form
                layout="vertical"
                onFinish={sendData}
            >   <div style={{display:"flex"}}>
                    <div>
                        <Form.Item
                            name="Emp_No"
                            label="Employee ID"
                            rules={[{  required: true,
                            pattern: /^emp\d{4}$/,
                            message: 'Please enter a valid Employee ID(e.g., emp1001).' }]}
                        >
                            <Input id='Emp_No' value={formdata.inputValue} onChange={(e)=>{
                                console.log(e.target.value)
                                    setFormData({...formdata, inputValue: e.target.value})
                                }}/>
                        </Form.Item>
                    </div>
                    <div style={{marginLeft:"10px"}}>
                        <Form.Item 
                            name="Period"
                            label="Time period"
                            rules={[
                                {
                                required: true,
                                }
                            ]}
                        >
                            
                            <Radio.Group value={formdata} onChange={(e)=>{
                                console.log("lllll")
                                console.log(e.target.value);
                                console.log("llllll")
                                setFormData({...formdata, time: e.target.value})
                            }}
                            >
                            <Radio.Button style={{ backgroundColor: '#ffc658',color:'#000000',fontWeight:'500' }} value="week">Week</Radio.Button>
                            <Radio.Button style={{ backgroundColor: '#ffc658',color:'#000000',fontWeight:'500' }} value="month">Month</Radio.Button>
                            <Radio.Button style={{ backgroundColor: '#ffc658',color:'#000000',fontWeight:'500' }} value="year">Year</Radio.Button>
                            <Radio.Button style={{ backgroundColor: '#ffc658',color:'#000000',fontWeight:'500' }} value="o">Overall</Radio.Button>
                            </Radio.Group>
                          
                            
                            
                            
                        </Form.Item>
                    </div>
                    
                    </div>
                    <Space>
                    <Button type="primary" htmlType="submit">Submit</Button>
                    </Space>
                    
                    </Form>
                    </div>
            <div style={{flex:0,marginTop:"10px"}}>
            
            
            <Upload name = "csvFile" action={'/exceldata/uploadexcel'} onChange={reloadPage}>
                    <Button>Insert Records</Button>
            </Upload>
            <Button type="dashed" onClick={showModal}>Goals</Button>
            <Button type="dashed" onClick={() => navigate('/rewardsm')}>Rewards</Button>
            <Button type="primary" onClick={() => navigate('/viewempbyname')}>Employees</Button>

            </div>
        
        </div>
        
        
        
        

        
        
            </div>
            <Table dataSource={performanceRecords} columns={columns} pagination={{ pageSize: 10 }} />
            <Modal
                title="Set a Goal"
                open={isModalVisible3}
                onCancel={() => setIsModalVisible3(false)}
                footer={null}
            >
                <Form layout='vertical' /*onFinish={onFinish}*/>
      
      <div className="form-row">
      <div className="item">
      <Form.Item label='For' >
            <h4>Factory Workers</h4>
      </Form.Item>
      <Form.Item label='Target score' >
            <Input type = 'Number'  onChange={(e) =>  settarget(e.target.value) }  />
      </Form.Item>
      
        </div>
        
      </div>

      <div className="Button-cons">
        <Button className='primary-button my-2' htmlType='submit' onClick={handleSubmitt}>Submit</Button>
        
      </div>
    </Form>


            </Modal>

            <Modal
                title="Ogoing Goal"
                open={isModalVisible2}
                onCancel={() => setIsModalVisible2(false)}
                footer={null}
            >
                <div style={{fontSize:20,textAlign:"center",fontWeight:500}}>Target Score : {target} </div>
                <div style={{display:"flex"}}>
                <Button className="primary-button my-1" onClick={() => navigate(`/progress`)}> Progress </Button>
                <Button  className="primary-button my-1" onClick={() => handleClickt()}>Delete</Button>
                </div>
            </Modal>

        

        </Layout>
        
        
    );
                }

export default Getperformancerecords;
