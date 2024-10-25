import React, { useState, useEffect, useRef } from "react";
import { useParams, useLocation } from "react-router-dom";
const API = import.meta.env.VITE_API_URL;

export const HistoryDetails = () => {
  const { id } = useParams(); // Get the category ID from the URL
  const location = useLocation(); // Get access to the current location object
  const cancelRef = useRef();

  // Function to extract query parameters from the URL
  const queryParams = new URLSearchParams(location.search);
  const startDate = queryParams.get("start"); // Extract start date
  const endDate = queryParams.get("end"); // Extract end date
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const [days, setDays] = useState(1);
  const [loading, setLoading] = useState(true);
  const [payments, setPayments] = useState([]);
  const [changedPayments, setChangedPayments] = useState({}); // Track both new and updated payments
  const [showUserList, setShowUserList] = useState(false); // Toggle to show user list
  const [selectedUsers, setSelectedUsers] = useState([]); // Selected users to add to category
  const [users, setUsers] = useState([]); // State to hold fetched users

  const addDay = () => setDays(days + 1);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB");
  };

  // Fetch user data from the API based on category ID
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch(`${API}/dates/get/${id}`); // Adjust the URL to your API
        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }
        const fetchedPayments = await response.json();
        setPayments(fetchedPayments);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [id, showUserList]);

  // Handle saving the selected users to the category
  const handleAddSelectedUsers = async () => {
    const formatDate = (date) => {
      const d = new Date(date);
      let month = "" + (d.getMonth() + 1);
      let day = "" + d.getDate();
      let year = d.getFullYear();

      if (month.length < 2) month = "0" + month;
      if (day.length < 2) day = "0" + day;

      return [year, month, day].join("-"); // Returns YYYY-MM-DD
    };

    const finalDate = formatDate(startDate);

   };


  // Function to calculate the number of days between two dates
  const calculateDays = (start, end) => {
    const startDate = new Date(start);
    const endDate = end ? new Date(end) : new Date(); // End date or today
    const diffTime = Math.abs(endDate - startDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 10 ? 10 : diffDays; // Maximum of 10 days
  };

  // Determine how many days to display based on the startDate and current date
  useEffect(() => {
    if (startDate) {
      const dayCount = calculateDays(startDate, endDate);
      setDays(dayCount);
    }
  }, [startDate, endDate]);

  // Group payments by customer ID
  const groupedPayments = payments.reduce((acc, payment) => {
    const { customerId } = payment;
    if (!acc[customerId]) {
      acc[customerId] = {
        customer: payment.customer,
        payments: [],
      };
    }
    acc[customerId].payments.push(payment);
    return acc;
  }, {});

  // Function to handle input changes (for both new and existing payments)
  const handleInputChange = (
    customerId,
    dayIndex,
    value,
    paymentDateId = null
  ) => {
    setChangedPayments((prev) => ({
      ...prev,
      [customerId]: {
        ...prev[customerId],
        [dayIndex]: { value, paymentDateId },
      },
    }));
  };

  // Function to handle save and make separate requests for new and existing data
  const handleSaveChanges = async () => {
    const newPaymentsData = [];
    const updatedPaymentsData = [];

    Object.entries(changedPayments).forEach(([customerId, paymentsByDay]) => {
      Object.entries(paymentsByDay).forEach(
        ([dayIndex, { value, paymentDateId }]) => {
          if (value) {
            const paymentDate = new Date(startDate);
            paymentDate.setDate(paymentDate.getDate() + Number(dayIndex));

            const formattedPayment = {
              Amount: Number(value),
              PaymentDate: paymentDate.toISOString().split("T")[0], // Format date as YYYY-MM-DD
              customerId: Number(customerId),
              categoryId: Number(id),
            };

            if (paymentDateId) {
              // If it has a paymentDateId, it's an existing payment to be updated
              updatedPaymentsData.push({
                ...formattedPayment,
                paymentDateId: paymentDateId, // Existing payment
              });
            } else {
              // New payment to be created
              newPaymentsData.push({
                ...formattedPayment,
                paymentDateId: null, // New entry
              });
            }
          }
        }
      );
    });

  };
  const handleDelete = () => {
    console.log("deleting");
  };
  const handleComplete = async () => {
    try {
      const response = await fetch(
        `${API}/categoray/update/${id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            IsCompleted: true, // Set isCompleted to true
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update the completion status");
      }
      setIsDeleteOpen(false);
      const data = await response.json();

      // Optionally, update the UI or state here to reflect the change
    } catch (error) {
      console.error("Error completing category:", error);
    }
  };



  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="py-4 px-3 px-md-4">
      <div className="card mb-3 mb-md-4">
        <div className="card-body">
          <div className="mb-3 mb-md-4 d-flex justify-content-between">
            <div className="h3 mb-0">አባላት ዝርዝር</div>
            <div>የጀመረበት ቀን: {startDate ? formatDate(startDate) : "---"}</div>
            <div>የሚያበቃበት ቀን: {endDate ? formatDate(endDate) : "---"}</div>
          </div>

          <div className="table-container overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-200">
              <thead>
                <tr>
                  <th className="sticky left-0 bg-white p-2 border font-semibold min-w-[150px]">
                    ስም
                  </th>
                  <th className="left-20 bg-white p-2 border font-semibold min-w-[100px]">
                    ደርሶታል
                  </th>
                  {Array.from({ length: days }, (_, i) => (
                    <th
                      key={i}
                      className="p-2 border font-semibold min-w-[100px]"
                    >
                      ቀን {i + 1}
                    </th>
                  ))}
                  <th className="p-2 border font-semibold min-w-[150px]">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {Object.values(groupedPayments).map(
                  ({ customer, payments }) => (
                    <tr key={customer.id}>
                      <td className="sticky left-0 bg-white p-2 border min-w-[150px]">
                        {customer.Name}
                      </td>
                      <td className="left-40 bg-white p-2 border min-w-[100px]">
                        <input type="checkbox" />
                      </td>
                      {Array.from({ length: days }, (_, i) => {
                        const dayDate = new Date(startDate);

                        dayDate.setDate(dayDate.getDate() + i);

                        // console.log(dayDate,"dayDate")
                        const paymentForDay = payments.find(
                          (p) =>
                            new Date(p.PaymentDate)
                              .toISOString()
                              .split("T")[0] ===
                            dayDate.toISOString().split("T")[0]
                        );
                        return (
                          <td key={i} className="p-2 border min-w-[100px]">
                         { paymentForDay ? paymentForDay.Amount : ""}
                            
                          </td>
                        );
                      })}
                      <td className="p-2 border min-w-[150px]">
                        <button
                          onClick={handleDelete}
                          className="link-dark d-inline-block mr-5"
                          href="#"
                        >
                          <i className="gd-trash icon-text"></i>
                        </button>{" "}
                      </td>
                    </tr>
                  )
                )}
              </tbody>
            </table>
          </div>
    
        </div>
      </div>
    </div>
  );
};
