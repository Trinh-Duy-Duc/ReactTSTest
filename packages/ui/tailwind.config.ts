import type { Config } from "tailwindcss";
import sharedConfig from "@repo/tailwind-config";

const config: Pick<Config, "presets" | "content" | "theme"> = {
  content: ["./src/**/*.tsx"],
  presets: [sharedConfig],
  theme: {
    
  }
};

export default config;
