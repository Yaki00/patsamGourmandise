export type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  /** Ce que couvre le prix, affiché après lui : "3,50 € le cookie". */
  unit: string;
  tag: string;
  category: "Cookies" | "Trompe-l'œil" | "Gâteaux" | "Box";
  flavors: string[];
  allergens: string[];
  image: string;
};

export const productCatalog: Product[] = [
  {
    id: "cookie-triple-choco",
    name: "Cookie Triple Choco",
    description: "Pépites XXL, cœur moelleux, cacao intense.",
    price: 3.5,
    unit: "le cookie",
    tag: "Best-seller",
    category: "Cookies",
    flavors: ["Triple chocolat", "Fraise", "Vanille", "Caramel beurre salé"],
    allergens: ["Gluten", "Œufs", "Lait"],
    image:
      "https://images.unsplash.com/photo-1499636136210-6f4ee915583e?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: "trompe-loeil-framboise",
    name: "Trompe-l'œil Framboise",
    description: "Finition miroir, cœur fruits rouges et vanille.",
    price: 7.5,
    unit: "la pièce",
    tag: "Édition limitée",
    category: "Trompe-l'œil",
    flavors: ["Framboise vanille", "Mango passion", "Pistache"],
    allergens: ["Œufs", "Lait", "Fruits à coque"],
    image:
      "https://images.unsplash.com/photo-1551024506-0bccd828d307?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: "cheesecake-mango-pop",
    name: "Cheesecake Mango Pop",
    description: "Nappage mangue, crème légère et base biscuit croustillante.",
    price: 32,
    unit: "le gâteau, 6 à 8 parts",
    tag: "Nouveau",
    category: "Gâteaux",
    flavors: ["Mango pop", "Citron yuzu", "Vanille fruits rouges"],
    allergens: ["Gluten", "Œufs", "Lait"],
    image:
      "https://images.unsplash.com/photo-1533134242443-d4fd215305ad?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: "box-cookies-signature",
    name: "Box Cookies Signature",
    description: "6 recettes maison, pour partager (ou pas).",
    price: 19,
    unit: "la box de 6 cookies",
    tag: "Box",
    category: "Box",
    flavors: ["Mix chocolat", "Mix fruits secs", "Mix surprise"],
    allergens: ["Gluten", "Œufs", "Lait", "Fruits à coque"],
    image:
      "https://images.unsplash.com/photo-1590080875515-8a3a8dc5735e?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: "entremet-pistache",
    name: "Entremets Pistache",
    description: "Biscuit fondant, crème pistache, note pralinée.",
    price: 36,
    unit: "l'entremets, 6 parts",
    tag: "Artisanal",
    category: "Gâteaux",
    flavors: ["Pistache praliné", "Noisette choco", "Vanille"],
    allergens: ["Gluten", "Œufs", "Lait", "Fruits à coque"],
    image:
      "https://images.unsplash.com/photo-1571115177098-24ec42ed204d?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: "mini-tartes-fruitees",
    name: "Mini tartes fruitées",
    description: "Assortiment de 6, coloré, pour brunchs, fêtes et cadeaux.",
    price: 16,
    unit: "les 6 mini tartes",
    tag: "Traiteur",
    category: "Gâteaux",
    flavors: ["Fruits rouges", "Citron meringué", "Mangue coco"],
    allergens: ["Gluten", "Œufs", "Lait"],
    image:
      "https://images.unsplash.com/photo-1464305795204-6f5bbfc7fb81?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: "layer-cake-signature",
    name: "Layer Cake Signature",
    description:
      "Gâteau à étages ultra moelleux, crème légère et fruits frais.",
    price: 45,
    unit: "le gâteau, 8 à 10 parts",
    tag: "Layer cake",
    category: "Gâteaux",
    flavors: ["Vanille fruits rouges", "Chocolat praliné", "Mango passion"],
    allergens: ["Gluten", "Œufs", "Lait", "Fruits à coque"],
    image:
      "https://images.unsplash.com/photo-1535141192574-5d4897c12636?auto=format&fit=crop&w=1200&q=80",
  },
];

const priceFormatter = new Intl.NumberFormat("fr-FR", {
  style: "currency",
  currency: "EUR",
});

export const formatPrice = (value: number) => priceFormatter.format(value);

export const getDeliveryDelay = (product: Product) =>
  product.category === "Trompe-l'œil" ? "Livré à J+1" : "Livré le jour même";
