let 哎呀呀这是我的VL密钥 = '12345678-1234-1234-1234-123456789012';

export default {
	async fetch(访问请求) {
		const 读取我的请求标头 = 访问请求.headers.get('Upgrade');
		const url = new URL(访问请求.url);
		if (读取我的请求标头 === 'websocket') {
			if (url.searchParams.has('ip')) {
				const url1 = new URL('url://' + url.searchParams.get('ip'));
				反代IP = url1.hostname;
				反代端口 = url1.port || 443;
				反代MAP.set(url1.hostname, 0);
			}
			if (url.searchParams.has('domain')) {
				const url1 = new URL('url://' + url.searchParams.get('domain').replace('colo', 访问请求.cf.colo).toLowerCase());
				const 当前时间 = new Date();
				const 需要刷新缓存 = (反代MAP.size === 0) || (当前时间 - 缓存时间 > 1000 * 60 * 5) || (url1.hostname !== 反代IP);
				if (需要刷新缓存 && !正在刷新) {
					正在刷新 = true;  // 加锁
					反代IP = url1.hostname;
					反代端口 = url1.port || 443;
					缓存时间 = 当前时间;
					try {
						const dns记录 = await getDnsRecord(url1.hostname, 'A');
						dns记录.map(ip => 反代MAP.set(ip, 0));
						console.log('缓存刷新完成，IP数量:', 反代MAP.size);
					} catch (error) {
						console.error('刷新缓存失败:', error);
					} finally { 正在刷新 = false; }
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
	let TCP接口;
	let 首包数据 = true;
	let 处理队列 = Promise.resolve();
	let 传输数据;

	WS接口.addEventListener('message', (event) => {
		处理队列 = 处理队列.then(async () => {
			try {
				if (首包数据) {
					首包数据 = false;
					await 解析VL标头(event.data);
				} else {
					await 传输数据.write(event.data);
				}
			} catch (error) {
				WS接口?.close(1000, error.message)
			}
		});
	});
	async function 解析VL标头(VL数据) {
		if (验证VL的密钥(new Uint8Array(VL数据.slice(1, 17))) !== 哎呀呀这是我的VL密钥) { throw new Error('密钥验证失败'); }
		const 获取数据定位 = new Uint8Array(VL数据)[17];
		const 提取端口索引 = 18 + 获取数据定位 + 1;
		const 建立端口缓存 = VL数据.slice(提取端口索引, 提取端口索引 + 2);
		const 访问端口 = new DataView(建立端口缓存).getUint16(0);
		const 提取地址索引 = 提取端口索引 + 2;
		const 建立地址缓存 = new Uint8Array(VL数据.slice(提取地址索引, 提取地址索引 + 1));
		const 识别地址类型 = 建立地址缓存[0];
		let 地址长度 = 0;
		let 访问地址 = '';
		let 地址信息索引 = 提取地址索引 + 1;
		switch (识别地址类型) {
			case 1:
				地址长度 = 4;
				访问地址 = new Uint8Array(VL数据.slice(地址信息索引, 地址信息索引 + 地址长度)).join('.');
				break;
			case 2:
				地址长度 = new Uint8Array(VL数据.slice(地址信息索引, 地址信息索引 + 1))[0];
				地址信息索引 += 1;
				访问地址 = new TextDecoder().decode(VL数据.slice(地址信息索引, 地址信息索引 + 地址长度));
				break;
			case 3:
				地址长度 = 16;
				const dataView = new DataView(VL数据.slice(地址信息索引, 地址信息索引 + 地址长度));
				const ipv6 = [];
				for (let i = 0; i < 8; i++) { ipv6.push(dataView.getUint16(i * 2).toString(16)); }
				访问地址 = ipv6.join(':');
				break;
			default: throw new Error('地址类型错误');
		}
		const 写入初始数据 = VL数据.slice(地址信息索引 + 地址长度);

		const 目标集 = [[访问地址, 访问端口]];
		const 随机选取的 = Array.from(反代MAP.entries())
			.slice(0, 20).sort(() => Math.random() - 0.5).slice(0, 10) // 前20个随机选取10个，太多了重试次数也多，等太久
			.forEach(([ip地址, 失败次数]) => { 目标集.push([ip地址, +反代端口 || 访问端口]); });

		for (const [目标地址, 目标端口] of 目标集) {
			try {
				TCP接口 = connect({ hostname: 目标地址, port: 目标端口 });
				await Promise.race([TCP接口.opened, new Promise((_, reject) => setTimeout(() => reject(new Error(`连接超时`)), 2000))]);
				if (反代MAP.has(目标地址)) 反代MAP.set(目标地址, 0);
				break;
			} catch (连接错误) {
				if (!反代MAP.has(目标地址)) continue;
				const 新失败次数 = 反代MAP.get(目标地址) + 1;
				if (新失败次数 >= 10 && 反代MAP.size > 1) {
					反代MAP.delete(目标地址);
					console.log("多次连接失败，删除反代:", 目标地址);
				} else {
					反代MAP.set(目标地址, 新失败次数);
				}
			}
		}
		建立传输管道(写入初始数据);
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

let 反代IP = '';
let 反代域名 = '';
let 反代端口 = 0;
let 反代MAP = new Map();
let 缓存时间 = new Date(1986, 9, 1);
let 正在刷新 = false;

import { connect } from 'cloudflare:sockets';
const 转换密钥格式 = Array.from({ length: 256 }, (_, i) => (i + 256).toString(16).slice(1));
function 验证VL的密钥(a, o = 0) { const h = 转换密钥格式; return `${h[a[o]]}${h[a[o + 1]]}${h[a[o + 2]]}${h[a[o + 3]]}-${h[a[o + 4]]}${h[a[o + 5]]}-${h[a[o + 6]]}${h[a[o + 7]]}-${h[a[o + 8]]}${h[a[o + 9]]}-${h[a[o + 10]]}${h[a[o + 11]]}${h[a[o + 12]]}${h[a[o + 13]]}${h[a[o + 14]]}${h[a[o + 15]]}`; }
async function getDnsRecord(domain, type) {
	const apis = [
		`https://cloudflare-dns.com/dns-query?name=${domain}&type=${type}`,
		`https://dns.google/resolve?name=${domain}&type=${type}`,
		`https://223.5.5.5/resolve?name=${domain}&type=${type}`,
	];
	for (const api of apis) {
		try {
			const response = await fetch(api, { headers: { 'Accept': 'application/dns-json' } });
			const data = await response.json();
			if (data.Answer) {
				const type = Array.isArray(data.Question) ? data.Question[0]?.type : data.Question?.type;
				const ips = data.Answer.filter(r => r.type === type).map(r => r.data);
				if (ips.length > 0) { return ips; }
			}
		} catch (err) { }
	}
	return [];
}