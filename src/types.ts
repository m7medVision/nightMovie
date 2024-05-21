import { z } from "zod";

export interface Movie {
  movie: string;
  love: number;
}
export const movieSchema = z.object({
  categories: z.array(z.string()),
  movies: z.array(z.string()),
  mood: z.array(z.string()),
})

