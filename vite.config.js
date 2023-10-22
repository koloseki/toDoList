import path from 'path';
import { defineConfig } from "vite";

export default {
    base: '/toDoList/',
    build: {
        outDir: './dist'
    },
    server: {
        port: 8080
    },

}
