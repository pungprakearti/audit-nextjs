# Audit-nextjs
Audit websites using Google Lighthouse, then store and display the data

## Notes
Use Prisma for ORM
https://www.youtube.com/watch?v=FMnlyi60avU

Google Lighthouse for audits
https://github.com/GoogleChrome/lighthouse/blob/master/docs/readme.md#using-programmatically

This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Setup
1. Create a database for storing data. I used Heroku's Postgresql database.

1. Get credentials and add them to `.env`
```
DATABASE_URL="postgresql://janedoe:mypassword@localhost:5432/mydb"
```

1. Sync schema with database
```
npx prisma db push
```

1. Create `env.local` at root and add:
```
NEXT_PUBLIC_DEV=1
```

1. `yarn dev` to start the server

## Todo / Wishlist
- Use Redis for background services for audit so that response doesn't time out. Currently while hosting on Heroku, the response times out before the audit finishes. So, only way to use the audit feature is locally.

- Replace old current audit with new current audit if audited.

- Allow deleting of audits on front end

## Notes
- Access PSQL through Heroku CLI using: `heroku pg:psql -a audit-nextjs`

- Table is queried using `"Audit"` instead of `'Audit'` because of how Prisma is set up: `SELECT * FROM "Audit";`

- Restart Heroku server using CLI: `heroku restart -a audit-nextjs`

- Look at last 200 Heroku logs using CLI: `heroku logs -n 200 -a audit-nextjs`

- On Heroku, required buildpacks in `Settings` are:
1. `heroku/nodejs`
1. `https://github.com/heroku/heroku-buildpack-google-chrome.git`

<hr />

<img src='audit_preview.png' />
