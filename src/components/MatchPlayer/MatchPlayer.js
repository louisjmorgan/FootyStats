/* eslint-disable react/prop-types */
import { Table } from 'react-bootstrap';

function MatchPlayer({ data }) {
  const tableContent = Object.entries(data.stats).map(([name, value]) => {
    const normalizeName = name.replace(/([A-Z])/g, ' $1');
    const displayName = normalizeName.charAt(0).toUpperCase() + normalizeName.slice(1);
    return (
      <tr>
        <td>{displayName}</td>
        <td>{Object.keys(value).length}</td>
      </tr>
    );
  });
  return (
    <div className="w-50 d-block mx-auto p-5">
      <h2 className="text-center">{data.name}</h2>
      <Table striped bordered hover>
        <tbody>
          {tableContent}
        </tbody>
      </Table>
    </div>
  );
}

export default MatchPlayer;
