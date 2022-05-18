import moment from "moment";

const getDate = (dateTimeString) => {
  if (!dateTimeString) {
    return;
  }
  const dateObj = new Date(dateTimeString);
  const momentObj = moment(dateObj);
  return momentObj.format("HH:mm DD/MM/YYYY");
};

const getTimeByLocal = {
  getDate,
};
export default getTimeByLocal;