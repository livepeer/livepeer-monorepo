import Modal from "../Modal";
import { Button, Flex } from "@theme-ui/components";

type DeleteStreamModalProps = {
    streamName: string,
    onClose: Function,
    onDelete: Function,
}

export default ({ streamName, onClose, onDelete }: DeleteStreamModalProps) => {
  return (
    <Modal onClose={onClose}>
      <h3>Are you sure?</h3>
      <p>Are you sure you want to delete stream "{streamName}"?</p>
      <p>Deleting a stream cannot be undone.</p>
      <Flex sx={{ justifyContent: "flex-end" }}>
        <Button
          type="button"
          variant="outlineSmall"
          onClick={onClose}
          sx={{ mr: 2 }}
        >
          Cancel
        </Button>
        <Button
          type="button"
          variant="secondarySmall"
          onClick={onDelete}
        >
          Delete
        </Button>
      </Flex>
    </Modal>
  );
};
