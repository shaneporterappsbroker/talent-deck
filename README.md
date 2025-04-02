This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Firebase App Hosting

- For now, this project is hosted at github.com/shaneporterappsbroker/talent-deck
- Firebase App hosting is used for deployment/hosting, and new versions are pushed following a commit to the `main` branch.
- This was initially set up from https://firebase.google.com/docs/app-hosting/get-started, Step 1 onwards. Initial authentication was set up using shane.porter@qodea.com. Note that the **--location us-central1** flag was not recognised, so the command was run with:

```bash
firebase apphosting:backends:create --project ab-shaneporter-playground-dev
```

From the primary regions that were offered by this command, `europe-west4` was chosen (as the only Europe based region made available).

> [!NOTE]
> None of this configuration is stored in this repo, so the configuration can be run again to switch to a different repo/Google Cloud project.

Refer to the [Firebase 'apphosting' Docs](https://firebase.google.com/docs/cli#apphosting-commands) for other commands.

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
