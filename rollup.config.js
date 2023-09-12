import path from "path";
import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import terser from "@rollup/plugin-terser";
import { babel } from "@rollup/plugin-babel";
import replace from "@rollup/plugin-replace";{% if engine == "svelte" %}
import svelte from "rollup-plugin-svelte";
import autoPreprocess from "svelte-preprocess";{% endif %}
import postcss from "rollup-plugin-postcss";
import userscriptResponsiveDevelop from "rollup-plugin-userscript-responsive-develop";

const isProduction = process.env.NODE_ENV == "prod";
const sourceDir = path.resolve(__dirname, "src");
const outputDir = path.resolve(__dirname, "dist");

function createConfig() {
  const config = {
    input: path.resolve(sourceDir, "index"),
    output: {
      file: path.relative(__dirname, path.resolve(outputDir, `output.js`)),
      format: "iife",
      sourcemap: isProduction ? "inline" : true,
    },
    plugins: [{% if engine == "svelte" %}
      svelte({
        preprocess: autoPreprocess()
      }),{% endif %}
      resolve(
        {
          browser: true,
          extensions: [".ts", ".js"]
        }
      ),
      commonjs(),
      replace(
        {"process.env.NODE_ENV": process.env.NODE_ENV, preventAssignment: true}
      ),
      postcss(),
      babel(
        {
          extensions: [
            ".js", ".ts"
          ],
          babelHelpers: "bundled"
        }
      ),
      userscriptResponsiveDevelop(
        {
          name: `debug.js`, 
          extractToHeader: isProduction
        }
      ),
      isProduction && terser()
    ]
  };
  return config;
}

export default createConfig();