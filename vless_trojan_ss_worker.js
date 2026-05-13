const TLS下认证可简化 = '芝麻开门';

export default {
	async fetch(request, env) {
		const url = new URL(request.url); if (!路径) { UUID = env.UUID || TLS下认证可简化; 路径 = `/${encodeURIComponent(UUID)}`; }
		try {
			if (url.pathname.startsWith(路径)) {
				if (request.headers.get('Upgrade') === 'websocket') { url.search = url.search.replace(/{colo}/g, request.cf.colo); return await 升级WS请求(url, request.headers.get('sec-websocket-protocol')); }
				return new Response(订阅网页(url.hostname, UUID), { status: 404 });
			}
			return new Response(`Not Found. ${request.cf.country}, ${request.cf.region}, ${request.cf.colo}`, { status: 404 });
		} catch (err) { const obj = err.stack || err; console.log(obj); return new Response(obj, { status: 500 }); }
	},
};
async function 升级WS请求(url, ed) {
	const state = { cancelled: false }; const 协议 = url.pathname.split('/').pop(); const [客户端, WS接口] = Object.values(new WebSocketPair()); WS接口.accept(); WS接口.binaryType = 'arraybuffer';
	WS接口.addEventListener('close', (e) => { state.cancelled = true; }); WS接口.addEventListener('error', (e) => { state.cancelled = true; try { WS接口?.close(); } catch { } });//addEventListener提前
	启动传输管道(WS接口, url, ed, 协议, state).catch(() => { }); return new Response(null, { status: 101, webSocket: 客户端 });
}
async function 启动传输管道(WS接口, url, ed, 协议, state) {
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
		if (state.cancelled) return; let 目标集 = DNS目标集; let 连接成功 = false; const IPs = await 查询反代IP(url); const addrFuncMap = { [VL]: addr_vl, [TR]: addr_tr, [SS]: addr_ss }; const { hostname, port, data, is_udp } = addrFuncMap[协议](数据);
		if (is_udp) {
			if (port !== 53) { throw new Error(`UDP请求只支持DNS解析`); } console.log("DNS over TCP", hostname, port);
		} else {
			目标集 = [{ hostname, port }, ...Array.from(IPs.entries()).slice(0, 30).sort(() => Math.random() - 0.5).slice(0, 10).map(([ip, { 端口, 失败次数 }]) => ({ hostname: ip, port: 端口 || port }))];
			const skip = url.searchParams.get('skip') === 'true'; if (skip) 目标集 = 目标集.slice(1);
		}
		for (const { hostname, port } of 目标集) {
			if (state.cancelled) break; const 项 = IPs.get(hostname);
			try {
				TCP接口 = connect({ hostname, port });
				await Promise.race([TCP接口.opened, new Promise((_, reject) => setTimeout(() => reject(new Error(`连接超时`)), 1000))]);
				连接成功 = true; if (项?.失败次数 > 0) { 项.失败次数 = 0; } break;
			} catch (连接错误) {
				if (TCP接口?.close) { await TCP接口.close().catch(() => { }); } TCP接口 = null;
				if (项 && 项.失败次数 >= 0 && ++项.失败次数 >= 10) { IPs.delete(hostname); console.log("多次连接失败，删除反代:", hostname); }
			}
		}
		if (!连接成功) throw new Error(`无法连接到目标服务器: ${hostname}:${port} - 目标集长度：${目标集.length}`);
		if (协议 === VL) { if (WS接口.readyState === WebSocket.OPEN) WS接口.send(new Uint8Array([0, 0]).buffer) };
		建立传输管道(data, is_udp).catch(() => { });
	}
	async function 建立传输管道(写入初始数据, is_dns) {
		传输数据 = TCP接口.writable.getWriter();
		if (写入初始数据.length > 0) { await 传输数据.write(写入初始数据); }
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
async function 查询反代IP(url) {
	const search = url.search; let cache = cacheMap.get(search); if (!cache) { cache = new IPCache(search); cacheMap.set(search, cache); }
	const IPs = cache.IPs; if (正在刷新) return IPs; const 当前时间 = new Date(); const 分钟差 = (当前时间.getTime() - cache.Time.getTime()) / 60000;
	if (IPs.size >= 15) return IPs; if (IPs.size === 0 && 分钟差 < 2) return IPs; 正在刷新 = true; console.log('初始 IP总量:', IPs.size);
	try {
		(await params_A_AAAA(url.searchParams, 'AAAA')).map(({ hostname, port }) => { IPs.has(hostname) || IPs.set(hostname, { 端口: port, 失败次数: 0 }) }); console.log('AAAA=IP总量:', IPs.size);
		(await params_A_AAAA(url.searchParams, 'A')).map(({ hostname, port }) => { IPs.has(hostname) || IPs.set(hostname, { 端口: port, 失败次数: 0 }) }); console.log('A=IP总量:', IPs.size);
		(await params_TXT(url.searchParams)).map(({ hostname, port }) => { IPs.has(hostname) || IPs.set(hostname, { 端口: port, 失败次数: 0 }) }); console.log('TXT=IP总量:', IPs.size);
		(await params_url(url.searchParams)).map(({ hostname, port }) => { IPs.has(hostname) || IPs.set(hostname, { 端口: port, 失败次数: 0 }) }); console.log('url=IP总量:', IPs.size);
		(await params_ip(url.searchParams)).map(({ hostname, port }) => { IPs.set(hostname, { 端口: port, 失败次数: -1 }) }); console.log('ip=IP数量:', IPs.size);
	}
	catch (error) { console.warn('反代解析失败', error); } finally { console.log('IP', IPs); cache.Time = new Date(); 正在刷新 = false; } return IPs;
}
async function getDnsRecord(domain, type) {
	const apis = [`https://cloudflare-dns.com/dns-query?name=${domain}&type=${type}`, `https://dns.google/resolve?name=${domain}&type=${type}`, `https://223.5.5.5/resolve?name=${domain}&type=${type}`,]; // 仅阿里Question是{}不是[]
	for (const api of apis) {
		try {
			const data = await fetch(api, { headers: { 'Accept': 'application/dns-json' }, signal: AbortSignal.timeout(2000) }).then(r => r.json()); if (!data.Answer) continue;
			const type = Array.isArray(data.Question) ? data.Question[0]?.type : data.Question?.type;
			const ips = data.Answer.filter(r => r.type === type).map(r => r.data); if (ips.length > 0) { return ips; }
		} catch { }
	} return [];
}
function ip_to_obj(ip, port) { ip = ip.trim(); if (/.*:.*:.*/.test(ip)) ip = `[${ip}]`; const u = new URL('url://' + ip); return { hostname: u.hostname, port: +(u.port || port) }; }
async function dns_ip(domain, type) { console.log('dns_ip:', domain, type); const u = new URL('url://' + domain); return (await getDnsRecord(u.hostname, type)).map(ip => ip_to_obj(ip, u.port)) }
async function dns_txt(domain, type) { console.log('dns_txt:', domain, type); const u = new URL('url://' + domain); const txt = (await getDnsRecord(u.hostname, type))[0]; return txt.split(/[\n,"]/).map(v => v.trim()).filter(Boolean).map(ip => ip_to_obj(ip, u.port)) }
async function url_txt(url) { console.log('url_txt:', url); const u = new URL(url); const txt = await fetch(u.href, { signal: AbortSignal.timeout(2000) }).then(r => r.text()); return txt.split(/[\n,"]/).map(v => v.trim()).filter(Boolean).map(ip => ip_to_obj(ip, u.port)) }
async function params_ip(searchParams) { return searchParams.getAll('ip').map(ip => ip_to_obj(ip, 0)); }
async function params_A_AAAA(searchParams, type) { return (await Promise.all(searchParams.getAll(type).map(r => dns_ip(r, type)))).flat(); }
async function params_TXT(searchParams) { return (await Promise.all(searchParams.getAll('TXT').map(r => dns_txt(r, 'TXT')))).flat(); }
async function params_url(searchParams) { return (await Promise.all(searchParams.getAll('url').map(r => url_txt(r)))).flat(); }
class IPCache { constructor(search) { this.Search = search; this.Time = new Date(1986, 9, 1); this.IPs = new Map(); } }
import { connect } from 'cloudflare:sockets'; let 正在刷新 = false, 路径 = null, UUID = null; const cacheMap = new Map(), DNS目标集 = [{ hostname: "8.8.4.4", port: 53 }, { hostname: "1.0.0.1", port: 53 }];
const rev = s => s.split('').reverse().join('').toLowerCase(); const AAAA = rev('344:TeN.SsSsUiLmC.PiYxOrP'), VL = rev('SsElV'), TR = rev('NaJoRt'), SS = rev('sS'), V2 = rev('nIgUlP-yAr2v');
function ws_path(uuid, AAAA) { const v2 = new URL(`url://127.0.0.1:80/${uuid}/pro-to-col`); v2.searchParams.set('AAAA', AAAA); v2.searchParams.set('A', `{colo}.${AAAA}`); return decodeURIComponent(v2.pathname + v2.search); }
function 基础链接1(hostname, path, is_tls, protocol) { const v1 = new URL(`pro-to-col://12345678-1234-1234-1234-123456789012${String.fromCharCode(64)}www.wto.org:${is_tls ? 443 : 80}?security=${is_tls ? 'tls' : 'none'}&sni=${hostname}&fp=chrome&type=ws&host=${hostname}#CF-pro-to-col`); v1.searchParams.set('ech', "cloudflare-ech.com+https://223.5.5.5/dns-query"); v1.searchParams.set('path', path); return v1.href.replace(/pro-to-col/g, protocol); };
function 基础链接2(hostname, path, is_tls, protocol) { const v1 = new URL(`pro-to-col://bm9uZToxMjM0NTY3OC0xMjM0LTEyMzQtMTIzNC0xMjM0NTY3ODkwMTI${String.fromCharCode(64)}www.wto.org:${is_tls ? 443 : 80}#CF-pro-to-col`); v1.searchParams.set('plugin', `${V2};mode=websocket;host=${hostname};path=${path};${is_tls ? 'tls;' : ''}mux=0`); return v1.href.replace(/pro-to-col/g, protocol); };
function 订阅网页(hostname, uuid) { const path = ws_path(uuid, AAAA); return `=== TLS ===\n\n${基础链接1(hostname, path, true, VL)}\n\n${基础链接1(hostname, path, true, TR)}\n\n${基础链接2(hostname, path, true, SS)}\n\n\n=== NO TLS ===\n\n${基础链接1(hostname, path, false, VL)}\n\n${基础链接2(hostname, path, false, SS)}`; }