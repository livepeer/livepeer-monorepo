import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogTitle from "@material-ui/core/DialogTitle";
import * as Utils from "web3-utils";
import { useState } from "react";
import {
  Root,
  Header,
  HeaderGroup,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Status,
  Title,
  Footer
} from "./styles";
import Avatar from "../Avatar";
import Chip from "../Chip";
// import { MdContentCopy, MdAdd } from 'react-icons/all'

type Transcoder = {
  id: string;
  active: boolean;
  totalStake: number;
  rewardCut: number;
  feeShare: number;
  pricePerSegment: number;
  pools: Array<Pool>;
};

type Pool = {
  rewardTokens: number;
};

export default ({ transcoder }: { transcoder: Transcoder }) => {
  const [isOpen, setIsOpen] = useState(false);
  const missedRewardCalls = transcoder.pools
    .slice(Math.max(transcoder.pools.length - 30, 1))
    .filter(pool => pool.rewardTokens === null).length;

  return (
    <Root>
      <Header>
        <HeaderGroup>
          <Avatar id={transcoder.id} />
          <Title>
            {transcoder.id.replace(transcoder.id.slice(7, 37), "…")}
            {/* <MdContentCopy
              size={14}
              style={{ cursor: 'pointer', marginLeft: 8 }}
            /> */}
          </Title>
        </HeaderGroup>
        <Status active={transcoder.active}>
          {transcoder.active ? "active" : "inactive"}
        </Status>
      </Header>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Total Stake</TableCell>
            <TableCell>Reward Cut</TableCell>
            <TableCell>Fee Share</TableCell>
            <TableCell>Price</TableCell>
            <TableCell>Missed Reward Calls</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          <TableRow>
            <TableCell>
              {parseFloat(
                Utils.fromWei(transcoder.totalStake.toString())
              ).toFixed(2)}{" "}
              LPT
            </TableCell>
            <TableCell>{transcoder.rewardCut / 10000}%</TableCell>
            <TableCell>{transcoder.feeShare / 10000}%</TableCell>
            <TableCell>
              {transcoder.pricePerSegment / 1000000000} GWEI
            </TableCell>
            <TableCell style={{ color: missedRewardCalls ? "red" : "inherit" }}>
              {missedRewardCalls}
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
      <Footer>
        <Chip onClick={() => setIsOpen(true)}>
          {/* <MdAdd style={{ marginRight: '4' }} /> Bond */}
        </Chip>
        {/* <span style={{ margin: '0 16px', fontWeight: 600 }}>Your Stake:</span>{' '}
        740 LPT (1%) */}
      </Footer>
      <Dialog
        open={isOpen}
        onClose={() => setIsOpen(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle>
          <span style={{ fontWeight: 600 }}>Bond Your Token</span>
        </DialogTitle>
        {/* <DialogContent>
          <DialogContentText id="alert-dialog-description">
            <div style={{ fontFamily: fonts.primary }}>
              <ul style={{listStyle: ''}}>
                <li>You may only bond to one delegate.</li>
                <li>You may switch delegates any time.</li>
                <li>You do not need to unbond to switch delegates.</li>
                <li>
                  You will automatically claim up to 20 rounds of unclaimed
                  earnings when bonding.
                </li>
              </ul>
            </div>
          </DialogContentText>
        </DialogContent> */}
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Delegate</TableCell>
              <TableCell>Token Balance</TableCell>
              <TableCell>Transfer Allowance</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              <TableCell>0xas23js</TableCell>
              <TableCell>0 LPT</TableCell>
              <TableCell>120</TableCell>
            </TableRow>
          </TableBody>
        </Table>
        <DialogActions>
          <div> agree</div>
          <div> cancel</div>
        </DialogActions>
      </Dialog>
    </Root>
  );
};
