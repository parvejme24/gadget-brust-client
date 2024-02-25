import React from "react";
import Usual from "../../components/Home/Usual/Usual";
import Banner from "../../components/Home/Banner/Banner";
import Newsletter from "../../components/Home/Newsletter/Newsletter";

export default function Home() {
  return (
    <div>
      <Banner />
      <Usual />
      <Newsletter />
    </div>
  );
}
