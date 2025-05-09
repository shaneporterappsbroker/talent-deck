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

On Google Cloud, the environment values are coming from secrets. These secrets are defined in `apphosting.yaml', the _special_ configuration for Firebase App Hosting.

Things are a bit manual at the moment, and require these steps:

1. Define the secrets in Secret Manager
2. Grant access from the command line:

```bash
firebase apphosting:secrets:grantaccess -b talent-deck ENV_KEY1,ENV_KEY2,...
```

3. Make sure they're added in the `apphosting.yaml` file.
4. Don't forget to add it to the `process-env.d.ts` for code completion.

## Getting Started locally

You'll need a `.env.local` file which is `.gitignore`d for obvious reasons. Ask in the Software Engineering Chat and somebody should be able to provide it!

Then, run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!
