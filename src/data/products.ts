export type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  tag: string;
  category: "Cookies" | "Trompe-l'oeil" | "Gateaux" | "Box";
  flavors: string[];
  allergens: string[];
  image: string;
};

export const productCatalog: Product[] = [
  {
    id: "cookie-triple-choco",
    name: "Cookie Triple Choco",
    description: "Pepites XXL, coeur moelleux, cacao intense.",
    price: 5.9,
    tag: "Best seller",
    category: "Cookies",
    flavors: ["Triple chocolat", "Fraise", "Vanille", "Caramel beurre sale"],
    allergens: ["Gluten", "Oeufs", "Lait"],
    image:
      "https://images.unsplash.com/photo-1499636136210-6f4ee915583e?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: "trompe-loeil-framboise",
    name: "Trompe-l'oeil Framboise",
    description: "Finition miroir, coeur fruit rouge et vanille.",
    price: 42,
    tag: "Edition limitee",
    category: "Trompe-l'oeil",
    flavors: ["Framboise vanille", "Mango passion", "Pistache"],
    allergens: ["Oeufs", "Lait", "Fruits a coque"],
    image:
      "https://images.unsplash.com/photo-1551024506-0bccd828d307?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: "cheesecake-mango-pop",
    name: "Cheesecake Mango Pop",
    description: "Mango glaze, creme legere et base biscuit croustillante.",
    price: 34,
    tag: "Nouveau",
    category: "Gateaux",
    flavors: ["Mango pop", "Citron yuzu", "Vanille fruits rouges"],
    allergens: ["Gluten", "Oeufs", "Lait"],
    image:
      "https://images.unsplash.com/photo-1464306076886-da185f6a9d05?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: "box-cookies-signature",
    name: "Box Cookies Signature",
    description: "6 recettes premium pour partage ou gros craquage.",
    price: 29,
    tag: "Box",
    category: "Box",
    flavors: ["Mix chocolat", "Mix fruits secs", "Mix surprise"],
    allergens: ["Gluten", "Oeufs", "Lait", "Fruits a coque"],
    image:
      "https://images.unsplash.com/photo-1590080875515-8a3a8dc5735e?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: "entremet-pistache",
    name: "Entremet Pistache",
    description: "Biscuit fondant, creme pistache, note pralinee.",
    price: 39,
    tag: "Artisanal",
    category: "Gateaux",
    flavors: ["Pistache praline", "Noisette choco", "Vanille"],
    allergens: ["Gluten", "Oeufs", "Lait", "Fruits a coque"],
    image:
      "https://images.unsplash.com/photo-1481391032119-d89fee407e44?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: "mini-tartes-fruitees",
    name: "Mini Tartes Fruitees",
    description: "Selection coloree pour brunch, events et cadeaux.",
    price: 24,
    tag: "Traiteur",
    category: "Gateaux",
    flavors: ["Fruits rouges", "Citron meringue", "Mango coco"],
    allergens: ["Gluten", "Oeufs", "Lait"],
    image:
      "https://images.unsplash.com/photo-1614707267537-b85aaf00c4b7?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: "layer-cake-signature",
    name: "Layer Cake Signature",
    description: "Gateau a etages ultra moelleux, creme legere et finition premium.",
    price: 48,
    tag: "Layer Cake",
    category: "Gateaux",
    flavors: ["Vanille fruits rouges", "Chocolat praliné", "Mango passion"],
    allergens: ["Gluten", "Oeufs", "Lait", "Fruits a coque"],
    image:
      "https://images.unsplash.com/photo-1535141192574-5d4897c12636?auto=format&fit=crop&w=1200&q=80",
  },
];

export const formatPrice = (value: number) =>
  `${value.toFixed(2).replace(".", ",")} EUR`;
