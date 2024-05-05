import React, { useState } from 'react';
import { Button, Form, Input, Select, message, Modal } from 'antd'; 
import { UploadOutlined } from '@ant-design/icons';
import Layout from '../components/Layout';
import '../UniformOrder.css';
import shirt from '../Images/twoshirt.png'
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const { Option } = Select;

function UniformOrder() {
  const [position, setPosition] = useState('');
  const [showWaistSizeInput, setShowWaistSizeInput] = useState(false);
  const [uniformCount, setUniformCount] = useState(1);
  const [employeeNumber, setEmployeeNumber] = useState('');
  const [waistSizeOptions, setWaistSizeOptions] = useState([]);
  const [showExtraChargesModal, setShowExtraChargesModal] = useState(false);
  const [extraChargeTotal, setExtraChargeTotal] = useState(0);

  const handlePositionChange = value => {
    setPosition(value);
    if (value === 'Executive') {
      setWaistSizeOptions([]);
    } else {
      
      setWaistSizeOptions(['28', '30', '32', '34', '36']);
    }
    setShowWaistSizeInput(value === 'Factory Worker');
  };

  const handleUniformCountChange = value => {
    setUniformCount(value);
  };

  const handleEmployeeNumberChange = e => {
    setEmployeeNumber(e.target.value);
  };

  const onFinish = async (values) => {
    try {
      const response = await fetch('/api/uniformOrder', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      });
  
      const data = await response.json();
      console.log(data); // Log the response from the server
  
      toast.success('Order placed successfully');
    } catch (error) {
      console.error('Error submitting form:', error);
      toast.error('Failed to place order');
    }
  };
  const calculateAmount = () => {
    // Define charges for t-shirts and skirts
    const tshirtCharge = 1250;
    const skirtCharge = 1500;

    // Calculate total charge based on position and uniform count
    let totalCharge = 0;
    if (position === 'Executive') {
      totalCharge = uniformCount > 1 ? (uniformCount - 1) * tshirtCharge : 0;
    } else if (position === 'Factory Worker') {
      totalCharge = uniformCount > 1 ? (uniformCount - 1) * (tshirtCharge + skirtCharge) : 0;
    }

    // Update the state to show the modal with the calculated amount
    setExtraChargeTotal(totalCharge);
    setShowExtraChargesModal(true);
  };

  const renderAdditionalChargesMessage = () => {
    if (uniformCount > 1) {
      return (
        <>
          <p className="additional-charges-message">Additional Charges May Apply</p>
          <Button onClick={calculateAmount}>Calculate Amount</Button>
        </>
      );
    }
    return null;
  };

  return (
    <Layout>
      <h1>Uniform Order Form</h1>
      <ToastContainer position="top-center" autoClose={5000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />
    <div className="uniform-order-container">
      <div className="uniform-order-form-container">
      <h3 className="uniform-order-title"></h3>
        <div className="uniform-order-form-box p-3">
          
          
          <Form layout="horizontal" onFinish={onFinish}>
            <div className="uniform-order-form-row">
              <div className="uniform-order-item">
              <img className="uniformlogo-image" src={shirt} alt="Logo" /> {/* Image */}
                <Form.Item
                  label="Employee Number"
                  name="employeeNumber"
                  rules={[{ required: true, message: 'Please input Employee Number' }]}
                >
                  <Input value={employeeNumber} onChange={handleEmployeeNumberChange} placeholder="Enter Employee Number" />
                </Form.Item>
                <Form.Item
                  label="Position"
                  name="position"
                  rules={[{ required: true, message: 'Please select Position' }]}
                >
                  <Select onChange={handlePositionChange} placeholder="Select Position">
                    <Option value="Executive">Executive</Option>
                    <Option value="Factory Worker">Factory Worker</Option>
                  </Select>
                </Form.Item>
                <Form.Item
                  label="Standard T-shirt Size"
                  name="tshirtSize"
                  rules={[{ required: true, message: 'Please select Standard T-shirt Size' }]}
                >
                  <Select placeholder="Select Size">
                    <Option value="Small">Small</Option>
                    <Option value="Medium">Medium</Option>
                    <Option value="Large">Large</Option>
                    <Option value="XL">XL</Option>
                  </Select>
                </Form.Item>
                {showWaistSizeInput && (
                  <Form.Item label="Waist Size" name="waistSize">
                    <Select placeholder="Select Size">
                      {waistSizeOptions.map(size => (
                        <Option key={size} value={size}>{size}</Option>
                      ))}
                    </Select>
                  </Form.Item>
                )}
                <Form.Item
                  label="No. of Uniforms"
                  name="uniformCount"
                  rules={[{ required: true, message: 'Please select No. of Uniforms' }]}
                >
                  <Select onChange={handleUniformCountChange} placeholder="Select No. of Uniforms">
                    <Option value={1}>1</Option>
                    <Option value={2}>2</Option>
                    <Option value={3}>3</Option>
                  </Select>
                </Form.Item>
                {renderAdditionalChargesMessage()}
              </div>
            </div>
            <div className="uniform-order-button-container">
              <Button className="uniform-order-submit-button" htmlType="submit">
                Place Order
              </Button>
            </div>
            
          </Form>
          
          <Modal
            title="Additional Charges"
            visible={showExtraChargesModal}
            onCancel={() => setShowExtraChargesModal(false)}
            footer={[
              <Button key="submit" type="primary" onClick={() => setShowExtraChargesModal(false)}>
                OK
              </Button>,
            ]}
          >
            <p>Extra Skirt: Rs. 1500</p>
            <p>Extra T-shirt: Rs. 1250</p>
            <p>Total Extra Charge: Rs. {extraChargeTotal}</p>
            <p>Pay The Extra Charge When Collecting Your Uniforms</p>
          </Modal>
        </div>
      </div>
    </div>
    </Layout>
  );
}

export default UniformOrder;
