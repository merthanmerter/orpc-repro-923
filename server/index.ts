import { ORPCError, os as orpcServer } from "@orpc/server";

import * as z from "zod";

const os = orpcServer.$context<{
	session: {
		id: string;
	};
}>();

const listPlanet = os
	.input(
		z.object({
			limit: z.number().int().min(1).max(100).optional(),
			cursor: z.number().int().min(0).default(0),
		}),
	)
	.handler(async ({ input }) => {
		// your list code here
		return [{ id: 1, name: "name", input }];
	});

const findPlanet = os
	.input(z.object({ id: z.string() }))
	.output(z.object({ id: z.number(), name: z.string(), input: z.any() }))
	.handler(async ({ input }) => {
		// your find code here
		return { id: 1, name: "name", input };
	});

const createPlanet = os
	.use(({ context, next }) => {
		const user = context.session?.id;

		if (user) {
			return next({ context: { user } });
		}

		throw new ORPCError("UNAUTHORIZED");
	})
	.input(z.object({ name: z.string() }))
	.handler(async ({ input, context }) => {
		// your create code here
		return { id: 1, name: "name", input, context };
	});

export const router = {
	planet: {
		list: listPlanet,
		find: findPlanet,
		create: createPlanet,
	},
};

// import { createORPCClient } from "@orpc/client";
// import { RPCLink } from "@orpc/client/fetch";
// import { RPCHandler } from "@orpc/server/fetch";
// import { createTanstackQueryUtils } from "@orpc/tanstack-query";
// import { useQuery } from "@tanstack/react-query";
// import { type RouterClient } from "@orpc/server";
// export const rpcHandler = new RPCHandler(router);

// const link = new RPCLink({
// 	url: "http://localhost:3000/api/rpc",
// });

// export const orpc: RouterClient<typeof router> = createORPCClient(link);
// export const orpcClient = createTanstackQueryUtils(orpc);

// const query = useQuery(
// 	orpcClient.planet.find.queryOptions({
// 		input: { id: "1" },
// 	}),
// );

// query.data?.id;
