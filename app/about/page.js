'use client';

import Link from "next/link"
import { useSearchParams } from "next/navigation"


const About = () => {
  const params = useSearchParams();
  const name = params.get('name');
  return (
    <>
      <h1>About Page</h1>
      <h1>{name}</h1>
      <Link href={"/"}>Main</Link>
    </>
  )
}

export default About

