import * as trpc from '@trpc/server';
import { z } from 'zod';

import { PokemonClient } from 'pokenode-ts';
import { resolve } from 'path/posix';

export const appRouter = trpc.router().query('get-pokemon-by-id', {
  input: z.object({ id: z.number() }),
  async resolve({ input }) {
    const pokemonApi = new PokemonClient();

    const pokemon = await pokemonApi.getPokemonById(input.id);
    return { name: pokemon.name, sprite: pokemon.sprites.front_shiny };
  }
}).mutation("cast-vote", {
  input: z.object({
    votedForId: z.number(),
    votedAgainstId: z.number()
  }),
  async resolve({ input }) {
    const voteInDb = await prisma?.vote.create({
      data: {
        ...input
      },
    });
    return { success: true }
  }
});

// export type definition of API
export type AppRouter = typeof appRouter;
