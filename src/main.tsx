import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import { ThemeProvider } from "next-themes"

import "./index.css"
import App from "./App.tsx"

/**
 * Application entry point: mounts {@link App} into the `#root` element.
 */
createRoot(document.getElementById("root")!).render(
    <StrictMode>
        <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
        >
            <App />
        </ThemeProvider>
    </StrictMode>,
)
