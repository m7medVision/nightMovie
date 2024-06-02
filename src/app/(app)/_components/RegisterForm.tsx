'use client'

import { Alert, AlertDescription } from '@/components/ui/alert'
import { zodResolver } from '@hookform/resolvers/zod'
import { SubmitHandler, useForm } from 'react-hook-form'
import { z } from 'zod'
import { useToast } from "@/components/ui/use-toast"
import { title } from 'process'
const formSchema = z.object({
  name: z.string(),
  email: z.string().email(),
})
type FormSchema = z.infer<typeof formSchema>
export default function RegisterForm() {
  const toast = useToast()
  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
  })
  const onSubmit: SubmitHandler<FormSchema> = async (data) => {
    function randomString(length: number) {
      const chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'
      let result = ''
      for (let i = length; i > 0; --i) result += chars[Math.floor(Math.random() * chars.length)]
      return result
    }
    let options = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'User-Agent': 'insomnia/9.2.0' },
      body: JSON.stringify({ email: data.email, name: data.name, password: randomString(16)})
    };
    const resp = await fetch('http://localhost:3000/api/public-users', options)
    if (resp.ok) {
      toast.toast({
        title: 'Success',
        description: 'You have successfully joined the waitlist',
        variant: 'success',
      })
    } else {
      form.setError('root', { message: 'Something went wrong' })
    }
  }
  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      <div className="mt-8 space-y-4">
        {
          form.formState.errors.root && (
            <Alert variant='destructive'>
              <AlertDescription>
                {form.formState.errors.root?.message}
              </AlertDescription>
            </Alert>
          )
        }
        <div>
          <label htmlFor="hs-cover-with-gradient-form-name-1" className="sr-only">
            Full name
          </label>
          <div className="relative">
            <input
              {...form.register('name', { required: true })}
              className="py-3 ps-11 pe-4 block w-full bg-white/10 border-white/20 text-white placeholder:text-white rounded-lg text-sm focus:border-white/30 focus:ring-white/30 sm:p-4 sm:ps-11"
              placeholder="Full name"
            />
            <div className="absolute inset-y-0 start-0 flex items-center pointer-events-none z-20 ps-4">
              <svg
                className="flex-shrink-0 size-4 text-gray-400"
                xmlns="http://www.w3.org/2000/svg"
                width={24}
                height={24}
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                <circle cx={12} cy={7} r={4} />
              </svg>
            </div>
          </div>
        </div>
        {
          form.formState.errors.name && (
            <Alert variant='destructive'>
              <AlertDescription>
                {form.formState.errors.name?.message}
              </AlertDescription>
            </Alert>
          )
        }
        <div>
          <label htmlFor="hs-cover-with-gradient-form-email-1" className="sr-only">
            Email address
          </label>
          <div className="relative">
            <input
              {...form.register('email', { required: true })}
              className="py-3 ps-11 pe-4 block w-full bg-white/10 border-white/20 text-white placeholder:text-white rounded-lg text-sm focus:border-white/30 focus:ring-white/30 sm:p-4 sm:ps-11"
              placeholder="Email address"
            />
            <div className="absolute inset-y-0 start-0 flex items-center pointer-events-none z-20 ps-4">
              <svg
                className="flex-shrink-0 size-4 text-gray-400"
                xmlns="http://www.w3.org/2000/svg"
                width={24}
                height={24}
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect width={20} height={16} x={2} y={4} rx={2} />
                <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
              </svg>
            </div>
          </div>
        </div>
        {
          form.formState.errors.email && (
            <Alert variant='destructive'>
              <AlertDescription>
                {form.formState.errors.email?.message}
              </AlertDescription>
            </Alert>
          )
        }
        <div className="grid">
          <button
            type="submit"
            className="sm:p-4 py-3 px-4 inline-flex justify-center items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent bg-white/10 text-white hover:bg-white/20 disabled:opacity-50 disabled:pointer-events-none"
          >
            Join the waitlist
            <svg
              className="flex-shrink-0 size-4"
              xmlns="http://www.w3.org/2000/svg"
              width={24}
              height={24}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="m9 18 6-6-6-6" />
            </svg>
          </button>
        </div>
      </div>
    </form>
  )
}
