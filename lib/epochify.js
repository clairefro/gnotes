const epochify = (number) => {
  const isBC = number < 0;
  if (isBC) {
    return `${number * -1} BC`;
  } else {
    return number.toString();
  }
};

module.exports = epochify;
