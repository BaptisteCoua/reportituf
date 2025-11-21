const toIsoStringWithTimezone = (date: Date) => {
  const tzOffset = date.getTimezoneOffset() * 60000;
  const localISOTime = new Date(date.getTime() - tzOffset)
    .toISOString()
    .slice(0, -1);
  return localISOTime;
};
export default toIsoStringWithTimezone;
