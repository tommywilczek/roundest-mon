import { getOptionsForVote } from '@/utils/getRandomPokemon'
import { trpc } from '@/utils/trpc'
import Image from 'next/image';
import { useState } from 'react';
import 'tailwindcss/tailwind.css'
import { inferQueryResponse } from './api/trpc/[trpc]';

const btn =
  "inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm font-medium rounded-full text-gray-700 bg-white hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500";

export default function Home() {

  const [ids, updateIds] = useState(getOptionsForVote());

  const [firstId, secondId] = ids;

  const firstPokemon = trpc.useQuery(['get-pokemon-by-id', { id: firstId }])
  const secondPokemon = trpc.useQuery(['get-pokemon-by-id', { id: secondId }])

  const voteMutation = trpc.useMutation(["cast-vote"]);

  const voteForRoundest = (selected: number) => {
    if (selected === firstId) {
      voteMutation.mutate({ votedForId: firstId, votedAgainstId: secondId });
    } else {
      voteMutation.mutate({ votedForId: secondId, votedAgainstId: firstId });
    }
    console.log('selected :>> ', selected);
    // todo: fire mutation to persist changes
    updateIds(getOptionsForVote());
  }

  return (
    <>
      <div className="h-screen w-screen flex flex-col justify-center items-center">
        <div className='text-2xl text-center'>Which Pokemon is rounder???</div>
        <div className='p-2'></div>
        <div className='border rounded p-8 flex items-center justify-between max-w-2xl'>
          {!firstPokemon.isLoading &&
            firstPokemon.data &&
            !secondPokemon.isLoading &&
            secondPokemon.data &&
            (
              <>
                <PokemonListing
                  pokemon={firstPokemon.data}
                  vote={() => voteForRoundest(firstId)}
                />
                <div className='p-8'>Vs</div>
                <PokemonListing
                  pokemon={secondPokemon.data}
                  vote={() => voteForRoundest(secondId)}
                />
              </>
            )}
          <div className='p-2'></div>
        </div>
      </div>
        <div className='sticky bottom-0 text-center text-xl'>
          <a
            href="https://github.com/tommywilczek/roundest-mon"
            className='text-center text-blue-600'
            target='_blank'
          >
            Repo
          </a>
        </div>
    </>
  )
}

type PokemonFromServer = inferQueryResponse<"get-pokemon-by-id">;

const PokemonListing: React.FC<{ pokemon: PokemonFromServer, vote: () => void }> = (props) => {
  return <div className='flex flex-col items-center'>
    <Image
      src={props.pokemon.sprite ?? ''}
      alt={props.pokemon.name}
      width={256}
      height={256}
      layout='fixed'
    />
    <div className='text-xl text-center capitalize mt-[-2rem]'>{props.pokemon.name}</div>
    <button className={btn} onClick={() => props.vote()}>Rounder</button>
  </div>
}