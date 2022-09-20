# HiveHub WebApp

The HiveHub web app is a frontend web application where users can explore the Hive nodes, and pick a trusted one to create a vault to store data from applications. It can also be considered an analytics dashboard for users to manage and view owned Hive nodes and vaults.

Since Hive is the network of storage services integrating DID as the user's identity, users are required to use the `Essentials` identity to sign into the HiveHub web application. 

**Notice** - ***HiveHub web application is purely decentralized application that can be deployed raspberry and no centralized service is related***



## Features

HiveHub web application provides an entry for users to manage Hive nodes and Vaults with the following features:

- Register a newly deployed Hive node
- Explore Hive nodes
- View analytic data to owned Hive nodes
- Create a vault on selected Hive node
- View analytic data to the vault being used
- Manage vault data, like backup or migrate vault data
- Pay to use more storage quota for Vault, and
- **More features for yourself to check**



## Build & Deploy

`NodeJs` is a must installation before you begin the build process. 

- **Build**

Clone the repository on your local device, and enter this project directory. 
```shell
$ npm install
$ npm start
```
 Then run the command above to start running the app in `developement` mode, and then open [http://localhost:3000](http://localhost:3000) to view it in your browser.

**Notice:** *The page will reload when you make changes, and you may also see any lint errors in the console*

- **Test**

```shell
$ npm test
```
Run the command above to launch the test runner in the interactive watch mode.  See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

- **Run build**

``` shell
$ npm run build
```
Builds the app for production to the `build` folder.  It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes. Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

- **run eject**

```shell
$ npm run eject
```
**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.



## Contribution

Any contributions  to this project would be highly appreciated, including 

- Building docs
- Report bug and bugfix
- UI/UX improvement
- Suggestion or advices 

The contribution acitivities can be either by creating an issue or pushing a pull request.



## License

This project is licensed under the terms of the [MIT license](https://github.com/elastos-trinity/HiveHub.WebApp/blob/master/LICENSE).
