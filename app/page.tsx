import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex w-full flex-col items-center justify-between py-32 px-16 bg-gray-100 dark:bg-black sm:items-start">
        <div className="flex flex-col items-center gap-6 text-center sm:items-start sm:text-left">
          <h1 className="max-w-xs text-3xl font-semibold leading-10 tracking-tight text-black dark:text-zinc-50">
            Welcome to <span className="text-pink-500">Smultron</span>
          </h1>
          <p className="max-w-md text-lg leading-8 text-zinc-600 dark:text-zinc-400">
            A place where you save your favorite{" "}
            <a
              href="https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
              className="font-medium text-pink-600 dark:text-zinc-50"
            >
              Locations
            </a>{" "}
            for yourself or share them among selected{" "}
            <a
              href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
              className="font-medium text-pink-600 dark:text-zinc-50"
            >
              Friends
            </a>
          </p>
        </div>
        <Image
          src="/Landing2.webp"
          loading="eager"
          width={600}
          height={400}
          alt="OpenStreetMap"
          className="rounded-lg shadow-lg m-0"
        />

        <button className="flex flex-col gap-4 text-base font-medium sm:flex-row">
          <Link
            href="/map"
            className="flex h-12 w-full items-center justify-center gap-2 rounded-full bg-foreground px-5 text-background transition-colors hover:bg-[#383838] dark:hover:bg-[#ccc] md:w-158px"
          >
            Go to Map
          </Link>
        </button>
      </main>
    </div>
  );
}
