const assetProvider = (path) => {
  if (NODE_ENV === 'production') {
    const revPath = ASSET_MANIFEST[path];
    const prodPath = process.env.PROD_ASSET_PATH;
    return prodPath + revPath;
  } else {
    return `/assets/${path}`;
  }
}

export default assetProvider;
