import { defineConfig } from "vite";
import { nitro } from "nitro/vite";
import { graphql } from 'nitro-graphql/vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [
    react(),
    graphql({
      framework: 'graphql-yoga',
      paths: {
        serverGraphql: 'routes/graphql',
      },
    }),
    nitro()
  ],
  nitro: {
    preset: "standard",
  },
});
