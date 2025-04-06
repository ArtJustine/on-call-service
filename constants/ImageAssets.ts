// This file contains all image references used in the app

// App Logo - Using local image file
// The logo is now referenced as a module import rather than a URL
export const APP_LOGO = require('../assets/images/revit-logo.jpg');

// Category Icons - Light Mode
export const CATEGORY_ICONS_LIGHT = {
  "mechanic": "https://placehold.co/64x64/F3F4F6/111827?text=🔧",
  "electrician": "https://placehold.co/64x64/F3F4F6/111827?text=⚡",
  "plumber": "https://placehold.co/64x64/F3F4F6/111827?text=🚿",
  "carpenter": "https://placehold.co/64x64/F3F4F6/111827?text=🔨",
  "painter": "https://placehold.co/64x64/F3F4F6/111827?text=🖌️",
  "hvac": "https://placehold.co/64x64/F3F4F6/111827?text=🌡️",
  "landscaper": "https://placehold.co/64x64/F3F4F6/111827?text=✂️",
  "appliance": "https://placehold.co/64x64/F3F4F6/111827?text=🧺",
  "locksmith": "https://placehold.co/64x64/F3F4F6/111827?text=🔒",
};

// Category Icons - Dark Mode
export const CATEGORY_ICONS_DARK = {
  "mechanic": "https://placehold.co/64x64/1F2937/F9FAFB?text=🔧",
  "electrician": "https://placehold.co/64x64/1F2937/F9FAFB?text=⚡",
  "plumber": "https://placehold.co/64x64/1F2937/F9FAFB?text=🚿",
  "carpenter": "https://placehold.co/64x64/1F2937/F9FAFB?text=🔨",
  "painter": "https://placehold.co/64x64/1F2937/F9FAFB?text=🖌️",
  "hvac": "https://placehold.co/64x64/1F2937/F9FAFB?text=🌡️",
  "landscaper": "https://placehold.co/64x64/1F2937/F9FAFB?text=✂️",
  "appliance": "https://placehold.co/64x64/1F2937/F9FAFB?text=🧺",
  "locksmith": "https://placehold.co/64x64/1F2937/F9FAFB?text=🔒",
};

// Map category.icon values to the keys in the CATEGORY_ICONS objects
export const ICON_MAP = {
  "tool": "mechanic",
  "zap": "electrician",
  "droplet": "plumber",
  "hammer": "carpenter",
  "paintbrush": "painter",
  "thermometer": "hvac",
  "scissors": "landscaper",
  "washing-machine": "appliance",
  "lock": "locksmith",
};
