import { Platform } from 'react-native';

export const colors = {
  primary:       '#FF9ECA',
  primaryDark:   '#E06FAA',
  secondary:     '#B388FF',
  accent:        '#80DEEA',
  background:    '#FFF9FB',
  card:          '#FFE4F0',
  cardAlt:       '#F3E5F5',
  text:          '#5D3A6B',
  textLight:     '#B39DDB',
  gold:          '#FFD54F',
  goldDark:      '#FFC107',
  danger:        '#FF6B6B',
  success:       '#69F0AE',
  white:         '#FFFFFF',
};

export const gradients = {
  primary:    ['#FF9ECA', '#E06FAA'],
  background: ['#FFF9FB', '#F3E5F5'],
  gold:       ['#FFD54F', '#FFC107'],
  card:       ['#FFE4F0', '#F8D0E8'],
  cool:       ['#80DEEA', '#B388FF'],
};

export const shadows = {
  sm: Platform.select({
    ios:     { shadowColor: '#C06090', shadowOffset: { width: 0, height: 2 },
               shadowOpacity: 0.15, shadowRadius: 6 },
    android: { elevation: 3 },
    default: { boxShadow: '0px 2px 6px rgba(192, 96, 144, 0.15)' },
  }),
  md: Platform.select({
    ios:     { shadowColor: '#C06090', shadowOffset: { width: 0, height: 4 },
               shadowOpacity: 0.2, shadowRadius: 10 },
    android: { elevation: 6 },
    default: { boxShadow: '0px 4px 10px rgba(192, 96, 144, 0.2)' },
  }),
  lg: Platform.select({
    ios:     { shadowColor: '#C06090', shadowOffset: { width: 0, height: 8 },
               shadowOpacity: 0.25, shadowRadius: 18 },
    android: { elevation: 12 },
    default: { boxShadow: '0px 8px 18px rgba(192, 96, 144, 0.25)' },
  }),
};

export const typography = {
  h1:    { fontSize: 32, fontFamily: 'Nunito_800ExtraBold', color: colors.text },
  h2:    { fontSize: 24, fontFamily: 'Nunito_700Bold',      color: colors.text },
  h3:    { fontSize: 18, fontFamily: 'Nunito_700Bold',      color: colors.text },
  body:  { fontSize: 15, fontFamily: 'Nunito_400Regular',   color: colors.text },
  small: { fontSize: 12, fontFamily: 'Nunito_600SemiBold',  color: colors.textLight },
  btn:   { fontSize: 17, fontFamily: 'Nunito_700Bold',      color: colors.white },
};

export const radius = {
  sm:   10,
  md:   18,
  lg:   24,
  full: 999,
};

export const spacing = {
  xs: 4, sm: 8, md: 16, lg: 24, xl: 36,
};
