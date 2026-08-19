# Deploying halaqah audio (LiveKit)

Everything in this directory is configured and ready; **nothing has been deployed.**
Three things still need a human: DNS records, AWS security-group rules, and the
credentials in `deploy/.env`.

Without those, the app still runs — `livekit_configured` reports false and the
halaqah page says the voice server is not set up. It degrades honestly rather
than breaking.

---

## Why audio needs more than a container

Signalling (who is in the room, who holds the mic) is a WebSocket and goes
through Caddy like any HTTP traffic. **Media does not.** Audio travels directly
between each browser and the server over UDP, or over TCP where UDP is blocked,
or through a TURN relay where neither works.

That means three separate paths must be reachable, and the usual "open 80 and
443" is not enough.

```
browser ──wss:443──► Caddy ──► LiveKit :7880        signalling
browser ──UDP 50000-50200────► LiveKit              media, preferred
browser ──TCP 7881───────────► LiveKit              media, when UDP blocked
browser ──UDP 3478───────────► LiveKit TURN         media, restrictive networks
```

---

## 1. DNS

Two records, both pointing at the server's public IP:

```
cakna.qcxis.com        A    <SERVER_IP>
live.cakna.qcxis.com   A    <SERVER_IP>
```

LiveKit needs its own hostname because the browser must reach it over `wss://`,
and Caddy issues a certificate per hostname.

## 2. AWS security group

Add these inbound rules. **This is the step most likely to be missed**, and its
symptom is the confusing one: the room connects, everyone appears in the
participant list, and nobody can hear anybody.

| Type | Protocol | Port range | Source | Why |
|---|---|---|---|---|
| HTTPS | TCP | 443 | 0.0.0.0/0 | app + LiveKit signalling |
| HTTP | TCP | 80 | 0.0.0.0/0 | Let's Encrypt challenge |
| Custom | **UDP** | **50000–50200** | 0.0.0.0/0 | WebRTC media — the main path |
| Custom | TCP | 7881 | 0.0.0.0/0 | media fallback where UDP is blocked |
| Custom | **UDP** | **3478** | 0.0.0.0/0 | TURN — allocation requests |
| Custom | **UDP** | **30000–30200** | 0.0.0.0/0 | TURN — the relayed media itself |

The last row is easy to miss and was only caught by reading LiveKit's own boot
log (`turn.relay_range_start`). TURN allocates a *separate* port to relay each
stream; without that range open it accepts the request and then has nowhere to
send the audio — so the users who most need TURN still cannot be heard.

Leave 7880 closed to the internet — Caddy proxies it, and exposing it directly
would bypass TLS.

## 3. Credentials

```bash
cd ~/cakna-app/deploy
cp .env.example .env      # if it does not exist yet
openssl rand -hex 16      # -> LIVEKIT_API_KEY
openssl rand -hex 32      # -> LIVEKIT_API_SECRET
```

Fill in `LIVEKIT_API_KEY`, `LIVEKIT_API_SECRET`, `LIVEKIT_DOMAIN`, and
`LIVEKIT_URL` (the `wss://` one). `LIVEKIT_URL` is handed to the browser, so it
must be the public address — an internal service name here fails at the first
join.

## 4. Deploy

```bash
cd ~/cakna-app && docker compose -f deploy/docker-compose.prod.yml --env-file deploy/.env up -d --build
```

---

## Verifying

Work outward: signalling, then media, then a real call.

```bash
# 1. LiveKit is up and Caddy has a certificate for it
curl -sI https://live.cakna.qcxis.com | head -1

# 2. It discovered the PUBLIC ip, not a private one. This is the line that
#    decides whether cross-device audio can work at all.
docker compose -f deploy/docker-compose.prod.yml logs livekit | grep -i "nodeIP"

# 3. The app knows about it
curl -s https://cakna.qcxis.com/api/halaqah/rooms | grep livekit_configured
```

`nodeIP` must be the server's public address. If it shows `127.0.0.1` or a
`172.x` / `10.x` address, `use_external_ip` did not resolve and **no two devices
will hear each other**.

Validation may warn even when the result is fine. Running this config locally
produced:

```
INFO  found external IP via STUN     {"externalIP": "203.0.113.10", "validateExternalIP": true}
WARN  could not validate external IP {"ip": "203.0.113.10", ...}
INFO  no external IPs found, using node IP for NAT1To1Ips  {"ip": {"V4":"203.0.113.10"}}
INFO  starting LiveKit server        {"nodeIP": "203.0.113.10"}
```

The warning looks alarming but LiveKit still adopted the STUN-discovered public
address — `nodeIP` is correct, so this is survivable. **Read `nodeIP`, not the
warning.** Only a private `nodeIP` is fatal.

If `nodeIP` does come back private, the cause is almost always the UDP range not
being open yet (step 2). Fix that first. If it persists — some networks never
let the validation packet back in — set the address explicitly in
`livekit.yaml`, which is the more deterministic option for a server with a
static or Elastic IP:

```yaml
rtc:
  external_ip: 203.0.113.10
```

Then the real test, which no amount of config inspection substitutes for: **two
people, two devices, two different networks** — ideally one on mobile data. Have
the host give the microphone to the other and confirm they are audible.

---

## Hardening (optional)

**TURN over TLS.** Port 3478 is plain UDP; a few networks allow only TLS. To
cover them, uncomment the `tls_port` block in `livekit.yaml`, mount a
certificate, and open TCP 5349. Caddy already holds a certificate for
`live.cakna.qcxis.com` under its `caddy_data` volume.

**Narrower UDP range.** 200 ports is generous for a study circle. Shrinking it
is fine; each concurrent participant needs roughly one.

---

## Known limitations

**The same account on two devices kicks itself out.** LiveKit identifies
participants by our user id, so a second connection with the same identity is
disconnected as `DUPLICATE_IDENTITY`. Someone joining from a phone while their
laptop is still in the room will drop the laptop. The fix is a per-session
identity suffix, which also means the mic-handover code must resolve all
connections belonging to one user.

**A page reload drops the call.** The session lives in memory; there is no
WebRTC connection to inherit after a reload. A "rejoin?" prompt would cover it.

**Audio has not been heard end to end.** The permission model, floor handover,
page sync and visualiser are all verified, and audio data is confirmed reaching
Web Audio — but the test browser blocks microphone access, so capture → publish
→ hear has never run. Treat the first two-device call as a genuine test, not a
formality.

**Single node.** One LiveKit instance, no Redis. Fine for a study circle; a
second instance would need Redis to share room state.
