import { ArrowRight } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <main className="">
      <div className="flex flex-col lg:flex-row items-center bg-[#1E1919] dark:bg-slate-800">
        <div className="p-10 flex flex-col bg-[#2B2929] dark:bg-slate-800 text-white space-y-5">
          <h1 className="text-5xl font-bold">
            Welcome to Dropbox. <br />
            <br />
            Storing everything for you and your business needs. All in one place
          </h1>

          <p className="pb-20">
            Dropbox is known for its user-friendly interface, seamless file
            syncing and sharing capabilities, and robust security features,
            making it a popular choice for individuals, businesses, and teams
            looking for a reliable cloud storage and collaboration solution.
          </p>

          <Link
            href="/dashboard"
            className="flex bg-blue-500 w-fit p-3 cursor-pointer"
          >
            Try it for free!
            <ArrowRight className="ml-10" />
          </Link>
        </div>

        <div className="bg-[#1E1919] h-full p-10 dark:bg-slate-800">
          <video autoPlay loop muted className="rounded-lg">
            <source src="https://aem.dropbox.com/cms/content/dam/dropbox/warp/en-us/overview/lp-header-graphite200-1920x1080.mp4"
                    type="video/mp4" />
            Your browser does not support video tag.
          </video>
        </div>
      </div>

      <p className="text-center font-bold pt-5 text-xl">Disclaimer</p>
      <p className="text-center font-light p-2">
        The information provided on this website is for general informational
        purposes only. All information on the site is provided in good faith,
        however, we make no representation or warranty of any kind, express or
        implied, regarding the accuracy, adequacy, validity, reliability,
        availability, or completeness of any information on the site. Under no
        circumstance shall we have any liability to you for any loss or damage
        of any kind incurred as a result of the use of the site or reliance on
        any information provided on the site. Your use of the site and your
        reliance on any information on the site is solely at your own risk.
      </p>
    </main>
  );
}
