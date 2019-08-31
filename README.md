### To get running in development:
- `npm i` to install req'd dependencies
- `npm start` to start the development server


### To get running in production:
Create a `.env` file in the project root with the following variables:
```
PROD_ASSET_PATH=<Path to CDN root>
AWS_KEY=<AWS account public key>
AWS_SECRET=<AWS account secret>
AWS_REGION=<AWS S3 bucket region>
AWS_S3_BUCKET_NAME=<AWS S3 bucket name>
```
Then run the following commands
- `npm run deploy` to build and hash bundles and deploy to the CDN
- `npm run prod` to run the development server

The project is configured to deploy assets to an Amazon Cloudfront CDN. If you just want to serve assets from the development server set your `PROD_ASSET_PATH` .env variable to `/assets_rev/` and remove the AWS .env variables. Then instead of the `npm run deploy` command just use:
- `npm run build` to build compressed asset bundles
- `npm run rev` to hash assets
- `npm run prod` to run the development server
