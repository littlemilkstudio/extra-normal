import { basename } from "path";
import babel from "rollup-plugin-babel";
import { terser } from "rollup-plugin-terser";
import typescript from "rollup-plugin-typescript2";
import pkg from "./package.json";

const name = basename(pkg.main, ".js");

const external = [
  ...Object.keys(pkg.dependancies || {}),
  ...Object.keys(pkg.peerDependancies || {})
];

const terserPrettyConfig = {
  warnings: true,
  ecma: 5,
  keep_fnames: true,
  compress: {
    conditionals: false,
    if_return: false,
    join_vars: false,
    keep_fnames: true,
    loops: false,
    pure_getters: true,
    toplevel: true,
    sequences: false,
  },
  mangle: false,
  output: {
    braces: true,
    indent_level: 2,
  },
};

const terserMinifiedConfig = {
  warnings: true,
  ecma: 5,
  toplevel: true,
  compress: {
    keep_infinity: true,
    passes: 10,
    pure_getters: true,
  },
};

const makePlugins = ({ isProduction }) => {
  return [
    typescript({
      useTsconfigDeclarationDir: true,
      tsconfigOverride: {
        compilerOptions: {
          declaration: !isProduction
        },
        exclude: ["node_modules", "src/**/*.test.ts"],
      }
    }),
    babel(),
    terser(isProduction ? terserMinifiedConfig : terserPrettyConfig)
  ];
};

export default [
  {
    input: "./src/index.ts",
    external,
    plugins: makePlugins({ isProduction: false }),
    output: [
      {
        file: `./dist/cjs/${name}.js`,
        format: "cjs"
      },
      {
        file: `./dist/esm/${name}.esm.js`,
        format: "esm"
      }
    ]
  },
  {
    input: "./src/index.ts",
    external,
    plugins: makePlugins({ isProduction: true }),
    output: [
      {
        file: `./dist/cjs/${name}.min.js`,
        format: "cjs"
      },
      {
        file: `./dist/esm/${name}.esm.min.js`,
        format: "esm"
      }
    ]
  }
];
