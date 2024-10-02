"use server"

import { revalidateTag } from "next/cache"
import { listRegions, updateCart } from "@/lib/data"

import { Region } from "@medusajs/medusa"
/**
 * Revalidates each cache tag in the passed array
 * @param {string[]} tags - array of tags to revalidate
 */
export async function revalidateTags(tags: string[]) {
  tags.forEach((tag) => {
    revalidateTag(tag)
  })
}

export async function getRegion(countryCode: string) {
  try {
    const regions = await listRegions()

    if (!regions) {
      return null
    }

    const regionMap = new Map<string, Region>()

    regions.forEach((region) => {
      region.countries.forEach((c) => {
        regionMap.set(c.iso_2, region)
      })
    })

    const region = countryCode
      ? regionMap.get(countryCode)
      : regionMap.get("us")

    return region
  } catch (e: any) {
    console.log(e.toString())
    return null
  }
}