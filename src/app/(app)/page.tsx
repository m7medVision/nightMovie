import RegisterForm from "./_components/RegisterForm";

export default function HomePage() {
  return (
    <div className="bg-black w-screen">
      <div
        id="content"
        className="h-screen relative max-w-3xl px-4 sm:px-6 lg:px-8 flex flex-col justify-center content-center sm:items-center mx-auto size-full before:absolute before:top-0 before:start-1/2 before:bg-[url('https://preline.co/assets/svg/examples-dark/squared-bg-element.svg')] before:bg-no-repeat before:bg-top before:size-full before:-z-[1] before:transform before:-translate-x-1/2"
      >
        <div className="text-center py-8 px-4 sm:px-6 lg:px-8">
          <h1 className="text-2xl text-white sm:text-4xl">Get notified when we launch</h1>
          <h2 className="mt-1 sm:mt-3 text-4xl font-bold text-white sm:text-6xl">
            <span className="bg-clip-text bg-gradient-to-tr from-blue-600 to-purple-400 text-transparent">
              NightMovie
            </span>
          </h2>
          <RegisterForm />
        </div>
      </div>
      <footer className="absolute bottom-0 inset-x-0 text-center py-5">
        <div className="max-w-[85rem] mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-sm text-white/50">© 2024 NightMovie. A product of M7medvision</p>
        </div>
      </footer>
    </div>
  )
}