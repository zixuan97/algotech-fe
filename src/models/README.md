## How to update types according to Prisma
### author: Daniel Ong

I've installed a NPM tool for creating Typescript interfaces from the `schema.prisma` file: @kalissaac/prisma-typegen

If I have time, I'll create a script for automatically updating the `types.js` file; otherwise this will have to do for now.

Steps to follow:
1. Copy the `schema.prisma` file from the backend into `/src/models`
2. Run the following commmand: `npx @kalissaac/prisma-typegen ./src/models/types ./src/models/schema.prisma`
3. Copy the output from the `index.ts` file and transfer it into the `types.ts` file
4. Delete the output folder and the schema.prisma, and perform other cleanups if necessary

Things to note:
- Do remember to delete any sensitive information that won't be passed by the backend.
	For e.g. the password field of User is not being sent over from the backend, so we should delete it.

