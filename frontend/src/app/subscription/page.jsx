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
    price: "399",
    originalPrice: "599",
    discountLabel: "33% OFF",
    duration: "1 Month"
  },
  {
    title: "Family",
    features: [
      "Enjoy all Premium plan benefits on up to 4 devices",
      "Watch simultaneously on multiple devices",
      "Create up to 4 personalized profiles",
      "Parental controls for family-friendly viewing"
    ],
    price: "799",
    originalPrice: "999",
    discountLabel: "20% OFF",
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

    if (userData?.user?.isPremium) {
      toast("You have already Purchased Premium");
      return;
    }

    if (activePrice === "") {
      toast("Select a card to join premium");
      return;
    }

    try {
      if (!userData.isLoggedIn) {
        toast("Login to Access Premium")
        router.push("/login")
        return;
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
          toast.success(`Payment Successfull - ${response.razorpay_order_id}`)
          try {
            const updatePremium = await api.patch(ENDPOINT.updatePremium, {
              email: userData.user?.email
            })
            if (updatePremium?.data?.message?.isPremium) {
              dispatch(updateUserPremium(true))
              toast.success("Premium access updated successfully")
            }
            router.push("/jio+");
          } catch (err) {
            console.error(err)
          }
        }
      }

      const rzp1 = new Razorpay(options)
      rzp1.on("payment.failed", function (response) {
        toast.error(response.error.description || "Payment Failed!");
      });

      rzp1.open()

    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'An error occurred';
      toast.error(errorMessage);
    }
  }

  return (
    <div className="min-h-screen bg-linear-to-b from-slate-950 via-slate-900 to-slate-950">
      <div className="mx-auto max-w-7xl px-4 py-4 md:py-6">
        <Link
          href="/"
          className="inline-flex items-center justify-center w-10 h-10 rounded-lg hover:bg-slate-800 text-gray-300 hover:text-white transition-colors duration-200 mb-5"
        >
          ←
        </Link>

        <div className="space-y-3 mb-12">
          <h1 className="text-4xl md:text-5xl font-black mb-7 bg-linear-to-r from-pink-500 to-pink-400 bg-clip-text text-transparent">
            Stream Premium
          </h1>
          <p className="text-gray-400 text-xl max-w-5xl leading-relaxed">
            Unlock unlimited entertainment with ad-free streaming, exclusive content, and premium features. Experience the best of Hollywood, blockbuster movies, and original series all in one place.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 mb-10">
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

        <div className="flex flex-col sm:flex-row gap-4 items-start md:items-center">
          <button
            onClick={handlePaymentClick}
            className={`px-8 py-3 rounded-lg font-semibold text-white transition-all duration-300 ${
              activePrice
                ? "bg-linear-to-r from-pink-600 to-pink-500 hover:shadow-md hover:shadow-pink-500/50 cursor-pointer"
                : "bg-gray-700 cursor-not-allowed opacity-60"
            }`}
          >
            Continue & Pay
          </button>
          <p className="text-gray-500 text-sm">
            {activePrice ? "Ready to upgrade your experience" : "Select a plan to get started"}
          </p>
        </div>
      </div>
    </div>
  )
}

export default SubscriptionPage