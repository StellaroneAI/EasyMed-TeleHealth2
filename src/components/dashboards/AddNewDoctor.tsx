import React, { useState } from "react";
import { Button, Modal, Form, Input, Select } from "antd";

const { Option } = Select;

const AddNewDoctor = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = () => {
    form.submit();
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const onFinish = (values) => {
    console.log("Success:", values);
    setIsModalVisible(false);
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  return (
    <>
      <Button type="primary" onClick={showModal}>
        Add New Doctor
      </Button>
      <Modal
        title="Add New Doctor"
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        okText="Submit"
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
        >
          <Form.Item
            label="Full Name"
            name="fullName"
            rules={[{ required: true, message: "Please enter the full name" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Email"
            name="email"
            rules={[
              { required: true, message: "Please enter a valid email" },
              { type: "email", message: "The input is not valid E-mail!" },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Specialty"
            name="specialty"
            rules={[{ required: true, message: "Please select a specialty" }]}
          >
            <Select>
              <Option value="Cardiology">Cardiology</Option>
              <Option value="Dermatology">Dermatology</Option>
              <Option value="Neurology">Neurology</Option>
              <Option value="Pediatrics">Pediatrics</Option>
            </Select>
          </Form.Item>
          <Form.Item
            label="Years of Experience"
            name="experience"
            rules={[
              { required: true, message: "Please enter years of experience" },
            ]}
          >
            <Input type="number" />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default AddNewDoctor;
