const TLS下认证可简化 = '芝麻开门';

export default {
	async fetch(request, env, ctx) {
		const url = new URL(request.url); if (!路径) { UUID = env.UUID || TLS下认证可简化; 路径 = `/${encodeURIComponent(UUID)}`; }
		if (!url.pathname.startsWith(路径)) return new Response(`Not Found. ${request.cf.country}, ${request.cf.region}, ${request.cf.colo}`, { status: 404 });
		if (request.headers.get('Upgrade') !== 'websocket') return new Response(订阅网页(url.hostname, UUID), { status: 404 });
		DEBUG = url.searchParams.get('debug') === 'true'; url.search = url.search.replace(/{colo}/g, request.cf.colo); const IP缓存 = await 更新IP缓存(url, ctx, 300); return await 升级WS请求(url, request.headers.get('sec-websocket-protocol'), IP缓存);
	},
};
async function 升级WS请求(url, ed, IP缓存) {
	const state = { cancelled: false }; const 协议 = url.pathname.split('/').pop(); const [客户端, WS接口] = Object.values(new WebSocketPair()); WS接口.accept(); WS接口.binaryType = 'arraybuffer';
	WS接口.addEventListener('close', (e) => { state.cancelled = true; }); WS接口.addEventListener('error', (e) => { state.cancelled = true; try { WS接口?.close(); } catch { } });//addEventListener提前
	启动传输管道(WS接口, url, ed, 协议, state, IP缓存).catch(() => { }); return new Response(null, { status: 101, webSocket: 客户端 });
}
async function 启动传输管道(WS接口, url, ed, 协议, state, IP缓存) {
	let TCP接口, 传输数据, 首包数据 = true; const close = (err, source = 'unknown', print = false) => { if (print && err) console.log(`close [${source}]`, err.stack || err); state.cancelled = true; try { TCP接口?.close()?.catch(() => { }); } catch { } try { WS接口?.close(); } catch { } WS接口 = TCP接口 = null; };
	new ReadableStream({
		start(controller) {
			WS接口.addEventListener('message', (e) => { if (state.cancelled) return; try { controller.enqueue(e.data); } catch { } });// if (ed) { controller.enqueue(Uint8Array.fromBase64(ed, { alphabet: 'base64url' }).buffer); }
		},
		cancel() { state.cancelled = true; },
	}).pipeTo(new WritableStream({
		async write(chunk) {
			if (首包数据) {
				首包数据 = false; await 解析标头(chunk);
			} else { if (state.cancelled) return; if (传输数据?.desiredSize == null) return; try { await 传输数据.write(chunk); } catch (err) { close(err, 'write'); } }
		},
	}),).catch(err => close(err, 'pipeTo'));
	async function 解析标头(数据) {
		if (state.cancelled) return; let 目标集 = DNS目标集; let 连接成功 = false; const addrFuncMap = { [VL]: addr_vl, [TR]: addr_tr, [SS]: addr_ss }; const { hostname: HOSTNAME, port: PORT, data, is_udp } = addrFuncMap[协议](数据);
		if (is_udp) {
			if (PORT !== 53) { throw new Error(`UDP请求只支持DNS解析`); } console.log("DNS over TCP", HOSTNAME, PORT);
		} else {
			目标集 = [new Target(HOSTNAME, PORT, 'ip'), ...Array.from(IP缓存.values()).slice(0, 30).sort(() => Math.random() - 0.5).slice(0, 10)];
			const skip = url.searchParams.get('skip') === 'true'; if (skip) 目标集 = 目标集.slice(1);
		}
		for (const { hostname, port } of 目标集) {
			if (state.cancelled) break; const 项 = IP缓存.get(hostname);
			try {
				TCP接口 = connect({ hostname, port: port || PORT });
				await Promise.race([TCP接口.opened, new Promise((_, reject) => setTimeout(() => reject(new Error(`连接超时`)), 1000))]);
				连接成功 = true; 项?.success(); break;
			} catch (连接错误) {
				if (TCP接口?.close) { TCP接口.close().catch(() => { }); } TCP接口 = null;
				if (项?.fail()) { IP缓存.delete(hostname); console.log("多次连接失败，删除反代:", hostname, port); }
			}
		}
		if (!连接成功) throw new Error(`无法连接到目标服务器: ${HOSTNAME}:${PORT} - 目标集长度：${目标集.length}`);
		if (协议 === VL) { if (WS接口.readyState === WebSocket.OPEN) WS接口.send(new Uint8Array([0, 0]).buffer) };
		建立传输管道(data, is_udp).catch(() => { });
	}
	async function 建立传输管道(写入初始数据, is_dns) {
		传输数据 = TCP接口.writable.getWriter(); if (写入初始数据.length > 0) { await 传输数据.write(写入初始数据); }
		const reader = TCP接口.readable.getReader({ mode: 'byob' });
		const BYOB缓冲区大小 = 1024 * 256, 系统最大4KB = 4096, BYOB安全阈值 = BYOB缓冲区大小 - 系统最大4KB;
		let buffer = new ArrayBuffer(BYOB缓冲区大小), offset = 0, lastReadTime = performance.now(); let chunk = null;
		try {
			while (!state.cancelled) {
				const { value, done } = await reader.read(new Uint8Array(buffer, offset, 系统最大4KB)); if (done) break;
				buffer = value.buffer; offset += value.byteLength;
				if (value.byteLength < 系统最大4KB || performance.now() - lastReadTime >= 50 || offset >= BYOB安全阈值) {
					chunk = new Uint8Array(buffer, 0, offset); offset = 0; lastReadTime = performance.now();
				} else { continue; }
				if (WS接口.readyState === WebSocket.OPEN) { WS接口.send(chunk); }
			}
		} catch (e) { close(e, 'pipe transport') } finally { reader.releaseLock(); }
	}
}
function addr_vl(数据) {
	if (数据.byteLength < 26) { throw new Error('数据长度不足'); } const V = new Uint8Array(数据);
	const 提取命令索引 = 18 + V[17]; const cmd = V[提取命令索引];
	const 提取端口索引 = 提取命令索引 + 1; const port = new DataView(数据, 提取端口索引, 2).getUint16(0);
	const 提取地址索引 = 提取端口索引 + 2; let 长度 = 0, hostname = '', 地址索引 = 提取地址索引 + 1;
	switch (V[提取地址索引]) {
		case 1: 长度 = 4; hostname = new Uint8Array(V.subarray(地址索引, 地址索引 + 长度)).join('.'); break;
		case 2: 长度 = V[地址索引]; 地址索引 += 1; hostname = new TextDecoder().decode(V.subarray(地址索引, 地址索引 + 长度)); break;
		case 3: 长度 = 16; const dataView = new DataView(数据, 地址索引, 长度); hostname = `[${Array.from({ length: 8 }, (_, i) => dataView.getUint16(i * 2).toString(16)).join(':')}]`; break;
		default: throw new Error(`地址类型错误`);
	}
	return { hostname, port, data: V.subarray(地址索引 + 长度), is_udp: cmd === 2 };
}
function addr_tr(数据) {
	if (数据.byteLength < 66) { throw new Error('数据长度不足'); } const V = new Uint8Array(数据);
	const 提取命令索引 = 58; const cmd = V[提取命令索引];
	const 提取地址索引 = 提取命令索引 + 1; let 长度 = 0, hostname = '', 地址索引 = 提取地址索引 + 1;
	switch (V[提取地址索引]) {
		case 1: 长度 = 4; hostname = new Uint8Array(V.subarray(地址索引, 地址索引 + 长度)).join('.'); break;
		case 3: 长度 = V[地址索引]; 地址索引 += 1; hostname = new TextDecoder().decode(V.subarray(地址索引, 地址索引 + 长度)); break;
		case 4: 长度 = 16; const dataView = new DataView(数据, 地址索引, 长度); hostname = `[${Array.from({ length: 8 }, (_, i) => dataView.getUint16(i * 2).toString(16)).join(':')}]`; break;
		default: throw new Error(`地址类型错误`);
	}
	const 提取端口索引 = 地址索引 + 长度; const port = new DataView(数据, 提取端口索引, 2).getUint16(0);
	return { hostname, port, data: V.subarray(提取端口索引 + 4), is_udp: cmd === 3 };
}
function addr_ss(数据) {
	if (数据.byteLength < 5) { throw new Error('数据长度不足'); } const V = new Uint8Array(数据);
	const 提取地址索引 = 0; let 长度 = 0, hostname = '', 地址索引 = 提取地址索引 + 1;
	switch (V[提取地址索引]) {
		case 1: 长度 = 4; hostname = new Uint8Array(V.subarray(地址索引, 地址索引 + 长度)).join('.'); break;
		case 3: 长度 = V[地址索引]; 地址索引 += 1; hostname = new TextDecoder().decode(V.subarray(地址索引, 地址索引 + 长度)); break;
		case 4: 长度 = 16; const dataView = new DataView(数据, 地址索引, 长度); hostname = `[${Array.from({ length: 8 }, (_, i) => dataView.getUint16(i * 2).toString(16)).join(':')}]`; break;
		default: throw new Error(`地址类型错误`);
	}
	const 提取端口索引 = 地址索引 + 长度; const port = new DataView(数据, 提取端口索引, 2).getUint16(0);
	return { hostname, port, data: V.subarray(提取端口索引 + 2), is_udp: false };
}
async function 更新IP缓存(url, ctx, ttl) {
	const search = url.search; let cache = IP缓存的映射.get(search); if (cache) { debug_log(`命中IP缓存，size:${cache.size}`); } else { cache = new Map(); IP缓存的映射.set(search, cache); }
	if (cache.size > 0) { return cache; } const ips = await get_ips_by_url(url, ctx, ttl);
	for (const { hostname, port, type } of ips) { if (cache.has(hostname)) continue; cache.set(hostname, new Target(hostname, port, type)); } return cache;
}
async function getDnsRecord(domain, type) {
	const apis = [`https://cloudflare-dns.com/dns-query?name=${domain}&type=${type}`, `https://dns.google/resolve?name=${domain}&type=${type}`, `https://223.5.5.5/resolve?name=${domain}&type=${type}`,]; // 仅阿里Question是{}不是[]
	for (const api of apis) {
		try {
			const data = await fetch(api, { headers: { 'Accept': 'application/dns-json' }, signal: AbortSignal.timeout(2000) }).then(r => r.json()); if (!data.Answer) continue;
			const type = Array.isArray(data.Question) ? data.Question[0]?.type : data.Question?.type; const ips = data.Answer.filter(r => r.type === type).map(r => r.data); if (ips.length > 0) { return ips; }
		} catch { }
	} return [];
}
function ip_to_obj(ip, port, type) { ip = ip.trim(); if (/.*:.*:.*/.test(ip)) ip = `[${ip}]`; const u = new URL('url://' + ip); return { hostname: u.hostname, port: +(u.port || port), type }; }
async function dns_ip(domain, type) { const u = new URL('url://' + domain); return (await getDnsRecord(u.hostname, type)).map(ip => ip_to_obj(ip, u.port, type)) }
async function dns_txt(domain, type) { const u = new URL('url://' + domain); const txt = (await getDnsRecord(u.hostname, type))[0]; return txt.split(/[\n,"]/).map(v => v.trim()).filter(Boolean).map(ip => ip_to_obj(ip, u.port, type)) }
async function url_txt(url) { const u = new URL(url); const txt = await fetch(u.href, { signal: AbortSignal.timeout(2000) }).then(r => r.text()); return txt.split(/[\n,"]/).map(v => v.trim()).filter(Boolean).map(ip => ip_to_obj(ip, u.port, 'url')) }
async function get_ips_by_param(key, value) { switch (key) { case 'ip': return [ip_to_obj(value, 0, 'ip')]; case 'A': return dns_ip(value, 'A'); case 'AAAA': return dns_ip(value, 'AAAA'); case 'TXT': return dns_txt(value, 'TXT'); case 'url': return url_txt(value); default: return null; } }
async function get_ips_by_param_cache(key, value, ctx, ttl = 60) {
	const cache = caches.default; const cacheKey = new Request(`http://localhost/?${key}=${value}`, { method: "GET" }); const cached = await cache.match(cacheKey); if (cached) { const data = await cached.json(); debug_log(`命中DNS缓存，${key}=${value}, length:${data.length}`); return data; }
	const ips = await get_ips_by_param(key, value); if (ips === null) return []; if (ips.length === 0) ttl = 90; console.log(`${key}=${value}, length:${ips.length}, ttl:${ttl}`); const response = new Response(JSON.stringify(ips), { headers: { "Content-Type": "application/json", "Cache-Control": `s-maxage=${ttl}`, }, }); ctx.waitUntil(cache.put(cacheKey, response.clone())); return ips;
}
async function get_ips_by_url(url, ctx, ttl = 60) {
	if (正在刷新) return []; 正在刷新 = true;
	const params = new URL(url).searchParams; const tasks = Array.from(params, ([key, value]) => { return get_ips_by_param_cache(key, value, ctx, ttl).catch(err => { return []; }); }); const ips = (await Promise.all(tasks)).flat();
	正在刷新 = false; return ips;
}
import { connect } from 'cloudflare:sockets'; let 正在刷新 = false, 路径 = null, UUID = null, DEBUG = false; const IP缓存的映射 = new Map(), DNS目标集 = [{ hostname: "8.8.4.4", port: 53 }, { hostname: "1.0.0.1", port: 53 }];
const rev = s => s.split('').reverse().join('').toLowerCase(); const AAAA = rev('344:TeN.SsSsUiLmC.PiYxOrP'), VL = rev('SsElV'), TR = rev('NaJoRt'), SS = rev('sS'), V2 = rev('nIgUlP-yAr2v');
function ws_path(uuid, AAAA) { const v2 = new URL(`url://127.0.0.1:80/${uuid}/pro-to-col`); /*v2.searchParams.set('AAAA', AAAA);*/ v2.searchParams.set('A', `{colo}.${AAAA}`); return decodeURIComponent(v2.pathname + v2.search); }
function 基础链接1(hostname, path, is_tls, protocol) { const v1 = new URL(`pro-to-col://12345678-1234-1234-1234-123456789012${String.fromCharCode(64)}www.wto.org:${is_tls ? 443 : 80}?security=${is_tls ? 'tls' : 'none'}&sni=${hostname}&fp=chrome&type=ws&host=${hostname}#CF-pro-to-col`); v1.searchParams.set('ech', "cloudflare-ech.com+https://223.5.5.5/dns-query"); v1.searchParams.set('path', path); return v1.href.replace(/pro-to-col/g, protocol); };
function 基础链接2(hostname, path, is_tls, protocol) { const v1 = new URL(`pro-to-col://bm9uZToxMjM0NTY3OC0xMjM0LTEyMzQtMTIzNC0xMjM0NTY3ODkwMTI${String.fromCharCode(64)}www.wto.org:${is_tls ? 443 : 80}#CF-pro-to-col`); v1.searchParams.set('plugin', `${V2};mode=websocket;host=${hostname};path=${path};${is_tls ? 'tls;' : ''}mux=0`); return v1.href.replace(/pro-to-col/g, protocol); };
function 订阅网页(hostname, uuid) { const path = ws_path(uuid, AAAA); return `=== TLS ===\n\n${基础链接1(hostname, path, true, VL)}\n\n${基础链接1(hostname, path, true, TR)}\n\n${基础链接2(hostname, path, true, SS)}\n\n\n=== NO TLS ===\n\n${基础链接1(hostname, path, false, VL)}\n\n${基础链接2(hostname, path, false, SS)}`; }
class Target { constructor(hostname, port, type, failCount = 0) { this.hostname = hostname; this.port = port; this.type = type; this.failCount = failCount; this.MAX_FAIL = 10; }; success() { this.failCount /= 3; }; fail() { ++this.failCount; return this.shouldRemove(); }; shouldRemove() { if (this.type === 'ip') return false; return this.failCount >= this.MAX_FAIL; }; }
function debug_log(...data) { if (DEBUG) { console.log(...data); } }