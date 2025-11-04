import { defineConfig } from "vite";
import { nitro } from "nitro/vite";
import { graphql } from 'nitro-graphql/vite'

export default defineConfig({
  plugins: [
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
