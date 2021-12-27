/** le gruvbox light */
export const COLORS_L = {
  red: "#9d0006",
  red_l: "#cc241d",
  orange: "#af3a03",
  orange_l: "#d65d0e",
  yellow: "#b57614",
  yellow_l: "#d79921",
  green: "#79740e",
  green_l: "#98971a",
  blue: "#076678",
  blue_l: "#458588",
  purple: "#8f3f71",
  purple_l: "#b16286",
  aqua: "#427b58",
  aqua_l: "#689d6a",
  fg1: "#3c3836",
  fg2: "#504945",
  fg4: "#7c6f64",
  bg0: "#fbf1c7",
  bg1: "#ebdbb2",
  bg2: "#d5c4a1",
  bg3: "#bdae93",
  bg4: "#a89984",
  bg0_h: "#f9f5d7",
  bg_select: "#dccfad",
};

export const COLORS_D = {};

/**
 * each color set for a section is ordered as: [left1,...,leftn, rightn,...,right1]
 * each color in a set is: {fg, bg}
 */
export const STATUSLINE_COLORS = {
  insert: {
    sections: [
      { fg: "bg0", bg: "blue" },
      { fg: "fg4", bg: "bg2" },
      { fg: "fg1", bg: "bg2" },
      { fg: "bg0", bg: "blue" },
      { fg: "fg4", bg: "bg2" },
      { fg: "fg1", bg: "bg2" },
    ],
    background: "bg2",
  },
  normal: {
    sections: [
      { fg: "bg0", bg: "fg4" },
      { fg: "fg1", bg: "bg2" },
      { fg: "fg1", bg: "bg1" },
      { fg: "bg0", bg: "fg4" },
      { fg: "fg1", bg: "bg2" },
      { fg: "fg1", bg: "bg1" },
    ],
    background: "bg1",
  },
  visual: {
    sections: [
      { fg: "bg0", bg: "orange" },
      { fg: "fg1", bg: "bg2" },
      { fg: "bg0", bg: "bg4" },
      { fg: "bg0", bg: "orange" },
      { fg: "fg1", bg: "bg2" },
      { fg: "bg0", bg: "bg4" },
    ],
    background: "bg4",
  },
  rendered: {
    sections: [
      { fg: "bg0", bg: "purple" },
      { fg: "fg4", bg: "bg2" },
      { fg: "fg1", bg: "bg2" },
      { fg: "bg0", bg: "purple" },
      { fg: "fg4", bg: "bg2" },
      { fg: "fg1", bg: "bg2" },
    ],
    background: "bg2",
  },
};
