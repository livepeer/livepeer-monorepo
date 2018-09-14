import React from 'react'
import TableData from './TableData'
import { Button } from '../../components'

const MiningArea = ({
  amtLpt,
  balance,
  cancelSave,
  changeGas,
  edit,
  editGas,
  estimCost,
  gas,
  handleSubmit,
  loading,
  lowBal,
  progress,
  saveGas,
}) => {
  return (
    <React.Fragment>
      {!loading && !progress && <h1>Your mining parameters</h1>}
      {!progress && (
        <React.Fragment>
          <table>
            <tbody>
              <tr>
                <TableData
                  tableData="Account balance:"
                  help="The balance on your web3 enabled browser or wallet plugin."
                />
                <TableData beforeData={balance.toString()} tableData="Ether" />
              </tr>
              {lowBal && (
                <tr>
                  <TableData
                    tableData="You do not have sufficient funds in your web-3 wallet to mine LPT tokens."
                    colSpan="2"
                  />
                </tr>
              )}
              <tr>
                <TableData
                  tableData="Gas price:"
                  help="The current market price of 1 gas according to EthGasStation."
                />
                <TableData
                  beforeData={gas}
                  btnVal="Edit"
                  cancelSave={cancelSave}
                  changeDataState={changeGas}
                  edit={edit}
                  save={saveGas}
                  showBtn={true}
                  tableData="Gwei"
                  toggleForm={editGas}
                />
              </tr>
              <tr>
                <TableData
                  tableData={`Warning: Mining may not succeed if the offered gas price is too
                            low, as other miners may mine these accounts while your transaction is pending.
                            Offering a higher gas price may help get your transaction confirmed quickly.`}
                  colSpan="2"
                />
              </tr>
            </tbody>
          </table>
          <hr />
          <h1>Estimated mining results</h1>
          <table>
            <tbody>
              <tr>
                <TableData
                  tableData="Estimated cost:"
                  help={`Total total cost of one round of mining and generating
                          tokens for the 20 eligible ethereum addresses.`}
                />
                <TableData beforeData={estimCost} tableData="Ether" />
              </tr>
              <tr>
                <TableData
                  tableData="Estimated time:"
                  help={`The time it takes to complete one round of mining.`}
                />
                <TableData beforeData="1 - 5" tableData="Min" />
              </tr>
              <tr>
                <TableData
                  tableData="Estimated number of LPT tokens you will earn:"
                  help={`The portion of the LPT tokens that will be issued to
                          you in one round of mining.`}
                />
                <TableData beforeData={amtLpt} tableData="LPT" />
              </tr>
            </tbody>
          </table>
          <div className="center-div">
            <Button
              onClick={handleSubmit}
              style={{
                backgroundColor: lowBal ? '#ccc' : '#000000',
              }}
              className="primary-btn"
            >
              Earn LPT
            </Button>
          </div>
        </React.Fragment>
      )}
    </React.Fragment>
  )
}

export default MiningArea
