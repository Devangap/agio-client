
import React,{useState , useEffect} from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from 'axios';
import Layout from '../components/Layout';
import store from '../redux/store';
import { Provider } from 'react-redux';
import {Button, Form ,  Input,Select, DatePicker,message,Upload } from 'antd'
const { Option } = Select;


export default function Target(){
    const [target,settarget] = useState()
   
    const navigate = useNavigate()


    

    const handleSubmit = async () => {

        
        try {
            const formData = {
                target
            };

            
            console.log(formData);
           
            await axios.post("/exceldata/settarget",formData);
            message.success("Form data submitted successfully!");
            navigate("/view"); 
        } catch (error) {
            message.error("Failed to submit form data!");
            console.error(error);
        }
        


    };
    const handleClick = async () =>{
        try{
            await axios.delete(`/exceldata/deletetarget`);
            message.success("Target deleted sucessfuly");
            window.location.reload();
            
            

        }catch (error) {
            console.error('Error deleting record:', error);
        }
    }

    


    return(
        
        <Layout>
  <div className="perform">
  <div className="AnnHRSup_form box p-3">
    <h3 className='title'>Set Target</h3>
    <Form layout='vertical' /*onFinish={onFinish}*/>
      
      <div className="form-row">
      <div className="item">
      <Form.Item label='Workers' >
            <Input type = 'text' />
      </Form.Item>
      <Form.Item label='Target score' >
            <Input type = 'Number'  onChange={(e) =>  settarget(e.target.value) }  />
      </Form.Item>
      
        </div>
        
      </div>

      <div className="Button-cons">
        <Button className='primary-button my-2' htmlType='submit' onClick={handleSubmit}>Submit</Button>
        <Button className="primary-button my-2" onClick={() => handleClick()}>Delete</Button>
      </div>
    </Form>
  </div>
</div>
</Layout>

    )
}
