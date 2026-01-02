
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
    plugins: [react()],
    test: {
        environment: 'node', // Default to node for server actions logic, use 'jsdom' if testing components
        alias: {
            '@': path.resolve(__dirname, './src'),
        },
        include: ['**/*.test.ts', '**/*.test.tsx'],
    },
})
