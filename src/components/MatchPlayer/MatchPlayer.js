/* eslint-disable react/prop-types */
import { Table } from 'react-bootstrap';

function MatchPlayer({ data }) {
  return (
    <div className="w-50 d-block mx-auto p-5">
      <h2 className="text-center text-primary">{data.name}</h2>
      <Table className="mt-4 mx-auto w-50">
        <tbody>
          {data.stats ? Object.entries(data.stats).map(([name, value]) => {
            const normalizeName = name.replace(/([A-Z])/g, ' $1');
            const displayName = normalizeName.charAt(0).toUpperCase() + normalizeName.slice(1);
            return (
              <tr>
                <td className="text-primary ">{displayName}</td>
                <td className="text-primary">{Object.keys(value).length}</td>
              </tr>
            );
          }) : <p className="text-primary text-center">Did not play</p>}
        </tbody>
      </Table>
    </div>
  );
}

export default MatchPlayer;
