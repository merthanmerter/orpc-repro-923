import { createORPCClient } from "@orpc/client";
import { RPCLink } from "@orpc/client/fetch";
import type { RouterClient } from "@orpc/server";
import { createTanstackQueryUtils } from "@orpc/tanstack-query";
import type { router } from "@server/index";
import { useQuery } from "@tanstack/react-query";

const link = new RPCLink({
	url: "http://localhost:3000/api/rpc",
});

export const orpc: RouterClient<typeof router> = createORPCClient(link);
export const orpcClient = createTanstackQueryUtils(orpc);

export default async function Client() {
	const procedure = orpcClient.planet.find;

	const query = useQuery(
		procedure.queryOptions({
			input: { id: "1" },
		}),
	);

	if (query.isSuccess) {
		return <div>Success: {query.data.id}</div>;
	}

	return <div>Client</div>;
}
