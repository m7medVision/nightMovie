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
import { Card, CardContent, CardTitle } from '@/components/ui/card'
function Spiner() {
  return (
    <div role="status">
      <svg
        aria-hidden="true"
        className="w-6 h-6 animate-spin fill-primary"
        viewBox="0 0 100 101"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
          fill="currentColor"
        />
        <path
          d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
          fill="currentFill"
        />
      </svg>
      <span className="sr-only">Loading...</span>
    </div>
  )
}
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

  const { control, register, handleSubmit, reset } = form
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
        // check type of recommendations if it is an array of movies if not log error
        if (
          Array.isArray(recommendations) &&
          recommendations.every((movie) => movie.movie && movie.love)
        ) {
          setOutput(recommendations)
        } else {
          setOutput(null)
        }
      } else {
        setOutput(null)
      }
    } catch (error) {
      setOutput(null)
    }
  }

  const handleReset = () => {
    reset()
    setOutput(null)
  }
  useEffect(() => {
    const storedData = JSON.parse(localStorage.getItem('formData') || '{}')
    if (storedData) {
      form.reset(storedData)
    }
  }, [form])
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
          <Button disabled={form.formState.isSubmitting} type="submit" className="flex gap-2">
            {form.formState.isSubmitting ? <Spiner /> : ''}
            Find Movies
          </Button>
          <Button type="button" onClick={handleReset} variant={'destructive'}>
            Reset
          </Button>
        </div>
      </form>

      {output && (
        <Card className="bg-primary-foreground p-5">
          <CardTitle className="p-4">Recommendations</CardTitle>
          <CardContent>
            {output.map((movie) => (
              <div key={movie.movie} className="bg-white shadow-md rounded-md p-4 mb-4">
                <h3 className="text-lg font-bold">{movie.movie}</h3>
                <p>Rating according to your likes: {movie.love}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
