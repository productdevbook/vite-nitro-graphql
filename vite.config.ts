import { defineConfig } from "vite";
import { nitro } from "nitro/vite";
import { graphql } from 'nitro-graphql/vite'

export default defineConfig({
  plugins: [
    graphql(),
    nitro()
  ],
  nitro: {
    preset: "standard",
    modules: ["nitro-graphql"],
    graphql: {
      framework: 'graphql-yoga'
    }
  },
});
