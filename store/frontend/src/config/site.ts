/**
 * Locale-independent site constants.
 *
 * Deliberately free of imports: this module is reached from client components,
 * so pulling in the environment schema here would ship the validation library
 * to every route.
 */
export const siteConfig = {
  name: "Nuvora",
} as const;