// ECH配置
const ECH_SNI = "cloudflare-ech.com";
const ECH_DNS = "https://dns.alidns.com/dns-query";

// 提交到仓库时用
const HOME_GITHUB = "https://raw.githubusercontent.com/wukan1986/cf-nodes-aggregator/main/home.html";
const LINK_GITHUB = "https://raw.githubusercontent.com/wukan1986/cf-nodes-aggregator/main/link.html";
// 本地测试访问127.0.0.1时使用，可本地执行http-server，开启服务
const HOME_LOCAL = "http://127.0.0.1:8080/home.html";
const LINK_LOCAL = "http://127.0.0.1:8080/link.html";
/**
 * 地区名称映射 (全球主要 Cloudflare 节点所在国家/地区)
 */
const REGION_MAP = {
	// 亚太地区 (Asia Pacific)
	'JP': '日本', 'KR': '韩国', 'SG': '新加坡', 'HK': '香港', 'TW': '台湾',
	'MY': '马来西亚', 'TH': '泰国', 'VN': '越南', 'PH': '菲律宾', 'ID': '印尼',
	'IN': '印度', 'AU': '澳大利亚', 'NZ': '新西兰', 'KH': '柬埔寨', 'MO': '澳门',
	'BD': '孟加拉', 'PK': '巴基斯坦', 'NP': '尼泊尔', 'MN': '蒙古', 'LK': '斯里兰卡',
	'LA': '老挝', 'BN': '文莱', 'MM': '缅甸', 'BT': '不丹', 'MV': '马尔代夫',
	'AF': '阿富汗', 'TJ': '塔吉克斯坦', 'TM': '土库曼斯坦', 'TL': '东帝汶', 'FJ': '斐济',
	'PG': '巴布亚新几内亚', 'SB': '所罗门群岛', 'VU': '瓦努阿图', 'WS': '萨摩亚', 'TO': '汤加',
	'TV': '图瓦卢', 'KI': '基里巴斯', 'MH': '马绍尔群岛', 'FM': '密克罗尼西亚', 'PW': '帕劳',
	'NR': '瑙鲁', 'CK': '库克群岛', 'NU': '纽埃', 'NC': '新喀里多尼亚', 'PF': '法属波利尼西亚',
	'MP': '北马里亚纳群岛', 'AS': '美属萨摩亚', 'IO': '英属印度洋领地', 'CC': '科科斯群岛',
	'CX': '圣诞岛', 'NF': '诺福克岛', 'TK': '托克劳', 'WF': '瓦利斯和富图纳', 'PN': '皮特凯恩群岛',
	'UM': '美国本土外小岛屿',

	// 北美洲 (North America)
	'US': '美国', 'CA': '加拿大', 'MX': '墨西哥', 'PR': '波多黎各', 'GU': '关岛',
	'PM': '圣皮埃尔和密克隆', 'BM': '百慕大', 'GL': '格陵兰',

	// 欧洲 (Europe)
	'GB': '英国', 'UK': '英国', 'DE': '德国', 'FR': '法国', 'NL': '荷兰', 'IT': '意大利',
	'ES': '西班牙', 'PT': '葡萄牙', 'RU': '俄罗斯', 'UA': '乌克兰', 'PL': '波兰',
	'SE': '瑞典', 'FI': '芬兰', 'NO': '挪威', 'DK': '丹麦', 'IS': '冰岛',
	'IE': '爱尔兰', 'BE': '比利时', 'LU': '卢森堡', 'CH': '瑞士', 'AT': '奥地利',
	'CZ': '捷克', 'HU': '匈牙利', 'RO': '罗马尼亚', 'BG': '保加利亚', 'GR': '希腊',
	'TR': '土耳其', 'HR': '克罗地亚', 'RS': '塞尔维亚', 'SI': '斯洛文尼亚', 'SK': '斯洛伐克',
	'EE': '爱沙尼亚', 'LV': '拉脱维亚', 'LT': '立陶宛', 'MD': '摩尔多瓦', 'AL': '阿尔巴尼亚',
	'BA': '波黑', 'ME': '黑山', 'MK': '北马其顿', 'CY': '塞浦路斯', 'MT': '马耳他',
	'BY': '白俄罗斯', 'GE': '格鲁吉亚', 'AM': '亚美尼亚', 'AZ': '阿塞拜疆', 'LI': '列支敦士登',
	'AD': '安道尔', 'MC': '摩纳哥', 'SM': '圣马力诺', 'VA': '梵蒂冈', 'FO': '法罗群岛',
	'GI': '直布罗陀', 'IM': '马恩岛', 'JE': '泽西岛', 'GG': '根西岛', 'AX': '奥兰群岛',
	'SJ': '斯瓦尔巴和扬马延',

	// 南美洲 (South America)
	'BR': '巴西', 'AR': '阿根廷', 'CL': '智利', 'CO': '哥伦比亚', 'PE': '秘鲁',
	'EC': '厄瓜多尔', 'UY': '乌拉圭', 'PY': '巴拉圭', 'VE': '委内瑞拉', 'BO': '玻利维亚',
	'GY': '圭亚那', 'SR': '苏里南', 'FK': '福克兰群岛', 'GF': '法属圭亚那', 'GS': '南乔治亚和南桑威奇群岛',

	// 中美洲与加勒比 (Central America & Caribbean)
	'PA': '巴拿马', 'CR': '哥斯达黎加', 'GT': '危地马拉', 'HN': '洪都拉斯', 'SV': '萨尔瓦多',
	'NI': '尼加拉瓜', 'JM': '牙买加', 'DO': '多米尼加', 'BS': '巴哈马', 'TT': '特立尼达多巴哥',
	'BB': '巴巴多斯', 'CW': '库拉索', 'BZ': '伯利兹', 'DM': '多米尼克', 'GD': '格林纳达',
	'KN': '圣基茨和尼维斯', 'LC': '圣卢西亚', 'VC': '圣文森特和格林纳丁斯', 'HT': '海地',
	'CU': '古巴', 'AW': '阿鲁巴', 'BQ': '荷兰加勒比区', 'SX': '荷属圣马丁', 'MF': '法属圣马丁',
	'BL': '圣巴泰勒米', 'AI': '安圭拉', 'KY': '开曼群岛', 'TC': '特克斯和凯科斯群岛',
	'VG': '英属维尔京群岛', 'VI': '美属维尔京群岛', 'MS': '蒙特塞拉特', 'AG': '安提瓜和巴布达',

	// 中东与非洲 (Middle East & Africa)
	'ZA': '南非', 'EG': '埃及', 'MA': '摩洛哥', 'DZ': '阿尔及利亚', 'TN': '突尼斯',
	'NG': '尼日利亚', 'KE': '肯尼亚', 'GH': '加纳', 'TZ': '坦桑尼亚', 'UG': '乌干达',
	'MU': '毛里求斯', 'RE': '留尼汪', 'AO': '安哥拉', 'MZ': '莫桑比克', 'SN': '塞内加尔',
	'AE': '阿联酋', 'SA': '沙特', 'IL': '以色列', 'QA': '卡塔尔', 'BH': '巴林',
	'KW': '科威特', 'OM': '阿曼', 'JO': '约旦', 'LB': '黎巴嫩', 'IQ': '伊拉克',
	'KZ': '哈萨克斯坦', 'UZ': '乌兹别克斯坦', 'KG': '吉尔吉斯斯坦', 'SY': '叙利亚',
	'YE': '也门', 'IR': '伊朗', 'PS': '巴勒斯坦', 'MR': '毛里塔尼亚', 'ML': '马里', 'NE': '尼日尔',
	'TD': '乍得', 'SD': '苏丹', 'SS': '南苏丹', 'ER': '厄立特里亚', 'DJ': '吉布提', 'SO': '索马里',
	'ET': '埃塞俄比亚', 'CV': '佛得角', 'GW': '几内亚比绍', 'GM': '冈比亚', 'GN': '几内亚',
	'SL': '塞拉利昂', 'LR': '利比里亚', 'CI': '科特迪瓦', 'BF': '布基纳法索', 'TG': '多哥',
	'BJ': '贝宁', 'CM': '喀麦隆', 'CF': '中非', 'GQ': '赤道几内亚', 'GA': '加蓬',
	'CG': '刚果共和国', 'CD': '刚果民主共和国', 'ST': '圣多美和普林西比', 'RW': '卢旺达',
	'BI': '布隆迪', 'ZM': '赞比亚', 'MW': '马拉维', 'ZW': '津巴布韦', 'BW': '博茨瓦纳',
	'NA': '纳米比亚', 'LS': '莱索托', 'SZ': '斯威士兰', 'MG': '马达加斯加', 'KM': '科摩罗',
	'SC': '塞舌尔', 'YT': '马约特', 'SH': '圣赫勒拿', 'EH': '西撒哈拉',

	// 南极洲与其他偏远岛屿 (Antarctica & Other Islands)
	'AQ': '南极洲', 'TF': '法属南部领地', 'BV': '布韦岛', 'HM': '赫德岛和麦克唐纳群岛'
};

// 简化版 YAML 处理器
class SimpleYAML {
	static stringify(obj, indent = 0) {
		const lines = [];
		let line = null;

		function process(value, currentIndent) {
			if (Array.isArray(value)) {
				for (const [index, item] of value.entries()) {
					if (typeof item === 'object' && item !== null) {
						// lines.push(' '.repeat(currentIndent) + '-');
						line = ' '.repeat(currentIndent) + '-';
						process(item, currentIndent + 2);
					} else {
						lines.push(' '.repeat(currentIndent) + '- ' + item);
					}
				}
			} else if (typeof value === 'object' && value !== null) {
				for (const [key, val] of Object.entries(value)) {
					if (val === null || val === undefined) {
						lines.push(' '.repeat(currentIndent) + key + ': null');
					} else if (typeof val === 'object') {
						lines.push(' '.repeat(currentIndent) + key + ':');
						process(val, currentIndent + 2);
					} else if (typeof val === 'string') {
						// 简单字符串转义
						const needsQuotes = val.includes(':') || val.includes('#') ||
							val.startsWith(' ') || val.endsWith(' ');
						lines.push(' '.repeat(currentIndent) + key + ': ' +
							(needsQuotes ? `"${val}"` : val));
					} else if (typeof val === 'boolean') {
						lines.push(' '.repeat(currentIndent) + key + ': ' + val);
					} else {
						lines.push(' '.repeat(currentIndent) + key + ': ' + val);
					}
					if (line) {
						// - 不单独成行
						lines[lines.length - 1] = line + lines.at(-1).slice(line.length);
						line = null;
					}
				}
			}
		}

		process(obj, indent);
		return lines.join('\n');
	}
}

// 超时缓存装饰器
function withTimeoutCache(fn, options = {}) {
	const {
		maxSize = 100,
		ttl = 0,
		serialize = JSON.stringify, // 自定义序列化函数
	} = options;

	const cache = new Map();

	return async function (...args) {
		const key = serialize ? serialize(args) : JSON.stringify(args);
		const now = Date.now();

		// 检查缓存
		if (cache.has(key)) {
			const item = cache.get(key);
			// 检查过期
			if (ttl > 0 && now - item.timestamp > ttl) {
				cache.delete(key);
			} else {
				// // 更新使用顺序
				// cache.delete(key);
				// cache.set(key, {
				// 	value: item.value,
				// 	timestamp: now
				// });
				return item.value;
			}
		}
		// 计算/获取结果
		const result = await fn.apply(this, args);
		// 清理过期缓存（如果 TTL 启用）
		if (ttl > 0 && cache.size > 0) {
			cleanupSomeExpired(cache, ttl, now, 5); // 每次最多清理5个
		}
		// 如果超过最大大小，删除最久未使用的
		if (cache.size >= maxSize) {
			const oldestKey = cache.keys().next().value;
			cache.delete(oldestKey);
		}
		// 存入缓存
		cache.set(key, {
			value: result,
			timestamp: now
		});

		return result;
	};
}
function cleanupSomeExpired(cache, ttl, now, maxCount) {
	let cleaned = 0;
	for (const [key, item] of cache.entries()) {
		if (now - item.timestamp > ttl) {
			cache.delete(key);
			cleaned++;
			if (cleaned >= maxCount) break;
		}
	}
}

// 创建URL和选项。为_ua参数
function make_url_options(url, options = {}) {
	if (!url) return '';
	const _url = new URL(url);
	const _ua = _url.searchParams.get('_ua');
	if (_ua) {
		_url.searchParams.delete('_ua');
		if (options.headers) {
			options.headers = { ...options.headers, 'User-Agent': _ua };
		} else {
			options.headers = { 'User-Agent': _ua };
		}
		console.log('make_url_options', _url.href, options);
	}

	return [_url.href, options];
}

async function fetch_url(url, options = {}) {
	if (!url) return '';

	console.log('fetching', url, options);

	return await fetch(url, options).then(res => res.text());
}

const cached_fetch_30 = withTimeoutCache(fetch_url, { maxSize: 10, ttl: 1000 * 30 });

function parse_hostname_item(line) {
	// 支持从vless提取hostname, 也支持从`127.0.0.1:443#备注`提取hostname
	const url = new URL(line.includes('://') ? line : "https://" + line);
	const hostname = url.hostname;
	const hash = decodeURIComponent(url.hash ? url.hash.substring(1) : ''); // 去掉#
	const port = url.port; // 没写就为空
	return { hostname, port, hash };
}

function parse_hostname_text(content) {
	if (!content) return [];

	const processedContent = content.includes(',') && !content.includes('\n')
		? content.replace(/,/g, '\n')
		: content;

	return processedContent
		.split('\n')
		.map(line => line.trim())
		.filter(line => line)
		.map(line => parse_hostname_item(line));
}

function group_hostnames_by_hash(hostnames) {
	const grouped = Object.groupBy(hostnames, item => item.hash);
	// 返回的是对象，键是hash值，值是数组
	// 如果需要Map格式，可以转换
	return new Map(Object.entries(grouped));
}

function 生成地址列表(addresses) {
	return addresses.map(({ hostname, port, hash, remark }) =>
		port ? `${hostname}:${port}#${remark}` : `${hostname}#${remark}`
	);
}

async function handle_fetch(url) {
	// 以下是有区别的
	// http://127.0.0.1:8787/fetch?url=http://httpbin.org/get?_ua=clash
	// http://127.0.0.1:8787/fetch?url=http://httpbin.org/get&_ua=clash
	const targetUrl = url.searchParams.get('url');
	if (!targetUrl) {
		return new Response('Missing url parameter', { status: 400 });
	}
	const resp = await fetch(...make_url_options(targetUrl, { signal: AbortSignal.timeout(15000) }));
	return new Response(resp.body, { status: resp.status, statusText: resp.statusText, headers: resp.headers });
}


// 解码：Latin-1字符串 -> UTF-8字节 -> 正常字符串
const decodeGarbledText = s => new TextDecoder().decode(Uint8Array.from(s, c => c.charCodeAt()));
// 编码：字符串 -> UTF-8字节 -> Latin-1字符串
const encodeToGarbled = s => new TextEncoder().encode(s).reduce((str, byte) => str + String.fromCharCode(byte), '');


function 更新协议链接(url, hostname, port, hash) {
	if (url.startsWith('vmess://')) {
		// vmess
		const config = JSON.parse(atob(url.substring(8)));
		config.add = hostname;
		config.port = port ? port : config.tls === 'tls' ? '443' : '80';
		config.ps = encodeToGarbled(`${config.id.slice(0, 4)}|${hash}`);
		return 'vmess://' + btoa(JSON.stringify(config, null, 0));
	}
	else {
		// vless/trojan/ss
		const url1 = new URL(url);
		const uuid = url1.username;
		const security = url1.searchParams.get('security');
		url1.hostname = hostname;
		url1.port = port ? port : security === 'tls' ? 443 : 80;
		url1.hash = `${uuid.slice(0, 4)}|${hash}`;
		return url1.href;
	}
}

function 调整协议链接(url) {
	return url;
	// TODO: clash转换由自己处理了，没必要加标记了

	if (url.startsWith('vmess://'))
		return url;

	const url1 = new URL(url);
	const path = url1.searchParams.get('path');
	if (!path) return url;
	const url2 = new URL(decodeURIComponent(path), "http://127.0.0.1");
	const ech = url1.searchParams.get('ech');
	if (ech) {
		// path中加ech=1
		url2.searchParams.set('ech', '1');
	}
	else {
		url2.searchParams.delete('ech');
	}
	url1.searchParams.set('path', url2.pathname + url2.search + url2.hash);
	return url1.href;
}

function 更新链接列表(addresses, nodes) {
	if (nodes.length === 0) return [];
	if (addresses.length === 0) return nodes;
	return addresses.map(({ hostname, port, hash, remark }, i) => {
		const url = nodes[i % nodes.length];
		return 更新协议链接(url, hostname, port, remark);
	});
}

function 调整链接列表(links) {
	return links.map(i => 调整协议链接(i));
}

function hostnames_limit_region(region_hostname, limit_region) {
	const regionMap = new Map();
	for (const [limit, region] of limit_region) {
		const hostnames_part = region_hostname.get(region);
		if (!hostnames_part) {
			regionMap.set(region, []);
		} else {
			const name = REGION_MAP[region] || '未知地区';
			// IP不随机
			const shuffled = Array.from(hostnames_part)//.sort(() => Math.random() - 0.5);
			const limitedList = shuffled.slice(0, limit).map((item, index) => ({ ...item, remark: `${item.hash} ${name} ${index + 1}` }));
			regionMap.set(region, limitedList);
		}
	}
	return [...regionMap.values()].flat();
}

function hostnames_limit(hostnames, limit) {
	// 域名随机
	const shuffled = Array.from(hostnames).sort(() => Math.random() - 0.5);
	return shuffled.slice(0, limit).map((item, index) => ({ ...item, remark: `${item.hash} ${index + 1}` }));
}

function 生成订阅链接(url, target, convert_url, config_url) {
	const new_url = new URL(convert_url + "/sub?target=" + target + "&insert=false&emoji=false&list=false&tfo=false&scv=true&fdn=false&sort=false&new_name=true");
	new_url.searchParams.set('url', url);
	new_url.searchParams.set('config', config_url);
	return new_url;
}

function 生成服务链接(url, nodes, hostnames, region, limit, format) {
	const new_url = new URL(url);
	new_url.pathname = '/' + format;
	if (nodes) new_url.searchParams.set('nodes', nodes);
	if (hostnames) {
		new_url.searchParams.set('nodes', hostnames);
		if (region) new_url.searchParams.set('region', region);
		if (limit) new_url.searchParams.set('limit', limit);
	}
	return new_url;
}

function 生成补丁链接(url1, format, url2) {
	const new_url = new URL(url1);
	new_url.pathname = '/' + format;
	new_url.searchParams.set('url', url2);
	return new_url;
}

function add_ech_to_clash(yamlString) {
	// 注意：这代码只支持subconverter {}风格的处理，不支持yaml格式
	return yamlString.replace(
		/(ws-opts.*?ech=1.*?)(}})(?![^}]*ech-opts)/g,
		`$1}}, ech-opts: {enable: true, query-server-name: ${ECH_SNI}}`
	);
}

function add_ech_to_singbox(jsonString) {
	let config = JSON.parse(jsonString);
	config.outbounds.forEach(outbound => {
		// 检查是否有transport配置且path中包含ech=1
		if (outbound.transport &&
			outbound.transport.path &&
			outbound.transport.path.includes("ech=1") &&
			outbound.tls &&
			outbound.tls.enabled) {

			outbound.tls.ech = {
				"enabled": true,
				"query_server_name": ECH_SNI
			};
		}
	});
	return JSON.stringify(config, null, 2);
}

function zip(...arrays) {
	const length = Math.min(...arrays.map(arr => arr.length));
	return Array.from({ length }, (_, i) => arrays.map(arr => arr[i]));
}
function get_limit_region(url, max_limit = 30) {
	// 限制地区和数量的参数
	const limit = (url.searchParams.get('limit') || "1").split('-');
	const region = (url.searchParams.get('region') || "").split('-');
	return zip(limit, region).map(([a, b]) => [Math.min(parseInt(a, 10), max_limit), b]);
}

function get_limit(url, max_limit = 60) {
	const limit = (url.searchParams.get('limit') || "1").split('-');
	return limit.map(a => Math.min(parseInt(a, 10), max_limit))[0];
}

function parse_new_line(inputText) {
	return inputText
		.split('\n')
		.map(line => line.trim())
		.filter(line => line && !line.startsWith('#'));
}

async function handle_extract(url) {
	// 5秒超时
	let hostnames = await fetch_hostnames(url.searchParams.get('hostnames'));
	console.log(hostnames);
	if (url.searchParams.get('region')) {
		hostnames = hostnames_limit_region(group_hostnames_by_hash(hostnames), get_limit_region(url, 30));
		// 限制最多60条
		hostnames = hostnames_limit(hostnames, 80);
	}
	else {
		// 限制最多60条
		hostnames = hostnames_limit(hostnames, get_limit(url, 80))
	}
	return new Response(JSON.stringify(hostnames, null, 0), { headers: { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store', 'Expires': '0' } });
}

async function handle_v2ray(url, request, base64) {
	let hostnames = await fetch_hostnames(url.searchParams.get('hostnames'));
	// console.log(hostnames);
	if (url.searchParams.get('region')) {
		hostnames = hostnames_limit_region(group_hostnames_by_hash(hostnames), get_limit_region(url, 30));
		// 限制最多60条
		hostnames = hostnames_limit(hostnames, 80);
	}
	else {
		// 限制最多60条
		hostnames = hostnames_limit(hostnames, get_limit(url, 80))
	}
	let nodes;
	try {
		// 5秒超时
		const content = await await cached_fetch_30(...make_url_options(url.searchParams.get('nodes'), { signal: AbortSignal.timeout(5000) }));

		const txt = /[\.:]/.test(content) ? content : atob(content);
		nodes = parse_new_line(txt);
		// console.log(nodes);
		nodes = 更新链接列表(hostnames, nodes)
		nodes = 调整链接列表(nodes).join("\n")
	} catch (e) {
		console.log(e);
		nodes = "vless://00000000-0000-4000-8000-000000000000@127.0.0.1:443?encryption=none&security=none&sni=example.com&fp=random&type=ws&host=example.com&path=%2F#nodes%20empty";
	}
	if (base64) nodes = btoa(nodes);

	const ua = (request.headers.get('User-Agent') || 'ua').toLowerCase();
	// console.log(ua);
	let filename = url.searchParams.get('filename');
	if (filename && ua.includes('v2ray')) {
		filename = decodeURIComponent(filename);
		return new Response(nodes, { headers: { 'Content-Type': 'text/plain; charset=utf-8', 'Cache-Control': 'no-store', 'Expires': '0', 'Content-Disposition': `attachment; filename*=utf-8''${encodeURIComponent(filename)}` } });
	} else {
		return new Response(nodes, { headers: { 'Content-Type': 'text/plain; charset=utf-8', 'Cache-Control': 'no-store', 'Expires': '0' } });
	}
}

async function fetch_hostnames(target_url) {
	if (!target_url) return [];
	if (target_url.startsWith("sub://")) {
		target_url = `${target_url.replace("sub://", "https://")}/sub?host=example.com&uuid=00000000-0000-4000-8000-000000000000`;
	}
	try {
		const content = await cached_fetch_30(...make_url_options(target_url, { signal: AbortSignal.timeout(5000) }));
		const txt = /[\.:]/.test(content) ? content : atob(content);
		return parse_hostname_text(txt);
	} catch (e) {
		console.log(e, target_url);
		// 超时了，还是返回些信息
		return [{ hostname: "127.0.0.1", port: "80", hash: "hostnames empty" }];
	}
}

async function handle_home(url) {
	const _url = url.hostname === '127.0.0.1' ? HOME_LOCAL : HOME_GITHUB;
	try {
		const text = await await cached_fetch_30(...make_url_options(_url, { signal: AbortSignal.timeout(5000) }));
		return new Response(text, { headers: { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-store', 'Expires': '0' } });
	} catch (e) {
		console.log(e, _url);
		return new Response(`${e}<br/>${_url}`, { headers: { status: 500, 'Content-Type': 'text/html; charset=utf-8' } });
	}
}

async function handle_link(url) {
	const _url = url.hostname === '127.0.0.1' ? LINK_LOCAL : LINK_GITHUB;
	try {
		const text = await await cached_fetch_30(...make_url_options(_url, { signal: AbortSignal.timeout(5000) }));
		return new Response(text, { headers: { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-store', 'Expires': '0' } });
	} catch (e) {
		console.log(e, _url);
		return new Response(`${e}<br/>${_url}`, { headers: { status: 500, 'Content-Type': 'text/html; charset=utf-8' } });
	}
}

async function handle_link_api(url, request, env) {
	const auth = await apiKeyAuth(request, env);
	if (!auth.authenticated) {
		return new Response('Unauthorized', {
			status: 401,
			headers: { 'WWW-Authenticate': 'Bearer' }
		});
	}

	const method = request.method;
	if (method === 'GET') {
		const links = await get_links(env, LINKS_MAP);
		LINKS_MAP = links;
		if (!links || links.size === 0) return new Response('No data found', { status: 404 });

		const txt = JSON.stringify(Array.from(links.values()), null, 0);
		return new Response(txt, { headers: { 'Content-Type': 'text/json; charset=utf-8', 'Cache-Control': 'no-store', 'Expires': '0' } });
	}
	if (method === 'POST') {
		const data = await request.json();
		const txt = await set_links(env, data);
		LINKS_MAP = await new Map(data.map(item => [item.pathname, item]));
		return new Response(txt, { headers: { 'Content-Type': 'text/json; charset=utf-8', 'Cache-Control': 'no-store', 'Expires': '0' } });
	}
}

// 重要：注意Map和{}的区别
let LINKS_MAP = null;

async function get_links(env, map) {
	const STORAGE = env.KV;
	if (!STORAGE) return null;

	if (map) return map;

	const data = await STORAGE.get('link.json', { type: 'json' });
	console.log('get links for KV');
	if (!data) return null;

	return new Map(data.map(item => [item.pathname, item]));
}

async function set_links(env, links) {
	const STORAGE = env.KV;
	if (!STORAGE) return "[]";

	if (!links) return "[]";

	if (links instanceof Map) links = Array.from(links.values());

	const txt = JSON.stringify(links, null, 0);

	await STORAGE.put('link.json', txt);
	console.log('put links to KV');
	return txt;
}

async function handle_s(url, request, env) {
	const links = await get_links(env, LINKS_MAP);
	LINKS_MAP = links;
	if (!links || links.size === 0) return new Response('No data found', { status: 404 });

	const pathname = url.pathname;
	const item = links.get(pathname);
	if (!item) return new Response('Link not found', { status: 404 });

	if (request.method === 'GET') {
		if (item.type === 'text') {
			// 直接返回 note 内容
			return new Response(item.note || '', { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
		} else if (item.type === 'redirect') {
			// 307 跳转到 link
			return new Response(null, { status: 307, headers: { 'Location': item.note } });
		} else if (item.type === 'concat') {
			const urls = parse_new_line(item.note);
			const fetchPromises = urls.map(url => fetch(...make_url_options(url, { signal: AbortSignal.timeout(5000) })));

			// 等待所有请求完成，无论成功与否
			const results = await Promise.allSettled(fetchPromises);

			// 处理结果
			const data = [];
			for (const result of results) {
				if (result.status === 'fulfilled') {
					const txt = await result.value.text();
					try {
						data.push(atob(txt)); // 拼接前先解码
					} catch (e) {
						// 请求成功
						data.push(txt);
					}
				} else {
					// 请求失败，可记录日志或放入占位符
					console.error('Fetch failed:', result.reason);
				}
			}
			return new Response(data.join('\n'), { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
		} else {
			return new Response(`Unknown type: ${item.type}`, { status: 400 });
		}
	}

	const auth = await apiKeyAuth(request, env);
	if (!auth.authenticated) {
		return new Response('Unauthorized', {
			status: 401,
			headers: { 'WWW-Authenticate': 'Bearer' }
		});
	}

	if (request.method === 'PUT') {
		// 根据 Content-Type 处理不同格式
		const contentType = request.headers.get('Content-Type') || '';

		if (contentType.includes('application/json')) {
			const text = await request.text();
			console.log('Raw body:', text);
			let updateData;
			try {
				updateData = JSON.parse(text);
				links.set(pathname, {
					...item,
					...updateData // 可以把不喜欢的链接也给换了
				});
			} catch (error) {
				return new Response('Invalid JSON: ' + error, { status: 400 });
			}
		} else if (contentType.includes('text/plain')) {
			// 纯文本格式 - 直接作为 note 内容
			const textContent = await request.text();
			links.set(pathname, {
				...item,
				note: textContent,
			});
		} else {
			return new Response('Unsupported Content-Type', { status: 400 });
		}

		LINKS_MAP = links;
		await set_links(env, LINKS_MAP);

		return new Response(
			JSON.stringify({
				success: true,
				message: 'Updated successfully',
				pathname: url.pathname
			}),
			{
				status: 200,
				headers: { 'Content-Type': 'application/json' }
			}
		);
	}
	// 其他请求方法
	return new Response('Method not allowed', { status: 405 });
}

async function apiKeyAuth(request, env) {
	const authHeader = request.headers.get('Authorization');

	if (!authHeader || !authHeader.startsWith('Bearer ')) {
		return { authenticated: false };
	}

	const apiKey = authHeader.substring(7);
	const validKey = env.API_KEY; // 在wrangler.toml或环境变量中设置

	return {
		authenticated: apiKey === validKey,
		apiKey: apiKey
	};
}

function VlessTrojanAnytlsHysteria2ToClash(vlessUrl, options = {}) {
	try {
		const url = new URL(vlessUrl);
		const params = url.searchParams;
		const protocol = url.protocol.slice(0, -1); // 去掉末尾的 ":"

		// 基础信息提取
		const node = {
			name: decodeURIComponent(url.hash.slice(1)) || `${protocol}-auto`,
			type: protocol,
			server: url.hostname,
			port: parseInt(url.port),
			network: params.get('type') || 'tcp',
			'skip-cert-verify': options.skipCertVerify ?? (params.get('allowInsecure') === '1' || params.get('insecure') === '1'),
		};
		if (node.type === 'vless') {
			node.uuid = url.username;
			node.servername = params.get('sni') || undefined;
			node.tls = ['tls', 'reality'].includes(params.get('security'));
			node['client-fingerprint'] = params.get('fp') || 'chrome';
		}
		if (node.type === 'trojan') {
			node.password = url.username;
			node.sni = params.get('sni') || params.get('host') || undefined;
			node.tls = true; // Trojan 总是启用 TLS
			node['client-fingerprint'] = params.get('fp') || 'chrome';
		}
		if (node.type === 'anytls') {
			node.password = url.username;
		}
		if (node.type === 'hysteria2') {
			node.auth = url.username;
			node.password = url.username;
		}

		// 处理 encryption 字段
		const encryption = params.get('encryption');
		if (encryption && encryption !== 'none') {
			node.encryption = encryption;
		}

		// 1. 处理流控 (Reality/Vision)
		const flow = params.get('flow');
		if (flow) node.flow = flow;

		// 2. 处理传输层协议选项
		const network = node.network;
		if (network === 'ws') {
			node['ws-opts'] = {
				path: params.get('path') || '/',
				headers: {}
			};
			const host = params.get('host');
			if (host) node['ws-opts'].headers.Host = host;
		} else if (network === 'grpc') {
			node['grpc-opts'] = {
				'grpc-service-name': params.get('serviceName') || ''
			};
		} else if (network === 'h2') {
			node['h2-opts'] = {
				host: params.get('host') ? [params.get('host')] : [],
				path: params.get('path') || '/'
			};
		}

		// 3. 处理 ALPN 参数
		const alpn = params.get('alpn');
		if (alpn) {
			node.alpn = alpn.split(','); // 转为数组格式：['h2', 'http/1.1']
		}

		// TODO AI写的，未测
		// 4. 处理分片 (Fragment) 参数
		const fragment = params.get('fragment');
		if (fragment) {
			// 解析 fragment 参数，格式如: "1,40-60,30-50,tlshello" 或 "1-3,100-200,20-30"
			const fragmentParts = fragment.split(',');

			// 确保有足够的参数
			if (fragmentParts.length >= 3) {
				// 解析每个部分
				const packets = fragmentParts[0]; // 分片包范围，如 "1" 或 "1-3"
				const length = fragmentParts[1];  // 分片长度范围，如 "40-60"
				const interval = fragmentParts[2]; // 发送间隔范围，如 "30-50"

				// 构建 fragment 配置对象
				node.smux = {
					enabled: true,
					fragment: {
						packets: packets,
						length: length,
						interval: interval
					}
				};

				// 处理可选的第四个参数（tlshello/packets）
				if (fragmentParts.length >= 4) {
					const option = fragmentParts[3].toLowerCase();
					if (option === 'tlshello' || option === 'tls') {
						// 如果是 TLS 握手包分片
						node.smux.fragment.tls = true;
					} else {
						// 如果是具体的包范围说明，更新 packets
						node.smux.fragment.packets = option;
					}
				}
			}
		}

		// 5. 处理安全层扩展 (Reality / ECH)
		const security = params.get('security');
		if (security === 'reality') {
			node['reality-opts'] = {
				'public-key': params.get('pbk')
			};
			const sid = params.get('sid');
			if (sid) node['reality-opts']['short-id'] = sid;
		}

		// 修复 ECH 处理逻辑
		const echParam = params.get('ech');
		if (echParam) {
			// 解码 URL 编码的参数
			const decodedEch = decodeURIComponent(echParam);

			const [queryServerName, ech_dns = ''] = decodedEch.split(/[\+\s]|%2B/);

			node['ech-opts'] = {
				enable: true,
				"query-server-name": queryServerName,
			};
		}

		return node;

	} catch (error) {
		throw new Error(`Vless/Trojan/Anytls/Hysteria2解析失败: ${error.message} ${vlessUrl}`);
	}
}
function VmessToClash(vmessUrl, options = {}) {
	try {
		const config = JSON.parse(atob(vmessUrl.substring(8)));
		// console.log(config);

		// 2. 基础信息提取
		const node = {
			name: decodeGarbledText(config.ps) || 'vmess-auto',
			type: 'vmess',
			server: config.add || config.host || '127.0.0.1',
			port: parseInt(config.port) || 443,
			uuid: config.id,
			alterId: config.aid || 0,
			cipher: config.scy || 'auto',
			tls: config.tls === 'tls',
			'skip-cert-verify': true
		};

		// 3. 处理传输层协议
		const network = config.net || 'tcp';
		node.network = network;

		// 3.2 WS 配置
		if (network === 'ws') {
			node['ws-opts'] = {
				path: config.path || '/',
				headers: {}
			};

			node['ws-opts'].headers.Host = node.server;
		}

		// 5. 处理流控
		if (config.v === '2') {
			// VMess AEAD
			node.alterId = 0;
		}

		// 6. 处理传输层安全
		if (config.scy) {
			node.cipher = config.scy;
		}

		// 7. 处理 UDP
		if (config.hasOwnProperty('udp')) {
			node.udp = config.udp;
		}

		return node;

	} catch (error) {
		throw new Error(`VMess解析失败: ${error.message} ${vmessUrl}`);
	}
}

function TuicToClash(tuicUrl, options = {}) {
	try {
		const url = new URL(tuicUrl);
		// TODO 目前v2ray默认导出格式不对，需手工处理一下
		if (url.username.includes('%3A')) [url.username, url.password] = url.username.split('%3A');


		const params = url.searchParams;

		// 基础信息提取
		const node = {
			name: decodeURIComponent(url.hash.slice(1)) || 'tuic-auto',
			type: 'tuic',
			server: url.hostname,
			port: parseInt(url.port) || 443,
			uuid: url.username,
			password: url.password,
			'congestion-controller': params.get('congestion_control') || params.get('congestion-control') || 'cubic',
			'udp-relay-mode': params.get('udp_relay_mode') || params.get('udp-relay-mode') || 'native',
			'disable-sni': params.get('disable_sni') === '1' || params.get('disable-sni') === '1' || false,
			'skip-cert-verify': options.skipCertVerify ?? (params.get('allowInsecure') === '1' || params.get('insecure') === '1'),
			'reduce-rtt': params.get('reduce_rtt') === '1' || params.get('reduce-rtt') === '1' || false
		};

		const alpn = params.get('alpn');
		if (alpn) {
			node['alpn'] = alpn.split(',') || ['h3'];
		}

		return node;

	} catch (error) {
		throw new Error(`Tuic解析失败: ${error.message} ${tuicUrl}`);
	}
}

function ShadowsocksToClash(ssUrl, options = {}) {
	try {
		// 解析完整的 Shadowsocks 链接
		const url = new URL(ssUrl);
		const params = url.searchParams;
		console.log(url);

		const [method, password] = atob(url.username).split(':');

		const node = {
			name: decodeURIComponent(url.hash.slice(1)) || 'ss-auto',
			type: 'ss',
			server: url.hostname,
			port: parseInt(url.port) || 80,
			cipher: method,
			password: password,
		};
		console.log(node);

		// 解析插件参数
		const plugin = decodeURIComponent(url.searchParams.get('plugin'));
		console.log(plugin);


		if (plugin) {
			const parts = plugin.split(';');
			node.plugin = parts[0];

			let pluginOpts = { tls: false, 'skip-cert-verify': false };

			parts.slice(1).forEach(part => {
				const eqIndex = part.indexOf('=');
				if (eqIndex > 0) {
					const key = part.substring(0, eqIndex);
					const value = part.substring(eqIndex + 1);
					pluginOpts[key] = decodeURIComponent(value);
				}
			});
			// 如果有额外的参数
			if (pluginOpts.mux !== undefined) {
				pluginOpts.mux = pluginOpts.mux === "1";
			}
			node['plugin-opts'] = pluginOpts;
		}

		return node;

	} catch (error) {
		throw new Error(`Shadowsocks 解析失败: ${error.message} ${ssUrl}`);
	}
}

function ProxyUrlToClash(proxyUrl, options = {}) {
	// TODO 这里只提供了最基础的协议转换，如果需要更多功能请自行扩展
	try {
		const url = new URL(proxyUrl);
		switch (url.protocol) {
			case 'vmess:':
				return VmessToClash(proxyUrl, options);
			case 'vless:':
			case 'trojan:':
			case 'anytls:':
			case 'hysteria2:':
				return VlessTrojanAnytlsHysteria2ToClash(proxyUrl, options);
			case 'tuic:':
				return TuicToClash(proxyUrl, options);
			case 'ss:':
				return ShadowsocksToClash(proxyUrl, options);
			default:
				throw new Error(`不支持的协议: ${url.protocol}`);
		}
	} catch (error) {
		throw new Error(`解析失败: ${error.message}`);
	}
}

async function handle_sub(url, request) {
	const _url = url.searchParams.get('url');
	const target = url.searchParams.get('target');
	const scv = (url.searchParams.get('scv') || "true").toLowerCase() === 'true';
	const ua = (request.headers.get('User-Agent') || 'ua').toLowerCase();
	// console.log(ua);
	let filename = url.searchParams.get('filename');
	try {
		const content = await cached_fetch_30(...make_url_options(_url, { signal: AbortSignal.timeout(5000) }));
		const txt = content.includes('.') ? content : atob(content);
		const clash = ClashObj(parse_new_line(txt).map(line => ProxyUrlToClash(line, { skipCertVerify: scv })));
		const yaml = SimpleYAML.stringify(clash);
		if (filename && (ua.includes('clash') || ua.includes('mihomo'))) {
			filename = decodeURIComponent(filename);
			return new Response(yaml, { headers: { 'Content-Type': 'text/yaml; charset=utf-8', 'Cache-Control': 'no-store', 'Expires': '0', 'Content-Disposition': `attachment; filename*=utf-8''${encodeURIComponent(filename)}` } });
		} else {
			return new Response(yaml, { headers: { 'Content-Type': 'text/yaml; charset=utf-8', 'Cache-Control': 'no-store', 'Expires': '0' } });
		}
	}
	catch (error) {
		console.log(error);
		return new Response(error, { headers: { status: 500 } });
	}
}

function deduplicateProxyNamesConcise(proxies) {
	if (!Array.isArray(proxies)) {
		return [];
	}

	const nameMap = new Map(); // 存储每个名字出现的次数
	const result = [];

	proxies.forEach(proxy => {
		if (!proxy) {
			result.push(proxy);
			return;
		}

		const newProxy = { ...proxy };

		if (!newProxy.name) {
			result.push(newProxy);
			return;
		}

		const originalName = newProxy.name;

		if (!nameMap.has(originalName)) {
			// 第一次出现，直接使用
			nameMap.set(originalName, 1);
			result.push(newProxy);
		} else {
			// 已经出现过，需要添加后缀
			const count = nameMap.get(originalName) + 1;
			nameMap.set(originalName, count);

			newProxy.name = `${originalName} ${count}`;
			result.push(newProxy);

			// 也记录新生成的名字
			nameMap.set(newProxy.name, 1);
		}
	});

	return result;
}

function ClashObj(proxies) {
	const clash = {
		port: 7890,
		"socks-port": 7891,
		"allow-lan": true,
		mode: "rule",
		"log-level": "info",
		"unified-delay": true,
		"global-client-fingerprint": "firefox",
		"external-controller": "127.0.0.1:9090",
		// TODO DNS是否合适未测试
		dns: {
			enable: true,
			ipv6: true,
			"enhanced-mode": 'fake-ip',
			"fake-ip-range": "198.18.0.1/16",
			"fake-ip-filter": [
				"geosite:connectivity-check",
				"geosite:private",
				"localhost.ptlogin2.qq.com",
			],
			"default-nameserver": [
				"223.5.5.5",
				"114.114.114.114",
				"8.8.8.8",
			],
			"nameserver": [
				"https://doh.pub/dns-query",
				"https://dns.alidns.com/dns-query",
			],
			"fallback": [
				"tls://1.1.1.1",
				"tls://dns.google",
			],
			"fallback-filter": {
				geoip: true,
				'geoip-code': 'CN',
				ipcidr: [
					"240.0.0.0/4",
					"0.0.0.0/32",
				],
				domain: [
					'+.google.com',
					'+.facebook.com',
					'+.youtube.com',
				]
			},
			"nameserver-policy": {
				[ECH_SNI]: ECH_DNS,
			},
		},
		proxies: [],
		"proxy-groups": [
			{
				name: "🚀 节点选择",
				type: "select",
				proxies: ["♻️ 自动选择", "☑️ 手动切换", "DIRECT"]
			},
			{
				name: "♻️ 自动选择",
				type: "url-test",
				url: "https://www.google.com/generate_204",
				interval: 300,
				tolerance: 50,
				proxies: []
			},
			{
				name: "☑️ 手动切换",
				type: "select",
				proxies: []
			},
			{
				name: "🐟 漏网之鱼",
				type: "select",
				proxies: ["🚀 节点选择", "♻️ 自动选择", "DIRECT"]
			}
		],
		rules: [
			"GEOSITE,private,DIRECT",
			"GEOSITE,category-ads-all,REJECT",
			"GEOSITE,cn,DIRECT",
			"GEOSITE,microsoft@cn,DIRECT",
			"GEOSITE,apple-cn,DIRECT",
			"GEOSITE,google-cn,DIRECT",
			"GEOSITE,steam@cn,DIRECT",
			"GEOSITE,category-games@cn,DIRECT",
			"GEOSITE,gfw,🚀 节点选择",
			"GEOIP,telegram,🚀 节点选择",
			"GEOIP,private,DIRECT",
			"GEOIP,CN,DIRECT",
			"MATCH,🐟 漏网之鱼"
		]
	}

	proxies = deduplicateProxyNamesConcise(proxies);
	proxies.map(p => { clash.dns["nameserver-policy"][p.servername || p.sni || p.server] = ECH_DNS })

	clash.proxies.push(...proxies);
	const names = proxies.map(proxy => proxy.name);
	clash["proxy-groups"][1].proxies.push(...names);
	clash["proxy-groups"][2].proxies.push(...names);

	return clash;
}

export default {
	async fetch(request, env, ctx) {
		const url = new URL(request.url);

		if (url.pathname.startsWith('/s/')) {
			return await handle_s(url, request, env);
		}

		switch (url.pathname) {
			case '/fetch':
				return await handle_fetch(url);
			case '/extract':
				return await handle_extract(url);
			case '/v2ray':
				return await handle_v2ray(url, request, false);
			case '/base64':
				return await handle_v2ray(url, request, true);
			case '/home':
				return await handle_home(url);
			case '/link':
				return await handle_link(url);
			case '/link/api':
				return await handle_link_api(url, request, env);
			case '/sub':
				return await handle_sub(url, request);
			default:
				return new Response('Hello World!');
		}
	},
};