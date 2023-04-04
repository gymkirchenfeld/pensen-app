export function today() {
  return new Date().toISOString().split('T')[0];
}

const MILLIS_PER_DAY = 24 * 60 * 60 * 1000;

export function dateDiff(startDate, endDate) {
  if (startDate === endDate) return 0;
  const s = new Date(startDate);
  const e = new Date(endDate);
  return (e - s) / MILLIS_PER_DAY;
}

export function formatDate(date) {
  if (!date || typeof date !== 'string') return '';
  return date.substr(8, 2) + '.' + date.substr(5, 2) + '.' + date.substr(0, 4);
}

export function formatTime(time) {
  if (!time || typeof time !== 'string') return '';
  return time.substr(0, 2) + '.' + time.substr(3, 2);
}

export function formatDatespan(startDate, endDate) {
  if (typeof startDate === 'string' && typeof endDate === 'string') {
    const endY = endDate.substr(0, 4);
    const endM = endDate.substr(5, 2);
    const endD = endDate.substr(8, 2);
    const startM = startDate.substr(5, 2);
    const startD = startDate.substr(8, 2);
    if (startDate.substr(0, 4) === endY) {
      if (startM === endM) {
        if (startD === endD) {
          return formatDate(startDate);
        } else {
          return startD + '. bis ' + endD + '.' + endM + '.' + endY;
        }
      } else {
        return (
          startD + '.' + startM + '. bis ' + endD + '.' + endM + '.' + endY
        );
      }
    } else {
      return formatDate(startDate) + ' bis ' + formatDate(endDate);
    }
  } else if (typeof startDate === 'string') {
    return 'ab ' + formatDate(startDate);
  } else if (typeof endDate === 'string') {
    return 'bis ' + formatDate(endDate);
  } else {
    return null;
  }
}

export function formatTimespan(startDate, startTime, endDate, endTime) {
  const days = dateDiff(startDate, endDate);
  const multiDay = days !== 0;
  if (!startTime && !endTime) {
    return multiDay ? days + ' Tage' : 'ganztags';
  }
  if (!endTime) {
    if (multiDay) return days + ' Tage, ab ' + formatTime(startTime);
    return 'ab ' + formatTime(startTime);
  }
  if (!startTime) {
    if (multiDay) return days + ' Tage, bis ' + formatTime(endTime);
    return 'bis ' + formatTime(endTime);
  }
  return formatTime(startTime) + ' bis ' + formatTime(endTime);
}
