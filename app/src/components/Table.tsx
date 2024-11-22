import React from 'react';
import { ItemResult } from '../lib/types';

const headers = [
  'Internal ID',
  'Type',
  'SKU',
  'Name',
  'Quantity',
  'Sales',
  'Inventory Available',
];

type Props = {
  results: ItemResult[];
};

function Table({ results }: Props) {
  return (
    <div className="relative overflow-x-auto">
      <table className="w-full text-left text-sm text-gray-500 rtl:text-right">
        <thead className="bg-gray-50 text-xs uppercase text-gray-100">
          <tr className="bg-black text-gray-100">
            {headers.map(header => (
              <th key={header} scope="col" className="px-6 py-3">
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {results.map(result => (
            <tr
              key={result.internalid}
              className="border-b odd:bg-white even:bg-gray-50"
            >
              <td className="px-6 py-4">{result.internalid}</td>
              <td className="px-6 py-4">{result.type}</td>
              <td className="px-6 py-4">{result.sku}</td>
              <td className="px-6 py-4">{result.name}</td>
              <td className="px-6 py-4">{result.quantity}</td>
              <td className="px-6 py-4">${result.sales}</td>
              {result.type === 'Kit' ? (
                <td className="px-6 py-4">N/A</td>
              ) : (
                <td className="px-6 py-4">
                  <strong>Main Warehouse: </strong>
                  {result.mwAvailable}
                  <br />
                  <strong>Store: </strong>
                  {result.storeAvailable}
                  <br />
                  <strong>Townsend: </strong>
                  {result.twAvailable}
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Table;
