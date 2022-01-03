import { getOptionsForVote } from '@/utils/getRandomPokemon'
import { trpc } from '@/utils/trpc'
import { useState } from 'react';
import 'tailwindcss/tailwind.css'

const btn =
  "inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm font-medium rounded-full text-gray-700 bg-white hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500";

export default function Home() {

  const [ids, updateIds] = useState(getOptionsForVote());

  const [firstId, secondId] = ids;

  const firstPokemon = trpc.useQuery(['get-pokemon-by-id', { id: firstId }])
  const secondPokemon = trpc.useQuery(['get-pokemon-by-id', { id: secondId }])
  console.log('firstPokemon :>> ', firstPokemon.data);

  if (firstPokemon.isLoading || secondPokemon.isLoading) {
    return null;
  }

  const voteForRoundest = (selected: number) => {
    console.log('selected :>> ', selected);
    // todo: fire mutation to persist changes
    updateIds(getOptionsForVote());
  }

  return (
    <div className="h-screen w-screen flex flex-col justify-center items-center">
      <div className='text-2xl text-center'>Which Pokemon is rounder???</div>
      <div className='p-2'></div>
      <div className='border rounded p-8 flex items-center justify-between max-w-2xl'>
        <div className='w-64 h-64 flex flex-col items-center'>
          <img
            src={firstPokemon.data?.sprite ?? ''}
            alt={firstPokemon.data?.name}
            className='w-full'
          />
          <div className='text-xl text-center capitalize mt-[-2rem]'>{firstPokemon.data?.name}</div>
          <button className={btn} onClick={() => voteForRoundest(firstId)}>Rounder</button>
        </div>
        <div className='p-8'>Vs</div>
        <div className='w-64 h-64 flex flex-col items-center'>
          <img
            src={secondPokemon.data?.sprite ?? ''}
            alt={secondPokemon.data?.name}
            className='w-full'
          />
          <div className='text-xl text-center capitalize mt-[-2rem]'>{secondPokemon.data?.name}</div>
          <button className={btn} onClick={() => voteForRoundest(secondId)}>Rounder</button>
        </div>
        <div className='p-2'></div>
      </div>
    </div>
  )
}
