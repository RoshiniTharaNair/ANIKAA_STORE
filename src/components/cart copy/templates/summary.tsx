"use client"

import { Button, Heading } from "@medusajs/ui"

import CartTotals from "@/components/common/components/cart-totals"
import Divider from "@/components/common/components/divider"
import { CartWithCheckoutStep } from "@/types/global"
import DiscountCode from "@/components/checkout/components/discount-code"
import LocalizedClientLink from "@/components/common/components/localized-client-link"

type SummaryProps = {
  cart: CartWithCheckoutStep
}

const Summary = ({ cart }: SummaryProps) => {
  return (
    <div className="flex flex-col gap-y-4">
      <Heading level="h2" className="text-[2rem] leading-[2.75rem]">
        Summary
      </Heading>
      <DiscountCode cart={cart} />
      <Divider />
      <CartTotals data={cart} />
      <LocalizedClientLink href={"/checkout?step=" + cart.checkout_step} data-testid="checkout-button">
        <Button className="w-full h-10">Go to checkout</Button>
      </LocalizedClientLink>
    </div>
  )
}

export default Summary
