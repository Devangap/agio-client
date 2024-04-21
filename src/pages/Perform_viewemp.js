import React, {useEffect,useState} from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import Layout from "../components/Layout"
import { Table, Button, message, Modal, Form, Input, DatePicker,Select,Space,Upload,Radio } from 'antd';

import { Provider } from 'react-redux';
import store from '../redux/store';
import toast from 'react-hot-toast';
import { Placeholder } from 'react-bootstrap';

function Getperformancerecords(){

    const [formdata, setFormData] = useState({
        inputValue: '',
        time: ''
    });

    const [searchname, setsearchname] = useState('');

    const [target,settarget] = useState()

    const [performanceRecords,setPerformanceRecords] = useState([]);
    const [currentRecord,setcurrentRecord] = useState(null);
  
    const navigate = useNavigate();


    useEffect(()=>{

        const fetchemps = async () => {
        
        
        const token = localStorage.getItem("token");
        console.log("Token:", token);

        await axios.get('/exceldata/allemployees', {
            headers:{
                Authorization: `Bearer ${token}`
            }
        })
        .then(response => {console.log(response);

        
            const rounscore = response.data.map(record => ({
                ...record,
                totalscore: Math.round(record.totalscore)
            }));
            
            setPerformanceRecords(rounscore);
            
    })
        .catch(err => console.log(err));
}
    fetchemps()

    },[])

   


    const columns = [
        {
            title: 'Name',
            dataIndex: 'Name',
            key: 'Name',
        },
        {
            title: 'Employee ID',
            dataIndex: 'empid',
            key: 'empid',
            
        },
        {
            title: 'Score',
            dataIndex: 'totalscore',
            key: 'totalscore',
            //sorter: (a, b) => new Date(a.date) - new Date(b.date), // Add sorter function for sorting
            //render: date => new Date(date).toLocaleDateString(), // Render dates in a readable format

        },

        {
            title: 'Action',
            key: 'action',
            render: (_, record) => (
                <>
                    <Button danger onClick={() => navigate(`/viewemp/${record._id}`)}>View</Button>
                </>
            ),
        },
    ];

    

    console.log("hullllll");
    console.log(performanceRecords);




    const filteredRecords = performanceRecords.filter(record =>
        record.Name.toLowerCase().includes(searchname.toLowerCase())
    );

    return (
        
        
        <Layout>
            <Form>
                <Form.Item
                    name = "filtername"
                    
                >
                    <Input value={searchname} onChange={(e)=>{
                        console.log(e.target.value)
                        setsearchname(e.target.value)
                        
                    }}
                    Placeholder="Search by Name"></Input>

                </Form.Item>
            </Form>
            <Table dataSource={filteredRecords} columns={columns} pagination={{ pageSize: 8 }} />

        
        </Layout>
        
        
    );
                }

export default Getperformancerecords;
