**To get running in development:**
- Install Yarn for dependency management https://yarnpkg.com/en/docs/install
- Clone this repo
- `yarn` to install req'd dependencies
- `yarn start` to start the development server

The dev server uses `www/dev.html` as it's index.

**To get running in production:**
Create a `.env` file in the project root with the following variables:
```
PROD_ASSET_PATH=<Path to your hashed assets>
AWS_KEY=<AWS account public key>
AWS_SECRET=<AWS account secret>
AWS_REGION=<AWS S3 bucket region>
AWS_S3_BUCKET_NAME=<AWS S3 bucket name>
```
Then run the following commands
- `yarn deploy` to build and hash bundles and deploy to the CDN
- `yarn prod` to run the development server

The project is configured to deploy assets to an Amazon Cloudfront CDN. If you just want to serve assets from the development server set your `PROD_ASSET_PATH` .env variable to `/assets_rev/` and remove the AWS .env variables. Then instead of the `yarn deploy` command just use:
- `yarn build` to build compressed asset bundles
- `yarn rev` to hash assets
- `yarn prod` to run the development server
