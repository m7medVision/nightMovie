'use client'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { useForm } from 'react-hook-form'
import { Form, FormField, FormLabel } from '@/components/ui/form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
})
export default function LoginPage() {
  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
  })
  async function onSubmit(data: z.infer<typeof loginSchema>) {
    const { email, password } = data
    const res = await fetch('/api/users/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: email,
        password: password,
      }),
    })
    const json = await res.json()
    if (!res.ok) {
      form.setError("root", { message: json.error })
    } else {
      window.location.href = '/find'
    }
  }
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="h-screen flex items-center">
        <Card className="w-full max-w-sm mx-auto my-auto">
          <CardHeader>
            <CardTitle className="text-2xl">Login</CardTitle>
            <CardDescription>Enter your email below to login to your account.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <div className="grid gap-2">
                  <FormLabel>Email</FormLabel>
                  <Input {...field} type="email" placeholder="" required />
                </div>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <div className="grid gap-2">
                  <FormLabel>Password</FormLabel>
                  <Input {...field} type="password" placeholder="" required />
                </div>
              )}
            />
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full">
              Sign in
            </Button>
          </CardFooter>
        </Card>
      </form>
    </Form>
  )
}
