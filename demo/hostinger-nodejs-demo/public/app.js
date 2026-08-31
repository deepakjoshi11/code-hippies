fetch("/api/health")
  .then((r) => r.json())
  .then((d) => {
    document.getElementById("s-status").textContent = d.status;
    document.getElementById("s-node").textContent = d.node;
    document.getElementById("s-uptime").textContent = d.uptimeSeconds + "s";
  })
  .catch(() => {
    document.getElementById("s-status").textContent = "unreachable";
  });
