This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Firebase App Hosting

- For now, this project is hosted at github.com/shaneporterqodea/talent-deck
- Firebase App hosting is used for deployment/hosting, and new versions are pushed following a commit to the `main` branch.
- This was initially set up from https://firebase.google.com/docs/app-hosting/get-started, Step 1 onwards. Initial authentication was set up using shane.porter@qodea.com. Note that the **--location us-central1** flag was not recognised, so the command was run with:

```bash
firebase apphosting:backends:create --project ab-shaneporter-playground-dev
```

From the primary regions that were offered by this command, `europe-west4` was chosen (as the only Europe based region made available).

> [!NOTE]
> None of this configuration is stored in this repo, so the configuration can be run again to switch to a different repo/Google Cloud project.

Refer to the [Firebase 'apphosting' Docs](https://firebase.google.com/docs/cli#apphosting-commands) for other commands.

## Generating Kantata API Types

The Kantata API's quite large, and more to the point, we don't need the majority of it.

Unfortunately, `openapi-typescript` doesn't support filtering of operations, so this project uses `@redocly/cli` to generate a filtered yml file, from which the types are generated.

Should this need to be regenated, you just need to `npm run types:generate:kantata`. Note that the `openapi-typescript` package needs to be at version 5 to work with Kantata's OpenAPI Specification v2.

## Secrets

There are always secrets. Take a look at 'em in `apphosting.yraml', the _special_ configuration for Firebase App Hosting.

At the time of writing, the [Firebase App Hosting Docs](https://firebase.google.com/docs/app-hosting/get-started) were a bit crap.

I achieved secrets this way:

- Defined the necessary secrets in Secret Manager.
- Then, I had to grant access for **each** one, like this:

```bash
firebase apphosting:secrets:grantaccess -b talent-deck KANTATA_CLIENT_ID
```

It then deployed.

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

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!
