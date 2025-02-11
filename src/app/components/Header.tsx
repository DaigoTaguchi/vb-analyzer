import Image from "next/image";
import Link from "next/link";

export default function Header() {
  return (
    <header className="bg-gray-900 text-white">
      <div className="container mx-auto py-2">
        <div className="flex justify-start">
          <div className="text-xl font-bold">
            <Link href="/">
              <Image
                src="/logo1.png"
                alt="vb-analyzer-logo"
                width={200}
                height={30}
              ></Image>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
