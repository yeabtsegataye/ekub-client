import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
const API = import.meta.env.VITE_API_URL;

export const History = () => {
  // State to store fetched data
  const [historyData, setHistoryData] = useState([]);
  
  // Fetch data from API when component mounts
  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await axios.get(`${API}/categoray/history`);
        setHistoryData(response.data);  // Set data to state
      } catch (error) {
        console.error("Error fetching history data:", error);
      }
    };

    fetchHistory(); // Call the function
  }, []); // Empty array means it runs only once on mount

  return (
    <div className="py-4 px-3 px-md-4">
      <div className="card mb-3 mb-md-4">
        <div className="card-body">
          {/* Breadcrumb */}
          <nav className="d-none d-md-block" aria-label="breadcrumb">
            <ol className="breadcrumb">
              <li className="breadcrumb-item">
                <a href="#">Users</a>
              </li>
              <li className="breadcrumb-item active" aria-current="page">
                ሙሉ አባላት
              </li>
            </ol>
          </nav>
          {/* End Breadcrumb */}

          <div className="mb-3 mb-md-4 d-flex justify-content-between">
            <div className="h3 mb-0">የአባላት ስም ዝርዝር</div>
          </div>

          {/* Users Table */}
          <div className="table-responsive-xl">
            <table className="table text-nowrap mb-0">
              <thead>
                <tr>
                  <th className="font-weight-semi-bold border-top-0 py-2">#</th>
                  <th className="font-weight-semi-bold border-top-0 py-2">የእቁብ መጠን</th>
                  <th className="font-weight-semi-bold border-top-0 py-2">የጀመረበት ቀን</th>
                  <th className="font-weight-semi-bold border-top-0 py-2">ያበቃበት ቀን</th>
                  <th className="font-weight-semi-bold border-top-0 py-2">መረጃ ለመቀየር</th>
                </tr>
              </thead>
              <tbody>
                {historyData.length > 0 ? (
                  historyData.map((item, index) => (
                    <tr key={item.id} className="hover:blue-400">
                      <td className="py-3">{index + 1}</td>
                      <td className="py-3">{item.Amount}</td>
                      <td className="py-3">{new Date(item.Start).toLocaleDateString()}</td>
                      <td className="py-3">{new Date(item.End).toLocaleDateString()}</td>
                      <td className="py-3">
                        <div className="position-relative">
                          <Link to={`/historyDetails/${item.id}?start=${item.Start}&end=${item.End}`} className="link-dark d-inline-block mr-5" >
                            <i className="gd-eye icon-text"></i>
                          </Link>
                          <a className="link-dark d-inline-block" href="#">
                            <i className="gd-trash icon-text"></i>
                          </a>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="text-center py-3">
                      No data available
                    </td>
                  </tr>
                )}
              </tbody>
            </table>

            {/* Pagination Example (You may need to customize it based on API response) */}
            <div className="card-footer d-block d-md-flex align-items-center d-print-none">
              <div className="d-flex mb-2 mb-md-0">
                Showing 1 to {historyData.length} of {historyData.length} Entries
              </div>

              <nav className="d-flex ml-md-auto d-print-none" aria-label="Pagination">
                <ul className="pagination justify-content-end font-weight-semi-bold mb-0">
                  <li className="page-item">
                    <a id="datatablePaginationPrev" className="page-link" href="#!" aria-label="Previous">
                      <i className="gd-angle-left icon-text icon-text-xs d-inline-block"></i>
                    </a>
                  </li>
                  <li className="page-item d-none d-md-block">
                    <a id="datatablePaginationPage0" className="page-link active" href="#!" data-dt-page-to="0">
                      1
                    </a>
                  </li>
                  {/* Add more pagination items dynamically based on data length */}
                  <li className="page-item">
                    <a id="datatablePaginationNext" className="page-link" href="#!" aria-label="Next">
                      <i className="gd-angle-right icon-text icon-text-xs d-inline-block"></i>
                    </a>
                  </li>
                </ul>
              </nav>
            </div>
          </div>
          {/* End Users Table */}
        </div>
      </div>
    </div>
  );
};
