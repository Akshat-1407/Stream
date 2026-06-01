"use client"
import React, { useState } from "react"
import Link from "next/link"
import OfferCard from "../../components/ui/atom/OfferCard"
import { toast } from "sonner"
import { api, ENDPOINT } from "@/lib/api"
import { useDispatch, useSelector } from "react-redux"
import { useRouter } from "next/navigation"
import { updateUserPremium } from "@/redux/userSlice"

const offers = [
  {
    title: "Premium Monthly",
    features: [
      "Ad-Free (except sports & live)",
      "Includes all Premium content",
      "Any 1 device at a time (up to Asli 4K quality)",
      "Download and watch anytime"
    ],
    price: "29",
    originalPrice: "59",
    discountLabel: "51% OFF",
    duration: "1 Month"
  },
  {
    title: "Family",
    features: ["Enjoy all Premium plan benefits on up to 4 devices"],
    price: "89",
    originalPrice: "149",
    discountLabel: "40% OFF",
    duration: "1 Month"
  }
]

function loadScript() {
  return new Promise(function (resolve, reject) {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => {
      resolve();
    }
    script.onerror = () => {
      reject(new Error("Razorpay script failed to load"));
    }
    document.body.appendChild(script);
  })
}

function SubscriptionPage() {

  const [activePrice, setActivePrice] = useState("");

  const userData = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const router = useRouter();

  // Load Razorpay script on component mount
  React.useEffect(() => {
    loadScript();
  }, []);

  const handlePaymentClick = async () => {

    if (activePrice === "") {
      toast("Select a card to join premium");
      return;
    }

    try {
      if (!userData.isLoggedIn) {
        toast("Login to Access Premium")
        router.push("/login")
        return
      }

      const res = await api.post(`${ENDPOINT.payment}`, {
        amount: activePrice
      })

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID ?? "",
        amount: res.data.amount,
        currency: "INR",
        name: "Stream Corp",
        description: "Stream Premium Transaction",
        image: "https://picsum.photos/200/300",
        order_id: res.data.orderId,

        handler: async function (response) {
          // toast(`Payment Successfull - ${response.razorpay_order_id}`)
          try {
            const updatePremium = await api.patch(ENDPOINT.updatePremium, {
              email: userData.user?.email
            })
            if (updatePremium?.data?.message?.isPremium) {
              dispatch(updateUserPremium(true))
              toast("Premium access updated successfully")
            }
            router.push("/jio+");
          } catch (err) {
            console.error(err)
          }
        }
      }

      const rzp1 = new Razorpay(options)
      rzp1.on("payment.failed", function (response) {
        console.error("Payment Failed:", response.error);
        toast(response.error.description || "Payment could not be completed.");
      });

      rzp1.open()

    } catch (error) {
      console.log(error);
    }
  }

  return (
    
    <div className="mx-auto p-4 md:pt-8 pt-4">
      <div className="flex items-center justify-between ">
        <Link
          href="/"
          className=" hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-lg"
        >
          ←
        </Link>
      </div>

      <div className="md:mx-16">
        <h1 className="md:text-4xl text-2xl  leading-none font-black md:text-12 mb-4 text-nowrap">
          JioCinema Premium
        </h1>
        <p className="text-lg mb-8 w-[70%] text-wrap hidden md:block">
          Entertainment Redefined - The best of Hollywood, Before TV
          premieres, Blockbuster movies, Exclusive series, India{`'`}s biggest
          Kids & Family hub + 365 days of reality!
        </p>
        <div className="flex flex-col md:flex-row w-full md:gap-8 gap-2">
          {offers.map((offer, index) => (
            <OfferCard
              key={index}
              title={offer.title}
              features={offer.features}
              price={offer.price}
              originalPrice={offer.originalPrice}
              discountLabel={offer.discountLabel}
              duration={offer.duration}
              isActive={activePrice === offer.price}
              onClick={() => setActivePrice(offer.price)}
            />
          ))}
        </div>
        <button
          className="bg-pink-600 p-3 md:mt-10 item-start flex font-medium rounded-lg ml-2 cursor-pointer"
          onClick={handlePaymentClick}
        >
          Continue & Pay
        </button>
      </div>
    </div>

  )
}

export default SubscriptionPage