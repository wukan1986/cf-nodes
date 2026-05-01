// TODO 在v2rayN上测试，支持xray，不支持singbox
import { connect } from 'cloudflare:sockets';
const uuid = '12345678-1234-1234-1234-123456789012';
const _UUID = uuidToArray(uuid);

export default {
    async fetch(request, env, ctx) {
        if (request.headers.get('Upgrade') === 'websocket') return await handleWebSocket(request);
        return new Response(`VLESS Worker is running\n\nUsage: Connect with VLESS client using WebSocket transport`);
    }
};

function closeSocketQuietly(socket) { try { if (socket.readyState === WebSocket.OPEN || socket.readyState === WebSocket.CLOSING) socket.close(); } catch { } }
async function SocketWrite(socket, data) {
    try {
        if (socket && socket.writable) {
            const w = socket.writable.getWriter();
            await w.write(data);
            w.releaseLock();
        }
    } catch (err) {
        console.error('SocketWrite error:', err);
    }
}

function uuidToArray(uuid) { return uuid.replace(/-/g, '').match(/.{1,2}/g).map(byte => parseInt(byte, 16)); }

function check_uuid(uuid_Array, uuid_ArrayBuffer) {
    const bytes1 = new Uint8Array(uuid_Array);
    const bytes2 = new Uint8Array(uuid_ArrayBuffer);
    for (let i = 0; i < bytes2.length; i++) {
        if (bytes1[i] !== bytes2[i]) return false;
    }
    return true;
}

async function handleWebSocket(request) {
    const [client, ws] = Object.values(new WebSocketPair());
    ws.accept();
    ws.binaryType = 'arraybuffer';

    let remote = null, udpWriter = null, isDNS = false, cancelled = false;

    new ReadableStream({
        start(ctrl) {
            ws.addEventListener('message', (e) => ctrl.enqueue(e.data));
            ws.addEventListener('close', () => { if (!cancelled) { closeSocketQuietly(ws); ctrl.close(); } });
            ws.addEventListener('error', (err) => ctrl.error(err));

            const early = request.headers.get('sec-websocket-protocol');
            if (early) { try { ctrl.enqueue(Uint8Array.fromBase64(early, { alphabet: 'base64url' })); } catch { } }
        },
        cancel() { cancelled = true; closeSocketQuietly(ws); }
    }).pipeTo(new WritableStream({
        async write(data) {
            if (isDNS) return udpWriter?.write(data);
            if (remote) return await SocketWrite(remote, data);
            if (data.byteLength < 24) return;
            if (!check_uuid(_UUID, data.slice(1, 17))) { ws.close(1008, "UUID authentication failed"); return; }

            const view = new DataView(data);
            const version = view.getUint8(0);
            const optLen = view.getUint8(17);
            let pos = 18 + optLen;
            const cmd = view.getUint8(pos);
            const port = view.getUint16(pos + 1);
            const type = view.getUint8(pos + 3);
            pos += 4;

            let hostname = '';
            if (type === 1) {
                hostname = [...data.slice(pos, pos + 4)].join('.');
                pos += 4;
            } else if (type === 2) {
                const len = view.getUint8(pos++);
                hostname = new TextDecoder().decode(data.slice(pos, pos + len));
                pos += len;
            } else if (type === 3) {
                const ipv6 = [];
                for (let i = 0; i < 8; i++, pos += 2) ipv6.push(view.getUint16(pos).toString(16));
                hostname = ipv6.join(':');
            } else return;
            console.log(`cmd:${cmd}, type:${type} -> ${hostname}:${port}`);

            const header = new Uint8Array([version, 0]);
            const payload = data.slice(pos);
            ws.send(header); // 非常重要

            // TODO UDP DNS 未测试
            if (cmd === 2) {
                if (port !== 53) return;
                isDNS = true;
                console.log('UDP DNS');
                let sent = false;
                const {
                    readable,
                    writable
                } = new TransformStream({
                    transform(chunk, ctrl) {
                        for (let i = 0; i < chunk.byteLength;) {
                            const len = new DataView(chunk.slice(i, i + 2)).getUint16(0);
                            ctrl.enqueue(chunk.slice(i + 2, i + 2 + len));
                            i += 2 + len;
                        }
                    }
                });

                readable.pipeTo(new WritableStream({
                    async write(query) {
                        try {
                            const resp = await fetch('https://1.1.1.1/dns-query', {
                                method: 'POST',
                                headers: {
                                    'content-type': 'application/dns-message'
                                },
                                body: query
                            });
                            if (ws.readyState === 1) {
                                const result = new Uint8Array(await resp
                                    .arrayBuffer());
                                ws.send(new Uint8Array([...(sent ? [] : header),
                                result.length >> 8, result.length &
                                0xff, ...result
                                ]));
                                sent = true;
                            }
                        } catch { }
                    }
                }));
                udpWriter = writable.getWriter();
                return udpWriter.write(payload);
            } else {
                // TCP连接
                let sock = null;
                try {
                    sock = connect({ hostname, port });
                    await sock.opened;
                } catch {
                    // TODO 这里加反代
                    await sock.opened;
                }
                if (!sock) return;
                remote = sock;
                await SocketWrite(sock, payload);

                sock.readable.pipeTo(new WritableStream({
                    write(chunk) { if (ws.readyState === WebSocket.OPEN) { ws.send(chunk); } },
                    close: () => { closeSocketQuietly(ws); },
                    abort: () => { closeSocketQuietly(ws); },
                })).catch(() => { });
            }
        },
    })).catch(() => { });

    return new Response(null, { status: 101, webSocket: client });
}