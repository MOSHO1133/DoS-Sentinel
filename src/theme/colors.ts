export const C = {
  // Backgrounds
  bg:       '#F4F5F7',
  surface:  '#FFFFFF',
  surface2: '#F9FAFB',

  // Text
  text:     '#1A202C',
  text2:    '#4A5568',
  muted:    '#718096',

  // Borders
  border:   '#E1E4E8',
  border2:  '#D0D5DD',

  // Semantic
  red:      '#E53E3E',
  redLight: '#FFF5F5',
  redMid:   '#FED7D7',

  orange:      '#DD6B20',
  orangeLight: '#FFFAF0',

  yellow:      '#D69E2E',
  yellowLight: '#FFFFF0',

  green:      '#276749',
  greenLight: '#F0FFF4',
  greenMid:   '#C6F6D5',
  greenVis:   '#38A169',

  blue:      '#2B6CB0',
  blueLight: '#EBF8FF',
  blueMid:   '#BEE3F8',

  purple:      '#553C9A',
  purpleLight: '#FAF5FF',
  purpleMid:   '#D6BCFA',

  // Chart palette
  chart: {
    'Normal Traffic': '#38A169',
    'DoS':            '#E53E3E',
    'DDoS':           '#C53030',
    'Port Scanning':  '#DD6B20',
    'Brute Force':    '#553C9A',
  } as Record<string, string>,

  shadow: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.07,
    shadowRadius: 3,
    elevation: 2,
  },
};
