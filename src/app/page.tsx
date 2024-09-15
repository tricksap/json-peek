export default function Home() {
  return (
    <main className="">
      <div className="flex md:flex-row h-screen flex-col items-center justify-center">
        <div className="basis-1/2 h-screen flex flex-col items-center justify-center space-y-4 p-4 text-center">
          <h1 className='text-4xl md:text-5xl font-extrabold'>Visualize JSON Data with Ease</h1>
          <h1 className='text-md'>Explore and interact with your JSON data like never before.</h1>
          <a href="/Editor">
            <button type="button" className="text-gray-900 bg-white hover:bg-gray-100 border border-gray-200 focus:ring-4 focus:outline-none focus:ring-gray-100 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:focus:ring-gray-800 dark:bg-white dark:border-gray-700 dark:text-gray-900 dark:hover:bg-gray-200 me-2 mb-2">
              Go to  Editor
            </button>
          </a>

          <div className="text-white">
            <div className="max-w-7xl mx-auto font-[sans-serif] text-white">
              <div className="grid xl:grid-cols-4 lg:grid-cols-3 md:grid-cols-2 gap-12 mt-16">

              </div>
            </div>
          </div>
        </div>
        <div className="basis-[65%] h-screen flex flex-col items-center justify-center space-y-4">
          <img src="./mockup.png" />
        </div>
      </div>
    </main>

  );
}
