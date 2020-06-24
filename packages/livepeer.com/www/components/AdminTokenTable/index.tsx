import { useEffect, useState, Fragment, useMemo, useReducer } from "react";
import { useApi } from "../../hooks";
import { Select, Box, Button, Flex, Input } from "@theme-ui/components";
import Modal from "../Modal";
import { Table, TableRow, Checkbox, TableRowVariant } from "../Table";
import CopyBox from "../CopyBox";
import { User } from "@livepeer/api";
import ReactTooltip from "react-tooltip";

export const UserName = ({ id, users }: { id: string; users: Array<User> }) => {
  const user = users.find((o) => o.id === id);
  const tid = `tooltip-name-${id}`;
  return (
    <Box
      sx={{
        overflow: "hidden",
        textOverflow: "ellipsis",
      }}
    >
      <ReactTooltip
        id={tid}
        className="tooltip"
        place="top"
        type="dark"
        effect="solid"
      >
        {user ? user.email : id}
      </ReactTooltip>
      <span data-tip data-for={tid}>
        {user
          ? user.email.includes("@")
            ? user.email.split("@").join("@\u{200B}")
            : user.email
          : id}
      </span>
    </Box>
  );
};

type TokenTableProps = {
  userId: string;
  id: string;
};

export default ({ id }: TokenTableProps) => {
  const [tokens, setTokens] = useState([]);
  const [tokenName, setTokenName] = useState("");
  const [newTokenUserId, setNewTokenUserId] = useState("");
  const [createModal, setCreateModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [creating, setCreating] = useState(false);
  const [newToken, setNewToken] = useState(null);
  const [selectedToken, setSelectedToken] = useState(null);
  const [copyTime, setCopyTime] = useState(null);
  const [users, setUsers] = useState([]);
  const {
    getApiTokens,
    createApiToken,
    deleteApiToken,
    getUser,
    getUsers,
  } = useApi();
  useEffect(() => {
    getApiTokens(null)
      .then((tokens) => {
        if (tokens) {
          tokens.sort((a, b) => a.userId.localeCompare(b.userId));
        }
        setTokens(tokens);
      })
      .catch((err) => console.error(err)); // todo: surface this
  }, [newToken, deleteModal]);
  useEffect(() => {
    getUsers()
      .then((users) => setUsers(users))
      .catch((err) => console.error(err)); // todo: surface this
  }, []);
  const close = () => {
    setCreateModal(false);
    setDeleteModal(false);
    setTokenName("");
    setNewTokenUserId("");
    setNewToken(null);
    setCopyTime(null);
  };
  const sortUser = () => {
    if (tokens) {
      tokens.sort((a, b) => a.userId.localeCompare(b.userId));
      setTokens([...tokens]);
    }
  };
  const sortLastAact = () => {
    if (tokens) {
      tokens.sort((a, b) => (b.lastSeen || 0) - (a.lastSeen || 0));
      setTokens([...tokens]);
    }
  };
  const sortName = () => {
    if (tokens) {
      tokens.sort((a, b) => (a.name || "").localeCompare(b.name || ""));
      setTokens([...tokens]);
    }
  };
  return (
    <Box
      sx={{
        width: "100%",
        maxWidth: 958,
        mb: [3, 3],
        mx: "auto",
      }}
    >
      {createModal && (
        <Modal onClose={close}>
          {!newToken && (
            <form
              id={id}
              onSubmit={(e) => {
                e.preventDefault();
                if (creating) {
                  return;
                }
                setCreating(true);
                createApiToken({ name: tokenName, userId: newTokenUserId })
                  .then((newToken) => {
                    setNewToken(newToken);
                    setCreating(false);
                  })
                  .catch((e) => {
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
                onChange={(e) => setTokenName(e.target.value)}
                placeholder="New Token"
              ></Input>
              <Select
                sx={{ mt: "1em" }}
                onChange={(e) => setNewTokenUserId(e.target.value)}
              >
                {users.map((user) => (
                  <option value={user.id}>{user.email}</option>
                ))}
              </Select>
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
                  py: 3,
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
      <Table sx={{ gridTemplateColumns: "auto auto auto auto auto" }}>
        <TableRow variant={TableRowVariant.Header}>
          <Box></Box>
          <Box>id</Box>
          <Box
            sx={{
              cursor: "pointer",
            }}
            onClick={sortUser}
          >
            User ⭥
          </Box>
          <Box
            sx={{
              cursor: "pointer",
            }}
            onClick={sortName}
          >
            Name ⭥
          </Box>
          <Box
            sx={{
              cursor: "pointer",
            }}
            onClick={sortLastAact}
          >
            Last Active ⭥
          </Box>
        </TableRow>
        {tokens.map((token) => {
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
              <Box>{token.id}</Box>
              <UserName id={token.userId} users={users} />
              <Box>{name}</Box>
              <Box>{formattedLastSeen}</Box>
            </TableRow>
          );
        })}
      </Table>
    </Box>
  );
};
