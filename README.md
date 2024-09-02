# NSL ⚡️
List, fuzzy search and run scripts from any type of project

> Easy and fast way to run npm scripts  🚀

## Install ⚙️

```bash
npm i -g @rodbe/nsl
```

> if you have a permission error, try to install with **administrator privileges**

## Usage 🏎️

Just run the command and search for the script you want to run.

```bash
nsl
```
![nsl](./assets/preview.gif)

## Arguments

| Argument  | Alias | Description                     | Comment                                  |
|-----------|-------|---------------------------------|------------------------------------------|
| --all     | -a    | list all scripts                | by default lifecycle scripts are ignored |
| --info    | -i    | get all info tech for debugging |                                          |
| --version | -v    | get current version             |                                          |

## Configuration file

You can configure NSL via (**in order of precedence**):

- A `.nslrc` file written in JSON
- A `.nslrc.json` file
- A `.nslrc.js` file written in ES module that exports an object using `export default`
- A `.nslrc.cjs` file written in CommonJS module that exports an object using `module.exports`

### Options

The options you can use in the configuration file.

| Option        | Type     | Description       |
|---------------|----------|-------------------|
| ignoreScripts | string[] | scripts to ignore |


## Basic configuration

JSON:
```json
{
  "ignoreScripts": [
    "any-script-name-to-ignore",
    "other-script-name-to-ignore",
    "another-script-name-to-ignore"
  ]
}
```

JS (ES Modules):
```js
export default {
  ignoreScripts: [
    'any-script-name-to-ignore',
    'other-script-name-to-ignore',
    'another-script-name-to-ignore',
  ],
};
```

CJS (CommonJS):
```js
module.exports = {
  ignoreScripts: [
    'any-script-name-to-ignore',
    'other-script-name-to-ignore',
    'another-script-name-to-ignore',
  ],
};
```

## Contributors are welcome 👋

## License

MIT