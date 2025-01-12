import { loadConfig } from "load-balancer/config.ts";
import { initializePool, toUrl } from "load-balancer/server-pool.ts";
import { startLoadBalancer } from "load-balancer/load-balancer.ts";
import {
	type ServerConfig,
	serverSchema,
} from "load-balancer/config-schema.ts";
import { sse } from "load-balancer/sse.ts";
import { cors } from "load-balancer/cors.ts";

const config = await loadConfig();
const serverPool = initializePool(config);
const { routeRequest } = startLoadBalancer(serverPool);

Bun.serve({
	fetch(request) {
		return routeRequest(request);
	},
});

Bun.serve({
	port: 40999,
	async fetch(request) {
		if (request.method === "POST" && request.url.endsWith("/register")) {
			const parsedConfig = await serverSchema.safeParseAsync(
				await request.json(),
			);
			if (parsedConfig.success) {
				const result = serverPool.addServer(parsedConfig.data);
				return result.ok
					? new Response()
					: new Response(result.error, { status: 400 });
			}
			return new Response(
				`Cannot parse config: ${parsedConfig.error.message}`,
				{
					status: 400,
				},
			);
		}

		return new Response("Not Found!", { status: 404 });
	},
});

Bun.serve({
	port: 41234,
	fetch: cors((request) => {
		if (request.method === "GET" && request.url.endsWith("/status")) {
			return new Response(
				JSON.stringify({
					serverPools: [
						{
							id: "pool1",
							name: "Test",
							servers: serverPool.allServers.map((s) => ({
								id: s.id,
								name: s.id,
								status: s.status,
								ip: toUrl(s),
							})),
						},
					],
				}),
			);
		}
		if (request.method === "GET" && request.url.endsWith("/sse")) {
			return sse((enqueue) => {
				const listener = (s: ServerConfig) => {
					enqueue({
						name: "new-server",
						data: {
							id: s.id,
							name: s.id,
							status: "online",
							ip: toUrl(s),
						},
					});
				};

				serverPool.eventEmitter.on("new-server", listener);
				return () => {
					serverPool.eventEmitter.off("new-server", listener);
				};
			});
		}

		return new Response("Not Found!", { status: 404 });
	}),
});
