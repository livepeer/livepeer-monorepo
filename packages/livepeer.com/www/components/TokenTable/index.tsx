import { useEffect, useState, Fragment } from "react";
import { useApi } from "../../hooks";
import { Box, Button, Flex, Input } from "@theme-ui/components";
import Modal from "../Modal";
import { Table, TableRow, Checkbox } from "../Table";
import CopyBox from "../CopyBox";

export default ({ userId, id }) => {
  const [tokens, setTokens] = useState([]);
  const [tokenName, setTokenName] = useState("");
  const [createModal, setCreateModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [creating, setCreating] = useState(false);
  const [newToken, setNewToken] = useState(null);
  const [selectedToken, setSelectedToken] = useState(null);
  const [copyTime, setCopyTime] = useState(null);
  const { getApiTokens, createApiToken, deleteApiToken } = useApi();
  useEffect(() => {
    getApiTokens(userId)
      .then(tokens => setTokens(tokens))
      .catch(err => console.error(err)); // todo: surface this
  }, [userId, newToken, deleteModal]);
  const close = () => {
    setCreateModal(false);
    setDeleteModal(false);
    setTokenName("");
    setNewToken(null);
    setCopyTime(null);
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
      {createModal && (
        <Modal onClose={close}>
          {!newToken && (
            <form
              id={id}
              onSubmit={e => {
                e.preventDefault();
                if (creating) {
                  return;
                }
                setCreating(true);
                createApiToken({ name: tokenName })
                  .then(newToken => {
                    setNewToken(newToken);
                    setCreating(false);
                  })
                  .catch(e => {
                    setCreating(false);
                  });
              }}
            >
              <h3>Create token</h3>
              <p>
                Enter a name for your token to differentiate it from other
                tokens.
              </p>
              <Input
                label="Name"
                value={tokenName}
                onChange={e => setTokenName(e.target.value)}
                placeholder="New Token"
              ></Input>
              <Flex sx={{ justifyContent: "flex-end", py: 3 }}>
                <Button
                  type="button"
                  variant="outlineSmall"
                  onClick={close}
                  sx={{ mr: 2 }}
                >
                  Cancel
                </Button>
                <Button type="submit" variant="secondarySmall">
                  Create Token
                </Button>
              </Flex>
            </form>
          )}
          {newToken && (
            <Box>
              <h5>Token created</h5>
              <p>Please copy your token and store it in a safe place.</p>
              <p>
                <strong>
                  For security reasons, it will not be shown again.
                </strong>
              </p>
              <Box>
                <CopyBox
                  onCopy={() => setCopyTime(Date.now())}
                  copy={newToken.id}
                />
              </Box>
              <Flex
                sx={{
                  justifyContent: "space-between",
                  alignItems: "center",
                  py: 3
                }}
              >
                <Box>{copyTime !== null && <strong>Copied!</strong>}</Box>
                <Button type="button" variant="secondarySmall" onClick={close}>
                  Close
                </Button>
              </Flex>
            </Box>
          )}
        </Modal>
      )}
      {deleteModal && selectedToken && (
        <Modal onClose={close}>
          <h3>Delete token</h3>
          <p>Are you sure you want to delete token "{selectedToken.name}"?</p>
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
                deleteApiToken(selectedToken.id).then(close);
              }}
            >
              Delete
            </Button>
          </Flex>
        </Modal>
      )}
      <p>
        <strong>Note:</strong> These tokens allow other apps to control your
        whole account. Treat them like you would a password.
      </p>
      <Box>
        <Button
          variant="outlineSmall"
          sx={{ margin: 2 }}
          onClick={() => {
            setCreateModal(true);
          }}
        >
          Create
        </Button>
        <Button
          variant="secondarySmall"
          disabled={!selectedToken}
          sx={{ margin: 2, mb: 4 }}
          onClick={() => selectedToken && setDeleteModal(true)}
        >
          Delete
        </Button>
      </Box>
      <Table sx={{ gridTemplateColumns: "auto 1fr auto" }}>
        <TableRow variant="header">
          <Box></Box>
          <Box>Name</Box>
          <Box>Last Active</Box>
        </TableRow>
        {tokens.map(token => {
          const { id, name, lastSeen } = token;
          let formattedLastSeen = <em>unused</em>;
          if (lastSeen) {
            formattedLastSeen = (
              <span>
                {new Date(lastSeen).toLocaleDateString()}&nbsp;
                {new Date(lastSeen).toLocaleTimeString()}
              </span>
            );
          }
          const selected = selectedToken && selectedToken.id === id;
          return (
            <TableRow
              selected={selected}
              key={id}
              onClick={() => {
                if (selected) {
                  setSelectedToken(null);
                } else {
                  setSelectedToken(token);
                }
              }}
            >
              <Checkbox value={selected} />
              <Box>{name}</Box>
              <Box>{formattedLastSeen}</Box>
            </TableRow>
          );
        })}
      </Table>
    </Box>
  );
};
