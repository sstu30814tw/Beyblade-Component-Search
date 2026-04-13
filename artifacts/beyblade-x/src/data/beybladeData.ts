export interface Part {
  name: string;
  type: "刀刃" | "鼓輪" | "軸心" | "套組";
}

export interface Product {
  id: string;
  code: string;
  name: string;
  nameTw: string;
  type: "對戰組" | "單品" | "套組" | "競技場";
  price?: number;
  parts: Part[];
  note?: string;
}

export const products: Product[] = [
  {
    id: "cx-01",
    code: "BX-01",
    name: "Dran Sword",
    nameTw: "BX-01 狂暴衝擊劍 起步組",
    type: "對戰組",
    parts: [
      { name: "Dran Sword", type: "刀刃" },
      { name: "3-60", type: "鼓輪" },
      { name: "F軸（Flat）", type: "軸心" },
    ],
  },
  {
    id: "bx-02",
    code: "BX-02",
    name: "Hells Scythe",
    nameTw: "BX-02 地獄鐮刀 起步組",
    type: "對戰組",
    parts: [
      { name: "Hells Scythe", type: "刀刃" },
      { name: "4-60", type: "鼓輪" },
      { name: "LF軸（Low Flat）", type: "軸心" },
    ],
  },
  {
    id: "bx-03",
    code: "BX-03",
    name: "Wyvern Gale",
    nameTw: "BX-03 颶風翼龍 起步組",
    type: "對戰組",
    parts: [
      { name: "Wyvern Gale", type: "刀刃" },
      { name: "5-60", type: "鼓輪" },
      { name: "GF軸（Gear Flat）", type: "軸心" },
    ],
  },
  {
    id: "bx-04",
    code: "BX-04",
    name: "Cobalt Drake",
    nameTw: "BX-04 鈷青飛龍 起步組",
    type: "對戰組",
    parts: [
      { name: "Cobalt Drake", type: "刀刃" },
      { name: "3-80", type: "鼓輪" },
      { name: "HF軸（High Flat）", type: "軸心" },
    ],
  },
  {
    id: "bx-05",
    code: "BX-05",
    name: "Dran Buster",
    nameTw: "BX-05 狂暴衝擊砲 起步組",
    type: "對戰組",
    parts: [
      { name: "Dran Buster", type: "刀刃" },
      { name: "1-60", type: "鼓輪" },
      { name: "N軸（Needle）", type: "軸心" },
    ],
  },
  {
    id: "bx-06",
    code: "BX-06",
    name: "Shark Edge",
    nameTw: "BX-06 霸鯊刀刃 起步組",
    type: "對戰組",
    parts: [
      { name: "Shark Edge", type: "刀刃" },
      { name: "3-60", type: "鼓輪" },
      { name: "T軸（Taper）", type: "軸心" },
    ],
  },
  {
    id: "bx-07",
    code: "BX-07",
    name: "Wizard Arrow",
    nameTw: "BX-07 魔導箭矢 起步組",
    type: "對戰組",
    parts: [
      { name: "Wizard Arrow", type: "刀刃" },
      { name: "4-80", type: "鼓輪" },
      { name: "I軸（Imbalance）", type: "軸心" },
    ],
  },
  {
    id: "bx-08",
    code: "BX-08",
    name: "Leon Claw",
    nameTw: "BX-08 獅王之爪 起步組",
    type: "對戰組",
    parts: [
      { name: "Leon Claw", type: "刀刃" },
      { name: "3-80", type: "鼓輪" },
      { name: "HF軸（High Flat）", type: "軸心" },
    ],
  },
  {
    id: "bx-09",
    code: "BX-09",
    name: "Viper Tail",
    nameTw: "BX-09 毒蛇尾刺 起步組",
    type: "對戰組",
    parts: [
      { name: "Viper Tail", type: "刀刃" },
      { name: "4-80", type: "鼓輪" },
      { name: "GP軸（Gear Point）", type: "軸心" },
    ],
  },
  {
    id: "bx-10",
    code: "BX-10",
    name: "Knight Shield",
    nameTw: "BX-10 騎士盾牌 起步組",
    type: "對戰組",
    parts: [
      { name: "Knight Shield", type: "刀刃" },
      { name: "3-80", type: "鼓輪" },
      { name: "R軸（Rush）", type: "軸心" },
    ],
  },
  {
    id: "bx-11",
    code: "BX-11",
    name: "Dran Buster 2",
    nameTw: "BX-11 狂暴衝擊砲2 起步組",
    type: "對戰組",
    parts: [
      { name: "Dran Buster", type: "刀刃" },
      { name: "1-60", type: "鼓輪" },
      { name: "N軸（Needle）", type: "軸心" },
    ],
  },
  {
    id: "bx-12",
    code: "BX-12",
    name: "Phoenix Wing",
    nameTw: "BX-12 不死鳥翼 起步組",
    type: "對戰組",
    parts: [
      { name: "Phoenix Wing", type: "刀刃" },
      { name: "5-80", type: "鼓輪" },
      { name: "GF軸（Gear Flat）", type: "軸心" },
    ],
  },
  {
    id: "bx-13",
    code: "BX-13",
    name: "Rhino Horn",
    nameTw: "BX-13 犀牛角矛 起步組",
    type: "對戰組",
    parts: [
      { name: "Rhino Horn", type: "刀刃" },
      { name: "4-60", type: "鼓輪" },
      { name: "LF軸（Low Flat）", type: "軸心" },
    ],
  },
  {
    id: "bx-14",
    code: "BX-14",
    name: "Glide Raider",
    nameTw: "BX-14 滑翔突擊者 起步組",
    type: "對戰組",
    parts: [
      { name: "Glide Raider", type: "刀刃" },
      { name: "9-60", type: "鼓輪" },
      { name: "LF軸（Low Flat）", type: "軸心" },
    ],
  },
  {
    id: "bx-15",
    code: "BX-15",
    name: "Wizard Fafnir",
    nameTw: "BX-15 魔導法芙尼爾 起步組",
    type: "對戰組",
    parts: [
      { name: "Wizard Fafnir", type: "刀刃" },
      { name: "9-60", type: "鼓輪" },
      { name: "R軸（Rush）", type: "軸心" },
    ],
  },
  {
    id: "bx-16",
    code: "BX-16",
    name: "Dran Dagger",
    nameTw: "BX-16 狂暴匕首 起步組",
    type: "對戰組",
    parts: [
      { name: "Dran Dagger", type: "刀刃" },
      { name: "4-80", type: "鼓輪" },
      { name: "N軸（Needle）", type: "軸心" },
    ],
  },
  {
    id: "bx-17",
    code: "BX-17",
    name: "Tyranno Beat",
    nameTw: "BX-17 暴龍擊打 起步組",
    type: "對戰組",
    parts: [
      { name: "Tyranno Beat", type: "刀刃" },
      { name: "3-80", type: "鼓輪" },
      { name: "F軸（Flat）", type: "軸心" },
    ],
  },
  {
    id: "bx-18",
    code: "BX-18",
    name: "Hells Chain",
    nameTw: "BX-18 地獄鎖鏈 起步組",
    type: "對戰組",
    parts: [
      { name: "Hells Chain", type: "刀刃" },
      { name: "5-60", type: "鼓輪" },
      { name: "GP軸（Gear Point）", type: "軸心" },
    ],
  },
  {
    id: "bx-19",
    code: "BX-19",
    name: "Cobalt Dragoon",
    nameTw: "BX-19 鈷青烈龍 起步組",
    type: "對戰組",
    parts: [
      { name: "Cobalt Dragoon", type: "刀刃" },
      { name: "5-80", type: "鼓輪" },
      { name: "T軸（Taper）", type: "軸心" },
    ],
  },
  {
    id: "bx-20",
    code: "BX-20",
    name: "Leon Claw 2",
    nameTw: "BX-20 獅王之爪2 起步組",
    type: "對戰組",
    parts: [
      { name: "Leon Claw", type: "刀刃" },
      { name: "4-60", type: "鼓輪" },
      { name: "GF軸（Gear Flat）", type: "軸心" },
    ],
  },
  {
    id: "bx-21",
    code: "BX-21",
    name: "Shark Edge 2",
    nameTw: "BX-21 霸鯊刀刃2 起步組",
    type: "對戰組",
    parts: [
      { name: "Shark Edge", type: "刀刃" },
      { name: "5-80", type: "鼓輪" },
      { name: "HF軸（High Flat）", type: "軸心" },
    ],
  },
  {
    id: "bx-22",
    code: "BX-22",
    name: "Soar Phoenix",
    nameTw: "BX-22 翱翔鳳凰 起步組",
    type: "對戰組",
    parts: [
      { name: "Soar Phoenix", type: "刀刃" },
      { name: "5-60", type: "鼓輪" },
      { name: "HF軸（High Flat）", type: "軸心" },
    ],
  },
  {
    id: "bx-23",
    code: "BX-23",
    name: "Dran Sword 2",
    nameTw: "BX-23 狂暴衝擊劍2 起步組",
    type: "對戰組",
    parts: [
      { name: "Dran Sword", type: "刀刃" },
      { name: "3-60", type: "鼓輪" },
      { name: "F軸（Flat）", type: "軸心" },
    ],
  },
  {
    id: "bx-27",
    code: "BX-27",
    name: "Wizard Arrow Bey Set",
    nameTw: "BX-27 魔導箭矢 Bey Set",
    type: "套組",
    parts: [
      { name: "Wizard Arrow", type: "刀刃" },
      { name: "4-80", type: "鼓輪" },
      { name: "I軸（Imbalance）", type: "軸心" },
    ],
    note: "含多個刀刃/鼓輪/軸心",
  },
  {
    id: "bx-28",
    code: "BX-28",
    name: "Viper Tail Bey Set",
    nameTw: "BX-28 毒蛇尾刺 Bey Set",
    type: "套組",
    parts: [
      { name: "Viper Tail", type: "刀刃" },
      { name: "4-80", type: "鼓輪" },
      { name: "GP軸（Gear Point）", type: "軸心" },
    ],
    note: "含多個刀刃/鼓輪/軸心",
  },
  {
    id: "cx-04",
    code: "CX-04",
    name: "Dran Sword Advanced",
    nameTw: "CX-04 狂暴衝擊劍 進階組",
    type: "對戰組",
    parts: [
      { name: "Dran Sword", type: "刀刃" },
      { name: "5-60", type: "鼓輪" },
      { name: "F軸（Flat）", type: "軸心" },
    ],
  },
  {
    id: "cx-06",
    code: "CX-06",
    name: "Hells Scythe Advanced",
    nameTw: "CX-06 地獄鐮刀 進階組",
    type: "對戰組",
    parts: [
      { name: "Hells Scythe", type: "刀刃" },
      { name: "5-80", type: "鼓輪" },
      { name: "LF軸（Low Flat）", type: "軸心" },
    ],
  },
  {
    id: "cx-07",
    code: "CX-07",
    name: "Cobalt Drake Advanced",
    nameTw: "CX-07 鈷青飛龍 進階組",
    type: "對戰組",
    parts: [
      { name: "Cobalt Drake", type: "刀刃" },
      { name: "4-80", type: "鼓輪" },
      { name: "HF軸（High Flat）", type: "軸心" },
    ],
  },
  {
    id: "cx-08",
    code: "CX-08",
    name: "Wyvern Gale Advanced",
    nameTw: "CX-08 颶風翼龍 進階組",
    type: "對戰組",
    parts: [
      { name: "Wyvern Gale", type: "刀刃" },
      { name: "3-80", type: "鼓輪" },
      { name: "GF軸（Gear Flat）", type: "軸心" },
    ],
  },
  {
    id: "cx-13",
    code: "CX-13",
    name: "Wizard Arrow Advanced",
    nameTw: "CX-13 魔導箭矢 進階組",
    type: "對戰組",
    parts: [
      { name: "Wizard Arrow", type: "刀刃" },
      { name: "4-80", type: "鼓輪" },
      { name: "I軸（Imbalance）", type: "軸心" },
    ],
    note: "含I軸、4-80",
  },
  {
    id: "cx-14",
    code: "CX-14",
    name: "Leon Claw Advanced",
    nameTw: "CX-14 獅王之爪 進階組",
    type: "對戰組",
    parts: [
      { name: "Leon Claw", type: "刀刃" },
      { name: "3-80", type: "鼓輪" },
      { name: "HF軸（High Flat）", type: "軸心" },
    ],
  },
  {
    id: "cx-15",
    code: "CX-15",
    name: "Viper Tail Advanced",
    nameTw: "CX-15 毒蛇尾刺 進階組",
    type: "對戰組",
    parts: [
      { name: "Viper Tail", type: "刀刃" },
      { name: "5-80", type: "鼓輪" },
      { name: "GP軸（Gear Point）", type: "軸心" },
    ],
  },
  {
    id: "cx-16",
    code: "CX-16",
    name: "Hells Chain Advanced",
    nameTw: "CX-16 地獄鎖鏈 進階組",
    type: "對戰組",
    parts: [
      { name: "Hells Chain", type: "刀刃" },
      { name: "4-60", type: "鼓輪" },
      { name: "GP軸（Gear Point）", type: "軸心" },
    ],
  },
  {
    id: "cx-17",
    code: "CX-17",
    name: "Knight Shield Advanced",
    nameTw: "CX-17 騎士盾牌 進階組",
    type: "對戰組",
    parts: [
      { name: "Knight Shield", type: "刀刃" },
      { name: "5-60", type: "鼓輪" },
      { name: "R軸（Rush）", type: "軸心" },
    ],
  },
  {
    id: "cx-18",
    code: "CX-18",
    name: "Phoenix Wing Advanced",
    nameTw: "CX-18 不死鳥翼 進階組",
    type: "對戰組",
    parts: [
      { name: "Phoenix Wing", type: "刀刃" },
      { name: "5-80", type: "鼓輪" },
      { name: "GF軸（Gear Flat）", type: "軸心" },
    ],
  },
  {
    id: "cx-19",
    code: "CX-19",
    name: "Glide Raider Advanced",
    nameTw: "CX-19 滑翔突擊者 進階組",
    type: "對戰組",
    parts: [
      { name: "Glide Raider", type: "刀刃" },
      { name: "9-60", type: "鼓輪" },
      { name: "LF軸（Low Flat）", type: "軸心" },
    ],
  },
  {
    id: "cx-20",
    code: "CX-20",
    name: "Wizard Fafnir Advanced",
    nameTw: "CX-20 魔導法芙尼爾 進階組",
    type: "對戰組",
    parts: [
      { name: "Wizard Fafnir", type: "刀刃" },
      { name: "9-60", type: "鼓輪" },
      { name: "R軸（Rush）", type: "軸心" },
    ],
  },
  {
    id: "cx-21",
    code: "CX-21",
    name: "Tyranno Beat Advanced",
    nameTw: "CX-21 暴龍擊打 進階組",
    type: "對戰組",
    parts: [
      { name: "Tyranno Beat", type: "刀刃" },
      { name: "4-80", type: "鼓輪" },
      { name: "F軸（Flat）", type: "軸心" },
    ],
  },
  {
    id: "cx-22",
    code: "CX-22",
    name: "Cobalt Dragoon Advanced",
    nameTw: "CX-22 鈷青烈龍 進階組",
    type: "對戰組",
    parts: [
      { name: "Cobalt Dragoon", type: "刀刃" },
      { name: "5-80", type: "鼓輪" },
      { name: "T軸（Taper）", type: "軸心" },
    ],
  },
  {
    id: "cx-23",
    code: "CX-23",
    name: "Soar Phoenix Advanced",
    nameTw: "CX-23 翱翔鳳凰 進階組",
    type: "對戰組",
    parts: [
      { name: "Soar Phoenix", type: "刀刃" },
      { name: "5-60", type: "鼓輪" },
      { name: "HF軸（High Flat）", type: "軸心" },
    ],
  },
  {
    id: "cx-25",
    code: "CX-25",
    name: "Rhino Horn Advanced",
    nameTw: "CX-25 犀牛角矛 進階組",
    type: "對戰組",
    parts: [
      { name: "Rhino Horn", type: "刀刃" },
      { name: "5-60", type: "鼓輪" },
      { name: "LF軸（Low Flat）", type: "軸心" },
    ],
  },
  {
    id: "bx-32",
    code: "BX-32",
    name: "Dran Buster DB Set",
    nameTw: "BX-32 狂暴衝擊砲 DB對戰組",
    type: "對戰組",
    parts: [
      { name: "Dran Buster", type: "刀刃" },
      { name: "4-60", type: "鼓輪" },
      { name: "N軸（Needle）", type: "軸心" },
    ],
    note: "雙陀螺對戰組",
  },
  {
    id: "bx-33",
    code: "BX-33",
    name: "Hells Scythe DB Set",
    nameTw: "BX-33 地獄鐮刀 DB對戰組",
    type: "對戰組",
    parts: [
      { name: "Hells Scythe", type: "刀刃" },
      { name: "4-80", type: "鼓輪" },
      { name: "LF軸（Low Flat）", type: "軸心" },
    ],
    note: "雙陀螺對戰組",
  },
  {
    id: "bx-34",
    code: "BX-34",
    name: "Leon Claw DB Set",
    nameTw: "BX-34 獅王之爪 DB對戰組",
    type: "對戰組",
    parts: [
      { name: "Leon Claw", type: "刀刃" },
      { name: "3-80", type: "鼓輪" },
      { name: "HF軸（High Flat）", type: "軸心" },
    ],
    note: "雙陀螺對戰組",
  },
];

export const partTypes = ["全部", "刀刃", "鼓輪", "軸心"] as const;

export const allParts: { name: string; type: Part["type"]; products: string[] }[] = (() => {
  const map = new Map<string, { name: string; type: Part["type"]; products: string[] }>();
  for (const product of products) {
    for (const part of product.parts) {
      const key = `${part.type}|${part.name}`;
      if (!map.has(key)) {
        map.set(key, { name: part.name, type: part.type, products: [] });
      }
      map.get(key)!.products.push(product.code);
    }
  }
  return Array.from(map.values()).sort((a, b) => a.name.localeCompare(b.name, "zh-Hant"));
})();
