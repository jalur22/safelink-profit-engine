(() => {
  "use strict";
  const STORAGE_KEY = "safelinkProfitEngine.links.v1";
  const $ = (id) => document.getElementById(id);
  const form = $("linkForm");
  let links = loadLinks();
  let latestUtm = "";

  function loadLinks() {
    try {
      const value = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
      return Array.isArray(value) ? value : [];
    } catch { return []; }
  }
  function saveLinks() {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(links)); }
    catch { notify("Penyimpanan browser penuh atau tidak tersedia."); }
  }
  function notify(message) {
    const toast = $("toast");
    toast.textContent = message;
    toast.classList.add("show");
    window.clearTimeout(notify.timer);
    notify.timer = window.setTimeout(() => toast.classList.remove("show"), 2400);
  }
  function safeUrl(raw) {
    try {
      const url = new URL(raw);
      return ["http:", "https:"].includes(url.protocol) ? url.href : "";
    } catch { return ""; }
  }
  function escapeHtml(value) {
    return String(value ?? "").replace(/[&<>"']/g, char => ({
      "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"
    })[char]);
  }
  function resetForm() {
    form.reset();
    $("editId").value = "";
    $("saveButton").textContent = "Simpan tautan";
    $("cancelEdit").classList.add("hidden");
  }
  function render() {
    const query = $("searchInput").value.trim().toLowerCase();
    const category = $("categoryFilter").value;
    const categories = [...new Set(links.map(item => item.category).filter(Boolean))].sort((a,b)=>a.localeCompare(b));
    const current = $("categoryFilter").value;
    $("categoryFilter").innerHTML = '<option value="">Semua kategori</option>' +
      categories.map(item => `<option value="${escapeHtml(item)}">${escapeHtml(item)}</option>`).join("");
    if (categories.includes(current)) $("categoryFilter").value = current;
    const filtered = links.filter(item => {
      const text = [item.name,item.url,item.category,item.notes].join(" ").toLowerCase();
      return text.includes(query) && (!category || item.category === category);
    });
    $("totalLinks").textContent = links.length;
    $("totalCategories").textContent = categories.length;
    $("shownLinks").textContent = filtered.length;
    $("linksList").innerHTML = filtered.map(item => `
      <article class="link-card">
        <div class="link-symbol">↗</div>
        <div class="link-info">
          <strong>${escapeHtml(item.name)}</strong>
          <a href="${escapeHtml(item.url)}" target="_blank" rel="noopener noreferrer">${escapeHtml(item.url)}</a>
          <div class="link-meta">${escapeHtml(item.category || "Tanpa kategori")}${item.notes ? " · " + escapeHtml(item.notes) : ""}</div>
        </div>
        <div class="link-actions">
          <button class="mini-btn" data-action="copy" data-id="${item.id}">Salin</button>
          <button class="mini-btn" data-action="edit" data-id="${item.id}">Edit</button>
          <button class="mini-btn delete" data-action="delete" data-id="${item.id}">Hapus</button>
        </div>
      </article>`).join("");
    $("emptyState").classList.toggle("hidden", filtered.length > 0);
  }
  form.addEventListener("submit", event => {
    event.preventDefault();
    const name = $("linkName").value.trim();
    const url = safeUrl($("linkUrl").value.trim());
    if (!name || !url) return notify("Isi nama dan URL http/https yang valid.");
    const id = $("editId").value;
    const record = {
      id: id || (Date.now().toString(36) + Math.random().toString(36).slice(2,7)),
      name, url, category: $("linkCategory").value.trim(),
      notes: $("linkNotes").value.trim()
    };
    if (id) {
      links = links.map(item => item.id === id ? record : item);
      notify("Tautan berhasil diperbarui.");
    } else {
      links.unshift(record);
      notify("Tautan berhasil disimpan.");
    }
    saveLinks(); resetForm(); render();
  });
  $("cancelEdit").addEventListener("click", resetForm);
  $("searchInput").addEventListener("input", render);
  $("categoryFilter").addEventListener("change", render);
  $("linksList").addEventListener("click", async event => {
    const button = event.target.closest("button[data-action]");
    if (!button) return;
    const item = links.find(link => link.id === button.dataset.id);
    if (!item) return;
    if (button.dataset.action === "copy") {
      try { await navigator.clipboard.writeText(item.url); notify("URL disalin."); }
      catch { notify("Tidak dapat menyalin otomatis. Buka tautan lalu salin URL."); }
    }
    if (button.dataset.action === "edit") {
      $("editId").value = item.id;
      $("linkName").value = item.name;
      $("linkUrl").value = item.url;
      $("linkCategory").value = item.category;
      $("linkNotes").value = item.notes;
      $("saveButton").textContent = "Simpan perubahan";
      $("cancelEdit").classList.remove("hidden");
      $("linkName").focus();
      window.scrollTo({top:0,behavior:"smooth"});
    }
    if (button.dataset.action === "delete" && window.confirm(`Hapus tautan "${item.name}"?`)) {
      links = links.filter(link => link.id !== item.id);
      saveLinks(); render(); notify("Tautan dihapus.");
    }
  });
  $("exportCsv").addEventListener("click", () => {
    if (!links.length) return notify("Belum ada data untuk diekspor.");
    const rows = [["Nama","URL","Kategori","Catatan"], ...links.map(x => [x.name,x.url,x.category,x.notes])];
    const csv = "\uFEFF" + rows.map(row => row.map(value => `"${String(value).replace(/"/g,'""')}"`).join(",")).join("\r\n");
    const blob = new Blob([csv], {type:"text/csv;charset=utf-8"});
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = "safelink-profit-engine.csv"; a.click();
    URL.revokeObjectURL(url); notify("File CSV disiapkan.");
  });
  $("buildUtm").addEventListener("click", () => {
    const base = safeUrl($("utmBase").value.trim());
    if (!base) return notify("Masukkan URL dasar yang valid.");
    const url = new URL(base);
    [["utm_source","utmSource"],["utm_medium","utmMedium"],["utm_campaign","utmCampaign"]].forEach(([key,id]) => {
      const value = $(id).value.trim();
      if (value) url.searchParams.set(key,value);
    });
    latestUtm = url.href;
    $("utmOutput").textContent = latestUtm;
    $("copyUtm").disabled = false;
  });
  $("copyUtm").addEventListener("click", async () => {
    if (!latestUtm) return;
    try { await navigator.clipboard.writeText(latestUtm); notify("URL kampanye disalin."); }
    catch { notify("Salin URL yang tampil secara manual."); }
  });
  render();
})();
