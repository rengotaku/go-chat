module.exports = {
    "env": {
        "browser": true,
        "es2021": true
    },
    "extends": [
        "standard-with-typescript",
        "plugin:react/recommended"
    ],
    "overrides": [
        {
            "env": {
                "node": true
            },
            "files": [
                ".eslintrc.{js,cjs}"
            ],
            "parserOptions": {
                "sourceType": "script"
            }
        }
    ],
    "parserOptions": {
        project: './tsconfig.json',
        // "ecmaFeatures": {
        //     "experimentalObjectRestSpread": true,
        //     "jsx": true,
        // },
        // "sourceType": "module",
    },
    // "parserOptions": {
    //     "ecmaVersion": "latest",
    //     "sourceType": "module"
    // },
    "plugins": [
        "react"
    ],
    "rules": {
    }
}