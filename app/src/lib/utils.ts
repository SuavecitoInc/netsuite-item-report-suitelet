import Papa from 'papaparse';

export const fetchAPI = async <T>(action: string, payload: unknown) => {
  const restletUrl = '/app/site/hosting/restlet.nl?script=2492&deploy=1';
  console.log('FETCHING', restletUrl);
  console.log('PAYLOAD', payload);
  console.log('ACTION', action);
  const response = await fetch(restletUrl, {
    method: 'POST',
    headers: {
      accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      action,
      payload,
    }),
  });
  const data = (await response.json()) as T;

  return data;
};

export const jsonToCsv = (json: any) => {
  const csv = Papa.unparse({
    fields: Object.keys(json[0]),
    data: json,
  });
  const csvData = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const csvURL = window.URL.createObjectURL(csvData);
  const link = document.createElement('a');
  link.href = csvURL;
  link.setAttribute('download', 'download.csv');
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(csvURL);
};
