import https, { RequestOptions } from 'https';
import { parse } from 'url';

import {
  EXTERNAL_SEARCH_API_URL_COMPANIES,
  EXTERNAL_SEARCH_API_URL_PAYMENTS,
  EXTERNAL_SEARCH_API_TOKEN,
} from '../constants';

export enum RequestType {
  COMPANY = 'company',
  PAYMENTS = 'payments',
}

const getExternalUrl = (type: RequestType) => {
  switch (type) {
    case RequestType.COMPANY:
      return EXTERNAL_SEARCH_API_URL_COMPANIES;
      case RequestType.PAYMENTS:
        return EXTERNAL_SEARCH_API_URL_PAYMENTS;
      default:
          return '';
  }
}

const fetchExternal = async (
  type: RequestType,
  query: string,
): Promise<any> => new Promise((resolve, reject) => {
  const urlData = parse(getExternalUrl(type));
  const params: RequestOptions = {
    ...urlData,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      Authorization: `Token ${EXTERNAL_SEARCH_API_TOKEN}`,
    },
  };

  const request = https.request(params, (res) => {
    res.setEncoding('utf8');

    let body = '';
    res.on('data', (chunk) => {
      body += chunk.toString();
    })

    res.on('end', () => {
      try {
        const data = JSON.parse(body);
        resolve(data);
      }catch (err) {
        reject(err);
      }
    });
  });

  request.on('error', (e) => {
    reject(e);
  });

  request.write(JSON.stringify({
    query,
  }));

  request.end();
})

export default fetchExternal;
