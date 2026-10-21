# Patsam Gourmandise

Boutique en ligne d'une pâtissière à Houilles (78) : cookies, trompe-l'œil, gâteaux.
Next.js 16, Tailwind CSS 4, animations avec `motion`.

## Développement

```bash
npm install
npm run dev
```

## Où modifier quoi

| Quoi | Fichier |
|---|---|
| Produits, prix, parfums, photos | `src/data/products.ts` |
| Téléphone, email, Snapchat | `src/data/site.ts` |
| Couleurs, typographie, effets | `src/app/globals.css` |
| Aperçus des produits (présentoir, boîtes) | `src/components/product-preview.tsx` |

## Déploiement

Image Docker autonome (`output: "standalone"`), voir `Dockerfile` et
`docker-compose.yml`. Sur le VPS Pixel Brain, le conteneur `patsam-web` rejoint
le réseau du reverse proxy central et répond sur `patsam.pixelbrain.fr`.

Le panier est stocké dans le navigateur ; les commandes et le formulaire de
contact ne sont pas encore reliés à un serveur (le contact ouvre un SMS).
