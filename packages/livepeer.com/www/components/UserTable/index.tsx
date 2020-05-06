import { useEffect, useState } from "react";
import { useApi } from "../../hooks";
import { Box, Button, Flex, Input } from "@theme-ui/components";
import Modal from "../Modal";
import { Table, TableRow, Checkbox } from "../Table";

export default ({ userId, id }) => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [adminModal, setAdminModal] = useState(false);
  const [removeAdminModal, setRemoveAdminModal] = useState(false);
  const { getUsers, makeUserAdmin } = useApi();
  useEffect(() => {
    getUsers()
      .then(users => setUsers(users))
      .catch(err => console.error(err)); // todo: surface this
  }, [userId, adminModal, removeAdminModal, selectedUser]);
  const close = () => {
    setAdminModal(false);
    setRemoveAdminModal(false);
  };
  return (
    <Box
      sx={{
        width: "100%",
        maxWidth: 958,
        mb: [3, 3],
        mx: "auto"
      }}
    >
      {adminModal && selectedUser && (
        <Modal onClose={close}>
          <h3>Make User Admin</h3>
          <p>
            Are you sure you want to make user "{selectedUser.email}" an admin?
          </p>
          <Flex sx={{ justifyContent: "flex-end" }}>
            <Button
              type="button"
              variant="outlineSmall"
              onClick={close}
              sx={{ mr: 2 }}
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="secondarySmall"
              onClick={() => {
                makeUserAdmin(selectedUser.email, true).then(close);
              }}
            >
              Make User Admin
            </Button>
          </Flex>
        </Modal>
      )}
      {removeAdminModal && selectedUser && (
        <Modal onClose={close}>
          <h3>Remove Admin Rights</h3>
          <p>
            Are you sure you want to remove admin rights for "
            {selectedUser.email}"?
          </p>
          <Flex sx={{ justifyContent: "flex-end" }}>
            <Button
              type="button"
              variant="outlineSmall"
              onClick={close}
              sx={{ mr: 2 }}
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="secondarySmall"
              onClick={() => {
                makeUserAdmin(selectedUser.email, false).then(close);
              }}
            >
              Remove Admin Rights
            </Button>
          </Flex>
        </Modal>
      )}
      <p>
        <strong>Users:</strong>
      </p>
      <Button
        variant="secondarySmall"
        disabled={!selectedUser || selectedUser.admin}
        sx={{ margin: 2, mb: 4 }}
        onClick={() => selectedUser && setAdminModal(true)}
      >
        Make User Admin
      </Button>
      <Button
        variant="secondarySmall"
        disabled={!selectedUser || !selectedUser.admin}
        sx={{ margin: 2, mb: 4 }}
        onClick={() => selectedUser && setRemoveAdminModal(true)}
      >
        Remove Admin Rights
      </Button>
      {users.length === 0 ? (
        <p>No users created yet</p>
      ) : (
        <Table sx={{ gridTemplateColumns: "auto 1fr auto auto auto" }}>
          <TableRow variant="header">
            <Box></Box>
            <Box>ID</Box>
            <Box>Email</Box>
            <Box>EmailValid</Box>
            <Box>Admin</Box>
          </TableRow>
          {users.map(user => {
            const { id, email, emailValid, admin } = user;
            const selected = selectedUser && selectedUser.id === id;
            return (
              <TableRow
                selected={selected}
                key={id}
                onClick={() => {
                  if (selected) {
                    setSelectedUser(null);
                  } else {
                    setSelectedUser(user);
                  }
                }}
              >
                <Checkbox value={selected} />
                <Box>{id}</Box>
                <Box>{email}</Box>
                <Box>{JSON.stringify(emailValid)}</Box>
                <Box>{JSON.stringify(admin)}</Box>
              </TableRow>
            );
          })}
        </Table>
      )}
    </Box>
  );
};
