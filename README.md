# Audit-nextjs
Audit websites using Google Lighthouse, store and display the data

## TODO
Display table with website metrics
- Show baseline
- Current
- Competitor

### Display data:
- On load query database
- Post most recent baseline
- Post most recent current
- Post competitors by newest

### Audit:
- To audit, must be logged in
- Save jwt locally for auth
- Change token every hour
- Check auth every audit action
- Use url to run lighthouse audit
- Parse json data
- store in DB
- Run display / query function

```
model Audit {
    id String @id @default(cuid())
    url String
    type String
    performance Number
    accessibility Number
    bestpractices Number
    seo Number
    fcp Number
    si Number
    lcp Number
    tti Number
    tbt Number
    cls Number
    date Number
}

model Password {
    password String // ? I've never done this before haha
}
```

This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `pages/index.js`. The page auto-updates as you edit the file.

[API routes](https://nextjs.org/docs/api-routes/introduction) can be accessed on [http://localhost:3000/api/hello](http://localhost:3000/api/hello). This endpoint can be edited in `pages/api/hello.js`.

The `pages/api` directory is mapped to `/api/*`. Files in this directory are treated as [API routes](https://nextjs.org/docs/api-routes/introduction) instead of React pages.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.
