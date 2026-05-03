export function getSeasonalTheme() {
  const month = new Date().getMonth() + 1;
  const day   = new Date().getDate();

  if (month === 10 && day >= 25)  return { name: 'Halloween', emoji: '🎃', bg: '#FF6B35' };
  if (month === 12 && day >= 1)   return { name: 'Christmas', emoji: '🎄', bg: '#1B5E20' };
  if (month === 2 && day === 14)  return { name: 'Valentine', emoji: '💝', bg: '#E91E63' };
  if (month === 3 && day >= 20)   return { name: 'Spring',    emoji: '🌸', bg: '#F8BBD9' };
  if (month >= 6 && month <= 8)   return { name: 'Summer',    emoji: '🏖️', bg: '#FFF176' };
  if (month >= 9 && month <= 11)  return { name: 'Autumn',    emoji: '🍂', bg: '#FF8F00' };
  return                          { name: 'Winter',   emoji: '❄️', bg: '#E3F2FD' };
}
