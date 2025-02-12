import Image from "next/image";
import Link from "next/link";

export default function Header() {
  return (
    <header className="bg-gray-900 text-white w-full">
      <div className="w-full py-2 px-4 flex justify-start">
        <Link href="/">
          <Image
            src="/logo1.png"
            alt="vb-analyzer-logo"
            width={200}
            height={30}
            priority
          ></Image>
        </Link>
      </div>
    </header>
  );
}
