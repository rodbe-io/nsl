# NSL ⚡️ - Node Script List
List, fuzzy search and run scripts from any type of project

> Easy and fast way to run npm scripts  🚀

## Prerequisites

- **Node.js 18.18.2 or higher**

## 📦 Install

```bash
npm i -g @rodbe/nsl
```

> if you have a permission error, try to install with **administrator privileges**

## 🏎️ Usage

### 🌟 Just run the command and search for the script you want to run.

```bash
nsl
```
#### 🧙‍♂️ Ways to search
```sh
Select or search a script to run: <script> [project-path]
```
- `<script>`: Text to match the script name (required)
- `[project-path]`: Text to filter by the folder where the script lives (optional)

#### 🎖️ Examples (Pro Tips)
- Search for a script named `build` throughout the entire project:
```sh
Select or search a script to run: build
```
- Look for a script called `build` inside folders containing `api`:
```sh
Select or search a script to run: build api
```

![nsl](./assets/preview.gif)

### 🌟 To run the *latest executed script* of the current project

```bash
nn
```
![nsl](./assets/nn-preview.gif)

## 🧩 Arguments

| Argument  | Alias | Description                     | Comment                                  |
|-----------|-------|---------------------------------|------------------------------------------|
| --all     | -a    | list all scripts                | by default lifecycle scripts are ignored |
| --info    | -i    | get all info tech for debugging |                                          |
| --version | -v    | get current version             |                                          |
| --print   | -p    | print the selected script       | no exec the script, just print it        |
| --update  | -u    | update to last version          | if exists, update to last version        |

## ⚙️ Configuration file

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


## ✨ Basic configuration

JSON: `.nslrc` o `.nslrc.json` file
```json
{
  "ignoreScripts": [
    "any-script-name-to-ignore",
    "other-script-name-to-ignore",
    "another-script-name-to-ignore"
  ]
}
```

JS (ES Modules): `.nslrc.js` file
```js
export default {
  ignoreScripts: [
    'any-script-name-to-ignore',
    'other-script-name-to-ignore',
    'another-script-name-to-ignore',
  ],
};
```

CJS (CommonJS): `.nslrc.cjs` file
```js
module.exports = {
  ignoreScripts: [
    'any-script-name-to-ignore',
    'other-script-name-to-ignore',
    'another-script-name-to-ignore',
  ],
};
```

## 👋 Contributors are welcome

## License

MIT