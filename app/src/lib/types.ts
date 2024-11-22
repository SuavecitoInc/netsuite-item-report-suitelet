export type GetPreviewResponse = {
  success: boolean;
  data: ShopifyProduct;
  error?: string;
};

export type CreateProductResponse = {
  success: boolean;
  data: {
    product: {
      url: string;
      legacyResourceId: string;
    };
  };
  error?: string;
};

export type ShopifyProduct = {
  vendor: string;
  title: string;
  productType: string;
  tags: string[];
  descriptionHtml: string;
  variants: ShopifyProductVariant[];
};

export type ShopifyProductVariant = {
  optionValues: {
    optionName: string;
    name: string;
  }[];
  price: string;
  compareAtPrice?: string;
  sku: string;
  weight: number;
  weightUnit: string;
  barcode: string;
};

export type ItemResult = {
  internalid: string;
  item: string;
  type: string;
  sku: string;
  name: string;
  quantity: string;
  sales: string;
  mwAvailable: string;
  storeAvailable: string;
  twAvailable: string;
};
