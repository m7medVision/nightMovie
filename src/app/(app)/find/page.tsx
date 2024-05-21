'use client'
import { useEffect, useState } from 'react'
import type { Movie } from '@/types'
import { movieSchema } from '@/types'
import { useForm, useFieldArray } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'

export default function FindPage() {
  const [output, setOutput] = useState<Movie[] | null>(null)
  const form = useForm<z.infer<typeof movieSchema>>({
    resolver: zodResolver(movieSchema),
    defaultValues: {
      categories: [],
      movies: [],
      mood: [],
    },
  })

  const { control, register, handleSubmit, reset, setValue } = form
  const {
    fields: moviesFields,
    append: appendMovie,
    remove: removeMovie,
  } = useFieldArray({
    control,
    rules: {
      minLength: 1,
    },
    name: 'movies' as never,
  })

  const {
    fields: moodFields,
    append: appendMood,
    remove: removeMood,
  } = useFieldArray({
    control,
    rules: {
      minLength: 1,
    },
    name: 'mood' as never,
  })

  const {
    fields: categoriesFields,
    append: appendCategory,
    remove: removeCategory,
  } = useFieldArray({
    control,
    rules: {
      minLength: 1,
    },
    name: 'categories' as never,
  })

  const onSubmit = async (data: z.infer<typeof movieSchema>) => {
    const formData = {
      categories: form.getValues('categories'),
      movies: form.getValues('movies'),
      mood: form.getValues('mood'),
    }
    localStorage.setItem('formData', JSON.stringify(formData))
    try {
      const response = await fetch('/api/getMovies', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      if (response.ok) {
        const recommendations = await response.json()
        setOutput(recommendations)
      } else {
        console.error('Failed to fetch recommendations')
      }
    } catch (error) {
      console.error('Error:', error)
    }
  }

  const handleReset = () => {
    reset()
    setOutput(null)
  }
  useEffect(() => {
    const storedData = JSON.parse(localStorage.getItem('formData') || '{}');
    if (storedData) {
      form.reset(storedData);
    }
  }, [form]);
  return (
    <div className="container mx-auto py-8 w-1/2">
      <h1 className="text-3xl font-bold mb-6">Find Your Next Movie</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="mb-6">
        <div className="mb-4">
          <Label>Categories</Label>
          <div className="flex flex-wrap gap-2">
            {categoriesFields.map((field, index) => (
              <div key={field.id} className="flex gap-2 w-full">
                <Input
                  {...register(`categories.${index}`)}
                  type="text"
                  placeholder={`Category ${index + 1}`}
                />
                <Button variant={'destructive'} type="button" onClick={() => removeCategory(index)}>
                  Remove
                </Button>
              </div>
            ))}
          </div>
          <Button
            type="button"
            onClick={() => appendCategory('')}
            variant="outline"
            className="mt-2"
          >
            Add Category
          </Button>
        </div>
        <div className="mb-4">
          <Label>Past Favorites</Label>
          <div className="flex flex-wrap gap-2">
            {moviesFields.map((field, index) => (
              <div key={field.id} className="flex gap-2 w-full">
                <Input
                  {...register(`movies.${index}`)}
                  type="text"
                  placeholder={`Movie ${index + 1}`}
                />
                <Button variant={'destructive'} type="button" onClick={() => removeMovie(index)}>
                  Remove
                </Button>
              </div>
            ))}
            <Button
              type="button"
              onClick={() => appendMovie('')}
              variant="outline"
              className="mt-2"
            >
              Add Movie
            </Button>
          </div>
        </div>

        <div className="mb-4">
          <Label>Mood</Label>
          <div className="flex flex-wrap gap-2">
            {moodFields.map((field, index) => (
              <div key={field.id} className="flex gap-2 w-full">
                <Input
                  {...register(`mood.${index}`)}
                  type="text"
                  placeholder={`Mood ${index + 1}`}
                />
                <Button type="button" variant="destructive" onClick={() => removeMood(index)}>
                  Remove
                </Button>
              </div>
            ))}
            <Button type="button" onClick={() => appendMood('')} variant="outline" className="mt-2">
              Add Mood
            </Button>
          </div>
        </div>

        <div className="flex justify-between">
          <Button type="submit">Get Recommendations</Button>
          <Button type="button" onClick={handleReset} variant={'destructive'}>
            Reset
          </Button>
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
