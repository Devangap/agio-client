import React,{useState , useEffect} from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from 'axios';
import Layout from '../components/Layout';
import {Button, Form ,  Input,Select, DatePicker,message,Upload } from 'antd'
const { Option } = Select;

export default function Updatedataform(){
    const {id} = useParams()
    console.log(id);
    const [EmployeeID,setEmpId] = useState()
    const [EmployeeName,setEmpName] = useState()
    const [YieldDry,setYieldDry] = useState()
    const [YieldCutsWet,setYieldCutsWet] = useState()
    const [Grade_A_Cuts,setGrade_A_Cuts] = useState()
    const [Grade_B_Cuts,setGrade_B_Cuts] = useState()
    const [Grade_C_Cuts,setGrade_C_Cuts] = useState()
    const [Grade_F_Cuts,setGrade_F_Cuts] = useState()
    
    const [Score,setScore] = useState()
    const navigate = useNavigate()

    useEffect(()=>{
        axios.get("/exceldata/getrecord/"+id)
        .then(res => {console.log(res.data[0])
            setEmpId(res.data[0].empid)
            setEmpName(res.data[0].name)
            setYieldDry(res.data[0].YieldDry)
            setYieldCutsWet(res.data[0].YieldCutsWet)
            setGrade_A_Cuts(res.data[0].Grade_A_Cuts)
            setGrade_B_Cuts(res.data[0].Grade_B_Cuts)
            setGrade_C_Cuts(res.data[0].Grade_C_Cuts)
            setGrade_F_Cuts(res.data[0].Grade_F_Cuts)

            setScore(res.data[0].score)
    })
        .catch(err => console.log(err));

    },[])

    

    const handleSubmit = async () => {

        
        try {
            const formData = {
                
                YieldDry,
                YieldCutsWet,
                Grade_A_Cuts,
                Grade_B_Cuts,
                Grade_C_Cuts,
                Grade_F_Cuts,
                Score
            };

            
            console.log(formData);
            // Assuming you have an endpoint to save the form data
            await axios.put("/exceldata//update/"+id, formData);
            message.success("Form data submitted successfully!");
            navigate("/view"); // Redirect to homepage or any other route
        } catch (error) {
            message.error("Failed to submit form data!");
            console.error(error);
        }
        


    };

    const calscore = async () => {

      let calscore = (YieldDry * 0.5 + YieldCutsWet * 0.5 + Grade_A_Cuts * 1 + Grade_B_Cuts * 0.8 + Grade_C_Cuts * 0.5 - Grade_F_Cuts * 1);
      setScore(calscore)

    }


    return(
        <Layout>
  <div className="perform">
  <div className="AnnHRSup_form box p-3">
    <h3 className='title'>Performance Record Update</h3>
    <Form layout='vertical' /*onFinish={onFinish}*/>
      <div className="form-row">
      <div className="item">
          <Form.Item label='Employee ID' >
            <Input type = 'text' value = {EmployeeID}  readOnly />
          </Form.Item>
          </div>
          <div className="item">  
          <Form.Item label='Employee Name' >
            <Input type = 'text' value = {EmployeeName}  readOnly />
          </Form.Item>
        </div>
        
      </div>
      
      <div className="form-row">
      <div className="item">
      <Form.Item label='Yield Dry' >
            <Input type = 'Number' value = {YieldDry} onChange={(e) => {setYieldDry(e.target.value);calscore() } } />
      </Form.Item>
      <Form.Item label='Yield Wet' >
            <Input type = 'Number' value = {YieldCutsWet} onChange={(e) =>  {setYieldCutsWet(e.target.value);calscore() } } />
      </Form.Item>
      
      <Form.Item label='Grade A Cuts' >
            <Input type = 'Number' value = {Grade_A_Cuts}  onChange={(e) =>  {setGrade_A_Cuts(e.target.value);calscore()}} />
      </Form.Item>
        </div>
        <div className="item">
      <Form.Item label='Grade B Cuts' >
            <Input type = 'Number' value = {Grade_B_Cuts}  onChange={(e) =>  {setGrade_B_Cuts(e.target.value);calscore()}} />
      </Form.Item>
      
      <Form.Item label='Grade C Cuts' >
            <Input type = 'Number' value = {Grade_C_Cuts}  onChange={(e) =>  {setGrade_C_Cuts(e.target.value);calscore()}} />
      </Form.Item>

      <Form.Item label='Grade F Cuts' >
            <Input type = 'Number' value = {Grade_F_Cuts} onChange={(e) => { setGrade_F_Cuts(e.target.value);calscore()} } />
      </Form.Item>

      

     

        </div>
        
      </div>

      <div className="Button-cons">
        <Button className='primary-button my-2' htmlType='submit' onClick={handleSubmit}>Submit</Button>
      </div>
    </Form>
  </div>
</div>
</Layout>
    )
}
