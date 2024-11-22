/**
 *@NApiVersion 2.1
 *@NScriptType Restlet
 */

import { EntryPoints } from 'N/types';
import * as log from 'N/log';
import * as error from 'N/error';
import * as search from 'N/search';
import * as format from 'N/format';

type Action = 'GET_RESULTS';

type PostContext = {
  action: Action;
  payload: {
    startDate: string;
    endDate: string;
  };
};

type ItemSalesResult = {
  internalid: string;
  item: string;
  sku: string;
  name: string;
  type: string;
  quantity: string;
  sales: string;
};

type ItemInventoryResult = {
  internalid: string;
  item: string;
  sku: string;
  type: string;
  mwAvailable: string;
  storeAvailable: string;
  twAvailable: string;
};

type ItemResult = {
  internalid: string;
  item: string;
  sku: string;
  name: string;
  type: string;
  quantity: string;
  sales: string;
  mwAvailable: string;
  storeAvailable: string;
  twAvailable: string;
};

export const post: EntryPoints.RESTlet.post = async (context: PostContext) => {
  const ITEM_SALES_SEARCH = 'customsearch_sp_itm_report_sales_search';
  const ITEM_INVENTORY_SEARCH = 'customsearch_sp_itm_report_inv_search';

  const doValidation = (
    args: unknown[],
    argNames: string[],
    methodName: 'POST' | 'GET'
  ) => {
    for (let i = 0; i < args.length; i++)
      if (!args[i] && args[i] !== 0)
        throw error.create({
          name: 'MISSING_REQ_ARG',
          message:
            'Missing a required argument: [' +
            argNames[i] +
            '] for method: ' +
            methodName,
        });
  };

  const getItemSales = (startDate: string, endDate: string) => {
    // item search
    const itemSearch = search.load({
      type: search.Type.TRANSACTION,
      id: ITEM_SALES_SEARCH,
    });

    // patch filters
    let filters = itemSearch.filters;
    // remove trandate filter
    filters = filters.filter(f => f.name !== 'trandate');
    filters.push(
      search.createFilter({
        name: 'trandate',
        operator: search.Operator.WITHIN,
        values: [startDate, endDate],
      })
    );
    itemSearch.filters = filters;

    log.debug('itemSearch', JSON.stringify(itemSearch, null, 2));

    const pagedData = itemSearch.runPaged({
      pageSize: 1000,
    });

    const results: ItemSalesResult[] = [];
    pagedData.pageRanges.forEach(function (pageRange) {
      const page = pagedData.fetch({ index: pageRange.index });
      page.data.forEach(function (result) {
        // get values
        const internalid = result.getValue({
          name: 'internalid',
          join: 'item',
          summary: search.Summary.GROUP,
        }) as string;
        const item = result.getValue({
          name: 'item',
          summary: search.Summary.GROUP,
        }) as string;
        const sku = result.getValue({
          name: 'custitem_sp_item_sku',
          join: 'item',
          summary: search.Summary.GROUP,
        }) as string;
        const name = result.getValue({
          name: 'displayname',
          join: 'item',
          summary: search.Summary.GROUP,
        }) as string;
        const type = result.getValue({
          name: 'type',
          join: 'item',
          summary: search.Summary.GROUP,
        }) as string;
        const quantity = result.getValue({
          name: 'quantity',
          summary: search.Summary.SUM,
        }) as string;
        const sales = result.getValue({
          name: 'formulacurrency',
          summary: search.Summary.SUM,
        }) as string;

        results.push({
          internalid,
          item,
          sku,
          name,
          type,
          quantity,
          sales,
        });
      });
    });

    return results;
  };

  const getItemInventoryAvailable = (startDate: string, endDate: string) => {
    // item search
    const itemSearch = search.load({
      type: search.Type.TRANSACTION,
      id: ITEM_INVENTORY_SEARCH,
    });

    // patch filters
    let filters = itemSearch.filters;
    // remove trandate filter
    filters = filters.filter(f => f.name !== 'trandate');
    filters.push(
      search.createFilter({
        name: 'trandate',
        operator: search.Operator.WITHIN,
        values: [startDate, endDate],
      })
    );
    itemSearch.filters = filters;

    log.debug('inventorySearch', JSON.stringify(itemSearch, null, 2));

    const pagedData = itemSearch.runPaged({
      pageSize: 1000,
    });

    const results: ItemInventoryResult[] = [];
    pagedData.pageRanges.forEach(function (pageRange) {
      const page = pagedData.fetch({ index: pageRange.index });
      page.data.forEach(function (result) {
        log.debug('result', JSON.stringify(result, null, 2));
        // get values
        const internalid = result.getValue({
          name: 'internalid',
          join: 'item',
          summary: search.Summary.GROUP,
        }) as string;
        const item = result.getValue({
          name: 'item',
          summary: search.Summary.GROUP,
        }) as string;
        const sku = result.getValue({
          name: 'custitem_sp_item_sku',
          join: 'item',
          summary: search.Summary.GROUP,
        }) as string;
        const type = result.getValue({
          name: 'type',
          join: 'item',
          summary: search.Summary.GROUP,
        }) as string;

        const mwAvailable = result.getValue(itemSearch.columns[5]) as string;
        const storeAvailable = result.getValue(itemSearch.columns[6]) as string;
        const twAvailable = result.getValue(itemSearch.columns[7]) as string;

        log.debug('available', {
          mwAvailable,
          storeAvailable,
          twAvailable,
        });

        results.push({
          internalid,
          item,
          type,
          sku,
          mwAvailable,
          storeAvailable,
          twAvailable,
        });
      });
    });

    return results;
  };

  const mergeResults = (
    sales: ItemSalesResult[],
    inventory: ItemInventoryResult[]
  ) => {
    const mergedResults: ItemResult[] = [];
    sales.forEach(sale => {
      const inventoryItem = inventory.find(
        inv => inv.internalid === sale.internalid
      );
      mergedResults.push({
        internalid: sale.internalid,
        item: sale.item,
        sku: sale.sku,
        name: sale.name,
        type: sale.type,
        quantity: sale.quantity,
        sales: sale.sales,
        mwAvailable: inventoryItem?.mwAvailable || '0',
        storeAvailable: inventoryItem?.storeAvailable || '0',
        twAvailable: inventoryItem?.twAvailable || '0',
      });
    });
    return mergedResults;
  };

  log.debug('API CONTEXT', JSON.stringify(context, null, 2));
  doValidation(
    [context.action, context.payload],
    ['action', 'payload'],
    'POST'
  );

  const { action, payload } = context;
  log.debug('API ACTION', action);

  try {
    if (action === 'GET_RESULTS') {
      const { startDate, endDate } = payload;
      const start = format.format({
        type: format.Type.DATE,
        value: new Date(startDate),
        timezone: format.Timezone.AMERICA_LOS_ANGELES,
      });
      log.debug('START', start);
      const end = format.format({
        type: format.Type.DATE,
        value: new Date(endDate),
        timezone: format.Timezone.AMERICA_LOS_ANGELES,
      });
      log.debug('END', end);
      // get item sales
      const sales = getItemSales(start, end);
      const inventory = getItemInventoryAvailable(start, end);
      const results = mergeResults(sales, inventory);
      return {
        success: true,
        data: results,
      };
    }

    return {
      success: false,
      data: null,
      error: 'Invalid action',
    };
  } catch (err: any) {
    log.debug('error', err);
    return {
      success: false,
      data: null,
      error: err.message || 'Something went wrong',
    };
  }
};
