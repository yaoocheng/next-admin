import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";
import prettier from "eslint-config-prettier";
import eslintPluginPrettier from "eslint-plugin-prettier";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
    baseDirectory: __dirname,
});

const eslintConfig = [
    ...compat.extends("next/core-web-vitals", "next/typescript"),
    {
        rules: {
            // 开启 Prettier 的错误提示
            "prettier/prettier": ["error", { tabWidth: 4, useTabs: false }],
            indent: ["error", 4],
        },
        plugins: {
            prettier: eslintPluginPrettier,
        },
    },
    prettier,
];

export default eslintConfig;
