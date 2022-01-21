# Image Collection Center - Frontend

![](./doc/img/icc-title.png)

This project is the frontend part of the ICC(Image Collection Center). You can find the backend part at [icc-core](https://github.com/xylonx/icc-core)

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## What is Image Collection Center

In brief, ICC can show(without auth) and upload images(with auth). In this perspective, it is just like a pic-host service.
Moreover, it provides some improved functions like tagging the images and searching by tags. It is simple but stronger. Additionally, it also provides out-of-box API.

Unlike other pic-host services, ICC keeps min auth info. Up to now, only image uploading and tag modifying actions need auth - just a token.

ICC just tracks uploaded bytes for every token preventing malicious users.

You can preview it at [here](https://icc.xylonx.com)

## How to deployment

Deployment is pretty simple. like other react app, running `yarn build` is enough. 

> Attention: The backend API is set at `src/config/config.ts`. Please Change it if you deploy your own `icc-core`.

## Toolchain

- [TypeScript](https://www.typescriptlang.org/)
- [Material UI](https://mui.com/)
- [axios](https://github.com/axios/axios)
- [crypto-js](https://github.com/brix/crypto-js)

## Available Scripts

In the project directory, you can run:

### `yarn start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `yarn test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `yarn build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.
