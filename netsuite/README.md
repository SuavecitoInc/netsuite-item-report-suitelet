# NetSuite SuiteLet

> SuiteScript 2.1

## Setup

The SuiteLet (SP_NsItemSalesSuiteLet) injects the React Bundle via an inline html field. The React bundle's file cabinet url will need to be set on the script deployment (`custscript_sp_itm_sales_bundle_url`).

The React front end uses a RESTLet as its API (SP_NsItemSalesAPI). This RESTLet depends on the following [saved searches](./SEARCHES.md).

<table>
  <thead>
    <tr>
      <th>Script</th>
      <th>Type</th>
      <th>Params</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>SP_ShopifyProductSuiteLet</td>
      <td>SuiteLet</td>
      <td>
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Description</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>custscript_sp_shopify_product_bundle_url</td>
              <td>The React Bundle's URL</td>
            </tr>
          </tbody>
        </table>
      </td>
    </tr>
  </tbody>
</table>

## Usage

Actions:

- GET_RESULTS

  - Payload
    ```javascript
    {
      "action": "GET_RESULTS",
      "payload": {
        "startDate": "11/21/2024",
        "endDate": "11/21/2024"
      }
    }
    ```
  - Response

        ```typescript
        {
          "success": boolean;
          "data": {
            internalid: string;
            item: string;
            name: string;
            quantity: string;
            sales: string;
            sku: string;
            type: 'Kit' | 'InvPart' | 'Assembly';
            mwAvailable: string;
            storeAvailable: string;
            twAvailable: string;
          }[];
        }
        ```
