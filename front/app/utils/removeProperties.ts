const removeProperties = <T extends Record<string, any>>(
  obj: T,
  properties: (keyof T)[]
): Partial<T> => {
  const newObj: Partial<T> = { ...obj };
  properties.forEach((key) => {
    delete newObj[key];
  });
  return newObj;
};
export default removeProperties;
