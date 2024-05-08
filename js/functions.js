// Функции для тренировки
const isPalindrome = (str) => {
  const normalizedStr = str.replaceAll(' ','').toUpperCase();

  for (let i = 0; normalizedStr.length / 2 > i; i++) {
    if (normalizedStr.at(i) !== normalizedStr.at(normalizedStr.length - i - 1)) {
      return false;
    }
  }

  return true;
};

isPalindrome('Лёша на полке клопа нашёл ');

const getNumbers = (stringWithNumbers) => {
  const numbers = String(stringWithNumbers).match(/\d+/g);

  return numbers ? Number(numbers.join('')) : NaN;
};

getNumbers('ECMAScript 2022');

const padStartStr = (originalStr, minLength, paddingStr) => {
  if (minLength <= originalStr.length) {
    return originalStr;
  }

  const paddingLength = minLength - originalStr.length;
  const repeatPaddingSt = Math.floor(paddingLength / paddingStr.length);
  const freeLength = paddingLength - repeatPaddingSt * paddingStr.length;

  return paddingStr.slice(0, freeLength) + paddingStr.repeat(repeatPaddingSt) + originalStr;
};

padStartStr('1', 20, '2345');

const isStrLengthValid = (str, maxLength) => str.length <= maxLength;

isStrLengthValid('проверяемая строка', 20);
