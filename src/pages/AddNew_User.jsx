import React, { useState } from "react";
import { useToast } from "@chakra-ui/react"; // Using Chakra UI's toast for notifications

const API = import.meta.env.VITE_API_URL; // Replace with your actual API URL

export const AddUser = () => {
  const [formData, setFormData] = useState({
    name: "",
    Phone: "",
    WorkingPlace: "",
    Gender: "",
    date_of_joining: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const toast = useToast();

  // Helper function to capitalize the first letter of a string
  const capitalize = (text) => {
    if (!text) return text;
    return text.charAt(0).toUpperCase() + text.slice(1);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {

    e.preventDefault();
    setLoading(true);
    setError("");

    // Create a new object with capitalized fields before sending
    const capitalizedData = {
      Name: capitalize(formData.name),
      Gender: capitalize(formData.Gender),
      Phone: formData.Phone, // No need to capitalize numbers
      WorkingPlace: capitalize(formData.WorkingPlace),
     
    };

    try {
      const response = await fetch(`${API}/customers/add`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(capitalizedData), // Use the capitalized data here
      });

      if (!response.ok) {
        const errorData = await response.json(); // Get error message from server
        throw new Error(errorData.message || "Failed to add user.");
      }

      toast({
        title: "User added successfully",
        description: "The new user has been added.",
        status: "success",
        duration: 5000,
        isClosable: true,
      });

      //Reset the form after submission
      setFormData({
        name: "",
        Phone: "",
        WorkingPlace: "",
        Gender: "",
        date_of_joining: "",
      });
    } catch (error) {
      setError(error.message);
      toast({
        title: "Error adding user",
        description: error.message,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="py-4 px-3 px-md-4">
      <div className="card mb-3 mb-md-4">
        <div className="card-body">
          {/* Breadcrumb */}
          <nav className="d-none d-md-block" aria-label="breadcrumb">
            <ol className="breadcrumb">
              <li className="breadcrumb-item">
                <a href="#">አባል</a>
              </li>
              <li className="breadcrumb-item active" aria-current="page">
                አዲስ አባል
              </li>
            </ol>
          </nav>
          {/* End Breadcrumb */}

          <div className="mb-3 mb-md-4 d-flex justify-content-between">
            <div className="h3 mb-0">አዲስ አባል መዝግብ</div>
          </div>

          {/* Form */}
          <div>
            <form onSubmit={handleSubmit}>
              <div className="form-row">
                <div className="form-group col-12 col-md-6">
                  <label htmlFor="name">ስም</label>
                  <input
                    type="text"
                    className="form-control"
                    id="name"
                    name="name"
                    placeholder="ስም"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-group col-12 col-md-6">
                  <label htmlFor="Phone">ስልክ</label>
                  <input
                    type="tel"
                    className="form-control"
                    id="Phone"
                    name="Phone"
                    placeholder="ስልክ"
                    value={formData.Phone}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="col-12">
                  <div className="font-weight-semi-bold h5 mb-3">
                    ተጨማሪ መረጃ ስለ አባሉ
                  </div>
                </div>
                <div className="form-group col-12 col-md-4">
                  <label htmlFor="WorkingPlace">የስራቦታ</label>
                  <input
                    type="text"
                    className="form-control"
                    id="WorkingPlace"
                    name="WorkingPlace"
                    placeholder="የስራ ቦታ"
                    value={formData.WorkingPlace}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="form-group col-12 col-md-4">
                  <label htmlFor="Gender">ጾታ</label>
                  <input
                    type="text"
                    className="form-control"
                    id="Gender"
                    name="Gender"
                    placeholder="ጾታ"
                    value={formData.Gender}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="form-group col-12 col-md-4">
                  <label htmlFor="date_of_joining">የገባበት ቀን</label>
                  <input
                    type="date"
                    className="form-control"
                    id="date_of_joining"
                    name="date_of_joining"
                    value={formData.date_of_joining}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>

              <button type="submit" className="btn btn-primary float-right" disabled={loading}>
                {loading ? "Submitting..." : "መዝግብ"}
              </button>
            </form>

            {/* Display error message if there's an issue */}
            {error && <p className="text-danger mt-3">{error}</p>}
          </div>
          {/* End Form */}
        </div>
      </div>
    </div>
  );
};
