const 必定要修改VL密钥 = '12345678-1234-1234-1234-123456789012';

export default {
	async fetch(访问请求) {
		const url = new URL(访问请求.url);
		if (访问请求.headers.get('Upgrade') === 'websocket') {
			const ips = url.searchParams.getAll('ip');
			if (ips) {
				const 当前时间 = new Date();
				const 需要刷新缓存 = (反代MAP.size === 0) || (url.search !== 链接SEARCH) || (当前时间.getTime() - 缓存时间.getTime() > 1000 * 60 * 10);//10分钟
				if (需要刷新缓存 && !正在刷新) {
					正在刷新 = true; 链接SEARCH = url.search; 缓存时间 = 当前时间;
					for (const ip of ips) {
						const u = new URL('url://' + ip.replace('colo', 访问请求.cf.colo).toLowerCase());
						try {
							if (isValidDomain(u.hostname)) {
								const dnsRecords = (await Promise.all([
									getDnsRecord(u.hostname, 'A'),
									getDnsRecord(u.hostname, 'AAAA').then(rr => rr.map(r => `[${r}]`)),
								])).flat().sort(() => Math.random() - 0.5);
								dnsRecords.forEach(ip => 反代MAP.has(ip) || 反代MAP.set(ip, { 端口: +u.port || 443, 失败次数: 0 }));
								console.log(u.hostname, '缓存刷新完成', '新IP数量:', dnsRecords.length, '共缓存IP数量:', 反代MAP.size);
								//  [ERROR] Uncaught Error: internal error; reference = e99q54q6ivev4r4t8trolj61 为何？
							} else { 反代MAP.set(u.hostname, { 端口: +u.port || 443, 失败次数: -1 }); }
						} catch (error) { console.error(u.hostname, '刷新缓存失败', error); }
					}
					正在刷新 = false;
				}
			}
			return await 升级WS请求();
		}
		return new Response(`Not Found. ${访问请求.cf.country}, ${访问请求.cf.region}, ${访问请求.cf.colo}`, { status: 404 });
	},
};
async function 升级WS请求() {
	const [客户端, WS接口] = Object.values(new WebSocketPair());
	WS接口.accept();
	WS接口.binaryType = 'arraybuffer';
	WS接口.send(new Uint8Array([0, 0]));
	启动传输管道(WS接口);
	return new Response(null, { status: 101, webSocket: 客户端 });
}
async function 启动传输管道(WS接口) {
	let TCP接口, 传输数据, 首包数据 = true, 处理队列 = Promise.resolve();
	WS接口.addEventListener('message', (event) => {
		处理队列 = 处理队列.then(async () => {
			try {
				if (首包数据) {
					首包数据 = false;
					await 解析VL标头(event.data);
				} else { await 传输数据.write(event.data); }
			} catch (error) { console.log(error.message); WS接口?.close(1000, error.message) }
		});
	});
	async function 解析VL标头(VL数据) {
		if (!check_uuid(_UUID, VL数据.slice(1, 17))) { throw new Error('密钥验证失败'); }
		const 获取数据定位 = new Uint8Array(VL数据)[17];
		const 提取端口索引 = 18 + 获取数据定位 + 1;
		const 建立端口缓存 = VL数据.slice(提取端口索引, 提取端口索引 + 2);
		const 访问端口 = new DataView(建立端口缓存).getUint16(0);
		const 提取地址索引 = 提取端口索引 + 2;
		const 建立地址缓存 = new Uint8Array(VL数据.slice(提取地址索引, 提取地址索引 + 1));
		const 识别地址类型 = 建立地址缓存[0];
		let 长度 = 0, 访问地址 = '', 地址索引 = 提取地址索引 + 1;
		switch (识别地址类型) {
			case 1: 长度 = 4; 访问地址 = new Uint8Array(VL数据.slice(地址索引, 地址索引 + 长度)).join('.'); break;
			case 2: 长度 = new Uint8Array(VL数据.slice(地址索引, 地址索引 + 1))[0]; 地址索引 += 1; 访问地址 = new TextDecoder().decode(VL数据.slice(地址索引, 地址索引 + 长度)); break;
			case 3: 长度 = 16; const dataView = new DataView(VL数据.slice(地址索引, 地址索引 + 长度)); 访问地址 = `[${Array.from({ length: 8 }, (_, i) => dataView.getUint16(i * 2).toString(16)).join(':')}]`; break;
			default: throw new Error('地址类型错误');
		}
		const 目标集 = [[访问地址, 访问端口]];
		Array.from(反代MAP.entries()).slice(0, 30).sort(() => Math.random() - 0.5).slice(0, 10).forEach(([ip地址, { 端口, 失败次数 }]) => { 目标集.push([ip地址, 端口]); });
		for (const [目标地址, 目标端口] of 目标集) {
			try {
				TCP接口 = connect({ hostname: 目标地址, port: 目标端口 });
				await Promise.race([TCP接口.opened, new Promise((_, reject) => setTimeout(() => reject(new Error(`连接超时`)), 2000))]);
				const 项 = 反代MAP.get(目标地址);
				if (项?.失败次数 > 0) 项.失败次数 = 0;
				break;
			} catch (连接错误) {
				const 项 = 反代MAP.get(目标地址);
				if (项 && 项.失败次数 >= 0 && ++项.失败次数 >= 10) {
					反代MAP.delete(目标地址); console.log("多次连接失败，删除反代:", 目标地址);
				}
			}
		}
		建立传输管道(VL数据.slice(地址索引 + 长度));
	}
	async function 建立传输管道(写入初始数据) {
		传输数据 = TCP接口.writable.getWriter();
		if (写入初始数据) { await 传输数据.write(写入初始数据); }
		await TCP接口.readable.pipeTo(
			new WritableStream({
				write(chunk) { WS接口.send(chunk); },
			}),
		);
	}
}
let 链接SEARCH = '', 正在刷新 = false, 缓存时间 = new Date(1986, 9, 1), 反代MAP = new Map();
import { connect } from 'cloudflare:sockets';
const isValidDomain = (hostname) => /^(?:(?:(?:[a-zA-Z0-9][a-zA-Z0-9-_]{0,61})?[a-zA-Z0-9]\.)*(?:xn--)?[a-zA-Z0-9][a-zA-Z0-9-]{0,61}[a-zA-Z0-9]\.(?:xn--)?[a-zA-Z]{2,})$/.test(hostname);
async function getDnsRecord(domain, type) {
	const apis = [
		`https://cloudflare-dns.com/dns-query?name=${domain}&type=${type}`, `https://dns.google/resolve?name=${domain}&type=${type}`,
		`https://223.5.5.5/resolve?name=${domain}&type=${type}`,
	];
	for (const api of apis) {
		try {
			const data = await fetch(api, { headers: { 'Accept': 'application/dns-json' }, signal: AbortSignal.timeout(3000) }).then(r => r.json());
			if (data.Answer) {
				const type = Array.isArray(data.Question) ? data.Question[0]?.type : data.Question?.type;
				const ips = data.Answer.filter(r => r.type === type).map(r => r.data);
				if (ips.length > 0) { return ips; }
			}
		} catch (err) { }
	}
	return [];
}
const uuidToArray = u => u.replace(/-/g, '').match(/.{2}/g).map(byte => parseInt(byte, 16));
const _UUID = uuidToArray(必定要修改VL密钥);
const check_uuid = (a, b) => {
	const x = new Uint8Array(a); const y = new Uint8Array(b);
	for (let i = 0; i < x.length; i++) { if (x[i] !== y[i]) return false; }
	return true;
};