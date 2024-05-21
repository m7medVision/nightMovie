'use client'
import { useState } from 'react'
import type { Movie } from '@/types'
import { movieSchema } from "@/types"
import { useForm, useFieldArray } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'

const categories = [
  'Action', 'Comedy', 'Drama', 'Thriller', 'Sci-Fi', 'Animation'
]

export default function FindPage() {
  const [output, setOutput] = useState<Movie[] | null>(null)
  const form = useForm<z.infer<typeof movieSchema>>({
    resolver: zodResolver(movieSchema),
    defaultValues: {
      categories: [],
      movies: [],
      mood: [],
    }
  });

  const { control, register, handleSubmit, reset } = form;
  const { fields: moviesFields, append: appendMovie, remove: removeMovie } = useFieldArray({
    control,
    name: 'movies',
  });

  const { fields: moodFields, append: appendMood, remove: removeMood } = useFieldArray({
    control,
    name: 'mood',
  });

  const onSubmit = async (data: z.infer<typeof movieSchema>) => {
    try {
      const response = await fetch('/api/getMovies', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        const recommendations = await response.json();
        setOutput(recommendations);
      } else {
        console.error('Failed to fetch recommendations');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleReset = () => {
    reset();
    setOutput(null);
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Find Your Next Movie</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="mb-6">
        <div className="mb-4">
          <label htmlFor="categories" className="block text-gray-700 font-bold mb-2">Categories</label>
          <div className="grid grid-cols-3 gap-2">
            {categories.map((category) => (
              <div key={category} className="flex items-center">
                <input
                  {...register('categories')}
                  type="checkbox"
                  value={category}
                  id={category}
                  className="form-checkbox h-5 w-5 text-indigo-600"
                />
                <label htmlFor={category} className="ml-2 text-gray-700">
                  {category}
                </label>
              </div>
            ))}
          </div>
        </div>

        <div className="mb-4">
          <label htmlFor="movies" className="block text-gray-700 font-bold mb-2">Past Favorites</label>
          {moviesFields.map((field, index) => (
            <div key={field.id} className="flex items-center gap-2 mb-2">
              <input
                {...register(`movies.${index}`)}
                type="text"
                placeholder={`Movie ${index + 1}`}
                className="form-input w-full py-2 px-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-transparent"
              />
              <button
                type="button"
                onClick={() => removeMovie(index)}
                className="text-red-500 hover:text-red-700"
              >
                Remove
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() => appendMovie('')}
            className="mt-2 text-indigo-600 hover:text-indigo-800"
          >
            Add Movie
          </button>
        </div>

        <div className="mb-4">
          <label htmlFor="mood" className="block text-gray-700 font-bold mb-2">Mood</label>
          {moodFields.map((field, index) => (
            <div key={field.id} className="flex items-center gap-2 mb-2">
              <input
                {...register(`mood.${index}`)}
                type="text"
                placeholder={`Mood ${index + 1}`}
                className="form-input w-full py-2 px-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-transparent"
              />
              <button
                type="button"
                onClick={() => removeMood(index)}
                className="text-red-500 hover:text-red-700"
              >
                Remove
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() => appendMood('')}
            className="mt-2 text-indigo-600 hover:text-indigo-800"
          >
            Add Mood
          </button>
        </div>

        <div className="flex justify-between">
          <button
            type="submit"
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded"
          >
            Get Recommendations
          </button>
          <button
            type="button"
            onClick={handleReset}
            className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded"
          >
            Reset
          </button>
        </div>
      </form>

      {output && (
        <div className="bg-gray-100 rounded-md p-6">
          <h2 className="text-2xl font-bold mb-4">Recommended Movies</h2>
          {output.map((movie) => (
            <div key={movie.movie} className="bg-white shadow-md rounded-md p-4 mb-4">
              <h3 className="text-xl font-bold">{movie.movie}</h3>
              <p>Love Rating: {movie.love}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
