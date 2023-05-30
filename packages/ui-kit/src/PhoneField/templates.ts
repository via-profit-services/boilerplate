// [country code,  calling code, template, placeholder, regexp]
export type CountryCode = 'RU' | 'KZ' | 'UA' | 'JP' | 'US' | 'BY';

const templates: [CountryCode | null, string | null, string, string, RegExp][] = [
  // Russian template
  ['RU', '7', '+x (xxx) xxx-xx-xx', '+7 (987) 654-32-10', /^\+$/], // must be at first (Default RU)
  ['RU', '7', '8 (xxx) xxx-xx-xx', '8 (987) 654-32-10', /^8[^1]{0,}/], // 8912...
  ['RU', '7', '+7 (xxx) xxx-xx-xx', '+7 (987) 654-32-10', /^\+{0,1}7{0,1}9/], // 912...
  ['RU', '7', '+7 (xxx) xxx-xx-xx', '+7 (987) 654-32-10', /^\+{0,1}7([0-5]|[8-9])[0-9][0-9]/], // +79...

  // Other fucking countries
  ['BY', '375', '+375 (xx) xxx-xx-xx', '+375 (98) 765-43-21', /^\+{0,1}375/],
  ['KZ', '7', '+997 (xx) xxx-xx-xx', '+997 (98) 765-43-21', /^\+{0,1}997/],
  ['KZ', '7', '+7 (xxx) xxx-xx-xx', '+7 (600) 765-43-21', /^\+{0,1}7[6-7][0-9][0-9]/], // +7600 - +7700
  ['UA', '380', '+380 (xx) xxx-xxxx', '+380 (98) 765-4321', /^\+{0,1}380/],
  ['JP', '81', '+81 (xx) xxx-xxxx', '+81 (98) 765-4321', /^\+{0,1}81/],
  ['US', '1', '+1 xxx xxx-xx-xx', '+1 987 654-32-10', /^\+{0,1}1/],

  [null, null, '+x xxx xxx-xx-xx', '+30 987 654-32-10', /^\+{0,1}.*/], // must be at last
];

export default templates;
