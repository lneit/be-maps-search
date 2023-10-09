export const fixedEncodeURIComponent = (str: string) => {
  return encodeURIComponent(str).replace(/[!'()*]/g, function (c) {
    return '%' + c.charCodeAt(0).toString(16);
  });
};

export const isValidLimit = (limit: number | undefined) => {
  if (!limit || (limit >= 0 && limit <= 100)) {
    return true;
  }
  return false;
};

export const isValidAddress = (address: string) => {
  if (address && address.length <= 100) {
    return true;
  }
  return false;
};
