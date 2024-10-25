import React, { useState, useEffect, useRef } from "react";
import { useParams, useLocation } from "react-router-dom";
import {
  Spinner,
  useToast,
  Button,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  Input,
} from "@chakra-ui/react";
const API = import.meta.env.VITE_API_URL;

export const Categorays = () => {
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

  const fetchAllUsers = async () => {
    try {
      const response = await fetch(`${API}/customers/get`); // Adjust the URL to your API
      if (!response.ok) {
        throw new Error("Failed to fetch users");
      }
      const fetchedUsers = await response.json();
      setUsers(fetchedUsers);
      console.log(fetchedUsers, "users");
      setShowUserList(true); // Show the user list
    } catch (err) {
      console.error(err);
    }
  };
  // Handle selecting/deselecting a user
  const toggleUserSelection = (user) => {
    setSelectedUsers((prevSelectedUsers) =>
      prevSelectedUsers.includes(user.id)
        ? prevSelectedUsers.filter((userId) => userId !== user.id)
        : [...prevSelectedUsers, user.id]
    );
  };
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

    try {
      const response = await fetch(`${API}/dates/addUsers`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          categoryId: id,
          userIds: selectedUsers, // Send selected user IDs
          paymentDate: finalDate,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to add users to the category");
      }
      setShowUserList(false); // Hide user list after adding
      setSelectedUsers([]); // Clear selected users

      console.log("Users added successfully");
    } catch (error) {
      console.error("Error adding users:", error);
    }
  };

  const handleAddUser = () => {
    fetchAllUsers(); // Fetch users and display the list
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

    try {
      // Make separate API calls for new and updated payments
      if (newPaymentsData.length > 0) {
        console.log(newPaymentsData, "new");
        const newResponse = await fetch(`${API}/dates/add`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newPaymentsData),
        });

        if (!newResponse.ok) {
          throw new Error("Failed to create new payments");
        } else {
          console.log("New payments saved successfully");
        }
      }

      if (updatedPaymentsData.length > 0) {
        console.log(updatedPaymentsData, "existing");
        const updateResponse = await fetch(
          `${API}/dates/update`,
          {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(updatedPaymentsData),
          }
        );

        if (!updateResponse.ok) {
          throw new Error("Failed to update existing payments");
        } else {
          console.log("Existing payments updated successfully");
        }
      }
    } catch (error) {
      console.error("Error:", error);
    }
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
  const openDeleteDialog = (user) => {
    setIsDeleteOpen(true);
  };

  const closeDeleteDialog = () => {
    setIsDeleteOpen(false);
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
                            <input
                              type="number"
                              placeholder=""
                              className="border rounded w-full p-1"
                              defaultValue={
                                paymentForDay ? paymentForDay.Amount : ""
                              }
                              onChange={(e) =>
                                handleInputChange(
                                  customer.id,
                                  i + 1,
                                  e.target.value,
                                  paymentForDay ? paymentForDay.id : null
                                )
                              }
                            />
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
          <AlertDialog
            isOpen={isDeleteOpen}
            leastDestructiveRef={cancelRef}
            onClose={closeDeleteDialog}
          >
            <AlertDialogOverlay>
              <AlertDialogContent>
                <AlertDialogHeader fontSize="lg" fontWeight="bold">
                  ያረጋግጡ !!!
                </AlertDialogHeader>

                <AlertDialogBody>እርግጠኛ ኖት ይህንን እቁብ ጨርሰውታል ?</AlertDialogBody>

                <AlertDialogFooter>
                  <Button ref={cancelRef} onClick={closeDeleteDialog}>
                    ተመለስ
                  </Button>
                  <Button colorScheme="red" onClick={handleComplete} ml={3}>
                    አዎ ጨርሻለው
                  </Button>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialogOverlay>
          </AlertDialog>
          <button
            onClick={addDay}
            className="bg-green-500 text-white px-4 py-2 rounded mt-3 ml-2"
          >
            + Add Day
          </button>
          <button
            // onClick={handleComplete}
            className="bg-green-600 text-white px-4 py-2 rounded mt-3 ml-2"
            onClick={() => openDeleteDialog(id)}
          >
            Completed
          </button>
          <button
            onClick={handleAddUser}
            className="bg-green-700 text-white px-4 py-2 rounded mt-3 ml-2"
          >
            Add User
          </button>
          <button
            onClick={handleSaveChanges}
            className="bg-blue-500 text-white px-4 py-2 rounded mt-3 ml-2"
          >
            Save
          </button>
          {showUserList && (
            <div className="overflow-x-auto mt-5">
              <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="py-2 px-4">ምረጥ</th>
                    <th className="py-2 px-4">ስም</th>
                    <th className="py-2 px-4">ስልክ</th>
                    <th className="py-2 px-4">የስራቦታ</th>
                    <th className="py-2 px-4">ጾታ</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user.id} className="border-t">
                      <td className="py-2 px-4">
                        <input
                          type="checkbox"
                          checked={selectedUsers.includes(user.id)}
                          onChange={() => toggleUserSelection(user)}
                        />
                      </td>
                      <td className="py-2 px-4">{user.Name}</td>
                      <td className="py-2 px-4">{user.Phone}</td>
                      <td className="py-2 px-4">{user.WorkingPlace}</td>
                      <td className="py-2 px-4">
                        {user.Gender === "ወ" ? "Male" : "Female"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <button
                onClick={handleAddSelectedUsers}
                className="bg-green-500 text-white px-4 py-2 rounded mt-3"
              >
                Add Selected Users
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
