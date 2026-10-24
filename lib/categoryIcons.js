import {
  Camera,
  Cpu,
  Monitor,
  Gamepad2,
  Laptop,
  Smartphone,
  Headphones,
  Watch,
  Tv,
  Printer,
  BatteryCharging,
  Router,
  Keyboard,
  Mouse,
  Speaker,
  Tablet,
  Cable,
  Boxes,
} from "lucide-react";

// pick an icon by keyword when a category has no image
const iconMap = [
  ["camera", Camera],
  ["component", Cpu],
  ["computer", Monitor],
  ["desktop", Monitor],
  ["monitor", Monitor],
  ["gaming", Gamepad2],
  ["laptop", Laptop],
  ["phone", Smartphone],
  ["mobile", Smartphone],
  ["sound", Headphones],
  ["audio", Headphones],
  ["headphone", Headphones],
  ["watch", Watch],
  ["wearable", Watch],
  ["tv", Tv],
  ["television", Tv],
  ["printer", Printer],
  ["power", BatteryCharging],
  ["ups", BatteryCharging],
  ["network", Router],
  ["router", Router],
  ["keyboard", Keyboard],
  ["mouse", Mouse],
  ["accessor", Cable],
  ["speaker", Speaker],
  ["tablet", Tablet],
];

export const getCategoryIcon = (name = "") => {
  const lower = name.toLowerCase();
  return iconMap.find(([key]) => lower.includes(key))?.[1] || Boxes;
};
