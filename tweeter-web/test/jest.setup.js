// Polyfill for TextEncoder and TextDecoder which aren't available in jsdom
const { TextEncoder, TextDecoder } = require('util');

// Make TextEncoder and TextDecoder available globally
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

