import { getOptionsForVote } from '@/utils/getRandomPokemon'
import { trpc } from '@/utils/trpc'
import { useState } from 'react';
import 'tailwindcss/tailwind.css'

export default function Home() {

  const [ids, updateIds] = useState(getOptionsForVote());

  const [first, second] = ids;

  const firstPokemon = trpc.useQuery(['get-pokemon-by-id', { id: first }])
  const secondPokemon = trpc.useQuery(['get-pokemon-by-id', { id: second }])
  console.log('firstPokemon :>> ', firstPokemon.data);

  if (firstPokemon.isLoading || secondPokemon.isLoading) {
    return null;
  }

  return (
    <div className="h-screen w-screen flex flex-col justify-center items-center">
      <div className='text-2xl text-center'>Which Pokemon is rounder???</div>
      <div className='p-2'></div>
      <div className='border rounded p-8 flex items-center justify-between max-w-2xl'>
        <div className='w-64 h-64 flex flex-col'>
          <img
            src={firstPokemon.data?.sprites.front_default}
            alt={firstPokemon.data?.name}
            className='w-full'
          />
          <div className='text-xl text-center capitalize mt-[-2rem]'>{firstPokemon.data?.name}</div>
        </div>
        <div className='p-8'>Vs</div>
        <div className='w-64 h-64 flex flex-col'>
          <img
            src={secondPokemon.data?.sprites.front_default}
            alt={secondPokemon.data?.name}
            className='w-full'
          />
          <div className='text-xl text-center capitalize mt-[-2rem]'>{secondPokemon.data?.name}</div>
        </div>
        <div className='p-2'></div>
      </div>
    </div>
  )
}
