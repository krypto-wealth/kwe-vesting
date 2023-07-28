const MINUTE = 60
const HOUR = MINUTE * 60
const DAY = HOUR * 24
const MONTH = DAY * 30

export const nowInSeconds = () => Math.floor(Date.now() / 1000)

export const formatTime = (time: number) => {
  const months = Math.floor(time / MONTH)
  time -= months * MONTH
  const days = Math.floor(time / DAY)
  time -= days * DAY
  const hours = Math.floor(time / HOUR)
  time -= hours * HOUR
  const minutes = Math.floor(time / MINUTE)

  let output = ''

  if (months > 0) output += `${months} months`
  if (days > 0) output += ` ${days} days`
  if (hours > 0) output += ` ${hours} hours`
  if (minutes > 0) output += ` ${minutes} minutes`

  return output
}

export const formatBigNums = (number: number) => {
  const num = number.toString()
  const decimalIndex = num.indexOf('.')
  const isDecimal = decimalIndex !== -1

  let floorNum
  let decimalPart = ''

  if (isDecimal) {
    floorNum = num.slice(0, decimalIndex)
    decimalPart = num.slice(decimalIndex + 1, decimalIndex + 4)
  } else {
    floorNum = num
  }

  let wholePath = floorNum.length % 3
  let stringPath = (floorNum.length - wholePath) / 3

  if (wholePath === 0 && stringPath > 1) {
    wholePath = 3
    stringPath -= 1
  }
  if (wholePath === 0 && stringPath === 1) stringPath = 0

  const floorLen = floorNum.slice(0, wholePath).length
  const dec =
    floorNum.slice(floorLen, wholePath + 2) === '00'
      ? ``
      : `.${floorNum.slice(floorLen, wholePath + 2)}`

  switch (stringPath) {
    case 0: {
      if (isDecimal) {
        return floorNum + '.' + decimalPart
      }
      return num
    }
    case 1: {
      return floorNum.slice(0, wholePath) + dec + ' ' + 'k'
    }
    case 2: {
      return floorNum.slice(0, wholePath) + dec + ' ' + 'M'
    }
    case 3: {
      return floorNum.slice(0, wholePath) + dec + ' ' + 'B'
    }
    case 4: {
      return floorNum.slice(0, wholePath) + dec + ' ' + 'T'
    }
    case 5: {
      return floorNum.slice(0, wholePath) + dec + ' ' + 'qd'
    }
    case 6: {
      return floorNum.slice(0, wholePath) + dec + ' ' + 'Qn'
    }
    case 7: {
      return floorNum.slice(0, wholePath) + dec + ' ' + 'sx'
    }
    case 8: {
      return floorNum.slice(0, wholePath) + dec + ' ' + 'Sp'
    }
    case 9: {
      return floorNum.slice(0, wholePath) + dec + ' ' + 'O'
    }
    case 10: {
      return floorNum.slice(0, wholePath) + dec + ' ' + 'N'
    }
  }
  return '0'
}
