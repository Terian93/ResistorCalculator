module.exports = {
  extends: [
    "stylelint-config-standard"
  ],
  plugins: [
    "stylelint-scss"
  ],
  rules:
   {
    indentation: 2,
    "number-leading-zero": null,
    "selector-pseudo-class-no-unknown": [true, {
      ignorePseudoClasses: ["global"]
    }],
    "selector-max-id": 0,
    "selector-class-pattern": "^([a-z][a-z0-9]*)(-[a-z0-9]+)*$",
    "at-rule-no-unknown": null,
    "scss/at-rule-no-unknown": true,
  }
};
