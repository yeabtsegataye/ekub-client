import React, { useEffect, useState, useRef } from "react";
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
  Input 
} from "@chakra-ui/react";

const API = import.meta.env.VITE_API_URL;

export const AllUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editUserId, setEditUserId] = useState(null);
  const [updatedUser, setUpdatedUser] = useState({});
  const [deletingUser, setDeletingUser] = useState(null);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const cancelRef = useRef();
  const toast = useToast();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch(`${API}/customers/get`);
        if (!response.ok) {
          throw new Error("Failed to fetch users data.");
        }
        const data = await response.json();
        setUsers(data);
      } catch (err) {
        setError(err.message);
        toast({
          title: "Error fetching users",
          description: err.message,
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [toast]);

  const handleDelete = async () => {
    try {
      await fetch(`${API}/customers/delete/${deletingUser.id}`, { method: 'DELETE' });
      setUsers(users.filter(user => user.id !== deletingUser.id));
      toast({
        title: "User deleted",
        description: "በተሳካ ሁኔታ አባሉን አጥፍተዋል.",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: "Error deleting user",
        description: error.message,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setDeletingUser(null);
      setIsDeleteOpen(false);
    }
  };

  const handleEdit = (user) => {
    setEditUserId(user.id);
    setUpdatedUser({ ...user });
  };

  const handleUpdate = async () => {
    try {
      await fetch(`${API}/customers/update/${editUserId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedUser),
      });
      setUsers(users.map(user => user.id === editUserId ? updatedUser : user));
      toast({
        title: "User updated",
        description: "በተሳካ ሁኔታ መረጃውን ቀይረዋል.",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
      setEditUserId(null);
    } catch (error) {
      toast({
        title: "Error updating user",
        description: error.message,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const openDeleteDialog = (user) => {
    setDeletingUser(user);
    setIsDeleteOpen(true);
  };

  const closeDeleteDialog = () => {
    setIsDeleteOpen(false);
    setDeletingUser(null);
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
      <div className="card mb-3 mb-md-4">
        <div className="card-body">
          {/* <!-- Breadcrumb --> */}
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
          {/* <!-- End Breadcrumb --> */}

          <div className="mb-3 mb-md-4 d-flex justify-content-between">
            <div className="h3 mb-0">የአባላት ስም ዝርዝር</div>
          </div>

          {/* <!-- Users Table --> */}
          <div className="table-responsive-xl">
            <table className="table text-nowrap mb-0">
              <thead>
                <tr>
                  <th className="font-weight-semi-bold border-top-0 py-2">#</th>
                  <th className="font-weight-semi-bold border-top-0 py-2">
                    የአባል ስም
                  </th>
                  <th className="font-weight-semi-bold border-top-0 py-2">
                    ስልክ
                  </th>
                  <th className="font-weight-semi-bold border-top-0 py-2">
                    የስራ ቦታ
                  </th>
                  <th className="font-weight-semi-bold border-top-0 py-2">
                    ጾታ
                  </th>
                  <th className="font-weight-semi-bold border-top-0 py-2">
                    መረጃ ለመቀየር
                  </th>
                </tr>
              </thead>
              <tbody>
                {users.map((user, index) => (
                  <tr key={user.id}>
                    <td className="py-3">{index + 1}</td>
                    <td className="align-middle py-3">
                      {editUserId === user.id ? (
                        <Input 
                          value={updatedUser.Name} 
                          onChange={(e) => setUpdatedUser({ ...updatedUser, Name: e.target.value })}
                        />
                      ) : (
                        <div className="d-flex align-items-center">
                          <div className="position-relative mr-2">
                            <span className="avatar-placeholder mr-md-2">
                              {user.Name.charAt(0)}
                            </span>
                          </div>
                          {user.Name}
                        </div>
                      )}
                    </td>
                    <td className="py-3">
                      {editUserId === user.id ? (
                        <Input 
                          value={updatedUser.Phone} 
                          onChange={(e) => setUpdatedUser({ ...updatedUser, Phone: e.target.value })}
                        />
                      ) : (
                        user.Phone
                      )}
                    </td>
                    <td className="py-3">
                      {editUserId === user.id ? (
                        <Input 
                          value={updatedUser.WorkingPlace} 
                          onChange={(e) => setUpdatedUser({ ...updatedUser, WorkingPlace: e.target.value })}
                        />
                      ) : (
                        user.WorkingPlace
                      )}
                    </td>
                    <td className="py-3">
                      {editUserId === user.id ? (
                        <Input 
                          value={updatedUser.Gender} 
                          onChange={(e) => setUpdatedUser({ ...updatedUser, Gender: e.target.value })}
                        />
                      ) : (
                        user.Gender
                      )}
                    </td>
                    <td className="py-3">
                      {editUserId === user.id ? (
                        <Button colorScheme="blue" onClick={handleUpdate}>Save</Button>
                      ) : (
                        <div className="position-relative">
                          <a className="link-dark d-inline-block mr-5" onClick={() => handleEdit(user)}>
                            <i className="gd-pencil icon-text"></i>
                          </a>
                          <a className="link-dark d-inline-block" onClick={() => openDeleteDialog(user)}>
                            <i className="gd-trash icon-text"></i>
                          </a>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Delete Confirmation Modal */}
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

                <AlertDialogBody>
                 እርግጠኛ ኖት ይህንን አባል ማጥፋት ይፈልጋሉ ?
                </AlertDialogBody>

                <AlertDialogFooter>
                  <Button ref={cancelRef} onClick={closeDeleteDialog}>
                    ተመለስ
                  </Button>
                  <Button colorScheme="red" onClick={handleDelete} ml={3}>
                    አጥፋ
                  </Button>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialogOverlay>
          </AlertDialog>
        </div>
      </div>
    </div>
  );
};
