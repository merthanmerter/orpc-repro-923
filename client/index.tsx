import { createORPCClient } from "@orpc/client";
import { RPCLink } from "@orpc/client/fetch";
import type { RouterClient } from "@orpc/server";
import {
	createTanstackQueryUtils,
	type ProcedureUtils,
} from "@orpc/tanstack-query";
import type { router } from "@server/index";
import { useQuery } from "@tanstack/react-query";

const link = new RPCLink({
	url: "http://localhost:3000/api/rpc",
});

export const orpc: RouterClient<typeof router> = createORPCClient(link);
export const orpcClient = createTanstackQueryUtils(orpc);

export default async function Client() {
	const procedure = orpcClient.planet.find;

	const query1 = useQuery(
		procedure.queryOptions({
			input: { id: "1" },
		}),
	);

	const query2 = useQuery<Q<typeof procedure.call>>(
		procedure.queryOptions({
			input: { id: "1" },
		}),
	);

	const orpcQuery = useOrpcQuery(orpcClient.planet.find, {
		input: { id: "1" },
	});

	if (query1.isSuccess) {
		// @ts-expect-error
		return <div>Success: {query1.data.id}</div>;
	}

	if (query2.isSuccess) {
		return <div>Success: {query2.data.id}</div>;
	}

	if (orpcQuery.isSuccess) {
		return <div>Success: {orpcQuery.data.id}</div>;
	}

	return <div>Client</div>;
}

// biome-ignore lint/suspicious/noExplicitAny: Any
type Q<T extends (...args: any[]) => any> = Awaited<ReturnType<T>>;
// biome-ignore lint/suspicious/noExplicitAny: Any
function useOrpcQuery<T extends ProcedureUtils<any, any, any, any>>(
	procedure: T,
	options: Parameters<T["queryOptions"]>[0],
) {
	return useQuery<Q<T["call"]>>(procedure.queryOptions(options));
}
