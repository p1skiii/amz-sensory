import { getCollection, type CollectionEntry } from "astro:content";

export type CoffeeEntry = CollectionEntry<"coffees">;

export async function getAllCoffees(): Promise<CoffeeEntry[]> {
  const coffees = await getCollection("coffees");
  return coffees.toSorted((a, b) => a.data.order - b.data.order);
}

export async function getCoffeeBySlug(slug: string): Promise<CoffeeEntry | undefined> {
  const coffees = await getAllCoffees();
  return coffees.find(coffee => coffee.data.slug === slug);
}
