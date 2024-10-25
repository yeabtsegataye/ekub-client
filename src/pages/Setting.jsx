import React, { useState } from "react";
import { useToast } from "@chakra-ui/react";
import axios from "axios";
import { useSelector } from "react-redux";
const API = import.meta.env.VITE_API_URL;

export const Setting = () => {
    const user = useSelector((state) => state.auth.user);

  const toast = useToast();
  const [formData, setFormData] = useState({
    email: user? user.email: "",
    phone: user?user.phone: "",
    old_password: "",
    Password: "",
    password_confirm: "",
  });
console.log(user,'user')
  // Handle input change
  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
console.log(formData.Password, formData.password_confirm,'connff')
    // Check if new password matches confirm password
    if (formData.Password !== formData.password_confirm) {
      toast({
        title: "Error",
        description: "New password and confirmation do not match.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    // Prepare the data to be sent (exclude password_confirm)
    const dataToSend = {
        email: formData.email,
      phone: formData.phone,
      old_password: formData.old_password,
      Password: formData.Password,
    };

    try {
      const response = await axios.patch(`${API}/auth/update`, dataToSend);

      if (response.status === 200) {
        toast({
          title: "Success",
          description: "User information updated successfully.",
          status: "success",
          duration: 5000,
          isClosable: true,
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Something went wrong.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  return (
    <>
      <div className="py-4 px-3 px-md-4">
        <div className="card mb-3 mb-md-4">
          <div className="card-body">
            {/* Breadcrumb */}
            <nav className="d-none d-md-block" aria-label="breadcrumb">
              <ol className="breadcrumb">
                <li className="breadcrumb-item">
                  <a href="#">የግል መረጃ</a>
                </li>
                <li className="breadcrumb-item active" aria-current="page">
                  የግል መረጃ ለመቀየር
                </li>
              </ol>
            </nav>
            {/* End Breadcrumb */}

            <div className="mb-3 mb-md-4 d-flex justify-content-between">
              <div className="h3 mb-0">የግል መረጃ ለመቀየር</div>
            </div>

            {/* Form */}
            <div>
              <form onSubmit={handleSubmit}>
                <div className="form-row">
                  <div className="form-group col-12 col-md-6">
                    <label htmlFor="phone">ስልክ</label>
                    <input
                      type="number"
                      className="form-control"
                      id="phone"
                      name="phone"
                      placeholder="ስልክ"
                      value={formData.phone}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="form-group col-12 col-md-6">
                    <label htmlFor="email">ኢሜል</label>
                    <input
                      type="text"
                      className="form-control"
                      id="email"
                      name="email"
                      placeholder="ስም"
                      value={formData.email}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
                <div className="form-row">
                  <div className="col-12">
                    <div className="font-weight-semi-bold h5 mb-3">
                      የይለፍ ቃል ለመቀየር
                    </div>
                  </div>
                  <div className="form-group col-12 col-md-4">
                    <label htmlFor="old_password">የድሮ የይለፍቃል</label>
                    <input
                      type="password"
                      className="form-control"
                      id="old_password"
                      name="old_password"
                      placeholder="Current Password"
                      value={formData.old_password}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="form-group col-12 col-md-4">
                    <label htmlFor="password">አዲስ የይለፍቃል</label>
                    <input
                      type="password"
                      className="form-control"
                      id="Password"
                      name="Password"
                      placeholder="New Password"
                      value={formData.Password}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="form-group col-12 col-md-4">
                    <label htmlFor="password_confirm">በድጋሚ ያረጋግጡ</label>
                    <input
                      type="password"
                      className="form-control"
                      id="password_confirm"
                      name="password_confirm"
                      placeholder="Repeat New Password"
                      value={formData.password_confirm}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  className="btn btn-primary float-right"
                >
                  ይቀይሩ
                </button>
              </form>
            </div>
            {/* End Form */}
          </div>
        </div>
      </div>
    </>
  );
};
