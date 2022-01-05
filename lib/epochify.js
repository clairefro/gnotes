const epochify = (number) => {
  const isBC = number < 0;
  return isBC ? `${number * -1} BC` : number.toString();
};

module.exports = epochify;
