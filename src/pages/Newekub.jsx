import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  useToast,
  Tag,
  TagLabel,
  TagCloseButton,
} from "@chakra-ui/react";
const API = import.meta.env.VITE_API_URL;

export const Newekub = () => {
  // State to handle form input values
  const [amount, setAmount] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [customers, setCustomers] = useState([]); // Customers data from the backend
  const [selectedMembers, setSelectedMembers] = useState([]); // Selected members
  const toast = useToast();

  // Fetch customers from the backend on component mount
  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const response = await fetch(`${API}/customers/get`);
        const data = await response.json();
        setCustomers(data); // Assuming the response is an array of customers
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to fetch customers.",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      }
    };

    fetchCustomers();
  }, [toast]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Create the data object to send to the backend
    const newEkub = {
      Amount: amount,
      Start: startDate,
      End: endDate,
      Members: selectedMembers.map((member) => member.id), // Send selected member IDs
    };

    try {
        console.log(newEkub, 'ekubs')
      // Make a POST request to the backend API
      const response = await fetch(`${API}/categoray/add`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newEkub),
      });

      if (response.ok) {
        toast({
          title: "Success",
          description: "እቁቡ በተሳካ ሁኔታ ተመዝግቧል!",
          status: "success",
          duration: 5000,
          isClosable: true,
        });

        // Clear form and selected members
        setAmount("");
        setStartDate("");
        setEndDate("");
        setSelectedMembers([]);
      } else {
        throw new Error("Failed to add new Ekub");
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "እቁቡ ማስገባት አልተሳካም። እባክዎ ደግመው ይሞክሩ!",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  // Handle adding or removing a customer from the selected members
  const toggleMemberSelection = (customer) => {
    if (selectedMembers.find((member) => member.id === customer.id)) {
      // If already selected, remove the customer
      setSelectedMembers((prev) =>
        prev.filter((member) => member.id !== customer.id)
      );
    } else {
      // Add customer to selected members
      setSelectedMembers((prev) => [...prev, customer]);
    }
  };

  return (
    <Box p={5}>
      <form onSubmit={handleSubmit}>
        {/* Amount Input */}
        <FormControl mb={4} isRequired>
          <FormLabel>የእቁብ መጠን</FormLabel>
          <Input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="የእቁብ መጠን"
          />
        </FormControl>

        {/* Start and End Date Inputs */}
        <FormControl mb={4} isRequired>
          <FormLabel>የተጀመረበት ቀን</FormLabel>
          <Input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            placeholder="የተጀመረበት ቀን"
          />
        </FormControl>
        <FormControl mb={4} isRequired>
          <FormLabel>የሚያበቃበት ቀን</FormLabel>
          <Input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            placeholder="የሚያበቃበት ቀን"
          />
        </FormControl>

        {/* Selected Members Display */}
        <Box mb={4}>
          <FormLabel>አባላትን መምረጫ ክፍል:</FormLabel>
          {selectedMembers.map((member) => (
            <Tag size="md" key={member.id} mr={2} mb={2} colorScheme="green">
              <TagLabel>{member.Name}</TagLabel>
              <TagCloseButton
                onClick={() => toggleMemberSelection(member)}
              />
            </Tag>
          ))}
        </Box>

        {/* Customer Table */}
        <Table variant="simple" mb={4}>
          <Thead>
            <Tr>
              <Th>አባል ስም</Th>
              <Th>ስልክ ቁጥር</Th>
              <Th>የስራ ቦታ</Th>
              <Th>አባል መዝገብ</Th>
            </Tr>
          </Thead>
          <Tbody>
            {customers.map((customer) => (
              <Tr key={customer.id}>
                <Td>{customer.Name}</Td>
                <Td>{customer.Phone}</Td>
                <Td>{customer.WorkingPlace}</Td>
                <Td>
                  <Button
                    colorScheme={
                      selectedMembers.find((member) => member.id === customer.id)
                        ? "green"
                        : "blue"
                    }
                    onClick={() => toggleMemberSelection(customer)}
                  >
                    {selectedMembers.find((member) => member.id === customer.id)
                      ? "Selected"
                      : "Add"}
                  </Button>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>

        {/* Submit Button */}
        <Button type="submit" colorScheme="teal" float="right">
          አስገባ
        </Button>
      </form>
    </Box>
  );
};
