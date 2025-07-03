### Deployment (vercel)

```bash
vercel project
vercel link --yes --project bpolls
bun run build:demo && vercel build --prod && vercel --prebuilt --prod
```


bun run build:demo && vercel build --prod && vercel --prebuilt --prod