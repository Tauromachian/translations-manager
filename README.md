# Translations Manager

Project build to handle translations. Self host this thing if you like it. Maybe I'll do my own hosting solution.

Take a look at the [demo](https://translations-manager.jose-garcia.net/) to see how it is going.

## Tech Stack

- [Deno](https://deno.land/)
- [Vite](https://vitejs.dev/)
- [Drizzle](https://drizzle-orm.vercel.app/)
- [Express](https://expressjs.com/)
- [Postgres](https://www.postgresql.org/)

Everything else is pure javascript. With heavy use of web components.

## Why another SaaS?

**I dislike doing translations**. I want to spend my time building good software not writing half assed translations that my manager will re-write any way.

So, I thought to myself: How can I make it so I can keep my manager and possibly the owner of the company happy while at the same time I avoid writing translations.

How about a SaaS that returns a JSON that integrates with i18n?

## How does this keeps me, the developer, happy?

- I has to be fast. Nobody likes slow code. 
- i18n compatibility. This should return i18n compatible JSON. Ideally to give it to your preferred i18n library.
- Decent docs, decent API. Usage and integration with my favorite FE or BE should be as easy as possible.
- Versioning of the returned translations. New translations shouldn't break old ones. (No idea how I will implement this)
- Reusable and clonable translations. (Not done)
- Import i18n JSON files. Because I don't hate myself. I want migration to be as easy as possible. (Not done)
- Export i18n JSON files that you can throw into your project instead of calling the API if you so feel like so. (Not done)

## How does this keeps my manager happy?

- He gets a nice GUI to edit the translations.
- He gets translations by project.
- He gets to manage user permissions to said translations. (Not done)

## How does this makes the owner of the company I am working for happy?

- He gets to not spend money paying his developers for something they don't want to do and are unproductive at.
- He gets to save money on pipelines. No need to run them for translations changes.
