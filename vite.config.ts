import path from "path"
import tailwindcss from "@tailwindcss/vite"
import react from "@vitejs/plugin-react"
import { defineConfig, type Plugin } from "vite"

import config from "./config.json"

/** Escapes a config value so it can be dropped into an HTML attribute. */
function escapeHtml(value: string) {
    return value
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
}

/**
 * Fills the `%SITE_*%` placeholders in `index.html` from `config.json`.
 *
 * The shell is served before any JavaScript runs, so title, language and
 * description cannot come from the app itself — they have to be substituted at
 * build time. Vite only does that for `VITE_`-prefixed environment variables,
 * hence this plugin. Taken over unchanged from the docs project.
 */
function siteMetadata(): Plugin {
    const values: Record<string, string> = {
        SITE_TITLE: config.site.title,
        SITE_DESCRIPTION: config.site.description,
        SITE_LANG: config.site.lang,
    }

    return {
        name: "site-metadata",
        transformIndexHtml: {
            // Before Vite's own `%VITE_…%` substitution, so a value that
            // happens to contain a percent sign cannot be misread.
            order: "pre",
            handler: (html) =>
                html.replace(
                    /%(SITE_TITLE|SITE_DESCRIPTION|SITE_LANG)%/g,
                    (_, key: string) => escapeHtml(values[key]),
                ),
        },
    }
}

export default defineConfig({
    plugins: [react(), tailwindcss(), siteMetadata()],
    // Only the built site is pinned to the configured port; `npm run dev` keeps
    // Vite's own default so a running container and a dev server can coexist.
    preview: {
        port: config.port,
    },
    resolve: {
        alias: {
            "@": path.resolve(__dirname, "./src"),
        },
    },
})
