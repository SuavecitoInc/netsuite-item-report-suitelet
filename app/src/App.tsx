import React, { useCallback, useEffect, useState } from 'react';
import Datepicker from 'react-tailwindcss-datepicker';
import Loading from './components/Loading';
import Table from './components/Table';
import { fetchAPI, jsonToCsv } from './lib/utils';

import './App.css';
import { ItemResult } from './lib/types';

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const today = new Date();
  const yesterday = today.setDate(today.getDate() - 1);
  const tomorrow = new Date(today.setDate(today.getDate() + 1));
  const [preview, setPreview] = useState<ItemResult[]>([]);
  const [value, setValue] = useState({
    startDate: new Date(yesterday),
    endDate: new Date(yesterday),
  });

  const getData = useCallback(async () => {
    try {
      setIsLoading(true);

      const response = await fetchAPI<any>('GET_RESULTS', {
        startDate: value.startDate || new Date(yesterday),
        endDate: value.endDate || new Date(yesterday),
      });

      console.log('RESPONSE', response);

      if (!response.success) {
        throw new Error(response.error);
      }

      const snippet = response.data;

      setPreview(snippet);
      setIsLoading(false);
    } catch (err: unknown) {
      console.error(err);
      setIsLoading(false);
    }
  }, [value.startDate, value.endDate]);

  const exportData = useCallback(async () => {
    jsonToCsv(preview);
  }, [preview]);

  useEffect(() => {
    getData();
  }, []);

  return (
    <>
      {isLoading ? (
        <Loading />
      ) : (
        <div>
          <div className="max-w-full">
            <h3 className="font-bold uppercase">Filter Sales By Date</h3>
            <div className="mb-5">
              <div className="max-w-sm">
                <div className="mb-5 flex flex-col gap-4">
                  <Datepicker
                    value={value}
                    inputClassName="w-full rounded-md focus:ring-0 font-normal bg-gray-50 placeholder:text-black text-black"
                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                    // @ts-expect-error
                    onChange={newValue => setValue(newValue)}
                    showShortcuts={true}
                    maxDate={tomorrow}
                  />
                  <div className="flex flex-row gap-4">
                    <button
                      type="button"
                      onClick={getData}
                      className="w-full rounded-lg bg-blue-700 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 sm:w-auto"
                    >
                      Submit
                    </button>
                    <button
                      type="button"
                      onClick={exportData}
                      className="w-full rounded-lg bg-slate-700 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-slate-800 focus:outline-none focus:ring-4 focus:ring-blue-300 sm:w-auto"
                    >
                      Export
                    </button>
                  </div>
                </div>
              </div>
              <h3 className="font-bold uppercase">
                Results ({preview.length})
              </h3>
              <div className="mb-5">
                <Table results={preview} />
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default App;
