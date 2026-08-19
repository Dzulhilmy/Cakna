#!/usr/bin/env bash
#
# READ-ONLY inventory of the cakna.org server. Changes nothing, starts nothing,
# stops nothing — every command below only reads state. Run it on the server and
# send back the output so the deployment plan can be exact.
#
#   scp deploy/cakna-org/discover-server.sh ubuntu@56.69.195.145:~/
#   ssh ubuntu@56.69.195.145 'bash ~/discover-server.sh' | tee server-inventory.txt
#
# Nothing here prints secrets: .env files are reported by KEY NAME only, never
# values, and no database contents are read.
set -uo pipefail

hr() { printf '\n===== %s =====\n' "$1"; }
have() { command -v "$1" >/dev/null 2>&1; }

hr "host"
hostname; uname -a; echo; uptime
echo "public IP (as the host sees it): $(curl -s --max-time 5 ifconfig.me 2>/dev/null || echo '?')"

hr "who is listening on 80 / 443 / 7880 / 5432"
if have ss; then sudo ss -tulpn 2>/dev/null | grep -E ':(80|443|7880|7881|3478|5432|8080)\b' || echo "(none matched)"
else sudo netstat -tulpn 2>/dev/null | grep -E ':(80|443|7880|7881|3478|5432|8080)\b' || echo "(netstat/ss unavailable)"; fi

hr "caddy"
have caddy && caddy version || echo "(no caddy binary on PATH)"
systemctl is-active caddy 2>/dev/null && echo "caddy service: active" || echo "caddy service: not active/not a service"
for f in /etc/caddy/Caddyfile /etc/caddy/conf.d/* ~/Caddyfile; do
  [ -f "$f" ] && { echo "--- $f ---"; sudo cat "$f" 2>/dev/null || cat "$f"; }
done

hr "docker"
# NOTE: the login user is usually not in the `docker` group, so these need sudo —
# without it every listing silently comes back empty.
D="docker"; docker ps >/dev/null 2>&1 || D="sudo docker"
have docker && docker --version || echo "(no docker)"
echo "(using: $D)"
echo "--- running containers ---"
$D ps --format '{{.Names}}\t{{.Image}}\t{{.Ports}}\t{{.Status}}' 2>&1 | head -30
echo "--- all containers ---"
$D ps -a --format '{{.Names}}\t{{.Image}}\t{{.Status}}' 2>&1 | head -30
echo "--- compose projects ---"
$D compose ls 2>&1 | head
echo "--- volumes ---"
$D volume ls 2>&1 | head -20
echo "--- images ---"
$D images --format '{{.Repository}}:{{.Tag}}\t{{.Size}}' 2>&1 | head -20
echo "--- docker disk usage ---"
$D system df 2>&1 | head -12
echo "--- caddy container config (if any) ---"
for c in $($D ps --format '{{.Names}}' 2>/dev/null | grep -i caddy); do
  echo "### $c ###"
  $D exec "$c" cat /etc/caddy/Caddyfile 2>&1 | head -60
done

hr "how the legacy app runs"
systemctl list-units --type=service --state=running 2>/dev/null | grep -Ei 'cakna|node|express|pm2' || echo "(no matching systemd service)"
have pm2 && pm2 list 2>/dev/null || echo "(no pm2)"

hr "postgres"
have psql && psql --version || echo "(no psql client)"
systemctl is-active postgresql 2>/dev/null && echo "postgresql service: active" || echo "postgresql service: not active (may be in docker)"
sudo -u postgres psql -Atc "SELECT datname FROM pg_database WHERE datname NOT IN ('template0','template1')" 2>/dev/null \
  || echo "(cannot list host databases — likely dockerised or different auth)"

hr "app directories"
for d in ~/cakna-app ~/cakna ~/app /srv/cakna /var/www/cakna; do
  [ -d "$d" ] && { echo "--- $d ---"; ls -la "$d" | head -25; }
done

hr "env files present (KEY NAMES ONLY — no values)"
for f in ~/cakna/deploy/.env ~/cakna/.env ~/cakna-app/deploy/.env ~/cakna-app/.env /srv/cakna/.env; do
  [ -f "$f" ] && { echo "--- $f ---"; sed -E 's/=.*/=<redacted>/' "$f" | grep -E '^[A-Z_]+=' ; }
done

hr "legacy compose / deploy dir"
for d in ~/cakna/deploy ~/cakna-app/deploy; do
  [ -d "$d" ] && { echo "--- $d ---"; ls -la "$d";
    for y in "$d"/*.yml "$d"/*.yaml "$d"/Caddyfile; do
      [ -f "$y" ] && { echo "### $y ###"; sed -E 's/(PASSWORD|SECRET|KEY)=.*/\1=<redacted>/' "$y" | head -60; }
    done; }
done

hr "disk + memory (LiveKit needs headroom)"
df -h / | tail -2; echo; free -h 2>/dev/null || vm_stat 2>/dev/null | head -5
echo "--- biggest consumers of / ---"
sudo du -xh --max-depth=2 / 2>/dev/null | sort -h | tail -20

hr "firewall (local)"
sudo ufw status 2>/dev/null || echo "(no ufw)"
sudo iptables -S 2>/dev/null | head -20 || echo "(cannot read iptables)"

hr "DONE"
echo "Send this output back. It contains no secrets or database contents."
