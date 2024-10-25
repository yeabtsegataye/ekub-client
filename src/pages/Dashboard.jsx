import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Spinner, useToast } from "@chakra-ui/react";
const API = import.meta.env.VITE_API_URL;

export const Dashboard = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const toast = useToast();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${API}/categoray/get`); // Adjust the URL to your API
        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }
        const result = await response.json();

        // Sort the data by the Start date in ascending order (FIFO)
        const sortedData = result.sort(
          (a, b) => new Date(a.Start) - new Date(b.Start)
        );

        setData(sortedData);
      } catch (err) {
        setError(err.message);
        toast({
          title: "Error fetching data",
          description: err.message,
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [toast]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB"); // Adjust the locale as needed
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spinner size="xl" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-red-500">Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="py-4 px-3 px-md-4">
      <div className="mb-3 mb-md-4 d-flex justify-content-between">
        <h3 className="mb-0">የእቁብ አይነቶች ዝርዝር</h3>
      </div>

      {/* Flexbox with wrap for responsiveness */}
      <div className="flex flex-wrap gap-6 justify-center">
        {data.map((item) => (
          <div
            key={item.id}
            className="flex flex-col p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow w-full sm:w-[calc(50%-12px)] lg:w-[calc(33.33%-12px)] xl:w-[calc(25%-12px)]"
          >
            <Link
              to={`/categorays/${item.id}?start=${item.Start}&end=${item.End}`}
            >
              <h4 className="text-lg font-bold mb-2">
                {item.Amount ? item.Amount : "---"}
              </h4>
              <p className="text-gray-600 mb-1">
                <span className="font-medium">የጀመረበት ቀን:</span>{" "}
                {item.Start ? formatDate(item.Start) : "---"}
              </p>
              <p className="text-gray-600">
                <span className="font-medium">የሚያበቃበት ቀን:</span>{" "}
                {item.End ? formatDate(item.End) : "---"}
              </p>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};
