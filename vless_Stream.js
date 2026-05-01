const 设置变量和机密UUID优先级高于这 = '12345678-1234-1234-1234-123456789012';

export default {
	async fetch(request, env) {
		if (request.headers.get('Upgrade') === 'websocket') {
			if (!UUID) { UUID = uuidToArray(env.UUID || 设置变量和机密UUID优先级高于这); }
			return await 升级WS请求(request);
		}
		return new Response(`Not Found. ${request.cf.country}, ${request.cf.region}, ${request.cf.colo}`, { status: 404 });
	},
};
async function 升级WS请求(request) {
	const [客户端, WS接口] = Object.values(new WebSocketPair());
	WS接口.accept(); WS接口.binaryType = 'arraybuffer'; WS接口.send(new Uint8Array([0, 0]).buffer); 启动传输管道(WS接口, request);
	return new Response(null, { status: 101, webSocket: 客户端 });
}
async function 启动传输管道(WS接口, request) {
	let TCP接口, 传输数据, 首包数据 = true;
	const close = (err) => { console.log(err); try { TCP接口?.close(); } catch { } try { WS接口.close(); } catch { } };
	new ReadableStream({
		start(controller) {
			WS接口.addEventListener('message', (event) => { controller.enqueue(event.data); });
		},
	}).pipeTo(new WritableStream({
		async write(chunk) {
			if (首包数据) {
				首包数据 = false; await 解析VL标头(chunk, request);
			} else { await 传输数据.write(chunk); }
		},
	}),
	).catch(close);
	async function 解析VL标头(VL数据, request) {
		const { hostname, port, data } = addr(VL数据);
		const IPs = await 查询DNS(request); // 只能在认证通过后才启动DNS解析，否则被DDoS攻击会拖垮DNS
		const 目标集 = [{ hostname, port }, ...Array.from(IPs.entries()).slice(0, 30).sort(() => Math.random() - 0.5).slice(0, 10).map(([ip, { 端口, 失败次数 }]) => ({ hostname: ip, port: 端口 || port }))];
		let 连接成功 = false;
		for (const { hostname, port } of 目标集) {// 目标集的定制可实现固定IP功能
			const 项 = IPs.get(hostname);
			try {
				TCP接口 = connect({ hostname, port });// console.log("目标", hostname, port);
				await Promise.race([TCP接口.opened, new Promise((_, reject) => setTimeout(() => reject(new Error(`连接超时`)), 1500))]);
				连接成功 = true; if (项?.失败次数 > 0) { 项.失败次数 = 0; } break;
			} catch (连接错误) {// console.log("删除反代:", hostname, 目标集);
				if (项 && 项.失败次数 >= 0 && ++项.失败次数 >= 10) { IPs.delete(hostname); console.log("多次连接失败，删除反代:", hostname); }
			}
		}
		if (!连接成功) throw new Error(`无法连接到目标服务器: ${hostname}:${port} - 目标集长度：${目标集.length}`);
		建立传输管道(data);
	}
	async function 建立传输管道(写入初始数据) {
		传输数据 = TCP接口.writable.getWriter();
		if (写入初始数据.length > 0) { await 传输数据.write(写入初始数据); }
		await TCP接口.readable.pipeTo(
			new WritableStream({
				write(chunk) { (WS接口.readyState === WebSocket.OPEN) && WS接口.send(chunk); },
			}),
		);
	}
}
function addr(VL数据) {
	if (VL数据.byteLength < 24) { throw new Error('数据长度不足'); }
	const V = new Uint8Array(VL数据);
	if (!check_uuid(UUID, V.subarray(1, 17))) { throw new Error('密钥验证失败'); }
	const 提取端口索引 = 18 + V[17] + 1; // 跳过了cmd
	const port = new DataView(VL数据, 提取端口索引, 2).getUint16(0);
	const 提取地址索引 = 提取端口索引 + 2;
	let 长度 = 0, hostname = '', 地址索引 = 提取地址索引 + 1;
	switch (V[提取地址索引]) {
		case 1: 长度 = 4; hostname = new Uint8Array(V.subarray(地址索引, 地址索引 + 长度)).join('.'); break;
		case 2: 长度 = V[地址索引]; 地址索引 += 1; hostname = new TextDecoder().decode(V.subarray(地址索引, 地址索引 + 长度)); break;
		case 3: 长度 = 16; const dataView = new DataView(VL数据, 地址索引, 长度); hostname = `[${Array.from({ length: 8 }, (_, i) => dataView.getUint16(i * 2).toString(16)).join(':')}]`; break;
		default: throw new Error(`地址类型错误`);
	}
	return { hostname, port, data: V.subarray(地址索引 + 长度) };
}
async function 查询DNS(request) {
	const url = new URL(request.url); const search = url.search;
	let cache = cacheMap.get(search); if (!cache) { cache = new IPCache(search); cacheMap.set(search, cache); }
	const IPs = cache.IPs; if (正在刷新) return IPs;
	const ips = url.searchParams.getAll('ip'); if (ips.length === 0) return IPs;
	const 当前时间 = new Date(); const 分钟差 = (当前时间.getTime() - cache.Time.getTime()) / 60000;
	if (IPs.size >= 30 || 分钟差 <= 10) return IPs; // 有效缓存太多，或时间太近都不查询
	正在刷新 = true;
	try {
		for (const ip of ips) {
			const u = new URL('url://' + ip.replace('colo', request.cf.colo).toLowerCase());
			try {
				if (isIP(u.hostname)) {
					console.log(u.hostname, '直接记录DNS缓存'); IPs.delete(u.hostname); IPs.set(u.hostname, { 端口: +u.port, 失败次数: -1 }); // 通过删除移动到最后
				} else {
					console.log(u.hostname, '正在刷新DNS缓存...');
					const dnsRecords = (await Promise.all([
						getDnsRecord(u.hostname, 'A'), getDnsRecord(u.hostname, 'AAAA').then(rr => rr.map(r => `[${r}]`)),
					])).flat().sort(() => Math.random() - 0.5);
					dnsRecords.forEach(ip => IPs.has(ip) || IPs.set(ip, { 端口: +u.port, 失败次数: 0 }));
					console.log(u.hostname, 'DNS缓存刷新完成', '新IP数量:', dnsRecords.length, '共缓存IP数量:', IPs.size);
				}
			} catch (error) { console.error(u.hostname, '刷新DNS缓存失败', error); }
		}
		cache.Time = new Date();
	}
	catch (error) { console.error('DNS解析失败', error); }
	finally { 正在刷新 = false; } return IPs;
}
async function getDnsRecord(domain, type) {
	const apis = [
		`https://cloudflare-dns.com/dns-query?name=${domain}&type=${type}`, `https://dns.google/resolve?name=${domain}&type=${type}`,
		`https://223.5.5.5/resolve?name=${domain}&type=${type}`, // 仅阿里Question是{}不是[]
	];
	for (const api of apis) {
		try {
			const data = await fetch(api, { headers: { 'Accept': 'application/dns-json' }, signal: AbortSignal.timeout(3000) }).then(r => r.json());
			if (!data.Answer) continue;
			const type = Array.isArray(data.Question) ? data.Question[0]?.type : data.Question?.type;
			const ips = data.Answer.filter(r => r.type === type).map(r => r.data); if (ips.length > 0) { return ips; }
		} catch (err) { }
	}
	return [];
}
class IPCache { constructor(search) { this.Search = search; this.Time = new Date(1986, 9, 1); this.IPs = new Map(); } }
const isIP = (ip) => /^(\d{1,3}\.){3}\d{1,3}$/.test(ip) || ip.startsWith('[');
const check_uuid = (a, b) => { const x = new Uint8Array(a); const y = new Uint8Array(b); for (let i = 0; i < x.length; i++) { if (x[i] !== y[i]) return false; } return true; };
const uuidToArray = u => u.replace(/-/g, '').match(/.{2}/g).map(byte => parseInt(byte, 16));
let 正在刷新 = false, UUID = null, cacheMap = new Map();
import { connect } from 'cloudflare:sockets';